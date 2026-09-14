package com.ecommerce.walletorder.service;

import com.ecommerce.walletorder.dto.*;
import com.ecommerce.walletorder.entity.*;
import com.ecommerce.walletorder.enums.OrderStatus;
import com.ecommerce.walletorder.exception.InsufficientStockException;
import com.ecommerce.walletorder.exception.ResourceNotFoundException;
import com.ecommerce.walletorder.repository.OrderRepository;
import com.ecommerce.walletorder.repository.ProductRepository;
import com.ecommerce.walletorder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ==============================================================================
 * OrderService - E-Commerce Order Lifecycle & Checkout Pipeline
 * ==============================================================================
 * 
 * 💡 The Core Production Secret (@Transactional Atomic Checkout):
 * 
 * Ek real-world order me 4 steps hote hain:
 * 1. Inventory/Stock check karna
 * 2. Total amount calculate karna
 * 3. Wallet se payment deduct karna
 * 4. Product stock ghata kar Order save karna
 * 
 * Agar step 3 me pata chale ki wallet me paise kam hain,
 * to step 4 execute nahi hona chahiye aur step 1 ka stock block nahi rehna chahiye!
 * 
 * @Transactional(rollbackFor = Exception.class) ensure karta hai ki
 * ya to ye charo steps 100% complete honge (COMMIT),
 * ya fir ek bhi failure aane par sab kuch original state me wapis aa jayega (ROLLBACK)!
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;

    /**
     * Complete Atomic Checkout Flow
     */
    @Transactional(rollbackFor = Exception.class)
    public OrderResponseDTO createOrder(OrderCreateRequest request) {
        log.info("Processing order checkout for userId={}", request.getUserId());

        // 1. User verify karo
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        // Unique order number generate karo (e.g. ORD-17123-A98B)
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 2. Har item ki inventory check karo aur price calculate karo
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemReq.getProductId()));

            // Stock validation
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        "Not enough stock for '" + product.getName() + "'. Available: " + product.getStockQuantity() + ", Requested: " + itemReq.getQuantity()
                );
            }

            // Subtotal = Unit Price * Quantity
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);

            // Stock kam karo (Inventory reservation)
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Item snapshot create karo
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();

            orderItems.add(orderItem);
        }

        // 3. Wallet se payment deduct karo
        // (Agar balance insufficient hua to ye method InsufficientBalanceException throw karega
        // aur @Transactional ki wajah se upar ghata hua product stock auto-rollback ho jayega!)
        walletService.deductFundsForOrder(user.getId(), totalAmount, orderNumber);

        // 4. Order object create aur save karo
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .totalAmount(totalAmount)
                .status(OrderStatus.CONFIRMED)
                .shippingAddress(request.getShippingAddress())
                .build();

        for (OrderItem item : orderItems) {
            order.addItem(item);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Order placed successfully! OrderNumber={}, Total=₹{}", orderNumber, totalAmount);

        return mapToDTO(savedOrder);
    }

    /**
     * Order Cancellation & Instant Wallet Refund Pipeline
     */
    @Transactional(rollbackFor = Exception.class)
    public OrderResponseDTO cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled!");
        }

        // 1. Products ka stock wapas restore karo (Inventory restock)
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        // 2. Wallet me pura paisa wapas refund karo
        walletService.refundFundsForOrder(order.getUser().getId(), order.getTotalAmount(), order.getOrderNumber());

        // 3. Status CANCELLED mark karo
        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);

        log.info("Order cancelled and refunded successfully: OrderNumber={}", order.getOrderNumber());
        return mapToDTO(updatedOrder);
    }

    /**
     * User ke sare orders list karna
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Sare orders fetch karna (Admin view)
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Order Entity ko DTO me convert karne ka method
     */
    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderItemResponseDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }
}

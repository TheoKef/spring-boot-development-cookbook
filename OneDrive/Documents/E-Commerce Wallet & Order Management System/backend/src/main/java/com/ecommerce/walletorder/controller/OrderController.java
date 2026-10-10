package com.ecommerce.walletorder.controller;

import com.ecommerce.walletorder.dto.ApiResponse;
import com.ecommerce.walletorder.dto.OrderCreateRequest;
import com.ecommerce.walletorder.dto.OrderResponseDTO;
import com.ecommerce.walletorder.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==============================================================================
 * OrderController - E-Commerce Order Management & Checkout REST APIs
 * ==============================================================================
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders & Checkout", description = "APIs for cart checkout, atomic wallet payments, order cancellation and refunds")
public class OrderController {

    private final OrderService orderService;

    /**
     * Endpoint: POST /api/orders/checkout
     * Description: Cart items ka order place karna, stock decrement aur wallet deduction
     */
    @PostMapping("/checkout")
    @Operation(summary = "Checkout order with wallet", description = "Validates stock, deducts funds from wallet atomically, and creates confirmed order")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> checkout(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponseDTO order = orderService.createOrder(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully! Amount deducted from your wallet.", order));
    }

    /**
     * Endpoint: POST /api/orders/{orderId}/cancel
     * Description: Order cancel karna aur turant wallet me paisa refund karna
     */
    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel order and refund to wallet", description = "Cancels a confirmed order, restores inventory stock, and refunds total amount back to user's wallet")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(@PathVariable Long orderId) {
        OrderResponseDTO cancelledOrder = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(
                ApiResponse.success("Order #" + cancelledOrder.getOrderNumber() + " cancelled. Full refund credited to your wallet!", cancelledOrder)
        );
    }

    /**
     * Endpoint: GET /api/orders/user/{userId}
     * Description: User ke sare placed orders fetch karna
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user order history", description = "Returns all past and current orders for a specific user")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders(@PathVariable Long userId) {
        List<OrderResponseDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(ApiResponse.success("User orders retrieved", orders));
    }

    /**
     * Endpoint: GET /api/orders
     * Description: Sare orders fetch karna (Admin view)
     */
    @GetMapping
    @Operation(summary = "Get all system orders", description = "Returns complete order list across all users")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAllOrders() {
        List<OrderResponseDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved", orders));
    }
}

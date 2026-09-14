package com.ecommerce.walletorder.dto;

import com.ecommerce.walletorder.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ==============================================================================
 * OrderResponseDTO - Complete Order Data for Frontend
 * ==============================================================================
 * 
 * Production Rule: Never send circular references (Order -> OrderItem -> Order).
 * DTOs completely eliminate infinite JSON recursion bugs and protect internal DB schema.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long orderId;
    private String orderNumber;
    private Long userId;
    private String userName;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> items;
}

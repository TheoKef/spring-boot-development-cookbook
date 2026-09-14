package com.ecommerce.walletorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ==============================================================================
 * OrderCreateRequest DTO - Checkout payload from Frontend
 * ==============================================================================
 * 
 * 💡 @Valid on Nested List:
 * items ke upar @Valid lagane se Spring Boot List ke andar ke har OrderItemRequest
 * ke annotations (@NotNull, @Min) ko bhi deeply validate karta hai.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}

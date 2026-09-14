package com.ecommerce.walletorder.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * ==============================================================================
 * WalletTopUpRequest DTO
 * ==============================================================================
 * 
 * 💡 Validation Annotations:
 * - @NotNull: Field null nahi ho sakti (Frontend se aani hi chahiye)
 * - @DecimalMin: Negative ya zero paise add karne se rokta hai (minimum ₹1)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTopUpRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum top-up amount must be at least ₹1.00")
    private BigDecimal amount;
}

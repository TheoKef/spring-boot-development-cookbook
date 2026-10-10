package com.ecommerce.walletorder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Frontend ko wallet ki details safely bhejne ke liye DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletResponseDTO {
    private Long walletId;
    private Long userId;
    private String userName;
    private BigDecimal balance;
    private LocalDateTime updatedAt;
}

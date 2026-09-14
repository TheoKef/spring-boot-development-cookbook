package com.ecommerce.walletorder.dto;

import com.ecommerce.walletorder.enums.TransactionStatus;
import com.ecommerce.walletorder.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Wallet Ledger History DTO (Passbook row)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransactionDTO {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private String referenceOrderId;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}

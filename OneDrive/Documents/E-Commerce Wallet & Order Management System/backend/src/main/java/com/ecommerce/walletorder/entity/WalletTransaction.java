package com.ecommerce.walletorder.entity;

import com.ecommerce.walletorder.enums.TransactionStatus;
import com.ecommerce.walletorder.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ==============================================================================
 * WalletTransaction Entity - Passbook / Ledger Entry
 * ==============================================================================
 * 
 * 💡 Production Rule (Audit Trail):
 * Fintech aur Wallet system me kabhi bhi direct balance update karke purana record bhulte nahi hain.
 * Har rupee aane (CREDIT) aur jaane (DEBIT/REFUND) ka ek permanent row banna chahiye.
 * Isse user apni passbook/history dekh sakta hai aur audit verify ho sakta hai.
 */
@Entity
@Table(name = "wallet_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kis wallet ki transaction hai (Many Transactions belong to One Wallet)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    // Kitna amount transfer hua
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    // CREDIT (Top-up/Refund) ya DEBIT (Order payment)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    // Explanation (e.g. "Top-up via UPI", "Payment for Order #ORD-101", "Refund for Cancelled Order")
    @Column(nullable = false, length = 255)
    private String description;

    // Agar kisi order se judi hui transaction hai to uska order number ya reference ID
    @Column(length = 100)
    private String referenceOrderId;

    // Status: SUCCESS ya FAILED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status;

    // Kab hui transaction
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

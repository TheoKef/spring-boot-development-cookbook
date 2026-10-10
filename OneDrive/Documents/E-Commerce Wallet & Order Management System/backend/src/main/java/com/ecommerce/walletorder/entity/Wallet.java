package com.ecommerce.walletorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ==============================================================================
 * Wallet Entity - User ka Digital Wallet
 * ==============================================================================
 * 
 * 💡 Important Production Architecture Concepts:
 * 
 * 1. BigDecimal for Money (Never double/float):
 *    Computer me float/double binary me decimal store karte hain, jis se 0.1 + 0.2 = 0.30000000000000004
 *    ho jata hai. Real banking/fintech me 1 paise ka bhi discrepancy nahi chal sakta.
 *    Isliye hamesha BigDecimal use karte hain.
 * 
 * 2. @Version (Optimistic Locking):
 *    Maan lijiye user ne do tabs se ek hi second me checkout click kiya.
 *    Agar @Version nahi hoga, to do threads ek sath balance check karke double-spend kar sakti hain!
 *    @Version se Hibernate automatically har update par version number (+1) check karta hai.
 *    Agar version mismatch hua, to OptimisticLockException throw hoti hai aur transaction safe rehti hai!
 * 
 * 3. @OneToOne:
 *    Ek User ke paas ek hi Wallet hoga.
 */
@Entity
@Table(name = "wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Har wallet ek user se linked hai (One User -> One Wallet)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Wallet ka current balance (e.g. 1500.50)
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    // Optimistic locking version counter (Production Rule for Race-condition prevention)
    @Version
    private Long version;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}

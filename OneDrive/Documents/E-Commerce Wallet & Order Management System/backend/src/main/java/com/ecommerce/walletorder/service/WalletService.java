package com.ecommerce.walletorder.service;

import com.ecommerce.walletorder.dto.WalletResponseDTO;
import com.ecommerce.walletorder.dto.WalletTransactionDTO;
import com.ecommerce.walletorder.entity.Wallet;
import com.ecommerce.walletorder.entity.WalletTransaction;
import com.ecommerce.walletorder.enums.TransactionStatus;
import com.ecommerce.walletorder.enums.TransactionType;
import com.ecommerce.walletorder.exception.InsufficientBalanceException;
import com.ecommerce.walletorder.exception.ResourceNotFoundException;
import com.ecommerce.walletorder.repository.WalletRepository;
import com.ecommerce.walletorder.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ==============================================================================
 * WalletService - Financial Transactions & Ledger Logic
 * ==============================================================================
 * 
 * 💡 Critical Production Rules:
 * 
 * 1. @Transactional:
 *    Wallet me paise add ya deduct karte waqt agar beech me server crash ho jaye
 *    ya database error aa jaye, to transaction automatically rollback ho jayegi.
 *    Aadhe paise deduct hona aur order na banna jaisi problem kabhi nahi aayegi!
 * 
 * 2. Immutable Ledger Logging:
 *    Har bar balance badalne par ek WalletTransaction row banti hai.
 * 
 * 3. BigDecimal.compareTo():
 *    BigDecimal me '==' ya '<' operator nahi chalta, hamesha compareTo() use karte hain.
 *    (balance.compareTo(amount) < 0 means balance is less than required amount).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    /**
     * User ka Wallet Balance aur details fetch karta hai
     */
    @Transactional(readOnly = true)
    public WalletResponseDTO getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        return mapToDTO(wallet);
    }

    /**
     * Wallet me paise add karna (Top-Up)
     */
    @Transactional
    public WalletResponseDTO topUpWallet(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ONE) < 0) {
            throw new IllegalArgumentException("Minimum top-up amount must be at least ₹1.00");
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        // 1. Balance update karo (Current Balance + Top-up Amount)
        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        wallet = walletRepository.save(wallet);

        // 2. Audit passbook ledger me entry likho
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.CREDIT)
                .description("Wallet Top-up via Instant Digital UPI")
                .referenceOrderId(null)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(transaction);

        log.info("Wallet top-up successful for userId={}, amount=₹{}, newBalance=₹{}", userId, amount, newBalance);
        return mapToDTO(wallet);
    }

    /**
     * Order checkout ke waqt wallet se paise deduct karna (Atomic operation)
     */
    @Transactional
    public void deductFundsForOrder(Long userId, BigDecimal amount, String orderNumber) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        // Balance check: Kya wallet me paryapt paise hain?
        if (wallet.getBalance().compareTo(amount) < 0) {
            // Failed audit record save karna (Audit logging)
            WalletTransaction failedTx = WalletTransaction.builder()
                    .wallet(wallet)
                    .amount(amount)
                    .type(TransactionType.DEBIT)
                    .description("Failed Order Payment (Insufficient Funds) for #" + orderNumber)
                    .referenceOrderId(orderNumber)
                    .status(TransactionStatus.FAILED)
                    .build();
            transactionRepository.save(failedTx);

            throw new InsufficientBalanceException(
                    "Insufficient wallet balance! Required: ₹" + amount + ", Available: ₹" + wallet.getBalance()
            );
        }

        // Paise kato
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        // Success ledger entry
        WalletTransaction successTx = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.DEBIT)
                .description("Payment for Order #" + orderNumber)
                .referenceOrderId(orderNumber)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(successTx);

        log.info("Funds deducted for order {}: amount=₹{}, remainingBalance=₹{}", orderNumber, amount, wallet.getBalance());
    }

    /**
     * Order Cancel hone par paise wapas user ke wallet me refund karna
     */
    @Transactional
    public void refundFundsForOrder(Long userId, BigDecimal amount, String orderNumber) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        // Balance wapas add karo
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        // Refund ledger entry
        WalletTransaction refundTx = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.CREDIT)
                .description("Refund for Cancelled Order #" + orderNumber)
                .referenceOrderId(orderNumber)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(refundTx);

        log.info("Refund processed for order {}: amount=₹{}, newBalance=₹{}", orderNumber, amount, wallet.getBalance());
    }

    /**
     * Passbook / Transaction ledger history fetch karna
     */
    @Transactional(readOnly = true)
    public List<WalletTransactionDTO> getTransactionHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()).stream()
                .map(tx -> WalletTransactionDTO.builder()
                        .id(tx.getId())
                        .amount(tx.getAmount())
                        .type(tx.getType())
                        .description(tx.getDescription())
                        .referenceOrderId(tx.getReferenceOrderId())
                        .status(tx.getStatus())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private WalletResponseDTO mapToDTO(Wallet wallet) {
        return WalletResponseDTO.builder()
                .walletId(wallet.getId())
                .userId(wallet.getUser().getId())
                .userName(wallet.getUser().getName())
                .balance(wallet.getBalance())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }
}

package com.ecommerce.walletorder.repository;

import com.ecommerce.walletorder.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ==============================================================================
 * WalletTransactionRepository
 * ==============================================================================
 */
@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    /**
     * User ke wallet ki passbook / ledger history naye se purane order me fetch karna
     */
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    List<WalletTransaction> findByWalletUserIdOrderByCreatedAtDesc(Long userId);
}

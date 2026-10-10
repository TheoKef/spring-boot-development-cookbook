package com.ecommerce.walletorder.repository;

import com.ecommerce.walletorder.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ==============================================================================
 * WalletRepository - Spring Data JPA
 * ==============================================================================
 */
@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    /**
     * User ID ke hisaab se wallet dhoondhna (SELECT * FROM wallets WHERE user_id = ?)
     */
    Optional<Wallet> findByUserId(Long userId);
}

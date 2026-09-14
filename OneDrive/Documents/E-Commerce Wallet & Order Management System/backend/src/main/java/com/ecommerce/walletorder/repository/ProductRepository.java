package com.ecommerce.walletorder.repository;

import com.ecommerce.walletorder.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ==============================================================================
 * ProductRepository
 * ==============================================================================
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);
}

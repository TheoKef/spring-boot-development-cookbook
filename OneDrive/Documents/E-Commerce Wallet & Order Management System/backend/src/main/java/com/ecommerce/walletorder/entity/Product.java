package com.ecommerce.walletorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ==============================================================================
 * Product Entity - E-Commerce Catalog & Inventory
 * ==============================================================================
 * 
 * Har product ka stock (inventory) aur price store hota hai.
 * Jab order hota hai, stock kam hota hai. Jab order cancel hota hai, stock wapas badhta hai.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Kitne items stock me available hain
    @Column(nullable = false)
    private Integer stockQuantity;

    @Column(length = 50)
    private String category;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

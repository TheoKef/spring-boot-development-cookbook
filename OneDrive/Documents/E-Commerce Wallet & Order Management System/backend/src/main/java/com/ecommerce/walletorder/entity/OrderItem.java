package com.ecommerce.walletorder.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * ==============================================================================
 * OrderItem Entity - Har product jo order me purchase kiya gaya
 * ==============================================================================
 * 
 * 💡 Production Architecture Best Practice:
 * productName aur unitPrice ko yaha alag se kyu store kiya gaya hai jabki hamare paas Product entity hai?
 * 
 * Answer: Price & Name Immutability!
 * Agar kal ko Admin ne product ka price ₹500 se badha kar ₹800 kar diya,
 * to purane orders ka bill change nahi hona chahiye! Purane order me wahi price dikhna chahiye
 * jo purchase karte waqt tha.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kis order ka item hai
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Order order;

    // Original Product reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Purchase time product name snapshot
    @Column(nullable = false, length = 150)
    private String productName;

    // Purchase time unit price snapshot
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    // Kitni quantity purchase ki
    @Column(nullable = false)
    private Integer quantity;

    // unitPrice * quantity
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;
}

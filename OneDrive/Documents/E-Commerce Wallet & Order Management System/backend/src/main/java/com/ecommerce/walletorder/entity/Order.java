package com.ecommerce.walletorder.entity;

import com.ecommerce.walletorder.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ==============================================================================
 * Order Entity - Customer Order Header
 * ==============================================================================
 * 
 * 💡 One-to-Many Relationship:
 * Ek Order ke andar multiple items (OrderItem) ho sakte hain:
 * e.g. 1 x Headphones + 2 x Phone Charger
 * 
 * - cascade = CascadeType.ALL:
 *   Jab Order save hoga, to uske andar ke sare OrderItems bhi automatically save ho jayenge.
 * 
 * - orphanRemoval = true:
 *   Agar order se koi item remove karenge, to database se bhi delete ho jayega.
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique Order Tracking Number (e.g. ORD-1712345678)
    @Column(nullable = false, unique = true, length = 64)
    private String orderNumber;

    // Kis user ne order kiya
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Order ka total amount (Sum of all item subtotals)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    // PENDING, CONFIRMED, CANCELLED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false, length = 300)
    private String shippingAddress;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Order ke andar ke items ka list
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Helper method: Order me item add karne aur two-way relationship maintain karne ke liye
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}

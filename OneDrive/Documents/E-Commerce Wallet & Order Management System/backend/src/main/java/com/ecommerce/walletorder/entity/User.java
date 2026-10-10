package com.ecommerce.walletorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ==============================================================================
 * User Entity - Represents a Customer / Account in our Database
 * ==============================================================================
 * 
 * 💡 Beginner Guide to JPA Annotations:
 * 
 * - @Entity:
 *   Hibernate/JPA ko batata hai ki ye Java class database ki ek TABLE banegi.
 * 
 * - @Table(name = "users"):
 *   Database me table ka exact naam specify karta hai. 
 *   (Yaha "users" isliye likha kyuki kuch SQL databases me "user" ek reserved keyword hota hai).
 * 
 * - @Id & @GeneratedValue:
 *   @Id batata hai ki 'id' field primary key hai (har user ka unique identifier).
 *   @GeneratedValue(strategy = GenerationType.IDENTITY) means database auto-increment karega (1, 2, 3...).
 * 
 * - @Data, @NoArgsConstructor, @AllArgsConstructor, @Builder:
 *   Ye Lombok annotations hain. Ye getters, setters, constructors background me automatically bana dete hain,
 *   jisse aapka Java code clean aur short rehta hai.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Entity database me save hone se pehle automatic current timestamp set karne ke liye
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

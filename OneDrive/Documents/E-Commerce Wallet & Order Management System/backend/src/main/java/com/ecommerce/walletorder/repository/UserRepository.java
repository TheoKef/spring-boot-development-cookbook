package com.ecommerce.walletorder.repository;

import com.ecommerce.walletorder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ==============================================================================
 * UserRepository - Database Access Layer
 * ==============================================================================
 * 
 * 💡 Spring Data JPA Magic:
 * Aapko koi SQL (SELECT * FROM users WHERE...) likhne ki zaroorat nahi hai!
 * Sirf JpaRepository<User, Long> extend karne se Spring Data JPA aapko ready-made methods de deta hai:
 * - save(user)
 * - findById(id)
 * - findAll()
 * - deleteById(id)
 * - count()
 * 
 * Aur method naming convention (jaise findByEmail) se Spring Boot apne aap SQL query generate kar leta hai!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}

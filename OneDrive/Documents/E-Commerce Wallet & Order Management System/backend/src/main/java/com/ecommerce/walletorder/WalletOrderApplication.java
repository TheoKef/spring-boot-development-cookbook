package com.ecommerce.walletorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ==============================================================================
 * E-Commerce Wallet & Order Management System - Main Entry Point
 * ==============================================================================
 * 
 * 🤔 Ye kya hai?
 * Ye aapke Spring Boot application ka starting point hai (jaise C/C++/Java me main() hota hai).
 * 
 * 💡 @SpringBootApplication Annotation kya karta hai?
 * Ye 3 powerful annotations ka combination hai:
 * 1. @Configuration: Batata hai ki ye class Spring Beans define kar sakti hai.
 * 2. @EnableAutoConfiguration: Spring Boot ko bolta hai ki dependencies dekh kar 
 *    (jaise JPA, H2, Web) apne aap background setup kar le.
 * 3. @ComponentScan: Is package (com.ecommerce.walletorder) aur iske sub-packages 
 *    me jitne bhi @Component, @Service, @Repository, @Controller hain unhe auto-detect kare.
 */
@SpringBootApplication
public class WalletOrderApplication {

    public static void main(String[] args) {
        // App ko start karta hai aur Embedded Tomcat web server ko port 8080 par launch karta hai
        SpringApplication.run(WalletOrderApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("🚀 E-Commerce Wallet & Order Management System Started!");
        System.out.println("🌐 Backend API Base: http://localhost:8080");
        System.out.println("📑 Swagger UI Docs:  http://localhost:8080/swagger-ui.html");
        System.out.println("🗄️ H2 Database UI:   http://localhost:8080/h2-console");
        System.out.println("=======================================================\n");
    }
}

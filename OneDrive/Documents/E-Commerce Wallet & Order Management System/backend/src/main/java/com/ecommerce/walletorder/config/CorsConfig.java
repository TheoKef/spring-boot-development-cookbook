package com.ecommerce.walletorder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * ==============================================================================
 * CorsConfig - Cross-Origin Resource Sharing
 * ==============================================================================
 * 
 * 💡 CORS kya hota hai aur kyu zaroori hai?
 * Hamara Spring Boot backend chalega port 8080 par (http://localhost:8080).
 * Aur React frontend chalega port 5173 par (http://localhost:5173).
 * 
 * Browser security policy ke mutabiq do alag ports ke beech data exchange block ho jata hai
 * jab tak backend explicitly permission na de.
 * 
 * Ye class React frontend ko Spring Boot se safely connect hone ki permission deti hai.
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

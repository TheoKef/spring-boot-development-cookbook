package com.ecommerce.walletorder.service;

import com.ecommerce.walletorder.dto.ProductResponseDTO;
import com.ecommerce.walletorder.entity.Product;
import com.ecommerce.walletorder.exception.ResourceNotFoundException;
import com.ecommerce.walletorder.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ==============================================================================
 * ProductService - Catalog & Inventory Business Logic
 * ==============================================================================
 * 
 * 💡 Production Rules Explained:
 * 
 * 1. @Service:
 *    Spring ko batata hai ki ye class Business Logic sambhalti hai.
 * 
 * 2. @RequiredArgsConstructor (Constructor Injection):
 *    Purane tutorials me log @Autowired field injection use karte the.
 *    Lekin modern production code me Constructor Injection best practice hoti hai
 *    kyuki ye immutability (final fields) aur testing ensure karti hai.
 * 
 * 3. @Transactional(readOnly = true):
 *    Read-only queries par readOnly = true lagane se Hibernate performance optimize
 *    karta hai (dirty checking disable kar deta hai).
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Sare products fetch karke DTO me convert karta hai
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * ID ke hisaab se ek product dhoondhta hai
     */
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToDTO(product);
    }

    /**
     * Internal Entity fetch helper (OrderService ke use ke liye)
     */
    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    /**
     * Entity ko DTO me convert karne ka clean helper method
     */
    private ProductResponseDTO mapToDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .build();
    }
}

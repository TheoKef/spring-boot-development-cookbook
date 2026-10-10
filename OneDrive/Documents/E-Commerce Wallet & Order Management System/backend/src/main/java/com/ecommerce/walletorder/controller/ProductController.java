package com.ecommerce.walletorder.controller;

import com.ecommerce.walletorder.dto.ApiResponse;
import com.ecommerce.walletorder.dto.ProductResponseDTO;
import com.ecommerce.walletorder.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==============================================================================
 * ProductController - Catalog REST APIs
 * ==============================================================================
 * 
 * 💡 Controller Annotations Guide:
 * 
 * - @RestController:
 *   Spring ko batata hai ki ye class HTTP requests (GET, POST, etc.) handle karegi
 *   aur direct JSON data return karegi (HTML page nahi).
 * 
 * - @RequestMapping("/api/products"):
 *   Is controller ke sare endpoints "/api/products" se shuru honge.
 * 
 * - @GetMapping:
 *   HTTP GET request handle karta hai (data read karne ke liye).
 * 
 * - @PathVariable:
 *   URL ke dynamic path parameter (jaise "/api/products/5" me 5) ko Java variable me bind karta hai.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "APIs for viewing products and inventory")
public class ProductController {

    private final ProductService productService;

    /**
     * Endpoint: GET /api/products
     * Description: Sare available products fetch karna
     */
    @GetMapping
    @Operation(summary = "Get all products", description = "Returns a list of all products in catalog with stock levels")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", products));
    }

    /**
     * Endpoint: GET /api/products/{id}
     * Description: Ek specific product ki details fetch karna
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Returns product details by its unique identifier")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }
}

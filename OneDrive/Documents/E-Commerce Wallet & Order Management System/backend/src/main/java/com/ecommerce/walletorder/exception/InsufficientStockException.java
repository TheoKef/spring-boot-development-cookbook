package com.ecommerce.walletorder.exception;

/**
 * Jab product inventory me requested quantity se kam items bache ho
 */
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }
}

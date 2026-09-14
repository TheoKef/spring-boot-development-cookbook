package com.ecommerce.walletorder.exception;

/**
 * Jab koi User, Product, Order ya Wallet database me nahi milta
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

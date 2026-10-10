package com.ecommerce.walletorder.exception;

/**
 * Jab user ke wallet me order pay karne ke liye paryapt paise (sufficient balance) na ho
 */
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

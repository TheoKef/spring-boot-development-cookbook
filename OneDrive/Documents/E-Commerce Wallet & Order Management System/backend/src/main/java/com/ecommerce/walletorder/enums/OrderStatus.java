package com.ecommerce.walletorder.enums;

/**
 * Order ke lifecycle states:
 * - PENDING:   Order checkout request aayi hai, processing ho rahi hai
 * - CONFIRMED: Payment successfully wallet se kat gaya, stock book ho gaya
 * - CANCELLED: Order cancel ho gaya aur paise wallet me wapis refund ho gaye
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    CANCELLED
}

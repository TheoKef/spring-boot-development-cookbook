package com.ecommerce.walletorder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ==============================================================================
 * ApiResponse<T> - Standard Production API Response Wrapper
 * ==============================================================================
 * 
 * 💡 Kyu banaya gaya? (Production Rule):
 * Kabhi bhi direct raw objects ya random JSON nahi return karna chahiye.
 * Ek standard uniform structure hone se frontend (React) ko hamesha pata rehta hai:
 * - response.data.success (true/false)
 * - response.data.message (Human readable status text)
 * - response.data.data (Actual data payload - e.g. User, Wallet, Order)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

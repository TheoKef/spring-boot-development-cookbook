package com.ecommerce.walletorder.exception;

import com.ecommerce.walletorder.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * ==============================================================================
 * Global Exception Handler (@RestControllerAdvice)
 * ==============================================================================
 * 
 * 💡 Spring Boot Production Best Practice:
 * 
 * Beginners ko aksar fobia hota hai ki agar code me koi exception aayi,
 * to backend crash ho jayega ya 500 Internal Server Error ka lamba scary stack trace frontend par chala jayega.
 * 
 * @RestControllerAdvice kya karta hai?
 * Ye ek "Catcher / Shield" hai. Pure application me kisi bhi Controller ya Service me
 * koi bhi Exception aati hai, to ye use pakad leta hai (catch kar leta hai) aur
 * user-friendly, clean JSON response me convert kar deta hai!
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 1. Jab koi data (User, Product, Order) database me na mile
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 2. Jab wallet me paise kam ho
     */
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientBalance(InsufficientBalanceException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Payment Failed: " + ex.getMessage()));
    }

    /**
     * 3. Jab product out of stock ho
     */
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientStock(InsufficientStockException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Inventory Error: " + ex.getMessage()));
    }

    /**
     * 4. Jab DTO validation (@NotNull, @Min, @NotBlank) fail ho jaye
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        
        String firstErrorMessage = errors.values().stream().findFirst().orElse("Invalid input data");

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Validation Failed: " + firstErrorMessage)
                .data(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 5. Jab do simultaneous requests ek sath wallet update karne ki koshish karein (@Version collision)
     */
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse<Void>> handleOptimisticLock(ObjectOptimisticLockingFailureException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Transaction collision detected. Please refresh and try again."));
    }

    /**
     * 6. Illegal arguments / state
     */
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 7. Koi bhi unhandled unexpected system error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected internal error occurred: " + ex.getMessage()));
    }
}

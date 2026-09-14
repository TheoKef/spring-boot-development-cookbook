package com.ecommerce.walletorder.controller;

import com.ecommerce.walletorder.dto.ApiResponse;
import com.ecommerce.walletorder.dto.WalletResponseDTO;
import com.ecommerce.walletorder.dto.WalletTopUpRequest;
import com.ecommerce.walletorder.dto.WalletTransactionDTO;
import com.ecommerce.walletorder.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==============================================================================
 * WalletController - Digital Wallet & Financial Ledger REST APIs
 * ==============================================================================
 * 
 * 💡 Important Annotations:
 * 
 * - @RequestBody:
 *   Frontend se aane wale JSON body ko automatic Java DTO object me convert karta hai.
 * 
 * - @Valid:
 *   Spring Validation engine ko trigger karta hai. Agar @NotNull ya @DecimalMin fail
 *   hote hain, to request turant reject ho jayegi aur GlobalExceptionHandler
 *   clean error response return karega.
 */
@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@Tag(name = "Digital Wallet", description = "APIs for wallet balance, instant top-up, and passbook ledger")
public class WalletController {

    private final WalletService walletService;

    /**
     * Endpoint: GET /api/wallet/{userId}
     * Description: User ka live balance fetch karna
     */
    @GetMapping("/{userId}")
    @Operation(summary = "Get wallet balance", description = "Fetch user's current wallet balance and details")
    public ResponseEntity<ApiResponse<WalletResponseDTO>> getWallet(@PathVariable Long userId) {
        WalletResponseDTO wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Wallet retrieved successfully", wallet));
    }

    /**
     * Endpoint: POST /api/wallet/topup
     * Description: Wallet me funds add karna (Top-Up)
     */
    @PostMapping("/topup")
    @Operation(summary = "Top-up wallet balance", description = "Add funds to user wallet atomically and record transaction in passbook")
    public ResponseEntity<ApiResponse<WalletResponseDTO>> topUpWallet(@Valid @RequestBody WalletTopUpRequest request) {
        WalletResponseDTO updatedWallet = walletService.topUpWallet(request.getUserId(), request.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Wallet recharged successfully! ₹" + request.getAmount() + " added.", updatedWallet));
    }

    /**
     * Endpoint: GET /api/wallet/{userId}/transactions
     * Description: Passbook / Ledger statement fetch karna
     */
    @GetMapping("/{userId}/transactions")
    @Operation(summary = "Get transaction history", description = "Fetch complete ledger of credits and debits for the user")
    public ResponseEntity<ApiResponse<List<WalletTransactionDTO>>> getTransactions(@PathVariable Long userId) {
        List<WalletTransactionDTO> transactions = walletService.getTransactionHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched successfully", transactions));
    }
}

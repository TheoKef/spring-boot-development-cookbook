package com.ecommerce.walletorder.config;

import com.ecommerce.walletorder.entity.Product;
import com.ecommerce.walletorder.entity.User;
import com.ecommerce.walletorder.entity.Wallet;
import com.ecommerce.walletorder.entity.WalletTransaction;
import com.ecommerce.walletorder.enums.TransactionStatus;
import com.ecommerce.walletorder.enums.TransactionType;
import com.ecommerce.walletorder.repository.ProductRepository;
import com.ecommerce.walletorder.repository.UserRepository;
import com.ecommerce.walletorder.repository.WalletRepository;
import com.ecommerce.walletorder.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * ==============================================================================
 * DataInitializer - Auto Seed Sample Data on App Startup
 * ==============================================================================
 * 
 * 💡 CommandLineRunner kya karta hai?
 * Spring Boot jab start hota hai, to application context ready hote hi
 * run() method automatically execute hota hai.
 * 
 * Isse database me pehle se sample Users, unka Wallet (₹2,500 balance),
 * aur trending E-Commerce products insert ho jate hain, taaki aap bina
 * manual entry ke turant app chala kar dekh sakein!
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        // Agar pehle se data hai to dobara insert nahi karenge
        if (userRepository.count() > 0) {
            log.info("Sample data already exists. Skipping data initialization.");
            return;
        }

        log.info("🌱 Seeding initial sample data for E-Commerce Wallet System...");

        // 1. Create Demo User 1: Rahul Sharma
        User rahul = User.builder()
                .name("Rahul Sharma")
                .email("rahul.sharma@example.com")
                .phone("+91 98765 43210")
                .build();
        rahul = userRepository.save(rahul);

        // Rahul's Wallet with ₹2,500.00 initial balance
        Wallet rahulWallet = Wallet.builder()
                .user(rahul)
                .balance(new BigDecimal("2500.00"))
                .build();
        rahulWallet = walletRepository.save(rahulWallet);

        // Initial welcome ledger entry
        WalletTransaction initialBonusTx = WalletTransaction.builder()
                .wallet(rahulWallet)
                .amount(new BigDecimal("2500.00"))
                .type(TransactionType.CREDIT)
                .description("Welcome Wallet Bonus Credit")
                .referenceOrderId(null)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(initialBonusTx);

        // 2. Create Demo User 2: Priya Patel
        User priya = User.builder()
                .name("Priya Patel")
                .email("priya.patel@example.com")
                .phone("+91 91234 56789")
                .build();
        priya = userRepository.save(priya);

        Wallet priyaWallet = Wallet.builder()
                .user(priya)
                .balance(new BigDecimal("1200.00"))
                .build();
        priyaWallet = walletRepository.save(priyaWallet);

        WalletTransaction priyaInitialBonus = WalletTransaction.builder()
                .wallet(priyaWallet)
                .amount(new BigDecimal("1200.00"))
                .type(TransactionType.CREDIT)
                .description("Welcome Wallet Bonus Credit")
                .referenceOrderId(null)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(priyaInitialBonus);

        // 3. Seed E-Commerce Products with High Quality Images & Realistic Prices
        List<Product> products = Arrays.asList(
                Product.builder()
                        .name("Sony WH-1000XM5 Wireless Headphones")
                        .description("Industry-leading active noise canceling headphones with 30-hour battery life and exceptional clarity.")
                        .price(new BigDecimal("2499.00"))
                        .stockQuantity(12)
                        .category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80")
                        .build(),

                Product.builder()
                        .name("Apple Watch SE (2nd Gen, GPS)")
                        .description("Smart health and fitness tracker with Retina OLED display, sleep tracking, and crash detection.")
                        .price(new BigDecimal("1899.00"))
                        .stockQuantity(8)
                        .category("Wearables")
                        .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80")
                        .build(),

                Product.builder()
                        .name("Logitech MX Master 3S Wireless Mouse")
                        .description("Ergonomic performance mouse with quiet clicks, 8K DPI sensor, and ultra-fast MagSpeed scrolling.")
                        .price(new BigDecimal("799.00"))
                        .stockQuantity(20)
                        .category("Accessories")
                        .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80")
                        .build(),

                Product.builder()
                        .name("Keychron K2 Mechanical Keyboard")
                        .description("Wireless 75% compact mechanical keyboard with RGB backlight, Gateron brown switches, and Mac/Win layout.")
                        .price(new BigDecimal("1299.00"))
                        .stockQuantity(15)
                        .category("Accessories")
                        .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80")
                        .build(),

                Product.builder()
                        .name("Anker 65W GaN Fast Wall Charger")
                        .description("Ultra-compact 3-port fast charger capable of charging laptops, phones, and tablets simultaneously.")
                        .price(new BigDecimal("349.00"))
                        .stockQuantity(25)
                        .category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80")
                        .build(),

                Product.builder()
                        .name("Kindle Paperwhite (16 GB, 6.8\" Screen)")
                        .description("Glare-free 300 ppi display, adjustable warm light, waterproof design, and weeks of battery life.")
                        .price(new BigDecimal("1499.00"))
                        .stockQuantity(9)
                        .category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80")
                        .build()
        );

        productRepository.saveAll(products);
        log.info("✅ Seeded {} products, 2 demo users and wallets successfully!", products.size());
    }
}

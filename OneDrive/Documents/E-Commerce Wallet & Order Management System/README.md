# 🛒 E-Commerce Wallet & Order Management System
### *Production-Grade Spring Boot 3 + React Architecture for Learners*

Ye project khas un developers ke liye banaya gaya hai jinhe **Spring Boot** se fobia ya confusion hoti hai. Isme Spring Boot ke sare industry production standards (Layered Architecture, DTOs, `@Transactional` atomic money deduction, Optimistic Locking, Bean Validation, Global Exception Handling) implement kiye gaye hain aur har line of code me Hinglish/English comments hain jisse aap padhte waqt asani se samajh sakein.

---

## 🌟 Key Features

1. **🛍️ Product Catalog & Live Stock Tracking**:
   - Products browse karein with category filters.
   - Real-time stock reservation and restock rollback on cancellation.

2. **💳 Digital Wallet Hub (Fintech Grade)**:
   - Visual Holographic Virtual Debit Card.
   - Live Wallet balance tracking.
   - Instant Top-up with quick presets (+₹100, +₹500, +₹1,000, +₹2,000, +₹5,000).
   - Immutable passbook ledger history (`CREDIT`, `DEBIT`, `REFUND`).
   - Optimistic Locking (`@Version`) to prevent concurrent double-spending.

3. **⚡ Atomic 1-Click Wallet Checkout**:
   - Order total calculate hota hai high-precision `BigDecimal` se (never double/float).
   - Agar wallet me paise kam hain, to clean error warning aati hai aur **1-Click Add Shortfall & Pay** feature milta hai.
   - Database level `@Transactional` integrity: Agar payment fail hui to stock restore ho jayega.

4. **🔄 Instant Order Cancellation & 100% Refund**:
   - Confirmed orders ko cancel karte hi inventory turant restock ho jati hai.
   - Pura amount bina kisi delay ke user ke wallet me `REFUND` credit ho jata hai.

5. **🧠 Interactive "Spring Boot Demystifier" Tab**:
   - UI ke andar hi ek visual interactive guide hai jaha aap click karke dekh sakte hain:
     `Client (React) ➔ Controller (@RestController) ➔ DTOs (@Valid) ➔ Service (@Transactional) ➔ Repository (JPA) ➔ Database (H2/SQL)`.
   - Spring Boot ke confusing annotations ka simple bhasha me explanation.

---

## 🏗️ Architecture & Production Rules Explained

```
                 [ React 18 + Vite Frontend ] (Port 5173)
                                │
                 HTTP REST Calls (JSON Payloads)
                                ▼
         [ Spring Boot 3 Backend Server ] (Port 8080)
   ┌────────────────────────────────────────────────────────────┐
   │ 1. Controller Layer: HTTP Endpoints & @Valid Check         │
   │ 2. DTO Layer: Input/Output payload protection              │
   │ 3. Service Layer: Business Logic + @Transactional boundary │
   │ 4. Repository Layer: Spring Data JPA interfaces            │
   │ 5. Global Exception Handler: @RestControllerAdvice         │
   │ 6. Database: H2 In-Memory DB with Live Web Console         │
   └────────────────────────────────────────────────────────────┘
```

### Production Rules:
- **Rule 1 (Financial Precision)**: Paiso ke liye hamesha `java.math.BigDecimal` use hota hai rounding bugs se bachne ke liye.
- **Rule 2 (No Entity Leakage)**: Database Entities direct frontend ko send nahi ki jati; DTOs use hoti hain.
- **Rule 3 (Atomic Rollback)**: `@Transactional(rollbackFor = Exception.class)` ensure karta hai ki ya to order aur wallet deduction dono honge, ya kuch nahi hoga.
- **Rule 4 (Optimistic Locking)**: Wallet me `@Version` field hai jisse concurrent race condition protect hoti hai.
- **Rule 5 (No 500 Crashes)**: `@RestControllerAdvice` sare exceptions ko user-friendly JSON me translate kar deta hai.

---

## 🚀 How to Run the Project Locally

### Prerequisites:
- Java JDK 21 ya Java 24 installed
- Maven installed
- Node.js & npm installed

### Step 1: Start Spring Boot Backend
Terminal me:
```bash
cd backend
mvn spring-boot:run
```
Backend start hone ke baad:
- **API Base URL**: `http://localhost:8080`
- **Swagger Interactive UI**: `http://localhost:8080/swagger-ui.html`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - *JDBC URL*: `jdbc:h2:mem:wallet_order_db`
  - *Username*: `sa`
  - *Password*: *(leave blank)*

### Step 2: Start React Frontend
Dusre terminal me:
```bash
cd frontend
npm install
npm run dev
```
Ab browser me open karein:
👉 **`http://localhost:5173`**

---

## 📂 Project Directory Map

```
├── backend/
│   ├── pom.xml                                  (Dependencies: Web, JPA, H2, Validation, Lombok, Swagger)
│   └── src/main/java/com/ecommerce/walletorder/
│       ├── WalletOrderApplication.java          (Main Entry Point)
│       ├── config/
│       │   ├── CorsConfig.java                  (React localhost integration)
│       │   └── DataInitializer.java             (Auto-seeds demo users, ₹2500 wallet balance & products)
│       ├── controller/
│       │   ├── ProductController.java           (GET /api/products)
│       │   ├── WalletController.java            (GET /api/wallet, POST /api/wallet/topup)
│       │   └── OrderController.java             (POST /api/orders/checkout, POST cancel)
│       ├── dto/
│       │   ├── ApiResponse.java                 (Standard unified JSON response)
│       │   ├── WalletTopUpRequest.java
│       │   ├── WalletResponseDTO.java
│       │   ├── OrderCreateRequest.java
│       │   └── OrderResponseDTO.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Wallet.java                      (balance + @Version optimistic lock)
│       │   ├── WalletTransaction.java           (Audit ledger)
│       │   ├── Product.java                     (Stock + Price)
│       │   ├── Order.java
│       │   └── OrderItem.java                   (Historical price snapshot)
│       ├── enums/
│       │   ├── OrderStatus.java                 (CONFIRMED, CANCELLED)
│       │   └── TransactionType.java             (CREDIT, DEBIT)
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java      (@RestControllerAdvice)
│       │   ├── InsufficientBalanceException.java
│       │   ├── InsufficientStockException.java
│       │   └── ResourceNotFoundException.java
│       ├── repository/                          (Spring Data JPA interfaces)
│       └── service/                             (@Service + @Transactional)
└── frontend/
    ├── src/
    │   ├── App.jsx                              (Main Dashboard)
    │   ├── index.css                            (Glassmorphic Dark Theme)
    │   ├── api/client.js                        (API Client)
    │   └── components/
    │       ├── Navbar.jsx                       (User Switcher + Live Wallet Pill)
    │       ├── Storefront.jsx                   (Product Catalog + Stock Badges)
    │       ├── WalletHub.jsx                    (Digital Virtual Card + Top-Up + Ledger)
    │       ├── CartDrawer.jsx                   (Cart + Instant Balance Comparison)
    │       ├── OrdersList.jsx                   (Orders Timeline + Cancel & Instant Refund)
    │       └── SpringBootLearner.jsx            (Interactive Architecture Explorer)
```

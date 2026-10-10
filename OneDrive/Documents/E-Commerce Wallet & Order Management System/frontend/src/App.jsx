import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import WalletHub from './components/WalletHub';
import OrdersList from './components/OrdersList';
import CartDrawer from './components/CartDrawer';
import SpringBootLearner from './components/SpringBootLearner';

import {
  getProducts,
  getWallet,
  topUpWallet,
  getWalletTransactions,
  checkoutOrder,
  cancelOrder,
  getUserOrders
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [currentUserId, setCurrentUserId] = useState(1); // Default: Rahul Sharma
  
  // Data States
  const [products, setProducts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Loading States
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial data or when user switches
  useEffect(() => {
    loadProducts();
    loadWalletData(currentUserId);
    loadUserOrders(currentUserId);
  }, [currentUserId]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadWalletData = async (userId) => {
    try {
      setLoadingWallet(true);
      const [walletData, txData] = await Promise.all([
        getWallet(userId),
        getWalletTransactions(userId)
      ]);
      setWallet(walletData);
      setTransactions(txData || []);
    } catch (err) {
      console.error('Failed to load wallet:', err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const loadUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      const data = await getUserOrders(userId);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // -------------------------------------------------------------
  // Cart Actions
  // -------------------------------------------------------------
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // -------------------------------------------------------------
  // Wallet Top-up Action
  // -------------------------------------------------------------
  const handleTopUp = async (amount) => {
    const updated = await topUpWallet(currentUserId, amount);
    setWallet(updated);
    // Refresh ledger
    const txData = await getWalletTransactions(currentUserId);
    setTransactions(txData || []);
    showToast(`Successfully added ₹${amount} to wallet!`);
  };

  // -------------------------------------------------------------
  // Checkout Action (Atomic transaction with Spring Boot)
  // -------------------------------------------------------------
  const handleCheckout = async (shippingAddress) => {
    const payload = {
      userId: currentUserId,
      shippingAddress: shippingAddress,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const newOrder = await checkoutOrder(payload);

    // Refresh all states synchronously
    handleClearCart();
    await Promise.all([
      loadWalletData(currentUserId),
      loadUserOrders(currentUserId),
      loadProducts() // Stock was decremented!
    ]);

    showToast(`Order #${newOrder.orderNumber} placed successfully via wallet!`);
    setActiveTab('orders'); // Jump to orders view
  };

  // Quick Top-up and Pay helper
  const handleQuickTopUpAndPay = async (topUpAmount, shippingAddress) => {
    await topUpWallet(currentUserId, topUpAmount);
    await handleCheckout(shippingAddress);
  };

  // -------------------------------------------------------------
  // Order Cancellation & Instant Refund Action
  // -------------------------------------------------------------
  const handleCancelOrder = async (orderId) => {
    await cancelOrder(orderId);

    // Refresh wallet balance, transactions, orders, and products (inventory restored)
    await Promise.all([
      loadWalletData(currentUserId),
      loadUserOrders(currentUserId),
      loadProducts()
    ]);

    showToast('Order cancelled! 100% amount refunded to your wallet.');
  };

  const totalCartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      {/* Navbar with Sticky Glass Effect */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        cartCount={totalCartItemCount}
        openCart={() => setIsCartOpen(true)}
        refreshWallet={() => loadWalletData(currentUserId)}
        walletLoading={loadingWallet}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {activeTab === 'store' && (
          <Storefront
            products={products}
            onAddToCart={handleAddToCart}
            loading={loadingProducts}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletHub
            wallet={wallet}
            transactions={transactions}
            onTopUp={handleTopUp}
            loading={loadingWallet}
            refreshWallet={() => loadWalletData(currentUserId)}
            currentUserName={wallet?.userName}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersList
            orders={orders}
            onCancelOrder={handleCancelOrder}
            loading={loadingOrders}
            onShopNow={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'guide' && (
          <SpringBootLearner />
        )}
      </main>

      {/* Shopping Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        walletBalance={wallet?.balance || 0}
        onCheckout={handleCheckout}
        onQuickTopUpAndPay={handleQuickTopUpAndPay}
      />

      {/* Global Notification Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 300,
          background: toast.type === 'success' ? '#065f46' : '#991b1b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}

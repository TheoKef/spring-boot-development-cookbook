/**
 * ==============================================================================
 * API Client - Connects React Frontend with Spring Boot Backend
 * ==============================================================================
 */
const BASE_URL = '/api';

/**
 * Standard fetch helper with error parsing
 */
async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await res.json();

    if (!res.ok || result.success === false) {
      // Spring Boot GlobalExceptionHandler sends user-friendly error message
      const errorMessage = result.message || 'Server returned an error. Please try again.';
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// Product Catalog APIs
// -------------------------------------------------------------
export const getProducts = () => request('/products');
export const getProductById = (id) => request(`/products/${id}`);

// -------------------------------------------------------------
// Digital Wallet APIs
// -------------------------------------------------------------
export const getWallet = (userId) => request(`/wallet/${userId}`);
export const topUpWallet = (userId, amount) =>
  request('/wallet/topup', {
    method: 'POST',
    body: JSON.stringify({ userId, amount }),
  });
export const getWalletTransactions = (userId) =>
  request(`/wallet/${userId}/transactions`);

// -------------------------------------------------------------
// Orders & Checkout APIs
// -------------------------------------------------------------
export const checkoutOrder = (payload) =>
  request('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const cancelOrder = (orderId) =>
  request(`/orders/${orderId}/cancel`, {
    method: 'POST',
  });

export const getUserOrders = (userId) => request(`/orders/user/${userId}`);
export const getAllOrders = () => request('/orders');

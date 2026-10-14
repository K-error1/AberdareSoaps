/**
 * Aberdares E-Commerce Backend API Client
 * Configured for http://localhost:8001
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('aberdares_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send HttpOnly JWT cookies if enabled
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error?.message || response.statusText || 'Request failed';
    const err = new Error(errorMsg);
    err.details = data?.error;
    err.status = response.status;
    throw err;
  }

  return data;
}

export const api = {
  // Catalog
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/catalog/products/${query ? `?${query}` : ''}`);
  },
  getProductBySlug: (slug) => request(`/catalog/products/${slug}/`),
  getCategories: () => request('/catalog/categories/'),
  getSizesMatrix: () => request('/catalog/sizes-matrix/'),

  // Promos
  validatePromo: (code, subtotal, deliveryFee = 0) => {
    return request('/promos/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, delivery_fee: deliveryFee })
    });
  },

  // Orders & Checkout
  createOrder: (orderPayload, idempotencyKey = null) => {
    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return request('/orders/', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload)
    });
  },
  getUserOrders: () => request('/orders/user/my-orders/'),
  getOrder: (identifier) => request(`/orders/${identifier}/`),
  getOrderPaymentStatus: (identifier) => request(`/orders/${identifier}/payment-status/`),

  // Loyalty
  getLoyaltyBalance: () => request('/loyalty/balance/'),
  getLoyaltyHistory: () => request('/loyalty/history/'),

  // Payments (M-Pesa STK Push / Paystack Card)
  initiateMpesaStk: (orderId, phone) => {
    return request('/payments/mpesa/stk-push/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, phone })
    });
  },

  // Auth
  register: (payload) => request('/auth/register/', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login/', { method: 'POST', body: JSON.stringify(payload) }),
  googleAuth: (credential) => request('/auth/google/', { method: 'POST', body: JSON.stringify({ credential }) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  getMe: () => request('/auth/me/'),
  requestPasswordReset: (email) => request('/auth/password-reset/request/', { method: 'POST', body: JSON.stringify({ email }) }),
  confirmPasswordReset: (payload) => request('/auth/password-reset/confirm/', { method: 'POST', body: JSON.stringify(payload) })
};

export default api;

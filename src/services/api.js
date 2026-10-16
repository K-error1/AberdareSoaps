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
  createProduct: (payload) => request('/catalog/products/', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (slugOrId, payload) => request(`/catalog/products/${slugOrId}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteProduct: (slugOrId) => request(`/catalog/products/${slugOrId}/`, { method: 'DELETE' }),
  adjustInventory: (slugOrId, payload) => request(`/catalog/products/${slugOrId}/adjust-inventory/`, { method: 'POST', body: JSON.stringify(payload) }),
  getCategories: () => request('/catalog/categories/'),
  getSizesMatrix: () => request('/catalog/sizes-matrix/'),

  // Blog / Articles
  getArticles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/blog/articles/${query ? `?${query}` : ''}`);
  },
  getArticleBySlug: (slug) => request(`/blog/articles/${slug}/`),
  createArticle: (payload) => request('/blog/articles/', { method: 'POST', body: JSON.stringify(payload) }),
  updateArticle: (slugOrId, payload) => request(`/blog/articles/${slugOrId}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteArticle: (slugOrId) => request(`/blog/articles/${slugOrId}/`, { method: 'DELETE' }),

  // Promos
  validatePromo: (code, subtotal, deliveryFee = 0) => {
    return request('/promos/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, delivery_fee: deliveryFee })
    });
  },
  getAdminPromoCodes: () => request('/promos/admin/'),
  createPromoCode: (payload) => request('/promos/admin/', { method: 'POST', body: JSON.stringify(payload) }),
  updatePromoCode: (id, payload) => request(`/promos/admin/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePromoCode: (id) => request(`/promos/admin/${id}/`, { method: 'DELETE' }),

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
  getAdminOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const data = await request(`/orders/admin/${query ? `?${query}` : ''}`);
    // Normalise: handle both paginated {results:[]} envelope and plain array
    return Array.isArray(data) ? data : (data?.results ?? []);
  },
  updateOrderStatus: (identifier, status, notes = '') => {
    return request(`/orders/admin/${identifier}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  // Customers / Users (Admin)
  getAdminCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auth/admin/users/${query ? `?${query}` : ''}`);
  },
  updateCustomer: (userId, payload) => {
    return request(`/auth/admin/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  // Loyalty
  getLoyaltyBalance: () => request('/loyalty/balance/'),
  getLoyaltyHistory: () => request('/loyalty/history/'),
  getAdminLoyaltyLedger: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/loyalty/admin/ledger/${query ? `?${query}` : ''}`);
  },
  adjustLoyaltyPoints: (payload) => request('/loyalty/admin/adjust/', { method: 'POST', body: JSON.stringify(payload) }),

  // Payments (M-Pesa STK Push / Paystack Card)
  initiateMpesaStk: (orderId, phone) => {
    return request('/payments/mpesa/stk-push/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, phone })
    });
  },
  getAdminPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/payments/admin/${query ? `?${query}` : ''}`);
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

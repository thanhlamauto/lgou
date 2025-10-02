// CMS API Integration Library
// This file contains helper functions to interact with the backend API

const API_BASE_URL = '/api';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Orders API
const OrdersAPI = {
  // Get all orders
  getAll: async () => {
    return await apiCall('/orders');
  },

  // Get specific order
  getById: async (id) => {
    return await apiCall(`/orders?id=${id}`);
  },

  // Create new order
  create: async (orderData) => {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Update order
  update: async (id, updates) => {
    return await apiCall('/orders', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
  },

  // Delete order
  delete: async (id) => {
    return await apiCall(`/orders?id=${id}`, {
      method: 'DELETE'
    });
  }
};

// Customers API
const CustomersAPI = {
  // Get all customers
  getAll: async () => {
    return await apiCall('/customers');
  },

  // Get specific customer
  getById: async (id) => {
    return await apiCall(`/customers?id=${id}`);
  },

  // Create new customer
  create: async (customerData) => {
    return await apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  },

  // Update customer
  update: async (id, updates) => {
    return await apiCall('/customers', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
  },

  // Delete customer
  delete: async (id) => {
    return await apiCall(`/customers?id=${id}`, {
      method: 'DELETE'
    });
  }
};

// Products API
const ProductsAPI = {
  // Get all products
  getAll: async (category = null) => {
    const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    return await apiCall(url);
  },

  // Get specific product
  getById: async (id) => {
    return await apiCall(`/products?id=${id}`);
  },

  // Create new product
  create: async (productData) => {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Update product
  update: async (id, updates) => {
    return await apiCall('/products', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
  },

  // Delete product
  delete: async (id) => {
    return await apiCall(`/products?id=${id}`, {
      method: 'DELETE'
    });
  },

  // Update stock
  updateStock: async (id, stock) => {
    return await apiCall('/products', {
      method: 'PUT',
      body: JSON.stringify({ id, stock: parseInt(stock) })
    });
  }
};

// Collections API
const CollectionsAPI = {
  // Get all collections
  getAll: async (status = null) => {
    const url = status ? `/collections?status=${status}` : '/collections';
    return await apiCall(url);
  },

  // Get specific collection
  getById: async (id) => {
    return await apiCall(`/collections?id=${id}`);
  },

  // Create new collection
  create: async (collectionData) => {
    return await apiCall('/collections', {
      method: 'POST',
      body: JSON.stringify(collectionData)
    });
  },

  // Update collection
  update: async (id, updates) => {
    return await apiCall('/collections', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
  },

  // Delete collection
  delete: async (id) => {
    return await apiCall(`/collections?id=${id}`, {
      method: 'DELETE'
    });
  }
};

// Stats API
const StatsAPI = {
  // Get dashboard statistics
  get: async () => {
    return await apiCall('/stats');
  }
};

// Export all APIs
if (typeof window !== 'undefined') {
  window.OrdersAPI = OrdersAPI;
  window.CustomersAPI = CustomersAPI;
  window.ProductsAPI = ProductsAPI;
  window.CollectionsAPI = CollectionsAPI;
  window.StatsAPI = StatsAPI;
}


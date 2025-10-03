// CMS Supabase Integration Script
// Add this script BEFORE the main CMS script in cms.html

const API_BASE = '/api';

// API Helper Functions
async function callAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
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
        showNotification(`Lỗi: ${error.message}`, 'error');
        throw error;
    }
}

// Orders API
window.OrdersAPI = {
    async getAll() {
        const data = await callAPI('/orders');
        return data.orders || [];
    },

    async getById(id) {
        return await callAPI(`/orders?id=${id}`);
    },

    async create(orderData) {
        return await callAPI('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    async update(id, updates) {
        return await callAPI('/orders', {
            method: 'PUT',
            body: JSON.stringify({ id, ...updates })
        });
    },

    async delete(id) {
        return await callAPI(`/orders?id=${id}`, {
            method: 'DELETE'
        });
    }
};

// Products API
window.ProductsAPI = {
    async getAll(category = null) {
        const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
        const data = await callAPI(url);
        return data.products || [];
    },

    async getById(id) {
        return await callAPI(`/products?id=${id}`);
    },

    async create(productData) {
        return await callAPI('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    async update(id, updates) {
        return await callAPI('/products', {
            method: 'PUT',
            body: JSON.stringify({ id, ...updates })
        });
    },

    async updateStock(id, stock) {
        return await callAPI('/products', {
            method: 'PUT',
            body: JSON.stringify({ id, stock: parseInt(stock) })
        });
    },

    async delete(id) {
        return await callAPI(`/products?id=${id}`, {
            method: 'DELETE'
        });
    }
};

// Customers API
window.CustomersAPI = {
    async getAll() {
        const data = await callAPI('/customers');
        return data.customers || [];
    },

    async getById(id) {
        return await callAPI(`/customers?id=${id}`);
    }
};

// Collections API
window.CollectionsAPI = {
    async getAll(status = null) {
        const url = status ? `/collections?status=${status}` : '/collections';
        const data = await callAPI(url);
        return data.collections || [];
    },

    async create(collectionData) {
        return await callAPI('/collections', {
            method: 'POST',
            body: JSON.stringify(collectionData)
        });
    },

    async update(id, updates) {
        return await callAPI('/collections', {
            method: 'PUT',
            body: JSON.stringify({ id, ...updates })
        });
    },

    async delete(id) {
        return await callAPI(`/collections?id=${id}`, {
            method: 'DELETE'
        });
    }
};

// Stats API
window.StatsAPI = {
    async get() {
        return await callAPI('/stats');
    }
};

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('✅ CMS Supabase Integration loaded');


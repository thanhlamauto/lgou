# Vercel Storage Setup Guide for L'Gôu

This guide will help you set up Vercel KV storage to track users, orders, products, prices, and manage everything through the CMS.

## 🎯 What This System Does

The system now tracks:
- ✅ **Orders** - All customer orders with full details
- ✅ **Customers** - Customer information and order history
- ✅ **Products** - Inventory management with real-time stock tracking
- ✅ **Collections** - Limited edition collections with expiry dates
- ✅ **Statistics** - Daily/monthly orders, revenue, out-of-stock items

## 📋 Prerequisites

1. A Vercel account
2. Your project deployed on Vercel
3. Access to the Vercel Dashboard

## 🚀 Step 1: Create Vercel KV Storage

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (`lgou-website`)
3. Click on **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Name it: `lgou-storage`
7. Select a region (choose closest to your users)
8. Click **Create**

## 🔑 Step 2: Get Your KV Credentials

After creating the KV store:

1. Click on your newly created `lgou-storage` database
2. Go to the **`.env.local`** tab
3. You'll see three environment variables:
   ```
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   ```
4. Copy these values

## ⚙️ Step 3: Configure Environment Variables

### Option A: Through Vercel Dashboard (Recommended)

1. In your project settings, go to **Environment Variables**
2. Add the following variables:

```
KV_REST_API_URL=your_kv_url_from_step_2
KV_REST_API_TOKEN=your_token_from_step_2
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token_from_step_2
BLOB_READ_WRITE_TOKEN=your_existing_blob_token
ADMIN_AUTH_KEY=create_a_secure_random_key_here
```

3. Click **Save**

### Option B: Local Development

Create a `.env.local` file in your project root:

```bash
# Vercel KV Storage
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token

# Vercel Blob Storage (already configured)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_INhjAN0elby3OjXf_k2NRXdbsq76jjzX522PQS44cFefPKB

# Admin Authentication
ADMIN_AUTH_KEY=your_secure_random_key_here
```

## 📦 Step 4: Install Dependencies

Run the following command in your project:

```bash
npm install
```

This will install:
- `@vercel/kv` - For database operations
- `@vercel/blob` - For image storage (already installed)

## 🔄 Step 5: Deploy Your Changes

```bash
git add .
git commit -m "Add Vercel KV storage integration"
git push
```

Vercel will automatically deploy your changes.

## 🗃️ Step 6: Initialize Database with Existing Inventory

After deployment, initialize your database with existing inventory data:

### Method 1: Using the CMS (Coming Soon)

The CMS will have an "Initialize Database" button in Settings.

### Method 2: Using API Call

Make a POST request to `/api/init-database`:

```bash
curl -X POST https://your-domain.vercel.app/api/init-database \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "your_admin_auth_key",
    "inventoryData": [...],
    "accessoriesData": [...],
    "petsData": [...]
  }'
```

## 📊 API Endpoints

Your application now has these API endpoints:

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders?id=ORDER_ID` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders` - Update order
- `DELETE /api/orders?id=ORDER_ID` - Delete order

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers?id=CUSTOMER_ID` - Get specific customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers` - Update customer
- `DELETE /api/customers?id=CUSTOMER_ID` - Delete customer

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=CATEGORY` - Get products by category
- `GET /api/products?id=PRODUCT_ID` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products` - Update product
- `DELETE /api/products?id=PRODUCT_ID` - Delete product

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections?status=active` - Get active collections
- `POST /api/collections` - Create new collection
- `PUT /api/collections` - Update collection
- `DELETE /api/collections?id=COLLECTION_ID` - Delete collection

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 CMS Integration

The CMS (`/cms.html`) now uses these APIs instead of localStorage:

### Features:
1. **Real-time Data** - All changes are saved to Vercel KV
2. **Order Tracking** - View and manage customer orders
3. **Customer Management** - Track customer information and history
4. **Inventory Management** - Real-time stock updates
5. **Collections Management** - Create and manage limited edition collections
6. **Dashboard Statistics** - View real-time business metrics

### Login Credentials (Update these!):
- Username: `admin` / Password: `lgou2025`
- Username: `manager` / Password: `manager123`

⚠️ **Security Note**: Change these credentials in `cms.html` before going live!

## 🛒 Order Submission from Website

When customers complete their order on the main website (`index.html`), the order is automatically:
1. Saved to Vercel KV database
2. Customer information is stored/updated
3. Product stock is decreased
4. Statistics are updated
5. Available in CMS immediately

## 📈 Data Structure

### Order Object
```javascript
{
  id: "LG1234567890",
  customerInfo: {
    name: "Customer Name",
    phone: "0123456789",
    email: "email@example.com",
    address: "Customer Address"
  },
  items: [...],
  total: 350000,
  status: "new", // new, processing, completed, cancelled
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Customer Object
```javascript
{
  id: "customer:0123456789",
  name: "Customer Name",
  phone: "0123456789",
  email: "email@example.com",
  address: "Customer Address",
  orders: ["LG1234567890", "LG1234567891"],
  totalOrders: 2,
  firstOrder: "2024-01-01T00:00:00.000Z",
  lastOrder: "2024-01-02T00:00:00.000Z"
}
```

### Product Object
```javascript
{
  id: "bg1",
  name: "Happy 1st Anniversary Pink",
  category: "Background",
  price: 0,
  stock: 5,
  image: "https://...",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Troubleshooting

### Issue: API returns 500 error
- Check if environment variables are set correctly
- Verify KV database is created and connected
- Check Vercel deployment logs

### Issue: Data not persisting
- Ensure KV credentials are correct
- Check if you're hitting API rate limits
- Verify network connection

### Issue: CMS not loading data
- Open browser console to check for errors
- Verify API endpoints are accessible
- Check CORS settings

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test API endpoints directly

## 🎉 Next Steps

1. ✅ Complete setup steps above
2. ✅ Test order submission from main website
3. ✅ Log into CMS and verify data
4. ✅ Customize CMS login credentials
5. ✅ Set up Google Sheets sync (optional)
6. ✅ Configure email notifications

## 🔐 Security Best Practices

1. **Change default CMS passwords immediately**
2. **Keep ADMIN_AUTH_KEY secret**
3. **Use environment variables for all sensitive data**
4. **Enable two-factor authentication on Vercel**
5. **Regularly backup your data**

## 📚 Additional Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Your L'Gôu website is now enterprise-ready with full order tracking and management! 🎉**


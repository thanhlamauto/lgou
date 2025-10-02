# 🚀 Deployment Checklist for L'Gôu

## ✅ Step-by-Step Deployment Guide

### 1️⃣ **Add Environment Variables to Vercel**

Go to your Vercel project dashboard and add these environment variables:

**Settings → Environment Variables**

Add these **3 variables** (already configured in your local `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://hsjdufungbflbwqnpmwp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzamR1ZnVuZ2JmbGJ3cW5wbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjA4OTUsImV4cCI6MjA3NDk5Njg5NX0._f8uor37h8mBP3gWGA-K7UOg0BeYMtY-n2RVm-Dpvdw

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzamR1ZnVuZ2JmbGJ3cW5wbXdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQyMDg5NSwiZXhwIjoyMDc0OTk2ODk1fQ.0k2nDyw4TMmH_Ob9NSODsa6jI5p4kB2O3rCecFz5e2g
```

**Important:** Make sure to apply these to **Production, Preview, and Development** environments!

---

### 2️⃣ **Set Up Supabase Database Tables**

1. Go to your Supabase Dashboard: https://app.supabase.com/project/hsjdufungbflbwqnpmwp
2. Click on **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`

This will create all necessary tables:
- ✅ `orders` - Customer orders
- ✅ `customers` - Customer information
- ✅ `products` - Product inventory
- ✅ `collections` - Special collections
- ✅ `daily_stats` - Analytics and statistics

---

### 3️⃣ **Deploy to Vercel**

#### Option A: Using Terminal
```bash
# Make sure you're in the project directory
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click **Redeploy** button
5. Check "Use existing build cache" is OFF
6. Click **Redeploy**

---

### 4️⃣ **Verify Everything Works**

After deployment:

1. **Test Order Submission:**
   - Go to your live website
   - Customize a product
   - Fill in customer info
   - Click "Đặt hàng ngay"
   - ✅ Should show success popup (no more connection error!)

2. **Test CMS:**
   - Go to `your-domain.com/cms.html`
   - Login with: `admin` / `lgou2025`
   - Check if dashboard loads
   - Check if orders appear
   - Try exporting to Excel

3. **Check Supabase:**
   - Go to Supabase Dashboard
   - Click **Table Editor**
   - Check `orders` table - you should see the test order!

---

### 5️⃣ **Optional: Add Products to Database**

You have two options:

**Option A: Keep using localStorage (current setup)**
- Products are already loaded from `inventory-data.js` and `accessories-pets-data.js`
- No additional setup needed

**Option B: Migrate products to Supabase**
- Run the SQL script: `INSERT_PRODUCTS.sql` (if you want me to create it)
- Products will be stored in database instead of JavaScript files

---

## 🔍 Troubleshooting

### "Connection error" when placing order
- ✅ Check environment variables are added in Vercel
- ✅ Check Supabase tables are created
- ✅ Check Supabase project is active (not paused)

### CMS not loading data
- ✅ Check browser console for errors (F12)
- ✅ Verify API endpoints are accessible: `/api/orders`, `/api/products`, etc.
- ✅ Check Supabase Row Level Security (RLS) is configured correctly

### Products not showing
- ✅ Make sure `inventory-data.js` and `accessories-pets-data.js` are included in `index.html`
- ✅ Check browser console for loading errors

---

## 📱 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com/project/hsjdufungbflbwqnpmwp
- **Live Website:** https://lgou.vercel.app (or your custom domain)

---

## ✅ Checklist

- [ ] Added 3 environment variables to Vercel
- [ ] Ran `supabase-schema.sql` in Supabase SQL Editor
- [ ] Deployed to Vercel (production)
- [ ] Tested order submission on live site
- [ ] Tested CMS login and functionality
- [ ] Verified orders appear in Supabase

---

**Need help?** Check the logs:
- Vercel Logs: Project → Deployments → Click deployment → Runtime Logs
- Supabase Logs: Dashboard → Logs → API Logs

# 🚀 Supabase Setup Guide for L'Gôu

This guide will walk you through setting up Supabase as your database - it's **easier and more powerful** than Vercel KV!

## 🎯 Why Supabase?

✅ **Generous free tier** - 500MB database (vs 30MB with Redis)  
✅ **PostgreSQL** - Full-featured relational database  
✅ **Beautiful dashboard** - See and edit your data visually  
✅ **Auto-generated API** - REST API included  
✅ **Real-time** - Live updates built-in  
✅ **Easy to use** - No complex configuration  
✅ **Better for your data** - Perfect for orders, customers, products  

## ⏱️ Setup Time: 15 minutes

---

## Step 1: Create Supabase Account (3 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

---

## Step 2: Create New Project (2 minutes)

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `lgou-database` (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Select **Free** tier
3. Click **"Create new project"**
4. Wait ~2 minutes while Supabase sets up your database ☕

---

## Step 3: Get Your Credentials (2 minutes)

Once your project is ready:

1. Click **Settings** (⚙️ icon in left sidebar)
2. Click **API** in the settings menu
3. You'll see your credentials:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
```

Scroll down to find:

```
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Keep these safe!** You'll need them in the next step.

---

## Step 4: Create Database Tables (3 minutes)

1. Click **SQL Editor** (📝 icon in left sidebar)
2. Click **"+ New query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste into the query editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: ✅ **Success. No rows returned**

### Verify Tables Were Created

1. Click **Table Editor** (📊 icon in left sidebar)
2. You should see 5 tables:
   - ✅ `orders`
   - ✅ `customers`
   - ✅ `products`
   - ✅ `collections`
   - ✅ `daily_stats`

Perfect! Your database is ready! 🎉

---

## Step 5: Configure Vercel Environment Variables (3 minutes)

### Go to your Vercel project:

1. Visit **https://vercel.com/dashboard**
2. Select your `lgou` project
3. Click **Settings** → **Environment Variables**

### Add these 3 variables:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Project URL (from Step 3)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your `anon public` key (from Step 3)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

**Variable 3:**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your `service_role` key (from Step 3)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

---

## Step 6: Deploy to Vercel (2 minutes)

### Push your code:

```bash
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"
git add .
git commit -m "Add Supabase integration"
git push origin main
```

Vercel will automatically deploy! 🚀

Wait ~2 minutes for deployment to complete.

---

## Step 7: Initialize Database with Your Products (5 minutes)

Now let's add your existing products to Supabase:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to **Table Editor** in Supabase
2. Click on **products** table
3. Click **"Insert"** → **"Insert row"**
4. Manually add a few products to test

### Option B: Using Bulk Import (Recommended)

1. Open `inventory-data.js` in your project
2. Copy all product data
3. Go to Supabase **SQL Editor**
4. Run this query (replace with your data):

```sql
INSERT INTO products (id, name, category, price, stock, image) VALUES
  ('bg1', 'Happy 1st Anniversary Pink', 'Background', 0, 5, 'YOUR_IMAGE_URL'),
  ('bg2', 'Happy Valentine''s', 'Background', 0, 5, 'YOUR_IMAGE_URL'),
  -- Add more products...
;
```

### Option C: Using API Endpoint

Create a simple script to bulk upload (I can help with this if needed)

---

## ✅ Verify Everything Works

### Test Your API:

**1. Test Products API:**
```bash
curl https://YOUR-DOMAIN.vercel.app/api/products
```

You should see your products!

**2. Test Creating an Order:**
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "Test Customer",
      "phone": "0123456789",
      "email": "test@test.com",
      "address": "Test Address"
    },
    "items": [{"id": "bg1", "name": "Test", "price": 50000}],
    "total": 50000
  }'
```

**3. Check in Supabase:**
- Go to **Table Editor** → **orders**
- You should see your test order! 🎉

---

## 🎨 Using Supabase Dashboard

### View Your Data:

**Orders:**
- Table Editor → `orders`
- See all customer orders
- Edit, delete, or add orders manually

**Customers:**
- Table Editor → `customers`
- See customer info and history
- Track total orders per customer

**Products:**
- Table Editor → `products`
- Manage your inventory
- Update stock levels directly

**Real-time Monitoring:**
- Click any table
- Click "Refresh" to see latest data
- Filter and search easily

---

## 🔐 Security Notes

### Your credentials are safe because:

✅ Environment variables are hidden in Vercel  
✅ `service_role` key is only used server-side  
✅ `anon` key is safe for client-side use  
✅ Row Level Security (RLS) is enabled  
✅ All data is encrypted in transit  

### Optional: Tighten Security Later

In Supabase Dashboard → Authentication → Policies:
- You can add custom rules
- Restrict who can read/write
- Add user authentication

For now, the default setup is fine for your use case!

---

## 📊 Monitor Your Database

### In Supabase Dashboard:

**Database** → **Usage**
- See storage used
- Monitor API requests
- Check performance

**Logs** → **API**
- See all API calls
- Debug issues
- Monitor traffic

**Reports**
- Daily/weekly summaries
- Free tier limits
- Upgrade recommendations

---

## 🆘 Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run the schema SQL again (Step 4)

### Issue: 401 Unauthorized
**Solution:** Check your API keys are correct in Vercel env variables

### Issue: CORS errors
**Solution:** API files already have CORS headers - redeploy if needed

### Issue: No data showing
**Solution:** 
1. Check data exists in Supabase Table Editor
2. Test API endpoints with curl
3. Check browser console for errors

---

## 🎉 You're Done!

Your L'Gôu website now has:

✅ Professional PostgreSQL database  
✅ Automatic order tracking  
✅ Customer management  
✅ Inventory control  
✅ Real-time statistics  
✅ Beautiful dashboard  

---

## 📚 Next Steps

1. **Load your products** into the database
2. **Test order submission** on your website
3. **Access CMS** at `your-domain.vercel.app/cms`
4. **Read CMS_USAGE_GUIDE.md** to learn how to manage everything

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Table Editor**: Click "Table Editor" in sidebar
- **SQL Editor**: Click "SQL Editor" in sidebar

---

## 💡 Pro Tips

### Backup Your Data:
1. Go to **Database** → **Backups**
2. Supabase auto-backs up daily (free tier)
3. You can also export tables as CSV

### View Live Data:
- Keep Supabase Table Editor open
- See orders come in real-time
- Make quick edits when needed

### Query Your Data:
- Use SQL Editor for complex queries
- Export data as CSV/JSON
- Create custom reports

---

## 🆚 Supabase vs Vercel KV

| Feature | Supabase | Vercel KV |
|---------|----------|-----------|
| **Storage** | 500MB | 30MB |
| **Type** | PostgreSQL | Redis |
| **Dashboard** | ✅ Full GUI | ❌ Limited |
| **Queries** | ✅ SQL | ❌ Key-value only |
| **Setup** | ✅ Easy | ⚠️ Complex |
| **Free tier** | ✅ Generous | ⚠️ Limited |
| **Real-time** | ✅ Built-in | ❌ No |

**Winner: Supabase!** 🏆

---

## 🎊 Congratulations!

You now have a **professional-grade database** that's:
- ✅ Easy to use
- ✅ Free to start
- ✅ Scalable
- ✅ Reliable
- ✅ Feature-rich

Your L'Gôu business is ready to grow! 🚀

---

*Need help? Check the troubleshooting section or Supabase documentation.*

**Created:** January 2, 2025  
**Version:** 2.0.0 (Supabase Edition)  
**For:** L'Gôu Order Management System


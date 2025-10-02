# 🚀 Deployment Checklist for L'Gôu Vercel Storage

Use this checklist to ensure everything is set up correctly before going live.

## ✅ Pre-Deployment Setup

### 1. Vercel Account Setup
- [ ] Have a Vercel account (sign up at vercel.com)
- [ ] Project is connected to Git repository (GitHub/GitLab/Bitbucket)
- [ ] Vercel CLI installed (optional, for local testing)

### 2. Vercel KV Storage
- [ ] Created KV database named "lgou-storage"
- [ ] Copied KV credentials (URL, token, read-only token)
- [ ] Selected appropriate region
- [ ] Verified KV is attached to project

### 3. Environment Variables
- [ ] Added `KV_REST_API_URL` to Vercel project
- [ ] Added `KV_REST_API_TOKEN` to Vercel project
- [ ] Added `KV_REST_API_READ_ONLY_TOKEN` to Vercel project
- [ ] Added `BLOB_READ_WRITE_TOKEN` to Vercel project
- [ ] Added `ADMIN_AUTH_KEY` to Vercel project (create a secure random key)
- [ ] Saved all environment variables

### 4. Code Preparation
- [ ] All API files are in `/api` directory
- [ ] `package.json` includes `@vercel/kv` dependency
- [ ] `vercel.json` is configured correctly
- [ ] `cms-api-integration.js` is in root directory
- [ ] Documentation files are included

## 📦 Deployment Steps

### Step 1: Push Code to Repository
```bash
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"
git add .
git commit -m "Add Vercel Storage integration"
git push origin main
```
- [ ] Code pushed successfully
- [ ] No merge conflicts

### Step 2: Deploy on Vercel
**Option A: Automatic Deployment**
- [ ] Vercel automatically detected changes
- [ ] Build process started
- [ ] Deployment successful
- [ ] Got deployment URL

**Option B: Manual Deployment**
```bash
vercel --prod
```
- [ ] Deployment command completed
- [ ] Got deployment URL

### Step 3: Verify Deployment
- [ ] Visit your deployment URL
- [ ] Main website loads correctly
- [ ] Images load properly
- [ ] No console errors

## 🗄️ Database Initialization

### Initialize with Existing Inventory

**Option A: Using curl (recommended)**

1. Open your terminal
2. Run this command (replace values):

```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/init-database \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_ADMIN_AUTH_KEY",
    "inventoryData": [...copy from inventory-data.js...],
    "accessoriesData": [...copy from accessories-pets-data.js...],
    "petsData": [...copy from accessories-pets-data.js...]
  }'
```

**Option B: Using Postman/Insomnia**

1. Create new POST request
2. URL: `https://YOUR-DOMAIN.vercel.app/api/init-database`
3. Headers: `Content-Type: application/json`
4. Body: JSON with authKey and data arrays
5. Send request

**Checklist:**
- [ ] Database initialization completed
- [ ] Got success response
- [ ] Products count matches inventory

## 🧪 Testing

### API Endpoints Testing

**Test Orders API:**
```bash
# Get all orders
curl https://YOUR-DOMAIN.vercel.app/api/orders

# Create test order
curl -X POST https://YOUR-DOMAIN.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "Test Customer",
      "phone": "0123456789",
      "email": "test@test.com",
      "address": "Test Address"
    },
    "items": [{"id": "bg1", "name": "Test Product", "price": 50000}],
    "total": 50000
  }'
```

- [ ] GET /api/orders works
- [ ] POST /api/orders works
- [ ] Order appears in database

**Test Products API:**
```bash
# Get all products
curl https://YOUR-DOMAIN.vercel.app/api/products

# Get specific product
curl https://YOUR-DOMAIN.vercel.app/api/products?id=bg1
```

- [ ] GET /api/products works
- [ ] Products data is correct
- [ ] Stock levels are accurate

**Test Stats API:**
```bash
curl https://YOUR-DOMAIN.vercel.app/api/stats
```

- [ ] GET /api/stats works
- [ ] Statistics are calculating correctly

### CMS Testing

Access CMS at: `https://YOUR-DOMAIN.vercel.app/cms`

**Login:**
- [ ] Can access CMS login page
- [ ] Can log in with admin credentials
- [ ] Dashboard loads

**Dashboard:**
- [ ] Statistics cards show data
- [ ] Numbers update correctly
- [ ] No console errors

**Orders Tab:**
- [ ] Can view orders list
- [ ] Test order appears
- [ ] Can update order status
- [ ] Status changes persist

**Inventory Tab:**
- [ ] Products load correctly
- [ ] Can update stock levels
- [ ] Changes save to database
- [ ] Out-of-stock detection works

**Collections Tab:**
- [ ] Can view collections
- [ ] Can create new collection
- [ ] Can edit collection
- [ ] Can delete collection

**Customers Tab:**
- [ ] Customers list loads
- [ ] Customer data is correct
- [ ] Order history shows

### Website Testing

Visit: `https://YOUR-DOMAIN.vercel.app`

**Order Flow:**
- [ ] Can customize product
- [ ] Price calculates correctly
- [ ] Can fill customer info
- [ ] Order submission works
- [ ] Success message appears
- [ ] Order appears in CMS immediately

**Inventory Integration:**
- [ ] Products load from database
- [ ] Stock levels are accurate
- [ ] Out-of-stock items show correctly

## 🔐 Security Checklist

### Credentials
- [ ] Changed CMS admin password (in cms.html)
- [ ] Changed manager password (in cms.html)
- [ ] `ADMIN_AUTH_KEY` is secure and random
- [ ] No sensitive data in public code

### Environment Variables
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] `.env` files not committed to git
- [ ] Only example files in repository

### API Security
- [ ] CORS headers configured
- [ ] Input validation in place
- [ ] Method validation working
- [ ] Rate limiting considered (optional)

## 📊 Monitoring Setup

### Vercel Dashboard
- [ ] Check deployment logs
- [ ] Monitor function execution times
- [ ] Check error rates
- [ ] Monitor KV storage usage

### Browser Console
- [ ] No JavaScript errors on website
- [ ] No API call failures
- [ ] No network errors

## 🎨 Final Touches

### Content
- [ ] Update contact information
- [ ] Update social media links
- [ ] Update logo URL if needed
- [ ] Review product descriptions

### SEO
- [ ] Update meta tags
- [ ] Update Open Graph tags
- [ ] Update site title/description
- [ ] Add favicon

### Performance
- [ ] Test website speed
- [ ] Verify images load fast
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

## 📱 Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on mobile Firefox
- [ ] Check touch interactions
- [ ] Verify mobile navigation

## 🌐 Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 📧 Post-Deployment

### Notifications
- [ ] Set up email notifications (optional)
- [ ] Configure Google Sheets sync (optional)
- [ ] Test notification delivery

### Backup
- [ ] Create first database backup
- [ ] Document backup location
- [ ] Set backup schedule

### Documentation
- [ ] Share CMS credentials with team
- [ ] Share access to Vercel dashboard
- [ ] Provide training if needed

## ⚠️ Common Issues & Solutions

### Issue: 500 Error on API calls
**Solution:**
- Check Vercel function logs
- Verify environment variables are set
- Check KV database connection

### Issue: Products not loading
**Solution:**
- Verify database was initialized
- Check API endpoint `/api/products`
- Review browser console errors

### Issue: Orders not saving
**Solution:**
- Check `/api/orders` endpoint
- Verify KV credentials
- Check function logs for errors

### Issue: CMS not loading data
**Solution:**
- Check browser console
- Verify API endpoints are working
- Clear browser cache

## ✅ Go-Live Checklist

**Before announcing to customers:**
- [ ] All tests passed
- [ ] CMS fully functional
- [ ] Order submission working
- [ ] Inventory syncing correctly
- [ ] Email/phone contacts updated
- [ ] Social media links working
- [ ] Payment info correct
- [ ] Backup created
- [ ] Team trained on CMS

**Announcement:**
- [ ] Update social media
- [ ] Send to customer list
- [ ] Update Google Business
- [ ] Update marketing materials

## 🎉 Launch!

Once all items are checked:
- [ ] Website is live!
- [ ] CMS is operational
- [ ] Ready to receive orders
- [ ] Team knows how to use CMS

## 📞 Support Contacts

**Technical Issues:**
- Vercel Support: https://vercel.com/support
- Developer Documentation: See project README

**Business Support:**
- Your developer/technical contact
- Vercel community forums
- GitHub issues (if applicable)

---

## 📊 Success Metrics to Track

After launch, monitor:
- [ ] Total orders per day
- [ ] Customer conversion rate
- [ ] Most popular products
- [ ] Average order value
- [ ] Peak traffic times
- [ ] Mobile vs desktop usage

---

**Congratulations! Your L'Gôu website is ready to go! 🎉**

Keep this checklist for future reference and updates.

Last updated: 2025-01-02
Version: 2.0.0


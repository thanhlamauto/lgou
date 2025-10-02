# CMS Usage Guide for L'Gôu

## 🎯 Overview

The L'Gôu CMS is your central hub for managing orders, customers, inventory, and collections. All data is stored in Vercel KV storage and syncs in real-time.

## 🔐 Accessing the CMS

1. Navigate to: `https://your-domain.vercel.app/cms` or `https://your-domain.vercel.app/cms.html`
2. Login with credentials:
   - **Admin**: `admin` / `lgou2025`
   - **Manager**: `manager` / `manager123`

⚠️ **Important**: Change these passwords in the code before going live!

## 📊 Dashboard Overview

When you first log in, you'll see the dashboard with key metrics:

### Statistics Cards
- **Đơn hàng hôm nay** - Orders received today with % change
- **Doanh thu tháng này** - Monthly revenue with comparison
- **Sản phẩm hết hàng** - Out of stock items count
- **Khách hàng mới** - New customers in last 7 days

## 🛍️ Orders Management

### View Orders
1. Click **"Đơn hàng"** tab
2. See all orders with:
   - Order ID
   - Customer name
   - Product details
   - Total amount
   - Status (New, Processing, Completed, Cancelled)
   - Order date

### Update Order Status
1. Find the order in the list
2. Click **"Hoàn thành"** button to mark as completed
3. Or click **"Xem"** to view full details and update

### Sync with Google Sheets
1. Click **"Đồng bộ với Google Sheets"** button
2. Orders will be exported to your configured spreadsheet
3. Configure Google Sheets in the Settings tab

### Order Statuses
- 🆕 **New** (Mới) - Just received, needs processing
- ⏳ **Processing** (Đang xử lý) - Being prepared
- ✅ **Completed** (Hoàn thành) - Fulfilled
- ❌ **Cancelled** (Đã hủy) - Cancelled by customer or admin

## 🎨 Collections Management

### View Collections
1. Click **"Collections"** tab
2. See all special/limited collections
3. Each collection shows:
   - Name and description
   - Status (Active/Expired)
   - End date
   - Discount percentage
   - Features

### Create New Collection
1. Click **"Thêm Collection Mới"**
2. Fill in:
   - **Tên Collection** - Collection name
   - **Mô tả** - Description
   - **Ngày kết thúc** - End date/time
   - **Giảm giá (%)** - Discount percentage (0-100)
   - **Icon** - Font Awesome icon class (e.g., `fas fa-heart`)
   - **Features** - Comma-separated features
3. Click **"Lưu Collection"**

### Edit Collection
1. Find collection in list
2. Click **"Sửa"** button
3. Update details
4. Click **"Lưu Collection"**

### Toggle Collection Status
- Click **"Bật/Tắt"** button to activate/deactivate
- Deactivated collections won't show on the website

### Delete Collection
1. Click **"Xóa"** button
2. Confirm deletion
3. ⚠️ This cannot be undone!

### Collection Inventory
Scroll down to see **"Quản lý kho đồ Collection"**:
- View all products in each collection
- Update stock levels for collection-specific items
- Track availability

## 📦 Inventory Management

### View Inventory
1. Click **"Quản lý kho"** tab
2. Products are grouped by category:
   - Background
   - Nhân vật (Characters)
   - Phụ kiện (Accessories)
   - Thú cưng (Pets)

### Add New Product
1. Click **"Thêm sản phẩm mới"**
2. Fill in the form:
   - **ID sản phẩm** - Unique ID (e.g., `bg15`, `acc34`)
   - **Tên sản phẩm** - Product name
   - **Danh mục** - Category
   - **Giá** - Price in VND (0 for free)
   - **Số lượng tồn kho** - Stock quantity
   - **Ảnh sản phẩm** - Upload image or enter URL
3. Click **"Thêm sản phẩm"**

### Upload Product Image
Two options:
1. **Upload File**: Click "Choose File" and select image
2. **Enter URL**: Paste image URL in the text field

Images are stored in Vercel Blob Storage.

### Edit Product
1. Find product in inventory list
2. Click **✏️ (edit icon)**
3. Update details
4. Click **"Cập nhật sản phẩm"**

### Update Stock
- Find product in inventory
- Change the number in **"Tồn kho"** field
- Stock updates automatically

### Delete Product
1. Find product in inventory
2. Click **🗑️ (trash icon)**
3. Confirm deletion
4. ⚠️ This cannot be undone!

### Out of Stock Products
Products with 0 stock show **"Hết hàng"** in red.

## 👥 Customers Management

### View Customers
1. Click **"Khách hàng"** tab
2. See all customers with:
   - Name
   - Phone number
   - Email
   - Address
   - Total orders
   - Last order date

### Customer Information
The system automatically:
- Creates customer profiles from orders
- Tracks order history
- Updates contact information
- Records first and last order dates

### Customer Insights
- Sort by recent customers
- See total orders per customer
- Track customer lifetime value

## ⚙️ Settings

### Google Sheets Integration

1. Click **"Cài đặt"** tab
2. Scroll to **"Tích hợp Google Sheets"**
3. Enter:
   - **URL Google Sheets** - Your spreadsheet URL
   - **API Key** - Your Google Sheets API key
4. Click **"Lưu cài đặt"**
5. Test connection with **"Test kết nối"**

**Status Indicator:**
- 🟢 Green = Connected
- 🔴 Red = Not connected

### Notification Settings

Configure email notifications:
1. Check **"Thông báo email khi có đơn hàng mới"**
2. Enter **"Email nhận thông báo"**
3. Settings save automatically

### Data Backup

#### Create Backup
1. Click **"Backup ngay"**
2. A JSON file downloads with all data
3. Save this file securely

#### Restore Data
1. Click **"Khôi phục dữ liệu"**
2. Select your backup JSON file
3. Confirm restoration
4. ⚠️ This will overwrite current data!

### Backup Schedule
- Backup daily for safety
- Keep backups in multiple locations
- Test restore process periodically

## 🔄 Data Sync

All data syncs automatically between:
- Website → Database (when orders placed)
- Database → CMS (real-time)
- CMS → Database (when you make changes)

### Real-time Updates
- Orders appear immediately after customer submission
- Stock updates instantly across website and CMS
- Customer data updates automatically
- Statistics refresh in real-time

## 📈 Best Practices

### Daily Checklist
- [ ] Check new orders
- [ ] Update order statuses
- [ ] Review stock levels
- [ ] Respond to customer inquiries
- [ ] Update out-of-stock products

### Weekly Tasks
- [ ] Review customer data
- [ ] Update collections
- [ ] Analyze sales statistics
- [ ] Create backup
- [ ] Check inventory trends

### Monthly Tasks
- [ ] Review monthly statistics
- [ ] Update product catalog
- [ ] Archive old orders
- [ ] Backup all data
- [ ] Review and update collections

## 🛡️ Security Tips

1. **Change default passwords immediately**
2. **Log out when not in use**
3. **Don't share login credentials**
4. **Use strong passwords**
5. **Enable two-factor authentication (if available)**
6. **Regular backups**
7. **Keep browser updated**

## ⌨️ Keyboard Shortcuts

- **Tab** - Navigate between fields
- **Enter** - Submit forms
- **Esc** - Close modals
- **Ctrl/Cmd + S** - Save (where applicable)

## 🐛 Troubleshooting

### Data Not Showing
1. Refresh the page (F5)
2. Check internet connection
3. Verify you're logged in
4. Check browser console for errors

### Can't Upload Images
1. Check file size (< 4.5MB recommended)
2. Use supported formats (JPG, PNG, GIF, WebP)
3. Try entering URL instead
4. Check Blob storage quota

### Orders Not Updating
1. Refresh the page
2. Check if order ID is correct
3. Verify database connection
4. Check Vercel deployment status

### Inventory Not Syncing
1. Refresh inventory tab
2. Check product IDs are unique
3. Verify database connection
4. Check for JavaScript errors

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Review Vercel deployment logs
3. Verify environment variables
4. Check API endpoint status
5. Contact your developer

## 🎓 Training Resources

### Video Tutorials (Create These)
1. Getting Started with CMS
2. Managing Orders
3. Inventory Management
4. Creating Collections
5. Customer Management
6. Backup and Restore

### Documentation
- This guide
- VERCEL_STORAGE_SETUP.md
- API documentation

## 📋 Glossary

- **CMS** - Content Management System
- **KV** - Key-Value database (Vercel storage)
- **Blob Storage** - File storage for images
- **API** - Application Programming Interface
- **CRUD** - Create, Read, Update, Delete operations

## 🎉 Getting Started Checklist

- [ ] Log in to CMS
- [ ] Change default password
- [ ] Review existing inventory
- [ ] Check current orders
- [ ] Set up Google Sheets (optional)
- [ ] Configure email notifications
- [ ] Create first backup
- [ ] Add test product
- [ ] Create test order
- [ ] Familiarize with all tabs

---

**You're now ready to manage your L'Gôu business like a pro! 🚀**

For questions or support, refer to VERCEL_STORAGE_SETUP.md or contact your developer.


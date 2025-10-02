# L'Gôu - Hệ thống đặt hàng Tranh Lego

## 🎨 Giới thiệu
L'Gôu là hệ thống website đặt hàng tranh Lego cá nhân hóa với tính năng quản lý CMS hoàn chỉnh. Hệ thống được thiết kế để tự động hóa quy trình từ đặt hàng đến quản lý kho và khách hàng.

## ✨ Tính năng chính

### Website đặt hàng (index.html)
- 🎯 **Giao diện hiện đại**: Thiết kế responsive, thân thiện trên mọi thiết bị
- 🎨 **Tùy chỉnh sản phẩm**: 
  - Chọn version (1-3 nhân vật)
  - Custom background theo yêu cầu
  - Chọn màu áo, quần cho từng nhân vật
  - Thêm tóc, mũ, phụ kiện, thú cưng
- 💰 **Tính toán tự động**: Giá, phí ship, mã giảm giá
- 📱 **Tích hợp social**: Zalo, Facebook, Instagram
- 📊 **Lưu trạng thái**: LocalStorage lưu lựa chọn người dùng

### CMS Quản lý (cms.html)
- 🔐 **Đăng nhập bảo mật**: Multi-user với phân quyền
- 📈 **Dashboard**: Thống kê real-time
  - Đơn hàng hôm nay
  - Doanh thu tháng
  - Sản phẩm hết hàng
  - Khách hàng mới
- 📋 **Quản lý đơn hàng**: Xem, cập nhật trạng thái
- 📦 **Quản lý kho**: Cập nhật số lượng, cảnh báo hết hàng
- 👥 **Quản lý khách hàng**: Lịch sử mua hàng, thông tin liên hệ
- 🔧 **Cài đặt**: Google Sheets integration, backup/restore

### Google Sheets Integration
- 📊 **Tự động lưu**: Đơn hàng và thông tin khách hàng
- 🔄 **Đồng bộ 2 chiều**: CMS ↔ Google Sheets
- 📈 **Báo cáo**: Thống kê tự động từ dữ liệu Sheets
- 💾 **Backup**: An toàn dữ liệu trên cloud

## 🚀 Quick Start

### 1. Cài đặt cơ bản
```bash
# Clone hoặc download project
# Upload files lên hosting (GitHub Pages, Netlify, Vercel)
```

### 2. Cấu hình Google Sheets
1. Tạo Google Sheets mới
2. Deploy Google Apps Script (file: `google-apps-script.js`)
3. Cập nhật URL trong `index.html`

### 3. Truy cập hệ thống
- **Website**: `index.html`
- **CMS**: `cms.html`
- **Login**: admin/lgou2025 hoặc manager/manager123

## 📱 Screenshots

### Website chính
- Giao diện đặt hàng trực quan
- Tùy chỉnh sản phẩm real-time
- Checkout flow mượt mà

### CMS Dashboard
- Thống kê tổng quan
- Quản lý đơn hàng
- Kiểm soát tồn kho

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins, Montserrat)
- **Backend**: Vercel Serverless Functions + Google Apps Script
- **Database**: Supabase PostgreSQL (500MB free) + Google Sheets (optional)
- **Storage**: Vercel Blob (images) + LocalStorage (client-side)
- **Hosting**: Vercel

## 🗄️ **NEW: Supabase Database Integration**

L'Gôu giờ đây có hệ thống database chuyên nghiệp với Supabase PostgreSQL!

### Tính năng mới
- 📦 **Order Tracking** - Tự động lưu và quản lý đơn hàng
- 👥 **Customer Management** - Theo dõi lịch sử và insights khách hàng
- 📊 **Inventory Control** - Quản lý kho real-time
- 🎨 **Collections** - Quản lý collections phiên bản giới hạn
- 📈 **Analytics** - Dashboard với thống kê kinh doanh
- 💾 **Data Persistence** - PostgreSQL database với 500MB free
- 🎯 **Visual Dashboard** - Xem và edit data trực tiếp trong Supabase

### Hướng dẫn mới
- **[Quick Start (15 phút)](QUICK_START_SUPABASE.md)** - Setup siêu nhanh
- **[Supabase Setup Guide](SUPABASE_SETUP.md)** - Hướng dẫn chi tiết
- **[CMS Usage Guide](CMS_USAGE_GUIDE.md)** - Cách sử dụng hệ thống quản lý
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Chi tiết kỹ thuật

### Quick Start với Supabase
1. Làm theo [QUICK_START_SUPABASE.md](QUICK_START_SUPABASE.md) - chỉ 15 phút!
2. Deploy lên Vercel
3. Add products vào database
4. Truy cập CMS tại `/cms` hoặc `/cms.html`
5. Bắt đầu quản lý business của bạn!

## 📁 Cấu trúc project

```
new web/
├── index.html                    # Website chính
├── cms.html                      # Trang CMS
├── cms-api-integration.js        # Library tích hợp API cho CMS
├── google-apps-script.js         # Script tích hợp Google Sheets
├── inventory-data.js             # Dữ liệu sản phẩm
├── accessories-pets-data.js      # Dữ liệu phụ kiện và thú cưng
├── package.json                  # Dependencies
├── vercel.json                   # Cấu hình Vercel
├── env.example                   # Template biến môi trường
├── api/
│   ├── orders.js                # API quản lý đơn hàng
│   ├── customers.js             # API quản lý khách hàng
│   ├── products.js              # API quản lý sản phẩm
│   ├── collections.js           # API quản lý collections
│   ├── stats.js                 # API thống kê
│   └── upload.js                # API upload ảnh
├── lib/
│   └── supabase.js              # Supabase client setup
├── supabase-schema.sql          # Database schema (chạy trong Supabase)
├── SETUP_GUIDE.md               # Hướng dẫn setup cơ bản
├── QUICK_START_SUPABASE.md      # Setup nhanh 15 phút ⚡
├── SUPABASE_SETUP.md            # Hướng dẫn chi tiết Supabase
├── CMS_USAGE_GUIDE.md           # Hướng dẫn sử dụng CMS
├── IMPLEMENTATION_SUMMARY.md    # Tổng kết triển khai
└── README.md                    # File này

Note: Logo được sử dụng từ URL online: https://i.postimg.cc/7YKWGsqK/logo-L-Go-u-tra-ng-page-0001.jpg
```

## 🎨 Customization

### Thay đổi branding
1. **Logo**: Thay file logo và cập nhật path trong HTML
2. **Màu sắc**: Sửa CSS variables trong `:root`
3. **Thông tin liên hệ**: Cập nhật số điện thoại, social links

### Thêm sản phẩm
1. Cập nhật object `productOptions` trong `index.html`
2. Thêm hình ảnh và thông tin sản phẩm
3. Cập nhật inventory trong CMS

### Tích hợp thanh toán
- Có thể mở rộng để tích hợp VNPay, MoMo, PayPal
- Framework sẵn sàng cho payment gateway

## 🔐 Bảo mật

- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection (Google Apps Script)
- ✅ Authentication cho CMS
- ✅ Data encryption trong transit

## 📊 Analytics & Tracking

- Google Sheets làm database
- Real-time statistics
- Customer behavior tracking
- Inventory monitoring
- Revenue reporting

## 🚀 Performance

- ⚡ Lazy loading images
- 📱 Mobile-first design
- 🗜️ Optimized assets
- 💾 LocalStorage caching
- 🔄 Efficient API calls

## 🆘 Support

### Tài khoản CMS mặc định
- **Admin**: admin / lgou2025
- **Manager**: manager / manager123

### Troubleshooting
1. **Không gửi được đơn**: Kiểm tra Google Apps Script URL
2. **CMS không load data**: Cấu hình Google Sheets
3. **Lỗi đăng nhập**: Xóa cache browser

### Liên hệ hỗ trợ
- 📧 Email: support@lgou.com
- 📱 Zalo: 0964.393.115
- 🌐 Website: https://lgou.com

## 📝 Changelog

### Version 2.0.0 (2025-01-02) - **NEW** 🎉
- 🗄️ **Supabase Integration** - PostgreSQL database với dashboard đẹp
- 📦 **Full Order Tracking** - Complete order management system
- 👥 **Customer Database** - Customer history and insights
- 📊 **Real-time Inventory** - Stock management with PostgreSQL
- 🎨 **Collections System** - Limited edition management
- 📈 **Analytics Dashboard** - Business statistics and metrics
- 🔌 **RESTful APIs** - Professional API endpoints
- 💾 **Data Persistence** - No more data loss (500MB free tier)
- 📚 **Complete Documentation** - Setup chỉ 15 phút!
- 🎯 **Visual Data Management** - Supabase dashboard tích hợp

### Version 1.0.0 (2025-01-01)
- ✨ Ra mắt website L'Gôu
- 🎨 Rebrand từ The Luvin
- 🆕 CMS quản lý hoàn chỉnh
- 📊 Tích hợp Google Sheets
- 🔐 Hệ thống authentication
- 📱 Responsive design
- 🛍️ Shopping cart tự động
- 💳 Mã giảm giá system

## 🔮 Roadmap

### Version 1.1.0
- [ ] Tích hợp payment gateway
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics

### Version 1.2.0
- [ ] Mobile app
- [ ] Customer portal
- [ ] Loyalty program
- [ ] Multi-language support

## 📄 License

© 2025 L'Gôu. All rights reserved.

---

**Được phát triển với ❤️ cho thương hiệu L'Gôu**

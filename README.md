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
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Storage**: LocalStorage cho client-side

## 📁 Cấu trúc project

```
new web/
├── index.html                    # Website chính
├── cms.html                      # Trang CMS
├── google-apps-script.js         # Script tích hợp Google Sheets
├── SETUP_GUIDE.md               # Hướng dẫn setup chi tiết
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

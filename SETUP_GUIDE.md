# Hướng dẫn Setup L'Gôu Website & CMS

## 🎯 Tổng quan
Hệ thống L'Gôu bao gồm:
- **Website chính** (`index.html`): Trang đặt hàng cho khách hàng
- **CMS Admin** (`cms.html`): Trang quản lý cho admin
- **Google Sheets Integration**: Lưu trữ đơn hàng và khách hàng

## 📋 Danh sách files
```
new web/
├── index.html              # Website chính
├── cms.html                # Trang quản lý CMS
├── google-apps-script.js   # Script để tích hợp Google Sheets
├── logo L'Gôu trắng_page-0001.jpg  # Logo thương hiệu
└── SETUP_GUIDE.md          # File hướng dẫn này
```

## 🚀 Bước 1: Chuẩn bị Google Sheets

### 1.1 Tạo Google Sheets mới
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới với tên "L'Gôu Orders Management"
3. Lưu lại **Spreadsheet ID** từ URL (phần giữa `/d/` và `/edit`)
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 1.2 Setup Google Apps Script
1. Truy cập [Google Apps Script](https://script.google.com)
2. Tạo project mới với tên "L'Gôu Integration"
3. Xóa code mặc định, copy toàn bộ nội dung từ file `google-apps-script.js`
4. **QUAN TRỌNG**: Thay `YOUR_SPREADSHEET_ID_HERE` bằng Spreadsheet ID thực tế
5. Lưu project (Ctrl+S)

### 1.3 Deploy Apps Script
1. Click nút "Deploy" > "New deployment"
2. Chọn type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy **Web app URL** (dạng: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`)

## 🔧 Bước 2: Cấu hình Website

### 2.1 Cập nhật URL Apps Script
1. Mở file `index.html`
2. Tìm dòng:
   ```javascript
   const scriptURL = 'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID_HERE/exec';
   ```
3. Thay `YOUR_NEW_SCRIPT_ID_HERE` bằng Script ID thực tế từ bước 1.3

### 2.2 Logo đã được cấu hình
Logo L'Gôu đã được cấu hình sử dụng URL online: `https://i.postimg.cc/7YKWGsqK/logo-L-Go-u-tra-ng-page-0001.jpg`
- Không cần upload file logo riêng
- Logo sẽ tự động hiển thị từ cloud

## 🔐 Bước 3: Cấu hình CMS

### 3.1 Thông tin đăng nhập mặc định
- **Username**: `admin` / **Password**: `lgou2025`
- **Username**: `manager` / **Password**: `manager123`

### 3.2 Thay đổi mật khẩu (khuyến khích)
1. Mở file `cms.html`
2. Tìm section:
   ```javascript
   const ADMIN_CREDENTIALS = {
       'admin': 'lgou2025',
       'manager': 'manager123'
   };
   ```
3. Thay đổi mật khẩu theo ý muốn

### 3.3 Cấu hình Google Sheets trong CMS
1. Truy cập CMS tại `cms.html`
2. Đăng nhập với tài khoản admin
3. Vào tab "Cài đặt"
4. Nhập:
   - **URL Google Sheets**: URL đầy đủ của spreadsheet
   - **API Key**: Web app URL từ bước 1.3
5. Click "Lưu cài đặt" và "Test kết nối"

## 🌐 Bước 4: Deploy Website

### 4.1 Hosting đơn giản (GitHub Pages, Netlify, Vercel)
1. Upload toàn bộ thư mục `new web` lên hosting
2. Đảm bảo `index.html` là file chính
3. Test website và CMS

### 4.2 Hosting với domain riêng
1. Cấu hình DNS trỏ về hosting
2. Cập nhật meta tags trong `index.html`:
   ```html
   <meta property="og:url" content="https://yourdomain.com/">
   ```

## 📊 Bước 5: Test hệ thống

### 5.1 Test đặt hàng
1. Truy cập website chính
2. Thực hiện đặt hàng thử nghiệm
3. Kiểm tra Google Sheets xem có nhận được dữ liệu

### 5.2 Test CMS
1. Truy cập CMS
2. Đăng nhập và kiểm tra các tab:
   - **Đơn hàng**: Xem đơn hàng từ Google Sheets
   - **Quản lý kho**: Cập nhật số lượng sản phẩm
   - **Khách hàng**: Xem danh sách khách hàng
   - **Cài đặt**: Test kết nối Google Sheets

## 🔧 Tính năng CMS

### Dashboard
- Thống kê đơn hàng hôm nay
- Doanh thu tháng
- Sản phẩm hết hàng
- Khách hàng mới

### Quản lý đơn hàng
- Xem danh sách đơn hàng
- Cập nhật trạng thái
- Đồng bộ với Google Sheets

### Quản lý kho
- Cập nhật số lượng tồn kho
- Cảnh báo hết hàng
- Lưu trữ local và sync

### Quản lý khách hàng
- Danh sách khách hàng
- Lịch sử mua hàng
- Thông tin liên hệ

### Cài đặt
- Cấu hình Google Sheets
- Backup/Restore dữ liệu
- Cài đặt thông báo

## 🛠️ Troubleshooting

### Lỗi không gửi được đơn hàng
1. Kiểm tra URL Apps Script trong `index.html`
2. Đảm bảo Apps Script đã deploy đúng cách
3. Kiểm tra quyền truy cập của Apps Script

### CMS không hiển thị dữ liệu
1. Kiểm tra cấu hình Google Sheets trong tab Cài đặt
2. Test kết nối Google Sheets
3. Đảm bảo Spreadsheet ID đúng trong Apps Script

### Lỗi đăng nhập CMS
1. Kiểm tra username/password trong code
2. Xóa cache trình duyệt
3. Thử trình duyệt khác

## 📞 Hỗ trợ

Nếu cần hỗ trợ kỹ thuật, vui lòng cung cấp:
1. URL website
2. Screenshot lỗi (nếu có)
3. Thông tin hosting đang sử dụng
4. Bước đã thực hiện

---

## 🎨 Customization

### Thay đổi màu sắc
Trong file `index.html` và `cms.html`, tìm section `:root` để thay đổi màu:
```css
:root {
    --primary: #2c3e50;        /* Màu chính */
    --primary-light: #3498db;  /* Màu phụ */
    --accent: #e67e22;         /* Màu nhấn */
    --accent-light: #f39c12;   /* Màu nhấn sáng */
}
```

### Thay đổi sản phẩm
Trong file `index.html`, tìm object `productOptions` để:
- Thêm/xóa background
- Cập nhật giá sản phẩm
- Thêm tùy chọn mới

### Thay đổi thông tin liên hệ
Cập nhật các thông tin:
- Số điện thoại Zalo
- Link Facebook/Instagram
- Email hỗ trợ
- Địa chỉ công ty

---

**© 2025 L'Gôu - Hệ thống quản lý đơn hàng tự động**

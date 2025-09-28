# 🚀 Hướng dẫn Deploy L'Gôu Website lên Vercel

## 📋 Chuẩn bị trước khi deploy

### 1. Kiểm tra files cần thiết
Đảm bảo thư mục `new web` có đầy đủ files:
```
new web/
├── index.html              # Website chính
├── cms.html               # CMS quản lý
├── inventory-data.js      # Dữ liệu sản phẩm
├── accessories-pets-data.js # Dữ liệu phụ kiện & pets
├── google-apps-script.js  # Script Google Sheets
├── vercel.json           # Cấu hình Vercel (đã tạo)
├── package.json          # Metadata project (đã tạo)
├── .gitignore           # Git ignore file (đã tạo)
├── README.md            # Tài liệu
└── SETUP_GUIDE.md       # Hướng dẫn setup
```

## 🔧 Vercel Blob Storage Setup

### Enable Vercel Blob Storage

1. **Go to Vercel Dashboard** → Your Project → Storage
2. **Click "Create Database"** → Select "Blob"
3. **Copy the token** (starts with `vercel_blob_rw_`)
4. **Add Environment Variable**:
   - Go to Project Settings → Environment Variables
   - Add: `BLOB_READ_WRITE_TOKEN` = your_token_here
   - Redeploy the project

### Test Image Upload

After deployment, test the image upload in CMS:
1. Go to `/cms` → Inventory tab
2. Click "Thêm sản phẩm mới"
3. Upload an image file
4. The image will be stored in Vercel Blob Storage

## ☁️ Các cách deploy lên Vercel

### 🥇 Cách 1: Deploy từ GitHub (Khuyến nghị)

#### Bước 1: Push code lên GitHub
```bash
# Mở terminal trong thư mục "new web"
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"

# Khởi tạo Git repository
git init

# Thêm tất cả files
git add .

# Commit đầu tiên
git commit -m "🎉 Initial commit - L'Gôu website v1.0"

# Đổi branch thành main
git branch -M main

# Thêm remote repository (thay your-username bằng username GitHub của bạn)
git remote add origin https://github.com/your-username/lgou-website.git

# Push lên GitHub
git push -u origin main
```

#### Bước 2: Deploy trên Vercel
1. **Truy cập**: [vercel.com](https://vercel.com)
2. **Đăng nhập**: Bằng GitHub account
3. **New Project**: Click nút "New Project"
4. **Import Repository**: Chọn repository `lgou-website`
5. **Configure**: 
   - Project Name: `lgou-website`
   - Framework Preset: `Other`
   - Root Directory: `./` (mặc định)
6. **Deploy**: Click "Deploy"

### 🥈 Cách 2: Deploy với Vercel CLI

#### Bước 1: Cài đặt Vercel CLI
```bash
# Cài đặt global
npm install -g vercel

# Hoặc dùng yarn
yarn global add vercel
```

#### Bước 2: Deploy
```bash
# Di chuyển vào thư mục project
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"

# Login Vercel (sẽ mở browser để đăng nhập)
vercel login

# Deploy project
vercel
```

#### Bước 3: Follow prompts
```
? Set up and deploy "~/Downloads/DEV/new web"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? lgou-website
? In which directory is your code located? ./
```

### 🥉 Cách 3: Drag & Drop (Đơn giản nhất)

1. **Truy cập**: [vercel.com/new](https://vercel.com/new)
2. **Drag & Drop**: Kéo thả toàn bộ thư mục `new web` vào trang
3. **Wait**: Vercel sẽ tự động upload và deploy
4. **Done**: Nhận link website sau vài phút

## 🔗 Sau khi deploy thành công

### URLs truy cập:
- **🏠 Website chính**: `https://your-project.vercel.app`
- **⚙️ CMS**: `https://your-project.vercel.app/cms`
- **📱 Mobile**: Responsive, hoạt động tốt trên mobile

### 🎛️ Vercel Dashboard Features:
- **Analytics**: Xem traffic, performance
- **Domains**: Thêm domain tùy chỉnh
- **Environment Variables**: Cấu hình biến môi trường
- **Functions**: Deploy serverless functions (nếu cần)

## ⚙️ Cấu hình nâng cao

### Custom Domain
1. Vào Vercel Dashboard → Project → Settings → Domains
2. Add domain của bạn (vd: `lgou.com`)
3. Cấu hình DNS records theo hướng dẫn
4. Vercel sẽ tự động tạo SSL certificate

### Environment Variables (nếu cần)
```bash
# Thêm biến môi trường
vercel env add GOOGLE_SHEETS_URL
```

### Automatic Deployments
- Mỗi khi push code lên GitHub → Vercel tự động deploy
- Preview deployments cho pull requests
- Rollback dễ dàng nếu có lỗi

## 🔧 Troubleshooting

### ❌ Lỗi thường gặp:

#### 1. "404 Not Found" khi truy cập `/cms`
**Nguyên nhân**: Routing chưa được cấu hình đúng
**Giải pháp**: Đảm bảo file `vercel.json` có trong project

#### 2. LocalStorage không hoạt động
**Nguyên nhân**: HTTPS required
**Giải pháp**: Vercel tự động cung cấp HTTPS, không cần lo

#### 3. Images không load
**Nguyên nhân**: Path không đúng
**Giải pháp**: Sử dụng relative paths hoặc absolute URLs

#### 4. CMS không load inventory
**Nguyên nhân**: JavaScript files không được serve
**Giải pháp**: Kiểm tra `inventory-data.js` và `accessories-pets-data.js` có trong thư mục

### ✅ Kiểm tra deployment thành công:
1. ✅ Website chính load được
2. ✅ CMS truy cập được qua `/cms`
3. ✅ Inventory hiển thị đầy đủ
4. ✅ Collections hoạt động
5. ✅ LocalStorage lưu được dữ liệu
6. ✅ Responsive trên mobile

## 🎯 Best Practices

### 1. **Git Workflow**
```bash
# Tạo branch mới cho features
git checkout -b feature/new-collection

# Commit changes
git add .
git commit -m "✨ Add Christmas collection"

# Push và tạo PR
git push origin feature/new-collection
```

### 2. **Monitoring**
- Sử dụng Vercel Analytics để theo dõi traffic
- Check logs trong Vercel Dashboard
- Set up notifications cho deployments

### 3. **Performance**
- Images đã được optimize
- CSS/JS được minify tự động
- CDN global của Vercel

## 🚀 Go Live Checklist

- [ ] ✅ All files uploaded
- [ ] ✅ Website loads correctly
- [ ] ✅ CMS accessible via `/cms`
- [ ] ✅ All inventory data displays
- [ ] ✅ Collections working
- [ ] ✅ Mobile responsive
- [ ] ✅ LocalStorage functioning
- [ ] ✅ Google Sheets integration (if configured)
- [ ] ✅ Custom domain (optional)
- [ ] ✅ SSL certificate active

## 🎉 Congratulations!

Bạn đã successfully deploy L'Gôu website lên Vercel! 

**Next steps:**
1. 📱 Test trên mobile devices
2. 🔗 Share link với team/customers  
3. 📊 Monitor analytics
4. 🚀 Add new features và deploy updates

---

**Need help?** 
- 📧 Contact: [Vercel Support](https://vercel.com/help)
- 📖 Docs: [Vercel Documentation](https://vercel.com/docs)
- 💬 Community: [Vercel Discord](https://discord.gg/vercel)

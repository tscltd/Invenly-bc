# 📦 Invenly – Smart Inventory Management System

Invenly là hệ thống quản lý vật phẩm thông minh giúp tổ chức dễ dàng theo dõi, nhập liệu, mượn trả và kiểm kê vật phẩm như sách, quà tặng, hoặc vật tư nội bộ. Tích hợp tính năng quét mã QR và nhập dữ liệu hàng loạt qua file Excel.

---

## 🔗 Demo

- 🌐 Website: [invenly.vercel.app](https://invenly.vercel.app/)
- 🧪 API base: [https://invenly-service.vercel.app/api/](https://invenly-service.vercel.app/api/)

---

## 🧰 Tech Stack

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend**: [Express.js](https://expressjs.com/), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Mongoose](https://mongoosejs.com/)
- **Authentication**: JSON Web Token (JWT)
- **QR Scanner**: `html5-qrcode`
- **File Upload**: `multer` + Cloudinary
- **Hosting**: Vercel (FE & BE deployed separately)
- **Dev Tools**: TypeScript, Nodemon, ESLint, Prettier

---

## ⚙️ Getting Started (Local Dev)

### 1. Clone repo

```bash
git clone https://github.com/yourname/invenly.git
cd invenly
```

### 2. Setup Frontend

```bash
cd invenly-frontend
cp .env.local.example .env.local
# Update .env.local with your API url
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd invenly-backend
cp .env.example .env
# Update MongoDB URI, JWT secret, Cloudinary keys
npm install
npm run dev
```


## ✨ Core Features

- ✅ Đăng nhập & phân quyền

- 📚 Quản lý vật phẩm theo loại (sách, quà, vật tư,…)

- 📥 Nhập dữ liệu hàng loạt từ Excel

- 🧾 Gán mã QR và quét QR để truy cập thông tin nhanh

- 🖼 Cập nhật ảnh từng vật phẩm

- 📊 Trang xem thư viện sách với tìm kiếm nâng cao

- 🧩 Quản lý thuộc tính động cho mỗi vật phẩm

- 🗑 Xoá mềm (soft delete)

## 📂 Folder Structure

```graphql
invenly/
├── invenly-frontend/   # Next.js client app
└── invenly-backend/    # Express REST API server
```

## 🧪 API Preview

Xem chi tiết tại [đây](/invenly-backend/api.md)

## 👨‍💻 Contributing

PRs and issues welcome. Please follow coding standards and keep commits atomic.

## 📜 License

MIT © [dangth.dev](https://dangth.dev)


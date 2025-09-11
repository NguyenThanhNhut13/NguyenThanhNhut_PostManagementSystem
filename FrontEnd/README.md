# FrontEnd - Post Management System

## Giới thiệu

Frontend của hệ thống quản lý bài viết, xây dựng bằng React + TypeScript + Vite.

## Test trực tiếp trên môi trường deploy

Bạn có thể trải nghiệm và kiểm thử FrontEnd trực tiếp trên môi trường deploy tại:

https://nguyen-thanh-nhut-post-management-s.vercel.app/

## Cài đặt & chạy

```bash
npm install
npm run dev
```

- Mặc định chạy ở http://localhost:3000
- Đảm bảo backend đã chạy ở http://localhost:8080 (hoặc chỉnh sửa biến môi trường trong `.env`)

## Cấu hình API

- Sửa file `.env` để trỏ đúng URL backend:
  ```
  VITE_API_URL=http://localhost:8080/api
  ```

## Build & Deploy

```bash
npm run build
```
- Output nằm ở thư mục `dist/`

## Các chức năng chính

- Đăng ký, đăng nhập (JWT)
- Quản lý bài viết: tạo, xem, sửa, xóa
- Hiển thị thông báo (toast) khi thao tác thành công/thất bại
- Điều hướng bằng React Router

# FrontEnd - Post Management System

## Giới thiệu

Đây là frontend của hệ thống quản lý bài viết, xây dựng bằng React, TypeScript và Vite. Dự án này được phát triển theo yêu cầu thực tập, đáp ứng các chức năng quản lý người dùng, bài viết, xác thực và giao tiếp với backend.

## Test trực tiếp trên môi trường deploy

Bạn có thể trải nghiệm và kiểm thử FrontEnd trực tiếp trên môi trường deploy tại:

https://nguyen-thanh-nhut-post-management-s.vercel.app/

## Công nghệ sử dụng

- React
- TypeScript
- Vite
- Redux Toolkit
- Axios

## Cài đặt & chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động server phát triển

```bash
npm run dev
```

- Mặc định chạy ở http://localhost:3000

## Cấu hình API

- Sửa file `.env` để trỏ đúng URL backend (ví dụ khi deploy trên Render):

  ```
  RENDER_URL=https://nguyenthanhnhut-postmanagementsystem.onrender.com/api
  ```

- Đảm bảo backend đã chạy ở đúng địa chỉ này.

- [Tải file .env từ Google Drive](https://drive.google.com/drive/folders/1j3elf4vwnu3OxrMUk3XpZajc69X-SIgt?usp=sharing)

## Các chức năng chính

- Đăng ký, đăng nhập
- Quản lý bài viết (tạo, sửa, xóa, xem chi tiết)
- Quản lý người dùng (dành cho admin)
- Hiển thị thông báo (Toast)
- Bảo vệ route (ProtectedRoute, AdminRoute)

## Lưu ý

- Đảm bảo backend đã deploy và cho phép CORS để frontend truy cập API.
- Nếu thay đổi endpoint backend, cần sửa lại biến môi trường trong `.env` và build lại frontend.
- Source code đã được tổ chức rõ ràng theo các module: components, services, store, slices.

## Tác giả

Nguyen Thanh Nhut

---

© 2025 Nguyen Thanh Nhut - Post Management System Frontend
        changeOrigin: true,

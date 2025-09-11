# Post Management System

## Giới thiệu

Post Management System là ứng dụng web đơn giản giúp quản lý bài viết, gồm hai phần:
- **Backend**: Java Spring Boot (REST API)
- **Frontend**: React (TypeScript)
- **Database**: MySQL (dùng cloud Aiven)
- **Authentication**: JWT

Ứng dụng cho phép người dùng đăng ký, đăng nhập, tạo, xem, chỉnh sửa, xóa bài viết của mình.  
Kiến trúc tách biệt FE/BE, giao tiếp qua API.

## Kiến trúc thư mục

```
NguyenThanhNhut_PostManagementSystem/
│
├── BackEnd/      # Mã nguồn backend (Spring Boot)
├── FrontEnd/     # Mã nguồn frontend (React)
├── README.md     # Tài liệu tổng quan (file này)
```

- Xem hướng dẫn chi tiết cho từng phần tại:
	- [BackEnd/README.md](./BackEnd/README.md)
	- [FrontEnd/README.md](./FrontEnd/README.md)

## Công nghệ sử dụng

- **Backend**: Java 17+, Spring Boot, Spring Security, JPA/Hibernate, JWT, Maven
- **Frontend**: React, TypeScript, Vite, Axios, React Router
- **Database**: MySQL (hoặc H2)
- **Khác**: BCrypt, dotenv, Toast UI

## Hướng dẫn chạy nhanh toàn bộ hệ thống

### 1. Chuẩn bị môi trường

- Cài đặt **Java 17+**, **Node.js 16+**, **npm**, **MySQL** (nếu dùng MySQL)
- Clone repo về máy

### 2. Cài đặt & chạy Backend

```bash
cd BackEnd
# Cài đặt dependencies
mvn clean install
# Chỉnh sửa file .env hoặc application.yml cho thông tin DB (xem hướng dẫn chi tiết trong BackEnd/README.md)
# Khởi động server
mvn spring-boot:run
# hoặc chạy file jar
java -jar target/BackEnd-0.0.1-SNAPSHOT.jar
```

### 3. Cài đặt & chạy Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

- FE mặc định chạy ở http://localhost:3000
- BE mặc định chạy ở http://localhost:8080

### 4. Kiểm thử chức năng

- Truy cập FE, đăng ký tài khoản, đăng nhập, tạo/chỉnh sửa/xóa bài viết.
- JWT sẽ được lưu ở localStorage, dùng để gọi API BE.
- Nếu cần tài khoản mẫu hoặc dữ liệu mẫu, xem hướng dẫn chi tiết trong từng README.

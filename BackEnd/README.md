# BackEnd - Post Management System

## Giới thiệu

Backend API server cho hệ thống quản lý bài viết, xây dựng bằng Java Spring Boot.

## Test API trên môi trường deploy (Render)

Bạn có thể test các API trực tiếp trên môi trường deploy bằng Swagger tại địa chỉ:

https://nguyenthanhnhut-postmanagementsystem.onrender.com/swagger-ui/index.html

**Lưu ý:**
- Render bản miễn phí có thể giới hạn số lượng request, tốc độ hoặc thời gian hoạt động của server. Nếu gặp lỗi hoặc không truy cập được, hãy thử lại sau khoảng 5-15 phút để render load lại.

## Công nghệ

- Java 17+, Spring Boot, Spring Security, JPA/Hibernate, JWT, Maven
- Database: MySQL (Cloud Aiven)
- BCrypt để mã hóa mật khẩu

## Cài đặt & chạy


### 1. Cấu hình database

- Để kết nối database test trên Aiven Cloud, chỉ cần tải file `.env` mẫu tại đây:
  [Tải file .env từ Google Drive](https://drive.google.com/uc?id=YOUR_FILE_ID)

- Sau khi tải, đặt file `.env` vào thư mục `BackEnd/src/main/resources/`.

- Không cần tự tạo database, chỉ cần dùng file này để kết nối trực tiếp đến database cloud.

- Nếu muốn dùng database riêng, có thể sửa lại thông tin trong `.env` hoặc `application.yml` như sau:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASS=yourpassword
  DB_NAME=post_management
    ```

  ### 2. Cài đặt dependencies

  ```bash
  mvn clean install
  ```

  ### 3. Khởi động server

  ```bash
  mvn spring-boot:run
  # hoặc
  java -jar target/BackEnd-0.0.1-SNAPSHOT.jar
  ```

  - Mặc định chạy ở http://localhost:8080

  ### 4. Migrate schema & dữ liệu mẫu

  - Khi chạy lần đầu, Spring Boot sẽ tự động tạo bảng (nếu cấu hình JPA/Hibernate đúng).
  - Nếu cần dữ liệu mẫu, có thể thêm vào file `data.sql` hoặc logic khởi tạo trong code.

  ## Các chức năng API

  - Đăng ký, đăng nhập (JWT)
  - CRUD bài viết (chỉ tác giả mới được sửa/xóa bài viết của mình hoặc admin)
  - Bảo vệ API bằng JWT (Bearer token)
  - Xử lý lỗi rõ ràng, trả về mã HTTP phù hợp

  ## Kiểm thử

  - Đăng ký tài khoản qua API hoặc FE
  - Đăng nhập, lấy JWT
  - Tạo/sửa/xóa bài viết qua API (dùng JWT ở header Authorization)
  - Xem chi tiết bài viết

  ## Lưu ý

  - Nếu dùng H2, không cần cài MySQL, chỉ cần cấu hình lại trong `.env` hoặc `application.yml`
  - Đảm bảo cấu hình CORS cho phép FE truy cập API
  - Mật khẩu lưu ở DB đã được mã hóa (BCrypt)

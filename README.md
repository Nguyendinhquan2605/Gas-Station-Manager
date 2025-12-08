# QUẢN LÝ CÂY XĂNG

**Giới thiệu**

- Một đoạn văn ngắn gọn giới thiệu về mục đích và chức năng của dự án này [2]. Ví dụ: "Đây là một ứng dụng web Express.js đơn giản để quản lý cây xăng."

**Cài đặt**

- **Yêu cầu:**
  - Node.js (phiên bản 20.11.1 )
  - npm hoặc Yarn
- **Các bước cài đặt:**

  1.  Clone repository vào ổ D:

      ```bash
      mở cmd ở ổ D rồi dán copy câu lệnh dưới đây vào:
      git clone https://github.com/Nguyendinhquan2605/Gas-Station-Manager.git

      ```

      ```

      ```

  2.  Cài đặt các dependencies:
      ```bash
      + mở dự án với VS code, mở phần terminal rồi chạy lệnh sau:
      npm install
      ```

**Sử dụng**

- **Chạy ứng dụng:**
  ```bash
  npm start
  # hoặc
  node app.js
  ```
- **Truy cập ứng dụng:** Mở trình duyệt và truy cập `http://localhost:3000` (thay đổi cổng nếu cần).

**Các API chính**

- CLIENT:
- `GET /stations/station-data`: Lấy danh sách tất cả các cây xăng.
- `POST /stations/`: Giao diện trang chủ.

- ADMIN:
<!-- STATION -->
- `GET /admin/create-station`: Giao diện thêm mới cây xăng.
- `POST /admin/create-station`: API thêm mới cây xăng.
- `GET /admin/Alls-stations`: Giao diện danh sách cây xăng bên admin.
- `GET /admin/stations/edit/:id`: Giao diện chỉnh sửa cây xăng.
- `PATCH /admin/stations/edit/:id`: API chỉnh sửa cây xăng.
- `DELETE /admin/stations/delete/:id`: API xóa 1 cây xăng.

 <!-- BRANDS -->

- `GET /admin/create-brand`: Giao diện thêm mới thương hiệu.
- `POST /admin/create-brand`: API thêm mới cây xăng.
- `GET /admin/brands`: Giao diện danh sách thương hiệu bên admin.
- `GET /admin/brands/edit/:id`: Giao diện chỉnh sửa thương hiệu.
- `PATCH /admin/brands/edit/:id`: API chỉnh sửa thương hiệu.
- `DELETE /admin/stations/delete/:id`: API xóa 1 thương hiệu.

 <!-- FUELTYPES -->

- `GET /admin/fuel_types/create-fuel`: Giao diện thêm mới nhiên liệu.
- `POST /admin/fuel_types/create-fuel`: API thêm mới nhiên liệu.
- `GET /admin/fuel_types`: Giao diện danh sách nhiên liệu bên admin.
- `GET /admin/fuel_types/edit/:id`: Giao diện chỉnh sửa nhiên liệu.
- `PATCH /admin/fuel_types/edit/:id`: API chỉnh sửa nhiên liệu.
- `DELETE /admin/fuel_types/delete/:id`: API xóa 1 loại nhiên liệu.

**Cấu trúc dự án**

- `app.js`: File chính của ứng dụng.
- `routes/`: Chứa các file định nghĩa các route.
- `controllers/`: Chứa các hàm xử lý logic cho mỗi route.
- `models/`: Chứa các định nghĩa model (nếu sử dụng).
- `package.json`: Quản lý các dependencies và script của dự án.

**Công nghệ sử dụng**

- Node.js
- Express.js
- [Thêm các thư viện khác bạn đã sử dụng, ví dụ: `postgreSQL`, `body-parser`, `dotenv`, v.v.]

**Cảm ơn**

- Cảm ơn {Link: Quantrimang.com https://quantrimang.com/cong-nghe/cach-viet-file-readme-tot-nhat-198895} và {Link: TopDev https://topdev.vn/blog/lam-the-nao-de-viet-duoc-mot-file-readme-tot/} đã cung cấp các hướng dẫn hữu ích về cách viết file README [1, 2].

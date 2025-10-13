# Hướng dẫn Import tài khoản từ CSV

## Tính năng Import CSV

Tính năng import CSV cho phép admin import hàng loạt tài khoản người dùng từ file CSV vào hệ thống.

## Cách sử dụng

### 1. Truy cập trang Admin Dashboard
- Đăng nhập với tài khoản admin
- Vào tab "Quản lý tài khoản"
- Click nút "Import CSV"

### 2. Tải template CSV
- Click nút "Tải template" để tải file mẫu
- File template sẽ có cấu trúc chuẩn với các cột cần thiết

### 3. Chuẩn bị file CSV
File CSV phải có các cột sau (theo thứ tự):

| Cột | Tên | Bắt buộc | Mô tả | Ví dụ |
|-----|-----|----------|-------|-------|
| 1 | email | ✅ | Email đăng nhập | nguyen.van.a@example.com |
| 2 | full_name | ✅ | Họ và tên | Nguyễn Văn A |
| 3 | phone | ✅ | Số điện thoại | 0123456789 |
| 4 | department_id | ✅ | ID phòng ban | 1 |
| 5 | role_id | ✅ | ID vai trò | 2 |
| 6 | password | ❌ | Mật khẩu (tùy chọn) | password123 |

### 4. Upload và xem trước
- Chọn file CSV đã chuẩn bị
- Hệ thống sẽ tự động parse và hiển thị preview
- Kiểm tra dữ liệu trước khi import

### 5. Import tài khoản
- Click "Import tài khoản" để thực hiện
- Hệ thống sẽ hiển thị kết quả import

## Lưu ý quan trọng

### Validation dữ liệu
- **Email**: Phải đúng định dạng email và không trùng lặp
- **Họ tên**: Không được để trống
- **Số điện thoại**: Không được để trống
- **Department ID**: Phải là số nguyên dương và tồn tại trong hệ thống
- **Role ID**: Phải là số nguyên dương và tồn tại trong hệ thống

### Xử lý lỗi
- Nếu có lỗi validation, tài khoản sẽ được đánh dấu "Lỗi"
- Chỉ những tài khoản hợp lệ mới được import
- Kết quả import sẽ hiển thị số lượng thành công/thất bại

### Mật khẩu
- Nếu không cung cấp mật khẩu, hệ thống sẽ tự động tạo mật khẩu ngẫu nhiên
- Mật khẩu phải có ít nhất 6 ký tự

## Ví dụ file CSV

```csv
email,full_name,phone,department_id,role_id,password
nguyen.van.a@example.com,Nguyễn Văn A,0123456789,1,2,password123
tran.thi.b@example.com,Trần Thị B,0987654321,2,2,password456
le.van.c@example.com,Lê Văn C,0369852147,1,3,password789
```

## Troubleshooting

### Lỗi thường gặp

1. **"Thiếu các cột bắt buộc"**
   - Kiểm tra tên cột trong file CSV
   - Đảm bảo có đủ các cột: email, full_name, phone, department_id, role_id

2. **"Email không hợp lệ"**
   - Kiểm tra định dạng email
   - Đảm bảo email không trùng lặp với tài khoản hiện có

3. **"ID phòng ban/vai trò không hợp lệ"**
   - Kiểm tra ID có tồn tại trong hệ thống
   - Đảm bảo ID là số nguyên dương

4. **"Lỗi khi đọc file CSV"**
   - Kiểm tra file có đúng định dạng CSV
   - Đảm bảo file không bị lỗi encoding

### Hỗ trợ
Nếu gặp vấn đề, vui lòng liên hệ admin hệ thống.

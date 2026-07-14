# 5P Pickleball 1:1 — Landing page GitHub Pages

## Cách upload

1. Giải nén file ZIP.
2. Upload toàn bộ **nội dung bên trong thư mục** lên thư mục gốc của repository GitHub.
3. Vào **Settings → Pages → Deploy from a branch**.
4. Chọn nhánh `main`, thư mục `/ (root)`, sau đó bấm Save.

## Việc bắt buộc làm trước khi chạy quảng cáo

Mở `script.js` và thay 3 giá trị trong `SITE_CONFIG`:

```js
phoneDisplay: "SỐ HIỂN THỊ",
phoneInternational: "84...",
zaloUrl: "https://zalo.me/84..."
```

Số điện thoại trong bản bàn giao đang là **số mẫu không hoạt động** để tránh chuyển khách nhầm sang một số điện thoại thật của người khác.

## Thông tin đang dùng trên trang

- Thương hiệu: 5P Pickleball 1:1
- Huấn luyện viên: Coach Linh
- Khu vực: 36 Đường A4, Bảy Hiền, Hồ Chí Minh
- Gói trải nghiệm: 590.000đ/buổi
- Gói 8 buổi: 4.800.000đ
- Gói Business VIP 16 buổi: 8.800.000đ

Hãy kiểm tra và chỉnh lại giá, chính sách cam kết, địa điểm, hình ảnh và thông tin huấn luyện viên theo dịch vụ thực tế trước khi công khai hoặc chạy quảng cáo.

## Chỉnh nội dung

- Nội dung trang: `index.html`
- Màu sắc/giao diện: `style.css`
- Số điện thoại và xử lý form: `script.js`
- Hình ảnh: thư mục `assets/`

Form hiện tại sẽ sao chép nội dung đăng ký và mở Zalo. Website không cần backend, phù hợp để chạy trực tiếp trên GitHub Pages.

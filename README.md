# Tính điểm BTL

Trang React đơn giản sử dụng class component và `this.setState()`.

Sửa MSSV và họ tên trực tiếp trong bảng. Dùng **+ Thêm thành viên** hoặc **Xóa** để đổi số người mỗi nhóm. Số người và điểm BTL tự cập nhật; nhóm có thể xóa hết thành viên rồi thêm lại.

## Chạy bài

```sh
npm install
npm run dev
```

Mở địa chỉ được in trong terminal. Để kiểm tra bản build: `npm run build`.

## Cách tính

- Điểm nhóm chia 2 để chuyển sang thang 10.
- Mức đóng góp trung bình `x = 100 / số thành viên`.
- Với mỗi bạn dưới trung bình, tính `z = |y - x| * 10 / x`, cộng lại thành `Z`.
- Mỗi bạn trên trung bình được cộng `Z / M`; mỗi bạn dưới trung bình bị trừ `Z / N` (đúng theo đề). Bạn bằng trung bình không điều chỉnh.
- Cộng điểm thưởng (bỏ trống là 0), giới hạn kết quả tối đa 10; chỉ làm tròn 2 chữ số khi hiển thị.
- Nếu không có bạn thuộc một phía thì không chia cho 0. Tổng đóng góp được phép dưới 100%; điểm âm được giữ nguyên vì đề chỉ giới hạn trên.

Ví dụ: nhóm được 16/20, đóng góp 60% và 40%, không có điểm cộng → điểm BTL lần lượt là 10 và 6.

`src/App.jsx` chứa giao diện, dữ liệu và sự kiện `setState`; `src/calculate.js` chứa công thức tính điểm.

# Địa Chủ Tập Sự

Game cờ tỷ phú phong cách **Pastel Chibi 3D** với bàn cờ 40 ô địa danh Việt Nam, viết hoàn toàn trong **một file HTML** (`index.html`), không cần cài đặt hay máy chủ.

## Chơi thử

Mở `index.html` bằng trình duyệt, hoặc đăng lên GitHub Pages (xem bên dưới).

## Tính năng

- **Chơi với Bot** (1 đến 3 Bot, 3 mức độ), **chơi chung máy** (2 đến 4 người) và **chơi online** bằng mã phòng 5 ký tự (WebRTC qua PeerJS).
- **Phòng Thay Đồ:** nhiều kiểu nhân vật, tóc, trang phục, phụ kiện và hiệu ứng bước chân.
- **Biểu cảm** và **ném đồ tấu hài** (cà chua, mắm tôm, dép tổ ong) trong trận.
- Xúc xắc 3D, mua bán, đấu giá, giao dịch, xây nhà và khách sạn, thế chấp.
- Song ngữ **VN / EN**, giao diện tối ưu cho cả máy tính và điện thoại.

## Chơi online

Chủ phòng bấm **Tạo phòng** rồi gửi mã 5 ký tự cho bạn bè; bạn bè nhập mã ở **Vào phòng**. Game dùng máy chủ PeerJS công cộng để ghép phòng, sau đó hai máy kết nối trực tiếp với nhau.

Nếu không vào được phòng (nhất là trên iPhone/iPad):

1. Tắt **iCloud Private Relay** và **VPN**.
2. Chuyển qua lại giữa Wi-Fi và 4G/5G, hoặc dùng chung một Wi-Fi.
3. Dùng nút **Kiểm tra mạng** trong hộp thoại hướng dẫn của game.
4. Không có mạng hoặc cần chơi thử: dùng **Phòng giả lập** (chơi với Bot) hoặc **Chơi chung máy**.

## Đăng lên GitHub Pages

1. Vào **Settings > Pages**.
2. Chọn nhánh `main`, thư mục `/ (root)`, bấm **Save**.
3. Sau 1 đến 2 phút, game mở tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

## Cấu trúc

| File | Vai trò |
|------|---------|
| `index.html` | Toàn bộ game (HTML, CSS, JavaScript) |
| `LICENSE` | Giấy phép MIT |
| `.nojekyll` | Báo GitHub Pages phục vụ file nguyên bản |

## Giấy phép

[MIT](LICENSE)

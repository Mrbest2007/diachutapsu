# Địa Chủ Tập Sự · Việt Nam

Game cờ tỷ phú phong cách **Pastel Chibi 3D** với bàn cờ 40 ô địa danh Việt Nam, viết bằng HTML/CSS/JavaScript thuần, không cần cài đặt, build hay máy chủ.

## Chơi thử

Mở `index.html` bằng trình duyệt, hoặc đăng lên GitHub Pages (xem bên dưới).

## Tính năng

- **Chơi với Bot** (1 đến 3 Bot, 3 mức độ), **chơi chung máy** (2 đến 4 người) và **chơi online** bằng mã phòng 5 ký tự (WebRTC qua PeerJS, kết nối ngang hàng).
- **Chat phòng** (💬) với câu chào nhanh (Chào!, Nhanh lên nào, Giao dịch không?, GG); tin nhắn hiện thành bong bóng trên đầu nhân vật, tối ưu cho điện thoại.
- **Chat giọng nói**: nút 🎤 Micro ở phòng chờ và trong ván (cần HTTPS và cấp quyền micro); người đang bật mic có biểu tượng 🎙️ cạnh tên.
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

### Vào phòng không được trên Viettel / 4G / 5G
Mạng di động và CGNAT thường dùng NAT đối xứng nên chỉ STUN là không đủ, cần **máy chủ TURN riêng** chạy được. Điền TURN của bạn trong `js/netconf.js` (`turn` hoặc `iceUrl`); hộp thoại **Kiểm tra mạng** trong game sẽ báo TURN đã hoạt động chưa. Để không phụ thuộc CDN, có thể đặt `peerjs.min.js` vào `js/vendor/` (game thử file này trước):
`curl -L https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js -o js/vendor/peerjs.min.js`

Ghi chú kỹ thuật cho Safari iOS: STUN Google/Cloudflare kèm TURN dự phòng, máy chủ PeerJS luôn dùng wss/https (cổng 443), tự nối lại và heartbeat khi rớt mạng, storage có bản dự phòng trên RAM khi Safari chặn localStorage.

## Đăng lên GitHub Pages

1. Vào **Settings > Pages**.
2. Chọn nhánh `main`, thư mục `/ (root)`, bấm **Save**.
3. Sau 1 đến 2 phút, game mở tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

## Cấu trúc

| File | Vai trò |
|------|---------|
| `index.html` | Khung trang, nạp CSS và các script theo thứ tự |
| `css/style.css` | Toàn bộ giao diện |
| `js/engine.js` | Luật chơi, trạng thái ván (không phụ thuộc DOM) |
| `js/bot.js` | AI của Bot |
| `js/avatar.js` | Kho phụ kiện, avatar 3D blind box |
| `js/audio.js` | Âm thanh (Web Audio) |
| `js/utils.js` | Tiện ích, hiệu ứng nền, pháo hoa, nhà và khách sạn SVG |
| `js/i18n.js` | Đa ngôn ngữ VN / EN |
| `js/rules.js` | Nội dung luật chơi |
| `js/ui-menu.js` | Menu, cài đặt, phòng thay đồ, gacha |
| `js/board.js` | Bàn cờ 3D |
| `js/hud.js` | HUD và hộp thoại |
| `js/netconf.js` | **Cấu hình mạng**: máy chủ báo hiệu, STUN, TURN |
| `js/main.js` | Điều khiển, mạng online, khởi động |
| `LICENSE` | Giấy phép MIT |
| `.nojekyll` | Báo GitHub Pages phục vụ file nguyên bản |

Các script là script thường dùng chung phạm vi toàn cục nên **thứ tự nạp trong `index.html` quan trọng**.

## Giấy phép

[MIT](LICENSE)

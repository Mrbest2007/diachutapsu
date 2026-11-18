# Địa Chủ Tập Sự · Việt Nam

Game cờ tỉ phú phong cách Pastel Chibi 3D, chạy trực tiếp trên trình duyệt (HTML/CSS/JS thuần, không cần build).

## Chế độ chơi
- Chơi với Bot (1–3 Bot, 3 mức độ)
- Chơi chung máy (2–4 người)
- Chơi Online qua mã phòng 5 ký tự (WebRTC / PeerJS, kết nối ngang hàng)
- Khung chat phòng (💬) + câu chào nhanh (Chào!, Nhanh lên nào, Giao dịch không?, GG); tin nhắn hiện thành bong bóng trên đầu nhân vật, tối ưu cho điện thoại
- Chat giọng nói: nút 🎤 Micro ở phòng chờ và trong ván (cần HTTPS và cấp quyền micro); người đang bật mic có biểu tượng 🎙️ cạnh tên

## Chạy thử
Mở `index.html` bằng trình duyệt, hoặc bật GitHub Pages (Settings → Pages → Deploy from branch → `main` / root)
để có địa chỉ HTTPS dùng chung cho chế độ Online.

## Ghi chú kết nối (Safari iOS)
- STUN Google/Cloudflare + TURN dự phòng, `iceTransportPolicy: 'all'`
- Máy chủ PeerJS luôn dùng wss/https (cổng 443)
- Tự động nối lại, heartbeat, nối lại ván khi bị rớt mạng
- Storage có bản dự phòng trên RAM khi Safari chặn localStorage
- Dòng trạng thái kết nối hiển thị trên màn hình để dễ gỡ lỗi

## Cấu trúc thư mục
```
index.html        # khung trang, nạp CSS và các script theo thứ tự
css/style.css     # toàn bộ giao diện
js/engine.js      # luật chơi, trạng thái ván (không phụ thuộc DOM)
js/bot.js         # AI của Bot
js/avatar.js      # kho phụ kiện, avatar 3D blind box
js/audio.js       # âm thanh (Web Audio)
js/utils.js       # tiện ích, hiệu ứng nền, pháo hoa, nhà & khách sạn SVG
js/i18n.js        # đa ngôn ngữ VI / EN
js/rules.js       # nội dung luật chơi
js/ui-menu.js     # menu, cài đặt, phòng thay đồ, gacha
js/board.js       # bàn cờ 3D
js/hud.js         # HUD và hộp thoại
js/main.js        # điều khiển, mạng online, khởi động
```
Các script là script thường dùng chung phạm vi toàn cục nên **thứ tự nạp trong `index.html` quan trọng**.

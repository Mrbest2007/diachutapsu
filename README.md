# Địa Chủ Tập Sự · Việt Nam

Game cờ tỉ phú phong cách Pastel Chibi 3D, chạy trực tiếp trên trình duyệt (một file `index.html`).

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

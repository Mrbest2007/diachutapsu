'use strict';
/* ================= CẤU HÌNH MẠNG (chỉnh ở đây, không cần sửa main.js) =================
   Game dùng PeerJS = WebRTC DataChannel (P2P) + máy chủ báo hiệu PeerJS Cloud qua WSS :443.
   Hai người chỉ nối được trực tiếp khi NAT cho phép. Mạng di động / CGNAT (Viettel 4G/5G, một số FTTH)
   thường là NAT đối xứng: STUN không đủ, BẮT BUỘC có máy chủ TURN chạy được để chuyển tiếp dữ liệu. */
const NET_CONF={
 /* Máy chủ báo hiệu PeerJS. Chủ phòng và khách phải dùng CÙNG máy chủ.
    Muốn ổn định hơn: tự dựng PeerServer (npm i peer) rồi đổi host/port/path/key tại đây. */
 signal:{host:'0.peerjs.com',port:443,path:'/',key:'peerjs'},

 /* STUN: nhiều nhà cung cấp, có cổng 443 phòng khi nhà mạng chặn UDP 19302 của Google */
 stun:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478','stun:global.stun.twilio.com:3478','stun:stun.nextcloud.com:443'],

 /* CÁCH 1 (khuyến nghị): TURN của riêng bạn (coturn tự dựng, hoặc gói miễn phí của Metered / Xirsys / ExpressTURN...).
    Điền đủ UDP 3478, TCP 443 và TLS 443 để vượt cả mạng chặn UDP:
    {urls:['turn:TEN-MIEN:3478','turn:TEN-MIEN:443?transport=tcp','turns:TEN-MIEN:443?transport=tcp'],username:'...',credential:'...'} */
 turn:[],

 /* CÁCH 2: URL trả về danh sách iceServers (JSON mảng, hoặc {iceServers:[...]}) với thông tin đăng nhập ngắn hạn.
    Ví dụ Metered: 'https://TENAPP.metered.live/api/v1/turn/credentials?apiKey=KHOA' (kiểm tra lại trong dashboard của họ). */
 iceUrl:'',

 /* TURN công cộng dùng chung (openrelayproject): chỉ là dự phòng cuối, KHÔNG đảm bảo hoạt động/đủ băng thông. Tắt khi đã có TURN riêng. */
 legacyTurn:true
};

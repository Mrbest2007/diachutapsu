'use strict';
/* ================= ĐA NGÔN NGỮ (VI / EN) ================= */
let LANG=LS.get('dcts_lang','vi')==='en'?'en':'vi';
const L=(vi,en)=>LANG==='en'?en:vi;
const langLabel=()=>`🌐 <b class="${LANG==='vi'?'on':''}">VN</b> / <b class="${LANG==='en'?'on':''}">EN</b>`;
const langChips=()=>`<button class="pill" data-a="langToggle" aria-label="Language">${langLabel()}</button>`;
/* Văn bản nguồn là tiếng Việt; khi chọn English, mọi text node/thuộc tính được dịch theo thời gian thực bằng các bảng dưới đây */
const EXACT=Object.assign(Object.create(null),{'Dễ':'Easy','Trung bình':'Medium','Khó':'Hard','Bạn':'You','Người chơi':'Player','Tiền':'Cash','Xong':'Done','Hủy':'Cancel','Đóng':'Close','Kính':'Glasses','Bạn đưa':'You give','Thoát':'Quit','ĐỊA CHỦ':'LANDLORD','TẬP SỰ':'APPRENTICE','Đang thế chấp':'Mortgaged','Chưa có chủ':'Unowned','Ô đặc biệt':'Special tile'});
const hz=(m,n)=>n+(+n===1?' house':' houses');
const RXA=[
[/^Đang tìm phòng (.*)\.\.\.$/,'Looking for room $1...'],
[/^Đã vào phòng (.*)$/,'Joined room $1'],
[/^Không tìm thấy phòng ([A-Z0-9]{5})\. Kiểm tra lại mã hoặc nhờ chủ phòng tạo lại\.$/,'Room $1 not found. Check the code or ask the host to create it again.'],
[/^Không kết nối được tới phòng ([A-Z0-9]{5})\. .*$/,'Could not connect to room $1. Your network may be blocking P2P connections (try another Wi-Fi/4G) or the host has left.'],
[/^Lỗi kết nối: (.*)$/,'Connection error: $1'],
[/^(.*) ném (.*) vào (.*)$/,'$1 throws $2 at $3'],
[/^Lượt (\d+)$/,'Turn $1'],
[/^— Lượt của (.*) —$/,"— $1's turn —"],
[/^Lượt của (.*)$/,"$1's turn"],
[/^(.*) đi trước!$/,'$1 goes first!'],
[/^(.*) tung xúc xắc được (\d+)$/,'$1 rolled $2 for turn order'],
[/^(.*) tung (\d) \+ (\d) = (\d+)( \(đôi!\))?$/,(m,a,b,c,d,e)=>`${a} rolled ${b} + ${c} = ${d}${e?' (doubles!)':''}`],
[/^(.*) hết 3 lượt, nộp phạt (\$[\d,]+)$/,'$1 served 3 turns and pays a $2 fine'],
[/^(.*) nộp (\$[\d,]+) để ra tù$/,'$1 pays $2 to leave jail'],
[/^(.*) nộp (.+) (\$[\d,]+)$/,'$1 pays $2: $3'],
[/^(.*) trả (\$[\d,]+) tiền thuê (.*) cho (.*)$/,'$1 pays $2 rent for $3 to $4'],
[/^(.*) trả (\$[\d,]+)$/,'$1 bids $2'],
[/^(.*) nợ (\$[\d,]+) \((.*)\)\. Cần bán nhà hoặc thế chấp\.$/,'$1 owes $2 ($3). Sell houses or mortgage property.'],
[/^(.*) nợ (\$[\d,]+) \((.*)\) nhưng không đủ tiền mặt!$/,'$1 owes $2 ($3) but cannot pay in cash!'],
[/^(.*) qua ô BẮT ĐẦU, nhận (\$[\d,]+)$/,'$1 passes START and collects $2'],
[/^(.*) bị tống vào tù!$/,'$1 is thrown into jail!'],
[/^(.*) rút thẻ (Cơ Hội|Khí Vận): (.*)$/,'$1 draws a $2 card: $3'],
[/^(.*) ra tù nhờ xúc xắc đôi$/,'$1 rolled doubles and leaves jail'],
[/^(.*) vẫn ở trong tù \(lần (\d)\/3\)$/,'$1 stays in jail (attempt $2/3)'],
[/^(.*) ra đôi 3 lần liên tiếp!$/,'$1 rolled doubles 3 times in a row!'],
[/^(.*) dùng thẻ Ra Tù Miễn Phí$/,'$1 uses a Get Out of Jail Free card'],
[/^(.*) mua (.*) giá (\$[\d,]+)$/,'$1 buys $2 for $3'],
[/^(.*) bỏ qua$/,'$1 passes'],
[/^(.*) xây (khách sạn|nhà) tại (.*)$/,(m,a,b,c)=>`${a} builds a ${b==='nhà'?'house':'hotel'} on ${c}`],
[/^(.*) bán nhà tại (.*) \(\+(\$[\d,]+)\)$/,'$1 sells a house on $2 (+$3)'],
[/^(.*) thế chấp (.*) \(\+(\$[\d,]+)\)$/,'$1 mortgages $2 (+$3)'],
[/^(.*) chuộc (.*) \(-(\$[\d,]+)\)$/,'$1 redeems $2 (-$3)'],
[/^(.*) đề nghị giao dịch với (.*)$/,'$1 offers a trade to $2'],
[/^(.*) từ chối giao dịch$/,'$1 declines the trade'],
[/^(.*) và (.*) giao dịch thành công!$/,'$1 and $2 completed a trade!'],
[/^Đấu giá · (.*)$/,'Auction · $1'],
[/^Đấu giá (.*)!$/,'Auction: $1!'],
[/^(.*) thắng đấu giá (.*) với (\$[\d,]+)$/,'$1 wins the auction for $2 with $3'],
[/^Không ai mua (.*)$/,'Nobody bought $1'],
[/^(.*) PHÁ SẢN và bị loại!$/,'$1 went BANKRUPT and is out!'],
[/^(.*) CHIẾN THẮNG!$/,'$1 WINS!'],
[/^(.*) mất kết nối, Bot tiếp quản$/,'$1 disconnected, a Bot takes over'],
[/^(.*) đang ở tù \(lần (\d)\/3\)$/,'$1 is in jail (attempt $2/3)'],
[/^Đang ở tù \(lần (\d)\/3\)$/,'In jail (attempt $1/3)'],
[/^(.*) dừng tại (.*), giá (\$[\d,]+)$/,'$1 landed on $2, price $3'],
[/^(.*) đã xong lượt đi$/,'$1 has finished moving'],
[/^Đang đấu giá (.*)$/,'Auction in progress: $1'],
[/^(.*) đến ([^\d].*)$/,'$1 arrives at $2'],
[/^Trở thành Địa Chủ giàu nhất với (\$[\d,]+) tiền mặt và (\d+) tài sản\.$/,'Became the richest Landlord with $1 in cash and $2 properties.'],
[/^Quản lý tài sản · (.*)$/,'Manage properties · $1'],
[/^Tiền mặt (\$[\d,]+) · còn (\d+) nhà, (\d+) khách sạn trong ngân hàng$/,'Cash $1 · Bank has $2 houses and $3 hotels left'],
[/^Tiền mặt của bạn: (.*)$/,'Your cash: $1'],
[/^Giá cao nhất: (.*)$/,'Highest bid: $1'],
[/^Dẫn đầu: (.*)$/,'Leading: $1'],
[/^Còn trong cuộc: (.*)$/,'Still in: $1'],
[/^Bạn nhận từ (.*)$/,'You get from $1'],
[/^Bắt đầu \((\d+) người\)$/,'Start ($1 players)'],
[/^(\d+) người$/,'$1 players'],
[/^Tên người chơi (\d+)$/,'Player $1 name'],
[/^Màu tóc (#\w+)$/,'Hair color $1'],
[/^Màu (#\w+)$/,'Color $1'],
[/^Sở hữu (\d) ga$/,(m,n)=>'Own '+n+(+n===1?' station':' stations')],
[/^Nộp (\$[\d,]+)$/,'Pay $1'],
[/^Xây \((\$[\d,]+)\)$/,'Build ($1)'],
[/^Bán nhà \(\+(\$[\d,]+)\)$/,'Sell house (+$1)'],
[/^Thế chấp \(\+(\$[\d,]+)\)$/,'Mortgage (+$1)'],
[/^Chuộc \((\$[\d,]+)\)$/,'Redeem ($1)'],
[/^Mua (\$[\d,]+)$/,'Buy $1'],
[/^Trả nợ (\$[\d,]+)$/,'Pay debt $1'],
[/^Giá (\$[\d,]+)$/,'Price $1'],
[/^Đã bán (\$[\d,]+)$/,'Sold $1'],
[/^Phòng ([A-Z0-9]{4,6})$/,'Room $1'],
[/^Không kết nối được: (.*)\. Hãy kiểm tra mạng rồi thử lại \(chơi online cần mở file trực tiếp bằng trình duyệt\)\.$/,'Could not connect: $1. Please check your network and try again (online play needs the file opened directly in a browser).']
];
const RXB=[[/(\d+) nhà/g,hz],[/Người chơi (\d+)/g,'Player $1']];
const PH=[
/* tên ô */
['Chợ Đồng Xuân','Dong Xuan Market'],['Tháp Rùa','Turtle Tower'],['Thuế Thu Nhập','Income Tax'],['Ga Hà Nội','Hanoi Station'],['Văn Miếu','Temple of Literature'],['Chùa Một Cột','One Pillar Pagoda'],['Hồ Tây','West Lake'],['Thăm Tù','Just Visiting'],['THĂM TÙ','VISITING'],['Ở TÙ','IN JAIL'],['Nhà Máy Điện','Power Plant'],['Tràng An','Trang An'],['Vịnh Hạ Long','Ha Long Bay'],['Ga Huế','Hue Station'],['Đại Nội Huế','Hue Imperial City'],['Chùa Thiên Mụ','Thien Mu Pagoda'],['Nghỉ Mát Miễn Phí','Free Parking'],['NGHỈ MÁT','FREE'],['MIỄN PHÍ','PARKING'],['Cầu Rồng','Dragon Bridge'],['Bà Nà Hills','Ba Na Hills'],['Phố Cổ Hội An','Hoi An Ancient Town'],['Ga Đà Nẵng','Da Nang Station'],['Đà Lạt','Da Lat'],['Nhà Máy Nước','Water Works'],['Mũi Né','Mui Ne'],['Vào Tù','Go To Jail'],['VÀO TÙ','GO TO JAIL'],['Chợ Bến Thành','Ben Thanh Market'],['Nhà Thờ Đức Bà','Notre-Dame Cathedral'],['Bưu Điện TP','City Post Office'],['Ga Sài Gòn','Saigon Station'],['Dinh Độc Lập','Independence Palace'],['Thuế Xa Xỉ','Luxury Tax'],['Cơ Hội','Chance'],['CƠ HỘI','CHANCE'],['Khí Vận','Community Chest'],['KHÍ VẬN','COMMUNITY CHEST'],['BẮT ĐẦU','START'],['Nhận $200','Collect $200'],
/* thẻ Cơ Hội / Khí Vận */
['Tiến tới ô BẮT ĐẦU. Nhận $200.','Advance to START. Collect $200.'],
['Tiến tới Phố Cổ Hội An. Qua ô BẮT ĐẦU nhận $200.','Advance to Hoi An Ancient Town. If you pass START, collect $200.'],
['Tiến tới Sa Pa. Qua ô BẮT ĐẦU nhận $200.','Advance to Sa Pa. If you pass START, collect $200.'],
['Tiến tới Công ty tiện ích gần nhất. Nếu có chủ, tung xúc xắc và trả 10 lần số điểm.','Advance to the nearest Utility. If owned, roll the dice and pay 10 times the amount rolled.'],
['Tiến tới Nhà ga gần nhất. Nếu có chủ, trả gấp đôi tiền thuê.','Advance to the nearest Station. If owned, pay double the rent.'],
['Ngân hàng trả cổ tức. Nhận $50.','The bank pays you a dividend. Collect $50.'],
['Thẻ Ra Tù Miễn Phí. Giữ lại để dùng khi cần.','Get Out of Jail Free. Keep this card until needed.'],
['Lùi lại 3 ô.','Go back 3 spaces.'],
['Vào tù. Đi thẳng vào tù, không qua ô BẮT ĐẦU.','Go to Jail. Go directly to jail, do not pass START.'],
['Sửa chữa nhà cửa. Trả $25 mỗi nhà, $100 mỗi khách sạn.','Property repairs. Pay $25 per house and $100 per hotel.'],
['Phạt chạy quá tốc độ. Trả $15.','Speeding fine. Pay $15.'],
['Đi tới Ga Hà Nội. Qua ô BẮT ĐẦU nhận $200.','Go to Hanoi Station. If you pass START, collect $200.'],
['Tiến tới Landmark 81.','Advance to Landmark 81.'],
['Bạn được bầu làm chủ tịch hội đồng. Trả $50 cho mỗi người chơi.','You are elected chairman of the board. Pay each player $50.'],
['Khoản vay xây dựng đáo hạn. Nhận $150.','Your building loan matures. Collect $150.'],
['Ngân hàng nhầm có lợi cho bạn. Nhận $200.','Bank error in your favor. Collect $200.'],
['Phí bác sĩ. Trả $50.','Doctor fee. Pay $50.'],
['Bán cổ phiếu được lời. Nhận $50.','You sell stock for a profit. Collect $50.'],
['Quỹ kỳ nghỉ đáo hạn. Nhận $100.','Holiday fund matures. Collect $100.'],
['Hoàn thuế thu nhập. Nhận $20.','Income tax refund. Collect $20.'],
['Sinh nhật của bạn. Nhận $10 từ mỗi người chơi.','It is your birthday. Collect $10 from every player.'],
['Bảo hiểm nhân thọ đáo hạn. Nhận $100.','Life insurance matures. Collect $100.'],
['Viện phí bệnh viện. Trả $100.','Hospital fees. Pay $100.'],
['Học phí. Trả $50.','School fees. Pay $50.'],
['Phí tư vấn. Nhận $25.','Consultancy fee. Collect $25.'],
['Sửa chữa đường phố. Trả $40 mỗi nhà, $115 mỗi khách sạn.','Street repairs. Pay $40 per house and $115 per hotel.'],
['Bạn đoạt giải nhì cuộc thi sắc đẹp. Nhận $10.','You win second prize in a beauty contest. Collect $10.'],
['Thừa kế tài sản. Nhận $100.','Inheritance. Collect $100.'],
['TIN VUI','GOOD NEWS'],['THỬ THÁCH','CHALLENGE'],['BẤT NGỜ','SURPRISE'],['Đã hiểu','Got it'],
/* tên game & menu */
['ĐỊA CHỦ TẬP SỰ · VIỆT NAM','LANDLORD APPRENTICE · VIETNAM'],['ĐỊA CHỦ TẬP SỰ','LANDLORD APPRENTICE'],['Địa Chủ Tập Sự','Landlord Apprentice'],['VIỆT NAM · PASTEL CHIBI','VIETNAM · PASTEL CHIBI'],['Việt Nam · Pastel Chibi 3D','Vietnam · Pastel Chibi 3D'],
['Chơi với Bot','Play vs Bots'],['1 đến 3 Bot, 3 mức độ','1 to 3 Bots, 3 difficulty levels'],['Chơi chung máy','Pass & Play'],['2 đến 4 người, luân phiên','2 to 4 players, taking turns'],['Chơi Online','Play Online'],['Mã phòng, kết nối ngang hàng','Room code, peer-to-peer'],['Phòng thay đồ','Wardrobe'],['Tự do chọn trang phục & hiệu ứng','Freely pick outfits & effects'],['Luật Chơi','How to Play'],['Luật chơi','How to play'],['Hướng dẫn cách chơi','Learn the rules'],['Âm thanh: Tắt','Sound: Off'],['Micro: Tắt','Mic: Off'],['Khung chat','Chat'],['💬 Khung chat','💬 Chat'],['💬 Khung chat','💬 Chat'],['Chưa có tin nhắn. Hãy chào mọi người!','No messages yet. Say hi!'],['Nhập tin nhắn...','Type a message...'],['Gửi','Send'],['Micro: Bật','Mic: On'],['🎤 Micro: Tắt','🎤 Mic: Off'],['🎙️ Micro: Bật','🎙️ Mic: On'],['Âm thanh: Bật','Sound: On'],
/* thiết lập */
['Số Bot','Number of Bots'],['Độ khó Bot','Bot difficulty'],['Bot · Dễ','Bot · Easy'],['Bot · Trung bình','Bot · Medium'],['Bot · Khó','Bot · Hard'],
['Bot Dễ mua đất ngẫu nhiên và giữ tiền dư. Bot Trung bình biết gom bộ màu, xây nhà. Bot Khó tính giá trị đất khi đấu giá, giữ quỹ dự phòng và chủ động đề nghị giao dịch.','Easy Bots buy land randomly and keep spare cash. Medium Bots collect color sets and build houses. Hard Bots value land at auctions, keep a cash reserve and propose trades on their own.'],
['Đổi Bot khác','Shuffle Bots'],['Thay đồ của tôi','My outfit'],['Vào trận','Start game'],['Số người chơi','Number of players'],
['Mỗi người lần lượt thao tác trên cùng một thiết bị. Mỗi chỗ ngồi có thể mặc đồ riêng.','Players take turns on the same device. Each seat can wear its own outfit.'],['Thay đồ','Dress up'],
['Hai bạn kết nối trực tiếp qua WebRTC (PeerJS), không cần máy chủ trung gian. Chủ phòng tạo mã 5 ký tự, bạn bè nhập mã để vào.','Players connect directly through WebRTC (PeerJS) with no middle server. The host creates a 5-character code and friends enter it to join.'],
['Tạo phòng','Create room'],['Nhập mã phòng','Enter room code'],['Vào phòng','Join room'],['Mã phòng (gửi cho bạn bè)','Room code (share with friends)'],['Mã phòng','Room code'],['Phòng chờ','Lobby'],['Rời phòng','Leave room'],['Chủ phòng đã thoát','The host has left'],['Chủ phòng','Host'],['Thêm Bot cho đủ bàn','Add Bots to fill the table'],['Đang chờ chủ phòng bắt đầu ván đấu…','Waiting for the host to start the game…'],
['Đang kết nối…','Connecting…'],['Hãy nhập mã phòng 4 đến 6 ký tự.','Please enter a 4 to 6 character room code.'],['Hết thời gian tải PeerJS','PeerJS load timed out'],['PeerJS không khởi tạo được','PeerJS failed to initialize'],['Không tải được PeerJS','Could not load PeerJS'],['Máy chủ kết nối không phản hồi','The connection server did not respond'],['Không tìm thấy phòng ','Room not found: '],['Phòng đã đầy hoặc đã bắt đầu','The room is full or already started'],
['Chào!','Hi!'],['Nhanh lên nào','Hurry up!'],['Giao dịch không?','Want to trade?'],
/* phòng thay đồ */
['Phòng Thay Đồ','Wardrobe'],['Đồ mặc định','Default outfit'],['Lưu & quay lại','Save & back'],['Tên người chơi','Player name'],['Kiểu dáng','Style'],['Màu da / màu lông','Skin / fur color'],['Kiểu tóc','Hairstyle'],['Màu tóc','Hair color'],
['Chọn thoải mái: mọi trang phục, mũ, kính, phụ kiện và vệt bước chân đều có sẵn, không cần mở hộp.','Pick freely: every outfit, hat, glasses, accessory and footstep effect is unlocked, no blind boxes needed.'],
['Bé Trai','Boy'],['Bé Gái','Girl'],['Mèo Chibi','Chibi Cat'],['Cún Cưng','Puppy'],['Mèo Bông','Fluffy Cat'],['Tóc ngắn','Short hair'],['Tóc Gà Mái','Mohawk'],['Tóc Nhạc Rock','Spiky Rock Hair'],['Tóc dài','Long hair'],['Mái thưa','Side bangs'],['Vuốt ngược','Slicked back'],['Búi tóc','Bun'],['Không tóc','No hair'],['Trang phục','Outfit'],['Đầu / Mũ','Head / Hats'],['Phụ kiện','Accessories'],['Bước chân','Footsteps'],
['Áo thun trơn','Plain T-shirt'],['Vest Địa Chủ','Landlord Vest'],['Streetwear Baggy','Baggy Streetwear'],['Cardigan Len Thủ Công','Handmade Knit Cardigan'],['Hoodie Oversize','Oversized Hoodie'],['Đồ Phi Hành Gia','Astronaut Suit'],['Kigurumi Khủng Long','Dino Kigurumi'],['Trang Phục Hoàng Gia','Royal Outfit'],['Vest Kim Cương','Diamond Vest'],['Không đội','No hat'],['Mũ Tai Bèo','Bucket Hat'],['Tai Thỏ Lông Xù','Fluffy Bunny Ears'],['Mũ Chóp Mạ Vàng','Gilded Top Hat'],['Mũ Phi Hành Gia','Astronaut Helmet'],['Bờm Sư Tử','Lion Mane'],['Vương Miện Vàng','Golden Crown'],['Không đeo','None'],['Kính Ngố Gọng Tròn','Round Nerd Glasses'],['Kính Trái Tim','Heart Glasses'],['Kính Phi Công Mạ Gương','Mirrored Aviators'],['Kính Anime Lấp Lánh','Sparkly Anime Glasses'],['Không cầm','Nothing held'],['Nơ Cổ','Bow Tie'],['Trà Sữa Khổng Lồ','Giant Bubble Tea'],['Gậy Phép Địa Chủ','Landlord Magic Wand'],['Vali Tiền Đô','Suitcase of Cash'],['Cánh Thiên Thần','Angel Wings'],['Không hiệu ứng','No effect'],['Bong Bóng Xà Phòng','Soap Bubbles'],['Khói Siêu Xe','Supercar Smoke'],['Dấu Chân Tiền Vàng','Gold Coin Footprints'],['Sao Lấp Lánh','Twinkling Stars'],['Trái Tim Hồng','Pink Hearts'],['Cánh Hoa Đào','Peach Blossoms'],['Món này chưa khả dụng','This item is not available yet'],
/* HUD & bảng điều khiển */
['Trận đấu kết thúc','Game over'],['Kết thúc!','Game over!'],['Quản lý tài sản','Manage properties'],['Giao dịch','Trade'],['Dùng thẻ ra tù','Use jail card'],['Nộp phạt $50','Pay $50 fine'],['Tung đôi để ra tù','Roll doubles to leave'],['Tung xúc xắc','Roll dice'],['Bỏ qua (đấu giá)','Pass (auction)'],['Kết thúc lượt','End turn'],['Tuyên bố phá sản','Declare bankruptcy'],['Hủy đề nghị','Cancel offer'],
['Đã phá sản','Bankrupt'],['Chưa có tài sản','No properties yet'],['Thẻ ra tù','Jail-free card'],['thẻ ra tù','jail-free card(s)'],['Tự do!','Free!'],['+quà','+gifts'],['Khách sạn','Hotel'],['khách sạn','hotel'],['+Nhà','+House'],
['Nghiêng','Tilt'],['Xoay','Rotate'],['Từ trên','Top view'],['Kéo bàn cờ để xoay','Drag the board to rotate'],
['Rời khỏi trận?','Leave the game?'],['Ván đang chơi sẽ không được lưu.','The current game will not be saved.'],['Tiếp tục chơi','Keep playing'],['Rời trận','Leave game'],['CHIẾN THẮNG!','VICTORY!'],['Chơi lại','Play again'],['Về menu','Back to menu'],
['Thông tin ô đất','Property info'],['GIẤY CHỨNG NHẬN QUYỀN SỞ HỮU','TITLE DEED'],['Tiền thuê đất trống','Rent (empty lot)'],['Đủ bộ màu (×2)','Full color set (×2)'],['Với khách sạn','With hotel'],['Với ','With '],['Giá xây mỗi nhà / KS','Build cost per house / hotel'],['NHÀ GA','STATION'],['CÔNG TY TIỆN ÍCH','UTILITY'],['Có cả 2 công ty','Own both utilities'],['Có 1 công ty','Own 1 utility'],['4 × điểm xúc xắc','4 × dice roll'],['10 × điểm xúc xắc','10 × dice roll'],['Giá mua','Purchase price'],['Thế chấp nhận','Mortgage value'],['Chủ sở hữu: ','Owner: '],['đang thế chấp','mortgaged'],['(thế chấp)','(mortgaged)'],[' · đủ bộ màu',' · full color set'],
['Bạn chưa có tài sản nào.','You do not own any properties.'],['Cần trả','Must pay'],[' · tiền mặt ',' · cash '],['Tiền mặt','Cash'],['tiền mặt','cash'],
['Trả giá','Bid'],['Bỏ qua','Pass'],['Chưa có','None yet'],['chưa có','none yet'],['Bắt đầu từ $1','Starts at $1'],['Đến lượt:','Turn:'],['Số tiền trả giá','Bid amount'],['Bot đang cân nhắc…','Bot is thinking…'],['Đang chờ người chơi trả giá…','Waiting for a player to bid…'],
['Gửi đề nghị','Send offer'],['Không có đất để trao đổi','No properties to trade'],['Đề nghị giao dịch','Trade offer'],['Đề nghị không hợp lệ: kiểm tra tiền và tài sản','Invalid offer: check cash and properties'],['Từ chối','Decline'],['Đồng ý','Accept'],['đưa: ','gives: '],['không gì cả','nothing'],
['Tiền thuê ','Rent: '],['Tiền phạt tù','Jail fine'],['Thẻ bài','Card'],['Sửa chữa nhà cửa','Property repairs'],['Trả mỗi người','Pay each player'],['khoản phải trả','amount due'],
['Không có nhà để sửa — không mất gì.','You have no houses to repair, so you pay nothing.'],['Giao dịch!','Trade!'],
['Áo Nhà Sư','Monk Robe'],['Áo Nữ Tu','Nun Habit'],['Áo Đại Bàng','Eagle Jacket'],['Đầu Trọc Đáng Yêu','Cute Shaved Head'],['Khăn Trùm Nữ Tu','Nun Veil'],['Mũ Lưỡi Trai Đại Bàng','Eagle Baseball Cap'],['Kính Râm Đại Bàng','Eagle Aviator Shades'],
['Chuỗi Tràng Hạt 108 Hạt','108-Bead Prayer Necklace'],['Mõ Gỗ Nhỏ','Little Wooden Fish'],['Bát Khất Thực','Alms Bowl'],['Dây Chuyền Thánh Giá','Cross Necklace'],['Cuốn Kinh Thánh Mini','Mini Holy Book'],['Đại Bàng Chibi Đậu Vai','Chibi Eagle Shoulder Pet'],['Cánh Đại Bàng Mini','Mini Eagle Wings'],
['Hoa Sen Hồng Nở Rộ','Blooming Pink Lotus'],['Hào Quang Vàng Dịu','Soft Golden Halo'],['Ánh Sáng Lấp Lánh','Glittering Light'],['Lông Vũ Trắng Bay','Floating White Feathers'],['Vệt Lông Vũ Nâu Vàng','Golden-Brown Feather Trail'],['Tia Sét Và Gió Mạnh','Lightning and Strong Wind'],
['Bật cười','Laugh'],['Khóc mếu','Cry'],['Tức giận','Angry'],['Thả tim','Love'],['Ngạc nhiên','Surprised'],['Vỗ tay','Applaud'],['Biểu cảm','Emotes'],
['Áo Đại Bàng Đính Đá','Diamond Eagle Polo'],['Tóc Dựng Highlight Bạc','Silver-Tipped Spiky Hair'],['Quạt Giấy Hoa Sen','Lotus Paper Fan'],['Giáo Mác Tấu Hài','Silly Spear Flag'],['Kính Râm Gọng Nhỏ','Tiny Round Shades'],
['Ném đồ','Throw'],['VIỆT NAM • PASTEL CHIBI 3D','VIETNAM • PASTEL CHIBI 3D'],['Mã phòng, kết nối P2P','Room code, peer-to-peer'],['Cà chua chín','Ripe Tomato'],['cà chua chín','a ripe tomato'],['Hũ mắm tôm','Shrimp Paste Jar'],['hũ mắm tôm','a jar of shrimp paste'],['Dép tổ ong','Honeycomb Flip-Flop'],['dép tổ ong','a honeycomb flip-flop'],
['BỤP!','SPLAT!'],['THỐI QUÁ!','SO STINKY!'],['CHÁT!','SMACK!'],
['Phòng giả lập (không cần mạng)','Simulated room (no network needed)'],['Không vào được phòng? Xem hướng dẫn','Cannot join a room? See the guide'],
['Đang dùng iPhone/iPad? Nếu không vào được phòng, hãy tắt iCloud Private Relay và VPN, hoặc đổi qua lại giữa Wi-Fi và 4G/5G.','Using an iPhone/iPad? If you cannot join a room, turn off iCloud Private Relay and any VPN, or switch between Wi-Fi and 4G/5G.'],
['Phòng giả lập: chơi ngay trên thiết bị này, không cần mạng','Simulated room: play right here on this device, no network needed'],
['Phòng giả lập · chỉ chơi trên thiết bị này','Simulated room · plays on this device only'],['KHÔNG CẦN MẠNG','NO NETWORK NEEDED'],['Thử tạo phòng thật lại','Try creating a real room again'],['Phòng giả lập','Simulated room'],
['Đang kết nối máy chủ...','Connecting to server...'],['Phòng đã sẵn sàng','Room is ready'],['Mất kết nối máy chủ, đang kết nối lại...','Lost connection to the server, reconnecting...'],
['Hãy nhập đúng mã phòng 5 ký tự.','Please enter the exact 5-character room code.'],
['Máy chủ kết nối không phản hồi. Kiểm tra mạng hoặc thử lại sau ít phút.','The connection server is not responding. Check your network or try again in a few minutes.'],
['Mạng đang chặn kết nối P2P. Hãy thử đổi sang Wi-Fi hoặc 4G khác, tắt VPN, rồi thử lại.','Your network is blocking P2P connections. Try another Wi-Fi or 4G, turn off any VPN, then retry.'],
['Không kết nối được máy chủ. Mạng có thể đang chặn WebSocket (Wi-Fi công ty/trường học?), hãy thử 4G hoặc mạng khác.','Could not reach the server. Your network may be blocking WebSockets (work/school Wi-Fi?). Try 4G or another network.'],
['Trình duyệt này không hỗ trợ WebRTC, hãy dùng Chrome, Safari hoặc Edge bản mới.','This browser does not support WebRTC. Please use a recent Chrome, Safari or Edge.'],
['Mã phòng bị trùng, hãy bấm Tạo phòng lại.','That room code is already taken, please press Create room again.'],
['Phòng đã đầy hoặc ván đấu đã bắt đầu.','The room is full or the game has already started.'],
['Một người chơi không kết nối được (mạng bị chặn P2P)','A player could not connect (their network blocks P2P)'],
['Không tải được thư viện kết nối (PeerJS). Kiểm tra mạng hoặc tắt trình chặn quảng cáo rồi thử lại.','Could not load the connection library (PeerJS). Check your network or disable your ad blocker, then retry.'],
['Không khởi tạo được thư viện kết nối (PeerJS).','The connection library (PeerJS) failed to initialize.'],
['Hồ sơ của bạn','Your profile'],['Tên nhân vật','Character name'],['Thay trang phục đầy đủ','Open full wardrobe']
].sort((a,b)=>b[0].length-a[0].length);
const SUFRE=/^(.*?)( · (?:Bot đang suy nghĩ…|Đang chờ đối thủ…|đôi lần \d+))$/;
const sufTr=x=>x.replace('Bot đang suy nghĩ…','Bot is thinking…').replace('Đang chờ đối thủ…','Waiting for opponent…').replace(/đôi lần (\d+)/,'doubles ×$1');
function trCore(t){if(EXACT[t]!==undefined)return EXACT[t];let r=t;
 for(const [re,rp] of RXA){if(re.test(r)){r=r.replace(re,rp);break}}
 for(const [re,rp] of RXB)r=r.replace(re,rp);
 for(const [a,b] of PH)if(r.includes(a))r=r.split(a).join(b);
 return r}
const TMEMO=new Map();
function trText(s){if(LANG!=='en')return s;let m=TMEMO.get(s);if(m!==undefined)return m;
 const t=s.trim();let r=s;
 if(t){const lead=s.match(/^\s*/)[0],tr=s.match(/\s*$/)[0];let b=t,suf='',x;
  while((x=b.match(SUFRE))){suf=sufTr(x[2])+suf;b=x[1]}
  r=lead+trCore(b)+suf+tr}
 TMEMO.set(s,r);if(TMEMO.size>4000)TMEMO.clear();return r}
const TREC=new WeakMap(),AREC=new WeakMap(),TATTR=['aria-label','placeholder','title'];
function trNode(n){const r=TREC.get(n),o=(r&&n.data===r.t)?r.o:n.data;
 if(LANG==='en'){const t=trText(o);TREC.set(n,{o,t});if(n.data!==t)n.data=t}
 else if(r){if(n.data!==o)n.data=o;TREC.delete(n)}}
function trAttrs(el){for(const a of TATTR){if(!el.hasAttribute(a))continue;const v=el.getAttribute(a),k=AREC.get(el)||{},r=k[a],o=(r&&v===r.t)?r.o:v;
 if(LANG==='en'){const t=trText(o);k[a]={o,t};AREC.set(el,k);if(v!==t)el.setAttribute(a,t)}
 else if(r){if(v!==o)el.setAttribute(a,o);delete k[a]}}}
const skipTag=n=>n.nodeType===1&&(n.tagName==='SCRIPT'||n.tagName==='STYLE'||n.tagName==='CANVAS');
function trTree(root){if(root.nodeType===3){trNode(root);return}if(root.nodeType!==1||skipTag(root))return;trAttrs(root);
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:n=>skipTag(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while((n=w.nextNode())){n.nodeType===3?trNode(n):trAttrs(n)}}
const MO=new MutationObserver(ms=>{if(LANG!=='en')return;MO.disconnect();
 try{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(trTree);else if(m.type==='characterData')trNode(m.target);else if(m.type==='attributes')trAttrs(m.target)}}finally{moObs()}});
const moObs=()=>MO.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:TATTR});
function setLang(l){if(l===LANG)return;LANG=l;LS.set('dcts_lang',l);MO.disconnect();document.documentElement.lang=l;
 trTree(document.body);document.title=L('Địa Chủ Tập Sự','Landlord Apprentice');if(l==='en')moObs();
 $$('[data-a=langToggle]').forEach(b=>b.innerHTML=langLabel());if(MD)renderModal()}
function initLang(){document.documentElement.lang=LANG;if(LANG==='en'){trTree(document.body);document.title='Landlord Apprentice';moObs()}}

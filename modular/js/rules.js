'use strict';
/* ================= NỘI DUNG LUẬT CHƠI ================= */
function rulesData(){return [
{ic:'🎯',t:L('Mục tiêu & Khởi đầu','Goal & Start'),l:[
 L('Mục tiêu: trở thành người giàu nhất, đẩy mọi đối thủ vào phá sản. Người cuối cùng còn trụ lại là <b>Địa Chủ</b> chiến thắng.','Goal: become the richest player and bankrupt every rival. The last player standing is the winning <b>Landlord</b>.'),
 L('Mỗi người bắt đầu với <b>$1,500</b> tiền vốn, quân cờ đặt ở ô <b>BẮT ĐẦU</b>.','Everyone starts with <b>$1,500</b> and a token on <b>START</b>.'),
 L('Đến lượt, bấm <b>Tung xúc xắc</b>: quân cờ tự đi theo chiều kim đồng hồ đúng bằng tổng hai xúc xắc.','On your turn press <b>Roll dice</b>: your token moves clockwise by the total of both dice.'),
 L('Mỗi lần đi qua hoặc dừng ở ô BẮT ĐẦU, nhận <b>$200</b>.','Each time you pass or land on START, collect <b>$200</b>.'),
 L('Tung ra <b>xúc xắc đôi</b> được tung thêm một lượt; đôi <b>3 lần liên tiếp</b> thì bị tống vào tù.','Rolling <b>doubles</b> earns another roll; doubles <b>3 times in a row</b> sends you to jail.'),
 L('Ô Thuế: nộp tiền cho ngân hàng (Thuế Thu Nhập $200, Thuế Xa Xỉ $100).','Tax tiles: pay the bank (Income Tax $200, Luxury Tax $100).'),
 L('Bảng <b>Biểu cảm</b> và <b>Ném đồ</b> bên cạnh bàn cờ: thả emoji, hoặc ném cà chua, mắm tôm, dép tổ ong vào đối thủ cho vui (không ảnh hưởng tiền bạc).','The <b>Emote</b> and <b>Throw</b> panels beside the board: send emojis or throw tomatoes, shrimp paste and flip-flops at rivals just for fun (no effect on money).')],
 n:L('Mẹo: kéo bàn cờ để xoay, hoặc dùng thanh Nghiêng / Xoay phía trên bàn cờ.','Tip: drag the board to rotate it, or use the Tilt / Rotate sliders above the board.')},
{ic:'🏠',t:L('Mua đất, Đấu giá & Tiền thuê','Buying, Auctions & Rent'),l:[
 L('Dừng ở ô chưa có chủ: bạn có thể <b>mua</b> với giá niêm yết.','Land on an unowned tile: you may <b>buy</b> it at the listed price.'),
 L('Nếu bỏ qua, ô đất được <b>đấu giá</b> cho tất cả người chơi, bắt đầu từ $1; ai trả cao nhất thắng.','If you pass, the tile goes to <b>auction</b> for all players, starting at $1; the highest bidder wins.'),
 L('Dừng ở ô có chủ: trả <b>tiền thuê</b> cho chủ đất (đất đang thế chấp thì không thu thuê).','Land on an owned tile: pay <b>rent</b> to the owner (mortgaged tiles collect no rent).'),
 L('Sở hữu <b>đủ bộ màu</b> (chưa xây nhà) thì tiền thuê đất trống được <b>nhân đôi ×2</b>.','Owning the <b>full color set</b> (with no houses yet) <b>doubles ×2</b> the rent of empty lots.'),
 L('Nhà ga: thuê $25 / $50 / $100 / $200 tùy số ga bạn sở hữu (1 đến 4).','Stations: rent is $25 / $50 / $100 / $200 depending on how many you own (1 to 4).'),
 L('Công ty tiện ích: thuê = <b>4 ×</b> điểm xúc xắc nếu có 1 công ty, <b>10 ×</b> nếu có cả 2.','Utilities: rent = <b>4 ×</b> the dice roll with 1 utility, <b>10 ×</b> with both.'),
 L('Không đủ tiền thì phải bán nhà hoặc thế chấp; hết cách thì <b>phá sản</b>, tài sản về tay chủ nợ (hoặc ngân hàng).','Short on cash? Sell houses or mortgage property; if you still cannot pay you go <b>bankrupt</b> and your assets pass to the creditor (or the bank).')],
 n:L('Nút Giao dịch cho phép trao đổi tiền, đất và thẻ ra tù với người chơi khác.','The Trade button lets you swap cash, properties and jail-free cards with other players.')},
{ic:'🏨',t:L('Xây nhà, Khách sạn & Thế chấp','Building, Hotels & Mortgage'),l:[
 L('Chỉ được xây khi bạn sở hữu <b>đủ bộ màu</b> và không ô nào trong bộ đang thế chấp.','You may build only when you own the <b>full color set</b> and no tile in the set is mortgaged.'),
 L('<b>Xây đều (Even Build)</b>: các ô cùng bộ màu chỉ được chênh nhau tối đa 1 nhà; khi bán nhà cũng phải bán đều.','<b>Even Build</b>: tiles in the same color set may differ by at most 1 house; houses must also be sold evenly.'),
 L('Mỗi ô tối đa <b>4 nhà</b>; nâng cấp tiếp = đổi <b>4 nhà lấy 1 khách sạn</b>. Ngân hàng chỉ có 32 nhà và 12 khách sạn.','Each tile holds up to <b>4 houses</b>; the next upgrade trades <b>4 houses for 1 hotel</b>. The bank has only 32 houses and 12 hotels.'),
 L('Bán nhà / khách sạn thu lại <b>½ giá xây</b>.','Selling a house / hotel returns <b>half the build cost</b>.'),
 L('<b>Thế chấp</b>: nhận ½ giá mua đất (phải bán hết nhà trong bộ trước). Đất thế chấp không thu thuê.','<b>Mortgage</b>: receive half the purchase price (sell all houses in the set first). Mortgaged land collects no rent.'),
 L('<b>Chuộc đất</b>: trả số tiền thế chấp cộng <b>lãi 10%</b>.','<b>Redeem land</b>: pay the mortgage value plus <b>10% interest</b>.')],
 n:L('Bấm vào một ô đất trên bàn cờ hoặc trong danh sách tài sản để xây, bán, thế chấp.','Click a tile on the board or in a player property list to build, sell or mortgage.')},
{ic:'🎴',t:L('Thẻ Cơ hội, Khí vận & Ở tù','Chance, Chest & Jail'),l:[
 L('Dừng ở ô <b>Cơ Hội</b> hoặc <b>Khí Vận</b>: rút một lá bài, lá bài lật ở giữa màn hình; bấm <b>Đã hiểu</b> để tiếp tục.','Land on <b>Chance</b> or <b>Community Chest</b>: draw a card that flips in the middle of the screen; press <b>Got it</b> to continue.'),
 L('Lá bài có thể cho nhận / mất tiền, di chuyển, vào tù hoặc buộc sửa chữa nhà. Thẻ <b>Ra Tù Miễn Phí</b> được giữ lại đến khi cần.','Cards can give or take money, move you, jail you or charge house repairs. A <b>Get Out of Jail Free</b> card is kept until needed.'),
 L('Vào tù khi: dừng ở ô <b>Vào Tù</b>, rút thẻ vào tù, hoặc tung đôi 3 lần liên tiếp. Ô Thăm Tù chỉ là ghé thăm.','You go to jail by landing on <b>Go To Jail</b>, drawing a jail card, or rolling doubles 3 times in a row. Just Visiting is harmless.'),
 L('<b>3 cách ra tù</b>: (1) nộp phạt $50 trước khi tung; (2) dùng thẻ Ra Tù Miễn Phí; (3) tung <b>xúc xắc đôi</b>: ra tù và đi ngay theo số vừa tung (không được tung thêm).','<b>3 ways out</b>: (1) pay a $50 fine before rolling; (2) use a Get Out of Jail Free card; (3) roll <b>doubles</b>: you leave and move by that roll at once (no extra roll).'),
 L('Sau 3 lượt không ra đôi, bạn bắt buộc nộp $50 rồi đi tiếp.','After 3 turns without doubles you must pay $50 and move on.'),
 L('Khi ở tù bạn vẫn thu tiền thuê, mua bán, xây dựng và giao dịch bình thường.','While in jail you still collect rent, buy, build and trade as usual.')],
 n:L('Xúc xắc đôi 3 lần liên tiếp khi đang đi bình thường cũng đưa bạn thẳng vào tù.','Rolling doubles 3 times in a row during normal play also sends you straight to jail.')}]}

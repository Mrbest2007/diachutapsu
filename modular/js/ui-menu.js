'use strict';
/* ================= MENU & CÀI ĐẶT ================= */
const coin='<span class="coin"></span>';
function renderMenu(){
 const card=(cls,c1,c2,ct,act,v,ic,t,sub)=>`<button class="mc ${cls}" style="--c1:${c1};--c2:${c2};--ct:${ct}" data-a="${act}"${v?` data-v="${v}"`:''}><span class="mi">${ic}</span><span class="tx"><span class="mt">${t}</span><small>${sub}</small></span></button>`;
 $('#menu').innerHTML=`<i class="orb" style="left:-6%;top:-8%;width:42vw;height:42vw;background:radial-gradient(circle,#ffb3d9,transparent 68%)"></i><i class="orb" style="right:-8%;top:20%;width:38vw;height:38vw;background:radial-gradient(circle,#a9d8ff,transparent 68%);animation-delay:-5s"></i><i class="orb" style="left:30%;bottom:-18%;width:40vw;height:34vw;background:radial-gradient(circle,#d3c2ff,transparent 68%);animation-delay:-9s"></i>
 <div class="mtop"><button class="pill" data-a="mute">🎵 ${AUD.muted?'Âm thanh: Tắt':'Âm thanh: Bật'}</button>${langChips()}</div>
 <div class="hero"><div class="hero-av"><div class="halo"></div>${avatar(ST.me,150)}</div>
 <h1 class="ttl">ĐỊA CHỦ TẬP SỰ</h1><div class="sub"><i></i>VIỆT NAM • PASTEL CHIBI 3D<i></i></div></div>
 <div class="mrow r3">
  ${card('','#ffd27a','#ff9f5a','#5a2f00','mode','solo','🤖','Chơi với Bot','1 đến 3 Bot, 3 mức độ')}
  ${card('','#8cf0d2','#3fc3a1','#04402f','mode','local','👥','Chơi chung máy','2 đến 4 người, luân phiên')}
  ${card('','#ffb3cf','#ff7eb0','#6b1038','mode','online','🌐','Chơi Online','Mã phòng, kết nối P2P')}
 </div>
 <div class="mrow r2">
  ${card('sm','#cdbfff','#9b83f0','#2f1c70','wardrobe','','🎽','Phòng thay đồ','Tự do chọn trang phục &amp; hiệu ứng')}
  ${card('sm','#9ccfff','#5a9df0','#0f2f6b','rules','','📖','Luật Chơi','Hướng dẫn cách chơi')}
 </div>`}
const LVN={1:'Dễ',2:'Trung bình',3:'Khó'};
function renderSetup(){const m=ST.mode;let body='';
 if(m==='solo'){
  const seats=[ST.me,...ST.botCfgs.slice(0,ST.nBots)];
  body=`<div class="card"><div class="grp"><b>Số Bot</b><div class="row">${[1,2,3].map(n=>`<button class="chip ${ST.nBots===n?'on':''}" data-a="nbots" data-v="${n}">${n} Bot</button>`).join('')}</div></div>
  <div class="grp"><b>Độ khó Bot</b><div class="row">${[1,2,3].map(n=>`<button class="chip ${ST.lvl===n?'on':''}" data-a="lvl" data-v="${n}">${LVN[n]}</button>`).join('')}</div>
  <div class="note">Bot Dễ mua đất ngẫu nhiên và giữ tiền dư. Bot Trung bình biết gom bộ màu, xây nhà. Bot Khó tính giá trị đất khi đấu giá, giữ quỹ dự phòng và chủ động đề nghị giao dịch.</div></div></div>
  <div class="seats">${seats.map((c,i)=>`<div class="card seat"><div style="color:${PCOL[i]}" class="mut">${i?'Bot · '+LVN[ST.lvl]:'Bạn'}</div>${avatar(c,96)}<b>${esc(c.name)}</b></div>`).join('')}</div>
  <div class="row"><button class="btn" data-a="reroll">Đổi Bot khác</button><button class="btn" data-a="wardrobe">Thay đồ của tôi</button><button class="btn gold big" data-a="startSolo">Vào trận</button></div>`}
 if(m==='local'){
  body=`<div class="card"><div class="grp"><b>Số người chơi</b><div class="row">${[2,3,4].map(n=>`<button class="chip ${ST.nLocal===n?'on':''}" data-a="nlocal" data-v="${n}">${n} người</button>`).join('')}</div>
  <div class="note">Mỗi người lần lượt thao tác trên cùng một thiết bị. Mỗi chỗ ngồi có thể mặc đồ riêng.</div></div></div>
  <div class="seats">${ST.loc.slice(0,ST.nLocal).map((c,i)=>`<div class="card seat"><div style="color:${PCOL[i]}" class="mut">Người chơi ${i+1}</div>${avatar(c,96)}<input type="text" maxlength="14" data-nm="${i}" value="${esc(c.name)}" aria-label="Tên người chơi ${i+1}"><button class="btn sm" data-a="wardrobe" data-v="${i}">Thay đồ</button></div>`).join('')}</div>
  <div class="row"><button class="btn gold big" data-a="startLocal">Vào trận</button></div>`}
 if(m==='online'){
  body=`${profileCard()}<div class="card"><p style="margin:0 0 10px">Hai bạn kết nối trực tiếp qua WebRTC (PeerJS), không cần máy chủ trung gian. Chủ phòng tạo mã 5 ký tự, bạn bè nhập mã để vào.</p>
  <div class="row"><button class="btn gold" data-a="hostRoom">Tạo phòng</button>
  <input type="text" id="joinCode" maxlength="5" value="${esc(ST.lastCode||'')}" placeholder="Nhập mã phòng" style="max-width:190px;text-transform:uppercase" aria-label="Mã phòng" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false"><button class="btn mint" data-a="joinRoom">Vào phòng</button></div>
  ${netMsgHtml()}
  <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-a="simRoom">Phòng giả lập (không cần mạng)</button><button class="btn ghost sm" data-a="p2pHelp">Không vào được phòng? Xem hướng dẫn</button></div>
  ${IS_IOS?'<div class="note" style="margin-top:8px">Đang dùng iPhone/iPad? Nếu không vào được phòng, hãy tắt iCloud Private Relay và VPN, hoặc đổi qua lại giữa Wi-Fi và 4G/5G.</div>':''}</div>`}
 const ttl={solo:'Chơi với Bot',local:'Chơi chung máy',online:'Chơi Online'}[m];
 $('#setup').innerHTML=`<div class="bar"><button class="btn ghost sm" data-a="home">← Menu</button><h2>${ttl}</h2></div>${body}`}

/* ================= PHÒNG THAY ĐỒ & GACHA ================= */
const WD={cfg:null,tab:'outfit',back:'menu'};
function openWardrobe(cfg){WD.cfg=cfg;if(!SLOTS.some(x=>x[0]===WD.tab))WD.tab='outfit';wdRender();show('wardrobe')}
function wdRender(){const c=WD.cfg,y=scrollY,human=c.type==='nam'||c.type==='nu';
 const list=ITEMS.filter(i=>i.s===WD.tab);
 const panel=`<div class="items">${list.map(i=>{const on=c[i.s]===i.id;
  const th=i.s==='trail'?`<div class="ti2">${trI(i.id,0)||'—'}</div>`:avatar(Object.assign({},c,{[i.s]:i.id}),58);
  return `<button class="it ${on?'on':''}" data-a="wdEq" data-id="${i.id}" aria-label="${i.n}" aria-pressed="${on}"><div style="display:flex;justify-content:center;padding-top:4px">${th}</div><div>${i.n}</div></button>`}).join('')}</div>`;
 $('#wardrobe').innerHTML=`<div class="bar"><h2>Phòng Thay Đồ</h2><button class="btn ghost sm" data-a="wdReset">Đồ mặc định</button><button class="btn gold" data-a="wdDone">Lưu &amp; quay lại</button></div>
 <div class="wd"><div class="card"><div class="pedestal">${avatar(c,200)}</div>
  <div class="grp"><b>Tên người chơi</b><input type="text" id="wdName" maxlength="14" value="${esc(c.name)}"></div>
  <div class="grp"><b>Kiểu dáng</b><div class="row">${TYPES.map(([k,n])=>`<button class="chip ${c.type===k?'on':''}" data-a="wdType" data-v="${k}">${n}</button>`).join('')}</div></div>
  <div class="grp"><b>Màu da / màu lông</b><div class="row">${SKINS.map(s=>`<button class="sw ${c.skin===s?'on':''}" style="background:${s}" data-a="wdSkin" data-v="${s}" aria-label="Màu ${s}"></button>`).join('')}</div></div>
  ${human?`<div class="grp"><b>Kiểu tóc</b><div class="row">${HAIRS.map(([k,n])=>`<button class="chip ${c.hair===k?'on':''}" data-a="wdHair" data-v="${k}">${n}</button>`).join('')}</div></div>
  <div class="grp"><b>Màu tóc</b><div class="row">${HAIRC.map(s=>`<button class="sw ${c.hairc===s?'on':''}" style="background:${s}" data-a="wdHairc" data-v="${s}" aria-label="Màu tóc ${s}"></button>`).join('')}</div></div>`:''}
 </div>
 <div class="card"><div class="tabs">${SLOTS.map(([k,n])=>`<button class="chip ${WD.tab===k?'on':''}" data-a="wdTab" data-v="${k}">${n}</button>`).join('')}</div>${panel}
  <div class="note">Chọn thoải mái: mọi trang phục, mũ, kính, phụ kiện và vệt bước chân đều có sẵn, không cần mở hộp.</div></div></div>`;
 scrollTo(0,y)}

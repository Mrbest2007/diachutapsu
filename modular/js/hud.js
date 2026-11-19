'use strict';
/* ================= HUD ================= */
const isMine=pid=>ST.myIds.includes(pid);
const isAuth=()=>!ST.net||ST.net.role==='host';
function lvTag(p){return p.bot?`<span class="tag">Bot · ${LVN[p.bot]}</span>`:(ST.net&&ST.mode==='online'?`<span class="tag">${isMine(p.id)?'Bạn':'Người chơi'}</span>`:'<span class="tag">Người chơi</span>')}
function playerCard(p){const own=owned(p.id);
 const chips=own.map(i=>{const t=T[i],c=t.g?GROUPS[t.g].c:t.t==='rr'?'#9fb4ff':'#5eead4';const h=G.hs[i];
  return `<button class="${G.mort[i]?'m':''}" style="background:${c}" data-a="deed" data-i="${i}" title="${t.n}">${h?`<i>${h===5?'KS':h}</i>`:''}</button>`}).join('');
 return `<div class="pc ${p.id===G.cur&&G.winner<0?'turn':''} ${p.out?'out':''} ${p.jail?'jail':''}" style="--pcol:${p.col}"><div class="hd"><div class="avw">${avatar(p.cfg,44)}</div><div style="min-width:0;flex:1"><div class="nmx">${esc(p.name)}${micIcon(p.id)}</div>${lvTag(p)}<div class="mn">${money(p.money)}</div></div></div>
 ${p.out?'<div class="jc" style="color:var(--red)">Đã phá sản</div>':''}${p.jail?'<div class="jc" style="color:var(--gold)">Đang ở tù (lần '+p.jt+'/3)</div>':''}${p.fc.length?`<div class="jc">Thẻ ra tù ×${p.fc.length}</div>`:''}
 <div class="pp">${chips||'<span class="tag">Chưa có tài sản</span>'}</div></div>`}
let PSIG='';
function renderPlayers(){const sig=G.players.map(p=>[p.money,p.jail,p.jt,p.out,p.fc.length,p.bot,p.id===G.cur&&G.winner<0].join()).join('|')+G.own.join()+G.hs.join()+G.mort.join()+'|m'+G.players.map(p=>micOn(p.id)?1:0).join('');if(sig===PSIG&&$('#pl').firstChild)return;PSIG=sig;const n=G.players.length,h=Math.ceil(n/2);
 $('#pl').innerHTML=G.players.slice(0,h).map(playerCard).join('');$('#pr').innerHTML=G.players.slice(h).map(playerCard).join('')}
function renderTop(){$('#top').innerHTML=`<div class="tt">Địa Chủ Tập Sự</div><span class="chip">Lượt ${G.turnNo}</span>${ST.net?`<span class="chip">${ST.net.sim?'Phòng giả lập':'Phòng '+ST.net.code}</span>`:''}<button class="btn sm gold" data-a="rules" aria-label="Luật chơi" title="Luật chơi"><span class="tic keep" aria-hidden="true">📖</span><span class="lb">Luật chơi</span></button><button class="btn sm ghost" data-a="mute" aria-label="Âm thanh"><span class="tic" aria-hidden="true">${AUD.muted?'🔇':'🔊'}</span><span class="lb">${AUD.muted?'Âm thanh: Tắt':'Âm thanh: Bật'}</span></button>${chatBtn('top')}${micBtn(1)}<button class="btn sm ghost" data-a="quit" aria-label="Thoát"><span class="tic" aria-hidden="true">✕</span><span class="lb">Thoát</span></button><span class="row" style="gap:6px">${langChips()}</span>`}
function renderDock(){const d=$('#dock');
 const logs=G.log.slice(-40).reverse().map(l=>`<div><span style="color:${l.c>=0?G.players[l.c].col:'#fff'}">●</span> ${esc(l.t)}</div>`).join('');
 if(G.winner>=0){d.innerHTML=`<div class="st"><b>Trận đấu kết thúc</b></div><div class="logbox dsk" style="flex:1 1 300px">${logs}</div>`;renderPopup();return}
 const p=cp(),mine=isMine(G.cur)&&!p.bot,dis=busy()?'disabled':'';let st='',acts='';const T0=T[p.pos];
 const mg=`<button class="btn" data-a="manage" ${dis}>Quản lý tài sản</button>`;
 const tr=`<button class="btn" data-a="tradeNew" ${dis}>Giao dịch</button>`;
 switch(G.phase){
  case 'roll':st=p.jail?`${p.name} đang ở tù (lần ${p.jt}/3)`:`Lượt của ${p.name}${G.doubles?` · đôi lần ${G.doubles}`:''}`;
   if(mine){acts=p.jail?`${p.fc.length?`<button class="btn mint" data-a="act" data-v="jcard" ${dis}>Dùng thẻ ra tù</button>`:''}<button class="btn" data-a="act" data-v="jpay" ${dis||p.money<50?'disabled':''}>Nộp phạt $50</button><button class="btn gold" data-a="act" data-v="roll" ${dis}>Tung đôi để ra tù</button>`:`<button class="btn gold big" data-a="act" data-v="roll" ${dis}>Tung xúc xắc</button>`;acts+=mg+tr}break;
  case 'buy':st=`${p.name} dừng tại ${T0.n}, giá ${money(T0.price)}`;if(mine)acts=`<button class="btn gold big" data-a="act" data-v="buy" ${dis||p.money<T0.price?'disabled':''}>Mua ${money(T0.price)}</button><button class="btn" data-a="act" data-v="noBuy" ${dis}>Bỏ qua (đấu giá)</button>`;break;
  case 'end':st=`${p.name} đã xong lượt đi`;if(mine)acts=`<button class="btn gold big" data-a="act" data-v="end" ${dis}>Kết thúc lượt</button>`+mg+tr;break;
  case 'debt':st=`${p.name} nợ ${money(G.debt.amt)} (${G.debt.why}). Cần bán nhà hoặc thế chấp.`;
   if(mine)acts=`<button class="btn mint" data-a="act" data-v="payDebt" ${dis||p.money<G.debt.amt?'disabled':''}>Trả nợ ${money(G.debt.amt)}</button>${mg}<button class="btn pink" data-a="act" data-v="bankrupt" ${dis||liquid(p)>=G.debt.amt?'disabled':''}>Tuyên bố phá sản</button>`;break;
  case 'auction':st=`Đang đấu giá ${T[G.auction.idx].n}`;break;
  default:st='…'}
 if(G.trade&&G.phase!=='auction'){const a=G.players[G.trade.from],b=G.players[G.trade.to];st=`${a.name} đề nghị giao dịch với ${b.name}`;acts=isMine(G.trade.from)&&!a.bot?`<button class="btn" data-a="tradeCancel">Hủy đề nghị</button>`:''}
 if(!mine&&!acts&&!G.trade)st+=p.bot?' · Bot đang suy nghĩ…':(ST.net?' · Đang chờ đối thủ…':'');
 const emo=`<div class="emotes dsk" role="group" aria-label="Biểu cảm"><span class="tag">Biểu cảm</span>${EMO.map((x,i)=>`<button class="em" data-a="emote" data-v="${i}" aria-label="${x[1]}" title="${x[1]}">${x[0]}</button>`).join('')}</div>`;
 const meP=ST.myIds.includes(G.cur)&&!G.players[G.cur].bot?G.cur:ST.myIds[0],tgs=G.players.filter(q=>!q.out&&q.id!==meP);if(!tgs.some(q=>q.id===ST.tgt))ST.tgt=tgs[0]?tgs[0].id:-1;
 const thr=tgs.length?`<div class="emotes thr dsk" role="group" aria-label="Ném đồ"><span class="tag">Ném đồ</span>${THR.map((x,i)=>`<button class="em" data-a="throw" data-v="${i}" aria-label="${x.n}" title="${x.n}">${THR_IC[i]}</button>`).join('')}${tgs.length>1?`<div class="row" style="gap:4px;width:100%">${tgs.map(q=>`<button class="chip ${q.id===ST.tgt?'on':''}" style="font-size:12px;padding:.15em .6em" data-a="tgt" data-v="${q.id}">${esc(q.name)}</button>`).join('')}</div>`:''}</div>`:'';
 const mt=`<div class="mtools"><button class="btn sm ghost" data-a="pop" data-v="emo"><span class="ei" aria-hidden="true">😂</span><span>Biểu cảm</span></button>${chatBtn('m')}${tgs.length?`<button class="btn sm ghost" data-a="pop" data-v="thr"><span class="ei" aria-hidden="true">🍅</span><span>Ném đồ</span></button>`:''}</div>`;
 const chat=ST.net?`<div class="row dsk" style="width:100%">${['Chào!','Nhanh lên nào','Giao dịch không?','GG'].map(t=>`<button class="chip" data-a="chat" data-v="${t}">${t}</button>`).join('')}</div>`:'';
 d.innerHTML=`<div class="st"><b style="color:${p.col}">${esc(st)}</b><div class="mut" style="font-size:13px">${G.last.d1} + ${G.last.d2} = ${G.last.d1+G.last.d2}</div></div><div class="acts">${acts}</div>${mt}${emo}${thr}${chat}<div class="logbox dsk" style="flex:1 1 100%;max-height:96px">${logs}</div>`;renderPopup()}
const MOB=()=>innerWidth<=700;
function throwTargets(){const meP=ST.myIds.includes(G.cur)&&!G.players[G.cur].bot?G.cur:ST.myIds[0];return G.players.filter(q=>!q.out&&q.id!==meP)}
function closePop(){if(ST.pop){ST.pop=null;renderPopup()}}
function renderPopup(){let el=$('#popup');if(!el){el=document.createElement('div');el.id='popup';el.className='popup';el.hidden=true;document.body.appendChild(el)}
 if(!ST.pop||!G||G.winner>=0||MD||!$('#game').classList.contains('on')){el.hidden=true;el.innerHTML='';if(!G||G.winner>=0)ST.pop=null;return}
 let h='';
 if(ST.pop==='emo'){h=`<h4>Biểu cảm</h4><div class="pgrid">${EMO.map((x,i)=>`<button class="pb" data-a="emote" data-v="${i}" aria-label="${x[1]}"><span class="pe" aria-hidden="true">${x[0]}</span><small>${x[1]}</small></button>`).join('')}</div>${ST.net?`<div class="prow2">${['Chào!','Nhanh lên nào','Giao dịch không?','GG'].map(t=>`<button class="chip" data-a="chat" data-v="${t}">${t}</button>`).join('')}</div>`:''}`}
 else{const tg=throwTargets();if(!tg.length){ST.pop=null;el.hidden=true;return}if(!tg.some(q=>q.id===ST.tgt))ST.tgt=tg[0].id;
  h=`<h4>Ném đồ</h4>${tg.length>1?`<div class="prow2">${tg.map(q=>`<button class="chip ${q.id===ST.tgt?'on':''}" data-a="tgt" data-v="${q.id}">${esc(q.name)}</button>`).join('')}</div>`:''}<div class="pgrid">${THR.map((x,i)=>`<button class="pb" data-a="throw" data-v="${i}" aria-label="${x.n}"><span class="pe" aria-hidden="true">${THR_IC[i]}</span><small>${x.n}</small></button>`).join('')}</div>`}
 el.innerHTML=`<div class="pbk" data-a="popClose"></div><div class="ppan" role="dialog">${h}</div>`;
 el.style.setProperty('--pb',Math.max(60,innerHeight-$('#dock').getBoundingClientRect().top+8)+'px');el.hidden=false}
let STH=0;
function renderAll(){if(!G||!$('#game').classList.contains('on'))return;renderTop();renderPlayers();renderDock();updateBoard();renderTokens();renderModal();if(MOB()){const h=$('#stage').clientHeight;if(h&&Math.abs(h-STH)>2){STH=h;fitBoard()}}}
function afterChange(){enqueueFx();renderAll();if(ST.net&&ST.net.role==='host')netBroadcast()}
hookSync=afterChange;

/* auto: bot + mở bảng nợ */
let tickT=null,debtShown=null;
function maybeAuto(){if(!G||G.winner>=0)return;
 if(G.auction&&(!MD||MD.type!=='auction')&&!(MD&&MD.type==='win'))openModal('auction');
 if(G.phase==='debt'&&G.debt&&isMine(G.debt.pid)&&!G.players[G.debt.pid].bot&&debtShown!==G.debt){debtShown=G.debt;openModal('manage')}
 if(G.trade&&isMine(G.trade.to)&&!G.players[G.trade.to].bot&&!(MD&&MD.type==='tradeResp'))openModal('tradeResp')}
function startLoop(){clearInterval(tickT);tickT=setInterval(()=>{if(!G||G.winner>=0||busy()||!isAuth())return;if(botStep())afterChange()},450)}

/* ================= HỘP THOẠI ================= */
let MD=null;
function openModal(type,data){MD={type,data:data||{}};renderModal()}
function closeModal(){MD=null;$('#ovm').classList.remove('on');$('#md').innerHTML='';$('#md').dataset.sig=''}
const forced=()=>MD&&['auction','tradeResp','win'].includes(MD.type);
function deedHTML(i){const t=T[i],o=G.own[i];let head='',rows='';
 if(t.t==='st'){head=`<div class="dh" style="background:${GROUPS[t.g].c}"><small>GIẤY CHỨNG NHẬN QUYỀN SỞ HỮU</small>${t.ic||""} ${t.n}</div>`;
  rows=`<tr><td>Tiền thuê đất trống</td><td>${money(t.rent[0])}</td></tr><tr><td>Đủ bộ màu (×2)</td><td>${money(t.rent[0]*2)}</td></tr>`+[1,2,3,4].map(h=>`<tr><td>Với ${h} nhà</td><td>${money(t.rent[h])}</td></tr>`).join('')+`<tr><td>Với khách sạn</td><td>${money(t.rent[5])}</td></tr><tr><td colspan="2"><hr></td></tr><tr><td>Giá xây mỗi nhà / KS</td><td>${money(t.h)}</td></tr>`}
 else if(t.t==='rr'){head=`<div class="dh" style="background:#cfd6ec"><small>NHÀ GA</small>${t.n}</div>`;rows=[1,2,3,4].map(n=>`<tr><td>Sở hữu ${n} ga</td><td>${money(25*(1<<(n-1)))}</td></tr>`).join('')}
 else if(t.t==='util'){head=`<div class="dh" style="background:#bff3ea"><small>CÔNG TY TIỆN ÍCH</small>${t.n}</div>`;rows=`<tr><td>Có 1 công ty</td><td>4 × điểm xúc xắc</td></tr><tr><td>Có cả 2 công ty</td><td>10 × điểm xúc xắc</td></tr>`}
 else return `<div class="deed"><div class="dh" style="background:#efe6ff">${t.n}</div><div class="own">${t.t==='tax'?'Nộp '+money(t.amt):'Ô đặc biệt'}</div></div>`;
 rows+=`<tr><td>Giá mua</td><td>${money(t.price)}</td></tr><tr><td>Thế chấp nhận</td><td>${money(t.mv)}</td></tr>`;
 return `<div class="deed">${head}<table>${rows}</table><div class="own">${o<0?'Chưa có chủ':`Chủ sở hữu: <b>${esc(G.players[o].name)}</b>${G.mort[i]?' · đang thế chấp':''}${G.hs[i]?` · ${G.hs[i]===5?'khách sạn':G.hs[i]+' nhà'}`:''}`}</div></div>`}
function propActions(i,pid){const t=T[i];const can=isMine(pid)&&G.cur===pid&&!G.players[pid].bot&&!busy()&&['roll','end','debt'].includes(G.phase);if(!can)return '';
 const ph=G.phase,b=[];
 if(t.t==='st'){b.push(`<button class="btn sm mint" data-a="act" data-v="build" data-i="${i}" ${(ph!=='debt'&&canBuild(i,pid))?'':'disabled'}>Xây (${money(t.h)})</button>`);
  b.push(`<button class="btn sm" data-a="act" data-v="sell" data-i="${i}" ${canSell(i,pid)?'':'disabled'}>Bán nhà (+${money(t.h/2)})</button>`)}
 b.push(`<button class="btn sm gold" data-a="act" data-v="mort" data-i="${i}" ${canMort(i,pid)?'':'disabled'}>Thế chấp (+${money(t.mv)})</button>`);
 if(ph!=='debt')b.push(`<button class="btn sm pink" data-a="act" data-v="unmort" data-i="${i}" ${canUnmort(i,pid)?'':'disabled'}>Chuộc (${money(unmortCost(i))})</button>`);
 return `<div class="row" style="justify-content:center">${b.join('')}</div>`}
function tradeItems(pid,side){const p=G.players[pid];const props=owned(pid).filter(i=>T[i].t!=='st'||GRP[T[i].g].every(k=>G.hs[k]===0));
 return `<div class="tp"><label for="tc${side}" style="min-width:60px">Tiền</label><input type="number" id="tc${side}" min="0" max="${p.money}" value="${TD[side].cash}" data-side="${side}" data-f="cash"></div>
 ${p.fc.length?`<div class="tp"><label for="tf${side}" style="min-width:60px">Thẻ ra tù</label><input type="number" id="tf${side}" min="0" max="${p.fc.length}" value="${TD[side].fc}" data-side="${side}" data-f="fc"></div>`:''}
 <div style="max-height:170px;overflow:auto">${props.length?props.map(i=>`<label class="tp"><input type="checkbox" data-side="${side}" data-f="p" value="${i}" ${TD[side].props.includes(i)?'checked':''}><span style="width:10px;height:18px;border-radius:3px;background:${T[i].g?GROUPS[T[i].g].c:'#9fb4ff'}"></span>${T[i].n}${G.mort[i]?' (thế chấp)':''}</label>`).join(''):'<div class="mut">Không có đất để trao đổi</div>'}</div>`}
const TD={to:-1,o:{cash:0,props:[],fc:0},w:{cash:0,props:[],fc:0}};
const tradeText=(tr)=>{const f=it=>[it.cash?money(it.cash):'',...it.props.map(i=>T[i].n),it.fc?it.fc+' thẻ ra tù':''].filter(Boolean).join(', ')||'không gì cả';return `<b>${esc(G.players[tr.from].name)}</b> đưa: ${esc(f(tr.o))}<br><b>${esc(G.players[tr.to].name)}</b> đưa: ${esc(f(tr.w))}`};
function renderModal(){const ov=$('#ovm'),md=$('#md');if(!MD||(!G&&MD.type!=='rules'&&MD.type!=='p2phelp')){ov.classList.remove('on');return}
 const m=MD;let html='',wide=false;
 if(m.type==='deed'){const i=m.data.i;html=`<h3>Thông tin ô đất</h3>${deedHTML(i)}${G.own[i]>=0?propActions(i,G.own[i]):''}<div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost" data-a="close">Đóng</button></div>`}
 if(m.type==='manage'){const pid=G.cur,p=G.players[pid];const l=owned(pid);const dbt=G.phase==='debt'&&G.debt?`<div class="prow" style="background:#ff6b8133">Cần trả <b>${money(G.debt.amt)}</b> · tiền mặt ${money(p.money)}</div>`:'';wide=true;
  const groups={};l.forEach(i=>{const k=T[i].g||T[i].t;(groups[k]=groups[k]||[]).push(i)});
  html=`<h3>Quản lý tài sản · ${esc(p.name)}</h3><div class="mut" style="margin-bottom:8px">Tiền mặt ${money(p.money)} · còn ${G.bank.h} nhà, ${G.bank.H} khách sạn trong ngân hàng</div>${dbt}
  ${l.length?l.map(i=>{const t=T[i];return `<div class="prow"><span class="cb" style="background:${t.g?GROUPS[t.g].c:t.t==='rr'?'#9fb4ff':'#5eead4'}"></span><div class="nmr"><b>${t.n}</b><small>${G.mort[i]?'Đang thế chấp':t.t==='st'?(G.hs[i]===5?'Khách sạn':G.hs[i]+' nhà')+(GRP[t.g].every(k=>G.own[k]===pid)?' · đủ bộ màu':''):'Giá '+money(t.price)}</small></div>${propActions(i,pid)}</div>`}).join(''):'<div class="mut">Bạn chưa có tài sản nào.</div>'}
  <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn" data-a="close">Xong</button></div>`}
 if(m.type==='auction'){const au=G.auction;if(!au){closeModal();return}const bidder=G.players[au.order[au.i]],mine=isMine(bidder.id)&&!bidder.bot&&!busy();
  const min=au.bid+1;html=`<h3>Đấu giá · ${T[au.idx].n}</h3>${deedHTML(au.idx)}
  <div class="prow"><div class="nmr"><b>Giá cao nhất: ${au.bid?money(au.bid):'chưa có'}</b><small>${au.who>=0?'Dẫn đầu: '+esc(G.players[au.who].name):'Bắt đầu từ $1'}</small></div><div>Đến lượt: <b style="color:${bidder.col}">${esc(bidder.name)}</b></div></div>
  <div class="mut" style="font-size:12px">Còn trong cuộc: ${au.order.filter(id=>!au.passed.includes(id)).map(id=>esc(G.players[id].name)).join(', ')}</div>
  ${mine?`<div class="bids">${[1,10,50,100].map(n=>`<button class="btn sm" data-a="bidAdd" data-v="${n}" ${au.bid+n>bidder.money?'disabled':''}>+${n}</button>`).join('')}<input type="number" id="bidv" min="${min}" max="${bidder.money}" value="${Math.min(bidder.money,Math.max(min,AUV))}" style="max-width:120px" aria-label="Số tiền trả giá"><button class="btn gold" data-a="bid">Trả giá</button><button class="btn" data-a="act" data-v="pass">Bỏ qua</button></div><div class="mut" style="font-size:12px;margin-top:6px">Tiền mặt của bạn: ${money(bidder.money)}</div>`:`<div class="mut" style="margin-top:8px">${bidder.bot?'Bot đang cân nhắc…':'Đang chờ người chơi trả giá…'}</div>`}`}
 if(m.type==='tradeNew'){wide=true;const others=G.players.filter(q=>!q.out&&q.id!==G.cur);if(TD.to<0||!others.some(q=>q.id===TD.to))TD.to=others[0].id;
  html=`<h3>Giao dịch</h3><div class="row" style="margin-bottom:10px">${others.map(q=>`<button class="chip ${TD.to===q.id?'on':''}" data-a="tdTo" data-v="${q.id}">${esc(q.name)}</button>`).join('')}</div>
  <div class="cols2"><div class="card" style="padding:12px"><b>Bạn đưa</b>${tradeItems(G.cur,'o')}</div><div class="card" style="padding:12px"><b>Bạn nhận từ ${esc(G.players[TD.to].name)}</b>${tradeItems(TD.to,'w')}</div></div>
  <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" data-a="close">Hủy</button><button class="btn gold" data-a="tdSend">Gửi đề nghị</button></div>`}
 if(m.type==='tradeResp'){const tr=G.trade;if(!tr||!isMine(tr.to)){closeModal();return}html=`<h3>Đề nghị giao dịch</h3><div class="prow" style="display:block;line-height:1.6">${tradeText(tr)}</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn" data-a="tradeNo">Từ chối</button><button class="btn mint" data-a="tradeYes">Đồng ý</button></div>`}
 if(m.type==='quit'){html=`<h3>Rời khỏi trận?</h3><p>Ván đang chơi sẽ không được lưu.</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="close">Tiếp tục chơi</button><button class="btn pink" data-a="quitYes">Rời trận</button></div>`}
 if(m.type==='win'){const w=G.players[m.data.pid];if(!rewarded){rewarded=true;FX.celebrate();AUD.play('win')}
  html=`<div class="win"><div>${avatar(w.cfg,150)}</div><h2>CHIẾN THẮNG!</h2><h3 style="color:${w.col}">${esc(w.name)}</h3><p>Trở thành Địa Chủ giàu nhất với ${money(w.money)} tiền mặt và ${owned(w.id).length} tài sản.</p><div class="row" style="justify-content:center"><button class="btn gold" data-a="again">Chơi lại</button><button class="btn" data-a="quitYes">Về menu</button></div></div>`}
 if(m.type==='p2phelp'){wide=true;const k=m.data.kind,dg=m.data.diag;
  const why=k==='server'?L('Không liên lạc được máy chủ ghép phòng (PeerJS). Mạng có thể đang chặn WebSocket hoặc máy chủ công cộng đang quá tải.','Could not reach the matchmaking server (PeerJS). Your network may block WebSockets or the public server may be busy.'):k==='p2p'?L('Mạng đang chặn kết nối trực tiếp (P2P/WebRTC) giữa hai thiết bị.','Your network is blocking the direct P2P (WebRTC) connection between the two devices.'):L('Nếu không vào được phòng, hãy thử các cách sau.','If you cannot join a room, try the following.');
  const ios=IS_IOS?`<li><b>iPhone/iPad:</b> ${L('tắt iCloud Private Relay: Cài đặt > [Tên của bạn] > iCloud > Private Relay > Tắt.','turn off iCloud Private Relay: Settings > [your name] > iCloud > Private Relay > Off.')}</li><li>${L('Cài đặt > Wi-Fi > nhấn (i) cạnh mạng đang dùng > tắt "Giới hạn theo dõi địa chỉ IP". Với 4G/5G: Cài đặt > Di động > Tùy chọn dữ liệu di động.','Settings > Wi-Fi > tap (i) next to your network > turn off "Limit IP Address Tracking". For 4G/5G: Settings > Cellular > Cellular Data Options.')}</li>`:'';
  html=`<h3>🌐 ${L('Không kết nối được P2P','P2P connection failed')}</h3><div class="mut" style="margin-bottom:8px">${why}</div><div class="rules"><ul>${ios}<li>${L('Tắt VPN và các ứng dụng chặn quảng cáo hoặc DNS riêng (Cài đặt > VPN).','Turn off any VPN and private ad or DNS blockers.')}</li><li>${L('Chuyển đổi qua lại giữa Wi-Fi và mạng di động 4G/5G rồi thử lại.','Switch between Wi-Fi and 4G/5G, then try again.')}</li><li>${L('Hai người nên dùng cùng một Wi-Fi để dễ kết nối hơn.','Both players should use the same Wi-Fi to connect more easily.')}</li><li>${L('Tải lại trang rồi tạo phòng mới.','Reload the page and create a new room.')}</li></ul></div>
  ${dg?`<div class="box" style="white-space:pre-line">${esc(dg)}</div>`:''}
  <div class="row" style="margin-top:10px"><button class="btn gold" data-a="p2pRetry">${L('Thử lại','Retry')}</button><button class="btn" data-a="p2pDiag">${L('Kiểm tra mạng','Test network')}</button></div>
  <div class="grp"><b>${L('Hoặc chơi ngay không cần mạng','Or play right now without a network')}</b><div class="row"><button class="btn mint" data-a="simRoom">${L('Phòng giả lập (với Bot)','Simulated room (with bots)')}</button><button class="btn" data-a="goLocal">${L('Chơi chung máy','Pass & play')}</button></div></div>
  <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn ghost" data-a="close">${L('Đóng','Close')}</button></div>`}
 if(m.type==='rules'){wide=true;const tabs=rulesData(),k=Math.min(m.data.tab||0,tabs.length-1),tb=tabs[k];
  html=`<h3>📖 ${L('Luật Chơi','How to Play')}</h3><div class="tabs">${tabs.map((x,i)=>`<button class="chip ${i===k?'on':''}" data-a="rulesTab" data-v="${i}">${x.ic} ${x.t}</button>`).join('')}</div><div class="rules"><div class="rh"><span class="big">${tb.ic}</span><h3 style="margin:0">${tb.t}</h3></div><ul>${tb.l.map(s=>`<li>${s}</li>`).join('')}</ul>${tb.n?`<div class="box">💡 ${tb.n}</div>`:''}</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn gold" data-a="close">${L('Đã hiểu','Got it')}</button></div>`}
 if(md.dataset.sig===html&&ov.classList.contains('on'))return;md.dataset.sig=html;
 md.className='md'+(wide?' wide':'');md.innerHTML=html;ov.classList.add('on')}
let AUV=0;

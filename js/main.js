'use strict';
/* ================= ĐIỀU KHIỂN, MẠNG, KHỞI ĐỘNG ================= */
function actor(a){if(a==='bid'||a==='pass')return G.auction.order[G.auction.i];if(a==='tradeResp')return G.trade.to;if(a==='tradeCancel')return G.trade.from;return G.cur}
function doAct(a,x){if(!G||busy())return;
 if(ST.net&&ST.net.role==='guest'){guestSend({t:'act',a,x});return}
 const pid=actor(a);if(!isMine(pid)||G.players[pid].bot)return;act(pid,a,x)}
function startGame(seats,myIds){PSIG='';ST.myIds=myIds;closeModal();newGame(seats);rewarded=false;lastFx=0;Q=[];running=false;Object.keys(disp).forEach(k=>delete disp[k]);debtShown=null;
 show('game');buildBoard();startLoop();afterChange()}
function soloSeats(){const s=[{name:ST.me.name,cfg:ST.me,bot:0}];for(let i=0;i<ST.nBots;i++)s.push({name:ST.botCfgs[i].name,cfg:ST.botCfgs[i],bot:ST.lvl});
 const seen={};s.forEach(x=>{if(seen[x.name])x.name+=' '+(seen[x.name]+1);seen[x.name]=(seen[x.name]||1)+1;x.cfg=Object.assign({},x.cfg,{name:x.name})});return s}
function localSeats(){return ST.loc.slice(0,ST.nLocal).map(c=>({name:c.name||'Người chơi',cfg:c,bot:0}))}
function leave(){clearInterval(tickT);FX.stop();FX.P=[];netClose();G=null;Q=[];running=false;closeModal();ST.myIds=[0];renderMenu();show('menu')}

/* ----- PeerJS ----- */
const CODEA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/* Cấu hình mạng cho Safari iOS (WebKit):
   - luôn dùng https/wss (PeerJS Cloud chỉ nhận TLS ở cổng 443, secure:true cố định, mọi URL http/ws tự nâng cấp)
   - nhiều STUN của Google/Cloudflare + TURN dự phòng (kể cả turns qua TLS) để vượt CGNAT 4G/5G và mạng khác nhau
   - iceTransportPolicy:'all' + iceCandidatePoolSize: gom sẵn ICE candidates (host/srflx/relay)
   - pingInterval: heartbeat WebSocket báo hiệu mỗi 4 giây để Safari không coi kết nối là nhàn rỗi */
const NET_PREFIX='diachutapsu-';
const secureUrl=u=>String(u).replace(/^http:\/\//i,'https://').replace(/^ws:\/\//i,'wss://');
const PEER_OPTS={debug:0,host:'0.peerjs.com',port:443,path:'/',secure:true,pingInterval:4000,
 config:{iceTransportPolicy:'all',iceCandidatePoolSize:4,iceServers:[
 {urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302','stun:stun.cloudflare.com:3478']},
 {urls:['turn:openrelay.metered.ca:80','turn:openrelay.metered.ca:443','turn:openrelay.metered.ca:443?transport=tcp','turns:openrelay.metered.ca:443?transport=tcp'],username:'openrelayproject',credential:'openrelayproject'}]}};
const newPeer=id=>id?new Peer(id,PEER_OPTS):new Peer(PEER_OPTS);
const uerr=m=>Object.assign(new Error(m),{user:true});
let NET_SEQ=0; /* tăng mỗi lần đóng/tạo kết nối mới để huỷ các thao tác chờ cũ */

/* Tải PeerJS: thử nhiều CDN, 2 vòng (iOS hoặc mạng trường học đôi khi chặn một CDN) */
function loadPeer(){
 const urls=['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js','https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js','https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'].map(secureUrl);
 const one=u=>new Promise((res,rej)=>{const x=document.createElement('script');x.src=u;x.async=true;const t=setTimeout(()=>{x.remove();rej(new Error('timeout'))},9000);x.onload=()=>{clearTimeout(t);res()};x.onerror=()=>{clearTimeout(t);x.remove();rej(new Error('load'))};document.head.appendChild(x)});
 return (async()=>{if(window.Peer)return;
  netMsg(L('Đang tải thư viện kết nối...','Loading connection library...'),'busy');
  for(let round=0;round<2;round++){for(const u of urls){try{await one(u);if(window.Peer)return}catch(e){}}await sleep(500)}
  throw uerr('Không tải được thư viện kết nối (PeerJS). Kiểm tra mạng hoặc tắt trình chặn quảng cáo rồi thử lại.')})()}

/* Chờ thu thập đủ ICE candidates (tối đa ms) trước khi gửi tín hiệu kết nối.
   Chạy một RTCPeerConnection "khởi động" để STUN/TURN được phân giải sẵn; PeerJS sau đó dùng candidate pool đã gom. */
let ICE_WARM=0;
function warmIce(ms){return new Promise(res=>{
 if(ICE_WARM||!window.RTCPeerConnection)return res(null);
 let pc=null,fin=false;const got={host:0,srflx:0,relay:0};let to=0;
 const done=()=>{if(fin)return;fin=true;clearTimeout(to);try{pc&&pc.close()}catch(e){}if(got.host||got.srflx||got.relay)ICE_WARM=1;res(got)};
 to=setTimeout(done,ms||3000);
 try{pc=new RTCPeerConnection(PEER_OPTS.config);pc.createDataChannel('w');
  pc.onicegatheringstatechange=()=>{if(pc&&pc.iceGatheringState==='complete')done()};
  pc.onicecandidate=e=>{if(!e.candidate)return done();const m=/ typ (host|srflx|prflx|relay)/.exec(e.candidate.candidate);if(m)got[m[1]==='prflx'?'srflx':m[1]]++};
  pc.createOffer().then(o=>pc.setLocalDescription(o)).catch(done)}catch(e){done()}})}

/* Giữ màn hình sáng (iOS 16.4+) để Safari không đóng băng tab khi máy tự khoá */
let WL=null;
async function wakeOn(){try{if(navigator.wakeLock&&!document.hidden&&(!WL||WL.released)){WL=await navigator.wakeLock.request('screen')}}catch(e){}}
function wakeOff(){try{WL&&WL.release&&WL.release()}catch(e){}WL=null}

/* Giữ kết nối tín hiệu với máy chủ: tự nối lại có lùi dần thời gian (0.8s → 8s), không bỏ cuộc */
function keepPeerAlive(peer,net){let k=0;
 peer.on('open',()=>{k=0});
 peer.on('disconnected',()=>{if(ST.net!==net||peer.destroyed)return;
  netMsg(L('Mất kết nối máy chủ, đang nối lại...','Server connection lost, reconnecting...'),'busy');
  const d=Math.min(800*Math.pow(2,k++),8000);
  setTimeout(()=>{if(ST.net===net&&!peer.destroyed&&peer.disconnected){try{peer.reconnect()}catch(e){}}},d)})}

/* Heartbeat trên kênh dữ liệu: gửi ping mỗi 5s; không nhận được gì trong 22s (khi tab đang hiện) thì coi là đứt và đóng để kích hoạt nối lại */
const HB_MS=5000,HB_DEAD=22000;let NET_GRACE=0;
function hbStart(c,onDead){c._last=Date.now();
 const iv=setInterval(()=>{if(!c.open){clearInterval(iv);return}
  try{c.send({t:'ping'})}catch(e){}
  if(!document.hidden&&Date.now()>NET_GRACE&&Date.now()-c._last>HB_DEAD){clearInterval(iv);onDead()}},HB_MS);
 c.on('close',()=>clearInterval(iv))}

/* iOS đóng băng tab khi Safari xuống nền hoặc người dùng vuốt: khi quay lại, kiểm tra và nối lại ngay */
function netWake(){const n=ST.net;if(!n||n.sim)return;wakeOn();NET_GRACE=Date.now()+12000;
 const p=n.peer;if(p&&p.disconnected&&!p.destroyed){try{p.reconnect()}catch(e){}}
 const cs=n.role==='host'?n.conns.slice():(n.conn?[n.conn]:[]);
 cs.forEach(c=>{c._last=Date.now();
  try{if(c.open&&c.dataChannel&&c.dataChannel.readyState!=='open'){c.close();return}if(c.open)c.send({t:'ping'})}catch(e){}})}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)netWake()});
window.addEventListener('pageshow',()=>{netWake()});
window.addEventListener('online',()=>{if(!ST.net)return;netMsg(L('Đã có mạng trở lại','Back online'),'ok');netWake()});
window.addEventListener('offline',()=>{if(!ST.net)return;netMsg(L('Mất mạng, đang chờ kết nối lại...','Offline, waiting to reconnect...'),'busy')});
const NS={t:'',k:''};
const NCOL={busy:'#7a62c9',ok:'#1f9d74',err:'#e8344f','':''};
/* Dòng trạng thái kết nối nhỏ trên cùng màn hình (chạm để ẩn) + dòng trong thẻ Thiết lập/Phòng chờ */
let statT=0;
function statShow(t,k){const e=$('#netstat');if(!e)return;clearTimeout(statT);
 if(!t){e.style.display='none';return}
 e.textContent=t;e.className='st-'+(k||'busy');e.style.display='block';
 if(k==='ok')statT=setTimeout(()=>{e.style.display='none'},5000)}
const netMsg=(t,k)=>{NS.t=t;NS.k=k||'';const e=$('#netmsg');if(e){e.textContent=t;e.style.color=NCOL[NS.k]||''}statShow(t,k)};
document.addEventListener('click',e=>{if(e.target&&e.target.id==='netstat')statShow('')});
/* Hiện lỗi script/promise ngay trên màn hình (không cần mở F12 trên iPhone) khi đang dùng chế độ mạng */
const NOISE=/ResizeObserver|Script error|NotAllowedError|AbortError|AudioContext|play\(\)/i;
window.addEventListener('error',e=>{const m=e&&e.message;if(!m||NOISE.test(m)||!(ST.net||ST.lastNet))return;netMsg(L('Lỗi: ','Error: ')+String(m).slice(0,120)+(e.lineno?' (L'+e.lineno+')':''),'err')});
window.addEventListener('unhandledrejection',e=>{const r=e&&e.reason,m=r&&(r.message||r.type||String(r));if(!m||NOISE.test(String(m))||!(ST.net||ST.lastNet))return;netMsg(L('Lỗi: ','Error: ')+String(m).slice(0,120),'err')});
const netMsgHtml=()=>`<div class="note" id="netmsg" role="status" aria-live="polite" style="font-weight:700;${NCOL[NS.k]?'color:'+NCOL[NS.k]:''}">${esc(NS.t)}</div>`;
const NET_BLOCKED='Mạng đang chặn kết nối P2P. Hãy thử đổi sang Wi-Fi hoặc 4G khác, tắt VPN, rồi thử lại.';
function peerErrMsg(e,code){const ty=e&&e.type;
 if(ty==='peer-unavailable')return 'Không tìm thấy phòng '+(code||'')+'. Kiểm tra lại mã hoặc nhờ chủ phòng tạo lại.';
 if(ty==='browser-incompatible')return 'Trình duyệt này không hỗ trợ WebRTC, hãy dùng Chrome, Safari hoặc Edge bản mới.';
 if(ty==='network'||ty==='server-error'||ty==='socket-error'||ty==='socket-closed')return 'Không kết nối được máy chủ. Mạng có thể đang chặn WebSocket (Wi-Fi công ty/trường học?), hãy thử 4G hoặc mạng khác.';
 if(ty==='webrtc'||ty==='negotiation-failed')return NET_BLOCKED;
 if(ty==='unavailable-id')return 'Mã phòng bị trùng, hãy bấm Tạo phòng lại.';
 return 'Lỗi kết nối: '+(ty||(e&&e.message)||e)}
const IS_IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function netKind(e){if(!e)return '';const t=e.type,m=e.user?String(e.message):'';
 if(t==='webrtc'||t==='negotiation-failed'||/P2P/.test(m))return 'p2p';
 if(t==='network'||t==='server-error'||t==='socket-error'||t==='socket-closed'||/PeerJS|không phản hồi/.test(m))return 'server';return ''}
function netFail(err,code){netClose();show('setup');renderSetup();
 const base=err&&err.user?err.message:peerErrMsg(err,code),tech=err&&!err.user?String(err.type||err.name||''):'';
 netMsg(L('Lỗi: ','Error: ')+trText(base)+(tech?' ['+tech+']':''),'err');
 const k=netKind(err);if(k)openModal('p2phelp',{kind:k,code})}
/* Phòng giả lập: không cần mạng, chỉ có bạn và Bot trên thiết bị này */
function simRoom(){closeModal();netClose();ST.mode='online';ST.online.extra=Math.max(ST.online.extra,1);
 ST.net={role:'host',code:genCode(),peer:null,conns:[],list:null,ready:true,sim:true};
 netMsg('Phòng giả lập: chơi ngay trên thiết bị này, không cần mạng','ok');show('lobby');lobbySync()}
/* Kiểm tra mạng: STUN/TURN có thông không */
function diagIce(){return new Promise(res=>{if(!window.RTCPeerConnection)return res({err:L('Trình duyệt này không hỗ trợ WebRTC.','This browser does not support WebRTC.')});
 const o={host:0,srflx:0,relay:0};let pc;try{pc=new RTCPeerConnection({iceServers:PEER_OPTS.config.iceServers})}catch(e){return res({err:L('Không khởi tạo được WebRTC.','Could not start WebRTC.')})}
 let fin=false;const done=()=>{if(fin)return;fin=true;clearTimeout(to);try{pc.close()}catch(e){}res(o)};const to=setTimeout(done,6500);
 try{pc.createDataChannel('t')}catch(e){}
 pc.onicecandidate=e=>{if(!e.candidate)return done();const m=/ typ (host|srflx|prflx|relay)/.exec(e.candidate.candidate);if(m)o[m[1]==='prflx'?'srflx':m[1]]++};
 pc.createOffer().then(x=>pc.setLocalDescription(x)).catch(done)})}
async function runDiag(){if(!MD||MD.type!=='p2phelp')return;MD.data.diag=L('Đang kiểm tra...','Testing...');renderModal();const ln=[];
 try{const c=new AbortController(),t=setTimeout(()=>c.abort(),6000);await fetch('https://0.peerjs.com/peerjs/id',{cache:'no-store',mode:'no-cors',signal:c.signal});clearTimeout(t);ln.push('✅ '+L('Máy chủ ghép phòng: truy cập được','Matchmaking server: reachable'))}
 catch(e){ln.push('❌ '+L('Máy chủ ghép phòng: không truy cập được','Matchmaking server: unreachable'))}
 const o=await diagIce();
 if(o.err)ln.push('❌ '+o.err);
 else{ln.push((o.srflx?'✅ ':'❌ ')+L('STUN (xuyên NAT): ','STUN (NAT traversal): ')+(o.srflx?L('hoạt động','working'):L('không phản hồi','no response')));
  ln.push((o.relay?'✅ ':'⚠️ ')+L('TURN (chuyển tiếp dự phòng): ','TURN (relay fallback): ')+(o.relay?L('hoạt động','working'):L('không phản hồi','no response')));
  ln.push(o.srflx||o.relay?L('👉 P2P có thể hoạt động. Nếu vẫn lỗi, hãy thử đổi mạng.','👉 P2P should work. If it still fails, try another network.'):L('👉 Mạng đang chặn P2P: hãy tắt Private Relay/VPN hoặc đổi mạng.','👉 Your network blocks P2P: turn off Private Relay/VPN or switch networks.'))}
 if(MD&&MD.type==='p2phelp'){MD.data.diag=ln.join('\n');renderModal()}}
function netClose(){NET_SEQ++;wakeOff();statShow('');voiceAll();CHAT.log=[];CHAT.unread=0;chatToggle(false);const n=ST.net;if(!n)return;ST.net=null;
 const cs=[];try{if(n.conns)cs.push(...n.conns);if(n.conn)cs.push(n.conn)}catch(e){}
 if(n.role==='host')cs.forEach(c=>{try{if(c.open)c.send({t:'bye'})}catch(e){}});
 setTimeout(()=>{cs.forEach(c=>{try{c.close()}catch(e){}});try{n.peer&&n.peer.destroy()}catch(e){}},(n.role==='host'&&cs.length)?250:0)}
const guestSend=m=>{const n=ST.net,c=n&&n.conn;if(c&&c.open){try{c.send(m);return true}catch(e){}}toast(L('Đang nối lại, hãy thử lại sau giây lát','Reconnecting, please try again in a moment'));return false};

/* ----- Chat giọng nói (micro) khi chơi Online -----
   Mỗi người bật micro sẽ gọi âm thanh một chiều (PeerJS MediaConnection) tới mọi người trong phòng; người nhận tự động trả lời và phát.
   Chủ phòng gửi danh sách ID của các khách ({t:'peers'}) để khách gọi được nhau. Cần HTTPS và quyền micro của Safari. */
const VC={on:false,stream:null,out:{},aud:{},busy:false,pend:false};
function voiceTargets(){const n=ST.net;if(!n||n.sim||!n.peer||!n.peer.id)return[];const me=n.peer.id;
 const ids=n.role==='host'?n.conns.filter(c=>c.peer).map(c=>c.peer):[NET_PREFIX+n.code,...(n.peerIds||[])];
 return [...new Set(ids)].filter(i=>i&&i!==me)}
const callAlive=c=>{const pc=c&&c.peerConnection;if(!pc)return false;const t=pc.iceConnectionState;return t!=='failed'&&t!=='closed'&&t!=='disconnected'};
function voiceSync(){const n=ST.net;if(!VC.on||!VC.stream||!n||!n.peer||n.peer.destroyed||n.peer.disconnected)return;
 const want=voiceTargets();
 want.forEach(id=>{if(callAlive(VC.out[id]))return;
  try{const call=n.peer.call(id,VC.stream);VC.out[id]=call;
   const drop=()=>{if(VC.out[id]===call)delete VC.out[id]};call.on('close',drop);call.on('error',drop)}catch(e){}});
 Object.keys(VC.out).forEach(id=>{if(!want.includes(id)){try{VC.out[id].close()}catch(e){}delete VC.out[id]}})}
function voiceIncoming(net,call,late){if(ST.net!==net){try{call.close()}catch(e){}return}
 if(!voiceTargets().includes(call.peer)&&!late){setTimeout(()=>voiceIncoming(net,call,1),1500);return} /* chờ danh sách ID cập nhật */
 if(!voiceTargets().includes(call.peer)){try{call.close()}catch(e){}return}
 try{call.answer()}catch(e){return}
 call.on('stream',st=>voicePlay(call.peer,st));
 call.on('close',()=>voiceStop(call.peer));call.on('error',()=>voiceStop(call.peer))}
function voicePlay(id,st){voiceStop(id);const a=document.createElement('audio');a.autoplay=true;a.playsInline=true;a.setAttribute('playsinline','');a.srcObject=st;a.style.display='none';document.body.appendChild(a);VC.aud[id]=a;
 try{const r=a.play();if(r&&r.catch)r.catch(()=>{VC.pend=true;toast(L('Chạm màn hình để nghe giọng nói','Tap the screen to hear voice chat'))})}catch(e){}}
function voiceStop(id){const a=VC.aud[id];if(a){try{a.pause();a.srcObject=null;a.remove()}catch(e){}delete VC.aud[id]}}
document.addEventListener('pointerdown',()=>{if(VC.pend){VC.pend=false;Object.values(VC.aud).forEach(a=>{try{a.play()}catch(e){}})}});
function voiceUI(){try{if(G&&$('#game').classList.contains('on'))renderTop();else if(ST.net&&$('#lobby').classList.contains('on'))renderLobby()}catch(e){}}
async function voiceOn(){const n=ST.net;if(!n||n.sim||VC.busy)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){netMsg(L('Lỗi: trình duyệt không hỗ trợ micro (cần mở bằng HTTPS)','Error: microphone not supported (HTTPS required)'),'err');return}
 VC.busy=true;
 try{netMsg(L('Đang xin quyền micro...','Requesting microphone...'),'busy');
  const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  if(ST.net!==n){st.getTracks().forEach(t=>t.stop());return}
  VC.stream=st;VC.on=true;st.getAudioTracks().forEach(t=>t.addEventListener('ended',()=>voiceOff()));
  netMsg(L('Micro đang bật','Microphone on'),'ok');voiceSync();micSync()}
 catch(e){const nm=e&&e.name;
  netMsg(L('Lỗi micro: ','Mic error: ')+(nm==='NotAllowedError'?L('chưa được cấp quyền (Cài đặt > Safari > Micro)','permission denied (Settings > Safari > Microphone)'):nm==='NotFoundError'?L('không tìm thấy micro','no microphone found'):String(nm||e)),'err')}
 finally{VC.busy=false;voiceUI()}}
function voiceOff(quiet){VC.on=false;Object.values(VC.out).forEach(c=>{try{c.close()}catch(e){}});VC.out={};
 try{VC.stream&&VC.stream.getTracks().forEach(t=>t.stop())}catch(e){}VC.stream=null;if(!quiet&&ST.net)netMsg(L('Đã tắt micro','Microphone off'),'ok');voiceUI();micSync()}
function voiceAll(){voiceOff(true);Object.keys(VC.aud).forEach(voiceStop)}
function micBtn(top){const n=ST.net;if(!n||n.sim)return '';
 return top?`<button class="btn sm ${VC.on?'mint':'ghost'}" data-a="mic" aria-label="Micro" title="Micro"><span class="tic" aria-hidden="true">${VC.on?'🎙️':'🎤'}</span><span class="lb">${VC.on?'Micro: Bật':'Micro: Tắt'}</span></button>`
  :`<div class="row" style="margin:6px 0"><button class="btn sm ${VC.on?'mint':'ghost'}" data-a="mic">${VC.on?'🎙️ Micro: Bật':'🎤 Micro: Tắt'}</button></div>`}
function peersSync(){const n=ST.net;if(!n||n.role!=='host')return;const ids=n.conns.filter(c=>c.peer&&c.open).map(c=>c.peer);n.conns.forEach(c=>{if(c.open)try{c.send({t:'peers',ids})}catch(e){}})}

/* ----- Khung chat + bong bóng thoại trên nhân vật ----- */
const CHAT={log:[],open:false,unread:0};const CHT={};
const QUICK=['Chào!','Nhanh lên nào','Giao dịch không?','GG'];
const chatOK=()=>!!(ST.net&&!ST.net.sim);
function chatWho(seat){const p=G&&G.players&&G.players[seat];if(p)return{name:p.name,col:p.col};
 let l=null;try{l=ST.net?lobbyList()[seat]:null}catch(e){}return{name:l?l.name:'?',col:PCOL[seat]||'#7a62c9'}}
function chatMine(seat){const n=ST.net;if(!n)return false;if(n.role==='host')return seat===0;return !!(n.inGame&&seat===n.seat)}
function chatBtn(k){if(!chatOK())return '';const b=`<span class="cbd" ${CHAT.unread?'style="display:inline-block"':''}>${CHAT.unread>99?'99+':CHAT.unread}</span>`;
 if(k==='top')return `<button class="btn sm ghost dskx" data-a="chatOpen" aria-label="Chat" title="Chat"><span class="tic" aria-hidden="true">💬</span><span class="lb">Chat</span>${b}</button>`;
 if(k==='m')return `<button class="btn sm ghost" data-a="chatOpen"><span class="ei" aria-hidden="true">💬</span><span>Chat</span>${b}</button>`;
 return `<div class="row" style="margin:6px 0"><button class="btn sm ghost" data-a="chatOpen">💬 Khung chat${b}</button></div>`}
function chatBadge(){$$('.cbd').forEach(e=>{e.textContent=CHAT.unread>99?'99+':CHAT.unread;e.style.display=CHAT.unread?'inline-block':'none'})}
function chatEnsure(){let el=$('#chatp');if(el)return el;el=document.createElement('div');el.id='chatp';el.setAttribute('role','dialog');el.setAttribute('aria-label','Khung chat');
 el.innerHTML=`<div class="chh"><span>💬 Khung chat</span><button data-a="chatClose" aria-label="Đóng">✕</button></div><div class="chl" id="chl"></div><div class="chq">${QUICK.map(t=>`<button class="chip" data-a="chat" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="chi"><input id="chin" type="text" maxlength="80" placeholder="Nhập tin nhắn..." enterkeyhint="send" autocomplete="off" autocorrect="off" autocapitalize="sentences" aria-label="Tin nhắn"><button class="btn gold" data-a="chatSend">Gửi</button></div>`;
 document.body.appendChild(el);return el}
function chatMsgHtml(m){const me=chatMine(m.seat);return `<div class="cm${me?' me':''}"><small><span class="dot" style="color:${m.col}">●</span> ${esc(m.name)}</small>${esc(m.text)}</div>`}
function chatRender(){const l=$('#chl');if(!l)return;l.innerHTML=CHAT.log.length?CHAT.log.map(chatMsgHtml).join(''):'<div class="cem">Chưa có tin nhắn. Hãy chào mọi người!</div>';l.scrollTop=l.scrollHeight}
function chatVV(){const v=window.visualViewport,el=$('#chatp');if(!v||!el)return;const kb=Math.max(0,Math.round(innerHeight-v.height-v.offsetTop));
 el.style.setProperty('--kb',kb+'px');el.style.setProperty('--vvh',Math.round(v.height)+'px');el.classList.toggle('kb',kb>80);const l=$('#chl');if(l&&CHAT.open)l.scrollTop=l.scrollHeight}
if(window.visualViewport){visualViewport.addEventListener('resize',chatVV);visualViewport.addEventListener('scroll',chatVV)}
function chatToggle(on){if(on&&!chatOK())return;const el=on?chatEnsure():$('#chatp');CHAT.open=!!on;
 if(!el)return;el.classList.toggle('on',!!on);
 if(on){CHAT.unread=0;chatBadge();closePop();chatRender();chatVV()}else{const i=$('#chin');if(i)try{i.blur()}catch(e){}}}
function chatSubmit(){const i=$('#chin');if(!i||!chatOK())return;const t=i.value.replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,80);if(!t)return;
 if(ST.net.role==='host')netChat(0,t);else if(!guestSend({t:'chat',text:t}))return;i.value=''}
function showSay(seat,text){if(!G)return;const tk=$('#tk'+seat),bd=tk&&$('.bd',tk),p=G.players[seat];if(!bd||!p||p.out)return;
 $$('.say',bd).forEach(x=>x.remove());const ms=Math.min(6500,2800+text.length*70),d=document.createElement('div');d.className='say';d.textContent=text;d.style.setProperty('--sd',ms+'ms');bd.appendChild(d);
 tk.classList.add('emoting');clearTimeout(tk._st);tk._st=setTimeout(()=>{d.remove();tk.classList.remove('emoting')},ms)}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='chin'){e.preventDefault();chatSubmit()}else if(e.key==='Escape'&&CHAT.open)chatToggle(false)});

/* Biểu tượng micro cạnh tên người chơi đang bật mic: khách báo {t:'mic'} cho chủ phòng, chủ phòng phát lại {t:'mics'} cho mọi người */
function micOn(seat){const n=ST.net;if(!n||n.sim)return false;
 if(n.role==='host'){if(seat===0)return VC.on;const c=n.conns.find(q=>q.seat===seat);return !!(c&&c.mic)}
 if(n.inGame&&seat===n.seat)return VC.on;return !!(n.mics&&n.mics[seat])}
const micIcon=seat=>micOn(seat)?'<span class="micon" title="Đang bật micro" aria-label="Đang bật micro">🎙️</span>':'';
function micRefresh(){try{if(G&&$('#game').classList.contains('on')){PSIG='';renderPlayers()}else if(ST.net&&$('#lobby').classList.contains('on'))renderLobby()}catch(e){}}
function micSync(){const n=ST.net;if(!n||n.sim)return;
 if(n.role==='host'){const m={};if(VC.on)m[0]=1;n.conns.forEach(c=>{if(c.mic&&c.seat!=null)m[c.seat]=1});n.conns.forEach(c=>{if(c.open)try{c.send({t:'mics',m})}catch(e){}})}
 else if(n.conn&&n.conn.open){try{n.conn.send({t:'mic',on:VC.on})}catch(e){}}
 micRefresh()}
function netBroadcast(){const n=ST.net;if(!n||n.role!=='host'||!G)return;n.conns.forEach(c=>{if(c.open)try{c.send({t:'state',G})}catch(e){}})}
/* hồ sơ người chơi (tên + trang phục) */
const pfActive=()=>{const a=document.activeElement;return a&&a.id==='pfName'?{s:a.selectionStart,e:a.selectionEnd}:null};
function pfRestore(p){if(!p)return;const el=document.querySelector('.screen.on #pfName');if(el){el.focus();try{el.setSelectionRange(p.s,p.e)}catch(e){}}}
function profileCard(){const c=ST.me;return `<div class="card profile"><div class="pf-av">${avatar(c,110)}</div><div class="pf-f"><b>Hồ sơ của bạn</b>
 <input type="text" id="pfName" maxlength="14" value="${esc(c.name)}" placeholder="Tên nhân vật" aria-label="Tên nhân vật" autocomplete="off">
 <div class="row">${TYPES.map(([k,n])=>`<button class="chip ${c.type===k?'on':''}" data-a="pfType" data-v="${k}">${n}</button>`).join('')}</div>
 <div class="row">${SKINS.map(x=>`<button class="sw ${c.skin===x?'on':''}" style="background:${x}" data-a="pfSkin" data-v="${x}" aria-label="Màu ${x}"></button>`).join('')}</div>
 <div class="row"><button class="btn sm" data-a="wardrobe">Thay trang phục đầy đủ</button></div></div></div>`}
function profileSync(){const n=ST.net;if(!n)return;if(n.role==='host')lobbySync();else if(n.conn&&n.conn.open){try{n.conn.send({t:'hello',cfg:ST.me})}catch(e){}if($('#lobby').classList.contains('on'))renderLobby()}}
let pfTimer=0;const pfSyncSoon=()=>{clearTimeout(pfTimer);pfTimer=setTimeout(profileSync,700)};
function pfRefresh(){saveCfg(ST.me);const on=id=>$('#'+id).classList.contains('on');if(on('lobby')){renderLobby();profileSync()}else if(on('setup'))renderSetup()}
function lobbyList(){const n=ST.net;return n.role==='host'?[{name:ST.me.name,cfg:ST.me},...n.conns.filter(c=>c.cfg).map(c=>({name:c.cfg.name,cfg:c.cfg}))]:n.list||[]}
function lobbySync(){const n=ST.net;if(n.role==='host'){const l=lobbyList();n.conns.forEach(c=>c.open&&c.send({t:'lobby',list:l}));peersSync();voiceSync();micSync()}renderLobby()}
function renderLobby(){const n=ST.net;if(!n)return;const pf=pfActive();const l=lobbyList(),host=n.role==='host';const tot=l.length+(host?Math.min(ST.online.extra,4-l.length):0);
 $('#lobby').innerHTML=`<div class="bar"><button class="btn ghost sm" data-a="quitYes">← Rời phòng</button><h2>Phòng chờ</h2></div>
 <div class="card">${n.sim?'<div class="mut">Phòng giả lập · chỉ chơi trên thiết bị này</div><div class="lobbyc" id="rcode" style="font-size:.5em">KHÔNG CẦN MẠNG</div>':'<div class="mut">Mã phòng (gửi cho bạn bè)</div><div class="lobbyc" id="rcode">'+n.code+'</div>'}
 ${netMsgHtml()}${micBtn()}${chatBtn()}${profileCard()}<div class="seats">${l.map((p,i)=>`<div class="card seat"><div style="color:${PCOL[i]}" class="mut">${i?'Người chơi '+(i+1):'Chủ phòng'}</div>${avatar(p.cfg,90)}<b>${esc(p.name)}</b>${micIcon(i)}</div>`).join('')}</div>
 ${host?`<div class="grp"><b>Thêm Bot cho đủ bàn</b><div class="row">${[0,1,2].filter(k=>l.length+k<=4).map(k=>`<button class="chip ${Math.min(ST.online.extra,4-l.length)===k?'on':''}" data-a="onExtra" data-v="${k}">${k} Bot</button>`).join('')}${[1,2,3].map(k=>`<button class="chip ${ST.lvl===k?'on':''}" data-a="lvl2" data-v="${k}">${LVN[k]}</button>`).join('')}</div></div>
 <div class="row"><button class="btn gold big" data-a="startOnline" ${tot<2?'disabled':''}>Bắt đầu (${tot} người)</button></div>${n.sim?'<div class="row"><button class="btn ghost sm" data-a="hostRoom">Thử tạo phòng thật lại</button><button class="btn ghost sm" data-a="goLocal">Chơi chung máy</button></div>':''}`:'<div class="note">Đang chờ chủ phòng bắt đầu ván đấu…</div>'}</div>`;pfRestore(pf)}
const genCode=()=>Array.from({length:5},()=>CODEA[rnd(CODEA.length)]).join('');
function sanitizeRemote(c){const d=defCfg(),o=Object.assign({},d,c||{});o.name=String(o.name||'Khách').slice(0,14);if(!TYPES.some(t=>t[0]===o.type))o.type='meo';SLOTS.forEach(([s])=>{if(!ITEM[o[s]])o[s]=d[s]});return o}
async function hostRoom(){ST.lastNet='host';if(ST.net)netClose();const my=++NET_SEQ;wakeOn();
 netMsg(L('Đang kết nối máy chủ...','Connecting to server...'),'busy');
 try{await loadPeer()}catch(e){return netFail(e)}
 if(my!==NET_SEQ)return;
 netMsg(L('Đang thu thập ICE...','Gathering ICE candidates...'),'busy');
 await warmIce(3000);if(my!==NET_SEQ)return;
 netMsg(L('Đang kết nối máy chủ...','Connecting to server...'),'busy');
 let tries=0;
 const make=()=>{const code=genCode();let peer;try{peer=newPeer(NET_PREFIX+code)}catch(e){return netFail(e)}
  const net={role:'host',code,peer,conns:[],list:null,ready:false,tokens:{}};ST.net=net;keepPeerAlive(peer,net);peer.on('call',call=>voiceIncoming(net,call));
  const to=setTimeout(()=>{if(ST.net===net&&!net.ready)netFail(uerr('Máy chủ kết nối không phản hồi. Kiểm tra mạng hoặc thử lại sau ít phút.'))},15000);
  peer.on('open',()=>{if(ST.net!==net)return;clearTimeout(to);
   if(net.ready){netMsg(L('Đã nối lại máy chủ · phòng ','Server reconnected · room ')+code,'ok');return} /* nối lại tín hiệu: không đổi màn hình */
   net.ready=true;netMsg(L('Đã tạo phòng ','Room created: ')+code,'ok');show('lobby');lobbySync()});
  peer.on('error',e=>{if(ST.net!==net)return;const ty=e&&e.type;
   if(ty==='unavailable-id'&&!net.ready&&++tries<6){clearTimeout(to);try{peer.destroy()}catch(x){}ST.net=null;return make()}
   if(net.ready){ /* đã có phòng: lỗi tạm thời không được làm sập phòng */
    if(ty==='webrtc'||ty==='peer-unavailable'||ty==='negotiation-failed'){toast('Một người chơi không kết nối được (mạng bị chặn P2P)');return}
    if(ty==='network'||ty==='server-error'||ty==='socket-error'||ty==='socket-closed'||ty==='unavailable-id'||ty==='disconnected'){netMsg(L('Lỗi: mất kết nối máy chủ, đang nối lại... [','Error: server connection lost, reconnecting... [')+ty+']','busy');return}}
   clearTimeout(to);netFail(e,code)});
  peer.on('connection',c=>{
   c.on('open',()=>hbStart(c,()=>{try{c.close()}catch(e){}}));
   c.on('iceStateChanged',st=>{if(st==='failed'&&c.seat==null)toast(NET_BLOCKED)});
   c.on('data',m=>{c._last=Date.now();if(!m||!m.t||m.t==='ping')return;
    if(m.t==='resume'){hostResume(net,c,m);return}
    if(m.t==='hello'){
     if(c.seat==null){
      if(!G&&m.cid){let ch=0;for(const q of net.conns.slice()){if(q!==c&&q.cid===m.cid){net.conns.splice(net.conns.indexOf(q),1);try{q.close()}catch(e){}ch=1}}if(ch)net.conns.forEach((q,i)=>q.seat=i+1)}
      if(G||net.conns.length>=3){try{c.send({t:'full'})}catch(e){}setTimeout(()=>{try{c.close()}catch(e){}},300);return}
      c.seat=net.conns.length+1;c.cid=m.cid||null;net.conns.push(c)}
     c.cfg=sanitizeRemote(m.cfg);lobbySync()}
    else if(c.seat==null)return;
    else if(m.t==='mic'){c.mic=!!m.on;micSync()}
    else if(m.t==='act'&&G&&(m.a==='emote'||m.a==='throw'||!busy()))act(c.seat,m.a,m.x);
    else if(m.t==='chat')netChat(c.seat,m.text)});
   c.on('close',()=>{if(ST.net!==net)return;const k=net.conns.indexOf(c);if(k<0)return;c.mic=false;if(G){const p=G.players[c.seat];if(p){p.bot=2;p.dc=true;log(p.id,`${p.name} mất kết nối, Bot tiếp quản`);afterChange()}micSync()}else{net.conns.splice(k,1);net.conns.forEach((q,i)=>q.seat=i+1);lobbySync()}})})};
 make()}
/* Người chơi bị rớt mạng (vuốt Safari, đổi Wi-Fi/4G...) nối lại giữa ván: trả ghế từ Bot về cho họ */
function hostResume(net,c,m){
 const seat=+m.seat,old=net.conns.find(q=>q.seat===seat),p=G&&G.players[seat];
 if(!G||!p||!old||!m.token||net.tokens[seat]!==m.token){try{c.send({t:'full'})}catch(e){}setTimeout(()=>{try{c.close()}catch(e){}},300);return}
 net.conns[net.conns.indexOf(old)]=c;c.seat=seat;c.cfg=old.cfg;c.cid=old.cid;try{old.close()}catch(e){}
 if(p.dc){p.bot=0;delete p.dc;log(p.id,`${p.name} đã kết nối lại`)}
 toast(p.name+' '+L('đã kết nối lại','reconnected'));
 try{c.send({t:'state',G})}catch(e){}peersSync();voiceSync();micSync();afterChange()}
async function joinRoom(){const code=($('#joinCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
 if(code.length!==5)return netMsg('Hãy nhập đúng mã phòng 5 ký tự.','err');ST.lastNet='join';ST.lastCode=code;SS.set('dcts_lastcode',code);
 try{$('#joinCode').blur()}catch(e){}
 if(ST.net)netClose();const my=++NET_SEQ;wakeOn();netMsg(L('Đang kết nối máy chủ...','Connecting to server...'),'busy');
 try{await loadPeer()}catch(e){return netFail(e)}
 if(my!==NET_SEQ)return;
 netMsg(L('Đang thu thập ICE...','Gathering ICE candidates...'),'busy');
 await warmIce(3000);if(my!==NET_SEQ)return;
 const net={role:'guest',code,peer:null,conn:null,list:[],opened:false,inGame:false,seat:null,token:null,hostLeft:false,linking:false,cid:Math.random().toString(36).slice(2,10)};
 ST.net=net;guestLink(net,false)}
/* Nối tới phòng: thử tối đa 3 lần khi vào phòng, 8 lần khi tự nối lại; mỗi lần dùng Peer mới.
   recover=true: tự nối lại sau khi bị rớt (trong ván → gửi 'resume', ở phòng chờ → vào lại như mới) */
function guestLink(net,recover){
 const code=net.code,resume=!!(recover&&net.inGame),MAX=recover?8:3;net.linking=true;
 const P2P_ERR='Không kết nối được tới phòng '+code+'. Mạng có thể đang chặn kết nối P2P (thử Wi-Fi/4G khác) hoặc chủ phòng đã thoát.';
 const fail=err=>{net.linking=false;if(ST.net!==net)return;
  if(recover){toast(L('Mất kết nối với phòng','Lost connection to the room'));leave()}else netFail(err||uerr(P2P_ERR),code)};
 const attempt=n=>{if(ST.net!==net||net.hostLeft)return;
  net.conn=null;try{net.peer&&net.peer.destroy()}catch(e){}
  let peer;try{peer=newPeer()}catch(e){return fail(e)}
  net.peer=peer;keepPeerAlive(peer,net);peer.on('call',call=>voiceIncoming(net,call));let done=false,tmo=0,first=true;
  const retry=err=>{if(done||net.opened||ST.net!==net)return;done=true;clearTimeout(tmo);
   if(n<MAX){netMsg((recover?L('Mất kết nối, đang nối lại... ','Connection lost, reconnecting... '):L('Đang kết nối máy chủ... ','Connecting to server... '))+'('+(n+1)+'/'+MAX+')','busy');setTimeout(()=>attempt(n+1),recover?Math.min(800*n,4000):600)}
   else fail(err)};
  tmo=setTimeout(()=>retry(uerr('Máy chủ kết nối không phản hồi. Kiểm tra mạng hoặc thử lại sau ít phút.')),12000);
  peer.on('error',e=>{if(e&&e.type==='peer-unavailable'){if(n<(recover?MAX:2))retry(e);else{done=true;clearTimeout(tmo);fail(e)}}else retry(e)});
  peer.on('open',()=>{if(!first)return;first=false; /* 'open' có thể bắn lại khi nối lại tín hiệu: chỉ xử lý lần đầu */
   if(ST.net!==net||done)return;clearTimeout(tmo);
   netMsg(L('Đang tìm phòng ','Looking for room ')+code+'...'+(n>1?' ('+n+'/'+MAX+')':''),'busy');
   const c=peer.connect(NET_PREFIX+code,{serialization:'json',reliable:true});net.conn=c;
   bindGuest(net,c,{recover,resume,retry,done:()=>done,stop:()=>clearTimeout(tmo)});
   tmo=setTimeout(()=>retry(),12000)})};
 attempt(1)}
function bindGuest(net,c,x){const code=net.code;
 c.on('iceStateChanged',st=>{if(st==='failed'&&!net.opened)x.retry(uerr(NET_BLOCKED))});
 c.on('open',()=>{if(x.done()||ST.net!==net||net.conn!==c)return;
  net.opened=true;net.linking=false;x.stop();hbStart(c,()=>{try{c.close()}catch(e){}});
  if(x.resume)c.send({t:'resume',seat:net.seat,token:net.token});else c.send({t:'hello',cfg:ST.me,cid:net.cid});
  netMsg((x.recover?L('Đã nối lại phòng ','Reconnected to room '):L('Đã vào phòng ','Joined room '))+code,'ok');
  if(!x.recover){show('lobby');renderLobby()}else if(!net.inGame)renderLobby();if(VC.on){setTimeout(voiceSync,600);setTimeout(micSync,700)}});
 c.on('data',m=>{if(net.conn!==c)return;c._last=Date.now();if(!m||!m.t||m.t==='ping')return;
  if(m.t==='lobby'){net.list=m.list;renderLobby()}
  else if(m.t==='full'){if(x.recover){toast(L('Không thể vào lại ván đấu','Could not rejoin the game'));leave()}else netFail(uerr('Phòng đã đầy hoặc ván đấu đã bắt đầu.'))}
  else if(m.t==='start'){net.seat=m.seat;net.token=m.token;net.inGame=true;ST.myIds=[m.seat];G=m.G;rewarded=false;lastFx=0;Q=[];running=false;debtShown=null;closeModal();show('game');buildBoard();afterChange()}
  else if(m.t==='state'){G=m.G;if($('#game').classList.contains('on'))afterChange()}
  else if(m.t==='peers'){net.peerIds=Array.isArray(m.ids)?m.ids.filter(x=>typeof x==='string').slice(0,8):[];if(VC.on)voiceSync()}
  else if(m.t==='mics'){net.mics=(m.m&&typeof m.m==='object')?m.m:{};micRefresh()}
  else if(m.t==='bye'){net.hostLeft=true;toast('Chủ phòng đã thoát');leave()}
  else if(m.t==='chat')netChatShow(m.seat,m.text)});
 c.on('error',()=>x.retry());
 c.on('close',()=>{if(ST.net!==net||net.conn!==c||net.hostLeft)return;
  if(net.opened){net.opened=false;net.conn=null;if(!net.linking)guestLink(net,true)}else x.retry()})}
function startOnline(){const n=ST.net,l=lobbyList();const extra=Math.min(ST.online.extra,4-l.length);
 const seats=l.map(p=>({name:p.name,cfg:p.cfg,bot:0}));for(let i=0;i<extra;i++){const c=randCfg();seats.push({name:c.name,cfg:c,bot:ST.lvl})}
 const seen={};seats.forEach(x=>{if(seen[x.name]){x.name+=' '+(seen[x.name]+1);x.cfg=Object.assign({},x.cfg,{name:x.name})}seen[x.name]=(seen[x.name]||1)+1});
 startGame(seats,[0]);n.tokens=n.tokens||{};n.conns.forEach(c=>{c.token=n.tokens[c.seat]=Math.random().toString(36).slice(2)+Date.now().toString(36);if(c.open)c.send({t:'start',seat:c.seat,token:c.token,G})})}
function netChatShow(seat,text){text=String(text).slice(0,80);const w=chatWho(seat);CHAT.log.push({seat,name:w.name,col:w.col,text});if(CHAT.log.length>60)CHAT.log.shift();
 const inGame=G&&$('#game').classList.contains('on');if(inGame)showSay(seat,text);AUD.play('tick');
 if(CHAT.open){const l=$('#chl');if(l){if(CHAT.log.length===1)l.innerHTML='';l.insertAdjacentHTML('beforeend',chatMsgHtml(CHAT.log[CHAT.log.length-1]));l.scrollTop=l.scrollHeight}}
 else{CHAT.unread++;chatBadge();if(!inGame)toast(w.name+': '+text)}}
function netChat(seat,text){text=String(text).replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,80);if(!text)return;const now=Date.now();if(CHT[seat]&&now-CHT[seat]<500)return;CHT[seat]=now;netChatShow(seat,text);const n=ST.net;if(n&&n.role==='host')n.conns.forEach(c=>c.open&&c.send({t:'chat',seat,text}))}

/* ----- sự kiện ----- */
const H={
 mode(d){ST.mode=d.v;NS.t='';NS.k='';renderSetup();show('setup')},
 home(){netClose();renderMenu();show('menu')},
 mic(){VC.on?voiceOff():voiceOn()},chatOpen(){chatToggle(!CHAT.open)},chatClose(){chatToggle(false)},chatSend(){chatSubmit();const i=$('#chin');if(i)try{i.focus()}catch(e){}},
 mute(){AUD.muted=!AUD.muted;LS.set('dcts_mute',AUD.muted);if(G&&$('#game').classList.contains('on'))renderTop();else renderMenu()},
 wardrobe(d){WD.back=$('.screen.on').id;openWardrobe(d.v!=null?ST.loc[+d.v]:ST.me)},
 nbots(d){ST.nBots=+d.v;renderSetup()},lvl(d){ST.lvl=+d.v;renderSetup()},lvl2(d){ST.lvl=+d.v;renderLobby()},
 reroll(){ST.botCfgs=[randCfg(),randCfg(),randCfg()];renderSetup()},nlocal(d){ST.nLocal=+d.v;renderSetup()},
 startSolo(){startGame(soloSeats(),[0])},
 startLocal(){const l=localSeats();const seen={};l.forEach(x=>{if(seen[x.name])x.name+=' '+(seen[x.name]+1);seen[x.name]=(seen[x.name]||1)+1});startGame(l,l.map((_,i)=>i))},
 hostRoom,joinRoom,startOnline,simRoom,p2pHelp(){openModal('p2phelp',{kind:'manual'})},p2pRetry(){closeModal();(ST.lastNet==='join'?joinRoom:hostRoom)()},p2pDiag(){runDiag()},goLocal(){closeModal();H.mode({v:'local'})},pfType(d){ST.me.type=d.v;ST.me.skin=DEFAULT_SKIN[d.v];pfRefresh()},pfSkin(d){ST.me.skin=d.v;pfRefresh()},onExtra(d){ST.online.extra=+d.v;renderLobby()},
 wdType(d){WD.cfg.type=d.v;WD.cfg.skin=DEFAULT_SKIN[d.v];saveCfg(WD.cfg);wdRender()},
 wdSkin(d){WD.cfg.skin=d.v;saveCfg(WD.cfg);wdRender()},
 wdHair(d){WD.cfg.hair=d.v;saveCfg(WD.cfg);wdRender()},
 wdHairc(d){WD.cfg.hairc=d.v;saveCfg(WD.cfg);wdRender()},
 wdTab(d){WD.tab=d.v;wdRender()},
 wdEq(d){const it=ITEM[d.id];if(!has(it.id))return toast('Món này chưa khả dụng');WD.cfg[it.s]=it.id;AUD.play('tick');saveCfg(WD.cfg);wdRender()},
 wdDone(){saveCfg(WD.cfg);const b=WD.back||'menu';if(b==='setup')renderSetup();else if(b==='lobby'&&ST.net){renderLobby();show('lobby');profileSync();return}else if(b==='lobby'){renderMenu();show('menu');return}else renderMenu();show(b)},
 wdReset(){const d=defCfg();SLOTS.forEach(([k])=>{WD.cfg[k]=d[k]});saveCfg(WD.cfg);wdRender()},
 deed(d){if(Date.now()-(window.__dragged||0)<250||!G)return;if(!T[+d.i].price&&T[+d.i].t!=='tax')return;openModal('deed',{i:+d.i})},
 close(){closeModal()},manage(){openModal('manage')},
 act(d){doAct(d.v,d.i!=null?+d.i:undefined)},
 bid(){const v=Math.floor(+$('#bidv').value);if(!(v>0))return;doAct('bid',v)},
 bidAdd(d){const a=G?.auction;if(!a)return;AUV=a.bid+ +d.v;const e=$('#bidv');if(e)e.value=Math.min(AUV,+e.max)},
 tradeNew(){TD.to=-1;TD.o={cash:0,props:[],fc:0};TD.w={cash:0,props:[],fc:0};openModal('tradeNew')},
 tdTo(d){TD.to=+d.v;TD.w={cash:0,props:[],fc:0};renderModal()},
 tdSend(){if(!G)return;const tr={to:TD.to,o:TD.o,w:TD.w};
  if(ST.net&&ST.net.role==='guest'){if(guestSend({t:'act',a:'trade',x:tr}))closeModal();return}
  const pre=G.trade;doAct('trade',tr);if(G.trade&&G.trade!==pre)closeModal();else toast('Đề nghị không hợp lệ: kiểm tra tiền và tài sản')},
 tradeCancel(){doAct('tradeCancel')},tradeYes(){doAct('tradeResp',true);closeModal()},tradeNo(){doAct('tradeResp',false);closeModal()},
 quit(){openModal('quit')},quitYes(){leave()},
 again(){if(ST.net)return leave();if(ST.mode==='local')H.startLocal();else H.startSolo()},
 emote(d){doEmote(+d.v);closePop()},throw(d){doThrow(+d.v);closePop()},pop(d){ST.pop=ST.pop===d.v?null:d.v;renderPopup()},popClose(){closePop()},tgt(d){ST.tgt=+d.v;if(G)renderDock()},
 chat(d){if(!ST.net)return;if(ST.net.role==='host')netChat(0,d.v);else guestSend({t:'chat',text:d.v});closePop()},
 viewTop(){VW.tilt=0;VW.rot=0;applyView()},viewIso(){VW.tilt=52;VW.rot=-45;applyView()},
 rules(){openModal('rules',{tab:0})},rulesTab(d){if(MD&&MD.type==='rules'){MD.data.tab=+d.v;renderModal()}},lang(d){setLang(d.v)},langToggle(){setLang(LANG==='vi'?'en':'vi')}};
document.addEventListener('click',e=>{if(e.target.id==='ovm'&&MD&&!forced()){closeModal();return}
 const b=e.target.closest('[data-a]');if(!b||b.disabled)return;AUD.init();const f=H[b.dataset.a];if(f)f(b.dataset,b)});
document.addEventListener('input',e=>{const t=e.target;
 if(t.id==='wdName'){WD.cfg.name=t.value;saveCfg(WD.cfg)}
 else if(t.id==='pfName'){ST.me.name=t.value.slice(0,14);saveCfg(ST.me);pfSyncSoon()}
 else if(t.dataset&&t.dataset.nm!=null){ST.loc[+t.dataset.nm].name=t.value.slice(0,14);saveCfg(ST.loc[+t.dataset.nm])}
 else if(t.id==='bidv')AUV=Math.floor(+t.value)||0});
document.addEventListener('change',e=>{const t=e.target,s=t.dataset&&t.dataset.side;if(!s)return;
 if(t.dataset.f==='cash')TD[s].cash=Math.max(0,Math.floor(+t.value)||0);
 else if(t.dataset.f==='fc')TD[s].fc=Math.max(0,Math.floor(+t.value)||0);
 else{const i=+t.value;const a=TD[s].props;if(t.checked){if(!a.includes(i))a.push(i)}else TD[s].props=a.filter(x=>x!==i)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&MD&&!forced())closeModal()});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.mc');if(!c)return;const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--ry',(px*12).toFixed(1)+'deg');c.style.setProperty('--rx',(-py*10).toFixed(1)+'deg')});
document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.mc');if(c){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}});
document.addEventListener('pointerdown',()=>AUD.init(),{once:true});
loadState();ST.lastCode=ST.lastCode||SS.get('dcts_lastcode','');BG.init();FX.init();renderMenu();initLang();

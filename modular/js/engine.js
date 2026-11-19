'use strict';
/* ================= ENGINE (không phụ thuộc DOM) ================= */
const rnd=n=>Math.floor(Math.random()*n);
const rd=()=>1+rnd(6);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
let G=null;
let sfx=()=>{};
let hookSync=()=>{};
const PCOL=['#ff6b8b','#3ed6b0','#5aa7ff','#ffb938'];
const EMO=[['😂','Bật cười'],['😭','Khóc mếu'],['😡','Tức giận'],['❤️','Thả tim'],['😮','Ngạc nhiên'],['👏','Vỗ tay']];
const THR=[{n:'Cà chua chín',v:'cà chua chín'},{n:'Hũ mắm tôm',v:'hũ mắm tôm'},{n:'Dép tổ ong',v:'dép tổ ong'}];
const GROUPS={brown:{c:'#f5c6a0',h:50},lblue:{c:'#b5e3ff',h:50},pink:{c:'#ffb8d9',h:100},orange:{c:'#ffcf94',h:100},red:{c:'#ff9eab',h:150},yellow:{c:'#fff0a0',h:150},green:{c:'#a8f0cf',h:200},dblue:{c:'#b9b3ff',h:200}};
const T=[];
function S(n,g,price,rent,ic){T.push({t:'st',n,g,price,rent,h:GROUPS[g].h,ic})}
T.push({t:'go',n:'BẮT ĐẦU'});
S('Chợ Đồng Xuân','brown',60,[2,10,30,90,160,250],'🏪');
T.push({t:'chest',n:'Khí Vận'});
S('Tháp Rùa','brown',60,[4,20,60,180,320,450],'🐢');
T.push({t:'tax',n:'Thuế Thu Nhập',amt:200});
T.push({t:'rr',n:'Ga Hà Nội',price:200});
S('Văn Miếu','lblue',100,[6,30,90,270,400,550],'📜');
T.push({t:'chance',n:'Cơ Hội'});
S('Chùa Một Cột','lblue',100,[6,30,90,270,400,550],'🌺');
S('Hồ Tây','lblue',120,[8,40,100,300,450,600],'🚣');
T.push({t:'jail',n:'Thăm Tù'});
S('Sa Pa','pink',140,[10,50,150,450,625,750],'🌾');
T.push({t:'util',n:'Nhà Máy Điện',price:150,k:'e'});
S('Tràng An','pink',140,[10,50,150,450,625,750],'⛰️');
S('Vịnh Hạ Long','pink',160,[12,60,180,500,700,900],'🛶');
T.push({t:'rr',n:'Ga Huế',price:200});
S('Phong Nha','orange',180,[14,70,200,550,750,950],'🦇');
T.push({t:'chest',n:'Khí Vận'});
S('Đại Nội Huế','orange',180,[14,70,200,550,750,950],'🏯');
S('Chùa Thiên Mụ','orange',200,[16,80,220,600,800,1000],'🔔');
T.push({t:'free',n:'Nghỉ Mát Miễn Phí'});
S('Cầu Rồng','red',220,[18,90,250,700,875,1050],'🐉');
T.push({t:'chance',n:'Cơ Hội'});
S('Bà Nà Hills','red',220,[18,90,250,700,875,1050],'🎡');
S('Phố Cổ Hội An','red',240,[20,100,300,750,925,1100],'🏮');
T.push({t:'rr',n:'Ga Đà Nẵng',price:200});
S('Nha Trang','yellow',260,[22,110,330,800,975,1150],'🏖️');
S('Đà Lạt','yellow',260,[22,110,330,800,975,1150],'🌸');
T.push({t:'util',n:'Nhà Máy Nước',price:150,k:'w'});
S('Mũi Né','yellow',280,[24,120,360,850,1025,1200],'🏜️');
T.push({t:'gojail',n:'Vào Tù'});
S('Chợ Bến Thành','green',300,[26,130,390,900,1100,1275],'🧺');
S('Nhà Thờ Đức Bà','green',300,[26,130,390,900,1100,1275],'⛪');
T.push({t:'chest',n:'Khí Vận'});
S('Bưu Điện TP','green',320,[28,150,450,1000,1200,1400],'📮');
T.push({t:'rr',n:'Ga Sài Gòn',price:200});
T.push({t:'chance',n:'Cơ Hội'});
S('Dinh Độc Lập','dblue',350,[35,175,500,1100,1300,1500],'🏛️');
T.push({t:'tax',n:'Thuế Xa Xỉ',amt:100});
S('Landmark 81','dblue',400,[50,200,600,1400,1700,2000],'🏙️');
const GRP={};
T.forEach((t,i)=>{t.i=i;if(t.g)(GRP[t.g]=GRP[t.g]||[]).push(i);if(t.price)t.mv=t.price/2});
const RRS=[5,15,25,35],UTS=[12,28];

const CH=[
{x:'Tiến tới ô BẮT ĐẦU. Nhận $200.',e:'go',to:0,f:'good'},
{x:'Tiến tới Phố Cổ Hội An. Qua ô BẮT ĐẦU nhận $200.',e:'go',to:24,f:'neu'},
{x:'Tiến tới Sa Pa. Qua ô BẮT ĐẦU nhận $200.',e:'go',to:11,f:'neu'},
{x:'Tiến tới Công ty tiện ích gần nhất. Nếu có chủ, tung xúc xắc và trả 10 lần số điểm.',e:'near',of:'util',f:'neu'},
{x:'Tiến tới Nhà ga gần nhất. Nếu có chủ, trả gấp đôi tiền thuê.',e:'near',of:'rr',f:'neu'},
{x:'Tiến tới Nhà ga gần nhất. Nếu có chủ, trả gấp đôi tiền thuê.',e:'near',of:'rr',f:'neu'},
{x:'Ngân hàng trả cổ tức. Nhận $50.',e:'m',v:50,f:'good'},
{x:'Thẻ Ra Tù Miễn Phí. Giữ lại để dùng khi cần.',e:'free',f:'good'},
{x:'Lùi lại 3 ô.',e:'back',f:'bad'},
{x:'Vào tù. Đi thẳng vào tù, không qua ô BẮT ĐẦU.',e:'jail',f:'bad'},
{x:'Sửa chữa nhà cửa. Trả $25 mỗi nhà, $100 mỗi khách sạn.',e:'rep',h:25,H:100,f:'bad'},
{x:'Phạt chạy quá tốc độ. Trả $15.',e:'m',v:-15,f:'bad'},
{x:'Đi tới Ga Hà Nội. Qua ô BẮT ĐẦU nhận $200.',e:'go',to:5,f:'neu'},
{x:'Tiến tới Landmark 81.',e:'go',to:39,f:'neu'},
{x:'Bạn được bầu làm chủ tịch hội đồng. Trả $50 cho mỗi người chơi.',e:'each',v:-50,f:'bad'},
{x:'Khoản vay xây dựng đáo hạn. Nhận $150.',e:'m',v:150,f:'good'}];
const CC=[
{x:'Tiến tới ô BẮT ĐẦU. Nhận $200.',e:'go',to:0,f:'good'},
{x:'Ngân hàng nhầm có lợi cho bạn. Nhận $200.',e:'m',v:200,f:'good'},
{x:'Phí bác sĩ. Trả $50.',e:'m',v:-50,f:'bad'},
{x:'Bán cổ phiếu được lời. Nhận $50.',e:'m',v:50,f:'good'},
{x:'Thẻ Ra Tù Miễn Phí. Giữ lại để dùng khi cần.',e:'free',f:'good'},
{x:'Vào tù. Đi thẳng vào tù, không qua ô BẮT ĐẦU.',e:'jail',f:'bad'},
{x:'Quỹ kỳ nghỉ đáo hạn. Nhận $100.',e:'m',v:100,f:'good'},
{x:'Hoàn thuế thu nhập. Nhận $20.',e:'m',v:20,f:'good'},
{x:'Sinh nhật của bạn. Nhận $10 từ mỗi người chơi.',e:'eachget',v:10,f:'good'},
{x:'Bảo hiểm nhân thọ đáo hạn. Nhận $100.',e:'m',v:100,f:'good'},
{x:'Viện phí bệnh viện. Trả $100.',e:'m',v:-100,f:'bad'},
{x:'Học phí. Trả $50.',e:'m',v:-50,f:'bad'},
{x:'Phí tư vấn. Nhận $25.',e:'m',v:25,f:'good'},
{x:'Sửa chữa đường phố. Trả $40 mỗi nhà, $115 mỗi khách sạn.',e:'rep',h:40,H:115,f:'bad'},
{x:'Bạn đoạt giải nhì cuộc thi sắc đẹp. Nhận $10.',e:'m',v:10,f:'good'},
{x:'Thừa kế tài sản. Nhận $100.',e:'m',v:100,f:'good'}];

const cp=()=>G?.players?.[G.cur];
function fx(e){e.id=++G.fxn;G.fx.push(e);if(G.fx.length>120)G.fx.shift()}
function log(c,t){G.log.push({c,t});if(G.log.length>80)G.log.shift()}
const fl=(tile,text,cls)=>fx({k:'float',tile,text,cls});
const snd=n=>fx({k:'sound',n});
function botEmote(pid,i){const p=G.players[pid];if(!p||!p.bot||p.out||Math.random()>.55||Date.now()-(p.et||0)<2500)return;p.et=Date.now();fx({k:'emote',pid,e:i,q:1})}
function botThrow(pid,to,force){const p=G.players[pid],t=G.players[to];if(!p||!t||!p.bot||p.out||t.out||pid===to||Date.now()-(p.tt||0)<(force?1200:4000))return;p.tt=Date.now();const i=rnd(3);fx({k:'throw',from:pid,to,i,q:1});log(pid,`${p.name} ném ${THR[i].v} vào ${t.name}`)}

function newGame(seats){
 const players=seats.map((s,i)=>({id:i,name:s.name,cfg:s.cfg,bot:s.bot||0,net:s.net||null,money:1500,pos:0,jail:false,jt:0,fc:[],out:false,col:PCOL[i]}));
 G={players,own:Array(40).fill(-1),hs:Array(40).fill(0),mort:Array(40).fill(false),cur:0,phase:'roll',dbl:false,doubles:0,bank:{h:32,H:12},log:[],fx:[],fxn:0,rollId:0,last:{id:0,d1:1,d2:1},auction:null,debt:null,trade:null,winner:-1,deck:{ch:shuffle([...Array(16).keys()]),cc:shuffle([...Array(16).keys()])},turnNo:1,tradeTry:-9};
 let best=0,bs=-1;
 players.forEach(p=>{const r=rd()+rd();log(p.id,`${p.name} tung xúc xắc được ${r}`);const s=r+Math.random()*.5;if(s>bs){bs=s;best=p.id}});
 G.cur=best;log(best,`${players[best].name} đi trước!`);snd('start');
 return G}

function ownsAll(o,g){return GRP[g].every(i=>G.own[i]===o)}
const owned=pid=>{const r=[];for(let i=0;i<40;i++)if(G.own[i]===pid)r.push(i);return r};
function rentOf(i,ds,opt){const t=T[i],o=G.own[i];opt=opt||{};
 if(t.t==='st'){const h=G.hs[i];if(h>0)return t.rent[h];return t.rent[0]*(ownsAll(o,t.g)?2:1)}
 if(t.t==='rr'){const n=RRS.filter(k=>G.own[k]===o).length;return 25*(1<<(n-1))*(opt.double?2:1)}
 const n=UTS.filter(k=>G.own[k]===o).length;return ds*(opt.ten?10:(n===2?10:4))}
function liquid(p){let s=p.money;owned(p.id).forEach(i=>{s+=G.hs[i]*(T[i].h||0)/2;if(!G.mort[i])s+=T[i].mv});return s}

/* ----- tiền ----- */
function settle(pid,amt,to){const p=G.players[pid];p.money-=amt;
 if(to>=0)G.players[to].money+=amt;
 else if(to===-2){const os=G.players.filter(q=>!q.out&&q.id!==pid);const per=amt/os.length;os.forEach(q=>q.money+=per)}}
function owe(pid,amt,to,why,cont){const p=G.players[pid];if(amt<=0)return true;
 if(p.money>=amt){settle(pid,amt,to);fl(p.pos,'-$'+amt,'bad');snd('pay');
  if(to>=0){fl(G.players[to].pos,'+$'+amt,'good');if(amt>=80){botEmote(pid,rnd(2)?2:1);botEmote(to,0);if(amt>=150&&Math.random()<.35)botThrow(to,pid)}}return true}
 G.debt={pid,amt,to,why:why||'',cont:cont||null};G.phase='debt';
 log(pid,`${p.name} nợ $${amt} (${why||'khoản phải trả'}) nhưng không đủ tiền mặt!`);snd('alarm');return false}

/* ----- di chuyển ----- */
function advance(p,n){const from=p.pos;p.pos=(from+n)%40;fx({k:'walk',pid:p.id,from,n});
 if(from+n>=40){p.money+=200;log(p.id,`${p.name} qua ô BẮT ĐẦU, nhận $200`);fl(0,'+$200','good');snd('coin')}}
function moveTo(p,idx){advance(p,(idx-p.pos+40)%40)}
function sendJail(p){p.pos=10;p.jail=true;p.jt=0;G.dbl=false;G.doubles=0;
 fx({k:'jump',pid:p.id,to:10});fx({k:'shake'});fl(10,'VÀO TÙ!','bad');snd('jail');botEmote(p.id,rnd(2)?1:2);log(p.id,`${p.name} bị tống vào tù!`)}
function moveAndLand(p,n){G.phase='landing';advance(p,n);land(p,n)}

function land(p,ds,opt){const t=T[p.pos];
 switch(t.t){
  case 'gojail':sendJail(p);break;
  case 'tax':log(p.id,`${p.name} nộp ${t.n} $${t.amt}`);fx({k:'flash',tile:p.pos});owe(p.id,t.amt,-1,t.n);break;
  case 'chance':draw('ch',p);break;
  case 'chest':draw('cc',p);break;
  case 'st':case 'rr':case 'util':{
   const o=G.own[p.pos];
   if(o<0){G.phase='buy';break}
   if(o===p.id||G.mort[p.pos])break;
   const r=rentOf(p.pos,ds,opt);
   log(p.id,`${p.name} trả $${r} tiền thuê ${t.n} cho ${G.players[o].name}`);
   owe(p.id,r,o,'Tiền thuê '+t.n);break}
  case 'go':fx({k:'flash',tile:0});break;
  default:break}
 if(G.phase==='landing')endAction()}

function endAction(){if(G.winner>=0)return;const p=cp();
 if(p.out){nextTurn();return}
 G.phase=(G.dbl&&!p.jail)?'roll':'end'}
function nextTurn(){let n=G.cur;do{n=(n+1)%G.players.length}while(G.players[n].out);
 G.cur=n;G.doubles=0;G.dbl=false;G.phase='roll';G.turnNo++;log(n,`— Lượt của ${G.players[n].name} —`)}
function checkWin(){const al=G.players.filter(p=>!p.out);
 if(al.length===1&&G.players.length>1){G.winner=al[0].id;G.phase='over';fx({k:'win',pid:G.winner});log(G.winner,`${al[0].name} CHIẾN THẮNG!`);return true}return false}

/* ----- thẻ bài ----- */
function draw(dk,p){const ci=G.deck[dk].shift();const c=(dk==='ch'?CH:CC)[ci];
 fx({k:'card',dk,ci,pid:p.id});if(c.f==='bad')botEmote(p.id,4);else if(c.f==='good')botEmote(p.id,3);log(p.id,`${p.name} rút thẻ ${dk==='ch'?'Cơ Hội':'Khí Vận'}: ${c.x}`);
 if(c.e==='free'){p.fc.push({dk,ci})}else G.deck[dk].push(ci);
 applyCard(p,c)}
function applyCard(p,c){
 switch(c.e){
  case 'm':if(c.v>0){p.money+=c.v;fl(p.pos,'+$'+c.v,'good');snd('coin')}else owe(p.id,-c.v,-1,'Thẻ bài');break;
  case 'go':moveTo(p,c.to);G.phase='landing';land(p,G.last.d1+G.last.d2);break;
  case 'near':{let idx=p.pos;for(let k=1;k<40;k++){const j=(p.pos+k)%40;if(T[j].t===(c.of==='rr'?'rr':'util')){idx=j;break}}
   moveTo(p,idx);G.phase='landing';
   const ds=rd()+rd();
   land(p,ds,{double:c.of==='rr',ten:c.of==='util'});break}
  case 'back':p.pos=(p.pos+37)%40;fx({k:'jump',pid:p.id,to:p.pos});G.phase='landing';land(p,G.last.d1+G.last.d2);break;
  case 'jail':sendJail(p);break;
  case 'free':fl(p.pos,'Thẻ ra tù!','good');snd('coin');break;
  case 'rep':{let n=0;owned(p.id).forEach(i=>{const h=G.hs[i];n+=h===5?c.H:h*c.h});if(n>0)owe(p.id,n,-1,'Sửa chữa nhà cửa');else log(p.id,'Không có nhà để sửa — không mất gì.');break}
  case 'each':{const os=G.players.filter(q=>!q.out&&q.id!==p.id);owe(p.id,-c.v*os.length,-2,'Trả mỗi người');break}
  case 'eachget':{G.players.filter(q=>!q.out&&q.id!==p.id).forEach(q=>{const v=Math.min(q.money,c.v);q.money-=v;p.money+=v});fl(p.pos,'+quà','good');snd('coin');break}}}

/* ----- xúc xắc & tù ----- */
function doRoll(){const p=cp();const d1=rd(),d2=rd();G.last={id:++G.rollId,d1,d2};fx({k:'dice',d1,d2});
 const dbl=d1===d2;log(p.id,`${p.name} tung ${d1} + ${d2} = ${d1+d2}${dbl?' (đôi!)':''}`);
 if(p.jail){
  if(dbl){p.jail=false;p.jt=0;G.dbl=false;log(p.id,`${p.name} ra tù nhờ xúc xắc đôi`);moveAndLand(p,d1+d2)}
  else{p.jt++;
   if(p.jt>=3){log(p.id,`${p.name} hết 3 lượt, nộp phạt $50`);G.phase='landing';
    if(owe(p.id,50,-1,'Tiền phạt tù',{k:'jailmove',n:d1+d2})){p.jail=false;p.jt=0;moveAndLand(p,d1+d2)}}
   else{log(p.id,`${p.name} vẫn ở trong tù (lần ${p.jt}/3)`);G.phase='end'}}
  return}
 G.dbl=dbl;
 if(dbl){G.doubles++;if(G.doubles>=3){log(p.id,`${p.name} ra đôi 3 lần liên tiếp!`);sendJail(p);G.phase='end';return}}
 moveAndLand(p,d1+d2)}

/* ----- tài sản ----- */
function canBuild(i,pid){const t=T[i];if(!t||t.t!=='st'||G.own[i]!==pid||!ownsAll(pid,t.g))return false;
 if(GRP[t.g].some(k=>G.mort[k]))return false;const h=G.hs[i];if(h>=5)return false;
 if(GRP[t.g].some(k=>G.hs[k]<h))return false;
 if(h===4?G.bank.H<=0:G.bank.h<=0)return false;return G.players[pid].money>=t.h}
function doBuild(i){const t=T[i],p=G.players[G.own[i]];p.money-=t.h;
 if(G.hs[i]===4){G.bank.h+=4;G.bank.H--}else G.bank.h--;G.hs[i]++;
 log(p.id,`${p.name} xây ${G.hs[i]===5?'khách sạn':'nhà'} tại ${t.n}`);fl(i,G.hs[i]===5?'Khách sạn!':'+Nhà','good');fx({k:'flash',tile:i});snd('build');botEmote(p.id,5)}
function canSell(i,pid){const t=T[i];if(!t||t.t!=='st'||G.own[i]!==pid)return false;const h=G.hs[i];if(h<=0)return false;
 if(GRP[t.g].some(k=>G.hs[k]>h))return false;if(h===5&&G.bank.h<4)return false;return true}
function doSell(i){const t=T[i],p=G.players[G.own[i]];p.money+=t.h/2;
 if(G.hs[i]===5){G.bank.H++;G.bank.h-=4}else G.bank.h++;G.hs[i]--;
 log(p.id,`${p.name} bán nhà tại ${t.n} (+$${t.h/2})`);fl(i,'+$'+t.h/2,'good');snd('coin')}
function canMort(i,pid){const t=T[i];if(!t||!t.price||G.own[i]!==pid||G.mort[i])return false;
 if(t.t==='st'&&GRP[t.g].some(k=>G.hs[k]>0))return false;return true}
const unmortCost=i=>Math.round(T[i].mv*1.1);
function canUnmort(i,pid){return !!T[i].price&&G.own[i]===pid&&G.mort[i]&&G.players[pid].money>=unmortCost(i)}

/* ----- đấu giá ----- */
function startAuction(i){const n=G.players.length,order=[];
 for(let k=1;k<=n;k++){const q=G.players[(G.cur+k)%n];if(!q.out)order.push(q.id)}
 G.auction={idx:i,bid:0,who:-1,order,i:0,passed:[]};G.phase='auction';
 log(G.cur,`Đấu giá ${T[i].n}!`);snd('bell')}
function advanceAuction(){const au=G.auction;const active=au.order.filter(id=>!au.passed.includes(id));
 if(active.length===0||(au.who>=0&&active.length===1)){finishAuction();return}
 let k=au.i;
 for(let s=0;s<au.order.length;s++){k=(k+1)%au.order.length;const id=au.order[k];
  if(!au.passed.includes(id)&&id!==au.who){au.i=k;return}}
 finishAuction()}
function finishAuction(){const au=G.auction;
 if(au.who>=0){const w=G.players[au.who];w.money-=au.bid;G.own[au.idx]=au.who;
  log(w.id,`${w.name} thắng đấu giá ${T[au.idx].n} với $${au.bid}`);fl(au.idx,'Đã bán $'+au.bid,'gold');snd('buy')}
 else log(-1,`Không ai mua ${T[au.idx].n}`);
 G.auction=null;endAction()}

/* ----- phá sản ----- */
function doBankrupt(p){const d=G.debt;const cr=d&&d.to>=0?d.to:-1;
 owned(p.id).forEach(i=>{const h=G.hs[i];if(h>0){p.money+=h*T[i].h/2;if(h===5){G.bank.H++}else G.bank.h+=h;G.hs[i]=0}});
 if(cr>=0){const c=G.players[cr];c.money+=Math.max(0,p.money);
  owned(p.id).forEach(i=>{G.own[i]=cr;if(G.mort[i]){const fee=Math.round(T[i].mv*.1);if(c.money>=fee)c.money-=fee}});
  p.fc.forEach(f=>c.fc.push(f))}
 else{owned(p.id).forEach(i=>{G.own[i]=-1;G.mort[i]=false});p.fc.forEach(f=>G.deck[f.dk].push(f.ci))}
 p.fc=[];p.money=0;p.out=true;p.jail=false;G.debt=null;
 log(p.id,`${p.name} PHÁ SẢN và bị loại!`);fx({k:'shake'});snd('jail');
 if(!checkWin()){if(G.cur===p.id)nextTurn()}}

/* ----- giao dịch ----- */
function tradeValid(tr){const a=G.players[tr.from],b=G.players[tr.to];if(!a||!b||a.out||b.out||tr.from===tr.to)return false;
 const side=(src,it)=>{if(it.cash<0||it.cash>src.money||it.fc<0||it.fc>src.fc.length)return false;
  return it.props.every(i=>G.own[i]===src.id&&T[i].price&&(T[i].t!=='st'||GRP[T[i].g].every(k=>G.hs[k]===0)))};
 return side(a,tr.o)&&side(b,tr.w)&&(tr.o.cash+tr.o.fc+tr.o.props.length+tr.w.cash+tr.w.fc+tr.w.props.length>0)}
function execTrade(tr){const a=G.players[tr.from],b=G.players[tr.to];
 const mv=(src,dst,it)=>{src.money-=it.cash;dst.money+=it.cash;
  it.props.forEach(i=>{G.own[i]=dst.id;if(G.mort[i]){const f=Math.round(T[i].mv*.1);if(dst.money>=f)dst.money-=f}});
  for(let k=0;k<it.fc;k++)dst.fc.push(src.fc.shift())};
 mv(a,b,tr.o);mv(b,a,tr.w);
 log(a.id,`${a.name} và ${b.name} giao dịch thành công!`);snd('buy');fl(a.pos,'Giao dịch!','gold')}

/* ----- điều phối hành động ----- */
function act(pid,a,x){
 if(!G||G.winner>=0)return false;const p=G.players[pid];if(!p||p.out)return false;let ok=false;
 const mine=G.cur===pid,ph=G.phase;
 if(G.trade&&a!=='tradeResp'&&a!=='tradeCancel'&&a!=='emote'&&a!=='throw')return false;
 switch(a){
  case 'emote':if(Number.isInteger(x)&&x>=0&&x<EMO.length&&Date.now()-(p.et||0)>700){p.et=Date.now();fx({k:'emote',pid,e:x});ok=true}break;
  case 'throw':if(x&&Number.isInteger(x.i)&&x.i>=0&&x.i<THR.length){const t=G.players[x.to];if(t&&!t.out&&x.to!==pid&&Date.now()-(p.tt||0)>1200){p.tt=Date.now();fx({k:'throw',from:pid,to:x.to,i:x.i});log(pid,`${p.name} ném ${THR[x.i].v} vào ${t.name}`);if(t.bot&&!p.bot&&Math.random()<.6)botThrow(t.id,pid,1);ok=true}}break;
  case 'roll':if(mine&&ph==='roll'){doRoll();ok=true}break;
  case 'jpay':if(mine&&ph==='roll'&&p.jail&&p.money>=50){p.money-=50;p.jail=false;p.jt=0;log(pid,`${p.name} nộp $50 để ra tù`);fl(p.pos,'-$50','bad');snd('pay');ok=true}break;
  case 'jcard':if(mine&&ph==='roll'&&p.jail&&p.fc.length){const f=p.fc.shift();G.deck[f.dk].push(f.ci);p.jail=false;p.jt=0;log(pid,`${p.name} dùng thẻ Ra Tù Miễn Phí`);fl(p.pos,'Tự do!','good');snd('coin');ok=true}break;
  case 'buy':if(mine&&ph==='buy'){const t=T[p.pos];if(p.money>=t.price){p.money-=t.price;G.own[p.pos]=pid;log(pid,`${p.name} mua ${t.n} giá $${t.price}`);fl(p.pos,'-$'+t.price,'gold');snd('buy');fx({k:'flash',tile:p.pos});botEmote(pid,3);endAction();ok=true}}break;
  case 'noBuy':if(mine&&ph==='buy'){startAuction(p.pos);ok=true}break;
  case 'bid':{const au=G.auction;if(ph==='auction'&&au&&au.order[au.i]===pid&&Number.isFinite(x)&&x>au.bid&&x<=p.money){au.bid=Math.floor(x);au.who=pid;log(pid,`${p.name} trả $${au.bid}`);snd('tick');advanceAuction();ok=true}break}
  case 'pass':{const au=G.auction;if(ph==='auction'&&au&&au.order[au.i]===pid){au.passed.push(pid);log(pid,`${p.name} bỏ qua`);advanceAuction();ok=true}break}
  case 'end':if(mine&&ph==='end'){nextTurn();ok=true}break;
  case 'build':if(mine&&(ph==='roll'||ph==='end')&&canBuild(x,pid)){doBuild(x);ok=true}break;
  case 'sell':if(mine&&(ph==='roll'||ph==='end'||ph==='debt')&&canSell(x,pid)){doSell(x);ok=true}break;
  case 'mort':if(mine&&(ph==='roll'||ph==='end'||ph==='debt')&&canMort(x,pid)){G.mort[x]=true;p.money+=T[x].mv;log(pid,`${p.name} thế chấp ${T[x].n} (+$${T[x].mv})`);fl(x,'+$'+T[x].mv,'good');snd('coin');ok=true}break;
  case 'unmort':if(mine&&(ph==='roll'||ph==='end')&&canUnmort(x,pid)){const c=unmortCost(x);p.money-=c;G.mort[x]=false;log(pid,`${p.name} chuộc ${T[x].n} (-$${c})`);fl(x,'-$'+c,'bad');snd('pay');ok=true}break;
  case 'payDebt':if(mine&&ph==='debt'&&G.debt&&G.debt.pid===pid&&p.money>=G.debt.amt){const d=G.debt;settle(pid,d.amt,d.to);fl(p.pos,'-$'+d.amt,'bad');snd('pay');G.debt=null;
   if(d.cont&&d.cont.k==='jailmove'){p.jail=false;p.jt=0;moveAndLand(p,d.cont.n)}else endAction();ok=true}break;
  case 'bankrupt':if(mine&&ph==='debt'&&G.debt&&liquid(p)<G.debt.amt){doBankrupt(p);ok=true}break;
  case 'trade':if(mine&&(ph==='roll'||ph==='end')&&x){const tr={from:pid,to:x.to,o:x.o,w:x.w};if(tradeValid(tr)){G.trade=tr;log(pid,`${p.name} đề nghị giao dịch với ${G.players[tr.to].name}`);snd('bell');ok=true}}break;
  case 'tradeResp':if(G.trade&&G.trade.to===pid){const tr=G.trade;G.trade=null;
   if(x&&tradeValid(tr))execTrade(tr);else{log(pid,`${p.name} từ chối giao dịch`);snd('pay')}ok=true}break;
  case 'tradeCancel':if(G.trade&&G.trade.from===pid){G.trade=null;ok=true}break}
 if(ok)hookSync();return ok}

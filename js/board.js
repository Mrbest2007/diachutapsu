'use strict';
/* ================= BÀN CỜ 3D ================= */
const ICONS={rr:'🚂',e:'💡',w:'🚰',chance:'❓',chest:'🎁',tax:'💰'};
const NEON={go:'#ff7aa8',jail:'#ffb870',free:'#5fe0a8',gojail:'#78b8ff',chance:'#ffa86b',chest:'#ffcf5e',tax:'#ff8b9d',rr:'#a9b9ff',util:'#6fe3d2'};
function tilePos(i){if(i<=10)return[i===10?1:11-i,11];if(i<=20)return[1,i===20?1:11-(i-10)];if(i<=30)return[i===30?11:i-19,1];return[11,i-29]}
const sideOf=i=>i%10===0?'corner':i<10?'sb':i<20?'sl':i<30?'sT':'sr';
function tileHTML(i){const t=T[i],sd=sideOf(i);let inner='';
 if(t.t==='st')inner=`<div class="strip" id="st${i}" style="background:linear-gradient(#fff6,#fff0),${GROUPS[t.g].c}"></div><div class="ic" style="font-size:1.75em">${t.ic}</div><div class="nm">${t.n}</div><div class="pr">${money(t.price)}</div>`;
 else if(t.t==='rr')inner=`<div class="nm">${t.n}</div><div class="ic">${ICONS.rr}</div><div class="pr">${money(t.price)}</div>`;
 else if(t.t==='util')inner=`<div class="nm">${t.n}</div><div class="ic">${ICONS[t.k]}</div><div class="pr">${money(t.price)}</div>`;
 else if(t.t==='chance'||t.t==='chest')inner=`<div class="fill"><div class="ic" style="font-size:3em">${ICONS[t.t]}</div></div><div class="nm" style="flex:none;padding-bottom:.4em">${t.n}</div>`;
 else if(t.t==='tax')inner=`<div class="nm">${t.n}</div><div class="ic">${ICONS.tax}</div><div class="pr">${money(t.amt)}</div>`;
 else if(t.t==='go')inner=`<div class="lb" style="font-size:1.3em;color:#e8344f">BẮT ĐẦU</div><div class="big" style="color:#e8344f;font-size:4em">⬅</div><div class="lb">Nhận $200</div>`;
 else if(t.t==='jail')inner=`<div class="jailcell"></div><div class="jailtxt">THĂM TÙ</div><div class="lb" style="position:absolute;right:.6em;bottom:.6em;color:#fff;background:#0007;border-radius:.4em;padding:0 .4em;z-index:2">Ở TÙ</div>`;
 else if(t.t==='free')inner=`<div class="big">🏖️</div><div class="lb">NGHỈ MÁT<br>MIỄN PHÍ</div>`;
 else if(t.t==='gojail')inner=`<div class="big">👮</div><div class="lb">VÀO TÙ</div>`;
 const nc=NEON[t.t]&&t.t!=='st'?NEON[t.t]:'';
 return `<div class="tile ${sd==='corner'?'corner':sd} ${nc?'neon':''}" id="tl${i}" data-a="deed" data-i="${i}" style="${nc?'--nc:'+nc+';':''}grid-column:${tilePos(i)[0]};grid-row:${tilePos(i)[1]}"><div class="ti">${inner}</div></div>`}
const SUNMOON='<svg viewBox="0 0 100 100"><defs><radialGradient id="smg"><stop offset="0" stop-color="#fff6c2"/><stop offset="1" stop-color="#ffd166"/></radialGradient></defs><g stroke="#ffd166" stroke-width="2.4" stroke-linecap="round">'+[...Array(12)].map((_,k)=>{const a=k/12*6.283;return `<line x1="${50+Math.cos(a)*30}" y1="${50+Math.sin(a)*30}" x2="${50+Math.cos(a)*(k%2?40:46)}" y2="${50+Math.sin(a)*(k%2?40:46)}"/>`}).join('')+'</g><circle cx="50" cy="50" r="26" fill="url(#smg)"/><path d="M58 33 A19 19 0 1 0 58 67 A15 15 0 1 1 58 33Z" fill="#3a2a7a"/><circle cx="43" cy="47" r="1.8" fill="#3a2a7a"/></svg>';
const PIPS={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
const face=n=>`<div class="f f${n}">${PIPS[n].map(k=>`<i class="p" style="grid-area:${Math.ceil(k/3)}/${(k-1)%3+1}"></i>`).join('')}</div>`;
const dieHTML=(k,x)=>`<div class="du" style="left:${x}em"><div class="dsh" id="dsh${k}"></div><div class="dw" id="dw${k}" style="transform:translateZ(2.9em)"><div class="cube">${[1,2,3,4,5,6].map(face).join('')}</div></div></div>`;
const SCENERY=`<svg class="scenery" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8defc"/><stop offset=".55" stop-color="#ffe6f6"/><stop offset="1" stop-color="#fff3d6"/></linearGradient><radialGradient id="sung"><stop offset="0" stop-color="#fffbe0"/><stop offset=".5" stop-color="#ffe58a"/><stop offset="1" stop-color="#ffe58a" stop-opacity="0"/></radialGradient><linearGradient id="rivg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#cdbcff"/></linearGradient></defs>
<rect width="400" height="400" rx="8" fill="url(#skyg)"/><circle cx="322" cy="76" r="64" fill="url(#sung)"/><circle cx="322" cy="76" r="26" fill="#ffe27a"/>
<g fill="#fff" opacity=".92"><ellipse cx="72" cy="62" rx="34" ry="11"/><ellipse cx="96" cy="52" rx="22" ry="14"/><ellipse cx="52" cy="56" rx="20" ry="9"/><ellipse cx="214" cy="40" rx="28" ry="9"/><ellipse cx="232" cy="32" rx="16" ry="10"/><ellipse cx="372" cy="150" rx="24" ry="8"/></g>
<path d="M0 215 L60 140 L105 190 L160 120 L225 200 L275 150 L340 205 L400 160 L400 270 L0 270Z" fill="#d9ccfb"/>
<path d="M0 245 L70 188 L130 232 L200 178 L270 236 L330 192 L400 238 L400 290 L0 290Z" fill="#c6b4f5"/>
<path d="M0 282 Q90 240 190 274 T400 266 L400 400 L0 400Z" fill="#b7efd0"/>
<g fill="none" stroke-linecap="round" stroke-width="7"><path d="M12 300 Q72 280 140 300" stroke="#9fe3b8"/><path d="M22 314 Q80 296 148 314" stroke="#d4f5a8"/><path d="M6 328 Q76 308 150 328" stroke="#8fdcae"/><path d="M290 296 Q340 280 396 298" stroke="#d4f5a8"/><path d="M280 310 Q336 294 400 312" stroke="#9fe3b8"/></g>
<path d="M-10 346 Q80 316 170 346 T330 342 T420 360 L420 410 L-10 410Z" fill="url(#rivg)"/>
<g stroke="#fff" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"><path d="M30 372 q10 -6 20 0 t20 0"/><path d="M250 378 q10 -6 20 0 t20 0"/><path d="M330 362 q8 -5 16 0 t16 0"/></g>
<g><path d="M62 366 q22 16 46 0z" fill="#ff8fb0"/><path d="M86 366 v-28 l17 22z" fill="#fff"/><path d="M300 372 q22 14 44 0z" fill="#ffc94d"/><path d="M322 372 v-24 l15 19z" fill="#fff"/></g>
<ellipse cx="200" cy="352" rx="30" ry="9" fill="#8fdcae"/><rect x="186" y="330" width="28" height="22" rx="2" fill="#fff0c8"/><rect x="190" y="316" width="20" height="14" rx="2" fill="#ffe3b0"/><path d="M182 330 L200 314 L218 330Z" fill="#ff9aa8"/><path d="M186 316 L200 303 L214 316Z" fill="#ff7f95"/><rect x="195" y="338" width="10" height="14" rx="5" fill="#c98a5a"/>
<g><rect x="42" y="262" width="5" height="34" rx="2" fill="#b98a5a"/><path d="M44 264 q-22 -4 -28 12 q14 -10 28 -4z M44 264 q22 -10 32 4 q-16 -8 -32 0z M44 262 q-6 -20 -22 -20 q14 4 22 20z" fill="#6fd9a0"/><rect x="360" y="270" width="5" height="30" rx="2" fill="#b98a5a"/><path d="M362 272 q-22 -4 -28 10 q14 -8 28 -2z M362 272 q22 -8 30 4 q-16 -8 -30 -2z M362 270 q-4 -18 -20 -18 q14 4 20 18z" fill="#6fd9a0"/></g>
<g><path d="M120 258 q8 -22 22 0z" fill="#ffd9e8"/><rect x="127" y="248" width="8" height="10" fill="#fff"/><path d="M262 250 l8 -16 l8 16z" fill="#ff9aa8"/><rect x="264" y="250" width="12" height="9" fill="#fff0c8"/></g>
<path d="M0 22 Q100 52 200 22 T400 22" fill="none" stroke="#ffb8d6" stroke-width="2"/><g fill="#ff6f8c"><circle cx="50" cy="38" r="6"/><circle cx="130" cy="48" r="6"/><circle cx="270" cy="48" r="6"/><circle cx="350" cy="38" r="6"/></g><g fill="#ffd166"><circle cx="90" cy="46" r="5"/><circle cx="200" cy="34" r="5"/><circle cx="310" cy="46" r="5"/></g></svg>`;
function buildBoard(){
 if(MOB()&&!VW.mset){VW.mset=1;VW.tilt=14;VW.rot=0}
 $('#stage').innerHTML=`<div class="view"><label for="vTilt">Nghiêng</label><input type="range" id="vTilt" min="0" max="70" value="${VW.tilt}"><label for="vRot">Xoay</label><input type="range" id="vRot" min="-180" max="180" value="${VW.rot}"><button class="btn sm ghost" data-a="viewTop">Từ trên</button><button class="btn sm ghost" data-a="viewIso">3D</button><label for="vZoom">Thu phóng</label><input type="range" id="vZoom" min="80" max="140" value="${Math.round(VW.zoom*100)}"><span id="zoomv" style="min-width:3em">${Math.round(VW.zoom*100)}%</span><span class="mut">Kéo để xoay · lăn chuột để zoom</span></div>
 <div class="scene" id="scene"><div class="b3d" id="b3d"><div class="plane" id="plane">${T.map((_,i)=>tileHTML(i)).join('')}
 <div class="center">${SCENERY}<div class="logo">ĐỊA CHỦ<br>TẬP SỰ<small>VIỆT NAM · PASTEL CHIBI</small></div>
  <div class="deck" id="dkch" style="left:7%;top:53%;transform:rotate(-24deg)"><div class="cd tarot c1"></div><div class="cd tarot c1"></div><div class="cd tarot c1"><div style="width:60%;filter:hue-rotate(0)">${SUNMOON}</div>CƠ HỘI</div></div>
  <div class="deck" id="dkcc" style="right:7%;top:53%;transform:rotate(24deg)"><div class="cd tarot"></div><div class="cd tarot"></div><div class="cd tarot"><div style="width:60%">${SUNMOON}</div>KHÍ VẬN</div></div>
  <div class="cbanner" id="cban" style="top:7%"></div>
  <div class="dice" id="dice">${dieHTML(0,-3.6)}${dieHTML(1,3.6)}</div>
  <div class="clog" id="clog"></div></div>
 <div class="tokens" id="tokens"></div></div></div></div>`;
 G.players.forEach(p=>{const e=document.createElement('div');e.className='tk';e.id='tk'+p.id;e.style.setProperty('--pcol',p.col);
  e.innerHTML=`<div class="base"></div><div class="bd"><div class="hop">${avatar(p.cfg,100)}</div><div class="lab">${esc(p.name)}</div></div>`;$('#tokens').appendChild(e)});
 setupScene();applyView();fitBoard();setDice(G.last.d1,G.last.d2,true);updateBoard();renderTokens()}
const VW={tilt:34,rot:0,zoom:1};
let BSZ=640;
function viewGeom(bs){const t=VW.tilt*Math.PI/180,r=VW.rot*Math.PI/180,P=bs*2.1;
 const e0=(Math.abs(Math.cos(r))+Math.abs(Math.sin(r)))*bs/2,sn=Math.sin(t),cs=Math.cos(t);
 const k=Math.min(1,(bs/2)*(P-e0*sn)/(e0*P));
 return {k,yb:k*e0*cs*P/(P-e0*sn)+12,yt:k*e0*cs*P/(P+e0*sn)}}
function applyView(){const g=viewGeom(BSZ),rs=document.documentElement.style;
 rs.setProperty('--tilt',VW.tilt+'deg');rs.setProperty('--rot',VW.rot+'deg');
 const b=$('#b3d'),sc=$('#scene');
 if(b&&sc){b.style.scale=g.k.toFixed(3);const pad=16,cy=g.yt+pad;sc.style.height=Math.ceil(g.yt+g.yb+pad*2+22)+'px';sc.style.perspectiveOrigin='50% '+cy.toFixed(1)+'px';b.style.top=(cy-BSZ/2).toFixed(1)+'px'}
 const a=$('#vTilt'),c=$('#vRot');if(a)a.value=VW.tilt;if(c)c.value=VW.rot;const z=$('#vZoom');if(z)z.value=Math.round(VW.zoom*100);const zv=$('#zoomv');if(zv)zv.textContent=Math.round(VW.zoom*100)+'%'}
function setupScene(){const sc=$('#scene');let d=null;
 sc.addEventListener('pointerdown',e=>{d={x:e.clientX,y:e.clientY,rot:VW.rot,tilt:VW.tilt,m:false};sc.setPointerCapture(e.pointerId)});
 sc.addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>5){d.m=true;sc.classList.add('drag')}
  if(d.m){VW.rot=Math.max(-180,Math.min(180,d.rot+dx*.4));VW.tilt=Math.max(0,Math.min(70,d.tilt-dy*.3));applyView()}});
 const up=()=>{if(d&&d.m)window.__dragged=Date.now();d=null;sc.classList.remove('drag')};
 sc.addEventListener('pointerup',up);sc.addEventListener('pointercancel',up);
 $('#vTilt').addEventListener('input',e=>{VW.tilt=+e.target.value;applyView()});
 $('#vRot').addEventListener('input',e=>{VW.rot=+e.target.value;applyView()});
 $('#vZoom').addEventListener('input',e=>{VW.zoom=+e.target.value/100;fitBoard()});
 sc.addEventListener('wheel',e=>{e.preventDefault();VW.zoom=Math.max(.8,Math.min(1.4,VW.zoom-e.deltaY*.001));fitBoard()},{passive:false})}
function fitBoard(){const st=$('#stage');if(!st||!G)return;const w=st.clientWidth||innerWidth-32;
 const t=34*Math.PI/180,P=2.1,e=.5,sn=Math.sin(t),hf=Math.cos(t)*e*(P/(P-e*sn)+P/(P+e*sn))+.08;
 if(MOB()){const hh=st.clientHeight;let b=Math.min(w*.97,innerWidth*.94,420);
  for(let k=0;k<6&&hh>120;k++){BSZ=b;const g=viewGeom(b),sh=g.yt+g.yb+54;if(sh<=hh)break;b*=hh/sh}
  BSZ=Math.max(230,b*VW.zoom);document.documentElement.style.setProperty('--bs',BSZ.toFixed(1)+'px');applyView();return}
 const desk=innerWidth>980,base=desk?Math.max(380,Math.min(w*.98,(innerHeight-190)/.93,900)):Math.min(w*.98,880);BSZ=Math.max(300,base*VW.zoom);
 document.documentElement.style.setProperty('--bs',BSZ.toFixed(1)+'px');applyView()}
addEventListener('resize',()=>{if(G)fitBoard()});

function updateBoard(){if(!G)return;
 for(let i=0;i<40;i++){const t=T[i];if(!t.price)continue;const el=$('#tl'+i);if(!el)continue;const o=G.own[i];
  el.classList.toggle('owned',o>=0);el.classList.toggle('mort',!!G.mort[i]);
  if(o>=0)el.style.setProperty('--oc',G.players[o].col);
  let dot=el.querySelector('.owndot');if(o>=0&&!dot){dot=document.createElement('i');dot.className='owndot';el.appendChild(dot)}if(o<0&&dot)dot.remove();
  if(t.t==='st'){const s=$('#st'+i),h=G.hs[i];const key=h+'';if(s&&s.dataset.h!==key){const prev=+s.dataset.h||0;s.dataset.h=key;s.dataset.n=key;s.innerHTML=stripHTML(h,prev)}}}
 const last=G.log.slice(-4);$('#clog').innerHTML=last.map(l=>`<div style="color:${l.c>=0?G.players[l.c].col:'#7a5cc4'};filter:brightness(.62)">${esc(l.t)}</div>`).join('');
 const p=cp();const b=$('#cban');b.textContent=G.winner>=0?'Kết thúc!':`Lượt của ${p.name}`;b.style.setProperty('--pcol',p.col)}

/* token */
const fr=c=>c===1?.775:c===11?1.55+9+.775:c+.05;
function tkXY(i){const[c,r]=tilePos(i);return[fr(c)/12.1*100,fr(r)/12.1*100]}
const disp={};
function renderTokens(){if(!G)return;const run=Q.length>0||running;
 G.players.forEach((p,k)=>{const e=$('#tk'+p.id);if(!e)return;if(!run||disp[p.id]==null)disp[p.id]=p.pos;
  const pos=disp[p.id],[x,y]=tkXY(pos);let dx=0,dy=0;const cnt=G.players.filter(q=>!q.out&&(disp[q.id]??q.pos)===pos);const idx=cnt.indexOf(p);
  if(pos===10){if(p.jail&&!run){dx=1.6+idx*.9;dy=-1.6+idx*.5}else{dx=-2.2+idx*.9;dy=2.2-idx*.4}}else{dx=(idx-(cnt.length-1)/2)*2.6;dy=(idx%2?1:-1)*.9}
  e.style.left=`calc(${x}% + ${dx}em)`;e.style.top=`calc(${y}% + ${dy}em)`;e.style.zIndex=Math.round(y*2)+idx;e.style.display=p.out?'none':'block';e.dataset.turn=p.id===G.cur?1:0});}
function hop(pid){const h=$('#tk'+pid+' .hop');if(!h)return;h.classList.remove('hp');void h.offsetWidth;h.classList.add('hp')}
function spawnFloat(i,text,cls){const[x,y]=tkXY(i);const d=document.createElement('div');d.className='ft '+(cls||'');d.style.left=x+'%';d.style.top=y+'%';d.innerHTML=`<i>${esc(text)}</i>`;$('#tokens').appendChild(d);setTimeout(()=>d.remove(),1700)}
function spawnTrail(pid,i){const c=G?.players?.[pid]?.cfg?.trail;if(!c)return;const ic=trI(c,0);if(!ic)return;const[x,y]=tkXY(i);
 const n=c==='t_coin'?3:c==='t_bubble'?3:c==='t_star'?4:/^t_(heart|petal|lotus|feather|glitter|efeather|bolt)$/.test(c)?3:2;
 for(let k=0;k<n;k++){const d=document.createElement('div');d.className='pt';d.style.left=x+'%';d.style.top=y+'%';d.innerHTML=`<i style="--dx:${(Math.random()-.5)*4}em;--rr:${(Math.random()-.5)*80}deg;animation-delay:${k*70}ms">${trI(c,k)}</i>`;$('#tokens').appendChild(d);setTimeout(()=>d.remove(),1500)}}
const EMO_BURST=['','💧','💢','💗','❗','✨'];
function showEmote(e){if(!G||!EMO[e.e])return;const tk=$('#tk'+e.pid),bd=tk&&$('.bd',tk),p=G.players[e.pid];if(!bd||!p||p.out)return;
 $$('.emo',bd).forEach(x=>x.remove());const d=document.createElement('div');d.className='emo e'+e.e;d.innerHTML=`<b>${EMO[e.e][0]}</b>`;bd.appendChild(d);
 tk.classList.add('emoting');clearTimeout(tk._et);tk._et=setTimeout(()=>{d.remove();tk.classList.remove('emoting')},3000);
 AUD.play('em'+e.e);const ic=EMO_BURST[e.e];if(ic){const[x,y]=tkXY(disp[e.pid]??p.pos);
  for(let k=0;k<5;k++){const q=document.createElement('div');q.className='pt';q.style.left=x+'%';q.style.top=`calc(${y}% - 5em)`;
   q.innerHTML=`<i style="--dx:${(Math.random()-.5)*7}em;--rr:${(Math.random()-.5)*60}deg;animation-delay:${k*90}ms">${ic}</i>`;$('#tokens').appendChild(q);setTimeout(()=>q.remove(),1700)}}}
function showThrow(e){if(!G)return;const a=G.players[e.from],b=G.players[e.to];if(!a||!b||b.out||!THR_IC[e.i])return;
 const[x0,y0]=tkXY(disp[e.from]??a.pos),[x1,y1]=tkXY(disp[e.to]??b.pos);
 const d=document.createElement('div');d.className='proj pj'+e.i;d.style.left=x0+'%';d.style.top=y0+'%';d.innerHTML=`<i>${THR_IC[e.i]}</i>`;
 $('#tokens').appendChild(d);void d.offsetWidth;d.style.left=x1+'%';d.style.top=y1+'%';AUD.play('whoosh');
 setTimeout(()=>{d.remove();if(G)impact(e)},850)}
function impact(e){const tk=$('#tk'+e.to),bd=tk&&$('.bd',tk),b=G.players[e.to];if(!bd||!b||b.out)return;
 AUD.play('hit'+e.i);$$('.stain',bd).forEach(x=>x.remove());
 const s=document.createElement('div');s.className='stain st'+e.i;if(e.i===1)s.innerHTML='<u></u><u></u><u></u>';bd.appendChild(s);setTimeout(()=>s.remove(),e.i===2?900:4200);
 tk.classList.add('ouch');setTimeout(()=>tk.classList.remove('ouch'),650);
 const pos=disp[e.to]??b.pos;spawnFloat(pos,['BỤP!','THỐI QUÁ!','CHÁT!'][e.i],e.i===2?'gold':'bad');
 const[x,y]=tkXY(pos),col=e.i===0?'#e8344f':e.i===1?'#9b4f8a':'';
 for(let k=0;k<6;k++){const q=document.createElement('div');q.className='pt';q.style.left=x+'%';q.style.top=`calc(${y}% - 6em)`;
  q.innerHTML=`<i style="--dx:${(Math.random()-.5)*8}em;--rr:${(Math.random()-.5)*90}deg;animation-delay:${k*40}ms">${col?`<span class="drop" style="background:${col}"></span>`:(k%2?'✨':'💥')}</i>`;
  $('#tokens').appendChild(q);setTimeout(()=>q.remove(),1500)}}
function doThrow(i){if(!G||G.winner>=0||ST.tgt==null||ST.tgt<0)return;
 if(ST.net&&ST.net.role==='guest'){ST.net.conn.send({t:'act',a:'throw',x:{to:ST.tgt,i}});return}
 const pid=ST.myIds.includes(G.cur)&&!G.players[G.cur].bot?G.cur:ST.myIds[0];act(pid,'throw',{to:ST.tgt,i})}
function doEmote(i){if(!G||G.winner>=0)return;
 if(ST.net&&ST.net.role==='guest'){ST.net.conn.send({t:'act',a:'emote',x:i});return}
 const pid=ST.myIds.includes(G.cur)&&!G.players[G.cur].bot?G.cur:ST.myIds[0];act(pid,'emote',i)}
function flashTile(i){const el=$('#tl'+i);if(!el)return;$$('.tflash',el).forEach(x=>x.remove());const f=document.createElement('div');f.className='tflash';el.appendChild(f);setTimeout(()=>f.remove(),850)}

function landTile(t,pid){flashTile(t);
 const p=G?.players?.[pid];if(p)toast(p.name+' đến '+T[t].n)}
/* xúc xắc 3D */
const DR={1:[0,0],6:[0,180],3:[0,-90],4:[0,90],2:[-90,0],5:[90,0]};
function setDice(a,b,instant){[a,b].forEach((v,k)=>{const c=$(`#dw${k} .cube`);if(!c)return;const[x,y]=DR[v];if(instant){c.style.transition='none';c.style.transform=`rotateX(${x}deg) rotateY(${y}deg)`}})}
let DICE_RUN=0;
function simDie(k){const g=60,dt=1/120;
 let x=-12+Math.random()*3,y=6+Math.random()*5,z=10+Math.random()*2,vx=9+Math.random()*5,vy=-(6+Math.random()*5),vz=11+Math.random()*4;
 const tr=[],hits=[];let t=0,n=0,rest=false;
 while(t<3&&!rest){vz-=g*dt;z+=vz*dt;x+=vx*dt;y+=vy*dt;
  const fl=2.9+1.3*Math.exp(-t*2.2);
  if(z<fl){const iv=-vz;z=fl;if(iv>3.2){vz=iv*.52;vx*=.78;vy*=.78;hits.push({t,v:iv});n++}else{vz=0;if(n>=3)rest=true}}
  tr.push([x,y,z]);t+=dt}
 const T=Math.min(3,t)+.1,e=tr[tr.length-1];
 const sp=()=>(Math.random()<.5?-1:1)*360*(2+rnd(2));
 return {tr,hits,T,ex:e[0],ey:e[1],S:[sp(),sp(),sp()],yaw:90*rnd(4),idx:0}}
function animDice(a,b){return new Promise(res=>{const my=++DICE_RUN;AUD.play('whoosh');
 const sp=[a,b].map((v,k)=>Object.assign(simDie(k),{k,v,delay:k*.09}));
 const TT=Math.max(...sp.map(s=>s.T+s.delay));let done=false;
 const fin=()=>{if(done)return;done=true;
  sp.forEach(s=>{const w=$('#dw'+s.k),c=w.querySelector('.cube'),sh=$('#dsh'+s.k),[x,y]=DR[s.v];
   c.style.transition='none';c.style.setProperty('--bl','0px');c.style.transform=`rotateZ(${s.yaw}deg) rotateX(${x}deg) rotateY(${y}deg)`;
   w.style.transform='translate3d(0,0,2.9em)';sh.style.transform='';sh.style.opacity='';sh.style.filter=''});
  if(DICE_RUN===my)res();else res()};
 const draw=(s,el)=>{const t=Math.max(0,Math.min(el,s.T)),u=t/s.T,i=Math.min(s.tr.length-1,Math.floor(t*120)),q=s.tr[i];
  const cs=u*u,x=q[0]-s.ex*cs,y=q[1]-s.ey*cs,z=u>=1?2.9:q[2],h=Math.max(0,z-2.9);
  const p=1-Math.pow(1-u,2.4),rem=1-p,[tx,ty]=DR[s.v];
  let kx=0,ky=0;for(const hh of s.hits){const d=t-hh.t;if(d>=0&&d<.5){const am=Math.min(14,hh.v*.5)*Math.exp(-d*9);kx+=am*Math.sin(d*42);ky+=am*Math.cos(d*37)}}
  const w=$('#dw'+s.k),c=w.querySelector('.cube'),sh=$('#dsh'+s.k);
  c.style.transition='none';
  c.style.transform=`rotateZ(${s.yaw+s.S[2]*rem}deg) rotateX(${tx+s.S[0]*rem+kx}deg) rotateY(${ty+s.S[1]*rem+ky}deg)`;
  w.style.transform=`translate3d(${x}em,${y}em,${z}em)`;
  const nx=s.tr[Math.min(s.tr.length-1,i+6)],lin=Math.hypot(nx[0]-q[0],nx[1]-q[1],nx[2]-q[2])*20;
  const om=Math.hypot(s.S[0],s.S[1],s.S[2])*2.4*Math.pow(1-u,1.4)/s.T;
  const bl=Math.min(3.2,om/700+lin*.02);c.style.setProperty('--bl',(bl>.25?bl.toFixed(2):0)+'px');
  sh.style.transform=`translate(${(x+h*.2).toFixed(2)}em,${(y+h*.32).toFixed(2)}em) rotate(${s.yaw}deg) scale(${(1+h*.045).toFixed(3)})`;
  sh.style.opacity=(.95/(1+h*.24)).toFixed(3);sh.style.filter=`blur(${(.35+h*.07).toFixed(2)}em)`;
  while(s.idx<s.hits.length&&t>=s.hits[s.idx].t){AUD.clack(s.hits[s.idx].v/30);s.idx++}};
 const T0=performance.now();
 const frame=now=>{if(done||DICE_RUN!==my)return;const el=(now-T0)/1000;sp.forEach(s=>draw(s,el-s.delay));if(el<TT)requestAnimationFrame(frame);else fin()};
 sp.forEach(s=>draw(s,0));requestAnimationFrame(frame);setTimeout(fin,TT*1000+300)})}
/* thẻ bài tarot */
function cardIcon(c){return ({go:'🚀',near:'🚉',m:c.v>0?'💰':'💸',free:'🗝️',back:'⏪',jail:'🔒',rep:'🔨',each:'🎪',eachget:'🎂'})[c.e]||'✨'}
function showCard(dk,ci,pid){return new Promise(res=>{const c=(dk==='ch'?CH:CC)[ci],cls=c.f;const dr=G&&G.players[pid],manual=!!dr&&!dr.bot&&isMine(pid);
 const gl=cls==='good'?'#3fd69a':cls==='bad'?'#ff6f8c':'#ffbf47';
 const c1=cls==='good'?'#eafff5':cls==='bad'?'#fff0f3':'#fff8e4',c2=cls==='good'?'#b9f3d9':cls==='bad'?'#ffc6d4':'#ffe1a6';
 const tag=cls==='good'?'TIN VUI':cls==='bad'?'THỬ THÁCH':'BẤT NGỜ',ttl=dk==='ch'?'CƠ HỘI':'KHÍ VẬN';
 const ov=$('#ovc');
 ov.innerHTML=`<div class="c3d"><div class="cin" id="cin"><div class="cf bk"><div class="sunmoon">${SUNMOON}</div><div class="cbt">${ttl}</div><div class="cbs">ĐỊA CHỦ TẬP SỰ</div></div>
 <div class="cf fr" style="--c1:${c1};--c2:${c2};--gl:${gl}"><i class="orn o1">✦</i><i class="orn o2">✦</i><i class="orn o3">✦</i><i class="orn o4">✦</i><div class="ctag">${tag}</div><div class="ctop">${cardIcon(c)}</div><h4>${ttl}</h4><p>${esc(c.x)}</p><div class="stamp">ĐỊA CHỦ TẬP SỰ · VIỆT NAM</div></div></div></div><button class="btn gold big cardok" id="cok">Đã hiểu</button>`;
 ov.classList.add('on');AUD.play('card');const cin=$('#cin');let done=false;const fin=()=>{if(done)return;done=true;cin.style.opacity=0;setTimeout(()=>{ov.classList.remove('on');ov.innerHTML='';res()},300)};
 const ok=$('#cok');ov.onclick=null;ok.onclick=fin;setTimeout(()=>cin.classList.add('in'),30);
 setTimeout(()=>{cin.classList.add('flip');AUD.play(cls==='bad'?'pay':'coin');if(cls==='good'){const r=cin.getBoundingClientRect();FX.confetti(r.left+r.width/2,r.top+r.height/2,40,6.283,false)}setTimeout(()=>{if(manual){ok.classList.add('on');ok.focus()}},950)},900);
 if(!manual)setTimeout(fin,900+950+2800)})}

/* chạy hiệu ứng tuần tự */
let Q=[],running=false,lastFx=0,rewarded=false;
const busy=()=>running||Q.length>0;
function enqueueFx(){if(!G)return;G.fx.filter(e=>e.id>lastFx).forEach(e=>{lastFx=e.id;if(!e.q&&e.k==='emote')showEmote(e);else if(!e.q&&e.k==='throw')showThrow(e);else Q.push(e)});runQ()}
async function runQ(){if(running)return;running=true;
 while(Q.length){if(!G){Q=[];break}const e=Q.shift();try{await playFx(e)}catch(x){console.error(x)}}
 running=false;renderAll();maybeAuto()}
async function playFx(e){if(!G)return;switch(e.k){
 case 'sound':AUD.play(e.n);break;
 case 'dice':await animDice(e.d1,e.d2);await sleep(120);break;
 case 'walk':for(let s=1;s<=e.n;s++){const t=(e.from+s)%40;disp[e.pid]=t;renderTokens();hop(e.pid);AUD.play('step');spawnTrail(e.pid,(t+39)%40);if(s===e.n)landTile(t,e.pid);await sleep(340)}await sleep(160);break;
 case 'jump':disp[e.pid]=e.to;renderTokens();hop(e.pid);flashTile(e.to);await sleep(450);break;
 case 'card':await showCard(e.dk,e.ci,e.pid);break;
 case 'float':spawnFloat(e.tile,e.text,e.cls);break;
 case 'flash':flashTile(e.tile);break;
 case 'shake':{const s=$('#stage');s.classList.remove('shk');void s.offsetWidth;s.classList.add('shk');AUD.play('boom');await sleep(420);break}
 case 'throw':showThrow(e);await sleep(500);break;
 case 'emote':showEmote(e);await sleep(250);break;
 case 'win':await sleep(500);openModal('win',{pid:e.pid});break}}

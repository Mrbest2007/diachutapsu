'use strict';
/* ================= TIỆN ÍCH, HIỆU ỨNG NỀN, PHÁO HOA ================= */
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
const ST={me:null,inv:[],xu:500,loc:[],botCfgs:[],nBots:1,lvl:2,nLocal:2,myIds:[0],net:null,mode:'solo',online:{extra:1}};
const has=id=>!!ITEM[id];
function sanitize(c){const d=defCfg();const o=Object.assign({},d,c||{});
 SLOTS.forEach(([s])=>{if(!ITEM[o[s]]||!has(o[s]))o[s]=d[s]});
 if(!TYPES.some(t=>t[0]===o.type))o.type='meo';o.name=String(o.name||'Mèo Bông').slice(0,14);return o}
function loadState(){ST.me=sanitize(LS.get('dcts_me',null));
 ST.loc=[ST.me];for(let i=1;i<4;i++){const c=sanitize(LS.get('dcts_loc'+i,null));if(!LS.get('dcts_loc'+i,null)){c.name='Người chơi '+(i+1);c.type=['nam','nu','cun','robot'][i];c.skin=DEFAULT_SKIN[c.type];c.hairc=HAIRC[i*2]}ST.loc.push(c)}
 ST.botCfgs=[randCfg(),randCfg(),randCfg()]}
const saveCfg=(c)=>{if(c===ST.me)LS.set('dcts_me',c);else{const i=ST.loc.indexOf(c);if(i>0)LS.set('dcts_loc'+i,c)}};
function show(id){$$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));window.scrollTo(0,0);document.body.classList.toggle('ingame',id==='game');if(id==='game')setTimeout(fitBoard,30)}
function toast(t){const d=document.createElement('div');d.textContent=t;$('#toast').appendChild(d);setTimeout(()=>d.remove(),2600)}

/* nền vũ trụ */
const BG={cv:null,cx:null,st:[],w:0,h:0,t:0,
 init(){this.cv=$('#bg');this.cx=this.cv.getContext('2d');this.size();addEventListener('resize',()=>this.size());
  const n=120;for(let i=0;i<n;i++)this.st.push({x:Math.random(),y:Math.random(),r:Math.random()*2+.4,s:Math.random()*.00006+.00002,p:Math.random()*6.28,c:['#ff8fc4','#a98bff','#6bbcf5','#ffb938','#ff7eb6','#7be0c8'][rnd(6)]});
  this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;this.loop()},
 size(){const d=Math.min(devicePixelRatio||1,2);this.w=innerWidth;this.h=innerHeight;this.cv.width=this.w*d;this.cv.height=this.h*d;this.cx.setTransform(d,0,0,d,0,0)},
 loop(){const c=this.cx;c.clearRect(0,0,this.w,this.h);this.t++;
  for(const s of this.st){if(!this.reduce){s.y-=s.s*16;s.x+=s.s*5;if(s.y<-.02)s.y=1.02;if(s.x>1.02)s.x=-.02}
   const a=.35+.65*Math.abs(Math.sin(this.t*.02+s.p));c.globalAlpha=a;c.fillStyle=s.c;c.beginPath();c.arc(s.x*this.w,s.y*this.h,s.r,0,6.283);c.fill();
   if(s.r>1.5){c.strokeStyle=s.c;c.lineWidth=.6;c.beginPath();c.moveTo(s.x*this.w-s.r*3,s.y*this.h);c.lineTo(s.x*this.w+s.r*3,s.y*this.h);c.moveTo(s.x*this.w,s.y*this.h-s.r*3);c.lineTo(s.x*this.w,s.y*this.h+s.r*3);c.stroke()}}
  c.globalAlpha=1;if(!document.hidden)requestAnimationFrame(()=>this.loop());else setTimeout(()=>this.loop(),500)}};

/* pháo hoa & pháo giấy */
const FX={cv:null,cx:null,P:[],on:false,timers:[],
 init(){this.cv=$('#fxcv');this.cx=this.cv.getContext('2d');this.size();addEventListener('resize',()=>this.size())},
 size(){const d=Math.min(devicePixelRatio||1,2);this.cv.width=innerWidth*d;this.cv.height=innerHeight*d;this.cx.setTransform(d,0,0,d,0,0)},
 confetti(x,y,n,spread,up){const cols=['#ff6b8b','#ffd166','#72e6c4','#7cc4ff','#b9a7ff','#fff'];
  for(let i=0;i<n;i++){const a=(up?-Math.PI/2:Math.random()*6.283)+(Math.random()-.5)*spread;const v=4+Math.random()*9;
   this.P.push({k:'c',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.16,l:0,m:110+rnd(70),c:cols[rnd(6)],w:5+rnd(6),h:3+rnd(5),r:Math.random()*6,vr:(Math.random()-.5)*.4})}this.go()},
 rain(n){for(let i=0;i<n;i++)this.P.push({k:'c',x:Math.random()*innerWidth,y:-20-Math.random()*80,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,g:.03,l:0,m:260,c:['#ff6b8b','#ffd166','#72e6c4','#7cc4ff','#b9a7ff','#fff'][rnd(6)],w:6+rnd(6),h:4+rnd(5),r:Math.random()*6,vr:(Math.random()-.5)*.3});this.go()},
 burst(x,y){const hue=rnd(360),n=70+rnd(30);for(let i=0;i<n;i++){const a=i/n*6.283,v=2+Math.random()*5.5;
   this.P.push({k:'f',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.05,l:0,m:60+rnd(30),c:`hsl(${hue+rnd(40)},100%,${60+rnd(20)}%)`,s:2+Math.random()*1.5})}
  for(let i=0;i<20;i++)this.P.push({k:'f',x,y,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,g:.02,l:0,m:30,c:'#fff',s:2.4});AUD.play('boom');this.go()},
 celebrate(){this.stop();let n=0;const t=setInterval(()=>{this.burst(innerWidth*(.15+Math.random()*.7),innerHeight*(.15+Math.random()*.4));this.rain(14);if(++n>=18)clearInterval(t)},420);this.timers.push(t);this.confetti(innerWidth*.2,innerHeight,90,.9,true);this.confetti(innerWidth*.8,innerHeight,90,.9,true)},
 stop(){this.timers.forEach(clearInterval);this.timers=[]},
 go(){if(this.on)return;this.on=true;const step=()=>{const c=this.cx;c.clearRect(0,0,innerWidth,innerHeight);
   this.P=this.P.filter(p=>p.l<p.m&&p.y<innerHeight+40);
   for(const p of this.P){p.l++;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.vx*=p.k==='f'?.985:.995;const a=Math.max(0,1-p.l/p.m);c.globalAlpha=p.k==='f'?a:Math.min(1,a*2);
    if(p.k==='f'){c.fillStyle=p.c;c.beginPath();c.arc(p.x,p.y,p.s*a+.4,0,6.283);c.fill()}
    else{p.r+=p.vr;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.cos(p.r*2));c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()}}
   c.globalAlpha=1;if(this.P.length||this.timers.length)requestAnimationFrame(step);else{this.on=false;c.clearRect(0,0,innerWidth,innerHeight)}};requestAnimationFrame(step)}};

/* ================= NHÀ & KHÁCH SẠN (SVG) ================= */
const HSVG='<svg viewBox="0 0 32 30" aria-hidden="true"><ellipse cx="16" cy="28" rx="14" ry="2.2" fill="rgba(60,30,110,.28)"/><path d="M4 15H21V27H4Z" fill="#43e07a"/><path d="M21 15L28 12V24L21 27Z" fill="#1fae55"/><path d="M2.5 16L12.5 4.5L22.5 16Z" fill="#12a34a"/><path d="M12.5 4.5L19.5 2L29 13L22.5 16Z" fill="#0d7f38"/><rect x="17" y="3.5" width="3" height="4.5" rx=".6" fill="#ff8fb0"/><rect x="9" y="19" width="5" height="8" rx="1" fill="#fff6c8"/><rect x="15.5" y="18.5" width="3.5" height="3.5" rx=".6" fill="#8fd8ff"/><path d="M22.6 19 L26.4 17.6 V21 L22.6 22.4Z" fill="#8fd8ff"/><path d="M4 15H21" stroke="#fff" stroke-opacity=".55" stroke-width="1"/></svg>';
const KSVG='<svg viewBox="0 0 44 32" aria-hidden="true"><ellipse cx="22" cy="30" rx="19" ry="2.4" fill="rgba(60,30,110,.28)"/><path d="M5 10H29V29H5Z" fill="#ff5d6c"/><path d="M29 10L39 6V25L29 29Z" fill="#d6304a"/><path d="M3 10V7H31V10Z" fill="#fff"/><path d="M31 7L41 3.5V6.5L31 10Z" fill="#e6dff5"/><path d="M17 7V.8" stroke="#fff" stroke-width="1.2"/><path d="M17 .8L24 2.6L17 4.4Z" fill="#ffd166"/><g fill="#ffe27a"><rect x="8" y="13" width="4" height="3.5" rx=".6"/><rect x="14" y="13" width="4" height="3.5" rx=".6"/><rect x="20" y="13" width="4" height="3.5" rx=".6"/><rect x="8" y="19" width="4" height="3.5" rx=".6"/><rect x="20" y="19" width="4" height="3.5" rx=".6"/></g><rect x="14" y="21.5" width="5.5" height="7.5" rx="1" fill="#fff"/><path d="M31 15L36 13V17L31 19Z M31 22L36 20V24L31 26Z" fill="#ffd45c"/></svg>';
function stripHTML(h,prev){if(h===5)return `<span class="ht pop">${KSVG}</span>`;
 return Array.from({length:h},(_,k)=>`<span class="hs${h>prev&&k>=prev?' pop':''}">${HSVG}</span>`).join('')}

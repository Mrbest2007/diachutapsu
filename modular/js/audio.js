'use strict';
/* ================= ÂM THANH (Web Audio) ================= */
const AUD={ctx:null,muted:LS.get('dcts_mute',false),
 init(){if(!this.ctx){try{this.ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()},
 tone(f,t0,d,type,vol,f2){const c=this.ctx;if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,c.currentTime+t0);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+t0+d);
  g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(vol||.15,c.currentTime+t0+.012);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+t0+d);
  o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05)},
 noise(t0,d,vol,fq,q){const c=this.ctx;if(!c)return;const n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq||2000;f.Q.value=q||1;const g=c.createGain();g.gain.value=vol||.2;s.connect(f);f.connect(g);g.connect(c.destination);s.start(c.currentTime+t0)},
 clack(v){if(this.muted)return;this.init();if(!this.ctx)return;v=Math.max(.1,Math.min(1,v));this.noise(0,.045,.18*v+.05,2600+rnd(2200),2.5);this.tone(650+rnd(500),0,.06,'triangle',.08*v+.02,300);this.tone(1900+rnd(900),0,.025,'square',.03*v);this.noise(.05,.09,.06*v,5200,1.2)},
 play(n){if(this.muted)return;this.init();if(!this.ctx)return;
  switch(n){
   case 'dice':for(let i=0;i<9;i++){this.noise(i*.1+Math.random()*.03,.05,.35,1400+Math.random()*2400,3);this.tone(180+Math.random()*120,i*.1,.04,'triangle',.05)}break;
   case 'whoosh':this.noise(0,.35,.16,1200,.5);this.tone(260,0,.3,'sine',.03,720);break;
   case 'step':this.tone(520+rnd(60),0,.07,'sine',.07,760);break;
   case 'coin':this.tone(988,0,.08,'square',.06);this.tone(1319,.07,.2,'square',.06);break;
   case 'buy':[523,659,784,1047].forEach((f,i)=>this.tone(f,i*.07,.22,'triangle',.11));break;
   case 'pay':this.tone(330,0,.16,'sawtooth',.06,200);this.tone(220,.1,.2,'sawtooth',.05,140);break;
   case 'jail':this.tone(400,0,.5,'sawtooth',.09,90);this.noise(0,.2,.3,300,1);break;
   case 'card':this.noise(0,.28,.25,3500,.7);this.tone(660,.25,.3,'sine',.07,990);break;
   case 'build':this.noise(0,.05,.34,900,2);this.tone(180,0,.07,'square',.08,120);this.noise(.16,.05,.34,1100,2);this.tone(220,.16,.07,'square',.08,140);[1047,1319,1568].forEach((f,i)=>{this.tone(f,.34+i*.09,.35,'sine',.1);this.tone(f*2,.34+i*.09,.2,'sine',.03)});break;
   case 'bell':this.tone(880,0,.5,'sine',.1);this.tone(1760,0,.4,'sine',.04);break;
   case 'tick':this.tone(1200,0,.04,'square',.04);break;
   case 'alarm':this.tone(300,0,.15,'square',.06);this.tone(300,.2,.15,'square',.06);break;
   case 'start':[392,523,659,784].forEach((f,i)=>this.tone(f,i*.09,.3,'triangle',.1));break;
   case 'rare':[659,784,988,1319].forEach((f,i)=>this.tone(f,i*.08,.3,'triangle',.1));break;
   case 'secret':[523,659,784,1047,1319,1568].forEach((f,i)=>this.tone(f,i*.09,.45,'sine',.12));this.noise(0,.5,.15,6000,.5);break;
   case 'shake':for(let i=0;i<6;i++)this.noise(i*.09,.05,.28,900+rnd(600),2);break;
   case 'foil':this.noise(0,.35,.3,5000,.6);break;
   case 'win':[523,659,784,1047,784,1047,1319,1568].forEach((f,i)=>this.tone(f,i*.14,.4,'triangle',.12));break;
   case 'boom':this.noise(0,.5,.35,220,.6);this.tone(120,0,.4,'sine',.15,40);break;
   case 'em0':[700,880,700,880,990].forEach((f,i)=>this.tone(f,i*.08,.09,'square',.06));break;
   case 'em1':this.tone(700,0,.5,'sine',.1,260);this.tone(520,.35,.5,'sine',.08,200);break;
   case 'em2':this.tone(150,0,.3,'sawtooth',.09,90);this.noise(0,.3,.2,500,1.2);this.tone(180,.28,.25,'sawtooth',.08,80);break;
   case 'em3':[880,1175,1568].forEach((f,i)=>this.tone(f,i*.09,.3,'sine',.1));this.tone(2093,.3,.3,'sine',.04);break;
   case 'em4':this.tone(300,0,.25,'sine',.1,900);this.tone(900,.22,.12,'triangle',.07);break;
   case 'em5':for(let i=0;i<6;i++)this.noise(i*.09,.05,.3,2400+rnd(1800),1.5);break;
   case 'hit0':this.noise(0,.09,.4,700,1.2);this.tone(170,0,.12,'sine',.18,60);this.noise(.06,.12,.15,1800,.8);break;
   case 'hit1':this.noise(0,.25,.3,500,3);this.tone(120,0,.3,'sawtooth',.07,60);this.noise(.12,.2,.2,900,4);break;
   case 'hit2':this.noise(0,.05,.5,3800,1.5);this.tone(900,0,.05,'square',.1,300);this.noise(.04,.08,.25,2200,1);this.tone(1400,.09,.12,'triangle',.06,500);break}}};
sfx=n=>AUD.play(n);

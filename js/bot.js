'use strict';
/* ================= BOT AI ================= */
const unownedCount=()=>T.filter(t=>t.price&&G.own[t.i]<0).length;
function botValue(b,i){const t=T[i];let v=t.price*[0,.7,.95,1.15][b.bot];
 if(t.g){const others=GRP[t.g].filter(k=>k!==i);
  if(others.every(k=>G.own[k]===b.id))v*=1.6;
  else if(b.bot>=3&&others.every(k=>G.own[k]>=0&&G.own[k]===G.own[others[0]]&&G.own[k]!==b.id))v*=1.25;
  else if(others.some(k=>G.own[k]===b.id))v*=1.1}
 if(t.t==='rr')v*=1+0.15*RRS.filter(k=>G.own[k]===b.id).length;
 return v}
function botBuy(p){const t=T[p.pos],left=p.money-t.price;if(left<0)return false;
 const completes=t.g&&GRP[t.g].filter(k=>k!==p.pos).every(k=>G.own[k]===p.id);
 if(completes)return true;
 if(p.bot===1)return left>=150&&Math.random()<.65;
 if(p.bot===2)return left>=120;
 return left>=40||t.t==='rr'}
function botAuction(b){const au=G.auction,t=T[au.idx];
 const maxb=Math.min(botValue(b,au.idx),b.money-[0,60,50,20][b.bot]);
 const inc=Math.max(10,Math.round(t.price*.06/10)*10);
 const nb=au.bid===0?Math.max(10,Math.round(t.price*.25/10)*10):au.bid+inc;
 if(nb<=maxb&&au.who!==b.id&&!(b.bot===1&&Math.random()<.15))act(b.id,'bid',nb);else act(b.id,'pass')}
function botManage(p){const reserve=[0,350,220,130][p.bot];
 if(p.money>reserve+300){for(const i of owned(p.id))if(G.mort[i]){const c=unmortCost(i);if(p.money-c>=reserve+150){return act(p.id,'unmort',i)}}}
 if(p.bot===1&&Math.random()<.6)return false;
 let best=-1,bs=-1;
 for(const i of owned(p.id))if(canBuild(i,p.id)&&p.money-T[i].h>=reserve){const s=T[i].rent[Math.min(5,G.hs[i]+1)]/T[i].h;if(s>bs){bs=s;best=i}}
 if(best>=0)return act(p.id,'build',best);
 return false}
function botJail(p){
 if(p.fc.length){act(p.id,'jcard');return}
 if(p.bot>=2&&p.money>=250&&unownedCount()>=8){act(p.id,'jpay');return}
 if(p.bot===1&&p.money>=600){act(p.id,'jpay');return}
 act(p.id,'roll')}
function raiseCash(p){
 const inSet=i=>{const t=T[i];return t.t==='st'&&ownsAll(p.id,t.g)};
 let c=owned(p.id).filter(i=>canMort(i,p.id)&&!inSet(i)).sort((a,b)=>T[a].mv-T[b].mv);
 if(c.length)return act(p.id,'mort',c[0]);
 c=owned(p.id).filter(i=>canSell(i,p.id)).sort((a,b)=>G.hs[b]-G.hs[a]);
 if(c.length)return act(p.id,'sell',c[0]);
 c=owned(p.id).filter(i=>canMort(i,p.id)).sort((a,b)=>T[a].mv-T[b].mv);
 if(c.length)return act(p.id,'mort',c[0]);
 return false}
function botTradeEval(b,tr){
 const val=(i,toId)=>{const t=T[i];let v=t.price;if(G.mort[i])v*=.7;
  if(t.g){const others=GRP[t.g].filter(k=>k!==i);if(others.every(k=>G.own[k]===toId))v*=1.9;else if(others.some(k=>G.own[k]===toId))v*=1.15}return v};
 const got=tr.o.cash+tr.o.props.reduce((s,i)=>s+val(i,b.id),0)+tr.o.fc*50;
 let gave=tr.w.cash+tr.w.props.reduce((s,i)=>s+Math.max(val(i,tr.from),val(i,b.id)),0)+tr.w.fc*50;
 return got>=gave*[0,1.35,1.15,1.05][b.bot]+10}
function botTradeIdea(p){
 if(p.bot<2||G.tradeTry===G.turnNo||G.turnNo%3)return false;G.tradeTry=G.turnNo;
 for(const g in GRP){const tl=GRP[g];const mine=tl.filter(i=>G.own[i]===p.id);const miss=tl.filter(i=>G.own[i]!==p.id);
  if(mine.length===tl.length-1&&miss.length===1){const i=miss[0],o=G.own[i];
   if(o>=0&&!G.players[o].out&&tl.every(k=>G.hs[k]===0)){const price=Math.round(T[i].price*2.6/10)*10;
    if(p.money-price>=100)return act(p.id,'trade',{to:o,o:{cash:price,props:[],fc:0},w:{cash:0,props:[i],fc:0}})}}}
 return false}
function botStep(){
 if(!G||G.winner>=0)return false;
 if(G.trade){const b=G.players[G.trade.to];if(b.bot){act(b.id,'tradeResp',botTradeEval(b,G.trade));return true}return false}
 if(G.phase==='auction'){const au=G.auction,b=G.players[au.order[au.i]];if(b.bot){botAuction(b);return true}return false}
 const p=cp();if(!p.bot)return false;
 switch(G.phase){
  case 'roll':if(botManage(p))return true;if(p.jail){botJail(p);return true}if(botTradeIdea(p))return true;act(p.id,'roll');return true;
  case 'buy':act(p.id,botBuy(p)?'buy':'noBuy');return true;
  case 'debt':if(p.money>=G.debt.amt)act(p.id,'payDebt');else if(!raiseCash(p))act(p.id,'bankrupt');return true;
  case 'end':if(botManage(p))return true;act(p.id,'end');return true}
 return false}

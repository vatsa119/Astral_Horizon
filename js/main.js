/* Wiring: layout, pointer, the frame loop and the per-chapter choreography.
   Scroll is the only input to the story. Nothing on screen tells you where you are. */
(()=>{
"use strict";
const VT=window.VT,{$,$$,clamp,lerp,sstep,v,SEG,TOTAL,RM}=VT;
const root=document.documentElement;

/* ---- layout ---- */
function resize(){
  v.DPR=Math.min(devicePixelRatio||1,2);v.W=innerWidth;v.H=innerHeight;v.S=Math.min(v.W,v.H)*.5;
  if(!RM){if(Math.abs(innerHeight-v.VH)>120||!resize.done)v.VH=innerHeight;$('#spacer').style.height=((TOTAL+1)*v.VH)+'px'}resize.done=1;
  v.portrait=v.W/v.H<1.05;
  const cw=v.portrait?Math.min(230,v.W*.58):Math.max(230,Math.min(380,v.W*.27,v.H*.43));v.cw=cw;
  root.style.setProperty('--cw',cw+'px');root.style.setProperty('--ch',(cw*(v.portrait?1.52:1.34))+'px');
  // where the portrait sits: head on the centre line, shoulders running off the bottom
  const asp=VT.PORTRAIT.aspect,pw=v.portrait?v.W*1.5:Math.min(v.W*.6,v.H*1.12*asp),ph=pw/asp;
  const cx=v.W/2,cy=v.portrait?v.H*.42:v.H*.47;
  v.pr={w:pw,h:ph,x:cx-.42*pw,y:cy-.4*ph,cx,cy};
  VT.sky.resize();VT.portrait.resize();VT.typefx.resize();VT.ring.paint()}

/* ---- pointer (mouse, pen and touch) ---- */
const P=VT.pointer;
addEventListener('pointermove',e=>{P.vx=e.clientX-P.x;P.vy=e.clientY-P.y;if(!P.on){P.vx=P.vy=0}P.x=e.clientX;P.y=e.clientY;P.on=true},{passive:true});
addEventListener('pointerdown',e=>{P.x=e.clientX;P.y=e.clientY;P.on=true},{passive:true});
addEventListener('pointerleave',()=>{P.on=false});
addEventListener('pointerup',e=>{if(e.pointerType==='touch')P.on=false},{passive:true});
document.addEventListener('mouseleave',()=>{P.on=false});

/* ---- chapter elements ---- */
const chs=$$('.ch[data-seg]');
const nameL=$('.nl'),nameR=$('.nr'),tag=$('#tag');
// the facts and meta lines fade as blocks; only prose is split into words
['.meta','.facts'].forEach(sel=>{$$(sel).forEach(el=>el.classList.add('blk'))});
const wordsOf={origin:VT.kinetic.words($('#origin')),now:VT.kinetic.words($('#now'))};
const mail=$('#s-mail'),tel=$('#s-tel'),credits=$('#credits');
[mail,tel].forEach((el,j)=>{el.addEventListener('pointerenter',()=>{VT.hover[j]=1});el.addEventListener('pointerleave',()=>{VT.hover[j]=0});el.addEventListener('focus',()=>{VT.hover[j]=1});el.addEventListener('blur',()=>{VT.hover[j]=0})});
const caption=$('#caption'),social=$('#social');

const typeState={work:null,reach:null};
let time=0,sCur=0,sTarget=0,lastCz=0,last=0,t0=null;

function frame(now){
  if(t0===null){t0=now;last=now}
  const dt=Math.min(.05,(now-last)/1000);last=now;time=RM?9:(now-t0)/1000;
  sTarget=RM?0:scrollY/v.VH;sCur+=(sTarget-sCur)*(RM?1:.11);if(Math.abs(sTarget-sCur)<1e-4)sCur=sTarget;
  const sSky=RM?SEG[2].start+.1:sCur,cam=VT.camera(sSky),vz=cam.cz-lastCz;lastCz=cam.cz;
  const pi=VT.local(sCur,0);
  VT.sky.draw(sSky,cam,vz,time);
  VT.portrait.draw(pi,time,dt);
  update(sCur,cam,pi);
  VT.typefx.draw(typeState,time,dt);
  if(!RM)requestAnimationFrame(frame)}

/* opacity, blur and lift for a block that fades in at [a,b] and out at [c,d] of its chapter */
function show(el,vis,lift=24,scale=1){const on=vis>.003;if(el.style.visibility!==(on?'visible':'hidden'))el.style.visibility=on?'visible':'hidden';if(!on)return false;
  el.style.opacity=vis.toFixed(3);el.style.filter=vis<.99?`blur(${((1-vis)*10).toFixed(1)}px)`:'none';el.style.pointerEvents=vis>.6?'auto':'none';
  return true}

function update(s,cam,pi){
  if(RM)return;
  const L=i=>VT.local(s,i);
  // intro: the two halves of the name drift apart as the portrait scatters
  {const t=L(0),o=sstep(.02,.26,t),vis=1-o,d=o*o;
   nameL.style.opacity=vis.toFixed(3);nameR.style.opacity=vis.toFixed(3);
   nameL.style.transform=`translate3d(${(-d*v.W*.28).toFixed(1)}px,0,0)`;nameR.style.transform=`translate3d(${(d*v.W*.28).toFixed(1)}px,0,0)`;
   tag.style.opacity=(1-sstep(.0,.18,t)).toFixed(3);
   const el=$('#intro');el.style.visibility=t<.3?'visible':'hidden'}
  // origin
  {const t=L(1),vis=sstep(.06,.2,t)*(1-sstep(.8,.94,t)),el=$('#origin');
   if(show(el,vis))el.style.transform=(v.portrait?'':'translateY(-50%) ')+`translateY(${((1-vis)*24).toFixed(1)}px)`;
   VT.kinetic.setWords(wordsOf.origin,sstep(.06,.42,t));el.querySelectorAll('.blk').forEach(b=>b.style.opacity=sstep(.32,.48,t).toFixed(3))}
  // work: the word assembles from the sky, lingers as an outline behind the ring
  {const u=L(2),uc=clamp((u-VT.RING_START)/(1-VT.RING_START)),o=sstep(.15,.23,u);
   typeState.work={pIn:sstep(0,.13,u),pOut:o,ghost:.55*o*(1-sstep(.9,.99,u)),shift:-uc*v.W*.05,scale:1+.1*uc};
   VT.ring.update(uc);
   const cv=sstep(.36,.42,uc)*(1-sstep(.93,.98,uc));
   if(show(caption,cv))caption.style.transform=`translateX(-50%) translateY(${((1-cv)*24).toFixed(1)}px)`}
  // now
  {const t=L(3),vis=sstep(.08,.2,t)*(1-sstep(.5,.58,t)),el=$('#now');
   if(show(el,vis))el.style.transform=(v.portrait?'':'translateY(-50%) ')+`translateY(${((1-vis)*24).toFixed(1)}px)`;
   VT.kinetic.setWords(wordsOf.now,sstep(.1,.38,t));el.querySelectorAll('.blk').forEach(b=>b.style.opacity=sstep(.18,.3,t).toFixed(3))}
  // reach out
  {const t=L(4);typeState.reach={pIn:sstep(.0,.3,t)};
   const [a,b]=VT.contactStars;
   for(const [el,st] of [[mail,a],[tel,b]]){const vis=st.vis*sstep(.45,1,st.lit),on2=vis>.003;el.style.visibility=on2?'visible':'hidden';if(!on2)continue;
     el.style.opacity=vis.toFixed(3);el.style.pointerEvents=vis>.7?'auto':'none';
     el.style.transform=`translate3d(${st.x.toFixed(1)}px,${(st.y+st.r*.96+(1-vis)*14).toFixed(1)}px,0) translateX(-50%)`}
   const sv=Math.min(a.vis*sstep(.55,1,a.lit),b.vis*sstep(.55,1,b.lit))*sstep(.7,.95,t),son=sv>.003;social.style.visibility=son?'visible':'hidden';
   if(son){const y=v.portrait?b.y+b.r*.96+94:a.y+a.r*.96+30;social.style.opacity=sv.toFixed(3);social.style.pointerEvents=sv>.7?'auto':'none';social.style.transform=`translate3d(${(v.W/2).toFixed(1)}px,${(y-26+(1-sv)*14).toFixed(1)}px,0) translateX(-50%)`}
   const cr=sstep(.7,.95,t);credits.style.visibility=cr>.003?'visible':'hidden';credits.style.opacity=(cr*.7).toFixed(3)}
}

addEventListener('resize',()=>{resize();if(RM)requestAnimationFrame(frame)});
resize();
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{VT.ring.paint();if(RM)requestAnimationFrame(frame)});
requestAnimationFrame(frame);
})();

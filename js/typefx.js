/* #tc: display type made of the same particles as the portrait.
   Stars from far outside the frame spiral into the glyphs, the crisp letterforms ignite with a moving highlight,
   and the word bursts back into the sky. Pure function of scroll (plus time for shimmer), so it reverses. */
(()=>{
"use strict";
const VT=window.VT,{clamp,lerp,sstep,ease,easeOut,rng,fill,v}=VT;
const cv=VT.$('#tc'),c=cv.getContext('2d');
const probe=document.createElement('canvas'),pc=probe.getContext('2d',{willReadFrequently:true});
const FONT=px=>`400 ${px}px "Instrument Serif","Iowan Old Style",Georgia,serif`;

function Word(text,seed,cfg){this.text=text;this.seed=seed;this.cfg=cfg;this.n=0;this.built=false}
Word.prototype.build=function(){
  const {W,H}=v,cfg=this.cfg(),px=cfg.px,lines=cfg.lines,lh=px*.88;
  probe.width=W;probe.height=H;pc.clearRect(0,0,W,H);pc.font=FONT(px);pc.textAlign='center';pc.textBaseline='alphabetic';pc.fillStyle='#fff';
  const base=cfg.cy+px*.35-(lines.length-1)*lh/2;
  lines.forEach((t,i)=>pc.fillText(t,W/2,base+i*lh));
  this.px=px;this.lines=lines;this.lh=lh;this.base=base;this.cx=W/2;this.cy=cfg.cy;
  const img=pc.getImageData(0,0,W,H).data,hit=[];let x0=W,x1=0;
  for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2){if(img[(y*W+x)*4+3]>140){hit.push(x,y);if(x<x0)x0=x;if(x>x1)x1=x}}
  const total=hit.length/2,want=cfg.count,keep=Math.min(1,want/total),r=rng(this.seed);
  const hx=[],hy=[];for(let i=0;i<hit.length;i+=2){if(r()<keep){hx.push(hit[i]+(r()-.5)*2,hit[i+1]+(r()-.5)*2)}}
  const n=hx.length/2;this.n=n;this.x0=x0;this.x1=x1;
  this.hx=new Float32Array(n);this.hy=new Float32Array(n);this.sx=new Float32Array(n);this.sy=new Float32Array(n);
  this.dl=new Float32Array(n);this.rd=new Float32Array(n);this.ph=new Float32Array(n);this.lv=new Uint8Array(n);
  this.ox=new Float32Array(n);this.oy=new Float32Array(n);this.vx=new Float32Array(n);this.vy=new Float32Array(n);
  const reach=Math.hypot(W,H)*.5;
  for(let i=0;i<n;i++){this.hx[i]=hx[2*i];this.hy[i]=hx[2*i+1];
    const a=r()*6.2832,d=(.7+r()*.9)*reach;this.sx[i]=this.cx+Math.cos(a)*d;this.sy[i]=this.cy+Math.sin(a)*d*.8;
    this.dl[i]=((this.hx[i]-x0)/Math.max(1,x1-x0))*.34+r()*.12;this.rd[i]=r();this.ph[i]=r()*6.28;
    this.lv[i]=r()<.07?2:r()<.35?0:1}
  this.built=true};

const colors=[fill('ice',.9),fill('ivory',.95),fill('gold',1)];
Word.prototype.draw=function(pIn,pOut,time,k,opt){
  if(!this.built||pIn<=0.001)return;const P=VT.pointer,{W,H}=v;opt=opt||{};
  const sh=opt.shift||0,sc=opt.scale||1;
  c.save();if(sh||sc!==1){c.translate(this.cx+sh,this.cy);c.scale(sc,sc);c.translate(-this.cx,-this.cy)}
  // outline ghost: the word lingers behind whatever follows
  if(opt.ghost>.003){c.font=FONT(this.px);c.textAlign='center';c.lineWidth=1.6;c.strokeStyle=fill("ice",opt.ghost);c.lineJoin='round';
    this.lines.forEach((t,i)=>c.strokeText(t,this.cx,this.base+i*this.lh))}
  const buckets=[[],[],[]],R=Math.min(W,H)*.09,on=P.on&&pIn>.95&&pOut<.02,size=.9+Math.min(W,H)/1500;
  const px=on?(P.x-sh-this.cx)/sc+this.cx:0,py=on?(P.y-this.cy)/sc+this.cy:0;
  for(let i=0;i<this.n;i++){
    const q=ease(sstep(this.dl[i],this.dl[i]+.5,pIn)),o=sstep(this.rd[i]*.3,this.rd[i]*.3+.7,pOut);if(q<=0||o>=1)continue;
    const inv=1-q;let X=this.hx[i],Y=this.hy[i];
    // spiral in from the sky: rotate the start offset around the glyph as it closes
    if(inv>0){const dx=this.sx[i]-X,dy=this.sy[i]-Y,t=inv*inv*2.2,ct=Math.cos(t),st=Math.sin(t),f=Math.pow(inv,1.4);X+=(dx*ct-dy*st)*f;Y+=(dx*st+dy*ct)*f}
    // shimmer once settled
    if(q>.98){X+=Math.sin(time*1.7+this.ph[i])*.7;Y+=Math.cos(time*1.3+this.ph[i]*1.3)*.7}
    // burst: scale away from the word's centre as if passing the camera
    if(o>0){const e=o*o,m=1+e*(1.4+this.rd[i]*3.2);X=this.cx+(X-this.cx)*m;Y=this.cy+(Y-this.cy)*m+e*60*(this.rd[i]-.5)}
    if(on){const dx=X+this.ox[i]-px,dy=Y+this.oy[i]-py,d2=dx*dx+dy*dy;if(d2<R*R*2){const d=Math.sqrt(d2)+.001,f=1-d/(R*1.41);if(f>0){const g=f*f*2.6;this.vx[i]+=dx/d*g*k;this.vy[i]+=dy/d*g*k}}}
    this.vx[i]=(this.vx[i]-this.ox[i]*.05*k)*Math.pow(.9,k);this.vy[i]=(this.vy[i]-this.oy[i]*.05*k)*Math.pow(.9,k);this.ox[i]+=this.vx[i]*k;this.oy[i]+=this.vy[i]*k;
    X+=this.ox[i];Y+=this.oy[i];
    const a=(.3+.7*q)*(1-o),s=size*(1+inv*1.6+o*1.8)*(.7+this.rd[i]*.7);if(a<.04)continue;
    buckets[this.lv[i]].push(X-s/2,Y-s/2,s*(.35+a*.65)+.2)}
  c.globalCompositeOperation='lighter';
  for(let b=0;b<3;b++){const A=buckets[b];if(!A.length)continue;c.fillStyle=colors[b];c.beginPath();for(let j=0;j<A.length;j+=3)c.rect(A[j],A[j+1],A[j+2],A[j+2]);c.fill()}
  c.globalCompositeOperation='source-over';
  // crisp letterforms ignite as the particles land, with a highlight that travels across
  const fa=sstep(.8,1,pIn)*(1-sstep(.02,.22,pOut));
  if(fa>.003){const w=this.x1-this.x0,sw=((time*.16)%1.5)-.25,g=c.createLinearGradient(this.x0,0,this.x1,0),st=(p,col)=>g.addColorStop(clamp(p),col);
    st(0,fill('ivory',.86));st(sw-.16,fill('ivory',.86));st(sw,fill('gold',1));st(sw+.16,fill('ivory',.86));st(1,fill('ivory',.86));
    c.font=FONT(this.px);c.textAlign='center';c.fillStyle=g;c.globalAlpha=fa;c.shadowColor=fill('gold',.35);c.shadowBlur=36;
    this.lines.forEach((t,i)=>c.fillText(t,this.cx,this.base+i*this.lh));c.shadowBlur=0;c.globalAlpha=1}
  c.restore()};

const work=new Word('WORK',5,()=>{const {W,H,portrait}=v;return{px:portrait?Math.min(W*.3,H*.26):Math.min(W*.27,H*.44),lines:['WORK'],cy:H*(portrait?.4:.46),count:15000}});
const reach=new Word('REACH OUT',9,()=>{const {W,H,portrait}=v;return portrait?{px:Math.min(W*.26,H*.13),lines:['REACH','OUT'],cy:H*.2,count:12000}:{px:Math.min(W*.14,H*.19),lines:['REACH OUT'],cy:H*.21,count:14000}});

VT.typefx={
  resize(){cv.width=v.W*v.DPR;cv.height=v.H*v.DPR;
    const go=()=>{work.build();reach.build()};
    (document.fonts&&document.fonts.load?document.fonts.load('400 100px "Instrument Serif"',"WORK REACH OUT").then(go,go):Promise.resolve().then(go))},
  draw(s,time,dt){c.setTransform(v.DPR,0,0,v.DPR,0,0);c.clearRect(0,0,v.W,v.H);const k=Math.min(2,dt*60);
    if(s.work)work.draw(s.work.pIn,s.work.pOut,time,k,s.work);
    if(s.reach)reach.draw(s.reach.pIn,0,time,k,s.reach)}
};
})();

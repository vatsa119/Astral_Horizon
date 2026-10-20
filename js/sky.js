/* #sky: engineering-drawing canvas, space backdrops, star field and constellations.
   draw() is a pure function of scroll (and time for twinkle), so it plays the same forwards and backwards. */
(()=>{
"use strict";
const VT=window.VT,{clamp,lerp,sstep,ease,easeOut,rng,fill,v}=VT;
const cv=VT.$('#sky'),c=cv.getContext('2d');
const {DEPTH,GAP}=VT;

/* ---- stars ---- */
const STARS=(()=>{const r=rng(7),a=[];for(let i=0;i<2200;i++){const u=r()*2-1,w=r()*2-1,q=r();
  a.push({x:Math.sign(u)*Math.pow(Math.abs(u),1.5)*11,y:Math.sign(w)*Math.pow(Math.abs(w),1.5)*8,z:r()*DEPTH,m:.4+r()*1.3,k:q<.68?'ivory':q<.84?'gold':'ice',tw:r()*6.28})}return a})();
function sprite(name,size){const k=document.createElement('canvas');k.width=k.height=size;const g=k.getContext('2d');const gr=g.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  gr.addColorStop(0,`rgba(${VT.col[name]},1)`);gr.addColorStop(.18,`rgba(${VT.col[name]},.55)`);gr.addColorStop(1,`rgba(${VT.col[name]},0)`);g.fillStyle=gr;g.fillRect(0,0,size,size);return k}
const GLOW={gold:sprite('gold',64),ivory:sprite('ivory',64),ice:sprite('ice',64)};

/* ---- backdrops ---- */
const load=src=>{const i=new Image();i.src=src;return i};
const BG1=load('assets/bg-nebula.webp'),BG2=load('assets/bg-cluster.webp');
function cover(img,a,zoom,px,py){if(a<.003||!img.complete||!img.naturalWidth)return;const {W,H}=v;
  const k=Math.max(W/img.naturalWidth,H/img.naturalHeight)*zoom,w=img.naturalWidth*k,h=img.naturalHeight*k;
  const ox=(W-w)/2+px*(w-W)/2,oy=(H-h)/2+py*(h-H)/2;c.globalAlpha=a;c.drawImage(img,ox,oy,w,h);c.globalAlpha=1}

/* ---- engineering drawing ---- */
function blueprint(a,time){if(a<.003)return;const {W,H,pr}=v,cx=pr.cx,cy=pr.cy;const dr=easeOut(clamp(time/2.4));
  c.save();c.globalAlpha=a;
  // grid, revealed outward from the head
  const R=Math.hypot(W,H)*.62*dr,minor=28,major=minor*5;
  c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();
  c.lineWidth=1;c.strokeStyle=fill('ice',.05);c.beginPath();
  for(let x=cx%minor;x<W;x+=minor){c.moveTo(Math.round(x)+.5,0);c.lineTo(Math.round(x)+.5,H)}
  for(let y=cy%minor;y<H;y+=minor){c.moveTo(0,Math.round(y)+.5);c.lineTo(W,Math.round(y)+.5)}c.stroke();
  c.strokeStyle=fill('ice',.11);c.beginPath();
  for(let x=cx%major;x<W;x+=major){c.moveTo(Math.round(x)+.5,0);c.lineTo(Math.round(x)+.5,H)}
  for(let y=cy%major;y<H;y+=major){c.moveTo(0,Math.round(y)+.5);c.lineTo(W,Math.round(y)+.5)}c.stroke();c.restore();
  // vignette so the sheet fades to navy at the edges
  const vg=c.createRadialGradient(cx,cy,Math.min(W,H)*.3,cx,cy,Math.hypot(W,H)*.62);vg.addColorStop(0,fill('navy',0));vg.addColorStop(1,fill('navy',.92));c.fillStyle=vg;c.fillRect(0,0,W,H);
  // centre axes (dash-dot), drawn from the middle out
  const ln=(x1,y1,x2,y2,al,dash)=>{c.strokeStyle=fill('ice',al);c.setLineDash(dash||[]);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.setLineDash([])};
  c.lineWidth=1;const ax=dr*Math.max(W,H);
  ln(cx-ax,cy,cx+ax,cy,.26,[14,4,2,4]);ln(cx,cy-ax,cx,cy+ax,.26,[14,4,2,4]);
  // protractor ring with ticks
  const r1=Math.min(W*.34,H*.44)*(.7+.3*dr),spin=time*.02;
  c.strokeStyle=fill('ice',.3);c.beginPath();c.arc(cx,cy,r1,0,7);c.stroke();
  c.strokeStyle=fill('ice',.14);c.beginPath();c.arc(cx,cy,r1*1.16,0,7);c.stroke();
  c.setLineDash([3,9]);c.strokeStyle=fill('ice',.22);c.beginPath();c.arc(cx,cy,r1*.82,spin,spin+6.28);c.stroke();c.setLineDash([]);
  c.strokeStyle=fill('ice',.34);c.beginPath();
  for(let d=0;d<360;d+=5){const t=d*Math.PI/180,L=d%30===0?14:d%15===0?9:5,ca=Math.cos(t),sa=Math.sin(t);if(d/360>dr)break;c.moveTo(cx+ca*r1,cy+sa*r1);c.lineTo(cx+ca*(r1+L),cy+sa*(r1+L))}c.stroke();
  // dimension lines with arrowheads
  const dim=(x1,y1,x2,y2)=>{const ang=Math.atan2(y2-y1,x2-x1),ah=7;c.strokeStyle=fill('ice',.42);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);
    for(const [x,y,s] of [[x1,y1,1],[x2,y2,-1]]){c.moveTo(x,y);c.lineTo(x+s*ah*Math.cos(ang-.4),y+s*ah*Math.sin(ang-.4));c.moveTo(x,y);c.lineTo(x+s*ah*Math.cos(ang+.4),y+s*ah*Math.sin(ang+.4))}c.stroke()};
  const bx=r1*1.34,by=r1*1.3;
  if(dr>.5){c.globalAlpha=a*sstep(.5,1,dr);
    dim(cx-bx,cy+by,cx+bx,cy+by);ln(cx-bx,cy+by-8,cx-bx,cy+by+8,.42);ln(cx+bx,cy+by-8,cx+bx,cy+by+8,.42);
    dim(cx+bx*1.08,cy-r1,cx+bx*1.08,cy+r1);ln(cx+bx*1.08-8,cy-r1,cx+bx*1.08+8,cy-r1,.42);ln(cx+bx*1.08-8,cy+r1,cx+bx*1.08+8,cy+r1,.42);
    c.globalAlpha=a}
  // registration marks in the corners
  const m=26,e=40;c.strokeStyle=fill('ice',.5);c.beginPath();
  for(const [x,y,sx,sy] of [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]]){c.moveTo(x,y+sy*e);c.lineTo(x,y);c.lineTo(x+sx*e,y);c.moveTo(x+sx*10,y+sy*10);c.arc(x+sx*10,y+sy*10,4,0,7)}c.stroke();
  // cursor crosshair, like a plotter head
  if(VT.pointer.on){const px=VT.pointer.x,py=VT.pointer.y;c.strokeStyle=fill('ice',.16);c.beginPath();c.moveTo(px,0);c.lineTo(px,H);c.moveTo(0,py);c.lineTo(W,py);c.stroke();c.strokeStyle=fill('ice',.5);c.beginPath();c.arc(px,py,9,0,7);c.stroke()}
  c.restore()}

/* ---- constellations ---- */
const proj=(x,y,rel)=>[v.W/2+x*v.S/rel,v.H/2+y*v.S/rel];
VT.contactStars=[{x:0,y:0,r:0,lit:0,vis:0},{x:0,y:0,r:0,lit:0,vis:0}];
function constellations(s,cz,time){const {W,H,S,portrait}=v;
  VT.contactStars.forEach(st=>{st.vis=0;st.lit=0});
  for(const k in VT.CONS){const i=+k,rel=i*GAP-cz;if(rel<.08||rel>4.4)continue;const t=VT.local(s,i),cn=VT.CONS[k];
    const sc0=(portrait?.66*W/S/2:.17*W/S)*(portrait&&i===3?.75:1);let ox=portrait?(i===3?.05*W/S:0):.22*W/S,oy=portrait?(i===3?-.3:-.27)*H/S:0;
    if(i===4){reach(cn,rel,t,time);continue}
    const vis=sstep(4.4,3.2,rel)*(1-sstep(.5,.12,rel));
    const lp=cn.morph?sstep(.05,.28,t):sstep(.1,.42,t),lab=(cn.morph?sstep(.12,.26,t):sstep(.3,.45,t))*(1-sstep(.72,.86,t));
    // chapter 3: the ten steps fade out, then the stars glide into Ursa Major
    const mp=cn.morph?sstep(.52,.74,t):0,labA=cn.morph?lab*(1-sstep(.46,.54,t)):lab;
    const pts=cn.morph?cn.pts.map((p,j)=>[lerp(p[0],cn.morph.pts[j][0],mp),lerp(p[1],cn.morph.pts[j][1],mp)]):cn.pts;
    if(cn.morph){ox*=1-mp*.85;oy*=1-mp*.6}
    const P=pts.map(([x,y])=>proj(ox+x*sc0,oy+y*sc0,rel));
    const E=cn.ed.length;c.lineWidth=1;
    cn.ed.forEach(([a,b],e)=>{const q=i===1?clamp(lp*1.6-e/E*.6):clamp(lp*E-e);if(q<=0)return;
      c.strokeStyle=fill('gold',(i===1?.28:.6)*vis*(1-mp));c.beginPath();c.moveTo(...P[a]);c.lineTo(lerp(P[a][0],P[b][0],q),lerp(P[a][1],P[b][1],q));c.stroke()});
    if(cn.morph&&mp>0){c.strokeStyle=fill('gold',.7*vis*mp);cn.morph.ed.forEach(([a,b])=>{c.beginPath();c.moveTo(...P[a]);c.lineTo(...P[b]);c.stroke()})}
    P.forEach((p,j)=>{const cur=cn.current===j&&mp<.5;const r=(cur?7:4.5)*clamp(1/Math.sqrt(rel),.6,2.4)*(1+mp*.4);c.globalAlpha=vis;c.drawImage(GLOW.gold,p[0]-r*3,p[1]-r*3,r*6,r*6);
      c.fillStyle=fill('ivory',1);c.beginPath();c.arc(p[0],p[1],r*.32,0,7);c.fill();
      if(cur){c.strokeStyle=fill('ivory',.5+.3*Math.sin(time*3));c.beginPath();c.arc(p[0],p[1],r*1.8+Math.sin(time*3)*2,0,7);c.stroke()}
      const lb=cn.labels&&cn.labels[j];if(lb&&labA>0){c.globalAlpha=vis*labA;c.fillStyle=cur?fill('gold',1):fill('ivory',.82);c.font=`500 ${portrait?9.5:11}px "Geist Mono",ui-monospace,monospace`;
        c.textAlign=i===3?'left':i===1&&j===0?'right':i===1&&lb==='reconstruction'?'left':'center';
        const off=i===3?[r*1.4+10,4]:i===1?(lb==='input'?[-14,4]:lb==='reconstruction'?[14,4]:[0,-16]):[0,-(r*1.6+12)];const tx=p[0]+off[0],ty=p[1]+off[1],tt=lb.toUpperCase();c.lineWidth=4;c.lineJoin='round';c.strokeStyle=fill('void',.85);c.strokeText(tt,tx,ty);c.lineWidth=1;c.fillText(tt,tx,ty)}c.globalAlpha=1});
    c.textAlign='start'}
}
/* the two contact orbs: nebula placeholders (assets/orb-*.webp) that ignite one after the other */
const ORB=[load('assets/orb-1.webp'),load('assets/orb-2.webp')];
VT.hover=[0,0];const hov=[0,0];
function reach(cn,rel,t,time){const {W,H,portrait}=v;
  cn.pts.forEach((_,j)=>{const lit=sstep(.3+j*.18,.5+j*.18,t),vis=sstep(4.4,3.2,rel),k=1/rel;
    hov[j]+=(VT.hover[j]-hov[j])*.12;
    const R=portrait?Math.min(W*.25,H*.11):Math.min(W*.15,H*.235),bx=portrait?W/2:W*(j?.7:.3),by=portrait?H*(.43+j*.23):H*.6;
    const px=W/2+(bx-W/2)*k,py=H/2+(by-H/2)*k,e=easeOut(lit),r=R*k*(.3+.7*e)*(1+.05*hov[j]+.012*Math.sin(time*1.5+j*2));
    const st=VT.contactStars[j];st.x=px;st.y=py;st.r=R*k;st.lit=lit;st.vis=vis;
    const a=vis*lit;if(a<.003)return;
    c.globalCompositeOperation='lighter';c.globalAlpha=a*(.55+.35*hov[j]);c.drawImage(GLOW.gold,px-r*2.1,py-r*2.1,r*4.2,r*4.2);
    c.globalCompositeOperation='source-over';
    const img=ORB[j];if(img.complete&&img.naturalWidth){c.save();c.translate(px,py);c.rotate(time*(j?-.03:.04));c.globalAlpha=a;c.drawImage(img,-r,-r,r*2,r*2);c.restore()}
    // ignition flare, then a slow pulse ring
    const fl=sstep(0,.3,lit)*(1-sstep(.3,1,lit));if(fl>.01){c.globalCompositeOperation='lighter';c.globalAlpha=vis*fl*.9;c.drawImage(GLOW.ivory,px-r*1.6,py-r*1.6,r*3.2,r*3.2);c.globalCompositeOperation='source-over'}
    c.lineWidth=1;c.strokeStyle=fill('gold',1);for(let q=0;q<2;q++){const ph=(time*.18+q*.5+j*.25)%1;c.globalAlpha=vis*lit*(1-ph)*.35;c.beginPath();c.arc(px,py,r*(1.02+ph*.5),0,7);c.stroke()}
    c.globalAlpha=1})}

/* ---- frame ---- */
VT.sky={
  resize(){cv.width=v.W*v.DPR;cv.height=v.H*v.DPR},
  draw(s,cam,vz,time){const {W,H,portrait}=v,SEG=VT.SEG;c.setTransform(v.DPR,0,0,v.DPR,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    c.fillStyle=fill('void',1);c.fillRect(0,0,W,H);
    const pi=VT.local(s,0),bpA=1-sstep(.05,.55,pi);
    if(bpA>.001){c.fillStyle=fill('navy',bpA);c.fillRect(0,0,W,H)}
    // backdrops: nebula for the journey, star cluster for the arrival
    const a2=sstep(SEG[3].start+SEG[3].len*.8,SEG[4].start+SEG[4].len*.45,s);
    const a1=sstep(.35,1.7,s)*(1-a2);
    cover(BG1,a1*.5,1.12+.05*s,Math.sin(s*.35)*.6,Math.cos(s*.27)*.5);
    cover(BG2,a2*.72,1.04+.5*sstep(0,1,(s-SEG[4].start+SEG[3].len*.2)/(SEG[4].len+SEG[3].len*.2)),0,0);
    // keep copy readable: darken the side the text sits on
    const dk=Math.max(a1,a2);if(dk>.01){const g=portrait?c.createLinearGradient(0,H,0,0):c.createLinearGradient(0,0,W,0);
      g.addColorStop(0,fill('void',.9*dk));g.addColorStop(.5,fill('void',.55*dk));g.addColorStop(.78,fill('void',.12*dk));g.addColorStop(1,fill('void',0));c.fillStyle=g;c.fillRect(0,0,W,H)}
    blueprint(bpA,time);
    // stars
    c.globalCompositeOperation='lighter';
    const starA=sstep(.04,.9,s),streak=clamp(Math.abs(vz)*60,0,1),cz=cam.cz,S=v.S;
    if(starA>.003)for(const st of STARS){const rel=((st.z-cz)%DEPTH+DEPTH)%DEPTH;if(rel<.04)continue;const x=W/2+st.x*S/rel,y=H/2+st.y*S/rel;if(x<-20||x>W+20||y<-20||y>H+20)continue;
      const fade=Math.min(1,(DEPTH-rel)/2.2)*Math.min(1,rel/.3),tw=.75+.25*Math.sin(time*1.6+st.tw),a=fade*tw*Math.min(1,st.m*.8)*starA,r=clamp(st.m*1.1/Math.sqrt(rel),.35,3.4);
      if(streak>.05){const rel2=rel+vz*7,x2=W/2+st.x*S/rel2,y2=H/2+st.y*S/rel2;c.strokeStyle=fill(st.k,a*.75*streak);c.lineWidth=r*.9;c.beginPath();c.moveTo(x2,y2);c.lineTo(x,y);c.stroke()}
      c.globalAlpha=1;if(r<1.1){c.fillStyle=fill(st.k,a);c.fillRect(x-r/2,y-r/2,r,r)}
      else{c.globalAlpha=a*.9;c.drawImage(GLOW[st.k],x-r*3,y-r*3,r*6,r*6);c.fillStyle=fill('ivory',a);c.fillRect(x-r/3,y-r/3,r*.66,r*.66)}}
    c.globalAlpha=1;c.globalCompositeOperation='source-over';
    constellations(s,cz,time)}
};
})();

/* Work: the project card ring, card art and the project dialog. */
(()=>{
"use strict";
const VT=window.VT,{$,clamp,lerp,sstep,ease,rng,fill,v,PROJECTS}=VT;
const N=PROJECTS.length;
const G=`rgb(${VT.col.gold})`,IV=`rgb(${VT.col.ivory})`,IC=VT.fill('ice',.85),FONT='"Geist Mono",monospace';

/* ---- card art, all generated; one gold line, one ice accent ---- */
function base(c,w,h,seed){const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,fill('deep',1));g.addColorStop(1,fill('void',1));c.fillStyle=g;c.fillRect(0,0,w,h);
  const r=rng(seed);for(let i=0;i<120;i++){c.fillStyle=fill('ivory',r()*.5);const s=r()*1.4;c.fillRect(r()*w,r()*h,s,s)}}
const tag=(c,h,txt,x,y,sz=.065)=>{c.fillStyle=fill('ivory',.7);c.font=`500 ${h*sz}px ${FONT}`;c.fillText(txt,x,y)};
const ART={
 rfq(c,w,h){base(c,w,h,11);const y=h*.56,x0=w*.08,x1=w*.92;c.strokeStyle=fill('ivory',.25);c.lineWidth=h*.035;c.lineCap='round';c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
  const st=(x1-x0)/9;c.strokeStyle=G;c.beginPath();c.moveTo(x0,y);c.lineTo(x0+st*6,y);c.stroke();
  c.setLineDash([h*.03,h*.03]);c.strokeStyle=fill('gold',.7);c.lineWidth=h*.012;c.beginPath();c.moveTo(x0+st*6,y);c.lineTo(x0+st*7,y);c.stroke();c.setLineDash([]);
  for(let i=0;i<10;i++){const x=x0+st*i,fh=h*.2;c.fillStyle=i<6?G:i===6?IV:fill('navy',1);c.strokeStyle=i<6?G:fill('ivory',.4);c.lineWidth=1.5;c.beginPath();c.roundRect(x-w*.012,y-fh/2,w*.024,fh,3);c.fill();c.stroke();
   if(i===6){c.strokeStyle=IV;c.globalAlpha=.6;c.beginPath();c.arc(x,y,fh*.75,0,7);c.stroke();c.globalAlpha=1}}
  tag(c,h,'STEP 07 / 10  ·  CLIENT PO AND ADVANCE PI',x0,h*.24)},
 robust(c,w,h){base(c,w,h,23);const bx=w*.6,r=rng(5);const g=c.createLinearGradient(bx-w*.04,0,bx+w*.04,0);g.addColorStop(0,fill('ice',0));g.addColorStop(.5,fill('ice',.4));g.addColorStop(1,fill('ice',0));c.fillStyle=g;c.fillRect(bx-w*.05,0,w*.1,h);
  for(let i=0;i<22;i++){const y=h*(.08+.84*r()),pass=r()<.32;c.strokeStyle=pass?G:fill('ivory',.55);c.lineWidth=pass?1.8:1.1;c.beginPath();c.moveTo(w*.04,y);c.lineTo(pass?w*.96:bx-w*.03,y+(pass?(r()-.5)*h*.1:0));c.stroke();
   if(!pass){c.fillStyle=fill('ivory',.8);for(let k=0;k<5;k++){c.fillRect(bx-w*.035-r()*w*.04,y+(r()-.5)*h*.06,1.6,1.6)}}else{c.fillStyle=G;c.beginPath();c.arc(w*.96,y,2.6,0,7);c.fill()}}
  c.fillStyle=IV;c.font=`500 ${h*.075}px ${FONT}`;c.fillText('TSI 19.5 → 9.8',w*.06,h*.94)},
 pdm(c,w,h){base(c,w,h,37);c.strokeStyle=fill('ivory',.18);c.setLineDash([4,5]);c.beginPath();c.moveTo(0,h*.3);c.lineTo(w,h*.3);c.stroke();c.setLineDash([]);
  c.lineWidth=1.6;c.strokeStyle=IC;c.beginPath();const r=rng(9);for(let x=0;x<=w;x+=2){const t=x/w;let y=h*.6+Math.sin(t*60)*h*.06+Math.sin(t*17)*h*.04+(r()-.5)*h*.03;const sp=Math.exp(-Math.pow((t-.72)*28,2));y-=sp*h*.38*Math.sin(t*140);x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
  c.strokeStyle=G;c.lineWidth=1.5;c.beginPath();c.arc(w*.72,h*.42,h*.22,0,7);c.stroke();c.fillStyle=G;c.font=`500 ${h*.065}px ${FONT}`;c.fillText('ANOMALY · BEARING 2',w*.06,h*.16)},
 web(c,w,h){base(c,w,h,41);const cx=w*.55,cy=h*.55,R=h*.42;for(let la=-80;la<=80;la+=8){const n=Math.max(1,Math.round(44*Math.cos(la*Math.PI/180)));for(let i=0;i<n;i++){const lo=i/n*Math.PI*2+.4;const x=Math.cos(la*Math.PI/180)*Math.sin(lo),y=Math.sin(la*Math.PI/180),z=Math.cos(la*Math.PI/180)*Math.cos(lo);if(z<0)continue;const lit=clamp(.2+.8*(x*-.5+y*-.4+z*.75));c.fillStyle=fill('gold',.25+lit*.75);c.beginPath();c.arc(cx+x*R,cy-y*R,.6+lit*2.3,0,7);c.fill()}}
  tag(c,h,'QUANTUM-HORIZON',w*.06,h*.14)},
 vaegan(c,w,h){base(c,w,h,67);const L=[6,4,2,4,6],xs=L.map((_,i)=>w*(.14+i*.18));const P=L.map((n,i)=>Array.from({length:n},(_,j)=>[xs[i],h*.55+(j-(n-1)/2)*h*.13]));
  c.lineWidth=.7;for(let i=0;i<4;i++)for(const a of P[i])for(const b of P[i+1]){c.strokeStyle=fill('gold',.28);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()}
  P.forEach((col,i)=>col.forEach(p=>{c.fillStyle=i===2?IV:G;c.beginPath();c.arc(p[0],p[1],i===2?4:2.6,0,7);c.fill()}));
  const r=rng(3);for(let i=0;i<40;i++){c.fillStyle=fill('ice',r()*.7);c.fillRect(w*.03+r()*w*.07,h*.18+r()*h*.74,2,2)}tag(c,h,'ENCODER · z · DECODER',w*.06,h*.14)},
 cae(c,w,h){base(c,w,h,79);const f=(x,y)=>{const a=Math.sin(x*6+y*3)*.5+.5,b=Math.cos(x*3-y*7)*.5+.5,g=a*.9,i=(1-a)*b*.8,n=VT.col.navy.split(','),go=VT.col.gold.split(','),ic=VT.col.ice.split(',');return[0,1,2].map(q=>+n[q]+g*(go[q]-n[q])+i*(ic[q]-n[q]))};
  const draw=(x0,x1,bs)=>{for(let x=x0;x<x1;x+=bs)for(let y=h*.2;y<h*.92;y+=bs){const q=f(x/w,y/h);c.fillStyle=`rgb(${q[0]|0},${q[1]|0},${q[2]|0})`;c.fillRect(x,y,bs-.5,bs-.5)}};
  draw(w*.06,w*.48,3);draw(w*.52,w*.94,h*.09);c.fillStyle=G;c.fillRect(w*.495,h*.2,1.5,h*.72);c.fillStyle=IV;c.font=`500 ${h*.06}px ${FONT}`;c.fillText('ORIGINAL',w*.06,h*.14);c.fillText('LATENT CODE',w*.52,h*.14)}
};
function paintArt(cv,k){const r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(200,r.width||300),h=Math.max(120,r.height||180);
  cv.width=w*dpr;cv.height=h*dpr;const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);ART[k](c,w,h)}

/* ---- cards ---- */
const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const ring=$('#ring'),grid=$('#grid');
const cards=PROJECTS.map((p,i)=>{const b=document.createElement('button');b.className='card';b.type='button';b.dataset.i=i;b.setAttribute('aria-label',p.t+'. '+p.one);
  b.innerHTML=`<canvas aria-hidden="true"></canvas><div class="ct"><small>${esc(p.st)}</small><b>${esc(p.t)}</b><span>${esc(p.one)}</span><i class="tg">${esc(p.tags.slice(0,3).join(" \u00b7 "))}</i></div><div class="shade"></div>`;(VT.RM?grid:ring).appendChild(b);return b});

/* ---- dialog ---- */
const dlg=$('#dlg');
function openProject(i){const p=PROJECTS[i];$('#d-st').textContent=p.st;$('#d-t').textContent=p.t;$('#d-d').textContent=p.d;
  $('#d-l').innerHTML=p.l.map(x=>`<li>${esc(x)}</li>`).join('');$('#d-tags').innerHTML=p.tags.map(t=>`<span>${esc(t)}</span>`).join('');
  try{dlg.showModal()}catch(e){dlg.setAttribute('open','')}requestAnimationFrame(()=>paintArt($('#d-art'),p.k))}
$('#d-x').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

/* ---- the ring: scattered, then an arc, then a turning 3D ring, then a zoom through ---- */
let front=-1;
const SCAT=(()=>{const r=rng(321);return PROJECTS.map(()=>({x:(r()-.5)*2.4,y:(r()-.5)*2.2,z:-1800-r()*2200,rx:(r()-.5)*140,ry:(r()-.5)*160,rz:(r()-.5)*120}))})();
const cap={st:$('#c-st'),t:$('#c-t'),d:$('#c-d'),more:$('#c-more')};
function update(u){const show=u>.015&&u<.995;ring.style.visibility=show?'visible':'hidden';if(!show){front=-1;return}
  const {W,H,portrait,cw}=v,R=N*cw/(2*Math.PI)*(portrait?1.12:1.3),rA=Math.min(W*(portrait?.36:.3),portrait?220:430);
  const a1=ease(clamp((u-.05)/.19)),a2=ease(clamp((u-.24)/.12));
  const vv=clamp((u-.38)/.54)*(N-1),kk=Math.min(N-2,Math.floor(vv)),f=vv-kk,sn=vv>=N-1?N-1:kk+ease(clamp((f-.3)/.5)),rot=sn*360/N,exit=sstep(.93,.995,u);
  ring.style.transform=`translateY(${(portrait?-.06*H:0).toFixed(1)}px) translateZ(${(exit*700).toFixed(0)}px) rotateX(${(-7*a2).toFixed(2)}deg)`;ring.style.opacity=(1-exit).toFixed(3);
  cards.forEach((b,i)=>{const sc=SCAT[i];
    const bA=(-70+i*140/(N-1))*Math.PI/180,ax=rA*Math.sin(bA),ay=-rA*Math.cos(bA)+rA*.55,arz=bA*180/Math.PI;
    const ang=((i*360/N-rot)%360+540)%360-180,ar=ang*Math.PI/180,gx=R*Math.sin(ar),gz=R*Math.cos(ar)-R;
    let x=lerp(sc.x*W*.5,ax,a1),y=lerp(sc.y*H*.5,ay,a1),z=lerp(sc.z,0,a1),rx=lerp(sc.rx,0,a1),ry=lerp(sc.ry,0,a1),rz=lerp(sc.rz,arz,a1),s=lerp(.5,.62,a1);
    x=lerp(x,gx,a2);y=lerp(y,0,a2);z=lerp(z,gz,a2);ry=lerp(ry,ang,a2);rz=lerp(rz,0,a2);s=lerp(s,1,a2);
    b.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    b.querySelector('.shade').style.opacity=(a2*(1-(Math.cos(ar)+1)/2)*.78+(1-a1)*.3).toFixed(3);
    b.tabIndex=a2>.9&&Math.abs(ang)<30?0:-1});
  const fi=Math.round(sn)%N;if(fi!==front){front=fi;const p=PROJECTS[fi];cap.st.textContent=p.st;cap.t.textContent=p.t;cap.d.textContent=p.d;cap.more.onclick=()=>openProject(fi)}}

/* scroll position (in viewport heights) that brings card i to the front */
function scrollToCard(i){const vv=i+.1,uc=clamp(.38+vv/(N-1)*.54,0,.92),u=VT.RING_START+(1-VT.RING_START)*uc;scrollTo({top:(VT.SEG[2].start+u*VT.SEG[2].len)*v.VH,behavior:'smooth'})}
cards.forEach((b,i)=>b.addEventListener('click',()=>{if(VT.RM||front===i)openProject(i);else scrollToCard(i)}));

VT.RING_START=.2; /* the first fifth of the Work chapter belongs to the kinetic word */
VT.ring={update,paint(){cards.forEach((b,i)=>paintArt(b.querySelector('canvas'),PROJECTS[i].k))}};
})();

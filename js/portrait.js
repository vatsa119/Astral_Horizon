/* #pc: the portrait as ~18k particles. They stream in on load, shy away from the cursor,
   and scatter into the star field as you scroll. Scatter is a pure function of scroll, so it reverses. */
(()=>{
"use strict";
const VT=window.VT,{clamp,lerp,sstep,easeOut,rng,fill,v}=VT;
const cv=VT.$('#pc'),c=cv.getContext('2d');
const D=VT.PORTRAIT,N=D.n;
const hx=new Float32Array(N),hy=new Float32Array(N),br=new Float32Array(N),hz=new Float32Array(N);
const ang=new Float32Array(N),spd=new Float32Array(N),dly=new Float32Array(N),edge=new Float32Array(N),sx0=new Float32Array(N),sy0=new Float32Array(N);
const ox=new Float32Array(N),oy=new Float32Array(N),vx=new Float32Array(N),vy=new Float32Array(N),lvl=new Uint8Array(N);
(()=>{const bin=atob(D.data),b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);
  const u16=new Uint16Array(b.buffer.slice(0,4*N)),r=rng(11);
  for(let i=0;i<N;i++){hx[i]=u16[i]/65535;hy[i]=u16[N+i]/65535;br[i]=b[4*N+i]/255;
    const dx=hx[i]-.42,dy=hy[i]-.4;hz[i]=(br[i]-.5)*.22+Math.exp(-(dx*dx+dy*dy)*5)*.16+(r()-.5)*.03;
    ang[i]=r()*6.2832;spd[i]=.35+r()*1.1;dly[i]=r()*1.1;sx0[i]=(r()-.5)*2;sy0[i]=(r()-.5)*2;
    edge[i]=sstep(0,.07,hx[i])*sstep(1,.9,hy[i]);
    lvl[i]=r()<.045?5:Math.min(4,Math.floor(br[i]*5))}})();
const colors=[fill('ice',.5),fill('ice',.75),fill('ivory',.7),fill('ivory',.9),fill('ivory',1),fill('gold',1)];

VT.portrait={
  resize(){cv.width=v.W*v.DPR;cv.height=v.H*v.DPR},
  /* pi: intro progress 0..1, time: seconds since load */
  draw(pi,time,dt){const {W,H,pr}=v,P=VT.pointer;c.setTransform(v.DPR,0,0,v.DPR,0,0);c.clearRect(0,0,W,H);
    const dis=sstep(.1,.88,pi);if(dis>.985)return;
    const grow=1+.22*dis,px=P.x,py=P.y,on=P.on,R=Math.min(W,H)*.1,R2=R*R;
    const yaw=((on?(px/W-.5):0)*.35)+pi*1.3,cy_=Math.cos(yaw),sy_=Math.sin(yaw),k=Math.min(2,dt*60);
    const ax=pr.x+.42*pr.w,ay=pr.y+.4*pr.h;
    const buckets=[[],[],[],[],[],[]];const size=.85+Math.min(W,H)/1300;
    for(let i=0;i<N;i++){
      // assembly: stream in from scatter on load
      const e=easeOut(clamp((time-.25-dly[i])/1.7));if(e<=0)continue;
      let x=(hx[i]-.42)*pr.w,y=(hy[i]-.4)*pr.h,z=hz[i]*pr.w;
      const xr=x*cy_+z*sy_,zr=-x*sy_+z*cy_,pf=1/(1-zr/(pr.w*2.4));
      let X=ax+xr*pf*grow,Y=ay+y*pf*grow;
      X=lerp(ax+sx0[i]*W*.9,X,e);Y=lerp(ay+sy0[i]*H*.9,Y,e);
      // scatter into the sky
      if(dis>0){const d=dis*dis*(.4+spd[i]);X+=Math.cos(ang[i])*d*W*.9+Math.sin(ang[i]*3+time*.4)*dis*30;Y+=Math.sin(ang[i])*d*H*.9-dis*dis*H*.25}
      // pointer repels
      if(on&&dis<.5){const dx=X+ox[i]-px,dy=Y+oy[i]-py,d2=dx*dx+dy*dy;if(d2<R2*2.2){const d=Math.sqrt(d2)+.001,f=(1-d/(R*1.48));if(f>0){const g=f*f*(2.2+Math.hypot(P.vx,P.vy)*.08);vx[i]+=dx/d*g*k+P.vx*.01*f;vy[i]+=dy/d*g*k+P.vy*.01*f}}}
      vx[i]=(vx[i]-ox[i]*.045*k)*Math.pow(.9,k);vy[i]=(vy[i]-oy[i]*.045*k)*Math.pow(.9,k);ox[i]+=vx[i]*k;oy[i]+=vy[i]*k;
      X+=ox[i];Y+=oy[i];
      if(X<-4||X>W+4||Y<-4||Y>H+4)continue;
      const a=edge[i]*(1-sstep(.5,1,dis));if(a<.05)continue;
      const s=size*(.65+br[i]*.85)*(1+Math.min(1,Math.abs(ox[i]+oy[i])*.01));
      buckets[lvl[i]].push(X-s/2,Y-s/2,s*a+.3);
    }
    c.globalCompositeOperation='lighter';
    for(let b=0;b<6;b++){const A=buckets[b];if(!A.length)continue;c.fillStyle=colors[b];c.beginPath();for(let j=0;j<A.length;j+=3)c.rect(A[j],A[j+1],A[j+2],A[j+2]);c.fill()}
    c.globalCompositeOperation='source-over'}
};
})();

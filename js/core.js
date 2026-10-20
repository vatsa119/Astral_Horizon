/* Shared helpers and layout state. Every other file hangs off window.VT. */
(()=>{
"use strict";
const VT=window.VT=window.VT||{};
const root=document.documentElement;

VT.$=s=>document.querySelector(s);
VT.$$=s=>[...document.querySelectorAll(s)];
VT.clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
VT.lerp=(a,b,t)=>a+(b-a)*t;
VT.sstep=(a,b,x)=>{const t=VT.clamp((x-a)/(b-a));return t*t*(3-2*t)};
VT.ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
VT.easeOut=t=>1-Math.pow(1-t,3);
VT.rng=seed=>{let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}};

VT.RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(VT.RM)root.classList.add('static');

/* colour tokens live in CSS as "r,g,b" triplets; canvas code reads them here */
const cs=getComputedStyle(root);
VT.rgb=n=>cs.getPropertyValue('--'+n+'-rgb').trim();
VT.col={};
['void','deep','navy','ivory','gold','ice'].forEach(n=>{VT.col[n]=VT.rgb(n)});
VT.fill=(n,a=1)=>`rgba(${VT.col[n]},${a})`;

VT.pointer={x:0,y:0,vx:0,vy:0,on:false};

/* layout state, refreshed by resize() in main.js */
VT.v={W:innerWidth,H:innerHeight,DPR:1,VH:innerHeight,S:1,portrait:false,cw:240};

/* The journey: each chapter owns a stretch of scroll, measured in viewport heights. */
VT.SEG=[{len:1.9},{len:1.6},{len:4.4},{len:2.6},{len:2.0}];
VT.SEG_ID={intro:0,origin:1,work:2,now:3,reach:4};
let acc=0;VT.SEG.forEach(s=>{s.start=acc;acc+=s.len});
VT.TOTAL=acc;
VT.local=(s,i)=>VT.clamp((s-VT.SEG[i].start)/VT.SEG[i].len);

/* Camera: each chapter's constellation sits GAP units deeper. Scrolling dives through them. */
VT.DEPTH=8;VT.GAP=3.75;
VT.camera=s=>{const SEG=VT.SEG,{clamp}=VT;let i=0;while(i<SEG.length-1&&s>=SEG[i].start+SEG[i].len)i++;
  const t=clamp((s-SEG[i].start)/SEG[i].len);let e;
  if(i===0)e=.5+.5*Math.pow(t,2.2);
  else if(i===SEG.length-1)e=.5-.5*Math.pow(1-t,3);
  else{const p=i===2?5:3,x=2*t-1;e=.5+.5*Math.sign(x)*Math.pow(Math.abs(x),p)}
  const d=Math.pow(4,1-2*e);return{i,t,d,cz:i*VT.GAP-d}};
})();

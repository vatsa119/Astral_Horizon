/* Word-by-word reveal for body copy. Pure function of scroll progress, so it reverses cleanly.
   Display type (WORK, REACH OUT) is particle type: see typefx.js. */
(()=>{
"use strict";
const VT=window.VT,{clamp,sstep,ease,easeOut,rng}=VT;

/* Split copy into words that rise in one after another; <em> and other inline tags survive. */
function words(root){const list=[];
  (function walk(node){[...node.childNodes].forEach(ch=>{
    if(ch.nodeType===1&&ch.classList.contains('blk'))return;
    if(ch.nodeType===3){const frag=document.createDocumentFragment();
      ch.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(' '));return}
        const s=document.createElement('span');s.className='w';s.textContent=t;frag.appendChild(s);list.push(s)});
      node.replaceChild(frag,ch)}
    else if(ch.nodeType===1)walk(ch)})})(root);
  return list}
function setWords(list,p){const n=list.length||1;
  list.forEach((s,j)=>{const q=sstep(j/n*.7,j/n*.7+.3,p);s.style.opacity=q.toFixed(3);
    s.style.transform=q<.999?`translate3d(0,${((1-q)*.6).toFixed(3)}em,0)`:'';s.style.filter=q<.999?`blur(${((1-q)*6).toFixed(1)}px)`:'none'})}

VT.kinetic={words,setWords};
})();

/* Content. Project copy lives here only; chapter copy lives in index.html. */
(()=>{
"use strict";
const VT=window.VT;

VT.PROJECTS=[
 {k:'rfq',st:'Present · 2026',t:'Sigma RFQ',one:'Procurement automation for an oilfield supplier, enquiry to final payment.',
  d:'A ten-step case cycle for Sigma Oilfield & Industrial Supply, built so non-technical staff can run every stage without touching Python, Excel or Outlook scripts.',
  l:['FastAPI owns the rules: case numbering, step order, deal details, files, search and an insert-only audit log. Next.js only displays what the backend returns.',
     'RFQs go out and quotes come back through Outlook automation, each run contained in a Windows job object so nothing it starts can outlive it.',
     'The hardest bug: a venv launcher started the real interpreter as a child that escaped the job. Fix: create the process suspended and release it only inside the job.',
     'The API contract is exported to OpenAPI and the TypeScript types are generated from it, so the frontend and backend cannot drift.',
     'SQLite with FTS5 search, Caddy TLS on the LAN and a nightly backup. Zero runtime cost.'],
  tags:['FastAPI','Next.js','SQLite FTS5','Caddy','Outlook COM','OpenAPI']},
 {k:'robust',st:'Present · 2026',t:'RobustLens',one:'Measures how easily a vision model is fooled, and by how small a change.',
  d:'An attack and robustness-evaluation harness for vision and vision-language models, generalized from my M.S. thesis. It runs a battery of attacks and reduces the results to one auditable Threat Susceptibility Index (TSI).',
  l:['White-box (FGSM, PGD, C&W), query-only black-box (SPSA) and cross-architecture transfer attacks in one run.',
     'The index is tested, not assumed: PGD adversarial training cut it from 19.5 to 9.8 on FashionMNIST, at a cost of 6.3 points of clean accuracy.',
     'Success-vs-budget curves show at what perturbation size a model breaks, not just whether it does.',
     'Served as a FastAPI audit service and a Streamlit dashboard with a photon visualization driven by the measured report card. Dockerized, tested in CI on Python 3.10 to 3.12.'],
  tags:['PyTorch','Adversarial ML','CLIP','FastAPI','Streamlit','Docker']},
 {k:'pdm',st:'Present · 2026',t:'Predictive maintenance platform',one:'AI condition monitoring for mid-size oil and gas operators.',
  d:'Platform strategy for a joint venture bringing AI predictive maintenance to Tier 3 and Tier 4 operators across the Middle East and Asia-Pacific.',
  l:['Positioned the platform for operators that larger vendors price out.',
     'Built the competitive teardown, pricing analysis and vulnerability map used in partner and investor discussions.'],
  tags:['Predictive maintenance','Market strategy','Oil & gas']},
 {k:'web',st:'2026',t:'Sigma Oilfield website',one:'A cinematic company site with a halftone globe and scroll-driven story.',
  d:'The public site for Sigma Oilfield & Industrial Supply, codenamed quantum-horizon, built on its own design system, Carbon Precision.',
  l:['Next.js 15, React 19 and Tailwind 4, with GSAP scroll mechanics and a Three.js halftone globe.',
     'Built in nine sequential, structured build prompts with an AI IDE.'],
  tags:['Next.js 15','React 19','Tailwind 4','GSAP','Three.js']},
 {k:'vaegan',st:'M.S. thesis · SIU Carbondale',t:'Vulnerability in VAEGANs',one:'White-box and black-box attacks on generative models.',
  d:'Assessing Vulnerability in VAEGANs: Insights from White-box and Black-box Attacks. A study of how hybrid variational-adversarial models fail, and a way to score it.',
  l:['Attacked VAEGAN architectures under white-box and black-box threat models.',
     'Developed the threat-scoring method that later became RobustLens.'],
  tags:['VAE','GAN','Adversarial attacks','Research']},
 {k:'cae',st:'Published research',t:'Learned image compression',one:'Convolutional autoencoders that compress images.',
  d:'Published research on image compression with convolutional autoencoders (CAE): learning a compact code for an image and reconstructing it.',
  l:['Encoder and decoder trained end to end on reconstruction quality.'],
  tags:['CAE','Compression','Computer vision','Research']}
];

/* Constellations in local units (about -1..1). Keys are chapter indexes. */
const steps=['Enquiry received','Sigma no. issued','Suppliers selected','Enquiries sent','Quotes compared','Reviewed and negotiated','Client PO and advance PI','Supplier PO issued','Shipping docs','Balance PI and payment'];

/* Ursa Major, the ten stars the Sigma RFQ chain turns into (stand-in until the final artwork exists).
   [RA hours, Dec degrees]: Dubhe, Merak, Phecda, Megrez, Alioth, Mizar, Alkaid, Muscida, Talitha, Tania Borealis */
const URSA=[[11.06,61.75],[11.03,56.38],[11.90,53.69],[12.26,57.03],[12.90,55.96],[13.40,54.93],[13.79,49.31],[8.51,60.72],[8.99,48.04],[10.28,42.91]];
const ursaPts=(()=>{const xs=URSA.map(([ra,d])=>(ra-11.2)*15*Math.cos(55*Math.PI/180)),ys=URSA.map(([,d])=>-(d-52));
  const k=1/Math.max(...xs.map(Math.abs),...ys.map(Math.abs));return xs.map((x,i)=>[x*k*.92,ys[i]*k*.92])})();

VT.CONS={
 1:(()=>{const L=[4,3,2,3,4],pts=[],ed=[];const idx=[];L.forEach((n,i)=>{const col=[];for(let j=0;j<n;j++){col.push(pts.length);pts.push([-1+i*.5,(j-(n-1)/2)*.36])}idx.push(col)});
   for(let i=0;i<4;i++)for(const a of idx[i])for(const b of idx[i+1])ed.push([a,b]);return{pts,ed,labels:{0:'input',[idx[2][0]]:'latent z',[idx[4][3]]:'reconstruction'}}})(),
 3:(()=>{const pts=steps.map((_,j)=>[-.55+.32*Math.sin(j*.95),-1.05+j*.235]),ed=steps.slice(1).map((_,j)=>[j,j+1]),labels={};
   steps.forEach((n,j)=>labels[j]=String(j+1).padStart(2,'0')+'  '+n);
   return{pts,ed,labels,current:6,morph:{pts:ursaPts,ed:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6],[0,7],[2,8],[1,9]]}}})(),
 4:{pts:[[-.62,.18],[.62,.18]],ed:[],labels:{}}
};
})();

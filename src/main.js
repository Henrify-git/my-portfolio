/* Page logic. You normally never need to edit this file: content lives in src/data/portfolio.js. */
const CONFIG=window.PORTFOLIO;
/* Project cover can be an image or a short video (MP4/WebM). */
const isVideo=u=>/\.(mp4|webm)(\?.*)?$/i.test(u||'');
const mediaTag=(u,alt)=>!u?'':isVideo(u)?`<video src="${u}" muted loop playsinline preload="metadata" aria-label="${alt}" onerror="this.remove()"></video>`:`<img src="${u}" alt="${alt}" onerror="this.remove()">`;
const $=s=>document.querySelector(s);
/* Videos in ANY image slot: muted, looping, play while visible; hover also plays. Reduced-motion users get controls. */
const calmMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const vio=new IntersectionObserver(es=>es.forEach(e=>{if(calmMotion)return;e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()}),{threshold:.4});
const watchVideo=v=>{if(calmMotion)v.controls=true;vio.observe(v);v.parentElement.addEventListener('mouseenter',()=>v.play().catch(()=>{}))};
/* Loads an image; if the file is missing the placeholder stays visible. */
const img=(el,src,alt)=>{if(!src)return;
 if(isVideo(src)){const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-label',alt||'');
  v.onloadedmetadata=()=>{el.textContent='';el.appendChild(v);watchVideo(v)};v.src=src;return}
 const i=new Image();i.alt=alt||'';i.onload=()=>{el.textContent='';el.appendChild(i)};i.src=src};
$('.logo').textContent=CONFIG.logo;
img($('#badgePhoto'),CONFIG.profilePhoto,CONFIG.name);img($('#introPhoto'),CONFIG.introPhoto,'');img($('#introShot'),CONFIG.introShot,'');img($('#aboutPhoto'),CONFIG.aboutPhoto,'');
$('#badgeName').textContent=CONFIG.name.split(' ')[0].toUpperCase();$('#badgeRole').innerHTML=CONFIG.badgeRole;
$('#sig').textContent=CONFIG.signature;
document.querySelectorAll('.corner').forEach(e=>e.textContent=CONFIG.corners[e.dataset.k]);
$('#badgeRows').innerHTML=CONFIG.roles.slice(0,3).map(r=>`<div class="wi"><i style="background:color-mix(in srgb,${r.c} 45%,#fff)">${r.i}</i><span><b>${r.t}</b><small>${r.d}</small></span></div>`).join('');
$('#badgeMini').innerHTML=CONFIG.badgeMini;$('#badgeAvail').textContent=CONFIG.badgeAvail;$('#badgeId').textContent=CONFIG.badgeId;$('#badgeHandle').textContent=CONFIG.handle;$('#badgeTag').textContent=CONFIG.badgeTag;$('#badgeSig').textContent=CONFIG.name.split(' ')[0];
$('#introP').textContent=CONFIG.introText;
$('#roles').innerHTML=CONFIG.roles.map(r=>`<div class="role rv"><div class="ic" style="background:${r.c}">${r.i}</div><h3>${r.t}</h3><p>${r.d}</p></div>`).join('');
$('#stats').innerHTML=CONFIG.stats.map(s=>`<div class="stat rv"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
const tl=CONFIG.tools.map(t=>`<em>✦</em><span>${t}</span>`).join('');$('#mq').innerHTML=tl+tl+tl+tl;
$('#workSub').textContent=CONFIG.workSub;
$('#track').innerHTML=CONFIG.projects.map(p=>`<a class="card ${p.tall?'tall':''}" href="${p.url}"><div class="shot ph"><span class="ph-label">${p.n}</span>${mediaTag(p.img,p.n)}</div><div class="meta"><b>${p.n}</b><span>${p.k}</span></div></a>`).join('');
$('#designsSub').textContent=CONFIG.designsSub;
$('#designList').innerHTML=CONFIG.designs.map(d=>`<a class="drow" href="design.html?d=${encodeURIComponent(d.slug)}"><div class="dthumb ph"><span class="ph-label">${d.name}</span>${mediaTag(d.image,d.name)}</div><div class="dtxt"><h3>${d.name}</h3><p>${d.summary}</p></div><span class="dkind">${d.kind}</span><em>\u2197</em></a>`).join('');
$('#aboutTag').textContent=CONFIG.aboutTag;$('#aboutP').textContent=CONFIG.aboutText;
$('#aboutList').innerHTML=CONFIG.aboutList.map(l=>`<li>${l}</li>`).join('');
$('#cta').innerHTML=CONFIG.cta;
$('#mail').href=$('#quote').href='mailto:'+CONFIG.email;$('#wa').href=CONFIG.whatsapp;$('#social').href=CONFIG.social;$('#resume').href=CONFIG.resume;
$('#copy').textContent='© '+new Date().getFullYear()+' '+CONFIG.name;
document.title=CONFIG.name+' – Portfolio';

/* typewriter */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function type(el,txt,sp=60){el.textContent='';for(const c of txt){el.textContent+=c;await sleep(sp)}}
(async()=>{const el=$('#typed1');el.classList.add('cur');let i=0;while(true){await type(el,CONFIG.typedHero[i++%CONFIG.typedHero.length]);await sleep(1600)}})();
let introDone=false;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
 e.target.classList.add('in');
 if(e.target.id==='introH'&&!introDone){introDone=true;type(e.target,CONFIG.introHeading,55)}
}),{threshold:.25});
document.querySelectorAll('.rv,#introH').forEach(e=>io.observe(e));

/* nav: hidden on hero, dark over dark sections */
const nav=$('#nav'),dark=['#roles','#about'].map($);
function onScroll(){const y=scrollY,h=innerHeight;nav.classList.toggle('hide',y<h*.6);
 nav.classList.toggle('dark',dark.some(s=>{const r=s.getBoundingClientRect();return r.top<40&&r.bottom>40}));
 /* hero parallax: badge lifts and titles spread */
 const k=Math.min(y/h,1);document.querySelectorAll('.corner').forEach((c,i)=>c.style.opacity=1-k*1.2);
 $('.badge').style.opacity=1-k*1.1;
 /* work: horizontal drift */
 const w=$('#work'),r=w.getBoundingClientRect(),t=$('#track');
 const p=Math.min(Math.max((h-r.top)/(h+r.height*.6),0),1),max=t.scrollWidth-innerWidth;
 t.style.transform=`translateX(${-p*Math.max(max,0)}px)`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('#badge').addEventListener('click',()=>$('#badge').classList.toggle('flip'));
$('#badge').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#badge').classList.toggle('flip')}});

/* Intro buttons under the headline. Email uses CONFIG.email; LinkedIn/Calendly show only when a link is set. */
(function(){const B=CONFIG.introButtons||{},box=$('#introBtns');if(!box)return;
 const items=[['email',CONFIG.email?'mailto:'+CONFIG.email:'',B.emailLabel||'Email me','\u2709'],['linkedin',B.linkedinUrl,B.linkedinLabel||'LinkedIn','in'],['calendly',B.calendlyUrl,B.calendlyLabel||'Book a call','\u25F7']].filter(x=>x[1]);
 box.innerHTML=items.map(([k,u,l,i])=>`<a class="ibtn ${k}" href="${u}" ${k==='email'?'':'target="_blank" rel="noopener"'}><span aria-hidden="true">${i}</span>${l}</a>`).join('')})();

/* Videos created from markup (project cards, design thumbnails) */
document.querySelectorAll('#track video,#designList video').forEach(watchVideo);

/* Public-site loader. Fetches PUBLISHED content from Supabase (read-only, anon key),
   merges it over src/data/portfolio.js, then starts the page. If anything fails
   (no config, offline, timeout) the site shows the built-in content instead. */
(function(){
  const C=window.CMS_CONFIG||{},next=document.currentScript.dataset.next,$=s=>document.querySelector(s);
  let S={};
  const start=()=>{const s=document.createElement('script');s.src=next;s.onload=late;document.body.appendChild(s)};
  if(!C.url||!C.anonKey)return start();
  const get=async(t,q,sig)=>{const r=await fetch(`${C.url}/rest/v1/${t}?select=*${q||''}`,{signal:sig,headers:{apikey:C.anonKey,Authorization:'Bearer '+C.anonKey}});if(!r.ok)throw new Error(t+' '+r.status);return r.json()};
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),4000),O='&order=sort_order.asc';
  Promise.all(['profile','site_settings','roles','stats','tools','projects','designs','social_links'].map(t=>get(t,t==='profile'||t==='site_settings'?'':O,ctl.signal)))
  .then(([profile,settings,roles,stats,tools,projects,designs,social])=>{
    clearTimeout(timer);S=(settings[0]||{});S.social=social;
    if(S.seeded&&profile[0]){ // only trust the database once it has been seeded
      const p=profile[0],P=window.PORTFOLIO,m={name:'name',logo:'logo',badgeRole:'badge_role',signature:'signature',email:'email',whatsapp:'whatsapp',social:'social',resume:'resume_url',profilePhoto:'profile_photo',introPhoto:'intro_photo',introShot:'intro_shot',aboutPhoto:'about_photo',badgeMini:'badge_mini',badgeAvail:'badge_avail',badgeId:'badge_id',handle:'handle',badgeTag:'badge_tag',corners:'corners',typedHero:'typed_hero',introHeading:'intro_heading',introText:'intro_text',workSub:'work_sub',designsSub:'designs_sub',aboutTag:'about_tag',aboutText:'about_text',aboutList:'about_list',cta:'cta'};
      for(const k in m)if(p[m[k]]!=null)P[k]=p[m[k]];
      P.roles=roles.map(r=>({t:r.title,d:r.description,c:r.color,i:r.icon}));
      P.stats=stats.map(s=>[s.value,s.label]);P.tools=tools.map(t=>t.name);
      P.projects=projects.map(x=>({n:x.name,k:x.category,img:x.image_url,url:x.url||'#',tall:x.tall?1:0}));
      P.designs=designs.map(x=>({slug:x.slug,name:x.name,kind:x.kind,summary:x.summary,image:x.image_url,role:x.role,year:x.year,tools:x.tools,liveUrl:x.live_url,liveLabel:x.live_label,story:x.story||[]}));
      early();
    }else S={};
  }).catch(e=>{console.warn('CMS unavailable, using built-in content:',e.message);S={}}).finally(start);
  const IDS={intro:'#intro',roles:'#roles',stats:'#stats,.marquee',work:'#work',designs:'#designs',about:'#about',contact:'#contact'};
  function early(){ // colors and section visibility, before the page renders
    Object.entries(S.theme||{}).forEach(([k,v])=>v&&document.documentElement.style.setProperty('--'+k,v));
    Object.entries(S.sections||{}).forEach(([k,on])=>{if(on===false&&IDS[k]){document.querySelectorAll(IDS[k]).forEach(e=>e.style.display='none');document.querySelectorAll(`nav .links a[href="#${k}"]`).forEach(e=>e.style.display='none')}});
  }
  function late(){ // labels, social links and SEO, after the page has rendered
    const L=S.labels||{},set=(sel,v,suffix='')=>{if(v)document.querySelectorAll(sel).forEach(e=>e.textContent=v+suffix)};
    set('nav .links a[href="#work"]',L.nav_work);set('nav .links a[href="#designs"]',L.nav_designs);set('nav .links a[href="#about"]',L.nav_about);
    set('#navcta',L.nav_cta);set('.work h2',L.work_title);set('.designs h2',L.designs_title);set('.about h2',L.about_title);
    set('#mail',L.contact_btn,' \u2197');set('#quote',L.quote_btn,' \u2197');set('#copy',L.copyright);
    const soc=(S.social||[]).filter(s=>s.url),a=$('#social');
    if(a&&soc.length)a.replaceWith(...soc.flatMap((s,i)=>{const n=document.createElement('a');n.href=s.url;n.target='_blank';n.rel='noopener';n.textContent=s.label;return i?[' \u00b7 ',n]:[n]}));
    const q=S.seo||{},meta=(sel,attr,v)=>{if(!v)return;let m=$(sel);if(!m){m=document.createElement('meta');m.setAttribute(attr.n,attr.v);document.head.appendChild(m)}m.setAttribute('content',v)};
    if(q.title&&!/design\.html$/.test(location.pathname)){document.title=q.title;meta('meta[property="og:title"]',{n:'property',v:'og:title'},q.title)}
    meta('meta[name="description"]',{n:'name',v:'description'},q.description);meta('meta[property="og:description"]',{n:'property',v:'og:description'},q.description);
    meta('meta[property="og:image"]',{n:'property',v:'og:image'},q.og_image);
  }
})();

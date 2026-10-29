/* Admin dashboard. WHAT each section edits is described in the SECTIONS table below;
   the engine under it (forms, lists, uploads, saving) is generic. Security does NOT depend
   on this file: Supabase Row Level Security rejects every write from a non-admin. */
(function(){
const C=window.CMS_CONFIG||{};try{if(C.url)C.url=new URL(String(C.url).trim()).origin}catch(e){C.url=''}C.anonKey=String(C.anonKey||'').trim();
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const html=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild};
const isVid=u=>/\.(mp4|webm)(\?.*)?$/i.test(u||'');
const abs=u=>!u||/^(https?:|data:|\/)/.test(u)?u:'/'+u;
const app=$('#app');let sb,dirty=false,me;
const toast=(m,t='ok')=>{const e=html(`<div class="toast ${t}">${esc(m)}</div>`);$('#toasts').append(e);setTimeout(()=>e.remove(),5000)};
const ask=m=>new Promise(r=>{const d=$('#dlg');$('p',d).textContent=m;d.returnValue='';d.onclose=()=>r(d.returnValue==='yes');d.showModal()});
const get=(o,k)=>k.split('.').reduce((a,p)=>a==null?a:a[p],o);

/* ---------- WHAT EACH SECTION EDITS ---------- */
const T=(k,l,o={})=>({k,l,t:'text',...o}),A=(k,l,o={})=>({k,l,t:'area',...o}),I=(k,l,f,o={})=>({k,l,t:'img',folder:f,...o});
const B=(k,l,o={})=>({k,l,t:'bool',...o});
const SECTIONS={
 overview:{title:'Overview',custom:overview},
 profile:{title:'Personal Profile',blocks:[{kind:'single',table:'profile',title:'Identity, hero and ID badge',fields:[
  T('name','Name',{r:1}),T('logo','Navigation logo text',{r:1}),A('badge_role','Professional title (ID badge)',{h:'Use &lt;br&gt; for a new line'}),
  T('signature','Signature handwriting'),T('badge_avail','Availability status'),A('badge_mini','Badge corner text'),T('badge_id','Badge ID'),T('handle','Handle (badge back)'),T('badge_tag','Badge tagline'),
  {k:'typed_hero',l:'Hero typed lines',t:'list',r:1,h:'One per line'},{k:'corners',l:'Hero floating words',t:'list',n:4,h:'Exactly 4, one per line'},
  T('intro_heading','Intro headline',{r:1}),A('intro_text','Introduction'),
  I('profile_photo','Profile picture (ID badge)','profile'),I('intro_photo','Hero image','profile'),I('intro_shot','Hero screenshot','profile'),A('cta','Closing call-to-action heading')]}]},
 projects:{title:'Projects',blocks:[
  {kind:'single',table:'profile',title:'Section subtitle',fields:[T('work_sub','Subtitle under “Selected work”')]},
  {kind:'list',table:'projects',title:'Projects (sliding cards)',tk:'name',pub:1,fields:[T('name','Title',{r:1}),T('category','Category'),{k:'image_url',l:'Cover image or video',t:'media',folder:'projects',h:'Image (JPG, PNG, WebP, GIF) or video (MP4, WebM). Maximum 10 MB each. Videos play muted on a loop.'},T('url','Project link',{t:'url'}),B('tall','Phone-shaped card')]}]},
 designs:{title:'Designs and Gallery',blocks:[
  {kind:'single',table:'profile',title:'Section subtitle',fields:[T('designs_sub','Subtitle under “Designs”')]},
  {kind:'list',table:'designs',title:'Designs (each has its own story page)',tk:'name',pub:1,slug:1,fields:[
   T('name','Name',{r:1}),T('slug','Page address (slug)',{t:'slug',r:1,h:'lowercase-with-dashes, unique'}),T('kind','Type (Website, Mobile app…)'),A('summary','Short description',{r:1}),
   I('image_url','Cover image','designs'),T('role','My role'),T('year','Year'),T('tools','Tools'),T('live_url','Live website / app link',{t:'url',r:1}),T('live_label','Button text'),B('featured','Featured'),
   {k:'story',l:'Story chapters (text + optional image)',t:'rep',sub:[T('title','Chapter title',{r:1}),{k:'text',l:'Text (blank line = new paragraph)',t:'paras'},I('image','Chapter image','designs')]}]}]},
 about:{title:'About Me',blocks:[{kind:'single',table:'profile',title:'About section',fields:[T('about_tag','Badge text'),A('about_text','Biography'),{k:'about_list',l:'Highlights',t:'list',h:'One per line'},I('about_photo','About photo','profile')]}]},
 skills:{title:'Skills and Services',blocks:[
  {kind:'list',table:'roles',title:'Roles / services',tk:'title',pub:1,fields:[T('title','Role',{r:1}),T('description','Short description'),{k:'color',l:'Icon color',t:'color'},T('icon','Icon symbol')]},
  {kind:'list',table:'stats',title:'Statistics',tk:'label',fields:[T('value','Number (e.g. 50+)',{r:1}),T('label','Label')]},
  {kind:'list',table:'tools',title:'Tools (scrolling strip)',tk:'name',fields:[T('name','Tool name',{r:1})]}]},
 resume:{title:'Resume and Documents',blocks:[{kind:'single',table:'profile',title:'Resume',fields:[{k:'resume_url',l:'Resume file (PDF)',t:'file',folder:'resume',h:'The footer “Resume” link points here. Upload a new PDF to replace it.'}]},{kind:'media'}]},
 contact:{title:'Social Links and Contact',blocks:[
  {kind:'single',table:'profile',title:'Contact',fields:[T('email','Email',{r:1,t:'email'}),T('whatsapp','WhatsApp / chat link',{t:'url'}),T('social','Fallback social link',{t:'url'})]},
  {kind:'single',table:'site_settings',title:'Intro buttons (under the headline)',help:'The Email button uses your email above. Leave a link empty to hide that button.',fields:[T('labels.btn_email','Email button text',{h:'Default: Email me'}),T('labels.btn_linkedin','LinkedIn button text',{h:'Default: LinkedIn'}),T('labels.url_linkedin','LinkedIn profile URL',{t:'url',h:'https://www.linkedin.com/in/your-name'}),T('labels.btn_calendly','Calendly button text',{h:'Default: Book a call'}),T('labels.url_calendly','Calendly booking link',{t:'url',h:'https://calendly.com/your-name/30min'})]},
  {kind:'list',table:'social_links',title:'Social links (shown in footer)',tk:'label',fields:[T('label','Name (LinkedIn, X, GitHub…)',{r:1}),T('url','URL',{t:'url',r:1})]}]},
 appearance:{title:'Website Appearance',blocks:[
  {kind:'single',table:'site_settings',title:'Colors',theme:1,fields:[['hero-dark','Hero / dark sections'],['hero-light','Hero glow and button hover'],['surface','Light section background'],['surface-2','Light section gradient end'],['surface-strong','Hero floating words'],['surface-light','Designs section background'],['ink','Headings and buttons'],['text','Body text'],['accent','Accent'],['accent-bright','Accent (on dark)'],['highlight','Highlight (strip dots, focus)']].map(([k,l])=>({k:'theme.'+k,l,t:'color'}))},
  {kind:'single',table:'site_settings',title:'Labels and headings',fields:[T('labels.nav_work','Nav: Work'),T('labels.nav_designs','Nav: Designs'),T('labels.nav_about','Nav: About'),T('labels.nav_cta','Nav: contact button'),T('labels.work_title','Heading: Selected work'),T('labels.designs_title','Heading: Designs'),T('labels.about_title','Heading: About me'),T('labels.contact_btn','Contact button label'),T('labels.quote_btn','Quote button label'),T('labels.copyright','Footer / copyright text')]}]},
 sections:{title:'Navigation and Sections',blocks:[{kind:'single',table:'site_settings',title:'Show or hide sections',help:'Section order is fixed by the design. Hidden sections also disappear from the navigation.',fields:['intro','roles','stats','work','designs','about','contact'].map(k=>B('sections.'+k,{intro:'Intro',roles:'Roles',stats:'Statistics + tools strip',work:'Selected work',designs:'Designs',about:'About',contact:'Contact'}[k],{d:1}))}]},
 seo:{title:'SEO and Metadata',blocks:[{kind:'single',table:'site_settings',title:'Search and sharing',help:'Applied when the page loads in a browser.',fields:[T('seo.title','Page title'),A('seo.description','Description'),I('seo.og_image','Social sharing image','seo')]}]},
 settings:{title:'Settings',custom:settings}
};
const ORDER=Object.keys(SECTIONS);

/* ---------- FORM ENGINE ---------- */
const reps={};
function ctl(f,v){
 const id='f_'+f.k.replace(/\W/g,'_'),lab=`<label for="${id}">${f.l}${f.r?' *':''}</label>`,hint=f.h?`<small>${f.h}</small>`:'';let c;
 switch(f.t){
 case 'bool':return `<div class="fld" data-f="${f.k}"><label class="chk"><input type="checkbox" ${(f.d?v!==false:!!v)?'checked':''}> ${f.l}</label><em class="err"></em></div>`;
 case 'area':c=`<textarea id="${id}" rows="3">${esc(v)}</textarea>`;break;
 case 'list':c=`<textarea id="${id}" rows="4">${esc((v||[]).join('\n'))}</textarea>`;break;
 case 'paras':c=`<textarea id="${id}" rows="5">${esc([].concat(v||[]).join('\n\n'))}</textarea>`;break;
 case 'color':{const d=v||(f.k.startsWith('theme.')?getComputedStyle(document.documentElement).getPropertyValue('--'+f.k.slice(6)).trim():'')||'#5aa2ff';c=`<input id="${id}" type="color" value="${esc(d)}">`;break}
 case 'img':case 'file':c=`<div class="img" data-folder="${f.folder||'misc'}" data-kind="${f.t}">${f.t==='img'?`<img alt="" ${v?`src="${esc(abs(v))}"`:''}>`:`<a ${v?`href="${esc(abs(v))}"`:''} target="_blank">${v?'Current file':'No file yet'}</a>`}<input type="hidden" value="${esc(v)}"><input type="file" accept="${f.t==='img'?'image/jpeg,image/png,image/webp,image/gif':'application/pdf'}"><button type="button" class="ic" data-clear>Remove</button><span class="st"></span></div>`;break;
 case 'media':{const vid=isVid(v);c=`<div class="img" data-folder="${f.folder||'misc'}" data-kind="media"><img alt="" ${v&&!vid?`src="${esc(abs(v))}"`:'hidden'}><video muted controls preload="metadata" style="width:170px;height:96px;border-radius:8px;background:#000" ${v&&vid?`src="${esc(abs(v))}"`:'hidden'}></video><input type="hidden" value="${esc(v)}"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"><button type="button" class="ic" data-clear>Remove</button><span class="st"></span></div>`;break}
 case 'rep':reps[f.k]=f;c=`<div class="rep">${(v||[]).map(x=>repi(f,x)).join('')}</div><button type="button" class="btn" data-addrep>+ Add chapter</button>`;break;
 default:c=`<input id="${id}" type="${f.t==='email'?'email':'text'}" value="${esc(v)}">`}
 return `<div class="fld" data-f="${f.k}">${lab}${c}${hint}<em class="err"></em></div>`}
const repi=(f,x)=>`<div class="repi">${f.sub.map(s=>ctl(s,x[s.k])).join('')}<div class="bar"><button type="button" class="ic" data-mv="-1">↑</button><button type="button" class="ic" data-mv="1">↓</button><button type="button" class="ic danger" data-rm>Remove chapter</button></div></div>`;
const form=(fs,row)=>`<div class="grid">${fs.map(f=>ctl(f,get(row,f.k))).join('')}</div>`;
function val(w,f){const q=s=>$(s,w);switch(f.t){
 case 'bool':return q('input').checked;
 case 'list':return q('textarea').value.split('\n').map(s=>s.trim()).filter(Boolean);
 case 'paras':return q('textarea').value.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
 case 'img':case 'file':case 'media':return q('input[type=hidden]').value;
 case 'rep':return $$(':scope > .rep > .repi',w).map(i=>read(i,f.sub));
 default:return q('input,textarea').value.trim()}}
const fld=(root,k)=>$$(':scope > .fld, :scope > .grid > .fld',root).find(e=>e.dataset.f===k)||null;
function read(root,fs){const o={};fs.forEach(f=>{const w=fld(root,f.k);if(w)o[f.k]=val(w,f)});return o}
function check(root,fs,vals){let ok=true;fs.forEach(f=>{const w=fld(root,f.k);if(!w)return;const v=vals[f.k];let m='';
 if(f.r&&(Array.isArray(v)?!v.length:v===''||v==null))m='Required';
 else if(f.n&&v.length!==f.n)m=`Needs exactly ${f.n} lines`;
 else if(f.t==='slug'&&!/^[a-z0-9-]+$/.test(v))m='Lowercase letters, numbers and dashes only';
 else if(f.t==='url'&&v&&!/^(https?:\/\/|mailto:|#|public\/|\/)/.test(v))m='Must start with https://, mailto: or #';
 else if(f.t==='email'&&v&&!/^\S+@\S+\.\S+$/.test(v))m='Enter a valid email';
 const e=$(':scope > .err',w);if(e)e.textContent=m;if(m)ok=false;
 if(f.t==='rep')$$(':scope > .rep > .repi',w).forEach((it,i)=>{if(!check(it,f.sub,v[i]))ok=false})});return ok}
function patchOf(vals,row){const p={};for(const k in vals){if(k.includes('.')){const[c,s]=k.split('.');p[c]=p[c]||{...(row[c]||{})};p[c][s]=vals[k]}else p[k]=vals[k]}return p}

/* ---------- BLOCKS ---------- */
async function single(b,host){
 const {data,error}=await sb.from(b.table).select('*').eq('id',1).maybeSingle();
 if(error){host.append(html(`<div class="errbox">Could not load ${b.table}: ${esc(error.message)}</div>`));return}
 let row=data||{};
 const card=html(`<section class="card"><h3>${b.title}</h3>${b.help?`<p>${b.help}</p>`:''}${form(b.fields,row)}<div class="bar"><button class="btn primary" data-save>Save &amp; publish</button><span class="st"></span></div></section>`);
 host.append(card);
 if(b.theme){const pv=html('<div class="prev"><div class="h">Hero preview</div><div class="s"><span>Button</span> <em>Accent text</em></div></div>');card.append(pv);
  const paint=()=>b.fields.forEach(f=>pv.style.setProperty('--'+f.k.split('.')[1],val(fld(card,f.k),f)));paint();card.addEventListener('input',paint)}
 $('[data-save]',card).onclick=async e=>{const vals=read(card,b.fields);
  if(!check(card,b.fields,vals))return toast('Please fix the highlighted fields','err');
  e.target.disabled=true;const r=await sb.from(b.table).upsert({id:1,...patchOf(vals,row)}).select().single();e.target.disabled=false;
  if(r.error||!r.data)return toast('NOT saved: '+(r.error?.message||'the database rejected the change'),'err');
  row=r.data;dirty=false;toast('Saved and published')}}

async function list(b,host){
 const card=html(`<section class="card"><div class="bar"><h3>${b.title}</h3><span class="sp"></span><button class="btn" data-add>+ Add</button></div><div class="items"></div></section>`);host.append(card);
 const box=$('.items',card);let rows=[];
 async function load(){const {data,error}=await sb.from(b.table).select('*').order('sort_order');
  if(error){box.innerHTML=`<div class="errbox">Could not load: ${esc(error.message)}</div>`;return}
  rows=data;box.innerHTML='';if(!rows.length)box.innerHTML='<div class="empty">Nothing here yet. Click “Add”.</div>';rows.forEach((r,i)=>box.append(item(r,i)))}
 function item(r,i,open){
  const el=html(`<div class="item"><div class="ih"><strong>${esc(r[b.tk]||'New item')}</strong>${b.pub?`<span class="tag ${r.published?'live':''}">${r.published?'Published':'Draft'}</span>`:''}<span class="sp"></span><button class="ic" data-a="edit">Edit</button>${r.id?`<button class="ic" data-a="up">↑</button><button class="ic" data-a="down">↓</button><button class="ic" data-a="dup">Duplicate</button>${b.pub?`<button class="ic" data-a="pub">${r.published?'Unpublish':'Publish'}</button>`:''}<button class="ic danger" data-a="del">Delete</button>`:''}</div><div class="ib" hidden>${form(b.fields,r)}<div class="bar"><button class="btn primary" data-a="save">${b.pub&&!r.published?'Save draft':'Save changes'}</button>${b.pub&&!r.published?'<button class="btn" data-a="savepub">Save &amp; publish</button>':''}</div></div></div>`);
  const body=$('.ib',el);if(open)body.hidden=false;
  el.addEventListener('click',async ev=>{const a=ev.target.dataset.a;if(!a)return;
   if(a==='edit')body.hidden=!body.hidden;
   if(a==='save'||a==='savepub'){const vals=read(body,b.fields);if(!check(body,b.fields,vals))return toast('Please fix the highlighted fields','err');
    const row={...vals};if(a==='savepub')row.published=true;if(!r.id){row.sort_order=rows.reduce((m,x)=>Math.max(m,x.sort_order),-1)+1;if(b.pub&&!row.published)row.published=false}
    ev.target.disabled=true;const q=r.id?sb.from(b.table).update(row).eq('id',r.id):sb.from(b.table).insert(row);const res=await q.select().single();ev.target.disabled=false;
    if(res.error||!res.data)return toast('NOT saved: '+(res.error?.message||'the database rejected the change'),'err');
    dirty=false;toast(a==='savepub'||res.data.published?'Saved and published':'Draft saved');load()}
   if(a==='pub'){const res=await sb.from(b.table).update({published:!r.published}).eq('id',r.id).select().single();if(res.error||!res.data)return toast('Not changed: '+(res.error?.message||'rejected'),'err');toast(res.data.published?'Published':'Unpublished');load()}
   if(a==='del'){if(!await ask(`Delete “${r[b.tk]}”? This cannot be undone.`))return;const res=await sb.from(b.table).delete().eq('id',r.id).select();
    if(res.error||!res.data?.length)return toast('Not deleted: '+(res.error?.message||'rejected'),'err');toast('Deleted');load()}
   if(a==='dup'){const c={...r};delete c.id;delete c.updated_at;c.sort_order=rows.length;if('published' in c)c.published=false;if(c.slug)c.slug+='-copy-'+Math.random().toString(36).slice(2,5);if(c[b.tk])c[b.tk]+=' (copy)';
    const res=await sb.from(b.table).insert(c).select().single();if(res.error)return toast('Not duplicated: '+res.error.message,'err');toast('Duplicated as a draft');load()}
   if(a==='up'||a==='down'){const j=i+(a==='up'?-1:1);if(j<0||j>=rows.length)return;const m=rows.slice();[m[i],m[j]]=[m[j],m[i]];
    const res=await Promise.all(m.map((x,n)=>x.sort_order===n?null:sb.from(b.table).update({sort_order:n}).eq('id',x.id).select().single()));
    if(res.some(x=>x&&x.error))return toast('Could not reorder','err');load()}});
  return el}
 $('[data-add]',card).onclick=()=>{$('.empty',box)?.remove();box.prepend(item({},-1,true))};
 await load()}

async function media(b,host){
 const card=html('<section class="card"><h3>Media library</h3><p>Everything you uploaded. Delete only files no page uses any more.</p><div class="media"></div></section>');host.append(card);
 for(const f of['profile','projects','designs','resume','seo','misc']){const {data}=await sb.storage.from('media').list(f,{limit:100});
  (data||[]).filter(o=>o.name&&o.id!==null).forEach(o=>{const p=`${f}/${o.name}`,u=sb.storage.from('media').getPublicUrl(p).data.publicUrl;
   const d=html(`<div>${/\.pdf$/i.test(o.name)?'📄':isVid(o.name)?'🎬':`<img src="${esc(u)}" alt="">`}<br>${esc(o.name)}<br><button class="ic danger">Delete</button></div>`);
   $('button',d).onclick=async()=>{if(!await ask(`Delete ${o.name}?`))return;const r=await sb.storage.from('media').remove([p]);r.error?toast(r.error.message,'err'):(d.remove(),toast('Deleted'))};$('.media',card).append(d)})}}

/* uploads, repeaters, clear buttons, dirty tracking (event delegation) */
function wire(main){
 main.addEventListener('input',()=>dirty=true);
 main.addEventListener('change',async e=>{const inp=e.target;if(inp.type!=='file'||!inp.files[0])return;const box=inp.closest('.img'),f=inp.files[0],st=$('.st',box);
  const kd=box.dataset.kind,okT=kd==='file'?f.type==='application/pdf':/^image\/(jpeg|png|webp|gif)$/.test(f.type)||(kd==='media'&&/^video\/(mp4|webm)$/.test(f.type));
  if(!okT){inp.value='';return toast(kd==='media'?'Use a JPG, PNG, WebP or GIF image, or an MP4 / WebM video':kd==='file'?'Please choose a PDF file':'Please choose a JPG, PNG, WebP or GIF image','err')}
  const vidf=f.type.startsWith('video/'),lim=10;if(f.size>lim*1048576){inp.value='';return toast(`This file is over ${lim} MB. Images, videos and PDFs are limited to ${lim} MB. Please compress it and try again.`,'err')}
  const path=`${box.dataset.folder}/${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-')}`;st.textContent=vidf?'Uploading video… this can take a minute':'Uploading…';
  const {error}=await sb.storage.from('media').upload(path,f,{contentType:f.type,upsert:false});
  if(error){st.textContent='';return toast('Upload failed: '+error.message,'err')}
  const url=sb.storage.from('media').getPublicUrl(path).data.publicUrl;$('input[type=hidden]',box).value=url;
  if(box.dataset.kind==='img')$('img',box).src=url;else if(box.dataset.kind==='media'){const im=$('img',box),vd=$('video',box);im.hidden=vidf;vd.hidden=!vidf;(vidf?vd:im).src=url}else{const a=$('a',box);a.href=url;a.textContent='New file (not saved yet)'}
  st.textContent='Uploaded. Click Save to publish it.';dirty=true});
 main.addEventListener('click',e=>{const t=e.target;
  if(t.dataset.clear!==undefined){const b=t.closest('.img');$('input[type=hidden]',b).value='';const im=$('img',b);if(im)im.removeAttribute('src');const vd=$('video',b);if(vd)vd.removeAttribute('src');dirty=true}
  if(t.dataset.addrep!==undefined){const f=reps[t.closest('.fld').dataset.f];$('.rep',t.closest('.fld')).append(html(repi(f,{})));dirty=true}
  if(t.dataset.rm!==undefined){t.closest('.repi').remove();dirty=true}
  if(t.dataset.mv){const r=t.closest('.repi'),s=t.dataset.mv==='-1'?r.previousElementSibling:r.nextElementSibling;if(s)t.dataset.mv==='-1'?s.before(r):s.after(r);dirty=true}})}

/* ---------- CUSTOM VIEWS ---------- */
async function overview(host){
 const cnt=async(t,pub)=>{let q=sb.from(t).select('id',{count:'exact',head:true});if(pub)q=q.eq('published',true);const {count}=await q;return count??0};
 const [p,pp,d,dp,r]=await Promise.all([cnt('projects'),cnt('projects',1),cnt('designs'),cnt('designs',1),cnt('roles')]);
 const {data:s}=await sb.from('site_settings').select('seeded').eq('id',1).maybeSingle();
 host.append(html(`<section class="card"><div class="stats"><div><b>${pp}/${p}</b>projects published</div><div><b>${dp}/${d}</b>designs published</div><div><b>${r}</b>roles</div></div><div class="bar"><a class="btn primary" href="../" target="_blank">Preview website ↗</a></div></section>`));
 if(!s?.seeded)host.append(html('<section class="card"><h3>First step: import your existing content</h3><p>The database is empty, so your public site still shows the built-in content. Open <b>Settings</b> and click “Import starter content” once. Nothing on your site disappears.</p><a class="btn primary" href="#settings">Go to Settings</a></section>'))}
async function settings(host){
 host.append(html(`<section class="card"><h3>Account</h3><p>Signed in as <b>${esc(me.email)}</b>. Only accounts listed in the <code>admins</code> table can change content.</p></section>`));
 const c=html('<section class="card"><h3>Import starter content</h3><p>Copies everything from <code>src/data/portfolio.js</code> (your current site) into the database. Run this once. Running it again <b>replaces</b> all stored content.</p><div class="bar"><button class="btn primary">Import starter content</button></div></section>');host.append(c);
 $('button',c).onclick=importSeed}
async function importSeed(){
 const P=window.PORTFOLIO;if(!P)return toast('src/data/portfolio.js not found','err');
 if(!await ask('Import starter content? This REPLACES everything currently stored in the database.'))return;
 const run=async(l,p)=>{const {error}=await p;if(error)throw new Error(l+': '+error.message)},nil='00000000-0000-0000-0000-000000000000';
 try{
  await run('profile',sb.from('profile').upsert({id:1,name:P.name,logo:P.logo,badge_role:P.badgeRole,signature:P.signature,email:P.email,whatsapp:P.whatsapp,social:P.social,resume_url:P.resume,profile_photo:P.profilePhoto,intro_photo:P.introPhoto,intro_shot:P.introShot,about_photo:P.aboutPhoto,badge_mini:P.badgeMini,badge_avail:P.badgeAvail,badge_id:P.badgeId,handle:P.handle,badge_tag:P.badgeTag,corners:P.corners,typed_hero:P.typedHero,intro_heading:P.introHeading,intro_text:P.introText,work_sub:P.workSub,designs_sub:P.designsSub,about_tag:P.aboutTag,about_text:P.aboutText,about_list:P.aboutList,cta:P.cta}));
  for(const t of['roles','stats','tools','projects','designs','social_links'])await run('clear '+t,sb.from(t).delete().neq('id',nil));
  await run('roles',sb.from('roles').insert(P.roles.map((r,i)=>({sort_order:i,title:r.t,description:r.d,color:r.c,icon:r.i,published:true}))));
  await run('stats',sb.from('stats').insert(P.stats.map((s,i)=>({sort_order:i,value:s[0],label:s[1]}))));
  await run('tools',sb.from('tools').insert(P.tools.map((n,i)=>({sort_order:i,name:n}))));
  await run('projects',sb.from('projects').insert(P.projects.map((x,i)=>({sort_order:i,name:x.n,category:x.k,image_url:x.img||'',url:x.url||'#',tall:!!x.tall,published:true}))));
  await run('designs',sb.from('designs').insert(P.designs.map((x,i)=>({sort_order:i,slug:x.slug,name:x.name,kind:x.kind,summary:x.summary,image_url:x.image||'',role:x.role,year:x.year,tools:x.tools,live_url:x.liveUrl,live_label:x.liveLabel||'View live website',story:x.story||[],published:true}))));
  if(P.social&&P.social!=='#')await run('social',sb.from('social_links').insert({sort_order:0,label:'Social',url:P.social}));
  await run('settings',sb.from('site_settings').upsert({id:1,seeded:true}));
  toast('Imported. Your public site now reads from the database.');go()
 }catch(e){toast('Import stopped: '+e.message,'err')}}

/* ---------- SHELL ---------- */
async function go(){
 const k=location.hash.slice(1)||'overview',S=SECTIONS[ORDER.includes(k)?k:'overview'];
 $$('aside a[data-k]').forEach(a=>a.classList.toggle('on',a.dataset.k===k));$('aside').classList.remove('open');
 const main=$('main');main.innerHTML=`<h2>${S.title}</h2>`;dirty=false;
 if(S.custom)return S.custom(main);
 for(const b of S.blocks)await({single,list,media}[b.kind])(b,main)}
function shell(){
 app.innerHTML=`<div class="shell"><aside><b>Portfolio admin</b>${ORDER.map(k=>`<a data-k="${k}" href="#${k}">${SECTIONS[k].title}</a>`).join('')}<a id="out">Logout</a></aside><div><div class="top"><button class="btn" id="menu">☰</button><span class="sp"></span><small>${esc(me.email)}</small><a class="btn" href="../" target="_blank">Preview website ↗</a></div><main></main></div></div>`;
 $('#menu').onclick=()=>$('aside').classList.toggle('open');
 $('#out').onclick=async()=>{if(dirty&&!await ask('You have unsaved changes. Log out anyway?'))return;await sb.auth.signOut();boot()};
 $$('aside a[data-k]').forEach(a=>a.onclick=async e=>{if(dirty){e.preventDefault();if(!await ask('Discard unsaved changes?'))return;dirty=false;location.hash=a.dataset.k}});
 wire($('main'));addEventListener('hashchange',go);go()}
function login(msg){
 app.innerHTML=`<form class="login"><h1>Admin sign in</h1><p>Private area.</p><div class="grid"><div class="fld"><label>Email</label><input type="email" required autocomplete="username"></div><div class="fld"><label>Password</label><input type="password" required autocomplete="current-password"></div></div><em class="err" id="le">${esc(msg||'')}</em><div class="bar"><button class="btn primary">Sign in</button></div></form>`;
 $('form').onsubmit=async e=>{e.preventDefault();const [em,pw]=$$('input');const {error}=await sb.auth.signInWithPassword({email:em.value,password:pw.value});if(error)return $('#le').textContent=error.message;boot()}}
async function boot(){
 const {data:{session}}=await sb.auth.getSession();if(!session)return login();me=session.user;
 const {data,error}=await sb.from('admins').select('user_id').eq('user_id',me.id).maybeSingle();
 if(error||!data){await sb.auth.signOut();return login('This account is not an authorized administrator.')}shell()}
addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
if(!C.url||!C.anonKey)app.innerHTML='<div class="login"><h1>Not connected yet</h1><p>Open <code>src/config.js</code> and paste your Supabase URL and anon key. See <code>docs/CMS-SETUP.md</code>.</p></div>';
else if(!window.supabase)app.innerHTML='<div class="login"><h1>Cannot load the Supabase library</h1><p>Check your internet connection and reload.</p></div>';
else{sb=window.supabase.createClient(C.url,C.anonKey);boot()}
})();

/* Builds a design's story page (design.html?d=<slug>) from src/data/portfolio.js. No edits needed here. */
(function(){
const P=window.PORTFOLIO,$=s=>document.querySelector(s);
$('.logo').textContent=P.logo;
const slug=new URLSearchParams(location.search).get('d');
const i=P.designs.findIndex(x=>x.slug===slug),d=P.designs[i],root=$('#design');
if(!d){root.innerHTML='<div class="sub-wrap sub-head"><h1>Design not found</h1><p class="lead">Check that the link matches a "slug" in src/data/portfolio.js.</p><a class="b fill" href="index.html#designs">Back to designs</a></div>';return}
const pic=(src,cls)=>src?`<figure class="${cls} ph"><img src="${src}" alt="" onerror="this.remove()"></figure>`:'';
const label=d.liveLabel||'View live website',next=P.designs[(i+1)%P.designs.length];
document.title=d.name+' – '+P.name;
const live=(c)=>`<a class="b fill ${c||''}" href="${d.liveUrl}" target="_blank" rel="noopener">${label} \u2197</a>`;
root.innerHTML=`
<header class="sub-wrap sub-head"><a class="backlink" href="index.html#designs">All designs</a>
<h1 class="rv">${d.name}</h1><p class="lead rv">${d.summary}</p>
<dl class="facts rv"><div><dt>Type</dt><dd>${d.kind}</dd></div><div><dt>Role</dt><dd>${d.role}</dd></div><div><dt>Year</dt><dd>${d.year}</dd></div><div><dt>Tools</dt><dd>${d.tools}</dd></div></dl>${live()}</header>
<div class="sub-wrap">${pic(d.image,'dhero rv')}</div>
<div class="sub-wrap story">${d.story.map((s,n)=>`<section class="chap rv ${n%2?'flip':''}"><div><h2>${s.title}</h2>${[].concat(s.text).map(t=>`<p>${t}</p>`).join('')}</div>${pic(s.image,'cimg')}</section>`).join('')}</div>
<section class="sub-wrap live rv"><h2>See it live</h2>${live('big')}</section>
<a class="next sub-wrap" href="design.html?d=${encodeURIComponent(next.slug)}"><span>Next design</span><h3>${next.name}</h3></a>`;
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.15});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
})();

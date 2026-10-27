/* Production build: validates your content, checks images, copies the site to dist/.
   Run:  node build.js   (or  npm run build) */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=__dirname,dist=path.join(root,'dist'),errs=[],warns=[];
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['src/data/portfolio.js','src/main.js','src/design.js']){
  try{new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f})}catch(e){errs.push(`Syntax error in ${f}: ${e.message}`)}}
try{vm.runInContext(fs.readFileSync(path.join(root,'src/data/portfolio.js'),'utf8'),ctx)}catch(e){errs.push('portfolio.js cannot run: '+e.message)}
const P=ctx.window.PORTFOLIO;
if(!P)errs.push('window.PORTFOLIO is missing');
else{
  ['name','logo','email','introHeading','cta'].forEach(k=>P[k]||errs.push(`Missing "${k}" in portfolio.js`));
  const seen=new Set();
  (P.designs||[]).forEach((d,i)=>{const w=`designs[${i}] "${d.name||'?'}"`;
    if(!/^[a-z0-9-]+$/.test(d.slug||''))errs.push(`${w}: slug must be lowercase letters, numbers and dashes`);
    if(seen.has(d.slug))errs.push(`${w}: duplicate slug "${d.slug}"`);seen.add(d.slug);
    ['name','summary','kind','liveUrl'].forEach(k=>d[k]||errs.push(`${w}: missing "${k}"`));
    if(!Array.isArray(d.story)||!d.story.length)errs.push(`${w}: needs at least one story chapter`);});
  const imgs=[];(function walk(o){if(typeof o==='string'){if(/^public\/.+\.(jpe?g|png|webp|svg|gif|pdf)$/i.test(o))imgs.push(o)}else if(o&&typeof o==='object')Object.values(o).forEach(walk)})(P);
  imgs.filter(f=>!fs.existsSync(path.join(root,f))).forEach(f=>warns.push('File not found (placeholder will show): '+f));
}
if(errs.length){console.error('\nBUILD FAILED\n - '+errs.join('\n - '));process.exit(1)}
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
['index.html','design.html','src','public'].forEach(p=>fs.cpSync(path.join(root,p),path.join(dist,p),{recursive:true}));
console.log(`Build OK: ${(P.designs||[]).length} designs, ${(P.projects||[]).length} projects -> dist/`);
if(warns.length)console.log(`\n${warns.length} image warning(s):\n - `+warns.join('\n - '));

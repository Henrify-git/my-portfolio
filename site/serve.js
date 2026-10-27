/* Tiny local web server, no installs needed.  node serve.js  ->  http://localhost:3000  (add "dist" to serve the built copy) */
const http=require('http'),fs=require('fs'),path=require('path');
const dir=path.resolve(__dirname,process.argv[2]||'.'),T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf'};
http.createServer((q,r)=>{let p=path.join(dir,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith(path.sep)||!path.extname(p))p=path.join(p,'index.html');
fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);return r.end('Not found')}r.writeHead(200,{'Content-Type':T[path.extname(p)]||'application/octet-stream'});r.end(d)})}).listen(3000,()=>console.log('Open http://localhost:3000'));

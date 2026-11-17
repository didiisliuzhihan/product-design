import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const {basePath}=JSON.parse(await readFile(path.join(root,'deployment.json'),'utf8'));
const portFlag=process.argv.indexOf('--port');
const port=portFlag<0?4173:Number(process.argv[portFlag+1]);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid preview port');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(basePath!=='/'&&(pathname==='/'||pathname===basePath.slice(0,-1))){res.writeHead(302,{Location:basePath});res.end();return;}
    if(!pathname.startsWith(basePath)){res.writeHead(404);res.end('Not found');return;}
    let local=pathname.slice(basePath.length);
    if(!local||local.endsWith('/'))local+='index.html';
    const target=path.resolve(root,local);
    if(!target.startsWith(root)){res.writeHead(403);res.end();return;}
    if(!(await stat(target)).isFile())throw new Error('Not a file');
    const body=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`CarePath preview: http://127.0.0.1:${port}${basePath}`));

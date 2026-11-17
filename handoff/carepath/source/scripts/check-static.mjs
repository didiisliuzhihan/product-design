import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const {basePath}=JSON.parse(await readFile(path.join(dist,'deployment.json'),'utf8'));
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else files.push(file);}}
await walk(dist);
const failures=[];
async function reference(ref,from){
  if(!ref||/^(?:https?:|data:|blob:|#|mailto:|tel:)/.test(ref))return;
  const clean=decodeURIComponent(ref.split(/[?#]/)[0]);
  let target;
  if(clean.startsWith('/')){
    if(!clean.startsWith(basePath)){failures.push(`${path.relative(dist,from)}: escapes base path: ${ref}`);return;}
    target=path.join(dist,clean.slice(basePath.length));
  }else target=path.resolve(path.dirname(from),clean);
  try{assert((await stat(target)).isFile());}catch{failures.push(`${path.relative(dist,from)}: missing ${ref}`);}
}
for(const file of files){
  const extension=path.extname(file);
  if(extension==='.html'){
    const text=await readFile(file,'utf8');
    for(const m of text.matchAll(/(?:src|href)=["']([^"']+)["']/g))await reference(m[1],file);
  }
  if(extension==='.css'){
    const text=await readFile(file,'utf8');
    for(const m of text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g))await reference(m[1],file);
  }
}
for(const stage of ['authorize','assist','revoked'])for(const lang of ['en','zh'])await reference(`assets/care-story-${stage}-${lang}.webp`,path.join(dist,'index.html'));
for(const name of ['carepath-context.webp','flow-home.jpg','flow-choose.jpg','flow-understand.jpg','flow-help.jpg','iphone/Bezel.png','iphone/Keyboard.png','android/Pixel10.png','android/Keyboard.png','android/navigation-bar.svg'])await reference(basePath+'assets/'+name,path.join(dist,'index.html'));
for(const file of files.filter(x=>x.includes(path.sep+'mobile'+path.sep+'assets'+path.sep)&&x.endsWith('.js'))){
  const text=await readFile(file,'utf8');
  if(basePath!=='/'&&/(["'`])\/assets\//.test(text))failures.push('Mobile bundle still references root /assets/');
  for(const m of text.matchAll(/(?:["'`])(\/[a-zA-Z0-9_./-]+\.(?:png|svg|webp|jpg|woff2?))(?:["'`])/g))await reference(m[1],file);
}
assert.equal(failures.length,0,failures.join('\n'));
console.log(`Static checks passed: ${files.length} files, base ${basePath}`);

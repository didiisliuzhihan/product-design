import {execFileSync} from 'node:child_process';
import {cp,rm,readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const config=JSON.parse(await readFile(path.join(root,'deployment.config.json'),'utf8'));
const baseIndex=process.argv.indexOf('--base');
const base=baseIndex<0?config.basePath:process.argv[baseIndex+1];
if(typeof base!=='string'||!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))throw new Error('Base must be / or a slash-delimited path such as /carepath/');
const dist=path.join(root,'dist');
execFileSync('npm',['run','build'],{cwd:path.join(root,'mobile-app'),stdio:'inherit'});
await rm(dist,{recursive:true,force:true});
await cp(path.join(root,'site'),dist,{recursive:true});
await cp(path.join(root,'mobile-app/dist/client'),path.join(dist,'mobile'),{recursive:true});
await cp(path.join(root,'mobile-app/public/assets'),path.join(dist,'assets'),{recursive:true});
const entry=path.join(dist,'mobile/index.html');
const html=await readFile(entry,'utf8');
await writeFile(entry,html.replaceAll('="/assets/','="'+base+'mobile/assets/'));
// Scope runtime URLs in generated output only. Protected runtime source stays intact.
for(const name of await readdir(path.join(dist,'mobile/assets'))){
  if(name.endsWith('.css')){
    const target=path.join(dist,'mobile/assets',name);
    const css=await readFile(target,'utf8');
    await writeFile(target,css.replace(/url\((['"]?)\/assets\//g,(_,quote)=>'url('+quote+base+'mobile/assets/'));
    continue;
  }
  if(!name.endsWith('.js'))continue;
  const target=path.join(dist,'mobile/assets',name);
  const js=await readFile(target,'utf8');
  await writeFile(target,js.replace(/(["'`])\/assets\//g,(_,quote)=>quote+base+'assets/'));
}
await writeFile(path.join(dist,'deployment.json'),JSON.stringify({basePath:base},null,2)+'\n');
console.log('Built portable CarePath output for '+base);

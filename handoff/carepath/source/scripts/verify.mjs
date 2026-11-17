import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
execFileSync(process.execPath,['scripts/check-static.mjs'],{cwd:root,stdio:'inherit'});
execFileSync('npm',['run','check:runtime'],{cwd:root+'mobile-app',stdio:'inherit'});
execFileSync('npm',['run','test:sites'],{cwd:root+'mobile-app',stdio:'inherit'});

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const paths=['','en/','support/','en/support/','privacy/','en/privacy/'];
const host=process.argv[2]||'http://127.0.0.1:8766/Voxamber-Website/';
const rows=[];
for(const path of paths){const response=await fetch(host+path);const text=await response.text();const title=text.match(/<title>([^<]+)<\/title>/)?.[1];if(response.status!==200||!title||!text.includes('<main')||!text.includes('rel="canonical"'))throw Error('Invalid page: '+path);if(text.includes('apps.apple.com')||text.includes('support@example')||text.includes('testflight.apple.com/join'))throw Error('Unverified availability or placeholder link: '+path);rows.push({path,status:response.status,title});}
const record={checkedAt:new Date().toISOString(),baseURL:host,pages:rows};
await writeFile(resolve(root,'.qa',host.startsWith('https:')?'live-http.json':'local-http.json'),JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(record));

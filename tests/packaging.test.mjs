import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {join,resolve,dirname,relative,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const load=async p=>JSON.parse(await readFile(join(root,p),'utf8'));
test('source manifests and marketplace catalogs agree on name, version and license',async()=>{
 const pkg=await load('package.json'),claude=await load('packaging/claude/plugin.json'),codex=await load('packaging/codex/plugin.json');
 for(const m of [claude,codex]) {assert.equal(m.name,pkg.name);assert.equal(m.version,pkg.version);assert.equal(m.license,'Apache-2.0');}
 const cm=await load('.claude-plugin/marketplace.json'),dm=await load('.agents/plugins/marketplace.json');
 assert.equal(cm.name,dm.name);assert.equal(cm.plugins[0].name,pkg.name);assert.equal(dm.plugins[0].name,pkg.name);
 assert.equal(cm.plugins[0].source,'./plugins/vibe2spec');assert.equal(dm.plugins[0].source.path,'./plugins/vibe2spec');assert.equal(cm.plugins[0].version,pkg.version);
 assert(codex.interface.shortDescription.length<=30);assert.equal(codex.interface.capabilities.length,0);
});
test('assembled package contains identical runtime source and no author-only dependencies',async()=>{
 const output=join(root,'plugins/vibe2spec');
 for(const name of await readdir(join(root,'scripts'))) if(name.endsWith('.mjs')&&!['package.mjs','host-smoke.mjs'].includes(name)) assert.deepEqual(await readFile(join(output,'scripts',name)),await readFile(join(root,'scripts',name)),name);
 for(const name of ['vibe2spec','vibe2spec-worker','vibe2spec-review']) {
  const file=join(output,'skills',name,'SKILL.md'),text=await readFile(file,'utf8');
  assert.deepEqual(await readFile(file),await readFile(join(root,'skills',name,'SKILL.md')));
  assert(!text.includes('/Users/'));assert(!text.includes('node_modules'));
  for(const match of text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) if(!/^[a-z]+:/.test(match[1])) assert((await stat(resolve(dirname(file),match[1]))).isFile()||(await stat(resolve(dirname(file),match[1]))).isDirectory());
 }
 const p=await load('plugins/vibe2spec/plugin.json');assert.equal(p.$schema,'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
 for(const key of ['composerIcon','logo']) assert((await stat(resolve(output,p.extensions['com.openai'].interface[key]))).isFile());
 const names=await readdir(output);assert(!names.includes('openspec'));assert(!names.includes('node_modules'));assert(!names.includes('.git'));
});
test('every installed Markdown link resolves locally or names an external resource',async()=>{
 const output=join(root,'plugins/vibe2spec');
 const pending=[output];
 let checked=0;
 while(pending.length){
  const directory=pending.pop();
  for(const entry of await readdir(directory,{withFileTypes:true})){
   const file=join(directory,entry.name);
   if(entry.isDirectory()){pending.push(file);continue;}
   if(!entry.name.endsWith('.md'))continue;
   const content=await readFile(file,'utf8');
   for(const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    const target=match[1];
    if(/^[a-z]+:|^#/i.test(target))continue;
    const destination=resolve(dirname(file),target.split('#')[0]);
    const local=relative(output,destination);
    assert(local!=='..'&&!local.startsWith(`..${sep}`),`${relative(output,file)}: ${target} leaves the package`);
    const info=await stat(destination);
    assert(info.isFile()||info.isDirectory(),`${relative(output,file)}: ${target} is not a packaged resource`);
    checked++;
   }
  }
 }
 assert(checked>=30,'the closure check must inspect linked resources throughout the package');
 const contract=await readFile(join(output,'docs/envelope-unit.md'),'utf8');
 assert.match(contract,/https:\/\/github\.com\/bao96-bioinfo\/Vibe2Spec\/blob\/main\/openspec\//);
 assert.doesNotMatch(contract,/\]\(\.\.\/openspec\//);
});

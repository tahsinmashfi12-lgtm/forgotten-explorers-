/* Forgotten Explorers translation validator. Usage: node i18n-check.js <siteDir> [--json out] */
const fs=require('fs'),path=require('path'),acorn=(()=>{try{return require('acorn')}catch(e){return require('/tmp/node_modules/acorn')}})(),walk=(()=>{try{return require('acorn-walk')}catch(e){return require('/tmp/node_modules/acorn-walk')}})();
const site=process.argv[2]||'.';const LANGS=['en','bn','es','fr','ar'];
let out_content=null;const DICT_FILES=['i18n.js','hw/hw-i18n.js','doc/doc-i18n.js','veh/veh-i18n.js','jr/jr-i18n.js','md/md-i18n.js','mx/mx-i18n.js','wm/wm-i18n.js','ss/solar.js'];
const CODE_FILES=['app.js','i18n-content.js','jr/jr.js','md/md.js','md/md-data.js','mx/mx.js','mx/mx-data.js','wm/wm.js','hw/hw.js','ss/solar.js','museum.js','doc/doc.js','veh/veh-data.js','hw/hw-data.js'];
const dict={},where={},issues=[];const P=(sev,k,msg)=>issues.push({sev,k,msg});
for(const f of DICT_FILES){const src=fs.readFileSync(path.join(site,f),'utf8');
 if(/�|Ã.|â€/.test(src))P('error',f,'possible encoding damage in file');
 const ast=acorn.parse(src,{ecmaVersion:2022});
 const take=(obj,dname)=>{for(const p of obj.properties){if(p.type!=='Property')continue;const k=p.key.name||p.key.value;
  const id=dname+':'+k;
  if(where[id])P('error',k,`duplicate key (${where[id]} and ${f})`);where[id]=f;
  if(p.value.type!=='ArrayExpression'){P('error',k,'value is not an array');continue;}
  const v=p.value.elements.map(e=>e&&e.type==='Literal'?e.value:(e&&e.type==='TemplateLiteral'?e.quasis.map(q=>q.value.cooked).join('${}'):null));
  (dict[dname]=dict[dname]||{})[k]=v;}};
 walk.full(ast,n=>{
  if(n.type==='AssignmentExpression'&&n.left.type==='MemberExpression'&&n.left.property.name==='FE_T'&&n.right.type==='ObjectExpression')take(n.right,'FE_T');
  if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&n.callee.property.name==='assign'&&n.arguments[0]&&n.arguments[0].type==='MemberExpression'&&n.arguments[0].property.name==='FE_T'&&n.arguments[1].type==='ObjectExpression')take(n.arguments[1],'FE_T');
  if(n.type==='VariableDeclarator'&&n.id.name==='TT'&&n.init&&n.init.type==='ObjectExpression')take(n.init,'TT');});}
const vars=s=>(String(s).match(/\{[a-z0-9_]+\}/gi)||[]).sort().join(',');
const SCRIPT={bn:/[ঀ-৿]/,ar:/[؀-ۿ]/};
const sameAsEn={};
for(const d in dict)for(const k in dict[d]){const v=dict[d][k];
 if(v.length!==5)P('error',k,`has ${v.length} entries, expected 5`);
 v.forEach((s,i)=>{const L=LANGS[i]||'?';
  if(s==null){P('error',k,`${L}: not a plain string`);return;}
  if(!String(s).trim())P('error',k,`${L}: empty`);
  if(i&&vars(s)!==vars(v[0]))P('error',k,`${L}: placeholders ${vars(s)||'none'} ≠ en ${vars(v[0])||'none'}`);
  if(/\bundefined\b|\bnull\b/.test(s))P('error',k,`${L}: contains undefined/null`);
  if(i&&s===v[0]&&/[a-z]{3}/.test(s))(sameAsEn[L]=sameAsEn[L]||[]).push(k);
  if(SCRIPT[L]&&s!==v[0]&&!SCRIPT[L].test(s)&&/[A-Za-z]{4}/.test(s))P('warn',k,`${L}: no ${L} script characters`);
  if(i&&L!=='bn'&&L!=='ar'&&SCRIPT.bn.test(s))P('error',k,`${L}: contains Bengali text`);
  if(i&&L!=='ar'&&SCRIPT.ar.test(s))P('error',k,`${L}: contains Arabic text`);
 });}

/* localised content (i18n-content.js) against the data it localises */
{ const ctx={window:{FE_T:{}}};ctx.window.window=ctx.window;const vm=require('vm');vm.createContext(ctx);
  for(const f of ['data.js','hw/hw-data.js','i18n-content.js','veh/veh-data.js','doc/doc-data.js'])vm.runInContext(fs.readFileSync(path.join(site,f),'utf8').replace(/^\s*window\.FE_VEH_H = H;.*$/m,m=>m),ctx,{filename:f});
  const W=ctx.window,TC=W.FE_TC,CL=['bn','es','fr','ar'];
  const chk=(g,keys,name)=>{const have=Object.keys(TC[g]||{});for(const k of keys)if(!have.includes(k))P('error','FE_TC.'+g,`missing ${name} "${k}"`);for(const k of have)if(!keys.includes(k))P('warn','FE_TC.'+g,`extra key "${k}" (no matching ${name})`);
    for(const k of have){const v=TC[g][k];if(!Array.isArray(v)||v.length!==4)P('error','FE_TC.'+g+'.'+k,'expected 4 translations');else v.forEach((x,i)=>{if(!x||!String(x).trim())P('error','FE_TC.'+g+'.'+k,CL[i]+': empty');
      if(CL[i]==='bn'&&!SCRIPT.bn.test(x))P('warn','FE_TC.'+g+'.'+k,'bn: no Bengali script');if(CL[i]==='ar'&&!SCRIPT.ar.test(x))P('warn','FE_TC.'+g+'.'+k,'ar: no Arabic script');});}};
  chk('sum',W.FE_MISSIONS.map(m=>m.id),'mission');
  const hwIds=W.HW_ITEMS.filter(i=>!/^(Lunokhod \d|Surveyor \d)$/.test(i.name)).map(i=>i.id);chk('hwn',hwIds,'hardware item');
  chk('dest',['earth-orbit','moon','mars','venus','mercury','jupiter','saturn','uranus','neptune','pluto','small-bodies','interstellar','sun'],'destination');
  const labels=new Set(['Launch vehicle']);for(const id in W.FE_VEH)for(const r of W.FE_VEH[id].specs)labels.add(r[0]);chk('spl',[...labels],'spec label');chk('dnote',Object.keys(W.FE_VEH).filter(id=>W.FE_VEH[id].diagram),'diagram');
  const D=W.FE_DOC_TR,DD=W.FE_DOCDATA;for(const l of CL){if(!D.cues[l]||D.cues[l].length!==DD.cues.length)P('error','FE_DOC_TR.cues.'+l,`expected ${DD.cues.length} caption lines`);if(!D.titles[l]||D.titles[l].length!==DD.titles.length)P('error','FE_DOC_TR.titles.'+l,`expected ${DD.titles.length} titles`);}
  out_content={missions:W.FE_MISSIONS.length,hw:hwIds.length,labels:labels.size,cues:DD.cues.length}; }
/* keys referenced in code */
const used=new Set(),prefixes=new Set();
for(const f of CODE_FILES){const src=fs.readFileSync(path.join(site,f),'utf8');
 for(const m of src.matchAll(/\b(?:t|tt|tr|S\.ctx\.t|ctx\.t)\(\s*["']([a-z0-9_]+)["']\s*[,)]/gi))used.add(m[1]);
 for(const m of src.matchAll(/\b(?:t|tt|tr|S\.ctx\.t|ctx\.t)\(\s*["']([a-z0-9_]+)["']\s*\+/gi))prefixes.add(m[1]);
 for(const m of src.matchAll(/\b(?:t|tt|tr|S\.ctx\.t|ctx\.t)\(\s*["']([a-z0-9_]+_)["']\s*\+/gi))prefixes.add(m[1]);
 for(const m of src.matchAll(/\b(?:t|tt|tr|S\.ctx\.t|ctx\.t)\(\s*`([a-z0-9_]+_)\$\{/gi))prefixes.add(m[1]);}
for(const p of prefixes)used.delete(p);const all={...dict.FE_T,...dict.TT};
for(const k of used)if(!(k in all))P('error',k,'used in code but missing from every dictionary');
const unused=Object.keys(all).filter(k=>!used.has(k)&&![...prefixes].some(p=>k.startsWith(p)));
const out={files:DICT_FILES,keys:{FE_T:Object.keys(dict.FE_T||{}).length,TT:Object.keys(dict.TT||{}).length},used:used.size,prefixes:[...prefixes],
 errors:issues.filter(i=>i.sev==='error'),warnings:issues.filter(i=>i.sev==='warn'),identicalToEnglish:sameAsEn,possiblyUnused:unused};
console.log(`keys FE_T=${out.keys.FE_T} TT=${out.keys.TT} referenced=${out.used} prefixes=${out.prefixes.join(' ')}`);
console.log('content',JSON.stringify(out_content));console.log(`errors=${out.errors.length} warnings=${out.warnings.length} possiblyUnused=${unused.length}`);
for(const i of issues)console.log(i.sev.toUpperCase(),i.k,'—',i.msg);
for(const L in sameAsEn)console.log('identical to English ['+L+']:',sameAsEn[L].join(' '));
console.log('possibly unused:',unused.join(' '));
const j=process.argv.indexOf('--json');if(j>0)fs.writeFileSync(process.argv[j+1],JSON.stringify(out,null,1));
process.exitCode=out.errors.length?1:0;

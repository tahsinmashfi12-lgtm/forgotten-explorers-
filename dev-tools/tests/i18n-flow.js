/* Functional language tests: switching, persistence, state, raw keys, NOVA plumbing (mocked), documentary captions, Hardware Locator. */
const {chromium}=require('playwright');const fs=require('fs');
const BASE='http://localhost:8766/test.html';const LANGS=['bn','es','fr','ar'];const results=[];const ok=(n,c,d)=>{results.push([c?'PASS':'FAIL',n,d||'']);};
const MOCK=`window.__prompts=[];window.claude={use:async k=>k==='sample'?Object.assign(async(msgs,o)=>{window.__prompts.push(JSON.stringify(msgs).slice(0,4000));return {text:'Mock answer\\nSOURCES: perseverance'};},{json:async(p,o)=>{window.__prompts.push(p.slice(0,600));const m=p.match(/\\n\\n([\\s\\S]*)$/);const v=JSON.parse(m[1]);const tag=s=>typeof s==='string'?'⟦'+s+'⟧':Array.isArray(s)?s.map(tag):s;if(Array.isArray(v))return v.map(tag);const o2={};for(const k in v)o2[k]=tag(v[k]);return o2;}}):null};`;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const keys=new Set();{const src=['i18n.js','hw/hw-i18n.js','doc/doc-i18n.js','veh/veh-i18n.js'].map(f=>fs.readFileSync('/home/claude/fe/site/'+f,'utf8')).join('\n');for(const m of src.matchAll(/^\s*([a-z][a-z0-9_]{2,}):\[/gm))keys.add(m[1]);for(const m of src.matchAll(/[,{]\s*([a-z][a-z0-9]*_[a-z0-9_]+):\[/g))keys.add(m[1]);}
 const ctx=await b.newContext({viewport:{width:1366,height:900}});await ctx.addInitScript(MOCK);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const rawKeys=async()=>p.evaluate(K=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){for(const tok of n.nodeValue.split(/[\s·,.:()]+/))if(K.includes(tok))out.push(tok);}for(const el of document.querySelectorAll('[aria-label],[placeholder],[title]'))for(const a of ['aria-label','placeholder','title']){const v=el.getAttribute(a);if(v&&K.includes(v.trim()))out.push(a+'='+v);}return [...new Set(out)];},[...keys].filter(k=>/_/.test(k)));
 await p.goto(BASE);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:ssIntroSeen','1')});
 for(const L of LANGS){
  await p.goto(BASE+'#home');await p.reload();await p.waitForTimeout(600);
  await p.selectOption('#lang-top',L);await p.waitForTimeout(400);
  const st=await p.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,hash:location.hash,skip:document.querySelector('a.sr[href="#main"]').textContent,stored:localStorage.getItem('fe:lang')}));
  ok(L+' switch on home',st.lang===L&&st.stored===L&&st.dir===(L==='ar'?'rtl':'ltr'),JSON.stringify(st));
  ok(L+' skip link translated',st.skip!=='Skip to content',st.skip);
  // vehicle page tab state survives a language switch
  await p.selectOption('#lang-top','en');await p.waitForTimeout(300);
  await p.goto(BASE+'#m-perseverance/ins');await p.waitForTimeout(700);
  await p.selectOption('#lang-top',L);await p.waitForTimeout(600);
  const v=await p.evaluate(()=>({hash:location.hash,sel:document.querySelector('[data-vtab][aria-selected=true]')?.dataset.vtab,summary:document.querySelector('.mhero .lede')?.textContent,spec:document.querySelector('#vp-spec th')?.textContent}));
  ok(L+' vehicle tab kept after switch',v.hash==='#m-perseverance/ins'&&v.sel==='ins',JSON.stringify(v));
  ok(L+' mission summary localised',v.summary&&!/^Exploring Jezero/.test(v.summary),v.summary&&v.summary.slice(0,60));
  ok(L+' spec labels localised',v.spec&&v.spec!=='Mass'&&v.spec!=='Vehicle mass',v.spec);
  // refresh keeps language and tab
  await p.reload();await p.waitForTimeout(800);
  const r=await p.evaluate(()=>({lang:document.documentElement.lang,sel:document.querySelector('[data-vtab][aria-selected=true]')?.dataset.vtab}));
  ok(L+' refresh keeps language and tab',r.lang===L&&r.sel==='ins',JSON.stringify(r));
  // engineering translation through (mocked) NOVA
  await p.click('#vp-ins [data-vtr]');await p.waitForTimeout(900);
  const e=await p.evaluate(()=>({sel:document.querySelector('[data-vtab][aria-selected=true]')?.dataset.vtab,first:document.querySelector('#vp-ins .vsum')?.textContent,name:document.querySelector('#vp-hw .vname')?.textContent,abbr:document.querySelector('#vp-ins .vabbr')?.textContent,note:document.querySelector('#vp-ins .notice')?.textContent}));
  ok(L+' engineering records translate and stay on tab',e.sel==='ins'&&/^⟦/.test(e.first||'')&&!/⟦/.test(e.abbr||''),JSON.stringify(e));
  const pr=await p.evaluate(()=>window.__prompts.slice(-1)[0]||'');ok(L+' translation prompt keeps official names',/Mastcam-Z/.test(pr)&&/Keep official/.test(pr),pr.slice(0,120));
  // pages with raw keys
  for(const r2 of ['home','explore','moon','mars','d-mars','about','credits','nova','m-apollo-11/spec','m-voyager-1','timeline']){await p.goto(BASE+'#'+r2);await p.waitForTimeout(500);const rk=await rawKeys();ok(L+' no raw keys on '+r2,!rk.length,rk.join(' '));}
  // NOVA answers in selected language (mocked)
  await p.goto(BASE+'#nova');await p.waitForTimeout(500);await p.fill('#chatq','Tell me about Perseverance');await p.press('#chatq','Enter');await p.waitForTimeout(800);
  const np=await p.evaluate(()=>window.__prompts.slice(-1)[0]||'');const LB={bn:'Bengali',es:'Spanish',fr:'French',ar:'Arabic'}[L];
  ok(L+' NOVA prompt asks for selected language',np.includes('Answer in '+LB)&&np.includes('Mastcam-Z'),np.match(/Answer in [^.]*/)?.[0]);
  // Hardware Locator
  await p.goto(BASE+'#hw-a11-lm');await p.waitForTimeout(3500);
  const h=await p.evaluate(()=>({title:document.querySelector('#hw-detail h2')?.textContent,btn:!!document.querySelector('#hw-detail [data-a=trhw]'),list:[...document.querySelectorAll('#hw-list [data-item] b')].slice(0,3).map(x=>x.textContent)}));
  ok(L+' HW names localised',h.title&&h.title!=='Apollo 11 Lunar Module descent stage (Eagle)'&&/Eagle/.test(h.title),JSON.stringify(h));
  if(h.btn){await p.click('#hw-detail [data-a=trhw]');await p.waitForTimeout(800);}
  const h2=await p.evaluate(()=>({what:document.querySelector('#hw-detail .hw-dl dd')?.textContent,note:document.querySelector('#hw-trbox')?.textContent}));
  ok(L+' HW record translation applied',/^⟦/.test(h2.what||''),JSON.stringify(h2).slice(0,160));
  // Documentary captions
  await p.goto(BASE+'#documentary');await p.waitForTimeout(1500);
  await p.evaluate(()=>{const cc=document.querySelector('.dc-cc');if(cc&&cc.getAttribute('aria-pressed')!=='true')cc.click();const s=document.querySelector('#dc-seek');s.value='12';s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));});
  await p.waitForTimeout(600);
  const d=await p.evaluate(()=>({cap:document.querySelector('#dc-cap')?.textContent,lang:document.querySelector('#dc-cap p')?.getAttribute('lang'),scene:document.querySelector('#dc-scene')?.textContent,sub:document.querySelector('.dc-poster p')?.textContent}));
  ok(L+' documentary caption in selected language',d.lang===L&&d.cap&&d.cap.length>3,JSON.stringify(d));
  await p.goto(BASE+'#home');await p.waitForTimeout(300);
 }
 // back to English
 await p.selectOption('#lang-top','en');await p.waitForTimeout(400);await p.goto(BASE+'#m-perseverance/ins');await p.waitForTimeout(600);
 const en=await p.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,summary:document.querySelector('.mhero .lede')?.textContent,first:document.querySelector('#vp-ins .vsum')?.textContent}));
 ok('switch back to English restores English data',en.lang==='en'&&en.dir==='ltr'&&/^Exploring Jezero/.test(en.summary)&&!/⟦/.test(en.first),JSON.stringify(en));
 ok('no page errors',!errs.length,errs.join(' | '));
 for(const r of results)console.log(r.join('\t'));console.log('PASS',results.filter(r=>r[0]==='PASS').length,'FAIL',results.filter(r=>r[0]==='FAIL').length);
 fs.writeFileSync('/home/claude/fe/tools/flow.json',JSON.stringify(results,null,1));await b.close();})();

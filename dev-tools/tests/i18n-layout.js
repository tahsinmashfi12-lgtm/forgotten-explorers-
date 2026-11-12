const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const out=[];for(const vp of [{width:390,height:844,n:'mobile'},{width:1366,height:900,n:'desktop'}]){const c=await b.newContext({viewport:{width:vp.width,height:vp.height}});const p=await c.newPage();
 await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:ssIntroSeen','1')});
 for(const L of ['en','bn','es','fr','ar'])for(const r of ['home','m-perseverance/hw','m-apollo-11/spec','hardware-mars','documentary','about','nova']){
  await p.evaluate(l=>localStorage.setItem('fe:lang',l),L);await p.goto('http://localhost:8766/test.html#'+r);await p.reload();await p.waitForTimeout(/hardware|documentary/.test(r)?2500:700);
  const o=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[];for(const el of document.querySelectorAll('button,a.btn,.vtabs button,.navtools *,.hw-btn,.pill,h1,h2,.chip')){const r=el.getBoundingClientRect();if(!r.width)continue;if(el.scrollWidth>el.clientWidth+2&&getComputedStyle(el).overflow!=='visible'&&!el.closest('.vtabs,.hw-list,.tablewrap'))bad.push((el.className||el.tagName)+':'+el.textContent.trim().slice(0,30));if(r.right>W+1&&!el.closest('.vtabs,.tablewrap,.hw-list,.hw-side,.mu-dir,.tlstrip,.featured-rail,.chips,.vd-key'))bad.push('offscreen '+(el.className||el.tagName)+':'+el.textContent.trim().slice(0,30));}
   return {hscroll:document.documentElement.scrollWidth>W+1,bad:[...new Set(bad)].slice(0,6)};});
  if(o.hscroll||o.bad.length)out.push([vp.n,L,r,JSON.stringify(o)].join('\t'));
  if(vp.n==='mobile'&&(L==='bn'||L==='ar')&&/home|perseverance|hardware/.test(r))await p.screenshot({path:`/tmp/claude-0/ly-${L}-${r.replace(/\W/g,'_')}.png`});}
 await c.close();}
 console.log(out.join('\n')||'no layout issues');await b.close();})();

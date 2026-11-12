/* Renders routes in every language and reports visible strings that stay in English. */
const {chromium}=require('playwright');const fs=require('fs');
const BASE=process.env.BASE||'http://localhost:8766/test.html';
const ROUTES=(process.env.ROUTES||'home,explore,timeline,moon,mars,destinations,d-mars,about,credits,nova,m-voyager-1,m-apollo-11,m-apollo-11/hw,m-apollo-11/ins,m-apollo-11/spec,m-apollo-11/hist,m-apollo-11/status,m-apollo-11/gal,m-apollo-11/src,m-perseverance/hw,m-perseverance/ins,m-perseverance/spec,m-change-4,m-lunokhod-1/hw,hardware-moon,hardware-mars,hw-a11-lm,documentary,museum,solar').split(',');
const LANGS=(process.env.LANGS||'bn,es,fr,ar').split(',');
const collect=()=>{const out=new Set();const vis=el=>{if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;return el.getClientRects().length>0};
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const s=n.nodeValue.replace(/\s+/g,' ').trim();if(s.length<2)continue;const p=n.parentElement;if(!p||p.closest('script,style,noscript,[data-noi18n],.mono.src'))continue;if(!vis(p))continue;out.add(s);}
 for(const el of document.querySelectorAll('[aria-label],[placeholder],[title]'))for(const a of ['aria-label','placeholder','title']){const v=el.getAttribute(a);if(v&&v.trim().length>1)out.add('@'+a+': '+v.trim());}
 return [...out];};
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});const ctx=await b.newContext({viewport:{width:1366,height:900}});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const go=async(lang,r)=>{await p.evaluate(l=>localStorage.setItem('fe:lang',l),lang);await p.goto(BASE+'#'+r);await p.reload();await p.waitForTimeout(/museum|solar|documentary|hardware|hw-/.test(r)?3500:900);
  /* skip intros */ await p.evaluate(()=>{for(const s of ['[data-skip]','.ss-skip','[data-intro-skip]'])document.querySelectorAll(s).forEach(b=>b.click())});await p.waitForTimeout(400);return collect};
 await p.goto(BASE);await p.evaluate(()=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:ssIntroSeen','1')});
 const res={};
 for(const r of ROUTES){await go('en',r);const en=new Set(await p.evaluate(collect));
  for(const L of LANGS){await go(L,r);const xs=await p.evaluate(collect);
   const same=xs.filter(s=>en.has(s)&&/[a-z]{3,}/.test(s.replace(/^@[a-z-]+: /,'')));
   const latin=(L==='bn'||L==='ar')?xs.filter(s=>/[A-Za-z]{3,}[^A-Za-z]+[a-z]{3,}/.test(s)&&!en.has(s)):[];
   res[r+'|'+L]={same,latin};}
  console.error('done',r);}
 fs.writeFileSync(process.env.OUT||'/tmp/claude-0/crawl.json',JSON.stringify({res,errs},null,1));await b.close();})();

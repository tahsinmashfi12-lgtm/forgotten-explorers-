const {chromium}=require('playwright');
const base=process.argv[2]||'http://localhost:3100/';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:850}});const errs=[];
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text())});
p.on('response',r=>{if(r.status()>=400&&!r.url().includes('/api/'))errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto(base);await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));await p.reload();await p.waitForTimeout(1500);
const routes=['home','explore','timeline','moon','mars','why-mars','destinations','museum','solar','nova','about','credits','documentary','journey','moon-doc','moon-doc/archive','mars-doc','mars-doc/archive','hardware-moon','hardware-mars','m-perseverance','m-apollo-11','m-perseverance/ins','d-jupiter','about-privacy','nonexistent-route'];
for(const r of routes){await p.evaluate(x=>location.hash=x,r);await p.waitForTimeout(/museum|solar|journey|hardware/.test(r)?4500:1600);
 const s=await p.evaluate(()=>({main:(document.querySelector('#main')||{}).innerText?.length||0,ov:[...document.querySelectorAll('body > div[id]')].map(d=>d.id).filter(i=>i!=='layer').join(','),title:document.title}));
 console.log(r.padEnd(20),JSON.stringify(s));if(['home','why-mars','museum','solar','nova','mars-doc','journey','hardware-mars'].includes(r))await p.screenshot({path:'/tmp/claude-0/vz/'+r.replace(/\W/g,'_')+'.png'});}
await p.evaluate(()=>location.hash='nova');await p.waitForTimeout(1200);console.log('novamode',await p.textContent('#novamode'));
await p.fill('#chatq','Which rovers are on Mars?');await p.press('#chatq','Enter');await p.waitForTimeout(1500);console.log('nova answer',(await p.evaluate(()=>document.querySelector('#chatlog, .chatlog, [id*=log]')?.innerText||'')).slice(-200).replace(/\n/g,' '));
await p.evaluate(()=>location.hash='about-privacy');await p.waitForTimeout(1200);console.log('privacy',(await p.textContent('#about-privacy p')).slice(0,140));
console.log(errs.length?errs.join('\n'):'no errors');await b.close();})();

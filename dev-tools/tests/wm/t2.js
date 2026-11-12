const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const [w,h,l] of [[1250,800,'bn'],[1250,800,'fr'],[1250,800,'es'],[1250,800,'ar'],[1241,800,'fr']]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/test.html#home');await p.evaluate(l=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:lang',l)},l);await p.reload();await p.waitForTimeout(1500);
const nav=await p.evaluate(()=>{const u=document.querySelector('.navlinks');if(!u||getComputedStyle(u).display==='none')return 'hidden';const r=u.getBoundingClientRect(),t=document.querySelector('.navtools').getBoundingClientRect();return [Math.round(r.right),Math.round(t.left),u.scrollWidth>u.clientWidth]});
await p.locator('.wmsec').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:`/tmp/claude-0/wm/home_${w}_${l}.png`});
if(w===1440){await p.screenshot({path:'/tmp/claude-0/wm/nav.png',clip:{x:0,y:0,width:1440,height:70}});}
await p.click('.wmsec a.btn');await p.waitForTimeout(1500);const hash=await p.evaluate(()=>location.hash+' '+!!document.querySelector('#wm'));
await p.evaluate(()=>location.hash='mars');await p.waitForTimeout(1000);await p.locator('.wm-band').scrollIntoViewIfNeeded();await p.screenshot({path:`/tmp/claude-0/wm/marsband_${w}_${l}.png`});
console.log(w,l,'nav',JSON.stringify(nav),hash,errs.join('|'));await p.close();}
await b.close()})();

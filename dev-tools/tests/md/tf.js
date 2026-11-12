const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader']});
for(const [lang,W,H] of [['en',1440,900],['bn',1440,900],['ar',390,844]]){
const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/test.html');await p.evaluate(l=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:lang',l)},lang);await p.reload();await p.waitForTimeout(2500);
await p.screenshot({path:`/tmp/claude-0/sheet/f_${lang}_home.png`});
const fam=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).filter((v,i,a)=>a.indexOf(v)===i));
console.log(lang,JSON.stringify(fam));
await p.evaluate(()=>location.hash='moon');await p.waitForTimeout(1500);await p.evaluate(()=>scrollTo(0,500));await p.waitForTimeout(800);await p.screenshot({path:`/tmp/claude-0/sheet/f_${lang}_moon.png`});
await p.evaluate(()=>location.hash='m-apollo-11');await p.waitForTimeout(1500);await p.screenshot({path:`/tmp/claude-0/sheet/f_${lang}_m.png`});
console.log(errs.join('\n'));await p.close();}
await b.close();})();

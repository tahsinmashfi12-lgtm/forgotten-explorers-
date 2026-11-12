const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader']});const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));
await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
for(const h of ['journey/opportunity/3','journey/opportunity/map','home','moon-doc/2','documentary','solar']){await p.goto('http://localhost:8766/test.html#'+h);await p.reload();await p.waitForTimeout(h.startsWith('journey/opportunity/3')||h==='solar'?9000:3000);
 const st=await p.evaluate(()=>({canv:document.querySelectorAll('canvas').length,jr:!!window.FE_JRX&&!!document.getElementById('jr'),G:window.FE_JRX&&window.FE_JRX._g&&!!window.FE_JRX._g.active,md:!!document.getElementById('md'),dc:!!document.getElementById('dc')}));
 await p.screenshot({path:'/tmp/claude-0/mx/reg_'+h.replace(/\//g,'_')+'.png'});console.log(h,JSON.stringify(st));}
console.log(errs.join('\n')||'no errors');await b.close();})();

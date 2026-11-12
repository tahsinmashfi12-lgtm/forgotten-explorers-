const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>console.log('PE',e.message));
await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
await p.goto('http://localhost:8766/test.html#moon-doc/archive');await p.reload();await p.waitForTimeout(2000);
await p.fill('.md-q','Luna 16');await p.waitForTimeout(300);
await p.evaluate(()=>{window.__log=[];const d=document.querySelector('.md-drawer');new MutationObserver(m=>window.__log.push(d.hidden+':'+new Error().stack.split('\n').slice(1,4).join('|'))).observe(d,{attributes:true});});
await p.click('.md-item h3 button');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>window.__log));
await b.close();})();

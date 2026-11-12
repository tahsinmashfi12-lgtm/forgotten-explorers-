const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>console.log('PE',e.message));p.on('console',m=>console.log('C',m.text()));
await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
await p.goto('http://localhost:8766/test.html#moon-doc/archive');await p.reload();await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>{const b=document.querySelector('.md-item h3 button');b.click();const d=document.querySelector('.md-drawer');return [b.dataset.id,d.hidden,d.innerHTML.length]}));
await p.waitForTimeout(500);console.log(await p.evaluate(()=>{const d=document.querySelector('.md-drawer');return [d.hidden,d.innerHTML.length]}));
await b.close();})();

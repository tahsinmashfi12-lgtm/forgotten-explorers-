const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>console.log('PE',e.message));
await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
await p.goto('http://localhost:8766/test.html#moon-doc/sources');await p.reload();await p.waitForTimeout(2000);
await p.screenshot({path:'/tmp/claude-0/sheet/src_full.png',fullPage:false});
await p.evaluate(()=>document.querySelector('.md-page').scrollTop=1800);await p.waitForTimeout(300);await p.screenshot({path:'/tmp/claude-0/sheet/src_full2.png'});
await p.evaluate(()=>location.hash='moon-doc/archive');await p.waitForTimeout(1000);await p.fill('.md-q','Luna 16');await p.waitForTimeout(300);await p.click('.md-item h3 button');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[document.querySelector('.md-drawer').hidden,document.querySelector('.md-drawer').innerHTML.length,getComputedStyle(document.querySelector('.md-drawer')).display]));await p.screenshot({path:'/tmp/claude-0/sheet/ar_l16.png'});await b.close();})();

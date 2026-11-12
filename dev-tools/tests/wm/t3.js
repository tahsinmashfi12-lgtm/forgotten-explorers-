const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/test.html#why-mars');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));await p.reload();await p.waitForTimeout(1500);
for(const h of ['mars-doc','why-mars','home','why-mars']){await p.evaluate(x=>location.hash=x,h);await p.waitForTimeout(1500);console.log(h,await p.evaluate(()=>[!!document.querySelector('#wm'),document.body.style.overflow,document.querySelectorAll('.wm-sec').length]));}
await p.selectOption('#lang-top','bn');await p.waitForTimeout(1200);console.log('lang',await p.textContent('#wm-title'));
await p.click('[data-cmp=grav]');console.log(await p.textContent('#wm-cp h3'));
await p.evaluate(()=>location.hash='credits');await p.waitForTimeout(2500);console.log('cred',await p.evaluate(()=>document.querySelectorAll('#wmcred .citem').length));
// keyboard on scorecard
await p.evaluate(()=>location.hash='why-mars');await p.waitForTimeout(1500);await p.focus('#wm-sct-water');await p.keyboard.press('ArrowDown');await p.keyboard.press('ArrowDown');console.log('kbd',await p.evaluate(()=>document.activeElement.dataset.sc));
console.log(errs.join('|')||'no errors');await b.close()})();

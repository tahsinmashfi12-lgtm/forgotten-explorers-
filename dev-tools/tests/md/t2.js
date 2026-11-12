const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({args:['--use-gl=swiftshader']});
const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await p.goto('http://localhost:8766/test.html#moon');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
await p.goto('http://localhost:8766/test.html#moon-doc/1');await p.waitForTimeout(2500);
await p.evaluate(()=>{const s=FE_MDX._s();s.na.currentTime=43;});await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const f=[...document.querySelectorAll('.md-slot.in .md-frame')].pop();const R=f.getBoundingClientRect();return {f:[R.x,R.y,R.width,R.height,f.style.cssText],pins:[...f.querySelectorAll('.md-pin')].map(x=>{const q=x.getBoundingClientRect();return [x.dataset.id,x.style.left,x.style.top,q.x+q.width/2,q.y+q.height/2]})}});
console.log(JSON.stringify(r));
await p.screenshot({path:'/tmp/claude-0/sheet/m_pins.png'});
await b.close();})();

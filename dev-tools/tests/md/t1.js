const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({args:['--use-gl=swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text())});
p.on('requestfailed',r=>errs.push('RF '+r.url()));p.on('response',r=>{if(r.status()>=400)errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto('http://localhost:8766/test.html#moon');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));await p.reload();
await p.waitForTimeout(1500);
await p.screenshot({path:'/tmp/claude-0/sheet/m_moon.png'});
await p.locator('.md-entry').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
await p.locator('.md-entry').screenshot({path:'/tmp/claude-0/sheet/m_entry.png'});
await p.click('.md-entry a.btn.primary');await p.waitForTimeout(2500);
await p.screenshot({path:'/tmp/claude-0/sheet/m_intro.png'});
await p.click('[data-a=begin]');await p.waitForTimeout(3000);
const st=await p.evaluate(()=>{const s=FE_MDX._s();return {h:location.hash,ch:s.ch,playing:s.playing,t:s.na.currentTime,mt:s.mu.currentTime,shot:s.shot,cue:s.cue}});console.log(JSON.stringify(st));
await p.screenshot({path:'/tmp/claude-0/sheet/m_play1.png'});
// seek to 26s ch1 (surveyor 1 pin)
await p.evaluate(()=>{const s=FE_MDX._s();s.na.currentTime=26;});await p.waitForTimeout(2200);
await p.screenshot({path:'/tmp/claude-0/sheet/m_play2.png'});
await p.click('.md-row [data-a=tr]');await p.waitForTimeout(600);
await p.evaluate(()=>{const s=FE_MDX._s();s.na.currentTime=43;});await p.waitForTimeout(2000);
await p.screenshot({path:'/tmp/claude-0/sheet/m_play3.png'});
await p.click('.md-pin >> nth=0');await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/claude-0/sheet/m_drawer.png'});
console.log(errs.join('\n'));await b.close();})();

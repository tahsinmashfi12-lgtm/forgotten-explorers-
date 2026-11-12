const {chromium}=require('playwright');
const lang=process.argv[2]||'en',W=+(process.argv[3]||1440),H=+(process.argv[4]||900),tag=process.argv[5]||lang;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},isMobile:W<700,hasTouch:W<700});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push('CE '+m.text())});
p.on('response',r=>{if(r.status()>=400)errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto('http://localhost:8766/test.html#mars');await p.evaluate(l=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:lang',l)},lang);await p.reload();await p.waitForTimeout(1500);
await p.locator('.mx-entry').scrollIntoViewIfNeeded();await p.waitForTimeout(400);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_entry.png`});
await p.click('.mx-entry a.btn.primary');await p.waitForTimeout(2200);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_pre.png`});
await p.click('[data-a=begin]');
for(const t of [1.5,4,7.5]){await p.evaluate(x=>{FE_MXP._s().na.currentTime=x},t);await p.waitForTimeout(700);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_open_${t}.png`});}
const Q=await p.evaluate(()=>{const F=[];FE_MX.CH.forEach((c,i)=>c.shots.forEach(s=>F.push(FE_MX_CUES.off[i]+s.s)));return F.sort((a,b)=>a-b)});
let k=0;for(const t of Q){await p.evaluate(x=>{FE_MXP._s().na.currentTime=x+0.8},t);await p.waitForTimeout(1300);
 const info=await p.evaluate(()=>{const S=FE_MXP._s();return {t:S.na.currentTime.toFixed(1),sh:S.shot,cap:(document.querySelector('.mx-cap')||{}).textContent,chap:!document.querySelector('.mx-chap').hidden,vid:[...document.querySelectorAll('.mx-slot.in video')].map(v=>[v.readyState,v.paused]),img:[...document.querySelectorAll('.mx-slot.in img')].map(i=>i.naturalWidth)}});
 console.log(k,t.toFixed(1),JSON.stringify(info));if(tag==='zz')await p.screenshot({path:`/tmp/claude-0/mx/s_${String(k).padStart(2,'0')}.png`});k++;}
const raw=await p.evaluate(()=>document.body.innerText.match(/\b(md|mx|hw)_[a-z_0-9]+\b/g));console.log('RAW',raw);
await p.evaluate(()=>location.hash='mars-doc/archive');await p.waitForTimeout(1200);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_ar.png`});console.log('count',await p.textContent('.mx-count'));
await p.click('.mx-item h3 button >> nth=3');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_ardr.png`});
await p.evaluate(()=>location.hash='mars-doc/sources');await p.waitForTimeout(1000);await p.screenshot({path:`/tmp/claude-0/mx/${tag}_src.png`});
const raw2=await p.evaluate(()=>document.body.innerText.match(/\b(md|mx|hw)_[a-z_0-9]+\b/g));console.log('RAW2',raw2,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
console.log(errs.join('\n')||'no errors');await b.close();})();

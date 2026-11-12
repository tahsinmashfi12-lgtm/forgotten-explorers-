const {chromium}=require('playwright');
const lang=process.argv[2]||'en', W=+(process.argv[3]||1440), H=+(process.argv[4]||900), tag=process.argv[5]||lang;
(async()=>{
const b=await chromium.launch({args:['--use-gl=swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push('CE '+m.text())});
p.on('response',r=>{if(r.status()>=400)errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto('http://localhost:8766/test.html#moon');await p.evaluate(l=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:lang',l)},lang);
await p.goto('http://localhost:8766/test.html#moon-doc/1');await p.waitForTimeout(2000);
const shots=[];
for(let ch=1;ch<=6;ch++){
  await p.evaluate(c=>location.hash='moon-doc/'+c,ch);await p.waitForTimeout(1200);
  await p.evaluate(()=>{const s=FE_MDX._s();s.na.play()});
  const D=await p.evaluate(c=>FE_MD.CH[c-1].shots.map(s=>s.s),ch);
  for(const [k,s] of D.entries()){
    await p.evaluate(x=>{const S=FE_MDX._s();S.na.currentTime=x+0.6},s);await p.waitForTimeout(1500);
    const f=`/tmp/claude-0/sheet/s_${tag}_${ch}_${k}.png`;await p.screenshot({path:f});shots.push(f);
    const info=await p.evaluate(()=>{const S=FE_MDX._s();const v=[...document.querySelectorAll('.md-slot.in video')];return {sh:S.shot,cue:S.cue,cap:(document.querySelector('.md-cap')||{}).textContent,vids:v.map(x=>[x.paused,x.readyState,x.currentTime.toFixed(1)]),img:[...document.querySelectorAll('.md-slot.in img')].map(i=>i.naturalWidth)}});
    console.log(ch,k,s,JSON.stringify(info));
  }
}
// raw labels check
const raw=await p.evaluate(()=>document.body.innerText.match(/\b(md|hw)_[a-z_0-9]+\b/g));console.log('RAW',raw);
await p.evaluate(()=>location.hash='moon-doc/archive');await p.waitForTimeout(1200);await p.screenshot({path:`/tmp/claude-0/sheet/a_${tag}.png`,fullPage:false});
console.log('archive count',await p.textContent('.md-count'));
await p.fill('.md-q','lunokhod');await p.waitForTimeout(300);console.log('q',await p.textContent('.md-count'));
await p.fill('.md-q','');await p.click('[data-a=fate][data-f=crash]');console.log('crash',await p.textContent('.md-count'));
await p.selectOption('select[data-f=ag]','ISRO');console.log('isro+crash',await p.textContent('.md-count'));
await p.click('[data-a=reset]');await p.selectOption('select[data-f=ty]','rover');console.log('rovers',await p.textContent('.md-count'));
await p.click('.md-item h3 button >> nth=0');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/claude-0/sheet/a2_${tag}.png`});
const raw2=await p.evaluate(()=>document.body.innerText.match(/\b(md|hw)_[a-z_0-9]+\b/g));console.log('RAW2',raw2);
await p.evaluate(()=>location.hash='moon-doc/sources');await p.waitForTimeout(1000);await p.screenshot({path:`/tmp/claude-0/sheet/src_${tag}.png`});
const raw3=await p.evaluate(()=>document.body.innerText.match(/\b(md|hw)_[a-z_0-9]+\b/g));console.log('RAW3',raw3);
await p.click('.md-x');await p.waitForTimeout(800);console.log('after close',await p.evaluate(()=>[location.hash,!!document.getElementById('md'),document.body.style.overflow]));
console.log(errs.join('\n'));await b.close();})();

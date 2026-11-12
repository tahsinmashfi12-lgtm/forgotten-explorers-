const {chromium}=require('playwright');
const lang=process.argv[2]||'en',W=+(process.argv[3]||1440),H=+(process.argv[4]||900),tag=process.argv[5]||lang,shots=process.argv[6]!=='0';
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:W,height:H},isMobile:W<700,hasTouch:W<700});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push('CE '+m.text())});
p.on('response',r=>{if(r.status()>=400)errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto('http://localhost:8766/test.html#why-mars');await p.evaluate(l=>{localStorage.setItem('fe:introSeen','1');localStorage.setItem('fe:lang',l);localStorage.removeItem('fe:wm:verdicts')},lang);await p.reload();await p.waitForTimeout(1800);
const S=async n=>{if(shots)await p.screenshot({path:`/tmp/claude-0/wm/${tag}_${n}.png`})};
await S('hero');
await p.click('[data-wmgo]');await p.waitForTimeout(1200);console.log('afterGo',await p.evaluate(()=>[Math.round(scrollY),Math.round(document.querySelector('#wm-s1').getBoundingClientRect().top),document.activeElement.id]));
await S('s1');
for(const k of ['grav','temp','atm','pres','day']){await p.click(`[data-cmp=${k}]`);await p.waitForTimeout(1100);await p.locator('#wm-cp').scrollIntoViewIfNeeded();await S('cmp_'+k);}
await p.keyboard.press('ArrowRight');await p.waitForTimeout(300);console.log('kbd',await p.evaluate(()=>document.activeElement.dataset.cmp));
for(const sec of ['s2','s3','s4','s5','s6','s7','src']){await p.locator('#wm-'+sec).scrollIntoViewIfNeeded();await p.waitForTimeout(900);await S(sec);}
// water hotspots
for(const k of ['cap','scarp','mid','lake','eq','deep']){await p.click(`.wm-pin[data-xs=${k}]`);const h=await p.textContent('#wm-xd h4');if(!h)errs.push('xs '+k);}
await p.locator('.wm-hot[data-hot=xs]').scrollIntoViewIfNeeded();await S('xs');
for(const k of ['light','plant','temp','nut','water']){await p.click(`.wm-pin[data-gh=${k}]`);const h=await p.textContent('#wm-ghd h4');if(!h)errs.push('gh '+k);}
await p.click('.wm-pin[data-gh=light]');await p.locator('.wm-hot[data-hot=gh]').scrollIntoViewIfNeeded();await S('gh');
for(const i of [2,3,4,1]){await p.click(`[data-mxs="${i}"]`);}
await p.click('[data-mxs="3"]');await p.locator('.wm-moxie').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await S('moxie');
for(const k of ['en','wat','ls','com','hab']){await p.click(`[role=tab][data-sys=${k}]`);await p.waitForTimeout(200);}
await p.dispatchEvent('.wm-base g[data-sys=en]','click');await p.waitForTimeout(400);console.log('sysg',await p.getAttribute('[role=tab][data-sys=en]','aria-selected'));
await p.locator('#wm-sp').scrollIntoViewIfNeeded();await S('sys_en');
await p.fill('#wm-dist','54.6');await p.dispatchEvent('#wm-dist','input');console.log('delay min',await p.textContent('#wm-d1'),await p.textContent('#wm-d2'));
await p.fill('#wm-dist','401.4');await p.dispatchEvent('#wm-dist','input');console.log('delay max',await p.textContent('#wm-d1'),await p.textContent('#wm-dd'));
await p.locator('.wm-delay').scrollIntoViewIfNeeded();await S('delay');
for(const k of ['cold','pres','dust','grav','iso','rad']){await p.click(`[data-dng=${k}]`);await p.waitForTimeout(250);if(['cold','grav','pres'].includes(k)){await p.locator('#wm-dp').scrollIntoViewIfNeeded();await S('dng_'+k);}}
await p.click('[data-sc=oxy]');await p.click('input[data-vote=oxy][value=hard]',{force:true});await p.click('[data-sc=water]');await p.click('input[data-vote=water][value=yes]',{force:true});
console.log('sum',await p.textContent('#wm-sum'));
await p.locator('.wm-sc').scrollIntoViewIfNeeded();await S('sc');
await p.reload();await p.waitForTimeout(1500);console.log('persist',await p.textContent('#wm-sum'));
await p.click('[data-vreset]');console.log('reset',await p.textContent('#wm-sum'));
await p.locator('.wm-concl').scrollIntoViewIfNeeded();await S('concl');
const raw=await p.evaluate(()=>document.body.innerText.match(/\b(wm|nav)_[a-z_0-9]+\b/g));console.log('RAW',raw,'overflow',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]));
const imgs=await p.evaluate(async()=>{const r=[];for(const i of document.querySelectorAll('#wm img')){i.loading='eager';try{await i.decode()}catch(e){}if(!i.naturalWidth)r.push(i.src)}return r});console.log('badimg',imgs);
console.log('title',await p.title());
console.log(errs.join('\n')||'no errors');await b.close();})();

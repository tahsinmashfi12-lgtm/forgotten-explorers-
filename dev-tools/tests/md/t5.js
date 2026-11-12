const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader']});const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('response',r=>{if(r.status()>=400)errs.push('HTTP'+r.status()+' '+r.url())});
await p.goto('http://localhost:8766/test.html');await p.evaluate(()=>localStorage.setItem('fe:introSeen','1'));
for(const h of ['home','explore','moon','mars','timeline','credits','documentary','journey','hardware-moon','m-lunokhod-1','moon-doc','moon-doc/3','moon-doc/archive','moon','solar','museum','moon-doc/sources','mars-doc','mars-doc/3','mars-doc/archive','why-mars','mars-doc','why-mars','museum','why-mars','mars','journey','about','why-mars','credits']){
 await p.evaluate(x=>location.hash=x,h);await p.waitForTimeout(h.match(/museum|solar|journey/)?4000:1500);
 const st=await p.evaluate(()=>({md:!!document.getElementById('md'),jr:!!document.getElementById('jr'),dc:!!document.getElementById('dc'),ov:document.body.style.overflow,cred:!!document.querySelector('#mdcred .citem')}));console.log(h,JSON.stringify(st));}
console.log(errs.join('\n')||'no errors');await b.close();})();

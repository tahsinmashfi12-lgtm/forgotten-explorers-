const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:850}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const posts=[];
await p.route('**/api/claude',async r=>{const q=r.request();if(q.method()==='GET')return r.fulfill({json:{enabled:true}});
 const body=JSON.parse(q.postData());posts.push(body);
 if(body.tools&&body.tools.length){const last=body.messages[body.messages.length-1];
  if(Array.isArray(last.content)&&last.content[0].type==='tool_result')return r.fulfill({json:{content:[{type:'text',text:'Perseverance and Curiosity are active rovers on Mars.\nSOURCES: perseverance, curiosity'}],stop_reason:'end_turn'}});
  return r.fulfill({json:{content:[{type:'text',text:'Let me check.'},{type:'tool_use',id:'tu1',name:'search_archive',input:{query:'mars rover'}}],stop_reason:'tool_use'}});}
 // translation json
 const prompt=body.messages[0].content;const m=prompt.match(/\{[\s\S]*\}\s*\n\nReturn only/);
 return r.fulfill({json:{content:[{type:'text',text:'```json\n{"summary":"অনুবাদিত সারাংশ"}\n```'}],stop_reason:'end_turn'}});});
await p.goto('http://localhost:3100/');await p.evaluate(()=>{localStorage.setItem('fe:introSeen','1')});await p.reload();await p.waitForTimeout(1200);
await p.evaluate(()=>location.hash='nova');await p.waitForTimeout(1200);console.log('mode:',await p.textContent('#novamode'));
await p.fill('#chatq','Which rovers are active on Mars?');await p.press('#chatq','Enter');await p.waitForTimeout(2000);
console.log('posts',posts.length,'tool_result sent:',JSON.stringify(posts[1]?.messages.slice(-1)[0].content[0]).slice(0,160));
console.log('answer:',(await p.evaluate(()=>document.body.innerText)).match(/Perseverance and Curiosity[^\n]*/)?.[0]);
await p.evaluate(()=>{localStorage.setItem('fe:lang','bn')});await p.evaluate(()=>location.hash='m-voyager-1');await p.reload();await p.waitForTimeout(1500);
const has=await p.$('#trbtn');console.log('trbtn',!!has);if(has){await p.click('#trbtn');await p.waitForTimeout(1500);console.log('translated:',await p.evaluate(()=>document.body.innerText.includes('অনুবাদিত সারাংশ')));}
console.log(errs.join('|')||'no errors');await b.close();})();

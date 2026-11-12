/* Lists natural-language literals in UI code (candidates for hardcoded English). */
const fs=require('fs'),acorn=require('/tmp/node_modules/acorn'),walk=require('/tmp/node_modules/acorn-walk');
const files=process.argv.slice(2);
for(const f of files){const src=fs.readFileSync(f,'utf8');const ast=acorn.parse(src,{ecmaVersion:2022,locations:true});const out=[];
 const chk=(s,line)=>{if(!s)return;const txt=s.replace(/<[^>]*>/g,' ').replace(/&[a-z]+;/g,' ');
  for(const seg of txt.split(/\s{2,}|\n/)){const x=seg.trim();if(x.length<4)continue;
   if(/^[.#\[]?[a-z-]+[:{(]/.test(x)||/https?:|\.(jpg|png|mp3|js|vtt)|^[\w.-]+$/.test(x))continue;
   const words=x.match(/\b[A-Za-z][a-z]{2,}\b/g)||[];if(words.length<2&&!/^[A-Z][a-z]{3,}$/.test(x))continue;
   if(/[{};=]|=>|\bvar\(|px\b|rgba|deg\b|translate|cubic|linear-gradient/.test(x))continue;
   out.push(line+': '+x.slice(0,140));}};
 walk.full(ast,n=>{if(n.type==='TemplateElement')chk(n.value.cooked,n.loc.start.line);
  if(n.type==='Literal'&&typeof n.value==='string')chk(n.value,n.loc.start.line);});
 console.log('== '+f);console.log([...new Set(out)].join('\n'));}

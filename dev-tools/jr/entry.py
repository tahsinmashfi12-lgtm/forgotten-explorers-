import re
p='/home/claude/fe/site/i18n.js'; s=open(p,encoding='utf-8').read()
blk='/* jr entry */\n'+open('/home/claude/fe/jr-src/entry-keys.txt',encoding='utf-8').read()+'\n/* /jr entry */\n'
if '/* jr entry */' in s: s=re.sub(r'/\* jr entry \*/.*?/\* /jr entry \*/\n',lambda m:blk,s,flags=re.S)
else: s=s.replace(' hw_ask_q:[',blk+' hw_ask_q:[',1)
open(p,'w',encoding='utf-8').write(s)

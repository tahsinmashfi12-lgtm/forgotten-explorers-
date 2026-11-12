#!/bin/bash
# make test.html in dir $1 using local fonts + introSeen preset (test harness only)
D=$1; cd $D; FS=/tmp/claude-0/fs/node_modules/@fontsource
if [ ! -d _fonts ]; then mkdir -p _fonts; : > _fonts/all.css
for f in anek-bangla ibm-plex-mono ibm-plex-sans ibm-plex-sans-arabic space-grotesk inter public-sans dm-mono montserrat; do mkdir -p _fonts/$f; cp -r $FS/$f/files _fonts/$f/ 2>/dev/null
  for c in $FS/$f/[0-9]*.css $FS/$f/index.css; do [ -f "$c" ] && sed "s#\./files/#$f/files/#g" "$c" >> _fonts/all.css; done; done; fi
python3 - <<'P'
import re
s=open('index.html').read()
s=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>','<link rel="stylesheet" href="_fonts/all.css">',s)
open('test.html','w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script>try{localStorage.setItem("fe:introSeen","1");if(!/hli/.test(location.search))sessionStorage.setItem("fe:hliSeen","1")}catch(e){}</script>'+s)
P

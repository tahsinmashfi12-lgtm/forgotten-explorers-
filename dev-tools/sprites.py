"""Build small-icon sprite sheets for the Moon/Mars documentary archives (one file each, to stay
under the artifact file limit). Rewrites the /*SPRITE*/ ... /*/SPRITE*/ block in md.js / mx.js."""
import glob,os,json,math,re
from PIL import Image,ImageOps
SITE='/home/claude/fe/site'
CW,CH=224,168
for mod in ['md','mx']:
    files=sorted(f for f in glob.glob(f'{SITE}/{mod}/img/*.*') if not os.path.basename(f).startswith('sprite.') and f.endswith(('.jpg','.webp')))
    n=len(files); cols=6; rows=math.ceil(n/cols)
    sheet=Image.new('RGB',(cols*CW,rows*CH),(10,10,12)); idx={}
    for i,f in enumerate(files):
        im=Image.open(f).convert('RGB')
        cell=ImageOps.fit(im,(CW,CH),Image.LANCZOS,centering=(0.5,0.5))
        sheet.paste(cell,((i%cols)*CW,(i//cols)*CH)); idx[os.path.relpath(f,SITE)]=i
    out=f'{SITE}/{mod}/img/sprite.webp'; sheet.save(out,'WEBP',quality=80,method=6)
    old=f'{SITE}/{mod}/img/sprite.jpg'
    if os.path.exists(old): os.remove(old)
    js=f'{SITE}/{mod}/{mod}.js'; s=open(js).read()
    blk='/*SPRITE*/const SPR = {cols:%d, rows:%d, i:%s};/*/SPRITE*/'%(cols,rows,json.dumps(idx,separators=(',',':')))
    s=re.sub(r'/\*SPRITE\*/.*?/\*/SPRITE\*/',lambda m:blk,s,flags=re.S) if '/*SPRITE*/' in s else s
    open(js,'w').write(s)
    print(mod,n,'cells',os.path.getsize(out)//1024,'KB', 'block' if blk in s else 'NO BLOCK YET')

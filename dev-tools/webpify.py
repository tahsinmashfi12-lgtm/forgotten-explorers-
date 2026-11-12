"""Convert site images to WebP where it pays off, regenerate img/t thumbnails at 760 px,
downscale Why-Mars-only photos to 1000 px, and rewrite every local reference.
Originals are backed up in /home/claude/fe/jpg_backup/site-v17.tar."""
import os,io,re,glob,json
from PIL import Image
SITE='/home/claude/fe/site'; os.chdir(SITE)
Q=82; log=[]
def save_webp(im,path,q=Q):
    b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); open(path,'wb').write(b.getvalue()); return b.tell()
conv={}   # old path -> new path
# 1) img/ full + img/t (always webp; thumbs rebuilt from the full image at <=760 px)
for f in sorted(glob.glob('img/*.jpg')):
    k=os.path.basename(f)[:-4]; im=Image.open(f).convert('RGB'); old=os.path.getsize(f)
    n=save_webp(im,f'img/{k}.webp'); conv[f]=f'img/{k}.webp'; os.remove(f); log.append((f,old,n))
    t=f'img/t/{k}.jpg'
    if os.path.exists(t):
        told=os.path.getsize(t); w=min(760,im.width); th=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS) if w<im.width else im
        n=save_webp(th,f'img/t/{k}.webp',80); conv[t]=f'img/t/{k}.webp'; os.remove(t); log.append((t,told,n))
# 2) Why-Mars-only photos: max 1000 px wide
WM_ONLY=['gale_lake','north_cap_hubble','ice_crater','swim_ice_map','moxie','veggie_harvest','printed_habitat','chapea_crew','curiosity_dusty','radiation_compare','conjunction','earth_disk','mars_disk']
for k in WM_ONLY:
    f=f'wm/img/{k}.jpg'; im=Image.open(f).convert('RGB'); old=os.path.getsize(f)
    if im.width>1000: im=im.resize((1000,round(im.height*1000/im.width)),Image.LANCZOS)
    n=save_webp(im,f'wm/img/{k}.webp'); conv[f]=f'wm/img/{k}.webp'; os.remove(f); log.append((f,old,n))
# 3) a 1000-px copy of the Jezero image for the Why Mars card (the documentary keeps the full image)
im=Image.open('mx/img/jezero_mars_express.jpg').convert('RGB'); im=im.resize((1000,round(im.height*1000/im.width)),Image.LANCZOS)
save_webp(im,'wm/img/jezero_1000.webp')
# 4) everything else: webp only if it saves at least 15 %
for d in ['mx/img','md/img','jr/img','jr/img/t','hw/img','hw/img/t','veh/img','doc/img','ss/img','ss/img/t']:
    for f in sorted(glob.glob(d+'/*.jpg')):
        if f.endswith('sprite.jpg'): continue
        im=Image.open(f).convert('RGB'); old=os.path.getsize(f); b=io.BytesIO(); im.save(b,'WEBP',quality=Q,method=6)
        if b.tell()<=old*0.85:
            nf=f[:-4]+'.webp'; open(nf,'wb').write(b.getvalue()); conv[f]=nf; os.remove(f); log.append((f,old,b.tell()))
json.dump(conv,open('/home/claude/fe/tools/webp_map.json','w'),indent=0)
o=sum(x[1] for x in log); n=sum(x[2] for x in log)
print('converted',len(conv),'files',o//1024,'KB ->',n//1024,'KB',round(n/o*100),'%')
kept=[f for f in glob.glob('**/*.jpg',recursive=True) if not f.startswith(('ss/tex','hw/reg','_fonts'))]
print('kept as jpg',len(kept),kept[:40])

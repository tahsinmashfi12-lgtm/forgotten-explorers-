import json, re
from timeline import B, DUR, FINAL_T, TOTAL, A, LEAD
from script import S, TITLES
from PIL import Image
SITE='/home/claude/fe/site/'
EX=json.load(open('/home/claude/fe/doc/existing_meta.json'))
NEW=json.load(open('/mnt/user-data/uploads/Downloads/doc_meta.json'))
def norm(w): return re.sub(r"[^\w']","",w).lower()
def W(s,word,n=1):
    k=0
    for w in A[str(s)]:
        if norm(w['w'])==word.lower():
            k+=1
            if k==n: return round(B[s-1]+w['s'],3)
    raise KeyError((s,word,n))
SB=lambda s,off=0: round(B[s-1]+off,3)
# ---- assets: key -> (path, credit label, source id, page, title)
AS={}
def img(key,path,label,ident,page,title,fit='cover'):
    w,h=Image.open(SITE+path).size; AS[key]=dict(k='img',src=path,w=w,h=h,label=label,id=ident,page=page,title=title,fit=fit)
def vid(key,path,label,ident,page,title):
    AS[key]=dict(k='vid',src=path,w=960,h=540,label=label,id=ident,page=page,title=title,fit='cover')
def ex(key,label,fit='cover'):
    m=EX[key]; img(key,EX[key]['path'],label,m['id'],m['page'],m['title'],fit)
def nw(key,file,nid,label,fit='cover'):
    m=NEW.get(nid,{}); img(key,'doc/img/'+file+'.jpg',label,nid,'https://images.nasa.gov/details/'+nid,m.get('title') or label,fit)
ex('hero','Apollo 17 · Earth on the way to the Moon','contain'); ex('earthset2026','Artemis II · Earthset over the lunar limb, 2026')
ex('valles','Viking Orbiter mosaic · Mars','contain'); ex('surveyor3','Surveyor 3, photographed by Apollo 12 · 1969')
ex('aldrin','Apollo 11 · Lunar Module descent stage · 1969'); ex('easep','Apollo 11 · seismometer and laser retroreflector · 1969')
ex('flag','Apollo 11 · Tranquility Base · 1969'); ex('earthrise','Apollo 8 · Earthrise · 1968')
ex('sojourner','Mars Pathfinder · Sojourner rover · 1997'); ex('spirit','Spirit rover · 2004')
ex('curiosity','Curiosity rover · 2015'); ex('perseverance','Perseverance and Ingenuity · 2021')
ex('gale','Curiosity · Gale Crater vista'); ex('insight','InSight lander · dust on its solar panels')
ex('orion_moon','Artemis I · Orion approaches the Moon · 2022'); ex('artemis2pad','Artemis II at Launch Pad 39B · 2026')
ex('hero_lrv','Apollo 17 · Lunar Roving Vehicle · 1972'); ex('lrv15','Apollo 15 · Lunar Roving Vehicle · 1971')
ex('alsep12','Apollo 12 · deploying the ALSEP experiments · 1969'); ex('m20_hw','Mars 2020 · rover, heat shield, parachute and descent stage seen from orbit')
ex('phx_orbit','Phoenix lander seen from orbit, nearly a decade after landing'); ex('edm_impact','Schiaparelli impact site · 2016','contain')
ex('heli_delta','Ingenuity flight paths over Jezero Crater'); ex('bea_orbit','Beagle 2 found in orbital images · 2015','contain')
nw('lro_a11','lro_a11','PIA12909','LRO · Apollo 11 landing site · 2009'); nw('lro_a14','lro_a14','PIA12889','LRO · Apollo 14 landing site · 2009')
nw('lro_a15','lro_a15','PIA13037','LRO · Apollo 15 site and its laser retroreflector · 2010'); nw('lro_earthrise','lro_earthrise','GSFC_20171208_Archive_e000496','LRO · Earth over the lunar horizon','contain')
nw('a11_psep','a11_psep','KSC-as11-40-5964','Apollo 11 · deploying the seismic experiment · 1969'); nw('vl1_footpad','vl1_footpad','PIA10738','Viking Lander 1 · footpad on Mars · 1976')
nw('vl1_pano','vl1_pano','PIA00382','Viking Lander 1 · first panorama from the surface of Mars · 1976'); nw('mpf_mosaic','mpf_mosaic','PIA00621','Mars Pathfinder lander and Sojourner · 1997')
nw('mpf_rover','mpf_rover','PIA00611','Mars Pathfinder · rover, airbags and Martian terrain · 1997'); nw('opp_tracks','opp_tracks','PIA22928','Opportunity · looking back over its tracks')
nw('opp_orbit','opp_orbit','PIA17941','Opportunity seen from orbit · 2014'); nw('spirit_sunset','spirit_sunset','PIA07997','Sunset at Gusev Crater, seen by Spirit · 2005')
img('a11_fullmoon','doc/img/a11_fullmoon.jpg','Apollo 11 · the full Moon on the journey home · 1969','AS11-44-6667','https://images.nasa.gov/details/as11-44-6667','View of a full Moon photographed from Apollo 11 spacecraft','contain')
img('a11_bootprint','doc/img/a11_bootprint.jpg','Apollo 11 · bootprint in the lunar soil · 1969','AS11-40-5880','https://images.nasa.gov/details/as11-40-5880','Close-up view of astronauts foot and footprint in lunar soil')
vid('a11_step','doc/clips/a11_step.mp4','Apollo 11 · television from the lunar surface · 1969','Apollo_11_moonwalk_montage_720p','https://images.nasa.gov/details/Apollo_11_moonwalk_montage_720p','Apollo 11 moonwalk montage')
vid('a11_flagv','doc/clips/a11_flag.mp4','Apollo 11 · the Lunar Module and flag · 1969','Apollo_11_moonwalk_montage_720p','https://images.nasa.gov/details/Apollo_11_moonwalk_montage_720p','Apollo 11 moonwalk montage')
A15P='https://images.nasa.gov/details/Apollo%2015%20Never%20Been%20on%20a%20Ride%20like%20this%20Before'
vid('a15_liftoff','doc/clips/a15_liftoff.mp4','Apollo 15 · the ascent stage leaves; the descent stage stays · 1971','Apollo 15 Never Been on a Ride like this Before',A15P,'Apollo 15: "Never Been on a Ride like this Before"')
vid('a15_drive','doc/clips/a15_drive.mp4','Apollo 15 · film from the Lunar Roving Vehicle · 1971','Apollo 15 Never Been on a Ride like this Before',A15P,'Apollo 15: "Never Been on a Ride like this Before"')
vid('a15_alsep','doc/clips/a15_alsep.mp4','Apollo 15 · ALSEP experiment on the surface · 1971','Apollo 15 Never Been on a Ride like this Before',A15P,'Apollo 15: "Never Been on a Ride like this Before"')
M20P='https://images.nasa.gov/details/JPL-20210222-M2020f-0001-Perseverance%20Rover%E2%80%99s%20Descent%20and%20Touchdown%20on%20Mars'
vid('m20_approach','doc/clips/m20_approach.mp4','Perseverance · descending toward Jezero Crater · 2021','JPL-20210222-M2020f-0001',M20P,'Perseverance Rover’s Descent and Touchdown on Mars')
vid('m20_heatshield','doc/clips/m20_heatshield.mp4','Perseverance · the heat shield falls away · 2021','JPL-20210222-M2020f-0001',M20P,'Perseverance Rover’s Descent and Touchdown on Mars')
vid('m20_skycrane','doc/clips/m20_skycrane.mp4','Perseverance · lowered to the surface · 2021','JPL-20210222-M2020f-0001',M20P,'Perseverance Rover’s Descent and Touchdown on Mars')
vid('a2_eclipse','doc/clips/a2_eclipse.mp4','Artemis II · the Moon in darkness, seen from Orion · 2026','art002m1200970119','https://images.nasa.gov/details/art002m1200970119','Artemis II flight day 6')
# ---- shots: (asset, start, kb from (fx,fy,s), kb to, extra)
SH=[]
def sh(a,t,f=(0.5,0.5,1.0),to=(0.5,0.5,1.08),**kw): SH.append(dict(a=a,t=round(t,3),f=list(f),to=list(to),**kw))
# Scene 1
sh('hero',0.0,(0.5,0.5,0.86),(0.5,0.5,0.98))
sh('a2_eclipse',W(1,'disappeared'),(0.5,0.5,1.0),(0.5,0.5,1.08),off=1.0)
sh('earthset2026',W(1,'across'),(0.35,0.5,1.0),(0.45,0.5,1.12))
sh('valles',W(1,'mars'),(0.5,0.5,0.9),(0.5,0.5,1.02))
sh('surveyor3',W(1,'fragments'),(0.45,0.5,1.0),(0.43,0.45,1.25))
sh('lro_earthrise',W(1,'they'),(0.5,0.45,0.95),(0.5,0.42,1.08))
# Scene 2
sh('a11_step',SB(2,-0.9),off=0.0)
sh('a15_liftoff',W(2,'but'),off=0.0)
sh('aldrin',W(2,'descent'),(0.55,0.5,1.05),(0.75,0.62,1.3))
sh('a11_psep',W(2,'scientific'),(0.5,0.45,1.0),(0.5,0.45,1.12))
sh('a11_flagv',W(2,'other'),off=0.0)
sh('flag',W(2,'each',1),(0.5,0.4,1.0),(0.55,0.42,1.15))
sh('lro_a11',W(2,'each',2),(0.5,0.5,1.0),(0.4,0.5,1.5))
# Scene 3
sh('lrv15',SB(3,-0.9),(0.5,0.55,1.05),(0.45,0.55,1.18))
sh('hero_lrv',W(3,'the',1),(0.45,0.5,1.0),(0.42,0.48,1.12))
sh('a15_drive',W(3,'across'),off=0.0)
sh('a15_alsep',W(3,'scientific'),off=0.5)
sh('easep',W(3,'retroreflectors'),(0.4,0.6,1.05),(0.3,0.68,1.35))
sh('earthrise',W(3,'distance'),(0.5,0.56,1.0),(0.5,0.52,1.12))
sh('lro_a15',W(3,'some'),(0.5,0.5,1.0),(0.32,0.5,1.6))
# Scene 4
sh('m20_approach',SB(4,-0.9),off=0.0)
sh('vl1_footpad',W(4,'in'),(0.2,0.5,1.0),(0.45,0.5,1.0))
sh('viking2_',0,)  # placeholder removed below
SH.pop()
sh('mpf_mosaic',W(4,'pathfinder'),(0.4,0.5,1.0),(0.48,0.6,1.15))
sh('sojourner',W(4,'sojourner'),(0.5,0.6,1.0),(0.52,0.62,1.12))
SH.append(dict(a='grid',t=W(4,'spirit'),items=[['spirit',W(4,'spirit'),'SPIRIT · 2004'],['opp_tracks',W(4,'opportunity'),'OPPORTUNITY · 2004'],['curiosity',W(4,'curiosity'),'CURIOSITY · 2012'],['perseverance',W(4,'perseverance'),'PERSEVERANCE · 2021']]))
sh('gale',W(4,'these'),(0.56,0.5,1.0),(0.69,0.5,1.0))
# Scene 5
sh('spirit_sunset',SB(5,-0.9),(0.5,0.6,1.0),(0.5,0.62,1.1))
sh('m20_heatshield',W(5,'some'),off=0.0)
sh('phx_orbit',W(5,'others'),(0.5,0.5,1.0),(0.6,0.75,1.4))
sh('insight',W(5,'harsh'),(0.5,0.5,1.0),(0.52,0.45,1.12))
sh('opp_orbit',W(5,'lost'),(0.5,0.5,1.0),(0.55,0.55,1.25))
sh('a11_fullmoon',W(5,'the',1),(0.5,0.5,0.9),(0.5,0.5,1.0))
sh('edm_impact',W(5,'unexpected'),(0.5,0.35,1.0),(0.5,0.35,1.08))
# Scene 6
sh('lro_a15',SB(6,-0.9),(0.5,0.5,1.0),(0.5,0.62,1.5))
sh('mpf_rover',W(6,'silent'),(0.4,0.75,1.1),(0.45,0.75,1.25))
sh('heli_delta',W(6,'every'),(0.4,0.5,1.0),(0.55,0.5,1.12))
sh('perseverance',W(6,'some'),(0.6,0.5,1.0),(0.65,0.45,1.15))
sh('vl1_pano',W(6,'others'),(0.2,0.25,1.6),(0.5,0.25,1.6))
sh('lro_a14',W(6,'orbital'),(0.5,0.5,1.0),(0.75,0.6,1.35))
sh('a11_bootprint',W(6,'what'),(0.5,0.45,1.0),(0.45,0.62,1.35))
# Scene 7
sh('m20_skycrane',SB(7,-0.9),off=0.0)
sh('orion_moon',W(7,'new',2),(0.6,0.55,1.0),(0.62,0.55,1.1))
sh('artemis2pad',W(7,'discoveries'),(0.5,0.4,1.0),(0.5,0.35,1.1))
sh('hero_lrv',W(7,'but'),(0.5,0.45,1.05),(0.5,0.45,1.2))
sh('opp_tracks',W(7,'their',1),(0.5,0.6,1.0),(0.5,0.5,1.15))
sh('earthset2026',W(7,'their',2),(0.6,0.5,1.0),(0.7,0.5,1.12))
SH.append(dict(a='duo',t=round(FINAL_T-0.4,3),items=['a11_fullmoon','valles']))
# end times
for i,s in enumerate(SH): s['e']=SH[i+1]['t'] if i+1<len(SH) else TOTAL
# ---- captions: sentence cues, long ones split at commas near the middle
CUES=[]
for sc in range(1,8):
    ws=A[str(sc)]; cur=[]
    def flush():
        if cur: CUES.append(dict(s=sc,w=[[w['w'],round(B[sc-1]+w['s'],3),round(B[sc-1]+min(w['e'],DUR[sc-1]),3)] for w in cur])); cur.clear()
    for w in ws:
        cur.append(w)
        txt=' '.join(x['w'] for x in cur)
        if w['w'][-1] in '.?': flush()
        elif w['w'][-1]==',' and len(txt)>38: 
            # look ahead: only split if the remaining sentence is long too
            rest=[]; 
            for x in ws[ws.index(w)+1:]:
                rest.append(x['w'])
                if x['w'][-1] in '.?': break
            if len(' '.join(rest))>24: flush()
    flush()
DATA=dict(total=TOTAL,lead=LEAD,B=B,dur=DUR,final=FINAL_T,titles=[TITLES[i] for i in range(1,8)],assets=AS,shots=SH,cues=CUES,
  audio=[f'audio/silent-legacy/scene-0{i}.mp3' for i in range(1,8)],music='audio/silent-legacy/score.mp3')
open(SITE+'doc/doc-data.js','w').write('/* THE SILENT LEGACY — timeline, shots and word-timed captions (generated from forced alignment of the narration MP3s). */\nwindow.FE_DOCDATA='+json.dumps(DATA,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(SH),'shots',len(CUES),'cues'); 
for c in CUES: print(round(c['w'][0][1],2),' '.join(x[0] for x in c['w']))
# shot duration check
for s in SH: print('%7.2f %5.2f %s'%(s['t'],s['e']-s['t'],s['a']))
# VTT / SRT
def ts(t,sep='.'): h=int(t//3600); m=int(t%3600//60); s=t%60; return f"{h:02d}:{m:02d}:{s:06.3f}".replace('.',sep)
v=["WEBVTT","","NOTE The Silent Legacy — English captions timed to the narration by forced alignment",""]; sr=[]
for i,c in enumerate(CUES):
    a=c['w'][0][1]-0.05; b=c['w'][-1][2]+0.35; t=' '.join(x[0] for x in c['w'])
    if i+1<len(CUES): b=min(b,CUES[i+1]['w'][0][1]-0.08)
    v+= [str(i+1), f"{ts(a)} --> {ts(b)}", t, ""]; sr+=[str(i+1), f"{ts(a,',')} --> {ts(b,',')}", t, ""]
open(SITE+'doc/silent-legacy.en.vtt','w').write('\n'.join(v)); open(SITE+'doc/silent-legacy.en.srt','w').write('\n'.join(sr))

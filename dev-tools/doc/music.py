"""Original score for THE SILENT LEGACY — procedurally synthesised (pads, strings, piano, pulse, sub, impacts).
Not derived from any existing soundtrack. Ducking under narration is baked in from the word alignment."""
import numpy as np, json, subprocess
from scipy.signal import butter, sosfilt, fftconvolve
from timeline import B, DUR, FINAL_T, TOTAL, A
SR=44100; N=int(TOTAL*SR)+SR
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def hz(m): return 440*2**((m-69)/12)
def lp(x,fc,o=2): return sosfilt(butter(o,min(fc,SR*0.45)/(SR/2),'low',output='sos'),x)
def hp(x,fc,o=2): return sosfilt(butter(o,fc/(SR/2),'high',output='sos'),x)
def env(n,a,r,sus=1.0):
    e=np.ones(n)*sus; ai=int(a*SR); ri=int(r*SR)
    if ai: e[:ai]=np.linspace(0,1,ai)**1.6*sus
    if ri: e[-ri:]*=np.linspace(1,0,ri)**1.4
    return e
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); s=sig[:j-i]*g
    L[i:j]+=s*np.cos((pan+1)*np.pi/4); R[i:j]+=s*np.sin((pan+1)*np.pi/4)
def saw(f,n,det=0.0,vib=0.0,vr=5.0):
    t=np.arange(n)/SR; ff=f*(1+det)*(1+vib*np.sin(2*np.pi*vr*t+rng.uniform(0,6)))
    ph=np.cumsum(ff)/SR+rng.uniform(); return 2*(ph%1)-1
def pad(notes,t,d,g,fc=900,a=2.0,r=2.5,bright=0.0):
    n=int((d+r)*SR)
    for k,m in enumerate(notes):
        f=hz(m); s=np.zeros(n)
        for det in (-0.006,0.0,0.0065): s+=saw(f,n,det,0.002,0.25+0.1*k)
        s=lp(s,fc*(1+bright)+f*1.5,2)*env(n,a,r)/3
        add(s,t,pan=((k%2)*2-1)*0.45,g=g/len(notes)**0.5)
def strings(notes,t,d,g,a=2.5,r=3.0):
    n=int((d+r)*SR)
    for k,m in enumerate(notes):
        f=hz(m); s=np.zeros(n)
        for det in (-0.004,-0.0015,0.0015,0.004): s+=saw(f,n,det,0.004,5.2+0.3*k)
        s=hp(lp(s,2600,2),180)*env(n,a,r)/4
        add(s,t,pan=np.linspace(-.6,.6,len(notes))[k] if len(notes)>1 else 0,g=g/len(notes)**0.5)
def piano(m,t,g,dec=3.5,pan=0.0):
    f=hz(m); n=int((dec+1)*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for k in range(1,9):
        fk=k*f*np.sqrt(1+0.0004*k*k)
        if fk>SR*0.45: break
        s+=np.sin(2*np.pi*fk*tt+rng.uniform(0,6))*(1/k**1.3)*np.exp(-tt*(1.0+0.55*k)/dec*2.2)
    s*=np.minimum(1,tt/0.004); add(s*0.5,t,pan,g)
def pluck(m,t,g,pan=0.0):
    f=hz(m); n=int(0.9*SR); tt=np.arange(n)/SR
    s=saw(f,n,0.003)+saw(f,n,-0.003); s=lp(s,1400+f,2)*np.exp(-tt*5.5)*np.minimum(1,tt/0.003)
    add(s*0.35,t,pan,g)
def sub(m,t,d,g):
    n=int(d*SR); tt=np.arange(n)/SR; s=np.sin(2*np.pi*hz(m)*tt)+0.25*np.sin(4*np.pi*hz(m)*tt)
    add(s*env(n,3,3),t,0,g)
def impact(t,g,big=False):
    g*=0.55
    n=int(5*SR); tt=np.arange(n)/SR
    f=38+(70 if big else 50)*np.exp(-tt*6); ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph)*np.exp(-tt*(0.9 if big else 1.4))
    nz=lp(rng.normal(0,1,n),900 if big else 600,2)*np.exp(-tt*3.2)*0.5
    s=(s+nz)*np.minimum(1,tt/0.008); add(s,t,0,g)
    sw=int(2.2*SR); x=lp(rng.normal(0,1,sw),2500,2)*np.linspace(0,1,sw)**3*0.12   # soft riser into the hit
    add(x,t-2.2,0,g*0.8)
# ---- harmony map (MIDI); D minor world, resolves to D major at the end
Dm=[50,57,62,65]; Bb=[46,53,58,62]; F=[41,48,53,57,60]; C=[48,55,60,64]; Gm=[43,50,55,58]; A_=[45,52,57,61]; D=[50,57,62,66]; Am=[45,52,57,60]
PROG={1:[Dm,Dm,Bb,Bb],2:[Dm,Bb,F,C],3:[Dm,Bb,F,C],4:[F,C,Dm,Bb],5:[Gm,Dm,A_,Dm],6:[Bb,F,C,Dm],7:[Bb,C,Dm,Bb]}
BAR=3.75
def scene_at(t):
    s=1
    for i,b in enumerate(B):
        if t>=b-1.0: s=i+1
    return s
t=0.0; bars=[]
while t<FINAL_T-0.5:
    sc=scene_at(t+0.01); idx=len([b for b in bars if b[1]==sc]); ch=PROG[sc][idx%4]; bars.append((t,sc,ch)); t+=BAR
LV={1:(.55,0,0,0,.6),2:(.6,.18,.3,0,.6),3:(.6,.25,.25,.35,.6),4:(.65,.35,.2,.55,.7),5:(.55,.2,.35,.15,.65),6:(.7,.5,.35,.45,.75),7:(.75,.6,.3,.35,.8)}
# (pad, strings, piano, pulse, sub)
for (t0,sc,ch) in bars:
    p,s_,pi,pu,sb=LV[sc]; ramp={1:.8,2:.85,3:.92,4:1.0,5:.9,6:1.08,7:1.15}[sc]
    if sc==1: ramp*=min(1,0.25+t0/12)
    pad(ch,t0,BAR,0.22*p*ramp,fc=700+150*sc)
    if s_: strings([c+12 for c in ch[1:]],t0,BAR,0.16*s_)
    if sb: sub(ch[0]-12 if ch[0]>=46 else ch[0],t0,BAR+1.5,0.20*sb*ramp)
    if pi:
        top=[c+24 for c in ch[1:]]
        for k in range(4):
            if rng.random()<0.75: piano(top[rng.integers(len(top))]+(12 if rng.random()<.3 else 0),t0+k*BAR/4+rng.uniform(0,0.05),0.22*pi,pan=rng.uniform(-.5,.5))
    if pu:
        arp=[ch[1]+12,ch[2]+12,ch[3]+12,ch[2]+12]
        for k in range(16): pluck(arp[k%4]+(12 if sc in (4,6) and k%8==6 else 0),t0+k*BAR/16,0.16*pu*(1.0 if k%4==0 else .7),pan=(-.4 if k%2 else .4))
# opening: piano motif in the dark
for k,(m,tt) in enumerate([(74,0.6),(69,1.6),(72,2.4),(77,3.4)]): piano(m,tt,0.16)
# transition hits
impact(B[1]-0.6,0.55); impact(B[2]-0.6,0.35); impact(B[3]-0.7,0.75,True); impact(B[4]-0.6,0.4); impact(B[5]-0.6,0.6,True); impact(B[6]-0.6,0.4)
# finale: D major swell under the title, emotional resolution and long tail
impact(FINAL_T-0.1,0.9,True)
fin=TOTAL-FINAL_T+1
pad(D+[69,74],FINAL_T-0.4,fin-3.0,0.30,fc=1400,a=1.2,r=3.2)
strings([62,66,69,74,78],FINAL_T-0.4,fin-3.0,0.26,a=1.5,r=3.2)
sub(38,FINAL_T-0.4,fin,0.22)
for m,tt in [(74,0.4),(78,1.4),(81,2.4),(86,3.6)]: piano(m,FINAL_T+tt,0.2,dec=5)
# ---- reverb
irn=int(3.2*SR); ti=np.arange(irn)/SR
irL=rng.normal(0,1,irn)*np.exp(-ti*2.1); irR=rng.normal(0,1,irn)*np.exp(-ti*2.1)
irL=lp(irL,5000); irR=lp(irR,5000); irL/=np.sqrt((irL**2).sum()); irR/=np.sqrt((irR**2).sum())
wL=fftconvolve(L,irL)[:N]; wR=fftconvolve(R,irR)[:N]
L2=L*0.65+wL*0.55; R2=R*0.65+wR*0.55
L2=hp(L2,28); R2=hp(R2,28)
# ---- ducking from narration speech spans
g=np.full(N,1.0)
ts=np.arange(N)/SR
speech=np.zeros(N,bool)
for i in range(7):
    ws=A[str(i+1)]; segs=[]; cs,ce=ws[0]['s'],ws[0]['e']
    for w in ws[1:]:
        if w['s']-ce<0.7: ce=w['e']
        else: segs.append((cs,ce)); cs,ce=w['s'],w['e']
    segs.append((cs,ce))
    for a,b in segs: speech[int((B[i]+a)*SR):int((B[i]+min(b,DUR[i]))*SR)]=True
target=np.where(speech,0.42,1.0)
# one-pole smoothing: fast duck (0.35 s), slow recovery (1.1 s)
from scipy.signal import lfilter
def smooth(x,tc): a=np.exp(-1/(tc*SR)); return lfilter([1-a],[1,-a],x)
down=smooth(target,0.35); up=smooth(target,1.1); g=np.minimum(down,up)
# lead-in fade and final fade to black
g*=np.clip(ts/2.0,0,1); g*=np.clip((TOTAL-ts)/FADE_ if (FADE_:=2.8) else 1,0,1)
L2*=g; R2*=g
# ---- level: music under speech ≈ -17 dB vs narration RMS, gaps ≈ -9.5 dB
nar=np.concatenate([np.frombuffer(open(f'/home/claude/fe/doc/audio/scene-0{i}.raw','rb').read(),np.int16).astype(float)/32768 for i in range(1,8)])
nar_rms=np.sqrt(np.mean(nar[np.abs(nar)>0.01]**2))
mus=np.sqrt((L2**2+R2**2)/2); mus_sp=np.sqrt(np.mean(mus[speech]**2))
k=nar_rms*10**(-17/20)/mus_sp; L2*=k; R2*=k
pk=max(np.abs(L2).max(),np.abs(R2).max()); print('narr rms',nar_rms,'scale',k,'peak',pk)
if pk>0.95: L2*=0.95/pk; R2*=0.95/pk
print('gap level dB vs narr', 20*np.log10(np.sqrt(np.mean(((L2**2+R2**2)/2)[(~speech)&(ts>B[0])&(ts<FINAL_T)]))/nar_rms))
out=(np.stack([L2,R2],1)[:int(TOTAL*SR)]*32767).astype(np.int16)
out.tofile('/home/claude/fe/doc/music.raw')
subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(SR),"-ac","2","-i","/home/claude/fe/doc/music.raw","-c:a","libmp3lame","-b:a","128k","/home/claude/fe/doc/silent-legacy-score.mp3"],check=True)

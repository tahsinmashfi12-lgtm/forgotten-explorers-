"""Original instrumental score for THE MOON: HUMANITY'S JOURNEY TO ANOTHER WORLD.
Procedurally synthesised here (pads, strings, piano, pulses, sub, bells). Not derived from any existing recording.
One stem per chapter, kept separate from narration; the player mixes them with independent volume controls."""
import numpy as np, subprocess, json, sys
from scipy.signal import butter, sosfilt, fftconvolve
SR=44100
DUR=[48.77,53.97,67.55,66.27,67.63,80.35]
def hz(m): return 440*2**((m-69)/12)
def lp(x,fc,o=2): return sosfilt(butter(o,min(fc,SR*0.45)/(SR/2),'low',output='sos'),x)
def hp(x,fc,o=2): return sosfilt(butter(o,fc/(SR/2),'high',output='sos'),x)
def env(n,a,r):
    e=np.ones(n); ai=int(a*SR); ri=int(r*SR)
    if ai: e[:ai]=np.linspace(0,1,ai)**1.6
    if ri: e[-ri:]*=np.linspace(1,0,ri)**1.4
    return e
class Track:
    def __init__(s,d,seed):
        s.N=int((d+3)*SR); s.L=np.zeros(s.N); s.R=np.zeros(s.N); s.rng=np.random.default_rng(seed); s.d=d
    def add(s,sig,t,pan=0.0,g=1.0):
        i=int(t*SR)
        if i>=s.N: return
        j=min(s.N,i+len(sig)); x=sig[:j-i]*g
        s.L[i:j]+=x*np.cos((pan+1)*np.pi/4); s.R[i:j]+=x*np.sin((pan+1)*np.pi/4)
    def saw(s,f,n,det=0.0,vib=0.0,vr=5.0):
        t=np.arange(n)/SR; ff=f*(1+det)*(1+vib*np.sin(2*np.pi*vr*t+s.rng.uniform(0,6)))
        ph=np.cumsum(ff)/SR+s.rng.uniform(); return 2*(ph%1)-1
    def pad(s,notes,t,d,g,fc=900,a=2.0,r=2.5):
        n=int((d+r)*SR)
        for k,m in enumerate(notes):
            f=hz(m); x=np.zeros(n)
            for det in (-0.006,0.0,0.0065): x+=s.saw(f,n,det,0.002,0.25+0.1*k)
            x=lp(x,fc+f*1.5,2)*env(n,a,r)/3
            s.add(x,t,pan=((k%2)*2-1)*0.45,g=g/len(notes)**0.5)
    def strings(s,notes,t,d,g,a=2.5,r=3.0,fc=2600):
        n=int((d+r)*SR)
        for k,m in enumerate(notes):
            f=hz(m); x=np.zeros(n)
            for det in (-0.004,-0.0015,0.0015,0.004): x+=s.saw(f,n,det,0.004,5.2+0.3*k)
            x=hp(lp(x,fc,2),160)*env(n,a,r)/4
            s.add(x,t,pan=np.linspace(-.6,.6,len(notes))[k] if len(notes)>1 else 0,g=g/len(notes)**0.5)
    def piano(s,m,t,g,dec=3.5,pan=0.0):
        f=hz(m); n=int((dec+1)*SR); tt=np.arange(n)/SR; x=np.zeros(n)
        for k in range(1,9):
            fk=k*f*np.sqrt(1+0.0004*k*k)
            if fk>SR*0.45: break
            x+=np.sin(2*np.pi*fk*tt+s.rng.uniform(0,6))*(1/k**1.3)*np.exp(-tt*(1.0+0.55*k)/dec*2.2)
        x*=np.minimum(1,tt/0.004); s.add(x*0.5,t,pan,g)
    def bell(s,m,t,g,pan=0.0):
        f=hz(m); n=int(4*SR); tt=np.arange(n)/SR
        x=sum(np.sin(2*np.pi*f*r*tt)*a*np.exp(-tt*dk) for r,a,dk in ((1,1,1.1),(2.76,.45,2.2),(5.4,.25,3.5),(8.93,.12,5)))
        s.add(x*np.minimum(1,tt/0.002)*0.25,t,pan,g)
    def pluck(s,m,t,g,pan=0.0,dk=5.5):
        f=hz(m); n=int(0.9*SR); tt=np.arange(n)/SR
        x=s.saw(f,n,0.003)+s.saw(f,n,-0.003); x=lp(x,1400+f,2)*np.exp(-tt*dk)*np.minimum(1,tt/0.003)
        s.add(x*0.35,t,pan,g)
    def sub(s,m,t,d,g):
        n=int(d*SR); tt=np.arange(n)/SR; x=np.sin(2*np.pi*hz(m)*tt)+0.25*np.sin(4*np.pi*hz(m)*tt)
        s.add(x*env(n,3,3),t,0,g)
    def air(s,t,d,g,fc=700):
        n=int(d*SR); x=lp(hp(s.rng.normal(0,1,n),200),fc,2)*env(n,4,4); s.add(x*0.08,t,s.rng.uniform(-.5,.5),g)
    def timp(s,t,g):
        n=int(3*SR); tt=np.arange(n)/SR; f=55+30*np.exp(-tt*8)
        x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*1.6)+lp(s.rng.normal(0,1,n),500)*np.exp(-tt*6)*0.3
        s.add(x*np.minimum(1,tt/0.006),t,0,g)
    def render(s,path,fade_in=1.5,fade_out=4.0,end_silence=False):
        # small stereo room reverb
        n=int(2.8*SR); tt=np.arange(n)/SR
        ir=s.rng.normal(0,1,(2,n))*np.exp(-tt*2.3); ir[:,:int(0.01*SR)]=0
        L=s.L+0.22*fftconvolve(s.L,ir[0])[:s.N]/40; R=s.R+0.22*fftconvolve(s.R,ir[1])[:s.N]/40
        st=np.stack([L,R],1); st=hp(st.T,30).T
        tot=int((s.d+2.5)*SR); st=st[:tot]
        fi=int(fade_in*SR); st[:fi]*=np.linspace(0,1,fi)[:,None]
        fo=int(fade_out*SR); st[-fo:]*=(np.linspace(1,0,fo)**2)[:,None]
        st/=np.max(np.abs(st))+1e-9; st*=0.6
        # loudness: target ~ -20 dBFS RMS so it sits under narration by default
        rms=np.sqrt(np.mean(st**2)); st*=min(1.0,10**(-20/20)/rms) if rms>0 else 1
        raw=(np.clip(st,-1,1)*32767).astype('<i2').tobytes()
        subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','2','-i','-','-c:a','libmp3lame','-b:a','112k',path],input=raw,check=True)

def ch1(d):  # mysterious, slow build — D dorian, low drones, distant bells, slowly thickening
    T=Track(d,11); T.sub(26,0,d,0.5); T.air(0,d,0.8,500)
    ch=[[50,57,62],[50,57,64],[48,55,62],[50,57,65]]
    for i,t in enumerate(np.arange(0,d,12)): T.pad(ch[i%4],t,13,0.35+0.05*i,fc=500+80*i,a=4,r=4)
    for k,t in enumerate(np.arange(6,d,4.2)): T.bell([74,77,81,79,72,76][k%6],t,0.35+k*0.02,pan=np.sin(k))
    T.strings([62,69],d*0.55,d*0.45,0.25,a=8,r=4,fc=1500)
    for t in np.arange(d*0.6,d-2,1.0): T.pluck(50,t,0.15+0.25*(t-d*0.6)/(d*0.4),dk=4)
    return T
def ch2(d):  # grand, inspiring — D major, strings + brass-like pad, timpani
    T=Track(d,22); prog=[[50,57,62,66],[47,54,59,62,66],[43,50,55,59],[45,52,57,61,64]]
    for i,t in enumerate(np.arange(0,d,6)):
        c=prog[i%4]; T.strings([x+12 for x in c],t,6.5,0.55 if i>0 else 0.35,a=1.5 if i else 4,r=2.5)
        T.pad(c,t,6.5,0.4,fc=1400,a=1.2,r=2); T.sub(c[0]-12,t,6.5,0.35)
        if i>0: T.timp(t,0.45)
    mel=[74,76,78,81,79,78,76,74,78,79,81,83,81,78,79,74]
    for k,t in enumerate(np.arange(6,d-4,3)): T.piano(mel[k%len(mel)]+12*(k>=8),t,0.35,dec=4)
    return T
def ch3(d):  # melancholic, restrained — A minor, solo piano + sparse strings
    T=Track(d,33); prog=[[45,52,57,60],[41,48,53,57],[43,50,55,59],[40,47,52,56]]
    for i,t in enumerate(np.arange(0,d,8)):
        c=prog[i%4]; T.pad(c,t,8.5,0.28,fc=600,a=3,r=3); T.sub(c[0]-12,t,8.5,0.2)
        for j,x in enumerate([c[1]+12,c[2]+12,c[3]+12,c[2]+12]): T.piano(x,t+j*2,0.32,dec=5,pan=-.2+.13*j)
    mel=[72,71,69,67,69,64,65,64]
    for k,t in enumerate(np.arange(16,d-6,4)): T.strings([mel[k%8]],t,3.8,0.2,a=1.2,r=2,fc=1800)
    return T
def ch4(d):  # futuristic, curious — E lydian arps, glassy plucks, soft pulse
    T=Track(d,44); prog=[[52,59,64,70],[50,57,62,69],[48,55,64,71],[52,59,66,71]]
    for i,t in enumerate(np.arange(0,d,8)):
        c=prog[i%4]; T.pad(c,t,8.5,0.3,fc=1200,a=2,r=2.5); T.sub(c[0]-12,t,8.5,0.22)
        arp=[c[0]+12,c[1]+12,c[2]+12,c[3]+12,c[2]+12,c[1]+12]
        for k,tt in enumerate(np.arange(t,t+8,1/3)):
            if tt<d-1: T.pluck(arp[k%6]+(12 if k%12>8 else 0),tt,0.22,pan=np.sin(k*0.7)*0.6,dk=7)
    for k,t in enumerate(np.arange(4,d-3,5.5)): T.bell([83,88,86,90][k%4],t,0.22,pan=(-1)**k*0.5)
    return T
def ch5(d):  # hopeful, technological — G major, rising pulse, warm strings
    T=Track(d,55); prog=[[43,50,55,59],[40,47,52,55],[48,55,60,64],[50,57,62,66]]
    for i,t in enumerate(np.arange(0,d,7)):
        c=prog[i%4]; T.strings([x+12 for x in c],t,7.5,0.38+0.02*i,a=2,r=2.5); T.pad(c,t,7.5,0.3,fc=1300,a=1.5,r=2); T.sub(c[0]-12,t,7.5,0.25)
        for k,tt in enumerate(np.arange(t,t+7,0.5)):
            if tt<d-1: T.pluck(c[(k*2)%4]+24,tt,0.16+0.004*i,pan=0.4*(-1)**k,dk=6)
    mel=[74,76,79,78,76,74,71,74]
    for k,t in enumerate(np.arange(7,d-4,3.5)): T.piano(mel[k%8]+12,t,0.28,dec=3.5)
    return T
def ch6(d):  # minimal, fading to silence — D minor → D, thinning out to nothing before the last line
    T=Track(d,66); end=d-6.0
    T.sub(38,0,end,0.3); T.air(0,end,0.6,450)
    prog=[[50,57,62,65],[46,53,58,62],[48,55,60,64],[50,57,62,66]]
    for i,t in enumerate(np.arange(0,end,10)):
        g=0.32*(1-t/end)**0.7; T.pad(prog[i%4],t,10.5,g,fc=650,a=4,r=4)
    notes=[74,72,69,65,69,72,74,77,74,69]
    for k,t in enumerate(np.arange(3,end-4,4.5)): T.piano(notes[k%10],t,0.3*(1-t/end)**0.5,dec=6)
    T.bell(74,end-3,0.15)
    return T
if __name__=='__main__':
    out=sys.argv[1]; info=[]
    for i,(f,d) in enumerate(zip([ch1,ch2,ch3,ch4,ch5,ch6],DUR),1):
        p=f'{out}/moon_score_0{i}.mp3'; T=f(d)
        T.render(p,fade_in=3.0 if i==1 else 1.2,fade_out=8.0 if i==6 else 3.5)
        info.append(p)
    print(json.dumps(info))

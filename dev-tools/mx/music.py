"""Original ambient score for MARS: THE JOURNEY, THE MACHINES & THE LEGACY — one continuous track (procedural synthesis, no samples)."""
import sys,json,numpy as np
sys.path.insert(0,'/home/claude/fe/md')
from music import Track,SR,lp,hp,env,hz
T=json.load(open('timeline.json'));TOT=T['total'];O=T['offs'];D=T['durs']
tr=Track(TOT-2.5,2026)   # render() appends 2.5 s; total length = TOT
def wind(t,d,g,fc=380):
    n=int(d*SR);x=tr.rng.normal(0,1,n);x=lp(hp(x,90),fc,2)
    m=0.6+0.4*np.sin(2*np.pi*np.arange(n)/SR*0.07+tr.rng.uniform(0,6));tr.add(x*m*env(n,5,5)*0.06,t,tr.rng.uniform(-.6,.6),g)
# whole-piece bed: low drone + martian wind
tr.sub(26,0,TOT-1,0.28); wind(0,TOT-1,1.0); wind(0,TOT-1,0.7,700)
# opening: stars/reveal (0..9): high shimmer + slow swell
for k,t in enumerate(np.arange(0.8,9,1.6)): tr.bell([86,81,88,79,84][k%5],t,0.12+0.02*k,pan=np.sin(k*1.3)*0.6)
tr.pad([50,57,64],0,10.5,0.25,fc=500,a=6,r=3)
# chapter harmonies (D minor modal world; ch5 brighter; ch6 darkest; ch7 opens to D major)
H=[[[50,57,62,65],[48,55,62,64],[46,53,60,65],[50,57,62,64]],        # 1 mysterious
   [[50,57,62,65],[53,60,65,69],[48,55,60,67],[50,57,62,69]],        # 2 first attempts
   [[45,52,57,60],[48,55,60,64],[43,50,55,62],[45,52,57,64]],        # 3 first contact
   [[50,57,62,66],[47,54,59,62],[43,50,55,62],[45,52,57,61]],        # 4 first wheels (warmer)
   [[43,50,55,59],[40,47,52,59],[48,55,60,64],[50,57,62,66]],        # 5 new generation (hopeful)
   [[38,45,50,53],[41,48,53,57],[34,41,46,50],[36,43,48,52]],        # 6 forgotten (dark, low)
   [[50,57,62,65],[46,53,58,62],[48,55,60,64],[50,57,62,66]]]        # 7 future -> D major
MEL=[[74,72,69,67],[74,77,76,72],[69,72,74,76],[74,78,81,79],[79,81,83,86],[69,67,65,62],[74,76,78,81]]
for c in range(7):
    a=O[c]-1.5; b=O[c]+D[c]+ (T['gap'] if c<6 else 4.0); seg=b-a; step=seg/ max(4,round(seg/10))
    for i,t in enumerate(np.arange(a,b-1,step)):
        ch=H[c][i%4]; g=0.30 if c!=5 else 0.26
        tr.pad(ch,t,step+0.8,g,fc=520 if c in (0,5) else 760,a=3.5,r=3.5)
        if c in (3,4,6): tr.strings([x+12 for x in ch[1:3]],t,step+0.8,0.12,a=4,r=3,fc=1700)
    # sparse piano/bell motif, placed mainly near the chapter boundaries (music rises between narration)
    for j,t in enumerate([a+0.4,a+1.6,a+2.8]+list(np.arange(a+9,b-4,8.5))):
        m=MEL[c][j%4]
        if c==5: tr.piano(m,t,0.20,dec=6,pan=-.2)
        elif c in (0,1): tr.bell(m+12,t,0.16,pan=np.sin(j)*0.5)
        else: tr.piano(m,t,0.20,dec=4.5,pan=np.sin(j)*0.3)
    if c<6: # transition swell into next chapter title
        tb=O[c]+D[c]; n=int(T['gap']*SR+SR); x=lp(tr.rng.normal(0,1,n),900,2)*np.linspace(0,1,n)**2*np.linspace(1,0,n)**0.5*0.05; tr.add(x,tb,0,1)
        tr.bell(MEL[c+1][0]+12,tb+T['gap']-0.4,0.18)
# ending: final chord holds under the last lines, then fades
tr.pad([50,57,62,66,69],O[6]+38,TOT-(O[6]+38),0.3,fc=700,a=4,r=5)
tr.render(sys.argv[1],fade_in=4.0,fade_out=7.0)
print('ok',TOT)

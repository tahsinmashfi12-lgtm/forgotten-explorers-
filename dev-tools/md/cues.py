import json,re
a=json.load(open('asr.json'))
FIX=[(r' -','-'),(r" '","'"),(r'\bLunahod\b','Lunokhod'),(r'\bSORAQ\b','SORA-Q'),(r'Lunokhod-(\d)',r'Lunokhod \1'),(r'\bmoon\b','Moon'),(r'South Polar region','south polar region'),(r'\bmoon\'s\b',"Moon's")]
out={}
for k,segs in a.items():
    W=[w for s in segs for w in s['w']]
    cues=[];cur=[]
    for w in W:
        cur.append(w)
        if re.search(r'[.!?]["”]?$',w[0]) and not re.fullmatch(r'(e\.g\.|Mr\.)',w[0]):
            cues.append(cur);cur=[]
    if cur:cues.append(cur)
    C=[]
    for c in cues:
        t=' '.join(x[0].strip() for x in c)
        for p,r in FIX: t=re.sub(p,r,t)
        C.append({'s':round(c[0][1],2),'e':round(c[-1][2],2),'t':t})
    out[k]=C
json.dump(out,open('cues.json','w'),ensure_ascii=False,indent=0)
for k,C in out.items():
    print('==',k)
    for i,c in enumerate(C): print(i,c['s'],c['e'],c['t'])

import json,re
a=json.load(open('asr.json'));T=json.load(open('timeline.json'))
FIX=[(r' -','-'),(r" '","'"),(r'\bOther landers in spacecraft\b','Other landers and spacecraft'),(r'\bForgotten explorers\b','Forgotten Explorers'),(r'\bGale crater\b','Gale Crater'),(r'\bJezero crater\b','Jezero Crater')]
out=[]
for ci,k in enumerate(sorted(a)):
    W=[w for s in a[k] for w in s['w']];cues=[];cur=[]
    for w in W:
        cur.append(w)
        if re.search(r'[.!?]$',w[0]): cues.append(cur);cur=[]
    if cur:cues.append(cur)
    C=[]
    for c in cues:
        t=' '.join(x[0].strip() for x in c)
        for p,r in FIX: t=re.sub(p,r,t)
        C.append([round(c[0][1],2),round(c[-1][2],2),t])
    out.append(C)
json.dump(out,open('cues.json','w'),ensure_ascii=False,indent=0)
for ci,C in enumerate(out):
    print('== ch',ci+1,'off',T['offs'][ci])
    for j,c in enumerate(C): print(j,c[0],c[1],c[2])

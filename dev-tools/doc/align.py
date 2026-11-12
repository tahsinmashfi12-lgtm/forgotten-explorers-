import re, json
from pocketsphinx import Decoder
from script import S
NUM={"1969":"nineteen sixty nine","11":"eleven","1976":"nineteen seventy six"}
d=Decoder()
d.add_word("retroreflectors","R EH T R OW R IH F L EH K T ER Z",True)
out={}
for k,text in S.items():
    disp=text.split()  # display tokens with punctuation
    toks=[];own=[]
    for i,w in enumerate(disp):
        core=re.sub(r"[^\w']","",w).lower().replace("’","'")
        sp=NUM.get(core,core).split()
        for s in sp: toks.append(s); own.append(i)
    raw=open(f'/home/claude/fe/doc/audio/scene-0{k}.raw','rb').read()
    d.set_align_text(" ".join(toks))
    d.start_utt(); d.process_raw(raw,full_utt=True); d.end_utt()
    al=[(sg.word,sg.start_frame,sg.end_frame-sg.start_frame+1) for sg in d.seg()]
    al=[(re.sub(r"\(\d+\)$","",a[0]),a[1],a[2]) for a in al if a[0] not in ("<sil>","<s>","</s>","[NOISE]","(NULL)")]
    assert len(al)==len(toks),(k,len(al),len(toks))
    ws=[]
    for i,w in enumerate(disp):
        idx=[j for j,o in enumerate(own) if o==i]
        st=al[idx[0]][1]/100; en=(al[idx[-1]][1]+al[idx[-1]][2])/100
        ws.append({"w":w,"s":round(st,2),"e":round(en,2)})
    out[k]=ws
    d.set_search("_default") if False else None
json.dump(out,open('../align.json','w'),indent=0,ensure_ascii=False)
for k,ws in out.items(): print(k, len(ws), ws[0], ws[-1])

import json,sys,subprocess,numpy as np
def load(p):
    r=subprocess.run(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True,check=True)
    return np.frombuffer(r.stdout,np.float32)
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[1],device="cpu",compute_type="int8")
out={}
for i,f in enumerate(["mars_0%d"%k for k in range(1,8)]):
    segs,info=m.transcribe(load(f"audio/{f}.mp3"),language="en",word_timestamps=True,beam_size=5,initial_prompt="Mars, Mariner 4, Mariner 9, Mars 2, Mars 3, Viking, Mars Global Surveyor, Mars Odyssey, Mars Express, Mars Reconnaissance Orbiter, MAVEN, Mangalyaan, Hope, Tianwen-1, Zhurong, ExoMars, Trace Gas Orbiter, Pathfinder, Sojourner, Spirit, Opportunity, Phoenix, Curiosity, Perseverance, Jezero, Ingenuity, Rosalind Franklin, Tianwen-3, Forgotten Explorers.")
    segs=list(segs)
    out[f]=[{"s":s.start,"e":s.end,"t":s.text.strip(),"w":[[w.word.strip(),round(w.start,2),round(w.end,2),round(w.probability,2)] for w in s.words]} for s in segs]
    print(f,"|"," ".join(s.text.strip() for s in segs),flush=True)
json.dump(out,open("asr.json","w"),indent=0)

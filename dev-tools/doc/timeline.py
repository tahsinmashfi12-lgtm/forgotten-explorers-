import json, subprocess
from script import S, TITLES
DUR=[]
for i in range(1,8):
    d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"/home/claude/fe/doc/audio/scene-0{i}.mp3"]).decode())
    DUR.append(round(d,3))
LEAD=4.0; GAP=1.9; OUTRO_HOLD=1.2; FINAL=7.5; FADE=2.5
B=[LEAD]
for i in range(6): B.append(round(B[-1]+DUR[i]+GAP,3))
E7=B[6]+DUR[6]
FINAL_T=round(E7+OUTRO_HOLD,3)
TOTAL=round(FINAL_T+FINAL+FADE,3)
A=json.load(open('/home/claude/fe/doc/align.json'))
if __name__=="__main__":
    print(DUR,B,FINAL_T,TOTAL)

# -*- coding: utf-8 -*-
import json, re
plan=json.load(open(r'W:/ppt/postppt.json',encoding='utf-8'))
content=plan['content']
secs = re.split(r'\n##\s+', '\n'+content)
sec=[p for p in secs if p.startswith('落地前景')][0]
def norm(s): return re.sub(r'[#*\n\r\t 　]+','',s)
mine=''
for f in ['rec_p1.json','rec_p2.json','rec_p3.json']:
    r=json.load(open(f,encoding='utf-8'))
    for sh in r['shapes']:
        if sh.get('kind')=='text': mine+=sh['text']+'\n'
sn=norm(sec); mn=norm(mine)
# char-level: which source substrings (sliding 8-grams) absent from mine?
absent=[]
i=0
while i < len(sn)-8:
    g=sn[i:i+8]
    if g not in mn:
        absent.append((i,g))
        i+=8
    else:
        i+=1
print('total source 8-grams checked, absent windows:', len(absent))
# merge contiguous
gaps=[]
for idx,g in absent:
    gaps.append(g)
for g in gaps:
    print('  GAP:', g)
PYEOF=None

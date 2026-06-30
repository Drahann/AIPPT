# -*- coding: utf-8 -*-
import json, re, difflib
plan=json.load(open(r'W:/ppt/postppt.json',encoding='utf-8'))
content=plan['content']
secs = re.split(r'\n##\s+', '\n'+content)
sec=None
for p in secs:
    if p.startswith('落地前景'):
        sec=p; break
assert sec, "section not found"
print('SOURCE 落地前景 char length:', len(sec))

def norm(s):
    return re.sub(r'[#*\n\r\t 　]+','',s)

mine=''
for f in ['rec_p1.json','rec_p2.json','rec_p3.json']:
    r=json.load(open(f,encoding='utf-8'))
    for sh in r['shapes']:
        if sh.get('kind')=='text': mine+=sh['text']+'\n'
mine_norm=norm(mine)
print('MY total text length:', len(mine))

src_sents=[x for x in re.split(r'[。；]', sec) if len(norm(x))>6]
missing=[]
for s in src_sents:
    sn=norm(s)
    found = sn in mine_norm
    if not found:
        sm=difflib.SequenceMatcher(None, sn, mine_norm)
        m=sm.find_longest_match(0,len(sn),0,len(mine_norm))
        if m.size >= max(10, int(len(sn)*0.55)):
            found=True
    if not found:
        missing.append(s.strip())
print('source sentences(>6 chars):', len(src_sents), '| NOT covered:', len(missing))
for m in missing:
    print('  MISSING ::', m[:110])

# -*- coding: utf-8 -*-
import json, re
plan=json.load(open(r'W:/ppt/postppt.json',encoding='utf-8'))
content=plan['content']
secs = re.split(r'\n##\s+', '\n'+content)
sec=[p for p in secs if p.startswith('落地前景')][0]

# strip: markdown, whitespace, list/section numbering tokens, the section-numbering 一二三四、
STRIP = re.compile(r'[#*\n\r\t 　]|[一二三四五六]+、|[（(]\d+[)）]|\d+、|^落地前景')
def norm(s):
    s=re.sub(r'[#*\n\r\t 　]+','',s)
    s=re.sub(r'[一二三四五六]、','',s)
    s=re.sub(r'[（(]\d+[)）]','',s)
    s=re.sub(r'\d+、','',s)
    s=s.replace('落地前景','')
    return s

mine=''
for f in ['rec_p1.json','rec_p2.json','rec_p3.json']:
    r=json.load(open(f,encoding='utf-8'))
    for sh in r['shapes']:
        if sh.get('kind')=='text': mine+=sh['text']+'\n'
sn=norm(sec); mn=norm(mine)
absent=[]
i=0
while i < len(sn)-10:
    g=sn[i:i+10]
    if g not in mn:
        absent.append(g); i+=10
    else: i+=1
print('after stripping numbering/headings -> source 10-grams absent:', len(absent))
for g in absent: print('  GAP:', g)
print()
print('source prose chars (normed):', len(sn), '| mine prose chars (normed):', len(mn))

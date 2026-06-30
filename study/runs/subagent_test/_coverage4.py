# -*- coding: utf-8 -*-
# Definitive: split source into clauses, check each clause's CORE (after its colon) is present.
import json, re, difflib
plan=json.load(open(r'W:/ppt/postppt.json',encoding='utf-8'))
content=plan['content']
secs = re.split(r'\n##\s+', '\n'+content)
sec=[p for p in secs if p.startswith('落地前景')][0]
def norm(s):
    s=re.sub(r'[#*\n\r\t 　]+','',s);
    return s
mine=''
for f in ['rec_p1.json','rec_p2.json','rec_p3.json']:
    r=json.load(open(f,encoding='utf-8'))
    for sh in r['shapes']:
        if sh.get('kind')=='text': mine+=sh['text']+'\n'
mn=norm(mine)
# clauses split on 。；，：
clauses=[c for c in re.split(r'[。；，：\n]', sec) if len(norm(c))>=6]
genuinely_missing=[]
for c in clauses:
    cn=norm(c)
    cn=re.sub(r'^[一二三四五六]、','',cn); cn=re.sub(r'^[（(]\d+[)）]','',cn); cn=re.sub(r'^\d+、','',cn)
    if len(cn)<6: continue
    if cn in mn: continue
    sm=difflib.SequenceMatcher(None,cn,mn); m=sm.find_longest_match(0,len(cn),0,len(mn))
    if m.size>=max(8,int(len(cn)*0.7)): continue
    genuinely_missing.append(c.strip())
print('clauses:',len(clauses),'| genuinely missing core prose:',len(genuinely_missing))
for g in genuinely_missing: print('  ABSENT::',g[:120])

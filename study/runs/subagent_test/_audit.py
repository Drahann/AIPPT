# -*- coding: utf-8 -*-
import json, glob, os
base=r'W:/ppt/study/corpus/liangyao'
for f in sorted(glob.glob(base+'/pages/*.json')):
    d=json.load(open(f,encoding='utf-8'))
    slots=d.get('slots',[]); imgs=d.get('images',[]); dec=d.get('decor_shapes',[])
    funcs=[i.get('function') for i in imgs if i.get('function')]
    ph=sum(1 for s in slots if str(s.get('placeholder','')).startswith(('请','文字内容','XX','关键词')) or s.get('text','') in ('文字内容','请输入文字内容'))
    print(f"{d['id']}: arch={d['archetype']:9s} sig={str(d.get('slot_signature',''))[:30]:30s} slots={len(slots):2d}(ph~{ph}) imgs={len(imgs):2d} decor={len(dec):2d} funcs={funcs}")
print()
dr=json.load(open(base+'/deck_record.json',encoding='utf-8'))
print('skin.primary=',dr['skin']['primary'],'accent_cyan=',dr['skin']['accent_cyan'],'bg_deep=',dr['skin']['bg_deep'],'text_dim=',dr['skin']['text_dim'])
print('theme accent1=',dr['theme']['palette']['accent1'],'accent3=',dr['theme']['palette']['accent3'])
print('design_system.common_colors=',dr['design_system']['common_colors'])
print('design_system.content_margins=',dr['design_system']['content_margins'])
# assets on disk vs index
idx=[json.loads(l) for l in open(base+'/../../assets_lib/index.jsonl',encoding='utf-8') if l.strip()]
print('assets_lib index entries (all families):',len(idx))

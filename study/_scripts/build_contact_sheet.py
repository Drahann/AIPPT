# -*- coding: utf-8 -*-
"""Tile each deck's rendered slides into a labeled contact sheet; also a covers wall.
Usage: python build_contact_sheet.py <renders_root> <out_dir> [cols]"""
import os, sys, glob
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageDraw, ImageFont

renders_root = sys.argv[1] if len(sys.argv)>1 else r"W:\ppt\study\renders"
out_dir      = sys.argv[2] if len(sys.argv)>2 else r"W:\ppt\study\contact_sheets"
cols         = int(sys.argv[3]) if len(sys.argv)>3 else 4
os.makedirs(out_dir, exist_ok=True)

def load_font(sz):
    for f in [r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\arial.ttf"]:
        try: return ImageFont.truetype(f, sz)
        except: pass
    return ImageFont.load_default()

THUMB_W = 480
PAD = 8
LABEL_H = 30
HEADER_H = 40
BG = (245,245,245); FG=(20,20,20); BAND=(225,225,228)

def make_sheet(deck_dir, deck_id):
    pngs = sorted(glob.glob(os.path.join(deck_dir, "*.png")))
    if not pngs: return None
    thumbs=[]
    for p in pngs:
        try:
            im=Image.open(p).convert("RGB")
            r=THUMB_W/im.width
            im=im.resize((THUMB_W,int(im.height*r)))
            thumbs.append((os.path.basename(p), im))
        except: pass
    if not thumbs: return None
    th = max(t[1].height for t in thumbs)
    rows=(len(thumbs)+cols-1)//cols
    cellW=THUMB_W+PAD; cellH=th+LABEL_H+PAD
    W=cols*cellW+PAD; H=HEADER_H+rows*cellH+PAD
    sheet=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(sheet)
    d.rectangle([0,0,W,HEADER_H],fill=BAND)
    d.text((PAD,8),f"{deck_id}   ({len(thumbs)} slides)",fill=FG,font=load_font(22))
    for i,(name,im) in enumerate(thumbs):
        r=i//cols; c=i%cols
        x=PAD+c*cellW; y=HEADER_H+r*cellH
        sheet.paste(im,(x,y))
        d.text((x+2,y+im.height+4),name,fill=(90,90,90),font=load_font(16))
    outp=os.path.join(out_dir,f"{deck_id}.png")
    sheet.save(outp); return outp

decks=[d for d in sorted(os.listdir(renders_root)) if os.path.isdir(os.path.join(renders_root,d))]
covers=[]
for did in decks:
    dd=os.path.join(renders_root,did)
    r=make_sheet(dd,did)
    if r: print("sheet:",os.path.basename(r))
    # cover = first png
    ps=sorted(glob.glob(os.path.join(dd,"*.png")))
    if ps: covers.append((did,ps[0]))

# covers wall
if covers:
    cw=420
    thumbs=[]
    for did,p in covers:
        try:
            im=Image.open(p).convert("RGB"); rr=cw/im.width; im=im.resize((cw,int(im.height*rr)))
            thumbs.append((did,im))
        except: pass
    ccols=5; th=max(t[1].height for t in thumbs)
    cellW=cw+PAD; cellH=th+LABEL_H+PAD; rows=(len(thumbs)+ccols-1)//ccols
    W=ccols*cellW+PAD; H=HEADER_H+rows*cellH+PAD
    wall=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(wall)
    d.rectangle([0,0,W,HEADER_H],fill=BAND); d.text((PAD,8),f"COVERS WALL — {len(thumbs)} decks",fill=FG,font=load_font(24))
    for i,(did,im) in enumerate(thumbs):
        r=i//ccols; c=i%ccols; x=PAD+c*cellW; y=HEADER_H+r*cellH
        wall.paste(im,(x,y)); d.text((x+2,y+im.height+4),did,fill=(70,70,70),font=load_font(16))
    wp=os.path.join(out_dir,"_covers_wall.png"); wall.save(wp); print("covers wall:",wp)
print("DONE")
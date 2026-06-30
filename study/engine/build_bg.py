#!/usr/bin/env python3
"""build_bg — render the faithful CHROME PLATE for a slide via COM.

Plate = the slide with ALL text cleared (recursively, incl. group items) but every
image / vector frame / fill / photo kept, exported by PowerPoint itself. This is the
reuse-verbatim chrome (bg + card frames + decorations + photos) with zero text, onto
which the deterministic renderer draws fresh text. Group nesting is irrelevant: we
only blank text frames (modifiable in-place), never delete shapes. pptx never saved.

Optionally clear specific pictures by name (photos to be content-regen replaced):
  python build_bg.py <pptx> <slide_1based> <out_png> [--drop NAME[,NAME...]]
"""
import os, sys
import win32com.client

src = os.path.abspath(sys.argv[1])
sno = int(sys.argv[2])
outpng = os.path.abspath(sys.argv[3])
drop = set()
if '--drop' in sys.argv:
    drop = set(sys.argv[sys.argv.index('--drop') + 1].split(','))
os.makedirs(os.path.dirname(outpng), exist_ok=True)


def clear(shapes):
    for sh in list(shapes):
        try:
            if sh.Name in drop:
                sh.Delete(); continue
        except Exception:
            pass
        try:
            if sh.Type == 6:   # msoGroup
                clear(sh.GroupItems); continue
        except Exception:
            pass
        try:
            if sh.HasTextFrame:
                sh.TextFrame.TextRange.Text = ""
        except Exception:
            pass


app = win32com.client.Dispatch("PowerPoint.Application")
pres = app.Presentations.Open(src, ReadOnly=False, WithWindow=False)
try:
    tmp = pres.Slides.Item(sno).Duplicate().Item(1)
    clear(tmp.Shapes)
    tmp.Export(outpng, "PNG", 1280, 720)
    tmp.Delete()
    print("chrome plate ->", outpng)
finally:
    pres.Close()
    app.Quit()

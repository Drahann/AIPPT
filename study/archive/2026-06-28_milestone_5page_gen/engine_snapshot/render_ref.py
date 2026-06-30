#!/usr/bin/env python3
"""Reference truth renderer: export pptx slides to PNG via PowerPoint COM.

This is the "render real template" half of the verify loop — what the offline
VLM-describe step looks at, and what page-reviewer diffs the replica against.

Usage:
  python render_ref.py <pptx> <out_dir> [slide_no ...]   # specific 1-based slides
  python render_ref.py <pptx> <out_dir>                   # all slides
Output: <out_dir>/s01.png, s02.png, ...  (1280x720)
"""
import os, sys
import win32com.client

src = os.path.abspath(sys.argv[1])
outdir = os.path.abspath(sys.argv[2])
wanted = [int(x) for x in sys.argv[3:]]
os.makedirs(outdir, exist_ok=True)

app = win32com.client.Dispatch("PowerPoint.Application")
# PowerPoint needs a real window in many builds; WithWindow=False is unreliable.
pres = app.Presentations.Open(src, ReadOnly=True, WithWindow=False)
try:
    n = pres.Slides.Count
    idxs = wanted if wanted else range(1, n + 1)
    for i in idxs:
        out = os.path.join(outdir, f"s{i:02d}.png")
        pres.Slides.Item(i).Export(out, "PNG", 1280, 720)   # .Item(i) = documented 1-based API
        print("exported", out)
finally:
    pres.Close()
    app.Quit()

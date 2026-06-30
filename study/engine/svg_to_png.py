#!/usr/bin/env python3
"""svg_to_png — rasterize an SVG with headless Chrome (uses installed system fonts).

The SVG is loaded as the TOP-LEVEL document (not wrapped in <img>) so its <image>
hrefs to local file:/// plates load (SVG-in-<img> runs sandboxed and blocks them).
cairosvg / soffice don't honor the deck's CJK display fonts; Chrome does.

Usage: python svg_to_png.py <in.svg> <out.png> [width height]
"""
import os, sys, subprocess, time

svg = os.path.abspath(sys.argv[1])
out = os.path.abspath(sys.argv[2])
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1280
H = int(sys.argv[4]) if len(sys.argv) > 4 else 720
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

os.makedirs(os.path.dirname(out), exist_ok=True)
if os.path.exists(out):
    os.remove(out)
cmd = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
       "--force-device-scale-factor=1", f"--window-size={W},{H}",
       "--default-background-color=00000000", "--allow-file-access-from-files",
       f"--screenshot={out}", f"file:///{svg.replace(os.sep, '/')}"]
r = subprocess.run(cmd, capture_output=True, text=True)
for _ in range(25):
    if os.path.exists(out):
        break
    time.sleep(0.2)
if not os.path.exists(out):
    sys.exit("FAILED: " + r.stderr[-500:])
print("png ->", out)

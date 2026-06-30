#!/usr/bin/env python3
"""gen_deco — AI-generate a FUNCTIONAL decoration on demand (the flexible half of reference-driven).

Reference-driven means we don't have to find the exact part in assets_lib — we can MINT one that fits
the content + skin. This wraps 万相 (wan2.2-t2i) with per-function prompt scaffolds + a composite hint
(most decorations are generated on pure-black bg and composited with mix-blend:screen so the black drops
out into a glowing overlay; panels/motifs use normal/remove-bg).

Usage:
  python gen_deco.py --key <dashscope_key> --function card_frame --family blue_tech \
      --theme "科技HUD" --palette "#03FCFE,#081F43" --box 360x200 -o out.png
  (key: any line in engine/keys.local.json works — same DashScope keys serve wan2.2 + qwen-vl)
Writes out.png + out.json sidecar {prompt,size,composite,function}.
"""
import os, sys, json, argparse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '_scripts'))
from dashscope_t2i import gen_one  # noqa: E402

# function -> (prompt scaffold, composite mode). {theme}/{palette} filled in.
SCAFFOLD = {
    'card_frame':       ("decorative {theme} card frame border with a hollow transparent center, ornate glowing edges, {palette} colors", 'screen'),
    'title_flank':      ("a symmetric pair of {theme} decorative ornaments flanking a title, left and right mirrored, {palette} glowing", 'screen'),
    'corner_hud':       ("sci-fi {theme} corner HUD bracket decoration, angular glowing lines, {palette}", 'screen'),
    'number_backplate': ("a {theme} glowing badge backplate for a big number, hexagon or ringed disc, {palette}", 'screen'),
    'divider':          ("a thin {theme} horizontal divider line with a small ornament at center, {palette} glowing", 'screen'),
    'ribbon':           ("a {theme} ribbon banner strip, {palette}, subtle glow", 'screen'),
    'glow':             ("a soft glowing light streak / lens flare, {palette}", 'screen'),
    'motif':            ("a {theme} central motif illustration, {palette}, clean", 'screen'),
    'bullet_marker':    ("a small {theme} icon badge marker, {palette} glowing", 'screen'),
    'avatar_ring':      ("a decorative {theme} circular portrait frame ring with hollow center, {palette}", 'screen'),
    'connector':        ("a {theme} glowing arrow / flow connector, {palette}", 'screen'),
    'bg_panel':         ("a {theme} translucent tech panel surface, {palette}, subtle, soft edges", 'normal'),
}


LO, HI = 512, 1440                     # wan2.2 per-dim bounds (custom sizes accepted within this range)
LONG = 1280                            # target long side


def pick_size(box):
    """Generate at the TARGET BOX'S aspect (clamped to [LO,HI]) so the result places EXACTLY into the
    box with preserveAspectRatio='none' = no letterbox, no crop, no distortion. Returns (size, preserve, matched).
    Boxes more extreme than the feasible aspect (e.g. a 7:1 ribbon) clamp to the nearest aspect and are
    stretched along the long axis (fine for glows/bars/ribbons). matched=True when gen aspect == box aspect."""
    if not box:
        return '1024*1024', 'xMidYMid meet', True
    try:
        w, h = (float(x) for x in box.lower().split('x'))
        r = w / h
    except Exception:
        return '1024*1024', 'xMidYMid meet', True
    rmin, rmax = LO / HI, HI / LO        # ~0.356 .. 2.81
    rc = max(rmin, min(rmax, r))         # feasible aspect
    if rc >= 1:                          # landscape
        gw, gh = LONG, LONG / rc
        if gh < LO:
            gh, gw = LO, LO * rc
    else:                                # portrait
        gh, gw = LONG, LONG * rc
        if gw < LO:
            gw, gh = LO, LO / rc
    gw = max(LO, min(HI, int(round(gw / 16) * 16)))
    gh = max(LO, min(HI, int(round(gh / 16) * 16)))
    matched = abs(rc - r) < 1e-3
    # exact box aspect -> 'none' fills box perfectly; extreme/clamped -> still 'none' (stretch long axis)
    return f"{gw}*{gh}", 'none', matched


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--key', default=os.environ.get('DASHSCOPE_API_KEY', ''))
    ap.add_argument('--function', required=True)
    ap.add_argument('--family', default='')
    ap.add_argument('--theme', default='通用')
    ap.add_argument('--palette', default='#19E0FF,#04102B')
    ap.add_argument('--box', default='')
    ap.add_argument('--extra', default='', help='extra prompt detail')
    ap.add_argument('-o', '--out', required=True)
    a = ap.parse_args()
    if not a.key:
        # fall back to first key in keys.local.json
        try:
            a.key = json.load(open(os.path.join(os.path.dirname(__file__), 'keys.local.json'), encoding='utf-8'))['keys'][0]
        except Exception:
            sys.exit("no key (pass --key or set DASHSCOPE_API_KEY or fill keys.local.json)")
    scaff, comp = SCAFFOLD.get(a.function, ("a {theme} decorative element, {palette}", 'screen'))
    bg = "on pure solid black background" if comp == 'screen' else "on dark background"
    prompt = (scaff.format(theme=a.theme, palette=a.palette)
              + (f", {a.extra}" if a.extra else "")
              + f", {bg}, centered, high detail, no text, no words, no letters")
    neg = "text, watermark, logo, letters, words, chinese characters, signature, frame border around whole image, photo"
    size, preserve, matched = pick_size(a.box)
    gen_one(a.key, prompt, a.out, size=size, negative=neg, prompt_extend=False)   # tight control: no auto prompt rewrite
    json.dump({"function": a.function, "family": a.family, "theme": a.theme, "palette": a.palette,
               "prompt": prompt, "size": size, "box": a.box, "composite": comp,
               "preserveAspectRatio": preserve, "aspect_matched": matched,
               "render_hint": f'place at box with preserveAspectRatio="{preserve}", style="mix-blend-mode:{comp}"'},
              open(os.path.splitext(a.out)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    note = '' if matched else '  (box aspect extreme -> generated at nearest feasible, will stretch on long axis)'
    print(f"deco -> {a.out}  size={size} composite={comp} preserve={preserve}{note}")


if __name__ == '__main__':
    main()

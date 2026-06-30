#!/usr/bin/env python3
"""gen_deco — AI-generate a FUNCTIONAL decoration on demand (the flexible half of reference-driven).

Reference-driven means we don't have to find the exact part in assets_lib — we can MINT one that fits
the content + skin. This wraps DashScope t2i (default qwen-image-plus, best Qwen-Image tier) with
per-function prompt scaffolds + a composite hint (most decorations are generated on pure-black bg and
composited with mix-blend:screen so the black drops out into a glowing overlay; panels/motifs use normal).

⚠️ PREFER REAL LIBRARY PARTS FIRST: `assets_search.py --clean` returns the template's own embedded
decoration PNGs (source=slide/chrome). gen_deco is the FALLBACK for organic visuals the library lacks
(纳米分子/螺旋/光带 motif). Do NOT mint card_frame/number_backplate/corner_hud as badges — the model bakes
the theme/hex words as gibberish text on badge-shaped outputs; use --palette WORDS (not hex) and keep
minted assets to text-free organic subjects.

Usage:
  python gen_deco.py --key <dashscope_key> --function card_frame --family blue_tech \
      --theme "科技HUD" --palette "#03FCFE,#081F43" --box 360x200 -o out.png
  (key: any line in engine/keys.local.json works — same DashScope keys serve wan2.2 + qwen-vl)
Writes out.png + out.json sidecar {prompt,size,composite,function}.
"""
import os, sys, json, argparse, time, random

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '_scripts'))
from dashscope_t2i import gen_one  # noqa: E402


def _load_keys(explicit=''):
    """Return the list of DashScope keys to rotate through (explicit --key wins, else keys.local.json)."""
    if explicit:
        return [explicit]
    try:
        return json.load(open(os.path.join(os.path.dirname(__file__), 'keys.local.json'), encoding='utf-8'))['keys']
    except Exception:
        return []


def gen_one_rotating(keys, prompt, out, size, negative, start=0):
    """Call gen_one, ROTATING across all keys on rate-limit (HTTP 429 / Throttling) — the 5 keys share
    the throttle, so when one is limited we hop to the next with a short backoff (2026-06-30 用户)."""
    n = len(keys)
    if n == 0:
        sys.exit("no key (fill engine/keys.local.json or pass --key)")
    last = None
    for i in range(n * 2):                       # up to two full sweeps of the key ring
        k = keys[(start + i) % n]
        try:
            return gen_one(k, prompt, out, size=size, negative=negative, prompt_extend=False)
        except RuntimeError as e:
            last = e
            s = str(e)
            if '429' in s or 'Throttling' in s or 'rate limit' in s.lower():
                time.sleep(1.2 + 0.4 * i)        # brief backoff, then try the next key
                continue
            raise
    raise last

# function -> prompt scaffold. {theme}/{palette} filled in.  ALL decorations key out to REAL alpha
# (luminance->alpha) + NORMAL blend (2026-06-30 用户问题4).
# STYLE (2026-06-30 用户问题2 重做): 创赛=学术/政务严谨气质，NOT a neon video-game UI. Decorations must be
# RESTRAINED, FLAT, MATTE — thin precise lines, low contrast, understated. Avoid glow/neon/glossy/3D/HUD.
STYLE = "flat minimal vector infographic style, thin precise lines, matte, restrained, understated, low contrast, professional academic"
SCAFFOLD = {
    'card_frame':       "a clean rectangular card outline, thin crisp {palette} 1px border, matte dark translucent fill, subtle rounded corners, hollow empty center, " + STYLE,
    'title_flank':      "a small understated geometric title-side ornament, thin {palette} lines, " + STYLE,
    'corner_hud':       "a single thin minimal right-angle corner bracket, fine {palette} lines, " + STYLE,
    'number_backplate': "a simple flat thin {palette} ring / circle outline backplate, matte, hollow empty center, " + STYLE,
    'divider':          "a thin clean horizontal {palette} rule line with a small center dot, " + STYLE,
    'ribbon':           "a flat matte {palette} header bar with a subtle notch, low contrast, hollow empty center, " + STYLE,
    'glow':             "a very faint soft {palette} radial gradient haze, extremely subtle, barely visible, no streaks",
    'motif':            "a thin {palette} monoline outline icon of {theme}, luminous light strokes, dark-mode infographic icon on black, single-weight, " + STYLE,
    'bullet_marker':    "a small simple flat {palette} dot or diamond marker, " + STYLE,
    'avatar_ring':      "a thin flat {palette} circular frame ring, hollow center, " + STYLE,
    'connector':        "a thin clean {palette} arrow line, " + STYLE,
    'bg_panel':         "a flat matte rounded panel with a very subtle {palette} tint and a thin quiet edge, low contrast, mostly empty, " + STYLE,
}

# functions that MUST fill their box edge-to-edge (a frame inset by margin looks shrunken). For these the
# box aspect must be one the model can actually draw; centered functions may be padded to box aspect.
FILL_FRAME = {'card_frame', 'bg_panel', 'ribbon', 'title_flank', 'corner_hud', 'avatar_ring', 'divider', 'connector'}
CENTERED   = {'motif', 'glow', 'bullet_marker', 'number_backplate'}
SAFE_ASPECT = (0.42, 2.40)             # box aspect a frame/panel can be drawn full-bleed at; outside => refuse

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
    KEYS = _load_keys(a.key)
    start = random.randrange(len(KEYS)) if KEYS else 0    # stagger start so parallel agents don't all hit key[0]
    scaff = SCAFFOLD.get(a.function, "a {theme} decorative element, {palette}")
    # ---- aspect-feasibility guard: refuse box aspects a frame/panel can't be drawn full-bleed at
    #      (this is what produced the bg_panel ×2.23 stretch — a 6:1 box clamped to 2.8:1 then stretched).
    box_asp = None
    if a.box:
        try:
            bw, bh = (float(x) for x in a.box.lower().split('x')); box_asp = bw / bh
        except Exception:
            pass
    if box_asp and a.function in FILL_FRAME and not (SAFE_ASPECT[0] <= box_asp <= SAFE_ASPECT[1]):
        sys.exit(f"[gen_deco REFUSED] box aspect {box_asp:.2f} (box {a.box}) is too extreme for a full-bleed "
                 f"'{a.function}'. The model would draw it at ~{max(0.42,min(2.4,box_asp)):.2f} and the placement "
                 f"would STRETCH it. Fix: use a box within aspect {SAFE_ASPECT}, or split this strip into "
                 f"stacked rows / use a different function. (2026-06-30 用户问题2)")
    # ---- FULL-BLEED instruction so the subject reaches all four edges (no black margin to crop away) ----
    fill = ("the design FILLS THE ENTIRE IMAGE edge to edge, touching all four borders, zero margin, "
            "full-bleed composition") if a.function in FILL_FRAME else "centered, generous size"
    # MUST render on solid black with LIGHT-colored strokes so the luminance keyout yields true alpha
    # (line-art motifs otherwise default to dark-ink-on-white, which can't be keyed -> 2026-06-30 用户问题2).
    prompt = (scaff.format(theme=a.theme, palette=a.palette)
              + (f", {a.extra}" if a.extra else "")
              + f", {fill}, drawn in light luminous {a.palette} strokes on a solid pure black #000000 background, "
              + "clean, no text, no words, no letters")
    neg = ("white background, light background, paper, beige, dark ink on white, "
           "text, watermark, logo, letters, words, chinese characters, signature, small inset, wide black margin, "
           "photo, neon, glow, glowing, bloom, lens flare, glossy, plastic, shiny, metallic, 3D render, bevel, "
           "holographic, sci-fi HUD, video game UI, cyberpunk, oversaturated, vibrant, busy, ornate")
    size, preserve, matched = pick_size(a.box)

    from crop_deco import crop_to_content, keyout_black_to_alpha, content_fill_stats
    attempts = 0
    while True:
        attempts += 1
        gen_one_rotating(KEYS, prompt, a.out, size, neg, start=start + attempts)
        fill_frac, cont_asp = content_fill_stats(a.out)     # how much of the canvas the subject fills
        # retry once if the model drew it small in a black field (frame/panel only — it must fill)
        if a.function in FILL_FRAME and fill_frac < 0.85 and attempts < 2:
            prompt += ", IMPORTANT: enlarge the subject to completely fill the frame, no empty black border"
            continue
        break
    cropped = crop_to_content(a.out)                          # drop residual black margin
    # ★ key the near-black field to REAL alpha; place with NORMAL blend (no screen halo)
    opaque_frac = keyout_black_to_alpha(a.out)
    # final on-disk aspect vs box -> stretch the renderer would apply
    from PIL import Image as _Image
    fw, fh = _Image.open(a.out).size
    final_asp = fw / fh
    stretch = (max(final_asp, box_asp) / min(final_asp, box_asp)) if box_asp else 1.0
    warn = []
    if stretch > 1.15:
        warn.append(f"STRETCH x{stretch:.2f} (asset {final_asp:.2f} vs box {box_asp:.2f}) — placement will distort")
    if a.function in FILL_FRAME and fill_frac < 0.85:
        warn.append(f"LOW-FILL {fill_frac*100:.0f}% — subject did not fill the frame")
    if a.function not in FILL_FRAME and opaque_frac > 0.85:
        warn.append(f"OPAQUE {opaque_frac*100:.0f}% — background likely did NOT key out (white/light bg?); regen on black")
    json.dump({"function": a.function, "family": a.family, "theme": a.theme, "palette": a.palette,
               "prompt": prompt, "size": size, "box": a.box, "composite": "normal", "alpha": True,
               "preserveAspectRatio": "none", "final_size": [fw, fh], "fill_frac": round(fill_frac, 3),
               "opaque_frac": round(opaque_frac, 3), "stretch_vs_box": round(stretch, 3), "warnings": warn,
               "render_hint": 'place at box with preserveAspectRatio="none", NORMAL blend (alpha is real)'},
              open(os.path.splitext(a.out)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"deco -> {a.out}  final={fw}x{fh} alpha=True fill={fill_frac*100:.0f}% stretch=x{stretch:.2f}"
          + (("  ⚠ " + "; ".join(warn)) if warn else "  OK"))


if __name__ == '__main__':
    main()

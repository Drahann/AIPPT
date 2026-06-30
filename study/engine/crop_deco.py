#!/usr/bin/env python3
"""crop_deco — crop a generated decoration to its CONTENT bounding box.

The t2i model draws the decoration centered with a black margin around it. We composite with
mix-blend:screen so black drops out — but the decoration then occupies only the middle of its
frame, so when placed (preserve:none) into a card/panel box it looks SHRUNKEN, inset from the
box edges. Fix: crop away the near-black margin so the decoration FILLS its own image, hence
fills the placement box edge-to-edge.

  from crop_deco import crop_to_content
  crop_to_content("frame.png")            # crops in place, returns (w,h) or None

CLI:  python crop_deco.py <png> [<png> ...]
"""
import sys
from PIL import Image


def crop_to_content(path, thr=20, pad_frac=0.0):
    """Crop `path` in place to the bbox of pixels brighter than `thr` (drops the black margin).
    pad_frac keeps a small fraction of margin (0 = tight, fills the box). Returns (w,h) or None."""
    im = Image.open(path).convert('RGBA')
    W, H = im.size
    rgb = im.convert('RGB')
    # bbox of bright pixels (also union with alpha bbox if the PNG has real transparency)
    mask = rgb.convert('L').point(lambda v: 255 if v > thr else 0)
    bbox = mask.getbbox()
    # only honor alpha when the PNG has REAL transparency; screen-blend decos are RGB-on-black
    # (alpha all-opaque) so alpha bbox would wrongly be the full image.
    alpha = im.getchannel('A')
    if alpha.getextrema()[0] < 250:                       # has actually-transparent pixels
        ab = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
        if ab and bbox:
            bbox = (min(bbox[0], ab[0]), min(bbox[1], ab[1]), max(bbox[2], ab[2]), max(bbox[3], ab[3]))
        elif ab:
            bbox = ab
    if not bbox:
        return None
    if pad_frac > 0:
        px = int((bbox[2] - bbox[0]) * pad_frac); py = int((bbox[3] - bbox[1]) * pad_frac)
        bbox = (max(0, bbox[0] - px), max(0, bbox[1] - py), min(W, bbox[2] + px), min(H, bbox[3] + py))
    if bbox == (0, 0, W, H):
        return (W, H)               # already full-bleed, nothing to do
    im.crop(bbox).save(path)
    return (bbox[2] - bbox[0], bbox[3] - bbox[1])


def keyout_bg_to_alpha(path, lo=12, hi=72):
    """Turn an RGB-on-flat-background decoration into a REAL alpha-transparent RGBA PNG, ADAPTIVELY
    detecting whether the background is dark (near-black) or light (white) from the corners.

    The t2i model returns the subject on a flat field — dark for frames/panels (RGB ~4..38), but
    line-art motifs often default to WHITE — and the old mix-blend:screen path LIGHTENED the base into
    a halo (2026-06-30 用户问题4). Fix: key the BACKGROUND out to true transparency so the base shows
    through unchanged. Dark bg -> alpha from luminance (bright subject stays). Light bg -> alpha from
    color-distance to the bg (dark/colored subject stays). Place with NORMAL blend. Returns opaque_frac."""
    from PIL import Image
    import numpy as np
    arr = np.array(Image.open(path).convert('RGB')).astype(int)
    H, W = arr.shape[:2]
    s = 8
    corners = np.concatenate([arr[:s, :s].reshape(-1, 3), arr[:s, -s:].reshape(-1, 3),
                              arr[-s:, :s].reshape(-1, 3), arr[-s:, -s:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    span = max(1, hi - lo)
    if bg.mean() > 150:                                   # light/white background
        signal = np.abs(arr - bg).max(axis=2)             # distance from bg = subject strength
    else:                                                 # dark/black background
        signal = arr.sum(axis=2) / 3.0                    # luminance
    a = np.clip((signal - lo) * 255.0 / span, 0, 255).astype('uint8')
    out = np.dstack([arr.astype('uint8'), a])
    Image.fromarray(out, 'RGBA').save(path)
    return float((a > 200).mean())


# back-compat alias
keyout_black_to_alpha = keyout_bg_to_alpha


def content_fill_stats(path, thr=20):
    """Return (fill_frac, content_aspect) for the bright-content bbox — used to detect 'shrunken'
    generations (model drew the subject small in a black field) before/after crop."""
    from PIL import Image
    import numpy as np
    rgb = Image.open(path).convert('RGB')
    m = np.array(rgb).astype(int).sum(2) > thr
    if not m.any():
        return 0.0, 1.0
    ys, xs = np.where(m)
    w = xs.max() - xs.min() + 1
    h = ys.max() - ys.min() + 1
    return float(m.mean()), (w / h if h else 1.0)


if __name__ == '__main__':
    for p in sys.argv[1:]:
        r = crop_to_content(p)
        print(f"{p}: {'no content' if not r else f'cropped -> {r[0]}x{r[1]}'}")

"""Build the two contact orbs from the nebula placeholders in reference/.
Usage: uv run --with pillow --with numpy python tools/make_orbs.py
Swap the source images (or the centre/radius numbers) to change the orbs."""
import numpy as np
from PIL import Image

# palette tokens (css/style.css): navy, ivory, plus the accent each orb leans toward
NAVY, IVORY, GOLD, ICE = (7, 19, 39), (236, 230, 216), (227, 184, 102), (170, 196, 255)
JOBS = [  # source, centre (fraction of w,h), radius (fraction of width), accent, output
    ("reference/Contact me1.jpeg", (0.525, 0.651), 0.18, ICE, "assets/orb-1.webp"),
    ("reference/Contact me2.jpg", (0.4875, 0.49), 0.205, GOLD, "assets/orb-2.webp"),
]
MIX = 0.6  # how far the photo is pulled onto the palette (0 = untouched)


def grade(rgb, accent):
    """Gradient-map luminance navy -> accent -> ivory, then blend with the original."""
    a = rgb.astype("float32")
    lum = (a @ [0.299, 0.587, 0.114]) / 255
    lo = np.array(NAVY, "float32"); mid = np.array(accent, "float32"); hi = np.array(IVORY, "float32")
    t = lum[..., None]
    mapped = np.where(t < 0.55, lo + (mid - lo) * (t / 0.55), mid + (hi - mid) * ((t - 0.55) / 0.45))
    return np.clip(a * (1 - MIX) + mapped * MIX, 0, 255).astype("uint8")

OUT = 640
for src, (cx, cy), rf, accent, dst in JOBS:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    r = rf * w
    box = (round(cx * w - r), round(cy * h - r), round(cx * w + r), round(cy * h + r))
    sq = im.crop(box).resize((OUT, OUT), Image.LANCZOS)
    yy, xx = np.mgrid[0:OUT, 0:OUT]
    d = np.hypot(xx - OUT / 2, yy - OUT / 2) / (OUT / 2)
    t = np.clip((1 - d) / (1 - 0.55), 0, 1)
    a = (t * t * (3 - 2 * t) * 255).astype("uint8")
    rgba = np.dstack([grade(np.asarray(sq), accent), a])
    Image.fromarray(rgba, "RGBA").save(dst, quality=88, method=6)
    print(dst, im.size)

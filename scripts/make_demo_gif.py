"""Render docs/demo.gif: a terminal-style animation of an explain-stack session.
Run: uv run --no-project --with pillow python scripts/make_demo_gif.py
(Icon: .claude-plugin/icon.png is rendered from docs/logo.svg with a headless browser, see README.)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1000, 560
PAD_X, TOP = 28, 58
FS, LH = 17, 25
FONT = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", FS)
BOLD = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", FS)
TITLE = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15)

BG, BAR = (24, 24, 37), (40, 40, 58)
FG, DIM = (220, 223, 235), (130, 135, 160)
ACC, GREEN, YEL, CYAN, PINK = (96, 165, 250), (74, 222, 128), (250, 204, 21), (103, 232, 249), (244, 114, 182)

SCRIPT = [
    ("type", [("> ", ACC, True), ("/explain-stack", FG, False)]),
    ("pause", 500),
    ("out", [("● ", ACC, True), ("Scanned package.json, src/, README.md", DIM, False)]),
    ("out", []),
    ("out", [("Client ──JSON──> Express ──SQL──> SQLite (todos.db)", CYAN, False)]),
    ("out", []),
    ("out", [("Zod 3 · validation", YEL, True)]),
    ("out", [("What it is: ", GREEN, True), ("checks that incoming data has the right shape.", FG, False)]),
    ("out", [("Analogy:    ", GREEN, True), ("a bouncer checking IDs at the door.", FG, False)]),
    ("out", [("Why here:   ", GREEN, True), ("src/index.js:13 validates POST /todos and", FG, False)]),
    ("out", [("            ", FG, False), ("returns 400 with details if the body is wrong.", FG, False)]),
    ("out", [("Instead:    ", GREEN, True), ("Joi, Yup, Valibot. Zod: short syntax, TS types.", FG, False)]),
    ("out", [("Without it: ", GREEN, True), ('{"title": 123} goes straight into your database.', FG, False)]),
    ("pause", 900),
    ("out", []),
    ("out", [("Findings (nothing was changed)", PINK, True)]),
    ("out", [("- lodash is installed but never imported", FG, False)]),
    ("out", [("- vitest is set up, but there are no tests", FG, False)]),
    ("pause", 700),
    ("out", []),
    ("out", [("Quiz 1/3: ", ACC, True), ("What breaks if the SQLite file is deleted?", FG, False)]),
    ("pause", 600),
    ("out", [("Saved STACK.md (with a Mermaid diagram)", DIM, False)]),
    ("pause", 3500),
]


def base():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 38], fill=BAR)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([16 + i * 22, 13, 28 + i * 22, 25], fill=c)
    d.text((W // 2, 19), "claude — explain-stack", font=TITLE, fill=DIM, anchor="mm")
    return img


def draw_line(d, y, segs, upto=None):
    x, left = PAD_X, upto
    for text, color, bold in segs:
        if left is not None:
            take = max(0, min(len(text), left))
            left -= take
            text = text[:take]
        f = BOLD if bold else FONT
        d.text((x, y), text, font=f, fill=color)
        x += d.textlength(text, font=f)
    return x


def main():
    frames, durations, lines = [], [], []

    def snapshot(partial=None, upto=None, cursor=False, ms=80):
        img = base()
        d = ImageDraw.Draw(img)
        y = TOP
        for segs in lines:
            draw_line(d, y, segs)
            y += LH
        if partial is not None:
            x = draw_line(d, y, partial, upto)
            if cursor:
                d.rectangle([x + 1, y + 3, x + 10, y + FS + 3], fill=FG)
        frames.append(img)
        durations.append(ms)

    for kind, payload in SCRIPT:
        if kind == "pause":
            snapshot(ms=payload)
        elif kind == "out":
            lines.append(payload)
            snapshot(ms=140)
        elif kind == "type":
            total = sum(len(t) for t, _, _ in payload)
            for n in range(len(payload[0][0]), total + 1, 2):
                snapshot(payload, upto=n, cursor=True, ms=45)
            snapshot(payload, upto=total, cursor=True, ms=400)
            lines.append(payload)

    out = ROOT / "docs" / "demo.gif"
    pal = [f.convert("P", palette=Image.ADAPTIVE, colors=64) for f in frames]
    pal[0].save(out, save_all=True, append_images=pal[1:], duration=durations, loop=0, optimize=True, disposal=1)
    print("wrote", out, len(frames), "frames", out.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()

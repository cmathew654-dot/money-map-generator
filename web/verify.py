"""Gate G1: load the built page headlessly and assert it behaves.

    python verify.py [--url http://127.0.0.1:8778/clover-studio.html] [--serve]

Prints G1 PASS or G1 FAIL with the failing assertions, exits non-zero on
failure, and writes verify-desktop.png / verify-phone.png next to this file
-- LOOK AT THEM. A passing assertion is not a usable page.

Baselines are the shipped build; widen the tolerances deliberately, not
because a number moved.
"""
import argparse
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
CHROMIUM = os.environ.get("CHROMIUM", "/opt/pw-browsers/chromium")
ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
        "--no-sandbox", "--disable-dev-shm-usage"]

# what the shipped build reports; the page exposes these under ?debug
EXPECT = {
    "tris_min": 300_000, "tris_max": 340_000,
    "lightmaps": 15,
    "lights": 5, "light_max_intensity": 10.0,
}
# selectors the harness depends on -- keep in sync with shell.html / site/index.html
SEL = {"loader": "#load", "tris": "#tris", "baked": "#baked",
       "cta": "button.cta", "hits": "#hits", "legend": "#legend"}


def check(page, fails):
    def expect(cond, msg):
        if not cond:
            fails.append(msg)

    for _ in range(90):
        if page.evaluate("s => !document.querySelector(s)", SEL["loader"]):
            break
        time.sleep(1)
    else:
        fails.append("loader never cleared")
        return
    time.sleep(3)

    tris = int(page.inner_text(SEL["tris"]).replace(",", "") or 0)
    expect(EXPECT["tris_min"] <= tris <= EXPECT["tris_max"],
           f"triangles {tris} outside {EXPECT['tris_min']}-{EXPECT['tris_max']}")
    baked = page.inner_text(SEL["baked"])
    expect(baked.startswith(f"{EXPECT['lightmaps']} surf"),
           f"baked reads {baked!r}, expected {EXPECT['lightmaps']} surf")

    lights = page.evaluate("() => window.__dbg ? window.__dbg.lights().map(l => l.i) : null")
    expect(lights is not None, "window.__dbg missing -- load with ?debug")
    if lights is not None:
        expect(len(lights) == EXPECT["lights"], f"{len(lights)} lights, expected {EXPECT['lights']}")
        expect(max(lights) <= EXPECT["light_max_intensity"],
               f"a light at intensity {max(lights):.1f} -- exported Blender lights?")

    expect(page.evaluate("() => document.compatMode") == "CSS1Compat", "quirks mode")
    expect(page.evaluate("() => document.characterSet") == "UTF-8", "charset not UTF-8")

    page.keyboard.press("KeyE")
    time.sleep(2)
    frames = [f for f in page.frames if f != page.main_frame]
    expect(len(frames) == 1, f"{len(frames)} iframes, expected 1")
    if frames:
        site = frames[0]
        site.click(SEL["cta"]); site.click(SEL["cta"]); time.sleep(0.4)
        hits = site.inner_text(SEL["hits"])
        expect(hits == "2", f"iframe clicks registered {hits!r}, expected '2'")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://127.0.0.1:8778/clover-studio.html")
    ap.add_argument("--serve", action="store_true",
                    help="start a static server on dist/ for the run")
    args = ap.parse_args()
    from playwright.sync_api import sync_playwright

    server = None
    if args.serve:
        server = subprocess.Popen([sys.executable, "-m", "http.server", "8778",
                                   "--bind", "127.0.0.1", "--directory",
                                   os.path.join(HERE, "dist")],
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1.5)
    url = args.url + ("&" if "?" in args.url else "?") + "debug"
    fails, errors = [], []
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(executable_path=CHROMIUM, args=ARGS)
            pg = b.new_page(viewport={"width": 1280, "height": 720})
            pg.on("pageerror", lambda e: errors.append(str(e)))
            pg.goto(url)
            check(pg, fails)
            pg.screenshot(timeout=90000, path=os.path.join(HERE, "verify-desktop.png"))
            ph = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True,
                               is_mobile=True).new_page()
            ph.goto(url)
            for _ in range(90):
                if ph.evaluate("s => !document.querySelector(s)", SEL["loader"]):
                    break
                time.sleep(1)
            time.sleep(2)
            ph.screenshot(timeout=90000, path=os.path.join(HERE, "verify-phone.png"))
            b.close()
    finally:
        if server:
            server.terminate()
    if errors:
        fails.append("page errors: " + "; ".join(errors[:3]))
    if fails:
        print("G1 FAIL")
        for f in fails:
            print("  -", f)
        sys.exit(1)
    print("G1 PASS  (now look at verify-desktop.png and verify-phone.png)")


if __name__ == "__main__":
    main()

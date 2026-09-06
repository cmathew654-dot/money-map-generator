"""Build the single-file browser walkthrough.

    cd web && npm install && python build.py [--skip-export] [--out dist/clover-studio.html]

Stages, each skippable once its output exists:

    1. export   scene -> export/clover-studio-baked.glb   (bpy, ~1 min)
    2. pack     gltfpack meshopt compression              (11 MB -> ~4.5 MB)
    3. bundle   esbuild src/app.js + three.js -> one IIFE  (~580 KB)
    4. assemble inline the bundle, the GLB as base64 and the site as srcdoc

The page has to be self-contained because the publishing target cannot fetch
external files. Everything the runtime needs travels inside the HTML.
"""

import argparse
import base64
import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EXPORT = os.path.join(ROOT, "export")
NODE_BIN = os.path.join(HERE, "node_modules", ".bin")

NAME = "clover-studio"                      # binds every <name> in docs/PIPELINE.md
GLB_RAW = os.path.join(EXPORT, NAME + "-baked.glb")
GLB_PACKED = os.path.join(EXPORT, NAME + "-packed.glb")
WORK = os.path.join(EXPORT, "work.blend")
BUNDLE = os.path.join(EXPORT, "app.bundle.js")
SITE = os.path.join(HERE, "site", "index.html")
SHELL = os.path.join(HERE, "shell.html")

# gltfpack settings that survived iteration: 16-bit positions keep the CRT
# bezel and card text crisp, 0.92 simplification keeps book spines legible,
# and vertex colours are left at default because the export omits them.
PACK_ARGS = ["-cc", "-vp", "16", "-vt", "14", "-vn", "10", "-si", "0.92",
             "-kn", "-km", "-ke"]


def tool(name):
    path = os.path.join(NODE_BIN, name)
    if not os.path.exists(path):
        sys.exit("missing %s -- run `npm install` in web/ first" % name)
    return path


def run(cmd):
    print("  $", " ".join(os.path.basename(c) if i == 0 else c
                          for i, c in enumerate(cmd)), flush=True)
    subprocess.run(cmd, check=True)


def check_bpy(python):
    """Fail early and clearly if the interpreter cannot import bpy."""
    probe = subprocess.run([python, "-c", "import bpy"], capture_output=True)
    if probe.returncode != 0:
        sys.exit("%s cannot import bpy. Run build.py with the interpreter that "
                 "has it, or pass --python <that interpreter>." % python)


def export_scene(python, rebuild=False):
    """Export the baked GLB.

    Resumes from export/work.blend when present -- that file holds the
    prepared, lightmapped scene and makes this stage take seconds. A stale
    work.blend silently wins over source changes, so --rebuild ignores it and
    runs scene.webexport.run(), the canonical bake sequence.
    """
    check_bpy(python)
    if os.path.exists(WORK) and not rebuild:
        script = (
            "import sys, bpy; sys.path.insert(0, %r)\n"
            "from scene import webexport as W\n"
            "bpy.ops.wm.open_mainfile(filepath=%r)\n"
            "W.export_glb(%r, vertex_colors=False)\n" % (ROOT, WORK, GLB_RAW))
    else:
        script = (
            "import sys; sys.path.insert(0, %r)\n"
            "from scene import build, webexport as W\n"
            "build.build_scene()\n"
            "r = W.run(out_dir=%r, work_blend=%r)\n"
            "print('[run]', {k: (len(v) if isinstance(v, list) else v) "
            "for k, v in r.items()})\n" % (ROOT, EXPORT, WORK))
    run([python, "-c", script])


def pack():
    run([tool("gltfpack"), "-i", GLB_RAW, "-o", GLB_PACKED] + PACK_ARGS)


def bundle():
    run([tool("esbuild"), os.path.join(HERE, "src", "app.js"), "--bundle",
         "--format=iife", "--minify", "--target=es2020",
         "--outfile=" + BUNDLE])


def js(value):
    """JSON, with </ escaped so an embedded </script> cannot close the block."""
    return json.dumps(value).replace("</", "<\\/")


DOC_HEAD = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,'
            'viewport-fit=cover">')


def assemble(out, standalone):
    shell = open(SHELL, encoding="utf-8").read()
    site = open(SITE, encoding="utf-8").read()
    glb = base64.b64encode(open(GLB_PACKED, "rb").read()).decode()
    code = open(BUNDLE, encoding="utf-8").read().replace("</", "<\\/")
    page = (shell
            + "\n<script>window.__SITE__=" + js(site)
            + ";window.__GLB__=" + js(glb) + ";<" + "/script>"
            + "\n<script>" + code + "<" + "/script>\n")
    if standalone:
        # The artifact wrapper supplies doctype/charset/viewport itself; a
        # self-hosted copy has to carry them or it renders in quirks mode.
        page = DOC_HEAD + "</head><body>" + page + "</body></html>"
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    open(out, "w", encoding="utf-8").write(page)
    print("  wrote %s  (%.2f MB)" % (out, os.path.getsize(out) / 1e6))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "dist", NAME + ".html"))
    ap.add_argument("--python", default=sys.executable,
                    help="interpreter with bpy installed (default: this one)")
    ap.add_argument("--rebuild", action="store_true",
                    help="ignore export/work.blend and re-run the full bake sequence")
    ap.add_argument("--skip-export", action="store_true")
    ap.add_argument("--skip-pack", action="store_true")
    ap.add_argument("--fragment", action="store_true",
                    help="omit doctype/head: the form the Claude artifact wrapper wants")
    args = ap.parse_args()

    if not args.skip_export or not os.path.exists(GLB_RAW):
        print("[1/4] export"); export_scene(args.python, rebuild=args.rebuild)
    if not args.skip_pack or not os.path.exists(GLB_PACKED):
        print("[2/4] pack"); pack()
    print("[3/4] bundle"); bundle()
    print("[4/4] assemble"); assemble(args.out, standalone=not args.fragment)


if __name__ == "__main__":
    main()

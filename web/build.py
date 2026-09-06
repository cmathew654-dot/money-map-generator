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

GLB_RAW = os.path.join(EXPORT, "clover-studio-baked.glb")
GLB_PACKED = os.path.join(EXPORT, "clover-studio-packed.glb")
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


def export_scene(python):
    """Rebuild the scene and export the baked GLB via the scene package."""
    script = (
        "import sys, os, bpy; sys.path.insert(0, %r)\n"
        "from scene import build, webexport as W\n"
        "work = os.path.join(%r, 'work.blend')\n"
        "if os.path.exists(work):\n"
        "    bpy.ops.wm.open_mainfile(filepath=work)\n"
        "else:\n"
        "    build.build_scene()\n"
        "    W.convert_text_and_curves(); W.apply_modifiers()\n"
        "    W.flatten_procedural_colors(); W.tame_emission()\n"
        "    W.split_screen_face(); W.add_lightmap_uvs()\n"
        "    W.apply_lightmaps(in_dir=os.path.join(%r, 'lightmaps'))\n"
        "W.export_glb(%r, vertex_colors=False)\n"
        % (ROOT, EXPORT, EXPORT, GLB_RAW)
    )
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
    ap.add_argument("--out", default=os.path.join(HERE, "dist", "clover-studio.html"))
    ap.add_argument("--python", default=sys.executable,
                    help="interpreter with bpy installed (default: this one)")
    ap.add_argument("--skip-export", action="store_true")
    ap.add_argument("--skip-pack", action="store_true")
    ap.add_argument("--fragment", action="store_true",
                    help="omit doctype/head: the form the Claude artifact wrapper wants")
    args = ap.parse_args()

    if not args.skip_export or not os.path.exists(GLB_RAW):
        print("[1/4] export"); export_scene(args.python)
    if not args.skip_pack or not os.path.exists(GLB_PACKED):
        print("[2/4] pack"); pack()
    print("[3/4] bundle"); bundle()
    print("[4/4] assemble"); assemble(args.out, standalone=not args.fragment)


if __name__ == "__main__":
    main()

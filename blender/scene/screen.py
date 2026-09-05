"""The CRT's contents: a Windows 95 desktop with Internet Explorer open on the
Clover & Co. homepage.

Everything is real emissive geometry laid out on a 640x480 virtual raster, so
the interface genuinely lights the desk in front of it. `Raster` converts
pixel coordinates (origin top-left, the way the UI was designed) into the
monitor's local metres.
"""

import math

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import util as U

RES_X, RES_Y = 640, 480
GLOW = 1.95                      # master emission multiplier


class Raster:
    """Draws flat emissive plates and text onto a virtual 640x480 screen."""

    def __init__(self, collection, width_m, parent=None, glow=GLOW):
        self.col = collection
        self.px = width_m / RES_X
        self.w = width_m
        self.h = self.px * RES_Y
        self.parent = parent
        self.glow = glow
        self._depth = 0
        self.objects = []

    # -- coordinate helpers -------------------------------------------------
    def _to_local(self, x, y):
        """Pixel (top-left origin) -> local XZ centred on the screen."""
        return (x * self.px - self.w * 0.5, self.h * 0.5 - y * self.px)

    def _next_z(self):
        self._depth += 1
        return self._depth * 0.00016

    def _register(self, obj):
        if self.parent:
            obj.parent = self.parent
        self.objects.append(obj)
        return obj

    # -- primitives ---------------------------------------------------------
    def rect(self, x, y, w, h, color, strength=None, name="plate", depth=None):
        lx, lz = self._to_local(x + w * 0.5, y + h * 0.5)
        d = self._next_z() if depth is None else depth
        bm = bmesh.new()
        hw, hh = w * self.px * 0.5, h * self.px * 0.5
        v = [bm.verts.new((-hw, 0.0, -hh)), bm.verts.new((hw, 0.0, -hh)),
             bm.verts.new((hw, 0.0, hh)), bm.verts.new((-hw, 0.0, hh))]
        bm.faces.new(v)
        s = self.glow if strength is None else strength
        mat = M.emissive("UI %s %.2f" % (color, s), color, s)
        obj = U.mesh_object("ui_%s" % name, bm, self.col, mat)
        obj.location = (lx, -d, lz)
        return self._register(obj)

    def disc(self, x, y, d, color, strength=None, name="disc", segments=40):
        """A filled circle, centred on (x, y) with pixel diameter d."""
        lx, lz = self._to_local(x, y)
        dep = self._next_z()
        bm = bmesh.new()
        r = d * self.px * 0.5
        ring = [bm.verts.new((math.cos(U.TAU * i / segments) * r, 0.0,
                              math.sin(U.TAU * i / segments) * r))
                for i in range(segments)]
        bm.faces.new(ring)
        s = self.glow if strength is None else strength
        mat = M.emissive("UI %s %.2f" % (color, s), color, s)
        obj = U.mesh_object("ui_%s" % name, bm, self.col, mat)
        obj.location = (lx, -dep, lz)
        return self._register(obj)

    def ring(self, x, y, d, thickness, color, strength=None, name="ring",
             segments=40):
        """An annulus -- the red donut in the hero artwork."""
        lx, lz = self._to_local(x, y)
        dep = self._next_z()
        bm = bmesh.new()
        ro, ri = d * self.px * 0.5, (d - thickness * 2.0) * self.px * 0.5
        outer, inner = [], []
        for i in range(segments):
            a = U.TAU * i / segments
            outer.append(bm.verts.new((math.cos(a) * ro, 0.0, math.sin(a) * ro)))
            inner.append(bm.verts.new((math.cos(a) * ri, 0.0, math.sin(a) * ri)))
        U.bridge_rings(bm, inner, outer)
        s = self.glow if strength is None else strength
        mat = M.emissive("UI %s %.2f" % (color, s), color, s)
        obj = U.mesh_object("ui_%s" % name, bm, self.col, mat)
        obj.location = (lx, -dep, lz)
        return self._register(obj)

    def text(self, x, y, body, size, color, align="LEFT", kind="regular",
             name="text", spacing=1.0, char_spacing=1.0, line_spacing=1.0,
             strength=None):
        lx, lz = self._to_local(x, y)
        d = self._next_z()
        s = self.glow if strength is None else strength
        mat = M.emissive("UI %s %.2f" % (color, s), color, s)
        obj = U.text(name, body, self.col, mat, size=size * self.px, kind=kind,
                     align=align, location=(lx, -d, lz),
                     rotation=(1.5707963, 0.0, 0.0), spacing=spacing,
                     char_spacing=char_spacing, line_spacing=line_spacing)
        return self._register(obj)

    # -- Windows 95 chrome --------------------------------------------------
    def bevel_out(self, x, y, w, h, face=P.UI_FACE, light=P.UI_LIGHT,
                  shadow=P.UI_SHADOW, dark=P.UI_DARK, t=1):
        """A raised Win95 control: white/grey highlight, grey/black shadow."""
        self.rect(x, y, w, h, dark, name="bev_dark")
        self.rect(x, y, w - t, h - t, light, name="bev_light")
        self.rect(x + t, y + t, w - t * 2, h - t * 2, shadow, name="bev_shadow")
        self.rect(x + t, y + t, w - t * 3, h - t * 3, face, name="bev_face")

    def bevel_in(self, x, y, w, h, face=P.UI_WHITE, t=1):
        """A sunken Win95 field (text inputs, the page canvas)."""
        self.rect(x, y, w, h, P.UI_SHADOW, name="sunk_a")
        self.rect(x + t, y + t, w - t, h - t, P.UI_LIGHT, name="sunk_b")
        self.rect(x + t, y + t, w - t * 2, h - t * 2, P.UI_DARK, name="sunk_c")
        self.rect(x + t * 2, y + t * 2, w - t * 3, h - t * 3, face, name="sunk_face")


# --------------------------------------------------------------------------
# icons
# --------------------------------------------------------------------------

def _icon_computer(r, x, y):
    r.rect(x + 2, y, 20, 15, "#C9C6BC", name="ic")
    r.rect(x + 4, y + 2, 16, 11, "#1D6B72", name="ic")
    r.rect(x + 5, y + 3, 14, 9, "#2E9AA0", name="ic")
    r.rect(x + 7, y + 15, 10, 3, "#9A968C", name="ic")
    r.rect(x, y + 18, 24, 8, "#C9C6BC", name="ic")
    r.rect(x + 2, y + 21, 6, 2, "#5A5750", name="ic")
    r.rect(x + 18, y + 20, 3, 3, "#3FA34D", name="ic")


def _icon_network(r, x, y):
    for dx, dy in ((0, 0), (9, 6)):
        r.rect(x + dx + 1, y + dy, 14, 10, "#C9C6BC", name="ic")
        r.rect(x + dx + 3, y + dy + 2, 10, 6, "#1D6B72", name="ic")
    r.rect(x + 6, y + 12, 2, 6, "#6E6A62", name="ic")
    r.rect(x, y + 20, 24, 4, "#8C8880", name="ic")


def _icon_inbox(r, x, y):
    r.rect(x, y + 6, 24, 15, "#D8D4C8", name="ic")
    r.rect(x + 1, y + 7, 22, 13, "#EFEADD", name="ic")
    r.rect(x + 3, y + 3, 18, 8, "#C4BFB2", name="ic")
    r.rect(x + 4, y + 4, 16, 6, "#F6F2E8", name="ic")
    r.rect(x + 2, y + 16, 20, 5, "#B9B4A6", name="ic")
    r.rect(x + 6, y + 18, 12, 2, "#D93B2B", name="ic")


def _icon_ie(r, x, y):
    r.rect(x + 4, y + 2, 16, 16, "#2E6FC4", name="ic")
    r.rect(x + 6, y + 4, 12, 12, "#8FC3EE", name="ic")
    r.rect(x + 8, y + 6, 8, 8, "#2E6FC4", name="ic")
    r.rect(x, y + 9, 24, 4, "#EFB01F", name="ic")
    r.rect(x + 2, y + 12, 20, 3, "#D2941A", name="ic")


def _icon_bin(r, x, y):
    r.rect(x + 4, y + 4, 16, 18, "#8E93A0", name="ic")
    r.rect(x + 5, y + 5, 14, 16, "#B7BCC8", name="ic")
    for i in range(3):
        r.rect(x + 8 + i * 4, y + 7, 2, 12, "#8E93A0", name="ic")
    r.rect(x + 2, y + 1, 20, 4, "#6E7380", name="ic")
    r.rect(x + 9, y, 6, 2, "#6E7380", name="ic")


ICONS = [
    ("My Computer", _icon_computer),
    ("Network|Neighborhood", _icon_network),
    ("Inbox", _icon_inbox),
    ("Internet|Explorer", _icon_ie),
    ("Recycle Bin", _icon_bin),
]


def _draw_icons(r):
    x = 16
    y = 24
    for label, drawer in ICONS:
        drawer(r, x + 4, y)
        lines = label.split("|")
        for i, line in enumerate(lines):
            r.text(x + 16, y + 34 + i * 11, line, 9.0, "#F2F6F6",
                   align="CENTER", name="icon_label")
        y += 58 + (10 if len(lines) > 1 else 0)


# --------------------------------------------------------------------------
# the Clover & Co. page
# --------------------------------------------------------------------------

def _draw_page(r, x, y, w, h):
    """The website itself, drawn inside the browser's content rectangle."""
    r.rect(x, y, w, h, "#FBFAF6", name="page_bg")

    # --- site header ---------------------------------------------------
    r.rect(x + 10, y + 7, 9, 9, P.RED, name="logo_mark")
    r.rect(x + 12, y + 9, 5, 5, "#FBFAF6", name="logo_mark")
    r.text(x + 24, y + 12, "Clover & Co.", 9.0, P.NAVY, kind="bold",
           name="page_logo")
    for i, item in enumerate(("Work", "Studio", "Contact")):
        r.text(x + w - 96 + i * 34, y + 12, item, 7.0, "#5C6472", name="nav")
    r.rect(x + 10, y + 20, w - 20, 1, "#D8D3C6", name="rule")

    # --- hero ----------------------------------------------------------
    r.text(x + 14, y + 34, "CLOVER & CO.   /   WEB DESIGN STUDIO", 6.0,
           P.RED, kind="bold", char_spacing=1.5, name="eyebrow")

    # headline, with BUILD knocked out on a red block
    r.text(x + 14, y + 50, "WE", 17.0, P.NAVY, kind="bold", name="hl")
    r.rect(x + 40, y + 41, 46, 17, P.RED, name="hl_block")
    r.text(x + 63, y + 50, "BUILD", 15.0, "#FFFFFF", kind="bold",
           align="CENTER", name="hl_ko")
    r.text(x + 90, y + 50, "SITES", 17.0, P.NAVY, kind="bold", name="hl")
    r.text(x + 14, y + 69, "PEOPLE STARE", 17.0, P.NAVY, kind="bold", name="hl")
    r.text(x + 14, y + 88, "AT", 17.0, P.NAVY, kind="bold", name="hl")
    r.text(x + 44, y + 89, "( and then actually read )", 7.0, "#6B7280",
           name="hl_sub")

    # supporting copy in a bordered note
    r.rect(x + 12, y + 100, 128, 30, "#F1EADC", name="note")
    r.rect(x + 12, y + 100, 3, 30, P.NAVY, name="note_bar")
    r.text(x + 20, y + 109, "Custom websites for forward-", 6.0, "#3A4252",
           name="note_l")
    r.text(x + 20, y + 117, "thinking studios. Clear design,", 6.0, "#3A4252",
           name="note_l")
    r.text(x + 20, y + 125, "real results.", 6.0, "#3A4252", name="note_l")

    # CTA
    r.rect(x + 13, y + 138, 60, 15, P.NAVY, name="cta_shadow")
    r.rect(x + 12, y + 137, 60, 15, P.MUSTARD, name="cta")
    r.text(x + 42, y + 145, "Let's Build →", 8.0, P.NAVY, kind="bold",
           align="CENTER", name="cta_label")

    # --- hero artwork: grid square, circle, diagonal band ---------------
    ax, ay, aw = x + w - 178, y + 36, 130
    r.rect(ax + 5, ay + 5, aw, 104, "#E4DCCB", name="art_shadow")
    r.rect(ax, ay, aw, 104, P.MUSTARD, name="art_square")
    for i in range(1, 8):
        r.rect(ax + i * (aw / 8.0), ay, 1, 104, "#C89A16", name="art_grid")
    for i in range(1, 7):
        r.rect(ax, ay + i * (104 / 7.0), aw, 1, "#C89A16", name="art_grid")
    r.rect(ax, ay, aw, 104, P.NAVY, strength=0.0, name="art_hairline")
    r.rect(ax + 1, ay + 1, aw - 2, 102, P.MUSTARD, name="art_inner")
    for i in range(1, 8):
        r.rect(ax + i * (aw / 8.0), ay + 1, 1, 102, "#C89A16", name="art_grid")
    for i in range(1, 7):
        r.rect(ax + 1, ay + i * (104 / 7.0), aw - 2, 1, "#C89A16", name="art_grid")

    # tilted navy plate with a red donut sitting over its corner
    plate = r.rect(ax + aw - 46, ay + 60, 44, 44, P.NAVY, name="art_plate")
    plate.rotation_euler = (0.0, 0.5236, 0.0)
    r.ring(ax + aw - 16, ay + 88, 34, 9, P.RED, name="art_donut")

    # red diagonal band sweeping under the hero
    band = r.rect(x + 4, y + 132, w - 8, 11, P.RED, name="band")
    band.rotation_euler = (0.0, -0.086, 0.0)

    # --- WHAT CHANGES section -------------------------------------------
    sy = y + 162
    r.rect(x + 12, sy - 8, w - 24, 1, "#D8D3C6", name="rule")
    r.text(x + 14, sy + 4, "WHAT CHANGES", 12.0, P.RED, kind="bold",
           char_spacing=1.06, name="section_h")
    body = [
        "A great website does more than look good. It helps people find you,",
        "understand what you do, and take the next step. We design and build",
        "sites that make that happen.",
    ]
    for i, line in enumerate(body):
        r.text(x + 14, sy + 20 + i * 9, line, 6.0, "#3A4252", name="body")

    # white card on the right of the section
    cx = x + w - 150
    r.rect(cx + 3, sy + 3, 138, 44, "#E4DCCB", name="card_shadow")
    r.rect(cx, sy, 138, 44, "#FFFFFF", name="card")
    r.rect(cx, sy, 138, 2, P.NAVY, name="card_top")
    r.text(cx + 8, sy + 14, "Good sites. Good people.", 7.0, P.NAVY,
           kind="bold", name="card_h")
    r.text(cx + 8, sy + 25, "Make. Build. Iterate. Repeat.", 6.0, "#6B7280",
           name="card_b")
    r.text(cx + 8, sy + 35, "www.cloverandco.studio", 6.0, P.RED, name="card_b")

    # three service tiles across the foot of the page
    ty = sy + 62
    r.rect(x + 12, ty - 10, w - 24, 1, "#D8D3C6", name="rule")
    tiles = [("01", "Design", P.RED), ("02", "Build", P.NAVY),
             ("03", "Iterate", P.MUSTARD)]
    tw = (w - 34) / 3.0
    for i, (num, label, colour) in enumerate(tiles):
        tx = x + 14 + i * (tw + 3)
        r.rect(tx, ty, tw, 40, "#F1EADC", name="tile")
        r.rect(tx, ty, tw, 3, colour, name="tile_top")
        r.text(tx + 7, ty + 15, num, 8.0, colour, kind="bold", name="tile_num")
        r.text(tx + 7, ty + 29, label, 9.0, P.NAVY, kind="bold", name="tile_l")
    # footer
    fy = ty + 50
    r.rect(x, fy, w, 26, P.NAVY, name="footer")
    r.text(x + 12, fy + 13, "Clover & Co.  \u2014  Web Design Studio", 7.0,
           "#F1EADC", kind="bold", name="footer_l")
    r.text(x + w - 12, fy + 13, "hello@cloverandco.studio", 6.5, "#BFCBE4",
           align="RIGHT", name="footer_r")


# --------------------------------------------------------------------------
# Internet Explorer window
# --------------------------------------------------------------------------

def _draw_browser(r):
    wx, wy, ww, wh = 96, 20, 520, 408
    r.bevel_out(wx, wy, ww, wh)

    # title bar -- the era's blue gradient, faked with three bands
    tb = wy + 4
    r.rect(wx + 4, tb, ww - 8, 17, P.UI_TITLE, name="title")
    r.rect(wx + 4 + (ww - 8) * 0.45, tb, (ww - 8) * 0.35, 17, "#1B44A8",
           name="title_g")
    r.rect(wx + 4 + (ww - 8) * 0.80, tb, (ww - 8) * 0.20, 17, P.UI_TITLE_2,
           name="title_g")
    r.rect(wx + 8, tb + 3, 11, 11, "#DCE6F6", name="title_icon")
    r.rect(wx + 10, tb + 5, 7, 7, P.RED, name="title_icon")
    r.text(wx + 24, tb + 9, "Clover & Co. - Microsoft Internet Explorer", 9.0,
           "#FFFFFF", kind="bold", name="title_text")
    for i, glyph in enumerate(("–", "□", "✕")):
        bx = wx + ww - 58 + i * 18
        r.bevel_out(bx, tb + 2, 16, 13)
        r.text(bx + 8, tb + 9, glyph, 8.0, P.UI_TEXT, align="CENTER",
               kind="bold", name="title_btn")

    # menu bar
    mb = tb + 19
    r.rect(wx + 4, mb, ww - 8, 15, P.UI_FACE, name="menubar")
    for i, item in enumerate(("File", "Edit", "View", "Go", "Favorites", "Help")):
        r.text(wx + 12 + i * 34, mb + 8, item, 8.0, P.UI_TEXT, name="menu")

    # toolbar
    tbar = mb + 16
    r.rect(wx + 4, tbar, ww - 8, 30, P.UI_FACE, name="toolbar")
    r.rect(wx + 4, tbar, ww - 8, 1, P.UI_LIGHT, name="toolbar_hl")
    tools = [("←", "Back"), ("→", "Fwd"), ("✕", "Stop"),
             ("↻", "Refresh"), ("⌂", "Home"), ("⌕", "Search"),
             ("★", "Favs"), ("⎙", "Print")]
    for i, (glyph, label) in enumerate(tools):
        bx = wx + 8 + i * 40
        r.rect(bx + 12, tbar + 3, 16, 14, "#7C88A0", name="tool_icon")
        r.rect(bx + 13, tbar + 4, 14, 12, "#C3CEE2", name="tool_icon")
        r.text(bx + 20, tbar + 10, glyph, 8.0, "#1B2A4A", align="CENTER",
               kind="bold", name="tool_glyph")
        r.text(bx + 20, tbar + 23, label, 6.5, P.UI_TEXT, align="CENTER",
               name="tool_label")
    r.rect(wx + ww - 44, tbar + 2, 38, 26, "#DCE3F0", name="ie_logo")
    r.rect(wx + ww - 40, tbar + 5, 30, 20, "#2E6FC4", name="ie_logo")
    r.text(wx + ww - 25, tbar + 15, "e", 15.0, "#EFEFF6", align="CENTER",
           kind="bold", name="ie_e")

    # address bar
    ab = tbar + 31
    r.rect(wx + 4, ab, ww - 8, 21, P.UI_FACE, name="addrbar")
    r.text(wx + 10, ab + 11, "Address", 8.0, P.UI_TEXT, name="addr_label")
    r.bevel_in(wx + 52, ab + 3, ww - 108, 15)
    r.rect(wx + 56, ab + 6, 9, 9, P.RED, name="addr_favicon")
    r.text(wx + 70, ab + 11, "http://www.cloverandco.studio", 8.5, P.UI_TEXT,
           name="addr_url")
    r.bevel_out(wx + ww - 52, ab + 3, 20, 15)
    r.text(wx + ww - 42, ab + 11, "▼", 6.0, P.UI_TEXT, align="CENTER",
           name="addr_drop")
    r.bevel_out(wx + ww - 30, ab + 3, 24, 15)
    r.text(wx + ww - 18, ab + 11, "Go", 8.0, P.UI_TEXT, align="CENTER",
           name="addr_go")

    # content viewport
    cy = ab + 22
    ch = wy + wh - cy - 22
    r.bevel_in(wx + 5, cy, ww - 10, ch)
    px, py = wx + 8, cy + 3
    pw, ph = ww - 16 - 15, ch - 5
    _draw_page(r, px, py, pw, ph)

    # vertical scrollbar
    sbx = px + pw + 1
    r.rect(sbx, py, 15, ph, "#DBDBDB", name="scroll_track")
    r.bevel_out(sbx, py, 15, 15)
    r.text(sbx + 7, py + 8, "▲", 6.0, P.UI_TEXT, align="CENTER", name="sb")
    r.bevel_out(sbx, py + ph - 15, 15, 15)
    r.text(sbx + 7, py + ph - 7, "▼", 6.0, P.UI_TEXT, align="CENTER", name="sb")
    r.bevel_out(sbx, py + 16, 15, 74)

    # status bar
    sy2 = wy + wh - 20
    r.rect(wx + 5, sy2, ww - 10, 16, P.UI_FACE, name="status")
    r.bevel_in(wx + 7, sy2 + 1, ww - 150, 13, face=P.UI_FACE)
    r.text(wx + 14, sy2 + 8, "Done", 8.0, P.UI_TEXT, name="status_text")
    r.bevel_in(wx + ww - 140, sy2 + 1, 130, 13, face=P.UI_FACE)
    r.text(wx + ww - 132, sy2 + 8, "Internet zone", 7.5, P.UI_TEXT, name="zone")


# --------------------------------------------------------------------------
# taskbar
# --------------------------------------------------------------------------

def _draw_taskbar(r):
    ty = RES_Y - 30
    r.rect(0, ty, RES_X, 30, P.UI_FACE, name="taskbar")
    r.rect(0, ty, RES_X, 1, P.UI_LIGHT, name="taskbar_hl")

    r.bevel_out(4, ty + 4, 60, 22)
    r.rect(10, ty + 10, 11, 11, P.RED, name="flag")
    r.rect(10, ty + 10, 5, 5, "#3FA34D", name="flag")
    r.rect(16, ty + 10, 5, 5, P.MUSTARD, name="flag")
    r.rect(10, ty + 16, 5, 5, "#2E6FC4", name="flag")
    r.text(26, ty + 15, "Start", 9.5, P.UI_TEXT, kind="bold", name="start")

    r.rect(68, ty + 6, 2, 18, P.UI_SHADOW, name="grip")
    r.rect(71, ty + 6, 2, 18, P.UI_LIGHT, name="grip")

    r.bevel_in(78, ty + 4, 190, 22, face=P.UI_FACE)
    r.rect(85, ty + 10, 10, 10, "#DCE6F6", name="task_icon")
    r.rect(86, ty + 11, 8, 8, P.RED, name="task_icon")
    r.text(100, ty + 15, "Clover & Co. - Microsof...", 8.0, P.UI_TEXT,
           kind="bold", name="task_label")

    r.bevel_in(RES_X - 92, ty + 4, 88, 22, face=P.UI_FACE)
    for i, col in enumerate(("#7C88A0", "#3FA34D", "#C9A227")):
        r.rect(RES_X - 86 + i * 13, ty + 10, 10, 10, col, name="tray")
    r.text(RES_X - 12, ty + 15, "10:24 AM", 8.0, P.UI_TEXT, align="RIGHT",
           name="clock")


# --------------------------------------------------------------------------
# entry point
# --------------------------------------------------------------------------

def build(collection, width_m, parent=None, glow=GLOW):
    """Draw the whole interface; returns the Raster holding every object."""
    r = Raster(collection, width_m, parent=parent, glow=glow)
    r.rect(0, 0, RES_X, RES_Y, P.UI_DESKTOP, name="desktop")
    _draw_icons(r)
    _draw_browser(r)
    _draw_taskbar(r)
    return r

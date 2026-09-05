#!/usr/bin/env python3
"""
Candlelit Barn Ceremony -- a procedural recreation of a rustic barn wedding
ceremony, rendered as a single self-contained SVG scene.

Everything (wall planks, roof rafters, chair rows, aisle candles, petals,
florals, silk drapes) is placed on one real one-point-perspective solve so the
whole room converges on a single vanishing point in the open barn doorway.

    screen_x = VPX + (xf - VPX) * k
    screen_y = VPY + (FLOOR - VPY - hf) * k        k = D0 / depth

where `xf` / `hf` are lateral position and height above the floor measured in
front-plane units, and `k` is the perspective scale for a given depth.
"""

import math
import random

RND = random.Random(915)

W, H = 1456, 1092
VPX, VPY = 740.0, 612.0      # vanishing point, inside the doorway
FLOOR = 1052.0               # floor line on the front plane (k = 1)
HALF = 1440.0                # half barn width, front-plane units
KBACK = 0.200                # perspective scale at the back wall
WALLTOP = 1800.0             # eave height
RIDGE = 3050.0               # roof ridge height
LOFT_F = 1520.0              # loft deck height
LOFT_R = 2030.0              # loft railing height
LX, RX = VPX - HALF, VPX + HALF
D0 = 575.0                   # focal length in front-plane units

AISLE = 183.0                # half aisle width, front-plane units

out = []
def add(s):
    out.append(s)

# ---------------------------------------------------------------- helpers ---

def P(xf, hf, k):
    """Project a point given lateral pos, height above floor, and depth scale."""
    return (VPX + (xf - VPX) * k, VPY + (FLOOR - VPY - hf) * k)

def kd(d):
    """Perspective scale at depth d (front-plane units from the camera)."""
    return D0 / d

def dk(k):
    return D0 / k

def kstep(k, forward):
    """Scale after moving `forward` units toward the camera (positive = nearer)."""
    return D0 / max(60.0, dk(k) - forward)

def n(v):
    s = '%.2f' % v
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    return s if s not in ('-0', '') else '0'

def pt(p):
    return n(p[0]) + ',' + n(p[1])

def poly(pts):
    return ' '.join(pt(p) for p in pts)

def h2r(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))

def r2h(t):
    return '#%02x%02x%02x' % tuple(max(0, min(255, int(round(v)))) for v in t)

def mix(a, b, t):
    A, B = h2r(a), h2r(b)
    return r2h(tuple(A[i] + (B[i] - A[i]) * t for i in range(3)))

def jit(a, b):
    return RND.uniform(a, b)

def clamp(v, a, b):
    return a if v < a else (b if v > b else v)

# ------------------------------------------------------------- materials ---

WOOD_D = '#1e1005'   # deep shadow wood
WOOD_M = '#4d2c11'   # mid wood
WOOD_L = '#96602c'   # firelit wood
WOOD_H = '#d29a55'   # hot highlight
IVORY  = '#fdf6e8'
CREAM  = '#efe0c4'
GREEN_D = '#2f4327'
GREEN_M = '#4e6a3a'
GREEN_L = '#7d9557'

def wood_tone(t, lit):
    """t = plank grain variation 0..1, lit = how much firelight reaches it."""
    base = mix(WOOD_D, WOOD_M, 0.35 + 0.65 * t)
    return mix(base, WOOD_L, clamp(lit, 0, 1) * 0.85)

def defs():
    d = ['<defs>']
    # -- soft vertical shading laid over the big timber planes
    d.append('<linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">'
             '<stop offset="0" stop-color="#000000" stop-opacity=".97"/>'
             '<stop offset=".16" stop-color="#0a0501" stop-opacity=".88"/>'
             '<stop offset=".34" stop-color="#160b03" stop-opacity=".58"/>'
             '<stop offset=".56" stop-color="#2a1405" stop-opacity=".14"/>'
             '<stop offset=".78" stop-color="#170c03" stop-opacity=".34"/>'
             '<stop offset="1" stop-color="#080401" stop-opacity=".72"/>'
             '</linearGradient>')
    d.append('<linearGradient id="roofShade" x1="0" y1="0" x2="0" y2="1">'
             '<stop offset="0" stop-color="#000000" stop-opacity=".95"/>'
             '<stop offset=".55" stop-color="#0d0602" stop-opacity=".72"/>'
             '<stop offset="1" stop-color="#2a1607" stop-opacity=".28"/>'
             '</linearGradient>')
    # -- glows
    d.append('<radialGradient id="gAmber">'
             '<stop offset="0" stop-color="#ffd9a0" stop-opacity=".80"/>'
             '<stop offset=".38" stop-color="#ff9f45" stop-opacity=".28"/>'
             '<stop offset="1" stop-color="#ff7a10" stop-opacity="0"/>'
             '</radialGradient>')
    d.append('<radialGradient id="gFlame">'
             '<stop offset="0" stop-color="#fffdf4" stop-opacity=".95"/>'
             '<stop offset=".22" stop-color="#ffe6ab" stop-opacity=".62"/>'
             '<stop offset=".55" stop-color="#ffb257" stop-opacity=".20"/>'
             '<stop offset="1" stop-color="#ff8a1e" stop-opacity="0"/>'
             '</radialGradient>')
    d.append('<radialGradient id="gBulb">'
             '<stop offset="0" stop-color="#ffffff" stop-opacity="1"/>'
             '<stop offset=".18" stop-color="#fff2cf" stop-opacity=".85"/>'
             '<stop offset=".45" stop-color="#ffc978" stop-opacity=".28"/>'
             '<stop offset="1" stop-color="#ff9d2e" stop-opacity="0"/>'
             '</radialGradient>')
    d.append('<radialGradient id="gDoor">'
             '<stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>'
             '<stop offset=".25" stop-color="#fff4dc" stop-opacity=".55"/>'
             '<stop offset=".6" stop-color="#ffcf8d" stop-opacity=".18"/>'
             '<stop offset="1" stop-color="#ffab4d" stop-opacity="0"/>'
             '</radialGradient>')
    # -- silk / chiffon drape, lit from within the room
    d.append('<linearGradient id="silkV" x1="0" y1="0" x2="1" y2="0">'
             '<stop offset="0" stop-color="#8d6b45" stop-opacity=".95"/>'
             '<stop offset=".10" stop-color="#c9a97e"/>'
             '<stop offset=".30" stop-color="#f6e6c9"/>'
             '<stop offset=".48" stop-color="#fdf4e2"/>'
             '<stop offset=".68" stop-color="#ecd6b0"/>'
             '<stop offset=".88" stop-color="#b69062"/>'
             '<stop offset="1" stop-color="#7d5c3a"/>'
             '</linearGradient>')
    d.append('<linearGradient id="silkH" x1="0" y1="0" x2="0" y2="1">'
             '<stop offset="0" stop-color="#7d5c3a" stop-opacity=".9"/>'
             '<stop offset=".16" stop-color="#d5b485"/>'
             '<stop offset=".42" stop-color="#fbf0dc"/>'
             '<stop offset=".70" stop-color="#e8d3ae"/>'
             '<stop offset="1" stop-color="#8a6740" stop-opacity=".92"/>'
             '</linearGradient>')
    d.append('<linearGradient id="silkFold" x1="0" y1="0" x2="1" y2="0">'
             '<stop offset="0" stop-color="#ffffff" stop-opacity="0"/>'
             '<stop offset=".5" stop-color="#ffffff" stop-opacity=".55"/>'
             '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>'
             '</linearGradient>')
    # -- polished concrete
    d.append('<linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">'
             '<stop offset="0" stop-color="#a08a6f"/>'
             '<stop offset=".06" stop-color="#8e7c65"/>'
             '<stop offset=".35" stop-color="#7b6c58"/>'
             '<stop offset=".72" stop-color="#665a4a"/>'
             '<stop offset="1" stop-color="#514840"/>'
             '</linearGradient>')
    # -- rose / blossom
    d.append('<radialGradient id="roseG" cx=".38" cy=".32" r=".78">'
             '<stop offset="0" stop-color="#fffdf9"/>'
             '<stop offset=".45" stop-color="#f7ecd9"/>'
             '<stop offset=".8" stop-color="#e2d0b2"/>'
             '<stop offset="1" stop-color="#bfae8d"/>'
             '</radialGradient>')
    d.append('<radialGradient id="vign" cx=".5" cy=".48" r=".78">'
             '<stop offset="0" stop-color="#000000" stop-opacity="0"/>'
             '<stop offset=".55" stop-color="#000000" stop-opacity="0"/>'
             '<stop offset=".78" stop-color="#0a0400" stop-opacity=".38"/>'
             '<stop offset="1" stop-color="#040100" stop-opacity=".86"/>'
             '</radialGradient>')
    d.append('<linearGradient id="glassG" x1="0" y1="0" x2="1" y2="0">'
             '<stop offset="0" stop-color="#f6ecd8" stop-opacity=".62"/>'
             '<stop offset=".14" stop-color="#cbb692" stop-opacity=".30"/>'
             '<stop offset=".42" stop-color="#fff3d8" stop-opacity=".16"/>'
             '<stop offset=".72" stop-color="#b49f7c" stop-opacity=".26"/>'
             '<stop offset="1" stop-color="#fdf3e0" stop-opacity=".66"/>'
             '</linearGradient>')
    for r in (2, 4, 7, 12, 22, 40):
        d.append('<filter id="b%d" x="-70%%" y="-70%%" width="240%%" height="240%%">'
                 '<feGaussianBlur stdDeviation="%d"/></filter>' % (r, r))
    d.append('</defs>')
    return ''.join(d)

def depth_series(k_from, k_to, step_units):
    """Depth scales for evenly spaced boards marching toward the camera."""
    ks, d = [], dk(k_from)
    while True:
        k = kd(d)
        if k > k_to:
            return ks
        ks.append(k)
        d -= step_units

# ============================================================== the shell ===

def roof():
    add('<g id="roof">')
    KFAR, KNEAR = KBACK, 7.5
    ks = depth_series(KFAR, KNEAR, 46)
    hull = [P(LX, WALLTOP, KFAR), P(VPX, RIDGE, KFAR), P(RX, WALLTOP, KFAR),
            P(RX, WALLTOP, KNEAR), P(VPX, RIDGE, KNEAR), P(LX, WALLTOP, KNEAR)]
    add('<polygon points="%s" fill="#1c1108"/>' % poly(hull))
    for xe in (LX, RX):
        for i in range(len(ks) - 1):
            k1, k2 = ks[i], ks[i + 1]
            t = RND.random()
            lit = 0.42 * math.exp(-((k1 - 0.30) ** 2) / 0.018) + 0.05 * math.exp(-k1)
            c = mix(wood_tone(t, lit * 0.55), '#0b0603', 0.58)
            add('<polygon points="%s" fill="%s"/>' % (poly([
                P(xe, WALLTOP, k1), P(VPX, RIDGE, k1),
                P(VPX, RIDGE, k2), P(xe, WALLTOP, k2)]), c))
    # sheathing boards running the length of the roof
    for fr in (0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.93):
        for xe in (LX, RX):
            xf = xe + (VPX - xe) * fr
            hf = WALLTOP + (RIDGE - WALLTOP) * fr
            a, b = P(xf, hf, KFAR), P(xf, hf, KNEAR)
            add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#170d05" '
                'stroke-opacity=".5" stroke-width="2"/>'
                % (n(a[0]), n(a[1]), n(b[0]), n(b[1])))
    # rafters: the radiating chevrons that give the roof its structure
    for k in depth_series(KFAR, 3.0, 150):
        wdt = max(1.0, 9 * k)
        a, c, b = P(LX, WALLTOP, k), P(VPX, RIDGE, k), P(RX, WALLTOP, k)
        add('<polyline points="%s" fill="none" stroke="#170d05" stroke-width="%s" '
            'stroke-linejoin="round"/>' % (poly([a, c, b]), n(wdt)))
        add('<polyline points="%s" fill="none" stroke="%s" stroke-opacity=".40" '
            'stroke-width="%s" stroke-linejoin="round"/>' % (
                poly([(a[0], a[1] + wdt * 0.32), (c[0], c[1] + wdt * 0.32),
                      (b[0], b[1] + wdt * 0.32)]),
                '#6b451f', n(max(0.7, wdt * 0.26))))
    for k in depth_series(KFAR, 0.95, 430):
        a, b = P(LX, 2320, k), P(RX, 2320, k)
        th = max(2.2, 22 * k)
        add('<rect x="%s" y="%s" width="%s" height="%s" fill="#1a0f06" opacity=".62"/>'
            % (n(a[0]), n(a[1] - th / 2), n(b[0] - a[0]), n(th)))
        add('<rect x="%s" y="%s" width="%s" height="%s" fill="#6d4520" opacity=".22"/>'
            % (n(a[0]), n(a[1] - th / 2), n(b[0] - a[0]), n(max(1, th * 0.22))))
    add('<polygon points="%s" fill="url(#roofShade)"/>' % poly(hull))
    add('</g>')

def side_walls():
    add('<g id="walls">')
    for xe, sgn in ((LX, -1), (RX, 1)):
        shape = poly([P(xe, 0, KBACK), P(xe, WALLTOP, KBACK),
                      P(xe, WALLTOP, 3.0), P(xe, 0, 3.0)])
        add('<polygon points="%s" fill="#241408"/>' % shape)
        ks = depth_series(KBACK, 3.0, 52)
        for i in range(len(ks) - 1):
            k1, k2 = ks[i], ks[i + 1]
            t = RND.random()
            # firelight pools on the wall behind the guests
            lit = 0.80 * math.exp(-((k1 - 0.34) ** 2) / 0.040) + 0.10
            c = wood_tone(t, lit * 0.50)
            add('<polygon points="%s" fill="%s"/>' % (poly([
                P(xe, 0, k1), P(xe, WALLTOP, k1),
                P(xe, WALLTOP, k2), P(xe, 0, k2)]), c))
            # seam shadow
            a, b = P(xe, 0, k2), P(xe, WALLTOP, k2)
            add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#1a0e05" '
                'stroke-opacity=".75" stroke-width="%s"/>' % (
                    n(a[0]), n(a[1]), n(b[0]), n(b[1]), n(max(0.6, 4.2 * k1))))
        # horizontal girt / rail bands
        for hf in (620, 1290, 1760):
            a, b = P(xe, hf, KBACK), P(xe, hf, 3.0)
            add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#1b0f06" '
                'stroke-opacity=".6" stroke-width="4"/>' % (
                    n(a[0]), n(a[1]), n(b[0]), n(b[1])))
        add('<polygon points="%s" fill="url(#wallShade)"/>' % shape)
        # warm uplight washing the plank wall
        gx, gy = P(xe, 500, 0.40)
        add('<ellipse cx="%s" cy="%s" rx="300" ry="235" fill="url(#gAmber)" '
            'opacity=".30" style="mix-blend-mode:screen"/>' % (n(gx + sgn * 40), n(gy)))
        gx, gy = P(xe, 380, 0.72)
        add('<ellipse cx="%s" cy="%s" rx="270" ry="210" fill="url(#gAmber)" '
            'opacity=".20" style="mix-blend-mode:screen"/>' % (n(gx + sgn * 60), n(gy)))
    add('</g>')

def back_wall():
    bl, br = P(LX, 0, KBACK)[0], P(RX, 0, KBACK)[0]
    yb = P(0, 0, KBACK)[1]
    ye = P(0, WALLTOP, KBACK)[1]
    yr = P(0, RIDGE, KBACK)[1]
    add('<g id="backwall">')
    add('<polygon points="%s" fill="#2a1809"/>' % poly(
        [(bl, yb), (bl, ye), (VPX, yr), (br, ye), (br, yb)]))
    # vertical siding
    x = bl
    step = 52 * KBACK
    while x < br:
        t = RND.random()
        lit = 0.55 * math.exp(-((x - VPX) ** 2) / (2 * 210.0 ** 2)) + 0.12
        add('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>' % (
            n(x), n(yr), n(step * 0.94), n(yb - yr), wood_tone(t, lit * 0.5)))
        x += step
    add('<polygon points="%s" fill="url(#wallShade)" opacity=".9"/>' % poly(
        [(bl, yb), (bl, ye), (VPX, yr), (br, ye), (br, yb)]))
    # gable framing
    add('<polyline points="%s" fill="none" stroke="#170c04" stroke-width="9"/>'
        % poly([(bl, ye), (VPX, yr), (br, ye)]))
    add('<rect x="%s" y="%s" width="%s" height="9" fill="#1c1006"/>'
        % (n(bl), n(ye - 4), n(br - bl)))

    # ---- lit loft doorway high in the gable, framed as a cross
    wx0, wx1, wy0, wy1 = 690, 792, 276, 356
    add('<rect x="%s" y="%s" width="%s" height="%s" fill="#120a04"/>'
        % (wx0 - 8, wy0 - 8, wx1 - wx0 + 16, wy1 - wy0 + 16))
    add('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff6e2"/>'
        % (wx0, wy0, wx1 - wx0, wy1 - wy0))
    add('<rect x="%s" y="%s" width="%s" height="%s" fill="#efe0c2"/>'
        % (wx0, wy0, (wx1 - wx0) * 0.5, wy1 - wy0))
    add('<rect x="734" y="%s" width="13" height="%s" fill="#2a1a0c"/>' % (wy0, wy1 - wy0))
    add('<rect x="%s" y="303" width="%s" height="11" fill="#2a1a0c"/>' % (wx0, wx1 - wx0))
    add('<ellipse cx="741" cy="316" rx="112" ry="90" fill="url(#gDoor)" '
        'opacity=".38" style="mix-blend-mode:screen"/>')

    # ---- loft deck + railing
    add('<rect x="%s" y="428" width="%s" height="34" fill="#33200e"/>' % (n(bl - 6), n(br - bl + 12)))
    add('<rect x="%s" y="428" width="%s" height="7" fill="#6f4520"/>' % (n(bl - 6), n(br - bl + 12)))
    add('<rect x="%s" y="455" width="%s" height="9" fill="#150b04"/>' % (n(bl - 6), n(br - bl + 12)))
    add('<rect x="%s" y="320" width="%s" height="14" fill="#5c3718"/>' % (n(bl + 4), n(br - bl - 8)))
    add('<rect x="%s" y="320" width="%s" height="4.5" fill="#b3763a"/>' % (n(bl + 4), n(br - bl - 8)))
    bx = bl + 12
    while bx < br - 10:
        sh = 0.5 + 0.5 * math.exp(-((bx - VPX) ** 2) / (2 * 230.0 ** 2))
        add('<rect x="%s" y="332" width="7" height="98" fill="%s"/>'
            % (n(bx), mix('#2b1809', '#a86e35', sh * 0.95)))
        bx += 15.5
    add('<rect x="%s" y="418" width="%s" height="10" fill="#3d2410"/>' % (n(bl + 4), n(br - bl - 8)))
    for px in (bl + 6, VPX - 96, VPX + 96, br - 18):
        add('<rect x="%s" y="318" width="13" height="112" fill="#2b1a0a"/>' % n(px))
    # shadowed void beneath the loft deck
    add('<rect x="%s" y="464" width="%s" height="56" fill="#0e0703" opacity=".78"/>'
        % (n(bl), n(br - bl)))
    add('<ellipse cx="740" cy="470" rx="330" ry="105" fill="url(#gAmber)" opacity=".40" '
        'style="mix-blend-mode:screen"/>')
    add('</g>')

def barn_doors():
    add('<g id="doors">')
    dx0, dx1, dy0, dy1 = 652, 838, 470, 702
    add('<rect x="%s" y="%s" width="%s" height="%s" fill="#0d0703"/>'
        % (dx0 - 14, dy0 - 16, dx1 - dx0 + 28, dy1 - dy0 + 16))
    add('<rect x="%s" y="%s" width="%s" height="12" fill="#3a2310"/>'
        % (dx0 - 20, dy0 - 22, dx1 - dx0 + 40))
    # two sliding leaves, planked
    for (a, b) in ((dx0, 741), (755, dx1)):
        x = a
        while x < b - 1:
            t = RND.random()
            edge = min(abs(x - a), abs(x - b)) / max(1.0, (b - a) * 0.5)
            add('<rect x="%s" y="%s" width="9" height="%s" fill="%s"/>' % (
                n(x), dy0, dy1 - dy0, mix('#170d05', '#482c13', 0.25 + 0.6 * (1 - edge) * RND.random())))
            x += 9.6
        add('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#0a0502" '
            'stroke-width="3"/>' % (n(a), dy0, n(b - a), dy1 - dy0))
    # the blade of daylight between the leaves
    add('<rect x="740" y="474" width="14" height="228" fill="#fff6e4"/>')
    add('<rect x="743" y="474" width="8" height="228" fill="#ffffff"/>')
    add('<ellipse cx="747" cy="592" rx="11" ry="132" fill="#fff8e8" opacity=".7" filter="url(#b4)"/>')
    add('<ellipse cx="747" cy="596" rx="34" ry="158" fill="url(#gDoor)" '
        'opacity=".45" style="mix-blend-mode:screen"/>')
    add('<ellipse cx="747" cy="660" rx="96" ry="150" fill="url(#gAmber)" '
        'opacity=".18" style="mix-blend-mode:screen"/>')
    add('<polygon points="742,700 754,700 800,760 692,760" fill="#fff3d8" opacity=".22" '
        'filter="url(#b12)"/>')
    add('</g>')

def stairs():
    add('<g id="stairs">')
    add('<polygon points="608,452 608,478 452,672 440,648" fill="#1d1108"/>')
    for i in range(12):
        u = i / 11.0
        x = 600 - u * 150
        y = 470 + u * 196
        w = 62 + u * 26
        add('<polygon points="%s" fill="#1b0f06"/>' % poly(
            [(x, y), (x + w, y - 4), (x + w, y + 12), (x, y + 17)]))
        add('<polygon points="%s" fill="%s"/>' % (poly(
            [(x, y), (x + w, y - 4), (x + w, y + 1), (x, y + 5)]),
            mix('#452a12', '#8a5c2e', 0.10 + 0.5 * math.exp(-((u - 0.45) ** 2) / 0.08))))
    add('<polygon points="612,446 620,446 470,676 452,676" fill="#2a1a0c"/>')
    add('</g>')

# ========================================================== botanicals ======

def leaf(x, y, L, ang, col, ratio=0.36, op=1.0):
    return ('<ellipse rx="%s" ry="%s" fill="%s"%s transform="translate(%s,%s) rotate(%s)"/>'
            % (n(L), n(L * ratio), col, '' if op >= 1 else ' opacity="%s"' % n(op),
               n(x), n(y), n(ang)))

def sprig(x, y, ang, L, leafL, dark=0.0, op=1.0):
    """A stem of paired leaves radiating from (x,y) along `ang`."""
    g = []
    ex, ey = x + math.cos(math.radians(ang)) * L, y + math.sin(math.radians(ang)) * L
    g.append('<path d="M%s %s Q%s %s %s %s" fill="none" stroke="%s" stroke-width="%s" '
             'opacity="%s"/>' % (n(x), n(y),
                                 n((x + ex) / 2 + jit(-6, 6)), n((y + ey) / 2 + jit(-6, 6)),
                                 n(ex), n(ey), mix(GREEN_D, '#1c2a17', 0.4),
                                 n(max(0.7, leafL * 0.16)), n(op)))
    steps = max(3, int(L / (leafL * 0.72)))
    for i in range(steps):
        u = (i + 0.6) / steps
        px = x + (ex - x) * u + jit(-1.5, 1.5)
        py = y + (ey - y) * u + jit(-1.5, 1.5)
        sz = leafL * (1.05 - 0.42 * u) * jit(0.8, 1.2)
        tone = jit(0.0, 1.0)
        col = mix(mix(GREEN_D, GREEN_L, tone), '#0f1a0d', dark)
        for s in (-1, 1):
            g.append(leaf(px, py, sz, ang + s * jit(38, 66), col,
                          jit(0.30, 0.44), op))
    return ''.join(g)

def rose(x, y, r, warm=0.0, op=1.0):
    hi = mix('#fffdf7', '#fff4e0', warm)
    md = mix('#f1e7d4', '#ecdcc0', warm)
    lo = mix('#c6b494', '#b9a37e', warm)
    g = ['<g opacity="%s">' % n(op)]
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#221f16" opacity=".30"/>'
             % (n(x + r * 0.12), n(y + r * 0.22), n(r * 1.04), n(r * 0.96)))
    g.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (n(x), n(y), n(r), md))
    a0 = jit(0, 360)
    for i in range(6):                                   # outer guard petals
        a = a0 + i * 60 + jit(-8, 8)
        sh = 0.5 - 0.5 * math.sin(math.radians(a))       # top petals catch the light
        px = x + math.cos(math.radians(a)) * r * 0.52
        py = y + math.sin(math.radians(a)) * r * 0.52
        g.append(leaf(px, py, r * 0.58, a + 90, mix(lo, hi, 0.30 + 0.62 * sh), 0.86))
    for i in range(4):                                   # inner whorl
        a = a0 + 40 + i * 90 + jit(-10, 10)
        sh = 0.5 - 0.5 * math.sin(math.radians(a))
        px = x + math.cos(math.radians(a)) * r * 0.30
        py = y + math.sin(math.radians(a)) * r * 0.30
        g.append(leaf(px, py, r * 0.40, a + 90, mix(md, hi, 0.35 + 0.55 * sh), 0.84))
    g.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>'
             % (n(x - r * 0.04), n(y - r * 0.06), n(r * 0.26), hi))
    g.append('<path d="M%s %s A%s %s 0 1 1 %s %s" fill="none" stroke="%s" '
             'stroke-opacity=".45" stroke-width="%s"/>'
             % (n(x - r * 0.22), n(y - r * 0.02), n(r * 0.23), n(r * 0.23),
                n(x + r * 0.20), n(y + r * 0.06), lo, n(max(0.35, r * 0.075))))
    g.append('<path d="M%s %s A%s %s 0 0 0 %s %s A%s %s 0 0 1 %s %s Z" fill="%s" '
             'opacity=".30"/>'
             % (n(x - r), n(y + r * 0.10), n(r), n(r), n(x + r), n(y + r * 0.10),
                n(r * 1.2), n(r * 1.2), n(x - r), n(y + r * 0.10), lo))
    g.append('</g>')
    return ''.join(g)

def blossom(x, y, r, col='#f7ecd8'):
    g = []
    for i in range(5):
        a = i * 72 + jit(-12, 12)
        g.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (
            n(x + math.cos(math.radians(a)) * r * 0.55),
            n(y + math.sin(math.radians(a)) * r * 0.55), n(r * 0.52), col))
    g.append('<circle cx="%s" cy="%s" r="%s" fill="#efdcb4"/>' % (n(x), n(y), n(r * 0.3)))
    return ''.join(g)

def spike(x, y, h, w, ang, col='#f4ead6'):
    """Tall stock / delphinium spire of tiny florets."""
    g = []
    ex = x + math.sin(math.radians(ang)) * h
    ey = y - math.cos(math.radians(ang)) * h
    g.append('<path d="M%s %s Q%s %s %s %s" stroke="%s" stroke-width="%s" fill="none"/>'
             % (n(x), n(y), n((x + ex) / 2 + jit(-4, 4)), n((y + ey) / 2), n(ex), n(ey),
                mix(GREEN_D, GREEN_M, 0.5), n(max(0.6, w * 0.16))))
    m = max(4, int(h / (w * 0.55)))
    for i in range(m):
        u = i / float(m - 1)
        px = x + (ex - x) * u
        py = y + (ey - y) * u
        r = w * (0.55 - 0.34 * u) * jit(0.75, 1.25)
        g.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (
            n(px + jit(-w * 0.3, w * 0.3)), n(py + jit(-w * 0.2, w * 0.2)), n(max(0.6, r)),
            mix(col, '#ddcdae', jit(0, 0.55))))
    return ''.join(g)

# ============================================================== lighting ====

def catenary(p0, p1, sag, m=26):
    pts = []
    for i in range(m + 1):
        u = i / float(m)
        x = p0[0] + (p1[0] - p0[0]) * u
        y = p0[1] + (p1[1] - p0[1]) * u + math.sin(math.pi * u) * sag
        pts.append((x, y))
    return pts

def fairy_strand(p0, p1, sag, count, size=1.9, glow=1.0, wire=True):
    pts = catenary(p0, p1, sag, 30)
    g = []
    if wire:
        g.append('<polyline points="%s" fill="none" stroke="#241a10" '
                 'stroke-opacity=".55" stroke-width=".9"/>' % poly(pts))
    for i in range(count):
        u = (i + 0.5) / count
        x = p0[0] + (p1[0] - p0[0]) * u
        y = p0[1] + (p1[1] - p0[1]) * u + math.sin(math.pi * u) * sag
        s = size * jit(0.75, 1.3)
        g.append('<circle cx="%s" cy="%s" r="%s" fill="url(#gBulb)" opacity="%s" '
                 'style="mix-blend-mode:screen"/>' % (n(x), n(y), n(s * 6.5), n(0.75 * glow)))
        g.append('<circle cx="%s" cy="%s" r="%s" fill="#fff6df"/>' % (n(x), n(y), n(s)))
        g.append('<circle cx="%s" cy="%s" r="%s" fill="#ffffff" opacity=".9"/>'
                 % (n(x), n(y), n(s * 0.45)))
    return ''.join(g)

def flame(x, y, s, op=1.0):
    return ('<g opacity="%s"><ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gFlame)" '
            'style="mix-blend-mode:screen"/>'
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#ffdf9c" opacity=".9"/>'
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#fffdf2"/></g>'
            % (n(op), n(x), n(y), n(s * 5.2), n(s * 6.0),
               n(x), n(y), n(s * 0.85), n(s * 1.7),
               n(x), n(y + s * 0.2), n(s * 0.42), n(s * 0.95)))

def chandelier(cx, cy, rx, nl, scale=1.0):
    ry = rx * 0.30
    g = ['<g id="chand">']
    g.append('<line x1="%s" y1="%s" x2="%s" y2="-40" stroke="#1a1108" stroke-width="%s"/>'
             % (n(cx), n(cy - ry), n(cx), n(3.0 * scale)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#241708" '
             'stroke-width="%s"/>' % (n(cx), n(cy), n(rx), n(ry), n(7 * scale)))
    # back-half lights first
    for half in (0, 1):
        for i in range(nl):
            a = 360.0 * i / nl - 90
            sn = math.sin(math.radians(a))
            if (sn < 0) != (half == 0):
                continue
            px = cx + math.cos(math.radians(a)) * rx
            py = cy + sn * ry
            ch = 22 * scale
            g.append('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="#f3e6cd"/>'
                     % (n(px - 2.6 * scale), n(py - ch), n(5.2 * scale), n(ch), n(2 * scale)))
            g.append(flame(px, py - ch - 2.5 * scale, 3.1 * scale))
        if half == 0:
            g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#3a2410" '
                     'stroke-width="%s"/>' % (n(cx), n(cy), n(rx), n(ry), n(5 * scale)))
            for i in range(8):
                a = 360.0 * i / 8
                g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#2a1a0c" '
                         'stroke-width="%s"/>' % (
                             n(cx), n(cy), n(cx + math.cos(math.radians(a)) * rx),
                             n(cy + math.sin(math.radians(a)) * ry), n(2.4 * scale)))
            g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#33200e" '
                     'stroke-width="%s"/>' % (n(cx), n(cy), n(rx * 0.42), n(ry * 0.42), n(3.4 * scale)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gAmber)" opacity=".92" '
             'style="mix-blend-mode:screen"/>' % (n(cx), n(cy - ry * 0.4), n(rx * 3.0), n(rx * 2.2)))
    g.append('</g>')
    return ''.join(g)

def wall_lights():
    add('<g id="strings">')
    # strands stretched along both plank walls, following the perspective
    for xe in (LX, RX):
        for hf, cnt in ((1620, 30), (1180, 26), (760, 22)):
            a, b = P(xe, hf, KBACK), P(xe, hf, 1.55)
            add(fairy_strand(a, b, 10 * (b[0] - a[0]) / max(1, abs(b[0] - a[0])) * 1.2,
                             cnt, 1.7, 0.9))
    # strands hung across the roof between the rafters
    for k in (0.235, 0.30, 0.40, 0.56, 0.80):
        a = P(LX, WALLTOP - 60, k)
        b = P(RX, WALLTOP - 60, k)
        c = P(VPX, RIDGE - 120, k)
        add(fairy_strand(a, c, 26 * k * 3, int(20 * (0.4 + k)), 1.6 + k * 1.6, 0.85))
        add(fairy_strand(c, b, 26 * k * 3, int(20 * (0.4 + k)), 1.6 + k * 1.6, 0.85))
    # along the loft rail
    bl, br = P(LX, 0, KBACK)[0], P(RX, 0, KBACK)[0]
    add(fairy_strand((bl + 8, 322), (br - 8, 322), 6, 34, 1.4, 0.8))
    add(fairy_strand((bl + 8, 452), (br - 8, 452), 5, 30, 1.3, 0.7))
    add('</g>')

def wall_greenery():
    """Lit vines climbing the side walls."""
    add('<g id="vines">')
    for cx, k in ((186, 0.60), (1296, 0.60), (300, 0.40), (1180, 0.40)):
        top, bot = 350 + (0.6 - k) * 120, 660 + (0.6 - k) * 60
        sc = 1.0 if k > 0.5 else 0.72
        for i in range(int(90 * sc)):
            u = RND.random()
            y = top + (bot - top) * u
            x = cx + jit(-22, 22) * sc + math.sin(u * 7.0) * 14 * sc
            add(sprig(x, y, jit(0, 360), jit(12, 26) * sc, jit(2.8, 5.4) * sc,
                      dark=0.35 - 0.3 * math.exp(-((u - 0.5) ** 2) / 0.1)))
        add(fairy_strand((cx + jit(-12, 12), top), (cx + jit(-12, 12), bot),
                         jit(-16, 16), 16, 1.5 * sc, 0.95))
        add('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gAmber)" opacity=".35" '
            'style="mix-blend-mode:screen"/>' % (n(cx), n((top + bot) / 2), n(90 * sc), n(180 * sc)))
    add('</g>')

# ================================================================= floor ====

def floor():
    pts = [(P(LX, 0, KBACK)[0], 700), (0, 838), (0, H + 6), (W, H + 6), (W, 831),
           (P(RX, 0, KBACK)[0], 700)]
    add('<g id="floor">')
    add('<polygon points="%s" fill="url(#floorG)"/>' % poly(pts))
    add('<clipPath id="floorClip"><polygon points="%s"/></clipPath>' % poly(pts))
    add('<g clip-path="url(#floorClip)">')
    # broad pool of doorway light down the aisle
    add('<ellipse cx="747" cy="742" rx="220" ry="120" fill="#f0dcb8" opacity=".22" '
        'filter="url(#b22)"/>')
    add('<ellipse cx="747" cy="900" rx="150" ry="330" fill="#e8cfa6" opacity=".13" '
        'filter="url(#b40)"/>')
    # sweeping polish streaks converging on the vanishing point
    for i in range(34):
        u = jit(-1.0, 1.0)
        xf = VPX + u * 1500
        a, b = P(xf, 0, KBACK), P(xf * 1.0, 0, 1.6)
        add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-opacity="%s" '
            'stroke-width="%s"/>' % (n(a[0]), n(a[1]), n(b[0]), n(b[1]),
                                     '#cbb894' if RND.random() < 0.55 else '#3b332a',
                                     n(jit(0.03, 0.10)), n(jit(2, 26))))
    # saw-cut control joints on the slab
    for k in (0.27, 0.39, 0.62, 1.05):
        a, b = P(LX, 0, k), P(RX, 0, k)
        add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#443a30" stroke-opacity=".45" '
            'stroke-width="%s"/>' % (n(a[0]), n(a[1]), n(b[0]), n(b[1]), n(1.2 + 2.4 * k)))
    for xf in (VPX - 900, VPX + 900):
        a, b = P(xf, 0, KBACK), P(xf, 0, 1.6)
        add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#443a30" stroke-opacity=".4" '
            'stroke-width="2"/>' % (n(a[0]), n(a[1]), n(b[0]), n(b[1])))
    add('<rect x="0" y="960" width="%s" height="%s" fill="#241d16" opacity=".35"/>' % (W, H - 960))
    add('</g></g>')

# ============================================================== the arch ====

def arch_path_points(m=120):
    """Sample the greenery arch: two legs and a crown over the doorway."""
    pts = []
    for i in range(m):
        u = i / float(m - 1)
        if u < 0.34:                       # left leg
            v = u / 0.34
            x = 660 - 6 * v
            y = 708 - 168 * v
            w = 1.0 - 0.18 * v
        elif u < 0.66:                     # crown
            v = (u - 0.34) / 0.32
            t = v
            x = (1 - t) ** 2 * 654 + 2 * (1 - t) * t * 745 + t ** 2 * 836
            y = (1 - t) ** 2 * 540 + 2 * (1 - t) * t * 452 + t ** 2 * 540
            w = 0.82 + 0.34 * math.sin(math.pi * t)
        else:                              # right leg
            v = (u - 0.66) / 0.34
            x = 836 + 6 * v
            y = 540 + 168 * v
            w = 0.82 + 0.18 * v
        pts.append((x, y, w))
    return pts

def arch():
    add('<g id="arch">')
    # ivory panels hung inside the opening
    for (a, b, sh) in ((656, 700, 0.0), (790, 834, 0.10)):
        add('<path d="M%s 486 C%s 560 %s 640 %s 700 L%s 700 C%s 640 %s 556 %s 486 Z" '
            'fill="url(#silkH)" opacity="%s"/>' % (
                a, a - 6, a - 2, a - 10, b - 4, b - 10, b - 2, b - 2, n(0.95 - sh)))
        for i in range(5):
            fx = a + 6 + i * ((b - a - 12) / 4.0)
            add('<path d="M%s 490 C%s 560 %s 630 %s 698" stroke="#c8ac83" '
                'stroke-opacity=".35" stroke-width="1.4" fill="none"/>'
                % (n(fx), n(fx - 3), n(fx - 1), n(fx - 5)))
    pts = arch_path_points()
    # foliage body
    for (x, y, w) in pts:
        for _ in range(9):
            r = jit(-30, 30) * w
            r2 = jit(-26, 26) * w
            add(sprig(x + r, y + r2, jit(0, 360), jit(11, 24) * w, jit(2.8, 5.2) * w,
                      dark=clamp(0.55 - 0.9 * math.exp(-((x - 745) ** 2) / 40000.0), 0, 0.55)))
    # white blooms threaded through it
    for (x, y, w) in pts[::2]:
        if RND.random() < 0.72:
            add(rose(x + jit(-26, 26) * w, y + jit(-22, 22) * w, jit(4.5, 9.5) * w,
                     warm=0.25))
        if RND.random() < 0.55:
            add(blossom(x + jit(-30, 30) * w, y + jit(-26, 26) * w, jit(2.2, 4.4) * w))
    # a couple of trailing tendrils
    for (bx, by, ang) in ((664, 700, 96), (832, 700, 84), (700, 470, 130), (790, 470, 50)):
        add(sprig(bx, by, ang + jit(-14, 14), jit(30, 60), jit(3.5, 5.5), 0.25))
    add('<ellipse cx="745" cy="560" rx="190" ry="150" fill="url(#gAmber)" opacity=".28" '
        'style="mix-blend-mode:screen"/>')
    add('</g>')

def pedestal_arrangement(cx, base_y, k):
    """Stone urn with a tall white-and-green arrangement."""
    g = ['<g>']
    uw = 300 * k          # urn rim width in px
    uh = 190 * k
    top = base_y - uh
    stone, stone_d = '#a89a80', '#6b6152'
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#120c06" opacity=".55"/>'
             % (n(cx), n(base_y + 2), n(uw * 0.52), n(uw * 0.16)))
    g.append('<path d="M%s %s L%s %s Q%s %s %s %s L%s %s Q%s %s %s %s L%s %s Z" fill="%s"/>' % (
        n(cx - uw * 0.5), n(top), n(cx - uw * 0.42), n(top + uh * 0.34),
        n(cx - uw * 0.22), n(top + uh * 0.62), n(cx - uw * 0.13), n(base_y - uh * 0.16),
        n(cx + uw * 0.13), n(base_y - uh * 0.16),
        n(cx + uw * 0.22), n(top + uh * 0.62), n(cx + uw * 0.42), n(top + uh * 0.34),
        n(cx + uw * 0.5), n(top), stone))
    g.append('<path d="M%s %s L%s %s Q%s %s %s %s L%s %s Z" fill="%s" opacity=".55"/>' % (
        n(cx - uw * 0.5), n(top), n(cx - uw * 0.42), n(top + uh * 0.34),
        n(cx - uw * 0.22), n(top + uh * 0.62), n(cx - uw * 0.13), n(base_y - uh * 0.16),
        n(cx - uw * 0.02), n(base_y - uh * 0.16), stone_d))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/>'
             % (n(cx), n(top), n(uw * 0.5), n(uw * 0.11), mix(stone, '#d8cdb4', .45)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/>'
             % (n(cx), n(top + uw * 0.02), n(uw * 0.40), n(uw * 0.085), stone_d))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s"/>' % (
        n(cx - uw * 0.30), n(base_y - uh * 0.18), n(uw * 0.60), n(uh * 0.20),
        n(uh * 0.05), stone))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>' % (
        n(cx - uw * 0.30), n(base_y - uh * 0.06), n(uw * 0.60), n(uh * 0.06), stone_d))
    # the arrangement
    R_ = 240 * k
    for _ in range(90):
        a = jit(0, 360)
        rr = jit(0.15, 1.0) ** 0.6
        px = cx + math.cos(math.radians(a)) * R_ * 1.05 * rr
        py = top - R_ * 0.55 + math.sin(math.radians(a)) * R_ * 0.72 * rr
        add_len = jit(14, 34) * k * 3.4
        g.append(sprig(px, py, jit(0, 360), add_len, jit(2.4, 4.6) * k * 3.4, dark=0.2))
    for _ in range(3):
        g.append(spike(cx + jit(-R_ * 0.8, R_ * 0.8), top - R_ * 0.5,
                       jit(0.6, 1.05) * R_, 6 * k * 3.4, jit(-30, 30)))
    for _ in range(26):
        a = jit(0, 360)
        rr = jit(0.1, 1.0) ** 0.5
        g.append(rose(cx + math.cos(math.radians(a)) * R_ * 0.9 * rr,
                      top - R_ * 0.55 + math.sin(math.radians(a)) * R_ * 0.62 * rr,
                      jit(4, 8) * k * 3.4, warm=0.2, op=jit(.8, 1)))
    for _ in range(30):
        a = jit(0, 360)
        rr = jit(0.1, 1.0) ** 0.5
        g.append(blossom(cx + math.cos(math.radians(a)) * R_ * 1.0 * rr,
                         top - R_ * 0.5 + math.sin(math.radians(a)) * R_ * 0.7 * rr,
                         jit(2.4, 4.6) * k * 3.4))
    g.append('</g>')
    return ''.join(g)

# =============================================================== seating ====

CH_HW, CH_BACK, CH_SEAT, CH_DEPTH = 50.0, 218.0, 105.0, 104.0

def chair(xf, k, side, lit):
    k2 = kstep(k, -CH_DEPTH)          # seat front edge sits deeper in the room
    dark = mix('#170c04', '#3a2210', 0.5)
    body = mix('#26150a', '#7c4b21', clamp(lit, 0, 1) * 0.98)
    edge = mix(body, '#d09a5a', 0.45)
    cush = mix('#c9b696', '#eee2c8', clamp(lit, 0, 1))
    g = []
    bl = P(xf - CH_HW, 0, k)
    br = P(xf + CH_HW, 0, k)
    wpx = br[0] - bl[0]
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#0d0803" opacity=".5"/>'
             % (n((bl[0] + br[0]) / 2), n(bl[1]), n(wpx * 0.62), n(wpx * 0.17)))
    # seat pad, receding away from the camera
    a1, a2 = P(xf - CH_HW, CH_SEAT, k), P(xf + CH_HW, CH_SEAT, k)
    b1, b2 = P(xf - CH_HW, CH_SEAT, k2), P(xf + CH_HW, CH_SEAT, k2)
    g.append('<polygon points="%s" fill="%s"/>' % (poly([b1, b2, a2, a1]), cush))
    g.append('<polygon points="%s" fill="%s" opacity=".55"/>' % (
        poly([b1, b2, ((b2[0] + a2[0]) / 2, (b2[1] + a2[1]) / 2),
              ((b1[0] + a1[0]) / 2, (b1[1] + a1[1]) / 2)]), mix(cush, '#ffffff', .5)))
    g.append('<polygon points="%s" fill="%s"/>' % (
        poly([a1, a2, (a2[0], a2[1] + wpx * 0.09), (a1[0], a1[1] + wpx * 0.09)]),
        mix(cush, '#6a5b44', .5)))
    # front legs
    for sx in (-CH_HW * 0.92, CH_HW * 0.92):
        p0, p1 = P(xf + sx, CH_SEAT, k2), P(xf + sx, 0, k2)
        g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s"/>'
                 % (n(p0[0]), n(p0[1]), n(p1[0]), n(p1[1]), dark, n(max(0.8, wpx * 0.075))))
    # back frame
    tl, tr = P(xf - CH_HW * 0.94, CH_BACK, k), P(xf + CH_HW * 0.94, CH_BACK, k)
    sl, sr = P(xf - CH_HW * 0.94, CH_SEAT * 0.02, k), P(xf + CH_HW * 0.94, CH_SEAT * 0.02, k)
    pw = max(1.1, wpx * 0.125)
    for (t, s) in ((tl, sl), (tr, sr)):
        g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" '
                 'stroke-linecap="round"/>' % (n(t[0]), n(t[1]), n(s[0]), n(s[1]), body, n(pw)))
    g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" '
             'stroke-linecap="round"/>' % (n(tl[0] + pw * .3), n(tl[1]), n(sl[0] + pw * .3),
                                           n(sl[1]), edge, n(max(0.4, pw * 0.32))))
    for hh in (CH_BACK, CH_BACK * 0.86, CH_BACK * 0.68, CH_BACK * 0.50):
        p0, p1 = P(xf - CH_HW * 0.94, hh, k), P(xf + CH_HW * 0.94, hh, k)
        g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" '
                 'stroke-linecap="round"/>' % (n(p0[0]), n(p0[1]), n(p1[0]), n(p1[1]),
                                               body, n(max(0.7, pw * (1.15 if hh == CH_BACK else 0.62))))) 
        if hh == CH_BACK:
            g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" '
                     'stroke-linecap="round"/>' % (n(p0[0]), n(p0[1] - pw * .28), n(p1[0]),
                                                   n(p1[1] - pw * .28), edge, n(max(0.4, pw * 0.34))))
    return ''.join(g)

def seating():
    add('<g id="seating">')
    d_front = dk(0.72)
    rows = []
    for i in range(-1, 10):
        d = d_front + i * 195.0
        rows.append(kd(d))
    for k in rows:
        wall_l = P(LX, 0, k)[0]
        wall_r = P(RX, 0, k)[0]
        for side in (-1, 1):
            for c in range(14):
                xf = VPX + side * (AISLE + 66 + 115.0 * c)
                x0 = P(xf - CH_HW, 0, k)[0]
                x1 = P(xf + CH_HW, 0, k)[0]
                if side < 0 and x0 < wall_l + 6:
                    break
                if side > 0 and x1 > wall_r - 6:
                    break
                if x1 < -70 or x0 > W + 70:
                    continue
                lit = 0.62 * math.exp(-(c ** 2) / 20.0) + 0.34 * math.exp(-((k - 0.40) ** 2) / 0.05)
                add(chair(xf + jit(-4, 4), k, side, lit * jit(0.85, 1.12)))
    add('</g>')

# ================================================================= aisle ====

def cylinder(xf, k, dia=58.0, ht=120.0, lit=1.0):
    x0 = P(xf - dia / 2, 0, k)[0]
    x1 = P(xf + dia / 2, 0, k)[0]
    yb = P(xf, 0, k)[1]
    yt = P(xf, ht, k)[1]
    w = x1 - x0
    ry = w * 0.17
    wax_t = yb - (yb - yt) * jit(0.55, 0.80)
    g = ['<g>']
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#0e0904" opacity=".45"/>'
             % (n((x0 + x1) / 2), n(yb + ry * 0.4), n(w * 0.72), n(ry * 1.15)))
    # warm pool cast on the slab
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gAmber)" opacity=".30" '
             'style="mix-blend-mode:screen"/>' % (n((x0 + x1) / 2), n(yb), n(w * 1.7), n(w * 0.62)))
    # glass
    g.append('<path d="M%s %s L%s %s A%s %s 0 0 0 %s %s L%s %s Z" fill="url(#glassG)"/>'
             % (n(x0), n(yt), n(x0), n(yb), n(w / 2), n(ry), n(x1), n(yb), n(x1), n(yt)))
    # candle inside
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>'
             % (n(x0 + w * 0.14), n(wax_t), n(w * 0.72), n(yb - wax_t),
                mix('#d8c6a2', '#f6e9cd', lit * 0.75)))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#8d7a56" '
             'opacity=".28"/>'
             % (n(x0 + w * 0.62), n(wax_t), n(w * 0.24), n(yb - wax_t)))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fffaee" opacity=".45"/>'
             % (n(x0 + w * 0.19), n(wax_t), n(w * 0.16), n(yb - wax_t)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#efdcb6"/>'
             % (n((x0 + x1) / 2), n(wax_t), n(w * 0.36), n(w * 0.11)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#fff8e6"/>'
             % (n((x0 + x1) / 2), n(wax_t + w * 0.012), n(w * 0.27), n(w * 0.075)))
    g.append(flame((x0 + x1) / 2, wax_t - w * 0.15, max(0.9, w * 0.085)))
    # glass rim + highlights
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#fff5e2" '
             'stroke-opacity=".55" stroke-width="%s"/>'
             % (n((x0 + x1) / 2), n(yt), n(w / 2), n(ry), n(max(0.5, w * 0.045))))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#c9b28c" '
             'stroke-opacity=".35" stroke-width="%s"/>'
             % (n((x0 + x1) / 2), n(yb), n(w / 2), n(ry), n(max(0.4, w * 0.04))))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#ffffff" opacity=".28"/>'
             % (n(x0 + w * 0.10), n(yt + ry), n(max(0.6, w * 0.07)), n(yb - yt - ry)))
    g.append('</g>')
    return ''.join(g)

def aisle_dressing():
    items = []
    # continuous greenery ribbon down both sides
    for side in (-1, 1):
        d = dk(1.28)
        while d < dk(0.207):
            k = kd(d)
            xf = VPX + side * (AISLE + jit(-14, 52))
            x, y = P(xf, 0, k)
            items.append((k, sprig(x, y + jit(-3, 3) * k * 3, jit(0, 360),
                                   jit(22, 46) * k * 1.9, jit(4.5, 8.0) * k * 1.9,
                                   dark=0.16)))
            d += 26
    # petals strewn along the edges
    for _ in range(1250):
        k = kd(jit(dk(1.30), dk(0.205)))
        side = RND.choice((-1, 1))
        off = jit(-58, 150) * (0.6 + RND.random())
        xf = VPX + side * (AISLE + off)
        x, y = P(xf, 0, k)
        s = 9.0 * k
        c = mix('#f4ead6', '#cdbb9a', jit(0, 0.7))
        items.append((k + 0.0005, '<ellipse rx="%s" ry="%s" fill="%s" opacity="%s" '
                                  'transform="translate(%s,%s) rotate(%s)"/>'
                      % (n(s), n(s * 0.36), c, n(jit(0.42, 0.90)), n(x), n(y), n(jit(0, 180)))))
    # candle clusters
    d = dk(1.22)
    while d < dk(0.213):
        k = kd(d)
        for side in (-1, 1):
            grp = RND.randint(1, 3)
            for j in range(grp):
                kk = kstep(k, jit(-22, 22))
                xf = VPX + side * (AISLE + jit(2, 64))
                items.append((kk + 0.001,
                              cylinder(xf, kk, dia=jit(48, 70), ht=jit(86, 150),
                                       lit=clamp(0.5 + kk, 0, 1))))
        d += jit(150, 210)
    items.sort(key=lambda t: t[0])
    add('<g id="aisle">')
    for _, s in items:
        add(s)
    add('</g>')

# ================================================================ drapes ====

def swag(p0, p1, sag, width, opacity=1.0, folds=7, grad='silkH'):
    """A hanging band of chiffon between two anchor points."""
    top = catenary(p0, p1, sag, 34)
    bot = [(x, y + width * (0.55 + 0.65 * math.sin(math.pi * (i / 34.0))))
           for i, (x, y) in enumerate(top)]
    d = 'M' + ' L'.join(pt(p) for p in top) + ' L' + ' L'.join(pt(p) for p in reversed(bot)) + ' Z'
    g = ['<g opacity="%s">' % n(opacity)]
    g.append('<path d="%s" fill="url(#%s)"/>' % (d, grad))
    for i in range(folds):
        u = (i + 0.5) / folds
        idx = int(u * 34)
        x0, y0 = top[idx]
        x1, y1 = bot[idx]
        g.append('<path d="M%s %s Q%s %s %s %s" stroke="#a58254" stroke-opacity=".16" stroke-width="%s" '
                 'fill="none"/>' % (n(x0), n(y0), n(x0 + jit(-8, 8)), n((y0 + y1) / 2),
                                    n(x1 + jit(-10, 10)), n(y1), n(jit(1.4, 3.4))))
        g.append('<path d="M%s %s Q%s %s %s %s" stroke="#fffdf6" stroke-opacity=".30" '
                 'stroke-width="%s" fill="none"/>'
                 % (n(x0 + 4), n(y0), n(x0 + jit(-6, 10)), n((y0 + y1) / 2),
                    n(x1 + jit(-8, 12)), n(y1), n(jit(1.0, 2.4))))
    g.append('<path d="%s" fill="url(#silkFold)" opacity=".28"/>' % d)
    g.append('</g>')
    return ''.join(g)

def ceiling_drapes():
    add('<g id="swags">')
    # deep swags receding toward the loft, drawn first so they sit behind
    for (a, b, ay, sag, wdt, op) in ((496, 742, 184, 46, 28, .72), (742, 992, 184, 46, 28, .72),
                                     (540, 742, 222, 38, 22, .60), (742, 946, 222, 38, 22, .60)):
        add(swag((a, ay), (b, ay - 6), sag, wdt, op))
    # fan rising from the two hero posts to the ridge
    for i, (ax, ay, sag, wdt, op) in enumerate([
            (338, -22, 82, 42, .95), (354, 26, 96, 46, .94),
            (378, 78, 110, 50, .93), (404, 130, 120, 52, .92)]):
        add(swag((ax, ay), (742, ay + 4 + i * 14), sag, wdt, op))
        add(swag((W - ax, ay), (742, ay + 4 + i * 14), sag, wdt, op))
    # long shallow swags spanning the room, nearest the camera
    for (ay, sag, wdt, op) in ((-30, 90, 46, .95), (24, 104, 50, .95),
                               (86, 118, 54, .94)):
        add(swag((286, ay), (W - 286, ay), sag, wdt, op))
    add('</g>')

def drape_column(xtop, wtop, xbot, wbot, ytop, ybot, op=1.0, pool=True):
    """A pillar of chiffon wound from the rafters down to the floor."""
    g = ['<g opacity="%s">' % n(op)]
    lx0, rx0 = xtop - wtop / 2, xtop + wtop / 2
    lx1, rx1 = xbot - wbot / 2, xbot + wbot / 2
    d = ('M%s %s C%s %s %s %s %s %s L%s %s C%s %s %s %s %s %s Z'
         % (n(lx0), n(ytop),
            n(lx0 - wtop * 0.14), n(ytop + (ybot - ytop) * 0.36),
            n(lx1 - wbot * 0.10), n(ytop + (ybot - ytop) * 0.72), n(lx1), n(ybot),
            n(rx1), n(ybot),
            n(rx1 + wbot * 0.12), n(ytop + (ybot - ytop) * 0.70),
            n(rx0 + wtop * 0.16), n(ytop + (ybot - ytop) * 0.34), n(rx0), n(ytop)))
    g.append('<path d="%s" fill="url(#silkV)" opacity=".93"/>' % d)
    g.append('<clipPath id="dc%d"><path d="%s"/></clipPath>' % (int(xtop * 7 + wtop), d))
    g.append('<g clip-path="url(#dc%d)">' % int(xtop * 7 + wtop))
    for i in range(13):
        u = (i + 0.5) / 13.0
        x0 = lx0 + wtop * u + jit(-5, 5)
        x1 = lx1 + wbot * u + jit(-4, 4)
        pale = i % 3 == 0
        g.append('<path d="M%s %s C%s %s %s %s %s %s" stroke="%s" stroke-opacity="%s" '
                 'stroke-width="%s" fill="none"/>'
                 % (n(x0), n(ytop), n(x0 - 10), n(ytop + (ybot - ytop) * .4),
                    n(x1 + 8), n(ytop + (ybot - ytop) * .75), n(x1), n(ybot),
                    '#fffdf7' if pale else '#9a7a52', n(jit(.10, .26)),
                    n(jit(2.0, 6.5))))
    # the warm cast of the room's candlelight low on the fabric
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gAmber)" opacity=".30" '
             'style="mix-blend-mode:screen"/>' % (n(xbot), n(ybot - 130), n(wbot), n(320)))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#1a0f06" opacity=".18"/>'
             % (n(min(lx0, lx1) - 10), n(ytop), n(max(wtop, wbot) * 0.26), n(ybot - ytop)))
    g.append('</g>')
    if pool:
        pp = []
        cx = xbot
        hw = wbot * 0.62                       # half-width where the fabric puddles
        htop = ybot - wbot * 1.9
        pp.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#0b0602" opacity=".6" '
                 'filter="url(#b12)"/>' % (n(cx + 12), n(ybot + wbot * 0.16),
                                           n(hw * 1.5), n(wbot * 0.26)))
        hem = ['M%s %s' % (n(cx - wbot * 0.5), n(htop)),
               'C%s %s %s %s %s %s' % (n(cx - wbot * 0.56), n(htop + wbot * 0.9),
                                       n(cx - hw * 0.94), n(ybot - wbot * 0.42),
                                       n(cx - hw), n(ybot + wbot * 0.02))]
        seg = 5
        for j in range(seg):                   # soft scalloped hem where it meets the slab
            xa = cx - hw + (2 * hw) * (j / float(seg))
            xb = cx - hw + (2 * hw) * ((j + 1) / float(seg))
            hem.append('Q%s %s %s %s' % (n((xa + xb) / 2 + jit(-6, 6)),
                                         n(ybot + wbot * jit(0.02, 0.13)),
                                         n(xb), n(ybot + wbot * jit(-0.06, 0.06))))
        hem.append('C%s %s %s %s %s %s Z' % (n(cx + hw * 0.94), n(ybot - wbot * 0.42),
                                             n(cx + wbot * 0.56), n(htop + wbot * 0.9),
                                             n(cx + wbot * 0.5), n(htop)))
        hd = ' '.join(hem)
        pp.append('<path d="%s" fill="url(#silkV)"/>' % hd)
        pp.append('<clipPath id="hem%d"><path d="%s"/></clipPath>' % (int(cx * 3 + wbot), hd))
        pp.append('<g clip-path="url(#hem%d)">' % int(cx * 3 + wbot))
        for j in range(11):                    # gathered folds falling into the pool
            u = (j + 0.5) / 16.0
            x0 = cx + (u - 0.5) * wbot * 1.02
            x1 = cx + (u - 0.5) * hw * 2.05 + jit(-5, 5)
            pp.append('<path d="M%s %s C%s %s %s %s %s %s" fill="none" stroke="%s" '
                     'stroke-opacity="%s" stroke-width="%s"/>'
                     % (n(x0), n(htop), n(x0 - 6), n(htop + wbot * .5),
                        n(x1 + 4), n(ybot - wbot * .3), n(x1), n(ybot + wbot * .2),
                        '#fffdf6' if j % 3 else '#94734a', n(jit(.12, .30)), n(jit(1.4, 4.5))))
        pp.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#5c452a" opacity=".38" '
                 'filter="url(#b7)"/>'
                 % (n(cx), n(ybot + wbot * 0.26), n(hw * 1.3), n(wbot * 0.30)))
        pp.append('</g>')
        g[1:1] = pp
    g.append('</g>')
    return ''.join(g)

# =========================================================== foreground =====

def bouquet(cx, cy, rx, ry, sc, nrose=30, nsprig=150):
    g = ['<g>']
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#14180f" opacity=".55"/>'
             % (n(cx), n(cy), n(rx * 0.95), n(ry * 0.92)))
    for _ in range(nsprig):
        a = jit(0, 360)
        rr = jit(0.1, 1.0) ** 0.5
        px = cx + math.cos(math.radians(a)) * rx * rr * 1.18
        py = cy + math.sin(math.radians(a)) * ry * rr * 1.18
        g.append(sprig(px, py, jit(0, 360), jit(20, 52) * sc, jit(4, 8.5) * sc,
                       dark=clamp(0.62 * (rr - 0.25), 0, 0.55)))
    for _ in range(int(nrose * 0.35)):
        a = jit(0, 360)
        rr = jit(0.1, 1.0) ** 0.5
        g.append(spike(cx + math.cos(math.radians(a)) * rx * rr,
                       cy + math.sin(math.radians(a)) * ry * rr * 0.65,
                       jit(28, 62) * sc, 8 * sc, jit(-45, 45)))
    order = []
    for i in range(nrose):
        a = jit(0, 360)
        rr = jit(0.05, 1.0) ** 0.44
        order.append((rr,
                      cx + math.cos(math.radians(a)) * rx * rr,
                      cy + math.sin(math.radians(a)) * ry * rr))
    order.sort(key=lambda t: -t[0])
    for j, (rr, px, py) in enumerate(order):
        g.append(rose(px, py, jit(7, 17) * sc * (0.78 + 0.3 * (1 - rr)),
                      warm=clamp(0.45 - rr * 0.4, 0, .45),
                      op=clamp(0.62 + 0.4 * (1 - rr), 0, 1)))
        if j % 3 == 1:                       # weave greenery back over the blooms
            g.append(sprig(px + jit(-16, 16) * sc, py + jit(-14, 14) * sc, jit(0, 360),
                           jit(16, 40) * sc, jit(3.5, 7) * sc, dark=0.28))
    for _ in range(int(nrose * 1.8)):
        a = jit(0, 360)
        rr = jit(0.05, 1.0) ** 0.45
        g.append(blossom(cx + math.cos(math.radians(a)) * rx * rr * 1.06,
                         cy + math.sin(math.radians(a)) * ry * rr * 1.06,
                         jit(3, 7) * sc,
                         mix('#f7ecd8', '#cbbb99', jit(0, .45))))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gAmber)" opacity=".26" '
             'style="mix-blend-mode:screen"/>' % (n(cx), n(cy), n(rx * 1.4), n(ry * 1.4)))
    g.append('</g>')
    return ''.join(g)

def sign():
    x0, x1, y0, y1 = 10, 198, 796, 1062
    cx = (x0 + x1) / 2
    g = ['<g transform="rotate(-2.2 %s %s)">' % (n(cx), n((y0 + y1) / 2))]
    d = ('M%s %s Q%s %s %s %s L%s %s L%s %s Z'
         % (n(x0), n(y0 + 34), n(cx), n(y0 - 22), n(x1), n(y0 + 34),
            n(x1), n(y1), n(x0), n(y1)))
    g.append('<path d="%s" fill="#0b0603" opacity=".55" transform="translate(7,9)"/>' % d)
    g.append('<path d="%s" fill="#4a2c14"/>' % d)
    g.append('<clipPath id="signClip"><path d="%s"/></clipPath>' % d)
    g.append('<g clip-path="url(#signClip)">')
    px = x0
    while px < x1:
        t = RND.random()
        lit = 0.62 * math.exp(-((px - 96) ** 2) / 14000.0)
        g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>'
                 % (n(px), n(y0 - 30), n(30.5), n(y1 - y0 + 40),
                    mix('#3a2210', '#8a5527', 0.25 + 0.5 * t * (0.4 + lit))))
        g.append('<rect x="%s" y="%s" width="1.6" height="%s" fill="#1c1006" opacity=".8"/>'
                 % (n(px + 30), n(y0 - 30), n(y1 - y0 + 40)))
        px += 31
    for _ in range(90):
        yy = jit(y0 - 20, y1)
        g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#2a180b" opacity="%s"/>'
                 % (n(jit(x0, x1)), n(yy), n(jit(6, 40)), n(jit(0.5, 1.4)), n(jit(.15, .4))))
    g.append('<ellipse cx="96" cy="880" rx="150" ry="200" fill="url(#gAmber)" opacity=".30" '
             'style="mix-blend-mode:screen"/>')
    g.append('</g>')
    g.append('<path d="%s" fill="none" stroke="#20120722" stroke-width="3"/>' % d)
    lines = [('I have', 34, 856, 92), ('found the one', 30, 906, 152),
             ('whom my soul', 30, 954, 156), ('loves.', 34, 1004, 82)]
    for (txt, size, yy, tl) in lines:
        g.append('<text x="%s" y="%s" text-anchor="middle" font-family="Great Vibes, '
                 'Parisienne, Snell Roundhand, Apple Chancery, cursive" font-size="%s" '
                 'fill="#0d0703" opacity=".5" textLength="%s" '
                 'lengthAdjust="spacingAndGlyphs" transform="translate(2,2.5)">%s</text>'
                 % (n(cx), n(yy), size, tl, txt))
        g.append('<text x="%s" y="%s" text-anchor="middle" font-family="Great Vibes, '
                 'Parisienne, Snell Roundhand, Apple Chancery, cursive" font-size="%s" '
                 'fill="#fbf5e9" textLength="%s" lengthAdjust="spacingAndGlyphs">%s'
                 '</text>' % (n(cx), n(yy), size, tl, txt))
    g.append('<text x="%s" y="1036" text-anchor="middle" font-family="Cormorant Garamond, '
             'Georgia, serif" font-size="11" letter-spacing="2.1" fill="#e9dcc4" '
             'opacity=".9" textLength="132" lengthAdjust="spacingAndGlyphs">'
             'SONG OF SOLOMON 3:4</text>' % n(cx))
    g.append('</g>')
    return ''.join(g)

def lantern(cx, base_y, w, h):
    g = ['<g>']
    metal, metal_l = '#141210', '#3d372e'
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#0b0703" opacity=".5"/>'
             % (n(cx), n(base_y + 3), n(w * 0.8), n(w * 0.2)))
    top = base_y - h
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#241a10" opacity=".9"/>'
             % (n(cx - w / 2 + 3), n(top + w * 0.42), n(w - 6), n(h - w * 0.62)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#gFlame)" opacity=".9" '
             'style="mix-blend-mode:screen"/>'
             % (n(cx), n(base_y - h * 0.34), n(w * 1.5), n(h * 0.6)))
    cw = w * 0.34
    ch = h * 0.42
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#f4e6c8"/>'
             % (n(cx - cw / 2), n(base_y - w * 0.22 - ch), n(cw), n(ch)))
    g.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#fff6e0"/>'
             % (n(cx), n(base_y - w * 0.22 - ch), n(cw / 2), n(cw * 0.18)))
    g.append(flame(cx, base_y - w * 0.22 - ch - cw * 0.30, cw * 0.24))
    # frame
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="%s" '
             'stroke-width="%s"/>' % (n(cx - w / 2), n(top + w * 0.42), n(w),
                                      n(h - w * 0.62), metal, n(w * 0.09)))
    for sx in (-0.5, 0.5):
        g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>'
                 % (n(cx + sx * w - w * 0.05), n(top + w * 0.42), n(w * 0.10),
                    n(h - w * 0.62), metal))
    g.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>'
             % (n(cx - w * 0.60), n(base_y - w * 0.24), n(w * 1.2), n(w * 0.24), metal))
    g.append('<path d="M%s %s L%s %s L%s %s Z" fill="%s"/>'
             % (n(cx - w * 0.62), n(top + w * 0.46), n(cx), n(top), n(cx + w * 0.62),
                n(top + w * 0.46), metal))
    g.append('<path d="M%s %s L%s %s L%s %s" fill="none" stroke="%s" stroke-width="2" '
             'opacity=".8"/>' % (n(cx - w * 0.62), n(top + w * 0.46), n(cx), n(top + 3),
                                 n(cx + w * 0.62), n(top + w * 0.46), metal_l))
    g.append('<path d="M%s %s A%s %s 0 0 1 %s %s" fill="none" stroke="%s" '
             'stroke-width="%s"/>' % (n(cx - w * 0.22), n(top - 1), n(w * 0.22), n(w * 0.22),
                                      n(cx + w * 0.22), n(top - 1), metal, n(w * 0.07)))
    g.append('</g>')
    return ''.join(g)

def foreground():
    add('<g id="fg">')
    # left: sign, blooms above it, lantern
    add(sign())
    add(bouquet(76, 674, 126, 104, 0.95, nrose=32, nsprig=175))
    add(bouquet(18, 792, 78, 62, 0.7, nrose=9, nsprig=70))
    add(lantern(206, 1064, 58, 120))
    for _ in range(70):
        x, y = jit(-10, 250), jit(1000, 1092)
        add('<ellipse rx="%s" ry="%s" fill="%s" opacity="%s" transform="translate(%s,%s) '
            'rotate(%s)"/>' % (n(jit(6, 13)), n(jit(2.5, 5.5)),
                               mix('#f4ead6', '#c9b795', jit(0, .7)), n(jit(.5, 1)),
                               n(x), n(y), n(jit(0, 180))))
    # right: barrel pedestal, blooms, lantern
    add('<g><rect x="1372" y="800" width="120" height="240" rx="12" fill="#4a2c14"/>'
        '<rect x="1372" y="800" width="120" height="18" rx="8" fill="#7a4d24"/>'
        '<rect x="1372" y="880" width="120" height="12" fill="#2a1809" opacity=".7"/>'
        '<rect x="1372" y="980" width="120" height="12" fill="#2a1809" opacity=".7"/></g>')
    add(bouquet(1386, 712, 130, 128, 1.05, nrose=36, nsprig=180))
    add(bouquet(1444, 858, 92, 76, 0.85, nrose=13, nsprig=95))
    add(lantern(1312, 1078, 62, 128))
    for _ in range(60):
        x, y = jit(1240, 1470), jit(1010, 1092)
        add('<ellipse rx="%s" ry="%s" fill="%s" opacity="%s" transform="translate(%s,%s) '
            'rotate(%s)"/>' % (n(jit(6, 13)), n(jit(2.5, 5.5)),
                               mix('#f4ead6', '#c9b795', jit(0, .7)), n(jit(.5, 1)),
                               n(x), n(y), n(jit(0, 180))))
    add('</g>')

def grade():
    add('<g id="grade">')
    add('<rect width="%s" height="%s" fill="#ff8f28" opacity=".13" '
        'style="mix-blend-mode:overlay"/>' % (W, H))
    add('<rect width="%s" height="%s" fill="#2a1608" opacity=".10" '
        'style="mix-blend-mode:multiply"/>' % (W, H))
    add('<rect width="%s" height="%s" fill="#1a2c4a" opacity=".05" '
        'style="mix-blend-mode:soft-light"/>' % (W, H))
    add('<ellipse cx="747" cy="600" rx="330" ry="300" fill="url(#gDoor)" opacity=".22" '
        'style="mix-blend-mode:screen"/>')
    add('<ellipse cx="733" cy="212" rx="330" ry="230" fill="url(#gAmber)" opacity=".30" '
        'style="mix-blend-mode:screen"/>')
    add('<rect width="%s" height="%s" fill="url(#vign)"/>' % (W, H))
    add('<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" '
        'numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/>'
        '</filter>')
    add('<rect width="%s" height="%s" filter="url(#grain)" opacity=".055" '
        'style="mix-blend-mode:overlay"/>' % (W, H))
    add('</g>')

# ============================================================== assemble ====

def build():
    add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" '
        'height="%d" role="img" aria-label="A candlelit rustic barn wedding ceremony: '
        'draped ivory chiffon and string lights under the rafters, an aisle of pillar '
        'candles and white rose petals leading to a floral arch in the open barn doors.">'
        % (W, H, W, H))
    add(defs())
    add('<rect width="%s" height="%s" fill="#0a0603"/>' % (W, H))
    roof()
    side_walls()
    back_wall()
    barn_doors()
    stairs()
    wall_lights()
    wall_greenery()
    add(chandelier(748, 466, 46, 8, 0.62))
    floor()
    arch()
    add(pedestal_arrangement(592, 726, 0.245))
    add(pedestal_arrangement(906, 726, 0.245))
    seating()
    aisle_dressing()
    ceiling_drapes()
    add(chandelier(736, 216, 102, 12, 1.15))
    # mid-ground chiffon pillars wrapping the barn posts
    add(drape_column(506, 40, 466, 52, -10, 726, 0.88, pool=False))
    add(drape_column(982, 40, 1020, 52, -10, 726, 0.88, pool=False))
    # hero pillars framing the shot
    add(drape_column(422, 132, 350, 94, -12, 986, 1.0))
    add(drape_column(1074, 124, 1100, 108, -12, 1006, 1.0))
    foreground()
    grade()
    add('</svg>')
    return ''.join(out)

HTML = """<title>Candlelit Barn Ceremony</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@400;500&display=swap');
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin: 0; background: #0a0705; display: flex; min-height: 100vh;
       align-items: center; justify-content: center; }
:root[data-theme="light"] body { background: #0a0705; }
main { width: 100%; max-width: 1456px; }
svg { display: block; width: 100%; height: auto; }
</style>
<main>__SVG__</main>
"""

if __name__ == '__main__':
    svg = build()
    with open('scene.svg', 'w', encoding='utf-8') as fh:
        fh.write('<?xml version="1.0" encoding="UTF-8"?>\n' + svg)
    with open('index.html', 'w', encoding='utf-8') as fh:
        fh.write(HTML.replace('__SVG__', svg))
    print('svg elements: %d   bytes: %d' % (len(out), len(svg)))

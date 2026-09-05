"""Every material in the scene, built procedurally from shader nodes.

Nothing here loads an external texture -- the whole look is generated, so the
build is reproducible from source alone.
"""

import bpy

from . import palette as P

_cache = {}


# --------------------------------------------------------------------------
# node helpers
# --------------------------------------------------------------------------

def _new(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    out.location = (600, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (260, 0)
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat, nt, bsdf, out


def _set(bsdf, **kw):
    alias = {
        "base": "Base Color", "rough": "Roughness", "metal": "Metallic",
        "ior": "IOR", "alpha": "Alpha", "coat": "Coat Weight",
        "coat_rough": "Coat Roughness", "sheen": "Sheen Weight",
        "sheen_rough": "Sheen Roughness", "sheen_tint": "Sheen Tint",
        "emission": "Emission Color", "strength": "Emission Strength",
        "spec": "Specular IOR Level", "transmission": "Transmission Weight",
        "sss": "Subsurface Weight", "sss_radius": "Subsurface Radius",
        "aniso": "Anisotropic", "tint": "Specular Tint",
    }
    for key, value in kw.items():
        socket = alias.get(key, key)
        if socket in bsdf.inputs:
            bsdf.inputs[socket].default_value = value


def _noise(nt, scale=12.0, detail=6.0, rough=0.55, distortion=0.0, loc=(-700, 0),
           dimensions="3D"):
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.location = loc
    n.noise_dimensions = dimensions
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = rough
    n.inputs["Distortion"].default_value = distortion
    return n


def _ramp(nt, stops, loc=(-500, 0), interpolation="LINEAR"):
    r = nt.nodes.new("ShaderNodeValToRGB")
    r.location = loc
    r.color_ramp.interpolation = interpolation
    elems = r.color_ramp.elements
    while len(elems) > 1:
        elems.remove(elems[-1])
    elems[0].position, elems[0].color = stops[0]
    for pos, col in stops[1:]:
        e = elems.new(pos)
        e.color = col
    return r


def _bump(nt, bsdf, height_socket, strength=0.25, distance=0.004, loc=(0, -420)):
    b = nt.nodes.new("ShaderNodeBump")
    b.location = loc
    b.inputs["Strength"].default_value = strength
    b.inputs["Distance"].default_value = distance
    nt.links.new(height_socket, b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
    return b


def _coord(nt, loc=(-950, 0)):
    c = nt.nodes.new("ShaderNodeTexCoord")
    c.location = loc
    return c


def _mapping(nt, coord_out, scale=(1, 1, 1), loc=(-820, 0), rotation=(0, 0, 0)):
    m = nt.nodes.new("ShaderNodeMapping")
    m.location = loc
    m.inputs["Scale"].default_value = scale
    m.inputs["Rotation"].default_value = rotation
    nt.links.new(coord_out, m.inputs["Vector"])
    return m


def _mixrgb(nt, a, b, fac_socket=None, fac=0.5, loc=(-300, 0), blend="MIX"):
    n = nt.nodes.new("ShaderNodeMix")
    n.data_type = "RGBA"
    n.blend_type = blend
    n.location = loc
    n.inputs["A"].default_value = a
    n.inputs["B"].default_value = b
    if fac_socket is not None:
        nt.links.new(fac_socket, n.inputs["Factor"])
    else:
        n.inputs["Factor"].default_value = fac
    return n


def cached(fn):
    def wrapper(*args, **kwargs):
        key = (fn.__name__,) + args + tuple(sorted(kwargs.items()))
        if key not in _cache:
            _cache[key] = fn(*args, **kwargs)
        return _cache[key]
    return wrapper


def reset_cache():
    _cache.clear()


# --------------------------------------------------------------------------
# generic
# --------------------------------------------------------------------------

@cached
def simple(name, hex_color, rough=0.5, metal=0.0, **kw):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, metal=metal, **kw)
    return mat


@cached
def emissive(name, hex_color, strength=1.0):
    """Flat emitter -- used for every pixel of the CRT interface.

    The colour is linearised first: a phosphor showing navy really does emit a
    fraction of what white does, and feeding sRGB values straight in washes the
    whole picture out.
    """
    mat, nt, bsdf, out = _new(name)
    em = nt.nodes.new("ShaderNodeEmission")
    em.location = (260, -200)
    em.inputs["Color"].default_value = P.srgb(hex_color)
    em.inputs["Strength"].default_value = strength
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    nt.nodes.remove(bsdf)
    return mat


@cached
def plastic(name, hex_color, rough=0.42, noise_scale=140.0, bump=0.12, coat=0.08):
    """Injection-moulded plastic with a faint stipple, like real 90s ABS."""
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, coat=coat, coat_rough=0.34)
    n = _noise(nt, scale=noise_scale, detail=4.0, rough=0.7)
    fine = _noise(nt, scale=noise_scale * 6.0, detail=2.0, loc=(-700, -260))
    add = nt.nodes.new("ShaderNodeMix")
    add.data_type = "RGBA"
    add.blend_type = "ADD"
    add.location = (-500, -140)
    add.inputs["Factor"].default_value = 0.4
    nt.links.new(n.outputs["Fac"], add.inputs["A"])
    nt.links.new(fine.outputs["Fac"], add.inputs["B"])
    _bump(nt, bsdf, add.outputs["Result"], strength=bump, distance=0.0009)
    # roughness breakup so highlights are not glassy-uniform
    rr = _ramp(nt, [(0.0, (rough - 0.07, 0, 0, 1)), (1.0, (rough + 0.09, 0, 0, 1))],
               loc=(-320, 220))
    nt.links.new(n.outputs["Fac"], rr.inputs["Fac"])
    nt.links.new(rr.outputs["Color"], bsdf.inputs["Roughness"])
    return mat


@cached
def metal(name, hex_color, rough=0.28, aniso=0.0, bump=0.06):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, metal=1.0, aniso=aniso)
    n = _noise(nt, scale=90.0, detail=5.0)
    _bump(nt, bsdf, n.outputs["Fac"], strength=bump, distance=0.0006)
    rr = _ramp(nt, [(0.0, (rough * 0.7, 0, 0, 1)), (1.0, (rough * 1.35, 0, 0, 1))],
               loc=(-320, 220))
    nt.links.new(n.outputs["Fac"], rr.inputs["Fac"])
    nt.links.new(rr.outputs["Color"], bsdf.inputs["Roughness"])
    return mat


@cached
def paint(name, hex_color, rough=0.62, bump=0.35):
    """Matte interior wall paint over a lightly textured substrate."""
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, spec=0.28)
    n = _noise(nt, scale=260.0, detail=8.0, rough=0.62)
    _bump(nt, bsdf, n.outputs["Fac"], strength=bump, distance=0.0015)
    big = _noise(nt, scale=3.2, detail=3.0, loc=(-700, 300))
    rr = _ramp(nt, [(0.35, (rough - 0.05, 0, 0, 1)), (0.72, (rough + 0.08, 0, 0, 1))],
               loc=(-460, 300))
    nt.links.new(big.outputs["Fac"], rr.inputs["Fac"])
    nt.links.new(rr.outputs["Color"], bsdf.inputs["Roughness"])
    return mat


@cached
def paper(name, hex_color=P.PAPER, rough=0.78):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, sheen=0.16, sheen_rough=0.55,
         spec=0.25)
    n = _noise(nt, scale=420.0, detail=6.0)
    _bump(nt, bsdf, n.outputs["Fac"], strength=0.14, distance=0.0004)
    return mat


@cached
def fabric(name, hex_color, rough=0.86, weave=340.0, bump=0.55, sheen=0.55):
    """Woven cloth -- mousepad, banner, rug, chair seats."""
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, sheen=sheen, sheen_rough=0.4,
         spec=0.16)
    coord = _coord(nt)
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.location = (-700, -150)
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.inputs["Scale"].default_value = weave
    wave.inputs["Distortion"].default_value = 2.0
    nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    wave2 = nt.nodes.new("ShaderNodeTexWave")
    wave2.location = (-700, -380)
    wave2.wave_type = "BANDS"
    wave2.bands_direction = "Y"
    wave2.inputs["Scale"].default_value = weave
    wave2.inputs["Distortion"].default_value = 2.0
    nt.links.new(coord.outputs["Object"], wave2.inputs["Vector"])
    m = nt.nodes.new("ShaderNodeMix")
    m.data_type = "RGBA"
    m.blend_type = "MULTIPLY"
    m.location = (-480, -250)
    m.inputs["Factor"].default_value = 1.0
    nt.links.new(wave.outputs["Color"], m.inputs["A"])
    nt.links.new(wave2.outputs["Color"], m.inputs["B"])
    _bump(nt, bsdf, m.outputs["Result"], strength=bump, distance=0.0018)
    return mat


@cached
def ceramic(name, hex_color=P.MUG_WHITE, rough=0.14, speckle=0.0):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, coat=0.55, coat_rough=0.06,
         spec=0.55)
    if speckle > 0.0:
        n = _noise(nt, scale=520.0, detail=2.0, rough=0.3)
        r = _ramp(nt, [(0.62, (1, 1, 1, 1)), (0.70, (0.16, 0.15, 0.14, 1))],
                  loc=(-500, 0), interpolation="CONSTANT")
        nt.links.new(n.outputs["Fac"], r.inputs["Fac"])
        m = _mixrgb(nt, P.srgb(hex_color), (0.1, 0.1, 0.1, 1), loc=(-260, 0))
        nt.links.new(r.outputs["Color"], m.inputs["A"])
        mult = nt.nodes.new("ShaderNodeMix")
        mult.data_type = "RGBA"
        mult.blend_type = "MULTIPLY"
        mult.location = (-60, 120)
        mult.inputs["Factor"].default_value = speckle
        mult.inputs["A"].default_value = P.srgb(hex_color)
        nt.links.new(r.outputs["Color"], mult.inputs["B"])
        nt.links.new(mult.outputs["Result"], bsdf.inputs["Base Color"])
    return mat


@cached
def glass(name, hex_color="#EAF2F5", rough=0.02, ior=1.52, transmission=1.0):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, ior=ior,
         transmission=transmission, spec=0.6)
    return mat


@cached
def leaf(name, hex_color=P.FOLIAGE, rough=0.42, variation=0.35):
    """Waxy leaf with backlight translucency -- the plants read as alive."""
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, sss=0.14,
         sss_radius=(0.010, 0.020, 0.006), coat=0.22, coat_rough=0.25, spec=0.4)
    coord = _coord(nt)
    n = _noise(nt, scale=6.0, detail=5.0)
    nt.links.new(coord.outputs["Object"], n.inputs["Vector"])
    m = _mixrgb(nt, P.srgb(P.FOLIAGE_DARK), P.srgb(P.FOLIAGE_LIGHT), loc=(-360, 0))
    nt.links.new(n.outputs["Fac"], m.inputs["Factor"])
    base = _mixrgb(nt, P.srgb(hex_color), (0, 0, 0, 1), fac=variation, loc=(-140, 60))
    nt.links.new(m.outputs["Result"], base.inputs["B"])
    nt.links.new(base.outputs["Result"], bsdf.inputs["Base Color"])
    veins = _noise(nt, scale=90.0, detail=4.0, loc=(-700, -300))
    _bump(nt, bsdf, veins.outputs["Fac"], strength=0.22, distance=0.0009)
    return mat


# --------------------------------------------------------------------------
# hero surfaces
# --------------------------------------------------------------------------

@cached
def desk_wood():
    """Dark, hard-used timber: grain, patina blotches, ring stains, sheen."""
    mat, nt, bsdf, _ = _new("Desk Wood")
    coord = _coord(nt, loc=(-1400, 0))
    mapping = _mapping(nt, coord.outputs["Object"], scale=(1.0, 0.055, 1.0),
                       loc=(-1230, 0))

    grain = _noise(nt, scale=26.0, detail=12.0, rough=0.62, distortion=1.6,
                   loc=(-1050, 120))
    nt.links.new(mapping.outputs["Vector"], grain.inputs["Vector"])

    fine = _noise(nt, scale=180.0, detail=8.0, rough=0.5, loc=(-1050, -160))
    nt.links.new(mapping.outputs["Vector"], fine.inputs["Vector"])

    wood_ramp = _ramp(nt, [
        (0.30, P.srgb(P.DESK_PATINA)),
        (0.48, P.srgb(P.DESK_WOOD)),
        (0.66, P.srgb(P.DESK_WOOD_LIGHT)),
        (0.84, P.srgb("#7A5836")),
    ], loc=(-820, 120))
    nt.links.new(grain.outputs["Fac"], wood_ramp.inputs["Fac"])

    # broad patina / wear blotches across the top
    patina = _noise(nt, scale=2.6, detail=6.0, rough=0.7, loc=(-1050, 400))
    nt.links.new(coord.outputs["Object"], patina.inputs["Vector"])
    patina_ramp = _ramp(nt, [(0.36, (0, 0, 0, 1)), (0.70, (1, 1, 1, 1))],
                        loc=(-820, 400))
    nt.links.new(patina.outputs["Fac"], patina_ramp.inputs["Fac"])

    darkened = _mixrgb(nt, (0, 0, 0, 1), (0, 0, 0, 1), loc=(-560, 220))
    nt.links.new(wood_ramp.outputs["Color"], darkened.inputs["A"])
    dark_col = _mixrgb(nt, P.srgb(P.DESK_PATINA), P.srgb("#5C4029"), fac=0.5,
                       loc=(-820, -60))
    nt.links.new(dark_col.outputs["Result"], darkened.inputs["B"])
    nt.links.new(patina_ramp.outputs["Color"], darkened.inputs["Factor"])
    darkened.inputs["Factor"].default_value = 0.5

    # scratches
    scratch = nt.nodes.new("ShaderNodeTexMusgrave") if "ShaderNodeTexMusgrave" in \
        {n.bl_idname for n in []} else _noise(nt, scale=420.0, detail=10.0,
                                              rough=0.85, loc=(-1050, -420))
    nt.links.new(mapping.outputs["Vector"], scratch.inputs["Vector"])
    scratch_ramp = _ramp(nt, [(0.58, (1, 1, 1, 1)), (0.63, (0.55, 0.5, 0.45, 1))],
                         loc=(-820, -420))
    nt.links.new(scratch.outputs["Fac"], scratch_ramp.inputs["Fac"])

    final = nt.nodes.new("ShaderNodeMix")
    final.data_type = "RGBA"
    final.blend_type = "MULTIPLY"
    final.location = (-300, 220)
    final.inputs["Factor"].default_value = 0.55
    nt.links.new(darkened.outputs["Result"], final.inputs["A"])
    nt.links.new(scratch_ramp.outputs["Color"], final.inputs["B"])
    nt.links.new(final.outputs["Result"], bsdf.inputs["Base Color"])

    # varnish that has worn thin in the middle of the desk
    rough_ramp = _ramp(nt, [(0.20, (0.34, 0, 0, 1)), (0.62, (0.58, 0, 0, 1)),
                            (0.95, (0.42, 0, 0, 1))], loc=(-560, -220))
    nt.links.new(patina.outputs["Fac"], rough_ramp.inputs["Fac"])
    nt.links.new(rough_ramp.outputs["Color"], bsdf.inputs["Roughness"])

    _set(bsdf, spec=0.42, coat=0.10, coat_rough=0.42)

    bump_mix = nt.nodes.new("ShaderNodeMix")
    bump_mix.data_type = "RGBA"
    bump_mix.blend_type = "ADD"
    bump_mix.location = (-560, -600)
    bump_mix.inputs["Factor"].default_value = 0.35
    nt.links.new(grain.outputs["Fac"], bump_mix.inputs["A"])
    nt.links.new(fine.outputs["Fac"], bump_mix.inputs["B"])
    _bump(nt, bsdf, bump_mix.outputs["Result"], strength=0.30, distance=0.0016)
    return mat


@cached
def floor_wood():
    """Plank floor for the studio and the room beyond the doorway."""
    mat, nt, bsdf, _ = _new("Floor Wood")
    coord = _coord(nt, loc=(-1300, 0))
    mapping = _mapping(nt, coord.outputs["Object"], scale=(0.9, 0.08, 1.0),
                       loc=(-1120, 0))
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.location = (-920, 200)
    brick.offset = 0.5
    brick.squash = 1.0
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.0016
    brick.inputs["Mortar Smooth"].default_value = 0.1
    brick.inputs["Bias"].default_value = 0.0
    brick.inputs["Brick Width"].default_value = 0.42
    brick.inputs["Row Height"].default_value = 0.10
    brick.inputs["Color1"].default_value = P.srgb(P.FLOOR_WOOD)
    brick.inputs["Color2"].default_value = P.srgb(P.FLOOR_WOOD_DARK)
    brick.inputs["Mortar"].default_value = P.srgb("#2A1B10")
    nt.links.new(mapping.outputs["Vector"], brick.inputs["Vector"])

    grain = _noise(nt, scale=60.0, detail=10.0, distortion=2.0, loc=(-920, -200))
    nt.links.new(mapping.outputs["Vector"], grain.inputs["Vector"])
    grain_ramp = _ramp(nt, [(0.35, (0.62, 0.62, 0.62, 1)), (0.7, (1.25, 1.25, 1.25, 1))],
                       loc=(-700, -200))
    nt.links.new(grain.outputs["Fac"], grain_ramp.inputs["Fac"])

    m = nt.nodes.new("ShaderNodeMix")
    m.data_type = "RGBA"
    m.blend_type = "MULTIPLY"
    m.location = (-440, 0)
    m.inputs["Factor"].default_value = 0.75
    nt.links.new(brick.outputs["Color"], m.inputs["A"])
    nt.links.new(grain_ramp.outputs["Color"], m.inputs["B"])
    nt.links.new(m.outputs["Result"], bsdf.inputs["Base Color"])

    rr = _ramp(nt, [(0.3, (0.30, 0, 0, 1)), (0.8, (0.48, 0, 0, 1))], loc=(-440, -320))
    nt.links.new(grain.outputs["Fac"], rr.inputs["Fac"])
    nt.links.new(rr.outputs["Color"], bsdf.inputs["Roughness"])
    _set(bsdf, spec=0.42, coat=0.10, coat_rough=0.3)
    _bump(nt, bsdf, brick.outputs["Fac"], strength=0.35, distance=0.0025)
    return mat


@cached
def brick_wall():
    mat, nt, bsdf, _ = _new("Brick")
    coord = _coord(nt, loc=(-1100, 0))
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.location = (-880, 0)
    brick.offset = 0.5
    brick.inputs["Scale"].default_value = 6.0
    brick.inputs["Mortar Size"].default_value = 0.022
    brick.inputs["Mortar Smooth"].default_value = 0.25
    brick.inputs["Brick Width"].default_value = 0.52
    brick.inputs["Row Height"].default_value = 0.22
    brick.inputs["Color1"].default_value = P.srgb(P.BRICK)
    brick.inputs["Color2"].default_value = P.srgb("#8A5540")
    brick.inputs["Mortar"].default_value = P.srgb(P.BRICK_MORTAR)
    nt.links.new(coord.outputs["Object"], brick.inputs["Vector"])
    n = _noise(nt, scale=40.0, detail=8.0, loc=(-880, -300))
    m = nt.nodes.new("ShaderNodeMix")
    m.data_type = "RGBA"
    m.blend_type = "MULTIPLY"
    m.location = (-500, 0)
    m.inputs["Factor"].default_value = 0.35
    nt.links.new(brick.outputs["Color"], m.inputs["A"])
    nt.links.new(n.outputs["Color"], m.inputs["B"])
    nt.links.new(m.outputs["Result"], bsdf.inputs["Base Color"])
    _set(bsdf, rough=0.85, spec=0.2)
    _bump(nt, bsdf, brick.outputs["Fac"], strength=0.7, distance=0.012)
    return mat


@cached
def crt_screen_glass():
    """The face of the tube: dark, very glossy, faintly dusty."""
    mat, nt, bsdf, _ = _new("CRT Glass")
    _set(bsdf, base=P.srgb(P.SCREEN_GLASS), rough=0.045, spec=0.85,
         coat=0.9, coat_rough=0.03, ior=1.55, transmission=0.0)
    dust = _noise(nt, scale=300.0, detail=4.0)
    rr = _ramp(nt, [(0.4, (0.035, 0, 0, 1)), (0.85, (0.14, 0, 0, 1))], loc=(-460, 0))
    nt.links.new(dust.outputs["Fac"], rr.inputs["Fac"])
    nt.links.new(rr.outputs["Color"], bsdf.inputs["Roughness"])
    return mat


@cached
def phosphor():
    """Screen emission with a scanline/aperture-grille modulation baked in."""
    mat, nt, bsdf, out = _new("Phosphor Base")
    _set(bsdf, base=(0, 0, 0, 1), rough=0.1)
    return mat


@cached
def book_cloth(hex_color, index=0):
    mat, nt, bsdf, _ = _new("Book %s %d" % (hex_color, index))
    _set(bsdf, base=P.srgb(hex_color), rough=0.72, sheen=0.25, sheen_rough=0.45,
         spec=0.28)
    n = _noise(nt, scale=520.0, detail=6.0)
    _bump(nt, bsdf, n.outputs["Fac"], strength=0.28, distance=0.0006)
    return mat


@cached
def page_edge():
    mat, nt, bsdf, _ = _new("Page Edge")
    _set(bsdf, base=P.srgb("#E8E0CE"), rough=0.9, spec=0.15)
    coord = _coord(nt)
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.location = (-700, 0)
    wave.wave_type = "BANDS"
    wave.bands_direction = "Z"
    wave.inputs["Scale"].default_value = 900.0
    nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    _bump(nt, bsdf, wave.outputs["Fac"], strength=0.5, distance=0.0004)
    return mat


@cached
def rubber(name="Rubber", hex_color="#1A1A1C", rough=0.72):
    mat, nt, bsdf, _ = _new(name)
    _set(bsdf, base=P.srgb(hex_color), rough=rough, spec=0.3)
    n = _noise(nt, scale=700.0, detail=4.0)
    _bump(nt, bsdf, n.outputs["Fac"], strength=0.3, distance=0.0004)
    return mat


@cached
def terracotta():
    mat, nt, bsdf, _ = _new("Terracotta")
    _set(bsdf, base=P.srgb(P.POT_TERRA), rough=0.66, spec=0.3)
    n = _noise(nt, scale=180.0, detail=6.0)
    _bump(nt, bsdf, n.outputs["Fac"], strength=0.3, distance=0.0012)
    return mat


@cached
def soil():
    mat, nt, bsdf, _ = _new("Soil")
    _set(bsdf, base=P.srgb("#241A13"), rough=0.95, spec=0.1)
    n = _noise(nt, scale=200.0, detail=10.0, rough=0.8)
    _bump(nt, bsdf, n.outputs["Fac"], strength=0.9, distance=0.004)
    return mat

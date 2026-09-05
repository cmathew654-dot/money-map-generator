"""The studio's brand palette and every surface colour used in the build.

Values are linear-ish sRGB tuples ready for Blender inputs; `srgb()` converts
from the hex values a designer would actually hand you.
"""


def srgb(hex_code, alpha=1.0):
    """#RRGGBB -> linear RGBA, matching Blender's colour management."""
    h = hex_code.lstrip("#")
    parts = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    lin = []
    for c in parts:
        lin.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (lin[0], lin[1], lin[2], alpha)


def raw(hex_code, alpha=1.0):
    """#RRGGBB -> straight 0-1 RGBA with no transfer curve (for emissive UI)."""
    h = hex_code.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)) + (alpha,)


def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(4))


def shade(color, factor):
    return (color[0] * factor, color[1] * factor, color[2] * factor, color[3])


# ---------------------------------------------------------------- brand
NAVY = "#1E2F56"
NAVY_DEEP = "#16233F"
RED = "#D93B2B"
RED_DEEP = "#B32D20"
MUSTARD = "#EFB01F"
MUSTARD_DEEP = "#D2941A"
CREAM = "#F1EADC"
BONE = "#E7DECD"
INK = "#151821"

# ---------------------------------------------------------------- room
WALL = "#EDE5D6"
WALL_SHADOW = "#DCD2C0"
CEILING = "#E4DCCC"
FLOOR_WOOD = "#6B4A30"
FLOOR_WOOD_DARK = "#4E3421"
BRICK = "#9A6247"
BRICK_MORTAR = "#C6B49E"
DOOR_FRAME = "#2A3D66"

# ---------------------------------------------------------------- desk
DESK_WOOD = "#3E2C20"
DESK_WOOD_LIGHT = "#63462E"
DESK_PATINA = "#241A13"

# ---------------------------------------------------------------- hardware
CRT_PLASTIC = "#D6CCB6"          # aged warm beige ABS
CRT_PLASTIC_DARK = "#B9AE97"
CRT_VENT = "#3A362E"
SCREEN_GLASS = "#0B1418"
KEY_CAP = "#DCD3BF"
KEY_CAP_DARK = "#C6BCA6"
CABLE = "#CFC6B2"

# ---------------------------------------------------------------- win95 UI
UI_DESKTOP = "#2C8B8B"
UI_FACE = "#C3C3C3"
UI_LIGHT = "#FFFFFF"
UI_SHADOW = "#828282"
UI_DARK = "#4A4A4A"
UI_TITLE = "#0A2A8C"
UI_TITLE_2 = "#3A72C8"
UI_TEXT = "#0B0B0B"
UI_WHITE = "#FDFDFD"

# ---------------------------------------------------------------- props
MUG_WHITE = "#F4F1EA"
CERAMIC_SPECKLE = "#EDE7DA"
BRASS = "#B08A3C"
PAPER = "#F6F2E8"
PAPER_WARM = "#EDE6D6"
LAMP_YELLOW = "#E8AC1C"
LAMP_RED = "#C8402F"
RUG_BASE = "#8E5A46"
FOLIAGE = "#3E6B3A"
FOLIAGE_DARK = "#284A28"
FOLIAGE_LIGHT = "#5E8F45"
POT_TERRA = "#B4694A"
POT_WHITE = "#E6DED0"
BOOK_SPINES = [
    "#D93B2B", "#1E2F56", "#EFB01F", "#F1EADC", "#2C6E63",
    "#8C3A55", "#3F5C8C", "#C9662E", "#4B5D3A", "#E7DECD",
]

"""Linear-space lens finish applied after the render.

Blender 5's compositor wants a GPU context, which a headless box does not
have, so the bloom and vignette happen here instead: render to a linear EXR,
work on the real radiometric values with numpy, then hand the result back to
Blender so its own colour management writes the final image.
"""

import os

import bpy
import numpy as np


def _load_linear(path):
    """Read an EXR into a (h, w, 4) float array, top row first."""
    img = bpy.data.images.load(os.path.abspath(path))
    w, h = img.size
    buf = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(buf)
    bpy.data.images.remove(img)
    return buf.reshape(h, w, 4)[::-1].copy()


def _box_blur(a, radius):
    """Separable box blur via summed-area rows/columns."""
    if radius < 1:
        return a
    pad = radius + 1
    out = a
    for axis in (0, 1):
        padded = np.pad(out, [(pad, pad) if i == axis else (0, 0)
                              for i in range(out.ndim)], mode="edge")
        cs = np.cumsum(padded, axis=axis)
        lo = np.take(cs, np.arange(pad - radius - 1,
                                   pad - radius - 1 + out.shape[axis]), axis=axis)
        hi = np.take(cs, np.arange(pad + radius,
                                   pad + radius + out.shape[axis]), axis=axis)
        out = (hi - lo) / float(2 * radius + 1)
    return out


def _gaussian(a, radius, passes=3):
    """Three box blurs approximate a gaussian closely enough for bloom."""
    r = max(1, int(radius / passes))
    for _ in range(passes):
        a = _box_blur(a, r)
    return a


def bloom(rgb, threshold=2.6, strength=0.18, radii=(5, 16, 46), tint=None):
    """Multi-scale fog glow off everything brighter than `threshold`."""
    lum = rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722
    excess = np.clip(lum - threshold, 0.0, None)
    mask = np.zeros_like(lum)
    np.divide(excess, np.maximum(lum, 1e-6), out=mask, where=lum > 1e-6)
    highlights = rgb * mask[..., None]

    glow = np.zeros_like(rgb)
    weights = (0.50, 0.32, 0.18)
    for radius, weight in zip(radii, weights):
        glow += _gaussian(highlights, radius) * weight
    if tint is not None:
        glow *= np.asarray(tint, dtype=np.float32)
    return rgb + glow * strength


def vignette(rgb, amount=0.30, softness=1.5):
    """Cosine-falloff corner darkening, weighted to the frame's aspect."""
    h, w = rgb.shape[:2]
    ys = (np.linspace(-1.0, 1.0, h) ** 2)[:, None]
    xs = (np.linspace(-1.0, 1.0, w) ** 2)[None, :]
    r = np.sqrt(xs + ys * (h / float(w)) ** 0.0)
    falloff = np.clip(1.0 - amount * np.clip(r / softness, 0.0, 1.0) ** 2.2,
                      0.0, 1.0)
    return rgb * falloff[..., None]


def chromatic_edge(rgb, amount=0.0):
    """A whisker of lateral colour fringing at the frame edges.

    Off by default: at sane strengths the integer resample banded worse than
    the effect was worth.
    """
    if amount <= 0.0:
        return rgb
    h, w = rgb.shape[:2]
    out = rgb.copy()
    for channel, scale in ((0, 1.0 + amount), (2, 1.0 - amount)):
        ys = np.clip(((np.arange(h) - h / 2.0) / scale + h / 2.0)
                     .astype(np.int32), 0, h - 1)
        xs = np.clip(((np.arange(w) - w / 2.0) / scale + w / 2.0)
                     .astype(np.int32), 0, w - 1)
        out[..., channel] = rgb[ys][:, xs, channel]
    return out


def _save_through_view_transform(rgb, alpha, path):
    """Write the array out using the scene's colour management."""
    h, w = rgb.shape[:2]
    img = bpy.data.images.new("Post", width=w, height=h, float_buffer=True)
    stacked = np.concatenate([rgb, alpha[..., None]], axis=-1)
    img.pixels.foreach_set(stacked[::-1].ravel().astype(np.float32))
    scene = bpy.context.scene
    settings = scene.render.image_settings
    prev_format, prev_depth = settings.file_format, settings.color_depth
    settings.file_format = "PNG"
    settings.color_depth = "8"
    img.save_render(filepath=os.path.abspath(path), scene=scene)
    settings.file_format, settings.color_depth = prev_format, prev_depth
    bpy.data.images.remove(img)
    return os.path.abspath(path)


def finish(exr_path, out_path, glare=0.18, vignette_amount=0.30,
           threshold=2.6, fringe=0.0):
    """EXR in, graded PNG out."""
    data = _load_linear(exr_path)
    rgb, alpha = data[..., :3], data[..., 3]
    if glare > 0.0:
        rgb = bloom(rgb, threshold=threshold, strength=glare,
                    tint=(1.03, 1.0, 0.94))
    if vignette_amount > 0.0:
        rgb = vignette(rgb, amount=vignette_amount)
    rgb = chromatic_edge(rgb, fringe)
    return _save_through_view_transform(np.clip(rgb, 0.0, None), alpha,
                                        out_path)

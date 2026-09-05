"""Entry point for running the build under a Blender binary.

    blender -b -P blender/run.py -- --samples 256 --out renders/studio.png

Under the `bpy` pip module, run `python -m scene.build` from this directory
instead -- both paths land in the same `scene.build.main`.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scene.build import main  # noqa: E402

if __name__ == "__main__":
    main()

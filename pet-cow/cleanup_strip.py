"""Remove the generated checkerboard from the cow sprite strip.

The cleanup deliberately flood-fills only from each frame's outer edge so the
cow's cream highlights remain opaque even when their colour is close to white.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


SOURCE = Path("/private/tmp/pulsework-cow-strip-alpha.png")
OUTPUT = Path(__file__).parent / "final" / "cow-eating-strip.png"
FRAME_COUNT = 6
CROP_TOP = 225
CROP_BOTTOM = 470


def removable_background(rgb: np.ndarray) -> np.ndarray:
    low = rgb.min(axis=2)
    high = rgb.max(axis=2)
    return (low >= 242) & ((high - low) <= 14)


def edge_flood_fill(candidates: np.ndarray) -> np.ndarray:
    height, width = candidates.shape
    background = np.zeros_like(candidates, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidates[0, x]:
            queue.append((0, x))
        if candidates[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if candidates[y, 0]:
            queue.append((y, 0))
        if candidates[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if background[y, x] or not candidates[y, x]:
            continue
        background[y, x] = True
        if y:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
        if x:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))

    return background


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    frame_width = source.width // FRAME_COUNT
    rgba_frames: list[Image.Image] = []

    for index in range(FRAME_COUNT):
        frame = source.crop((index * frame_width, 0, (index + 1) * frame_width, source.height))
        rgb = np.asarray(frame)
        background = edge_flood_fill(removable_background(rgb))
        alpha = Image.fromarray((~background).astype(np.uint8) * 255, mode="L")
        alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
        rgba = frame.convert("RGBA")
        rgba.putalpha(alpha)
        rgba_frames.append(rgba.crop((0, CROP_TOP, frame_width, CROP_BOTTOM)))

    strip = Image.new("RGBA", (source.width, CROP_BOTTOM - CROP_TOP), (0, 0, 0, 0))
    for index, frame in enumerate(rgba_frames):
        strip.alpha_composite(frame, (index * frame_width, 0))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    strip.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()

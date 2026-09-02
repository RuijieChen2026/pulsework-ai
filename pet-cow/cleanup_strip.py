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
SMOOTH_OUTPUT = Path(__file__).parent / "final" / "cow-eating-smooth.webp"
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

    # Build a lightweight tweened WebP for the homepage. Premultiplied-alpha
    # interpolation avoids pale edge halos while softening the six key poses.
    def tween(first: Image.Image, second: Image.Image, amount: float) -> Image.Image:
        a = np.asarray(first).astype(np.float32) / 255
        b = np.asarray(second).astype(np.float32) / 255
        alpha = a[..., 3:4] * (1 - amount) + b[..., 3:4] * amount
        premultiplied = a[..., :3] * a[..., 3:4] * (1 - amount) + b[..., :3] * b[..., 3:4] * amount
        rgb = np.divide(premultiplied, np.maximum(alpha, 1e-6))
        result = np.concatenate((rgb, alpha), axis=2)
        return Image.fromarray(np.clip(result * 255, 0, 255).astype(np.uint8), "RGBA")

    timeline: list[Image.Image] = []

    def hold(index: int, count: int) -> None:
        timeline.extend([rgba_frames[index]] * count)

    def move(start: int, end: int, count: int) -> None:
        for step in range(1, count + 1):
            timeline.append(tween(rgba_frames[start], rgba_frames[end], step / count))

    hold(0, 6)
    move(0, 1, 4)
    move(1, 2, 4)
    hold(2, 8)
    move(2, 3, 4)
    hold(3, 4)
    move(3, 4, 4)
    hold(4, 5)
    move(4, 5, 4)
    hold(5, 3)
    move(5, 4, 3)
    move(4, 0, 4)

    timeline = [frame.resize((300, 203), Image.Resampling.LANCZOS) for frame in timeline]

    timeline[0].save(
        SMOOTH_OUTPUT,
        save_all=True,
        append_images=timeline[1:],
        duration=72,
        loop=0,
        lossless=False,
        quality=76,
        method=3,
    )
    print(OUTPUT)
    print(SMOOTH_OUTPUT)


if __name__ == "__main__":
    main()

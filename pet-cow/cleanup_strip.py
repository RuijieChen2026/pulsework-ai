"""Remove the generated checkerboard from the cow sprite strip.

The cleanup deliberately flood-fills only from each frame's outer edge so the
cow's cream highlights remain opaque even when their colour is close to white.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


SOURCE = Path("/private/tmp/pulsework-cow-strip-alpha.png")
OUTPUT = Path(__file__).parent / "final" / "cow-eating-strip.png"
SMOOTH_OUTPUT = Path(__file__).parent / "final" / "cow-eating-60.webp"
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
        cropped = rgba.crop((0, CROP_TOP, frame_width, CROP_BOTTOM))
        # Generated poses occasionally contain a detached sliver inherited from
        # the neighbouring storyboard cell. Clear only the unsafe outer gutter.
        alpha = cropped.getchannel("A")
        alpha.paste(0, (0, 0, 10, cropped.height))
        cropped.putalpha(alpha)
        rgba_frames.append(cropped)

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

    # Add two subtle muzzle variants so the raised-head pose visibly chews.
    def chew_variant(frame: Image.Image, offset: int) -> Image.Image:
        box = (48, 55, 145, 123)
        patch = frame.crop(box)
        mask = Image.new("L", patch.size, 0)
        ImageDraw.Draw(mask).ellipse((5, 7, patch.width - 5, patch.height - 5), fill=220)
        mask = mask.filter(ImageFilter.GaussianBlur(7))
        result = frame.copy()
        result.paste(patch, (box[0], box[1] + offset), mask)
        return result

    poses = rgba_frames + [chew_variant(rgba_frames[3], 2), chew_variant(rgba_frames[3], -1)]
    timeline: list[Image.Image] = []
    fps = 60

    def hold(index: int, seconds: float) -> None:
        timeline.extend([poses[index]] * round(seconds * fps))

    def move(start: int, end: int, seconds: float) -> None:
        count = round(seconds * fps)
        for step in range(1, count + 1):
            linear = step / count
            eased = linear * linear * (3 - 2 * linear)
            timeline.append(tween(poses[start], poses[end], eased))

    hold(0, .65)
    move(0, 1, .42)
    move(1, 2, .38)
    hold(2, .72)
    move(2, 3, .42)
    hold(3, .12)
    move(3, 6, .11)
    move(6, 3, .11)
    move(3, 7, .11)
    move(7, 3, .11)
    move(3, 6, .11)
    move(6, 3, .11)
    hold(3, .12)
    move(3, 4, .32)
    hold(4, .55)
    move(4, 5, .32)
    hold(5, .22)
    move(5, 4, .24)
    move(4, 0, .36)

    timeline = [frame.resize((300, 203), Image.Resampling.LANCZOS) for frame in timeline]

    timeline[0].save(
        SMOOTH_OUTPUT,
        save_all=True,
        append_images=timeline[1:],
        duration=17,
        loop=0,
        lossless=False,
        quality=68,
        method=3,
    )
    print(OUTPUT)
    print(SMOOTH_OUTPUT)


if __name__ == "__main__":
    main()

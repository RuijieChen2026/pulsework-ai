"""Remove the generated checkerboard from the cow sprite strip.

The cleanup deliberately flood-fills only from each frame's outer edge so the
cow's cream highlights remain opaque even when their colour is close to white.
"""

from collections import deque
from pathlib import Path

import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter


SOURCE = Path("/private/tmp/pulsework-cow-strip-alpha.png")
OUTPUT = Path(__file__).parent / "final" / "cow-eating-strip.png"
SMOOTH_OUTPUT = Path(__file__).parent / "final" / "cow-eating-flow.webp"
RIG_BASE_OUTPUT = Path(__file__).parent / "final" / "cow-rig-base.png"
RIG_JAW_OUTPUT = Path(__file__).parent / "final" / "cow-rig-jaw.png"
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

    # A compositor-driven website rig is visually steadier than interpolating
    # between large pose changes. Pose 3 already carries grass in the mouth.
    rig_base = rgba_frames[3]
    rig_base.save(RIG_BASE_OUTPUT, optimize=True)
    jaw = Image.new("RGBA", rig_base.size, (0, 0, 0, 0))
    jaw_box = (45, 52, 151, 126)
    jaw_patch = rig_base.crop(jaw_box)
    jaw_mask = Image.new("L", jaw_patch.size, 0)
    ImageDraw.Draw(jaw_mask).ellipse((4, 5, jaw_patch.width - 4, jaw_patch.height - 3), fill=235)
    jaw_mask = jaw_mask.filter(ImageFilter.GaussianBlur(5))
    jaw.paste(jaw_patch, jaw_box[:2], jaw_mask)
    jaw.save(RIG_JAW_OUTPUT, optimize=True)

    # Build a lightweight tweened WebP for the homepage. Premultiplied-alpha
    # interpolation avoids pale edge halos while softening the six key poses.
    flow_cache: dict[tuple[int, int], tuple[np.ndarray, np.ndarray]] = {}

    def tween(first: Image.Image, second: Image.Image, amount: float) -> Image.Image:
        """Motion-compensated interpolation instead of a cross-dissolve."""
        a = np.asarray(first).astype(np.float32) / 255
        b = np.asarray(second).astype(np.float32) / 255
        cache_key = (id(first), id(second))

        if cache_key not in flow_cache:
            def grayscale_on_white(rgba: np.ndarray) -> np.ndarray:
                alpha = rgba[..., 3:4]
                rgb = rgba[..., :3] * alpha + (1 - alpha)
                return cv2.cvtColor((rgb * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)

            gray_a = grayscale_on_white(a)
            gray_b = grayscale_on_white(b)
            params = dict(pyr_scale=.5, levels=5, winsize=31, iterations=5, poly_n=7, poly_sigma=1.5, flags=0)
            flow_cache[cache_key] = (
                cv2.calcOpticalFlowFarneback(gray_a, gray_b, None, **params),
                cv2.calcOpticalFlowFarneback(gray_b, gray_a, None, **params),
            )

        flow_ab, flow_ba = flow_cache[cache_key]
        height, width = a.shape[:2]
        grid_x, grid_y = np.meshgrid(np.arange(width, dtype=np.float32), np.arange(height, dtype=np.float32))

        def warp(rgba: np.ndarray, flow: np.ndarray, distance: float) -> np.ndarray:
            map_x = grid_x - flow[..., 0] * distance
            map_y = grid_y - flow[..., 1] * distance
            premult = rgba.copy()
            premult[..., :3] *= premult[..., 3:4]
            return cv2.remap(premult, map_x, map_y, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)

        warped_a = warp(a, flow_ab, amount)
        warped_b = warp(b, flow_ba, 1 - amount)
        mixed = warped_a * (1 - amount) + warped_b * amount
        alpha = np.clip(mixed[..., 3:4], 0, 1)
        rgb = np.divide(mixed[..., :3], np.maximum(alpha, 1e-6))
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
    print(RIG_BASE_OUTPUT)
    print(RIG_JAW_OUTPUT)


if __name__ == "__main__":
    main()

import math
from PIL import Image, ImageDraw

def create_dhealth_icon(size: int, is_round: bool = False, foreground_only: bool = False) -> Image.Image:
    # 4x supersampling for ultra-crisp antialiasing
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = s / 2.0

    if not foreground_only:
        # Background: rounded rect or full circle with D-HEALTH Teal gradient (#1F7A8C -> #2F6FDB)
        if is_round:
            # Full circle
            draw.ellipse([0, 0, s - 1, s - 1], fill=(31, 122, 140, 255))
        else:
            # Squircle / rounded rect (radius ~ 22% of size)
            r = int(s * 0.22)
            draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=(31, 122, 140, 255))

    # Heart dimensions
    # For adaptive foreground: safe zone is central 66% (radius ~ 33%)
    heart_scale = (s * 0.58) if not foreground_only else (s * 0.50)
    heart_cy = center + (s * 0.03) # slightly lower to visually balance

    # Draw White Heart
    # Parametric heart shape: x = 16*sin^3(t), y = -(13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t))
    pts = []
    steps = 360
    # normalization factor for 16 is 16; height is ~ 17
    norm = heart_scale / 34.0
    for i in range(steps):
        t = 2.0 * math.pi * i / steps
        x = 16.0 * (math.sin(t) ** 3)
        y = -(13.0 * math.cos(t) - 5.0 * math.cos(2*t) - 2.0 * math.cos(3*t) - math.cos(4*t))
        pts.append((center + x * norm, heart_cy + y * norm))

    draw.polygon(pts, fill=(255, 255, 255, 255))

    # Draw ECG pulse line inside the heart (Teal #1F7A8C)
    ecg_y = heart_cy - (s * 0.02)
    stroke_w = int(s * 0.04)

    # ECG points relative to center
    line_w = heart_scale * 0.82
    left_x = center - line_w / 2.0
    right_x = center + line_w / 2.0

    ecg_pts = [
        (left_x, ecg_y),
        (center - s * 0.14, ecg_y),
        (center - s * 0.08, ecg_y - s * 0.12), # pulse peak up
        (center - s * 0.01, ecg_y + s * 0.14), # pulse peak down
        (center + s * 0.06, ecg_y - s * 0.07), # small rebound
        (center + s * 0.11, ecg_y),
        (right_x, ecg_y)
    ]

    for j in range(len(ecg_pts) - 1):
        p1 = ecg_pts[j]
        p2 = ecg_pts[j + 1]
        draw.line([p1, p2], fill=(31, 122, 140, 255), width=stroke_w)
        # Round joint caps
        draw.ellipse([p1[0] - stroke_w/2, p1[1] - stroke_w/2, p1[0] + stroke_w/2, p1[1] + stroke_w/2], fill=(31, 122, 140, 255))
        draw.ellipse([p2[0] - stroke_w/2, p2[1] - stroke_w/2, p2[0] + stroke_w/2, p2[1] + stroke_w/2], fill=(31, 122, 140, 255))

    # Downsample with high-quality Lanczos resampling
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate Google Play Store 512x512 High-Res Icon
play_icon = create_dhealth_icon(512)
play_icon.save("frontend/public/icon-512.png")
play_icon.save("D-Health-icon-512.png")

# Densities for Android mipmap
densities = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

base_res = "frontend/android/app/src/main/res"

for folder, sz in densities.items():
    # 1. Standard icon
    ic = create_dhealth_icon(sz, is_round=False)
    ic.save(f"{base_res}/{folder}/ic_launcher.png")

    # 2. Round icon
    ic_round = create_dhealth_icon(sz, is_round=True)
    ic_round.save(f"{base_res}/{folder}/ic_launcher_round.png")

    # 3. Foreground icon for adaptive icons
    ic_fore = create_dhealth_icon(sz, foreground_only=True)
    ic_fore.save(f"{base_res}/{folder}/ic_launcher_foreground.png")

print("All Android app icons generated successfully!")


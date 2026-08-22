import random
import os
from PIL import Image, ImageChops


# ======================
# SETTINGS
# ======================
OUTPUT_FILE = "bib_collage.png"

CANVAS_WIDTH = 3000
CANVAS_HEIGHT = 3000

MIN_SCALE = 0.6
MAX_SCALE = 1

MIN_ROTATION = -30
MAX_ROTATION = 40

MAX_PLACEMENT_TRIES = 10   # retries to reduce transparency

# ======================
# CREATE CANVAS
# ======================
canvas = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
coverage_mask = Image.new("L", (CANVAS_WIDTH, CANVAS_HEIGHT), 0)

# ======================
# LOAD PNGs
# ======================
script_dir = os.path.dirname(os.path.abspath(__file__))
files = [
    f for f in os.listdir(script_dir)
    if f.lower().endswith(".png") and f != OUTPUT_FILE
]

# Sort biggest first → better fill
def image_area(path):
    with Image.open(path) as im:
        return im.width * im.height

files.sort(
    key=lambda f: image_area(os.path.join(script_dir, f)),
    reverse=True
)

# ======================
# PLACE IMAGES
# ======================
for filename in files:
    img_original = Image.open(os.path.join(script_dir, filename)).convert("RGBA")

    best_candidate = None
    best_new_coverage = 0

    for _ in range(MAX_PLACEMENT_TRIES):
        # Random scale
        scale = random.uniform(MIN_SCALE, MAX_SCALE)
        img = img_original.resize(
            (int(img_original.width * scale),
             int(img_original.height * scale)),
            Image.LANCZOS
        )

        # Random rotation
        img = img.rotate(
            random.uniform(MIN_ROTATION, MAX_ROTATION),
            expand=True
        )

        # Random position
        x = random.randint(-img.width // 3, CANVAS_WIDTH - img.width // 3)
        y = random.randint(-img.height // 3, CANVAS_HEIGHT - img.height // 3)

        # Temp mask to estimate coverage
        temp_mask = Image.new("L", (CANVAS_WIDTH, CANVAS_HEIGHT), 0)
        temp_mask.paste(img.split()[-1], (x, y))

        # Compute new coverage
        new_pixels = Image.eval(
            ImageChops.subtract(temp_mask, coverage_mask),
            lambda p: 255 if p > 0 else 0
        )

        new_coverage = sum(new_pixels.getdata())

        if new_coverage > best_new_coverage:
            best_new_coverage = new_coverage
            best_candidate = (img, x, y)

    # Place best candidate
    if best_candidate:
        img, x, y = best_candidate
        canvas.alpha_composite(img, (x, y))
        coverage_mask.paste(img.split()[-1], (x, y), img.split()[-1])

# ======================
# SAVE RESULT
# ======================
canvas.save(os.path.join(script_dir, OUTPUT_FILE))
print("Saved", OUTPUT_FILE)

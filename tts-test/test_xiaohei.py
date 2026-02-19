"""Test additional XiaoHei voice candidates — sassy, Cantonese energy."""

import requests
import os
import time

API_KEY = "sk_6a3fb236bb9a0c5f4db52a0550d44b09d776f9ae9849995d"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
LINE = "哇，好帅。他叫什么名字？"

CANDIDATES = [
    # (label, voice_id, stability, sim_boost, style)
    ("laura_current",    "FGY2WhTYpPnrIDTdsKH5", 0.3, 0.75, 0.9),
    ("nicole_whisper",   "piTKgcLEGmPE4e6mEKli", 0.3, 0.75, 0.8),
    ("charlotte_sassy",  "XB0fDUnXU5powFXDhCwa", 0.3, 0.75, 0.9),
    ("matilda_warm",     "XrExE9yKIg1WjnnlVkGX", 0.3, 0.75, 0.8),
    ("alice_bright",     "Xb7hH8MSUJpSbSDYk0k2", 0.3, 0.75, 0.85),
]

for label, vid, stab, sim, style in CANDIDATES:
    filename = f"xiaohei__{label}.mp3"
    filepath = os.path.join(OUT_DIR, filename)
    if os.path.exists(filepath):
        print(f"  SKIP {filename}")
        continue

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{vid}",
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
        json={
            "text": LINE,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": stab, "similarity_boost": sim, "style": style},
        },
    )
    if r.status_code == 200:
        with open(filepath, "wb") as f:
            f.write(r.content)
        print(f"  OK   {filename}")
    else:
        print(f"  FAIL {filename} — {r.status_code}: {r.text[:200]}")
    time.sleep(0.3)

print(f"\nDone! Listen in: {OUT_DIR}")

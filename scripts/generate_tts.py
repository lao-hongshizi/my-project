"""
Batch TTS generation — sends every dialogue line to ElevenLabs, saves as MP3.

Output: public/audio/ch{NN}/{index}_{charKey}.mp3
Skips files that already exist (safe to re-run after interruption).

Usage:
  python3 scripts/generate_tts.py              # all chapters
  python3 scripts/generate_tts.py 1            # chapter 1 only
  python3 scripts/generate_tts.py 3 7          # chapters 3 through 7
"""

import json
import os
import sys
import time
import requests

API_KEY = os.environ.get(
    "ELEVENLABS_API_KEY",
    "sk_6a3fb236bb9a0c5f4db52a0550d44b09d776f9ae9849995d",
)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "public", "audio")

VOICES = {
    "xiaoli":     ("XB0fDUnXU5powFXDhCwa", 0.3, 0.75, 0.9),
    "wangbeng":   ("iP95p4xoKVk53GoZ742B", 0.5, 0.75, 0.6),
    "aizhong":    ("IKne3meq5aSn9XLyUdCD", 0.5, 0.75, 0.7),
    "guailaoshi": ("pqHfZKP75CvOlQylNhV4", 0.4, 0.85, 0.6),
    "xiaohei":    ("pFZP5JQG7iQjIQuC4Bku", 0.8, 0.6,  0.1),
    "qingqing":   ("cgSgspJ2msm6clMCkdW9", 0.7, 0.75, 0.4),
    "narrator":   ("JBFqnCBsd6RMkjVDRZzb", 0.7, 0.75, 0.3),
}


def tts(text: str, char_key: str, out_path: str) -> bool:
    voice_id, stability, sim_boost, style = VOICES.get(
        char_key, VOICES["narrator"]
    )

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": stability,
                "similarity_boost": sim_boost,
                "style": style,
            },
        },
    )

    if r.status_code == 200:
        with open(out_path, "wb") as f:
            f.write(r.content)
        return True
    else:
        print(f"    FAIL {r.status_code}: {r.text[:200]}")
        return False


def process_chapter(ch_num: int):
    ch_file = os.path.join(CONTENT_DIR, f"ch{ch_num:02d}.json")
    if not os.path.exists(ch_file):
        print(f"  Skipping ch{ch_num:02d} — file not found")
        return

    with open(ch_file) as f:
        chapter = json.load(f)

    ch_dir = os.path.join(AUDIO_DIR, f"ch{ch_num:02d}")
    os.makedirs(ch_dir, exist_ok=True)

    script = chapter["script"]
    generated = 0
    skipped = 0

    for i, item in enumerate(script):
        item_type = item.get("type")
        if item_type not in ("line", "dual", "scene"):
            continue

        text = item.get("zh") or item.get("text") or ""
        if not text.strip():
            continue

        char_key = item.get("char", "narrator")
        filename = f"{i:03d}_{char_key}.mp3"
        out_path = os.path.join(ch_dir, filename)

        if os.path.exists(out_path):
            skipped += 1
            continue

        ok = tts(text, char_key, out_path)
        status = "OK" if ok else "FAIL"
        print(f"    {status}  {filename}  [{text[:30]}]")
        generated += 1
        time.sleep(0.25)

    print(f"  ch{ch_num:02d}: {generated} generated, {skipped} skipped (already exist)")


def main():
    args = sys.argv[1:]
    if len(args) == 0:
        start, end = 1, 20
    elif len(args) == 1:
        start = end = int(args[0])
    else:
        start, end = int(args[0]), int(args[1])

    total_chapters = end - start + 1
    print(f"Generating TTS for chapters {start}-{end} ({total_chapters} chapters)\n")

    for ch in range(start, end + 1):
        print(f"[ch{ch:02d}]")
        process_chapter(ch)
        print()

    print("Done!")


if __name__ == "__main__":
    main()

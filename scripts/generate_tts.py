"""
Batch TTS generation — sends every dialogue line to ElevenLabs, saves as MP3.

Output: public/audio/ch{NN}/{index}_{charKey}.mp3
Skips files that already exist (safe to re-run after interruption).
Use --force to regenerate all files.
Use --fix to regenerate only critically mismatched files from audit_report.json.

Usage:
  python3 scripts/generate_tts.py              # all chapters
  python3 scripts/generate_tts.py 1            # chapter 1 only
  python3 scripts/generate_tts.py 3 7          # chapters 3 through 7
  python3 scripts/generate_tts.py --force      # regenerate ALL files
  python3 scripts/generate_tts.py --fix        # regenerate critical mismatches only
  python3 scripts/generate_tts.py --fix 4      # fix critical mismatches in ch04
"""

import json
import os
import re
import sys
import time
import requests
from pypinyin import pinyin, Style

API_KEY = os.environ.get(
    "ELEVENLABS_API_KEY",
    "sk_6a3fb236bb9a0c5f4db52a0550d44b09d776f9ae9849995d",
)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "public", "audio")
REPORT_PATH = os.path.join(PROJECT_ROOT, "scripts", "audit_report.json")

VOICES = {
    "xiaoli":     ("XB0fDUnXU5powFXDhCwa", 0.3, 0.75, 0.9),
    "wangbeng":   ("iP95p4xoKVk53GoZ742B", 0.5, 0.75, 0.6),
    "aizhong":    ("IKne3meq5aSn9XLyUdCD", 0.5, 0.75, 0.7),
    "guailaoshi": ("pqHfZKP75CvOlQylNhV4", 0.4, 0.85, 0.6),
    "xiaohei":    ("pFZP5JQG7iQjIQuC4Bku", 0.8, 0.6,  0.1),
    "qingqing":   ("cgSgspJ2msm6clMCkdW9", 0.7, 0.75, 0.4),
    "narrator":   ("JBFqnCBsd6RMkjVDRZzb", 0.7, 0.75, 0.3),
}

# ── Pronunciation: full pinyin conversion ─────────────────────────────
# ElevenLabs reads pinyin far more accurately than Chinese characters.
# We convert ALL Chinese text to pinyin (with tone marks) before sending
# to the API. English/slang words pass through unchanged.
# The original Chinese characters stay in the JSON — pinyin is TTS-only.

# Chinese punctuation → spoken equivalents
PUNCT_MAP = {
    "。": ". ", "，": ", ", "！": "! ", "？": "? ",
    "；": "; ", "：": ": ", "……": "... ", "——": " — ",
    "、": ", ", "「": "", "」": "", "（": "(", "）": ")",
    "\u201c": '"', "\u201d": '"', "\u2018": "'", "\u2019": "'",
}


def to_pinyin(text: str) -> str:
    """Convert Chinese characters to pinyin with tone marks.
    English words, punctuation, and numbers pass through unchanged."""
    result = pinyin(text, style=Style.TONE, heteronym=False, errors="default")
    out = " ".join(p[0] for p in result)
    # Clean up spacing around punctuation
    for zh_punct, en_punct in PUNCT_MAP.items():
        out = out.replace(zh_punct, en_punct)
    # Collapse multiple spaces
    out = re.sub(r"  +", " ", out).strip()
    return out


# ── Targeted fixes ────────────────────────────────────────────────────
# Only convert specific problem categories to pinyin. Keep regular
# dialogue as characters (the model handles most of it fine).

# Character names → pinyin (proven fix)
NAME_FIXES = {
    "矮中文": "Ǎi Zhōng Wén",
    "怪老师": "Guài Lǎo Shī",
    "矮中":   "Ǎi Zhōng",
    "小李":   "Xiǎo Lǐ",
    "王崩":   "Wáng Bēng",
    "小黑":   "Xiǎo Hēi",
    "清清":   "Qīng Qīng",
}

# Interjections/fillers the model consistently mangles
INTERJECTION_FIXES = {
    "嘿嘿嘿": "hēi hēi hēi",
    "嘿嘿":   "hēi hēi",
    "哈哈哈哈": "hā hā hā hā",
    "哈哈哈": "hā hā hā",
    "哈哈":   "hā hā",
    "诶":     "hey!",
    "哎":     "āi",
    "嗯":     "ǹg",
    "哦":     "ó",
    "啊":     "à",
    "呃":     "è",
}

# Add specific problem words here as you find them by listening
VOCAB_FIXES = {
    "广东": "Guǎng Dōng",
    "离婚": "lí hūn",
    "闭嘴": "bì zuǐ!",
    "卧槽": "wò cáo!",
    "我靠": "wǒ kào!",
    "妈的": "mā de!",
    "他妈的": "tā mā de!",
    "牛逼": "niú bī!",
    "傻逼": "shǎ bī!",
    "操": "cào!",
    "滚": "gǔn!",
}


def preprocess_for_tts(text: str) -> str:
    """Fix known pronunciation problems. Names → pinyin, interjections → pinyin,
    regular dialogue stays as characters."""
    # Names first (longer patterns before shorter)
    for original, replacement in NAME_FIXES.items():
        text = text.replace(original, replacement)
    # Interjections (longer patterns before shorter)
    for original, replacement in INTERJECTION_FIXES.items():
        text = text.replace(original, replacement)
    # Vocab
    for original, replacement in VOCAB_FIXES.items():
        text = text.replace(original, replacement)
    return text


def get_surrounding_text(script: list, index: int) -> tuple[str, str]:
    """Extract previous and next dialogue text for TTS context conditioning."""
    prev_text = ""
    next_text = ""
    # Look backwards for previous spoken text
    for j in range(index - 1, max(index - 6, -1), -1):
        t = script[j].get("zh") or script[j].get("text") or ""
        if t.strip() and script[j].get("type") in ("line", "dual"):
            prev_text = t
            break
    # Look forwards for next spoken text
    for j in range(index + 1, min(index + 6, len(script))):
        t = script[j].get("zh") or script[j].get("text") or ""
        if t.strip() and script[j].get("type") in ("line", "dual"):
            next_text = t
            break
    return prev_text, next_text


def tts(text: str, char_key: str, out_path: str,
        prev_text: str = "", next_text: str = "") -> bool:
    voice_id, stability, sim_boost, style = VOICES.get(
        char_key, VOICES["narrator"]
    )

    # Preprocess text for pronunciation
    processed = preprocess_for_tts(text)

    # Also preprocess context (so names in context get hints too)
    processed_prev = preprocess_for_tts(prev_text)[-200:] if prev_text else ""
    processed_next = preprocess_for_tts(next_text)[:200] if next_text else ""

    payload = {
        "text": processed,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": sim_boost,
            "style": style,
        },
    }

    if processed_prev:
        payload["previous_text"] = processed_prev
    if processed_next:
        payload["next_text"] = processed_next

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
        json=payload,
    )

    if r.status_code == 200:
        with open(out_path, "wb") as f:
            f.write(r.content)
        return True
    else:
        print(f"    FAIL {r.status_code}: {r.text[:200]}")
        return False


def load_critical_files(ch_start: int = 1, ch_end: int = 20) -> set:
    """Load set of file paths with critical mismatches from audit report."""
    if not os.path.exists(REPORT_PATH):
        print("  No audit_report.json found — regenerating all")
        return set()
    with open(REPORT_PATH) as f:
        report = json.load(f)
    files = set()
    for m in report:
        if (m["severity"] == "critical"
                and ch_start <= m["chapter"] <= ch_end
                and m.get("char") != "narrator"):
            files.add(m["file"])  # e.g. "ch01/009_xiaoli.mp3"
    return files


def process_chapter(ch_num: int, force: bool = False, fix_only: bool = False,
                    critical_files: set = None):
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
        # Only generate audio for spoken dialogue — no narrator/scene/action
        if item_type not in ("line", "dual"):
            continue

        char_key = item.get("char", "narrator")
        if char_key == "narrator":
            continue

        text = item.get("zh") or item.get("text") or ""
        if not text.strip():
            continue
        filename = f"{i:03d}_{char_key}.mp3"
        out_path = os.path.join(ch_dir, filename)
        rel_path = f"ch{ch_num:02d}/{filename}"

        # Decide whether to generate
        if fix_only:
            if critical_files and rel_path not in critical_files:
                skipped += 1
                continue
            # Don't skip even if file exists — we're fixing it
        elif not force and os.path.exists(out_path):
            skipped += 1
            continue

        # Get surrounding context
        prev_text, next_text = get_surrounding_text(script, i)

        # Write to temp file first, only replace on success
        tmp_path = out_path + ".tmp"
        ok = tts(text, char_key, tmp_path, prev_text, next_text)
        if ok:
            if os.path.exists(out_path):
                os.remove(out_path)
            os.rename(tmp_path, out_path)
            print(f"    OK  {filename}  [{text[:30]}]")
        else:
            # Clean up failed temp file, keep original
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            print(f"    FAIL  {filename}  [{text[:30]}]")
        generated += 1
        time.sleep(0.25)

    print(f"  ch{ch_num:02d}: {generated} generated, {skipped} skipped")


def main():
    args = sys.argv[1:]

    force = "--force" in args
    fix_only = "--fix" in args
    nums = [a for a in args if a.lstrip("-").isdigit()]

    if len(nums) == 0:
        start, end = 1, 20
    elif len(nums) == 1:
        start = end = int(nums[0])
    else:
        start, end = int(nums[0]), int(nums[1])

    critical_files = None
    if fix_only:
        critical_files = load_critical_files(start, end)
        mode = f"FIX mode — regenerating {len(critical_files)} critical mismatches"
    elif force:
        mode = "FORCE mode — regenerating ALL files"
    else:
        mode = "normal mode — skipping existing files"

    print(f"Generating TTS for chapters {start}-{end} ({mode})\n")

    for ch in range(start, end + 1):
        print(f"[ch{ch:02d}]")
        process_chapter(ch, force=force, fix_only=fix_only,
                        critical_files=critical_files)
        print()

    print("Done!")


if __name__ == "__main__":
    main()

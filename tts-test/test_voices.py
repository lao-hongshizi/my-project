"""
Voice audition script — generates one sample line per character × voice candidate.
Listen to the output MP3s and pick the best voice for each character.
"""

import requests
import os
import time

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "sk_6a3fb236bb9a0c5f4db52a0550d44b09d776f9ae9849995d")
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Each entry: (character, label, voice_id, test_line, settings)
# settings = (stability, similarity_boost, style)
TESTS = [
    # ── WangBeng: needs softer, younger, K-pop soi boi ──
    ("wangbeng", "roger_current",  "CwhRBWXzGAHq8TQ4Fs17", "你没事儿吧？我叫王崩。", (0.7, 0.75, 0.5)),
    ("wangbeng", "chris_soft",     "iP95p4xoKVk53GoZ742B", "你没事儿吧？我叫王崩。", (0.5, 0.75, 0.6)),
    ("wangbeng", "daniel_calm",    "onwK4e9ZLuTAKqWW03F9", "你没事儿吧？我叫王崩。", (0.5, 0.75, 0.5)),
    ("wangbeng", "charlie_young",  "IKne3meq5aSn9XLyUdCD", "你没事儿吧？我叫王崩。", (0.6, 0.75, 0.4)),

    # ── GuaiLaoshi: creepier, older ──
    ("guailaoshi", "bill_current",   "pqHfZKP75CvOlQylNhV4", "同学们好。我姓怪，你们叫我怪老师就好了。", (0.8, 0.75, 0.2)),
    ("guailaoshi", "bill_creepier",  "pqHfZKP75CvOlQylNhV4", "同学们好。我姓怪，你们叫我怪老师就好了。", (0.4, 0.85, 0.6)),
    ("guailaoshi", "george_warm",    "JBFqnCBsd6RMkjVDRZzb", "同学们好。我姓怪，你们叫我怪老师就好了。", (0.5, 0.8, 0.4)),

    # ── QingQing: younger, cuter ──
    ("qingqing", "lily_current",  "pFZP5JQG7iQjIQuC4Bku", "你好，我叫清清。你是哪里人？", (0.75, 0.75, 0.3)),
    ("qingqing", "aria_young",    "9BWtsMINqrJLrRacOk9x", "你好，我叫清清。你是哪里人？", (0.6, 0.75, 0.5)),
    ("qingqing", "sarah_soft",    "EXAVITQu4vr4xnSDxMaL", "你好，我叫清清。你是哪里人？", (0.65, 0.75, 0.4)),
    ("qingqing", "jessica_cute",  "cgSgspJ2msm6clMCkdW9", "你好，我叫清清。你是哪里人？", (0.7, 0.75, 0.4)),

    # ── XiaoLi: trailing, disassociated ──
    ("xiaoli", "jessica_current",   "cgSgspJ2msm6clMCkdW9", "哎。我叫小李。你呢？", (0.3, 0.75, 0.8)),
    ("xiaoli", "jessica_detached",  "cgSgspJ2msm6clMCkdW9", "哎。我叫小李。你呢？", (0.8, 0.6, 0.1)),
    ("xiaoli", "rachel_flat",       "21m00Tcm4TlvDq8ikWAM", "哎。我叫小李。你呢？", (0.7, 0.7, 0.2)),
    ("xiaoli", "lily_dreamy",       "pFZP5JQG7iQjIQuC4Bku", "哎。我叫小李。你呢？", (0.8, 0.6, 0.1)),

    # ── Keep but confirm: AiZhong, XiaoHei, Narrator ──
    ("aizhong",  "charlie_current", "IKne3meq5aSn9XLyUdCD", "我超爱中文！你好你好！", (0.5, 0.75, 0.7)),
    ("xiaohei",  "laura_current",   "FGY2WhTYpPnrIDTdsKH5", "哇，好帅。他叫什么名字？", (0.3, 0.75, 0.9)),
    ("narrator", "george_current",  "JBFqnCBsd6RMkjVDRZzb", "走廊。开学第一天。", (0.7, 0.75, 0.3)),
]

def generate(char, label, voice_id, text, settings):
    stability, sim_boost, style = settings
    filename = f"{char}__{label}.mp3"
    filepath = os.path.join(OUT_DIR, filename)

    if os.path.exists(filepath):
        print(f"  SKIP {filename} (already exists)")
        return

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": API_KEY,
            "Content-Type": "application/json",
        },
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
        with open(filepath, "wb") as f:
            f.write(r.content)
        print(f"  OK   {filename}")
    else:
        print(f"  FAIL {filename} — {r.status_code}: {r.text[:200]}")

    time.sleep(0.3)  # gentle rate limit

if __name__ == "__main__":
    print(f"Generating {len(TESTS)} voice samples...\n")
    for char, label, vid, text, settings in TESTS:
        generate(char, label, vid, text, settings)
    print(f"\nDone! Listen to files in: {OUT_DIR}")

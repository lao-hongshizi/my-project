# PROJECT BIBLE — Disintegrative Zhongwen (崩中文)

## What This Is
A mobile-first Chinese language learning web app disguised as a dark, satirical visual novel. 20 chapters of narrative dialogue with 6 characters, vocabulary, grammar notes, and culture notes. Think Ace Attorney meets Duolingo meets edgy Gen-Z humor.

**Live:** https://my-project-mu-black.vercel.app
**Repo:** https://github.com/lao-hongshizi/my-project

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (inline @theme tokens)
- **Hosting:** Vercel (production)
- **TTS:** ElevenLabs `eleven_multilingual_v2` (pre-generated MP3s)
- **Fonts:** Noto Sans SC (Chinese), Space Mono (mono), Georgia (serif)

---

## Repo Structure

```
content/ch01-ch20.json        — 20 chapter JSON files (source of truth for all content)
public/audio/ch01-ch20/       — Pre-generated ElevenLabs TTS MP3s per chapter
public/avatars/               — Character portrait PNGs (transparent backgrounds)
scripts/generate_tts.py       — Batch TTS generation script (ElevenLabs)
src/app/
  layout.tsx                  — Root layout
  page.tsx                    — Home / chapter list
  globals.css                 — Theme tokens, keyframes, base styles
  api/tts/route.ts            — ElevenLabs proxy (fallback, not used in production)
  chapter/[id]/page.tsx       — Chapter page (SSG, dynamic route)
src/components/
  ChapterReader.tsx           — Main reading engine (tap-to-advance, autoplay, sections)
  ChapterHeader.tsx           — Sticky header (chapter title, grammar button)
  SectionPage.tsx             — Renders a section: scene + revealed lines
  ChatBubble.tsx              — Character dialogue bubble (tap to cycle hanzi→pinyin→english)
  CharacterAvatar.tsx         — Ace Attorney-style avatar (renders behind active bubble)
  SceneLine.tsx               — Scene/stage direction text
  ActionLine.tsx              — Action descriptions
  NarratorLine.tsx            — Narrator lines
  DualLine.tsx                — Flashcard-style dual lines (tap to toggle)
  GrammarPanel.tsx            — Slide-out grammar/culture notes panel
  ChapterCard.tsx             — Chapter list card on home page
  PinyinLine.tsx              — Pinyin display for vocab matching
  VocabText.tsx / VocabPopup.tsx — Vocabulary highlighting and popups
  CharacterBar.tsx            — (UNUSED - was removed from header)
  Avatar.tsx                  — (OLD - replaced by CharacterAvatar)
src/lib/
  types.ts                    — All TypeScript interfaces (Chapter, ScriptItem, CharacterDef, etc.)
  characters.ts               — Character definitions (name, color, align, avatar path)
  chapters.ts                 — Chapter loading/listing functions
  sections.ts                 — splitIntoSections() — breaks script into scene-based pages
  tts.ts                      — TTS client (preloadAudio, speak, stopSpeaking)
  sounds.ts                   — UI sound effects (click)
  vocab-matcher.ts            — Vocabulary matching/highlighting logic
```

---

## Characters

| Key | Name | Color | Align | Voice (ElevenLabs) | Voice ID | Description |
|-----|------|-------|-------|-------------------|----------|-------------|
| xiaoli | 小李 | #E8847C | right | Charlotte (sassy) | `XB0fDUnXU5powFXDhCwa` | Phone addict, half-white, vapes, disassociated |
| wangbeng | 王崩 | #5B9BD5 | left | Chris (soft) | `iP95p4xoKVk53GoZ742B` | Hot Taiwanese K-pop soi boi, will correct you |
| aizhong | 矮中 | #7EC87E | left | Charlie (energetic) | `IKne3meq5aSn9XLyUdCD` | White cringe sinophile from Ohio |
| guailaoshi | 怪老师 | #C4A265 | left | Bill (creepy) | `pqHfZKP75CvOlQylNhV4` | 60s, white, "I love the culture" |
| xiaohei | 小黑 | #D4A5D4 | right | Lily (dreamy) | `pFZP5JQG7iQjIQuC4Bku` | K-pop, memes, Cantonese, wants WangBeng |
| qingqing | 清清 | #A5D4D4 | right | Jessica (cute) | `cgSgspJ2msm6clMCkdW9` | Perfect student, Singaporean, secret weakness |
| narrator | 旁白 | #888888 | left | George (warm) | `JBFqnCBsd6RMkjVDRZzb` | Neutral storyteller |

### Voice Settings (stability / similarity_boost / style)
- **xiaoli:** 0.3 / 0.75 / 0.9
- **wangbeng:** 0.5 / 0.75 / 0.6
- **aizhong:** 0.5 / 0.75 / 0.7
- **guailaoshi:** 0.4 / 0.85 / 0.6
- **xiaohei:** 0.8 / 0.6 / 0.1
- **qingqing:** 0.7 / 0.75 / 0.4
- **narrator:** 0.7 / 0.75 / 0.3

---

## Avatar System

### Current State
- All 6 characters + narrator have portrait art in `public/avatars/`
- XiaoLi is final art; all others are placeholders
- Portraits show inline behind the active (most recently revealed) chat bubble
- Slide-in animation from character's alignment side (left or right)
- Transparent backgrounds (processed with rembg), rendered at 20% opacity behind text

### Planned: Emotional States
Future system for character-locked emotion variants:
```
public/avatars/
  xiaoli/neutral.png, annoyed.png, surprised.png, detached.png, rare-smile.png
  wangbeng/neutral.png, smug.png, correcting.png, flustered.png
  aizhong/excited.png, nervous.png, rejected.png, scheming.png
  guailaoshi/smiling.png, intense.png, lecturing.png
  xiaohei/fangirl.png, sassy.png, shocked.png, scheming.png
  qingqing/composed.png, judging.png, embarrassed.png, soft.png
```
- Art generated with DrawThings, character-locked
- Script JSON would get optional `emotion` field per line
- Could batch-tag 1047 lines with an LLM from fixed emotion sets
- Avatar component would look up emotion, fall back to neutral

---

## TTS System

### Pre-generated Audio
- 1,047 dialogue lines across 20 chapters
- MP3 files at `public/audio/ch{NN}/{scriptIndex}_{charKey}.mp3`
- Generated via `scripts/generate_tts.py` (Python, ElevenLabs API)
- Script is idempotent — skips existing files, safe to re-run
- Usage: `python3 scripts/generate_tts.py` (all) or `python3 scripts/generate_tts.py 5 10` (range)
- **API Key:** stored in `.env.local` as `ELEVENLABS_API_KEY` (gitignored)

### Client-Side Playback (`src/lib/tts.ts`)
- `speak(chapterNum, scriptIndex, charKey)` — plays static MP3 from `/audio/`
- `stopSpeaking()` — stops current audio
- `preloadAudio(chapterNum, lines)` — preloads current section's audio into HTMLAudioElements for instant playback
- Preloading happens automatically when a section loads (via useEffect in ChapterReader)

### Fallback API Route (`src/app/api/tts/route.ts`)
- POST `/api/tts` with `{ text, charKey }` — proxies to ElevenLabs in real-time
- Not used in production (static files are served instead)
- Useful for testing new voices or generating one-offs

---

## UX Flow

### Reading Engine (ChapterReader.tsx)
1. Chapter script is split into **sections** (each starting with a "scene" description)
2. User **taps** to reveal lines one at a time within a section
3. Tapping a **chat bubble** cycles: Hanzi → Pinyin → English
4. **Autoplay** mode (▶ button) auto-advances lines with timing based on text length
5. Audio plays automatically when a line is revealed (pre-generated MP3)
6. **Avatars** slide in behind the active bubble for the current speaker
7. Section navigation: BACK ← / TAP ↓ / NEXT →

### Chapter Data Shape (content/ch{NN}.json)
```json
{
  "chapter": 1,
  "title": "嘿",
  "titleEn": "Hey",
  "topic": "打招呼 / Greetings",
  "grammar": ["我叫", "你呢", ...],
  "characters": { ... },
  "script": [
    { "type": "scene", "text": "走廊。开学第一天。", "en": "A hallway. First day." },
    { "type": "line", "char": "xiaoli", "zh": "哎。", "en": "Ow." },
    { "type": "action", "text": "小李看了看王崩。" },
    { "type": "dual", "chars": ["xiaoli","wangbeng"], "text": "你好", ... }
  ],
  "vocab": [...],
  "vocabSlang": [...],
  "grammarNotes": [...],
  "cultureNotes": [...]
}
```

### ScriptItem Types
- **scene** — Stage direction / setting description (always visible at top of section)
- **line** — Character dialogue (has `char`, `zh`, `en`, optional `pinyinText`, `sub`)
- **action** — Action description (no character)
- **dual** — Flashcard-style line with multiple characters

---

## Design System

### Colors
- Background: `#0d0d0d`
- Surface: `#111111`
- Accent: `#CE2D2D`
- Foreground: `#e8e8e8`
- Each character has a unique color (see Characters table)

### Typography
- Hanzi in dialogue: 24px
- Pinyin in dialogue: 18px (ChatBubble), 20px (DualLine)
- English: 20px (ChatBubble)
- Character names: 10px mono bold
- Scene descriptions: serif italic

### Layout
- Mobile-first, max-width 480px centered
- Dark theme throughout
- Sticky header with chapter info + grammar button
- Scrollable content area with tap-to-advance

---

## Deployment
- **Vercel** auto-deploys from `main` branch
- `vercel --prod --yes` for manual production deploy
- Static MP3s and avatar PNGs served from Vercel's edge CDN
- Total audio ~50MB across all chapters (within Vercel free tier limits)
- `.env.local` has `ELEVENLABS_API_KEY` for the API route fallback (not needed for static audio)

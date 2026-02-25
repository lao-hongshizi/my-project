# CLAUDE.md — Instructions for Claude Code CLI (CCC)

## WHO YOU ARE
You are the builder for **Disintegrated Zhongwen (崩中文)**, a mobile-first Chinese language learning web app. The project owner directs you via JOBS.md. When you sit down to work, your first job is always to read that file.

## WHEN THE USER SAYS "GET TO WORK"
1. Read `JOBS.md`
2. Execute every job listed under `## PENDING JOBS` in order, top to bottom
3. After completing each job, move it to `## COMPLETED JOBS` with a timestamp and brief note on what you did
4. If a job is unclear, make your best judgment and log what you decided in the completed note
5. When all jobs are done, report a summary of what was completed

## PROJECT OVERVIEW
- Mobile-first React web app
- Content source: 20-chapter Chinese learning narrative with dialogue, vocabulary tables, grammar notes, and culture notes
- Target users: Young adults rebuilding intermediate Chinese
- Characters: 矮中文, 王崩, 小黑, 清清, 小李, 怪老师
- Tone: Dark, modern, satirical — NOT a traditional textbook

## CORE UX PRINCIPLES
- All progression is student-driven (tap to advance — nothing auto-plays)
- Snap-to sections (each page = one scene beat, not one line)
- Pinyin/English toggle button cycles: Hanzi only → Hanzi + Pinyin → Hanzi + Pinyin + English
- Toggle resets to Hanzi-only on page advance
- Font sizes: Hanzi 24-28px, Pinyin 16px, English 14px
- Mobile-first always

## REPO STRUCTURE
- `content/ch01-ch20.json` — 20 chapter JSON files
- `src/app/` — Next.js App Router pages
- `src/components/` — React components
- `src/hooks/` — Custom React hooks
- `src/lib/` — Data layer (types, characters, chapters, vocab-matcher)
- `src/prototype/` — Original prototype for reference
- `JOBS.md` — Job queue

## DESIGN RULES
- Dark theme: bg #0d0d0d, accent #CE2D2D
- Mobile-first, max-width 480px centered
- Font: Noto Sans SC (sans), Space Mono (mono), Georgia (serif)
- Character colors defined in characters.ts
- Minimal UI, no clutter

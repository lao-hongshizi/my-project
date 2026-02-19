# JOBS.md — Job Queue for CCC

> **How this works:**
> - Ke adds jobs under PENDING from GitHub mobile
> - CCC executes them in order when told "get to work"
> - CCC moves completed jobs to COMPLETED with notes

---

## PENDING JOBS

*No pending jobs.*

---

## COMPLETED JOBS

### JOB 001 — UX Overhaul: Tap-to-Reveal Line System
**Completed: 2026-02-18**
Rewrote ChapterReader to use section-based state. Tapping the reading area reveals one line at a time. When all lines in a section are revealed, next tap advances to the next section. Created new `SectionPage` component and `splitIntoSections` utility in `src/lib/sections.ts`. Removed old `DialogueStream` component.

### JOB 002 — UX Overhaul: Snap-to Section Scroller
**Completed: 2026-02-18**
Chose React page-state approach (cleaner for mobile than CSS scroll-snap since we also manage line reveal state). Each section is rendered as a full page via `SectionPage`. Navigation via tap (forward), back button, and bottom nav bar showing section progress (e.g. "3 / 5"). Scene description always visible as section header.

### JOB 003 — UX Overhaul: Pinyin / English Toggle Button
**Completed: 2026-02-18**
Added cycling toggle button in `ChapterHeader` with three states: 字 (Hanzi only) → 拼 (+ Pinyin) → 英 (+ English). Display mode resets to Hanzi-only on section advance. Created `PinyinLine` component that matches vocab entries to show pinyin; unmatched characters show dots. English uses the `en` field from JSON script lines (available in ch01, varies by chapter).

### JOB 004 — UX Overhaul: Font Size Increase
**Completed: 2026-02-18**
Updated font sizes across all dialogue components: Hanzi 24px (ChatBubble) / 28px (DualLine), Pinyin 16px, English 14px. Scene descriptions bumped to 16px. Applied consistently to ChatBubble, DualLine, NarratorLine, SceneLine, and PinyinLine.

### JOB 005 — UX Overhaul: Remove All Auto-Advance Logic
**Completed: 2026-02-18**
Deleted `useTypewriter.ts` (auto-timed line reveal) and `useAutoScroll.ts` (auto-scroll to bottom). Deleted `BottomBar.tsx` (showed auto-progress counter). Removed all setTimeout/auto-play patterns. All progression is now 100% tap-driven through ChapterReader state management.

---

## HOW TO ADD A NEW JOB (for Ke on mobile)
1. Open this file in the GitHub mobile app
2. Add a new entry under PENDING JOBS using the format above
3. Number it sequentially (JOB 006, JOB 007, etc.)
4. Save/commit — CCC will pick it up next session

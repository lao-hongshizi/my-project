"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Chapter, ScriptItem } from "@/lib/types";
import { splitIntoSections } from "@/lib/sections";
import { ChapterHeader } from "./ChapterHeader";
import { SectionPage } from "./SectionPage";
import { GrammarPanel } from "./GrammarPanel";
import { speak, stopSpeaking, preloadAudio } from "@/lib/tts";

/** Delay in ms before revealing the next line, based on the line currently being read/spoken. */
function getLineDelay(item: ScriptItem): number {
  if (item.type === "line" || item.type === "dual") {
    const text = item.zh || item.text || "";
    // ~3 chars/sec speech pace + buffer for natural pauses
    return Math.max(1800, text.length * 300 + 800);
  }
  // Action descriptions — read silently, shorter delay
  const text = item.text || "";
  return Math.max(1500, text.length * 120);
}

/** Speak a line if it's dialogue (not actions/scenes). */
function speakLine(
  item: ScriptItem & { _idx?: number },
  chapterNum: number
) {
  if (item.type === "line" || item.type === "dual") {
    const text = item.zh || item.text || "";
    if (text && item._idx != null) speak(chapterNum, item._idx, item.char);
  }
}

interface ChapterReaderProps {
  chapter: Chapter;
}

export function ChapterReader({ chapter }: ChapterReaderProps) {
  const indexedScript = useMemo(
    () => chapter.script.map((item, i) => ({ ...item, _idx: i })),
    [chapter.script]
  );
  const sections = useMemo(
    () => splitIntoSections(indexedScript),
    [indexedScript]
  );

  const [sectionIndex, setSectionIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [grammarOpen, setGrammarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSection = sections[sectionIndex];
  const totalLines = currentSection?.lines.length ?? 0;
  const allRevealed = revealedCount >= totalLines;
  const isLastSection = sectionIndex >= sections.length - 1;

  // Manual tap to advance (works alongside autoplay)
  const handleTap = useCallback(() => {
    if (grammarOpen) {
      setGrammarOpen(false);
      return;
    }

    if (!allRevealed) {
      const nextLine = currentSection.lines[revealedCount];
      setRevealedCount((c) => c + 1);
      if (nextLine) speakLine(nextLine, chapter.chapter);
    } else if (!isLastSection) {
      setSectionIndex((i) => i + 1);
      setRevealedCount(0);
      stopSpeaking();
    }
  }, [grammarOpen, allRevealed, isLastSection, currentSection, revealedCount]);

  const handleBack = useCallback(() => {
    if (sectionIndex > 0) {
      setSectionIndex((i) => i - 1);
      setRevealedCount(0);
      setIsPlaying(false);
      stopSpeaking();
    }
  }, [sectionIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (p) stopSpeaking();
      return !p;
    });
  }, []);

  // --- Autoplay timer ---
  useEffect(() => {
    if (!isPlaying || grammarOpen) return;

    if (revealedCount < totalLines) {
      // Determine wait time before revealing the next line
      let delay: number;
      if (revealedCount === 0) {
        // Brief pause before first line of section
        delay = 800;
      } else {
        // Wait based on the line that was just revealed (currently being spoken)
        const lastRevealed = currentSection.lines[revealedCount - 1];
        delay = lastRevealed ? getLineDelay(lastRevealed) : 1500;
      }

      const timer = setTimeout(() => {
        const nextLine = currentSection.lines[revealedCount];
        setRevealedCount((c) => c + 1);
        if (nextLine) speakLine(nextLine, chapter.chapter);
      }, delay);

      return () => clearTimeout(timer);
    } else if (!isLastSection) {
      // All lines revealed — wait for last line to finish, then advance section
      const lastLine = currentSection.lines[totalLines - 1];
      const delay = lastLine ? getLineDelay(lastLine) + 500 : 2000;

      const timer = setTimeout(() => {
        setSectionIndex((i) => i + 1);
        setRevealedCount(0);
        stopSpeaking();
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Reached the end of the chapter
      setIsPlaying(false);
    }
  }, [
    isPlaying,
    revealedCount,
    sectionIndex,
    grammarOpen,
    totalLines,
    isLastSection,
    currentSection,
  ]);

  // Preload audio for current section
  useEffect(() => {
    preloadAudio(chapter.chapter, currentSection.lines);
  }, [chapter.chapter, currentSection]);

  // Cleanup TTS on unmount
  useEffect(() => () => stopSpeaking(), []);

  if (!currentSection) return null;

  return (
    <div
      className="min-h-dvh max-w-[480px] mx-auto relative flex flex-col overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >

      <ChapterHeader
        chapterNum={chapter.chapter}
        title={chapter.title}
        topic={chapter.topic}
        grammarOpen={grammarOpen}
        onToggleGrammar={() => setGrammarOpen(!grammarOpen)}
      />

      {/* Tap zone — the main reading area */}
      <div className="flex-1 flex flex-col relative z-10" onClick={handleTap}>
        <SectionPage
          section={currentSection}
          revealedCount={revealedCount}
        />
      </div>

      {/* Bottom navigation bar */}
      <div
        className="px-5 py-4 flex justify-between items-center relative z-10"
        style={{ borderTop: "1px solid #ffffff0a" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBack();
          }}
          className="text-xs font-mono cursor-pointer bg-transparent border-none"
          style={{
            color: sectionIndex > 0 ? "#CE2D2D" : "#333",
          }}
          disabled={sectionIndex === 0}
        >
          ← BACK
        </button>

        {/* Autoplay toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-none rounded-full transition-colors"
          style={{
            color: isPlaying ? "#CE2D2D" : "#666",
            background: isPlaying ? "#CE2D2D18" : "transparent",
          }}
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="text-[10px] text-subtle font-mono">
          {sectionIndex + 1} / {sections.length}
        </div>

        {allRevealed && isLastSection ? (
          chapter.chapter < 20 ? (
            <Link
              href={`/chapter/${String(chapter.chapter + 1).padStart(2, "0")}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-mono no-underline"
              style={{ color: "#CE2D2D" }}
            >
              NEXT CH →
            </Link>
          ) : (
            <Link
              href="/"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-mono no-underline"
              style={{ color: "#CE2D2D" }}
            >
              HOME →
            </Link>
          )
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTap();
            }}
            className="text-xs font-mono cursor-pointer bg-transparent border-none"
            style={{ color: "#CE2D2D" }}
          >
            {allRevealed ? "NEXT →" : "TAP ↓"}
          </button>
        )}
      </div>

      {grammarOpen && (
        <GrammarPanel
          grammarNotes={chapter.grammarNotes}
          cultureNotes={chapter.cultureNotes}
          onClose={() => setGrammarOpen(false)}
        />
      )}
    </div>
  );
}

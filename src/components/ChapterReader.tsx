"use client";

import { useState, useCallback, useMemo } from "react";
import type { Chapter } from "@/lib/types";
import { splitIntoSections } from "@/lib/sections";
import { ChapterHeader } from "./ChapterHeader";
import { SectionPage } from "./SectionPage";
import { GrammarPanel } from "./GrammarPanel";

interface ChapterReaderProps {
  chapter: Chapter;
}

export function ChapterReader({ chapter }: ChapterReaderProps) {
  const sections = useMemo(
    () => splitIntoSections(chapter.script),
    [chapter.script]
  );

  const [sectionIndex, setSectionIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [grammarOpen, setGrammarOpen] = useState(false);

  const currentSection = sections[sectionIndex];
  const totalLines = currentSection?.lines.length ?? 0;
  const allRevealed = revealedCount >= totalLines;
  const isLastSection = sectionIndex >= sections.length - 1;

  const handleTap = useCallback(() => {
    if (grammarOpen) {
      setGrammarOpen(false);
      return;
    }

    if (!allRevealed) {
      setRevealedCount((c) => c + 1);
    } else if (!isLastSection) {
      setSectionIndex((i) => i + 1);
      setRevealedCount(0);
    }
  }, [grammarOpen, allRevealed, isLastSection]);

  const handleBack = useCallback(() => {
    if (sectionIndex > 0) {
      setSectionIndex((i) => i - 1);
      setRevealedCount(0);
    }
  }, [sectionIndex]);

  if (!currentSection) return null;

  return (
    <div
      className="min-h-dvh max-w-[480px] mx-auto relative flex flex-col"
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
      <div className="flex-1 flex flex-col" onClick={handleTap}>
        <SectionPage
          section={currentSection}
          revealedCount={revealedCount}
        />
      </div>

      {/* Bottom navigation bar */}
      <div
        className="px-5 py-4 flex justify-between items-center"
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
        <div className="text-[10px] text-subtle font-mono">
          {sectionIndex + 1} / {sections.length}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTap();
          }}
          className="text-xs font-mono cursor-pointer bg-transparent border-none"
          style={{
            color:
              allRevealed && isLastSection ? "#333" : "#CE2D2D",
          }}
          disabled={allRevealed && isLastSection}
        >
          {allRevealed ? "NEXT →" : "TAP ↓"}
        </button>
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

"use client";

import Link from "next/link";

interface ChapterHeaderProps {
  chapterNum: number;
  title: string;
  topic: string;
  grammarOpen: boolean;
  onToggleGrammar: () => void;
}

export function ChapterHeader({
  chapterNum,
  title,
  topic,
  grammarOpen,
  onToggleGrammar,
}: ChapterHeaderProps) {
  const chapterLabel = `CHAPTER ${String(chapterNum).padStart(2, "0")}`;

  return (
    <div
      className="sticky top-0 z-[100] px-5 pt-4 pb-4"
      style={{
        background: "#0d0d0d",
        borderBottom: "1px solid #ffffff0a",
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Link
            href="/"
            className="text-accent text-lg mt-1 no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            崩
          </Link>
          <div>
            <div className="text-[11px] tracking-[4px] text-accent font-mono font-bold">
              {chapterLabel}
            </div>
            <div className="text-[28px] font-bold text-white mt-0.5 leading-none">
              <span className="text-accent">{title}</span>
            </div>
            <div className="text-xs text-dim mt-1 font-mono">{topic}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleGrammar();
            }}
            className="rounded-lg px-3 py-1.5 text-[11px] cursor-pointer font-mono font-bold tracking-[1px]"
            style={{
              background: grammarOpen ? "#CE2D2D" : "#CE2D2D22",
              border: "1px solid #CE2D2D66",
              color: grammarOpen ? "#fff" : "#CE2D2D",
            }}
          >
            文法
          </button>
        </div>
      </div>
    </div>
  );
}

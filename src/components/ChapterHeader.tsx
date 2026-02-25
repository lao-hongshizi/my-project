"use client";

import Link from "next/link";

interface ChapterHeaderProps {
  chapterNum: number;
  title: string;
  topic: string;
}

export function ChapterHeader({
  chapterNum,
  title,
  topic,
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
    </div>
  );
}

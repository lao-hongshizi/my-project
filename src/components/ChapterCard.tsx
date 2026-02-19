import Link from "next/link";
import type { ChapterMeta } from "@/lib/types";

interface ChapterCardProps {
  chapter: ChapterMeta;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link
      href={`/chapter/${chapter.id}`}
      className="block rounded-xl p-4 transition-all hover:border-accent/40 no-underline"
      style={{
        background: "#ffffff06",
        border: "1px solid #ffffff0a",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] tracking-[2px] text-accent font-mono font-bold">
          {String(chapter.chapter).padStart(2, "0")}
        </span>
        <span className="text-xl font-bold text-white">{chapter.title}</span>
        <span className="text-sm text-dim">{chapter.titleEn}</span>
      </div>
      <div className="text-xs text-muted mt-1.5 font-mono">{chapter.topic}</div>
      <div className="flex gap-3 mt-2 text-[10px] text-subtle font-mono">
        <span>{chapter.scriptLength} lines</span>
        {chapter.hasVocab && <span>vocab</span>}
        {chapter.hasGrammar && <span>grammar</span>}
      </div>
    </Link>
  );
}

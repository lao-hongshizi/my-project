import { getAllChapterMeta } from "@/lib/chapters";
import { ChapterCard } from "@/components/ChapterCard";

export default function Home() {
  const chapters = getAllChapterMeta();

  return (
    <div className="max-w-[480px] mx-auto">
      {/* ─── TITLE SCREEN ─── */}
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center relative">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[48px] font-bold leading-none tracking-tight">
            <span className="text-accent">崩</span><span className="text-accent">中文</span>
          </div>
          <div className="text-[13px] text-dim font-mono tracking-[6px] uppercase">
            Disintegrated Zhongwen
          </div>
        </div>

        <div className="mt-12 text-[10px] text-subtle font-mono tracking-[4px] uppercase animate-pulse-dot">
          Scroll down
        </div>

        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-px"
          style={{ background: "#CE2D2D44" }}
        />
      </div>

      {/* ─── TABLE OF CONTENTS ─── */}
      <div className="px-5 pb-8">
        <div className="mb-6">
          <div className="text-[11px] tracking-[4px] text-accent font-mono font-bold">
            CHAPTERS
          </div>
          <div className="text-xl font-bold text-white mt-1">
            20 Episodes · 1 Semester
          </div>
        </div>

        <div className="space-y-3">
          {chapters.map((ch) => (
            <ChapterCard key={ch.id} chapter={ch} />
          ))}
        </div>
      </div>
    </div>
  );
}

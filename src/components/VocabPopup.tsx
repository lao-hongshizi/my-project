"use client";

import type { VocabEntry } from "@/lib/types";

interface VocabPopupProps {
  entry: VocabEntry;
  onClose: () => void;
}

export function VocabPopup({ entry, onClose }: VocabPopupProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-[200] animate-fade-slide-in"
      style={{
        background: "linear-gradient(180deg, #1a1a1aF0, #111111FA)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid #CE2D2D44",
        padding: "20px 24px 28px",
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[28px] font-bold text-white">{entry.zh}</span>
          <span className="text-sm text-accent ml-3 font-mono">
            {entry.pinyin}
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-dim text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div className="text-sm text-[#ccc] mt-1.5">{entry.en}</div>
      {entry.note && (
        <div
          className="text-xs text-muted mt-2 leading-relaxed pt-2 italic"
          style={{ borderTop: "1px solid #ffffff11" }}
        >
          {entry.note}
        </div>
      )}
    </div>
  );
}

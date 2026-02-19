"use client";

import { useState } from "react";
import { playClick } from "@/lib/sounds";

type BubbleMode = "hanzi" | "pinyin" | "english";

interface DualLineProps {
  chars: string[];
  text: string;
  pinyinText?: string;
  en?: string;
}

export function DualLine({ text, pinyinText, en }: DualLineProps) {
  const [mode, setMode] = useState<BubbleMode>("hanzi");

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setMode((m) => {
      if (m === "hanzi") return "pinyin";
      if (m === "pinyin") return en ? "english" : "hanzi";
      return "hanzi";
    });
  };

  return (
    <div className="animate-fade-slide-in flex justify-center py-4 px-5 my-2">
      <div
        className="rounded-2xl px-5 py-3 text-center cursor-pointer active:opacity-80 transition-opacity"
        onClick={handleTap}
        style={{
          background: "#CE2D2D22",
          border: "1px solid #CE2D2D44",
        }}
      >
        {mode === "hanzi" && (
          <div className="text-[28px] font-bold text-white tracking-wide">
            {text}
          </div>
        )}
        {mode === "pinyin" && (
          <div className="text-[20px] text-accent font-mono">
            {pinyinText || text}
          </div>
        )}
        {mode === "english" && (
          <div className="text-[22px] text-muted">
            {en || text}
          </div>
        )}
      </div>
    </div>
  );
}

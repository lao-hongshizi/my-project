"use client";

import { useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { playClick } from "@/lib/sounds";
import Image from "next/image";

type BubbleMode = "hanzi" | "pinyin" | "english";

interface ChatBubbleProps {
  charKey: string;
  text: string;
  pinyinText?: string;
  sub?: string;
  en?: string;
  isActive?: boolean;
}

export function ChatBubble({
  charKey,
  text,
  pinyinText,
  sub,
  en,
  isActive,
}: ChatBubbleProps) {
  const [mode, setMode] = useState<BubbleMode>("hanzi");
  const c = CHARACTERS[charKey];
  if (!c) return null;

  const isRight = c.align === "right";
  const showAvatar = isActive && !!c.avatar;

  const handleBubbleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setMode((m) => {
      if (m === "hanzi") return "pinyin";
      if (m === "pinyin") return en ? "english" : "hanzi";
      return "hanzi";
    });
  };

  return (
    <div
      className="animate-fade-slide-in flex px-2 my-1 relative"
      style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}
    >
      {/* Avatar behind bubble */}
      {showAvatar && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            [isRight ? "right" : "left"]: "-20px",
            top: "-40px",
            animation: `avatar-slide-in-${isRight ? "right" : "left"} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}
        >
          <Image
            src={c.avatar!}
            alt={c.name}
            width={140}
            height={170}
            className="object-contain object-bottom"
            style={{
              opacity: 0.25,
              filter: "brightness(0.8)",
              maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            }}
            priority
          />
        </div>
      )}

      <div
        className="max-w-[75%] flex flex-col relative z-10"
        style={{ alignItems: isRight ? "flex-end" : "flex-start" }}
      >
        {/* Character name label */}
        <div
          className="text-[10px] font-mono font-bold mb-1 px-1"
          style={{ color: c.color }}
        >
          {c.name}
        </div>
        <div
          className="px-4 py-3 leading-relaxed cursor-pointer active:opacity-80 transition-opacity"
          onClick={handleBubbleTap}
          style={{
            background: `${c.color}18`,
            border: `1px solid ${c.color}33`,
            borderRadius: isRight
              ? "16px 4px 16px 16px"
              : "4px 16px 16px 16px",
          }}
        >
          {mode === "hanzi" && (
            <div className="text-[24px] text-foreground">{text}</div>
          )}

          {mode === "pinyin" && (
            <div className="text-[18px] text-accent font-mono">
              {pinyinText || text}
            </div>
          )}

          {mode === "english" && (
            <div className="text-[20px] text-muted">
              {en || text}
            </div>
          )}
        </div>
        {sub && (
          <div className="text-[11px] text-[#666] mt-1 px-1 italic">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

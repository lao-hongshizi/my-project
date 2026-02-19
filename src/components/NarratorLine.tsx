"use client";

import { useState } from "react";

interface NarratorLineProps {
  text: string;
  pinyinText?: string;
}

export function NarratorLine({ text, pinyinText }: NarratorLineProps) {
  const [showPinyin, setShowPinyin] = useState(false);

  return (
    <div
      className="animate-fade-slide-in py-2 px-7 my-1 text-center cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setShowPinyin(!showPinyin);
      }}
    >
      <div className="text-xs text-[#666] italic font-serif">
        {showPinyin && pinyinText ? pinyinText : text}
      </div>
    </div>
  );
}

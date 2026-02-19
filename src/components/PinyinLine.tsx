"use client";

import { matchVocab } from "@/lib/vocab-matcher";
import type { VocabEntry } from "@/lib/types";

interface PinyinLineProps {
  text: string;
  vocab: VocabEntry[];
}

/**
 * Renders pinyin below Chinese text by matching vocab entries.
 * Words not in vocab show as plain text without pinyin.
 */
export function PinyinLine({ text, vocab }: PinyinLineProps) {
  const parts = matchVocab(text, vocab);

  return (
    <div className="text-[16px] text-accent mt-1 font-mono">
      {parts.map((p, i) =>
        p.isVocab && p.entry ? (
          <span key={i}>{p.entry.pinyin}</span>
        ) : (
          <span key={i} className="text-[#555]">
            {"·".repeat(p.text.length)}
          </span>
        )
      )}
    </div>
  );
}

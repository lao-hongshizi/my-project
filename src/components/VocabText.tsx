"use client";

import { matchVocab, type VocabPart } from "@/lib/vocab-matcher";
import type { VocabEntry } from "@/lib/types";

interface VocabTextProps {
  text: string;
  vocab: VocabEntry[];
  onTapVocab: (entry: VocabEntry) => void;
}

export function VocabText({ text, vocab, onTapVocab }: VocabTextProps) {
  const parts: VocabPart[] = matchVocab(text, vocab);

  return (
    <>
      {parts.map((p, i) =>
        p.isVocab && p.entry ? (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onTapVocab(p.entry!);
            }}
            className="cursor-pointer"
            style={{
              borderBottom: "1.5px dotted #CE2D2D",
              color: "inherit",
            }}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

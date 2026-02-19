import type { VocabEntry } from "./types";

export interface VocabPart {
  text: string;
  isVocab: boolean;
  entry?: VocabEntry;
}

/**
 * Splits Chinese text into vocab and non-vocab spans using longest-match-first.
 * Vocab words are matched greedily: longer words take priority.
 */
export function matchVocab(text: string, vocab: VocabEntry[]): VocabPart[] {
  if (!vocab.length) return [{ text, isVocab: false }];

  // Sort by length descending for longest-match-first
  const sorted = [...vocab].sort((a, b) => b.zh.length - a.zh.length);

  let parts: VocabPart[] = [{ text, isVocab: false }];

  for (const entry of sorted) {
    const next: VocabPart[] = [];
    for (const part of parts) {
      if (part.isVocab) {
        next.push(part);
        continue;
      }
      const idx = part.text.indexOf(entry.zh);
      if (idx === -1) {
        next.push(part);
        continue;
      }
      if (idx > 0) {
        next.push({ text: part.text.slice(0, idx), isVocab: false });
      }
      next.push({ text: entry.zh, isVocab: true, entry });
      if (idx + entry.zh.length < part.text.length) {
        next.push({
          text: part.text.slice(idx + entry.zh.length),
          isVocab: false,
        });
      }
    }
    parts = next;
  }

  return parts;
}

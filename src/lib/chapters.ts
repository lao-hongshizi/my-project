import fs from "fs";
import path from "path";
import { pinyin } from "pinyin-pro";
import type { Chapter, ChapterMeta } from "./types";

const contentDir = path.join(process.cwd(), "content");

function toPinyin(text: string): string {
  return pinyin(text, { type: "string", toneType: "symbol" });
}

export function getChapter(id: string): Chapter {
  const filePath = path.join(contentDir, `ch${id}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return {
    chapter: raw.chapter,
    title: raw.title,
    titleEn: raw.titleEn,
    topic: raw.topic ?? "",
    grammar: raw.grammar ?? [],
    script: (raw.script ?? []).map((item: Record<string, unknown>) => {
      const zhText =
        item.type === "line" || item.type === "dual"
          ? (item.zh as string | undefined) ?? (item.text as string | undefined)
          : (item.text as string | undefined);

      return {
        type: item.type,
        text: zhText,
        zh: item.zh as string | undefined,
        en: item.en as string | undefined,
        pinyinText: zhText ? toPinyin(zhText) : undefined,
        char: item.char as string | undefined,
        chars: item.chars as string[] | undefined,
        sub: item.sub as string | undefined,
      };
    }),
    vocab: raw.vocab ?? [],
    vocabSlang: raw.vocabSlang ?? [],
    grammarNotes: raw.grammarNotes ?? [],
    cultureNotes: raw.cultureNotes ?? [],
  };
}

export function getAllChapterMeta(): ChapterMeta[] {
  const chapters: ChapterMeta[] = [];
  for (let i = 1; i <= 20; i++) {
    const id = String(i).padStart(2, "0");
    const filePath = path.join(contentDir, `ch${id}.json`);
    if (!fs.existsSync(filePath)) continue;
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    chapters.push({
      id,
      chapter: raw.chapter,
      title: raw.title,
      titleEn: raw.titleEn,
      topic: raw.topic ?? "",
      scriptLength: (raw.script ?? []).length,
      hasVocab: (raw.vocab ?? []).length > 0,
      hasGrammar: (raw.grammarNotes ?? []).length > 0,
    });
  }
  return chapters;
}

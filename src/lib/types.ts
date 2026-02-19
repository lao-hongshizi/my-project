export interface ScriptItem {
  type: "scene" | "line" | "action" | "dual";
  text?: string;
  zh?: string;
  en?: string;
  pinyinText?: string;
  char?: string;
  chars?: string[];
  sub?: string;
}

export interface VocabEntry {
  zh: string;
  pinyin: string;
  en: string;
  pos?: string;
  note?: string;
}

export interface VocabSlang {
  en: string;
  zh: string;
  note?: string;
}

export interface GrammarNote {
  title: string;
  body: string;
  examples?: { zh?: string; en?: string; formal?: string; real?: string }[];
}

export interface CultureNote {
  title: string;
  body: string;
}

export interface Chapter {
  chapter: number;
  title: string;
  titleEn: string;
  topic: string;
  grammar: string[];
  script: ScriptItem[];
  vocab: VocabEntry[];
  vocabSlang?: VocabSlang[];
  grammarNotes: GrammarNote[];
  cultureNotes: CultureNote[];
}

export interface ChapterMeta {
  id: string;
  chapter: number;
  title: string;
  titleEn: string;
  topic: string;
  scriptLength: number;
  hasVocab: boolean;
  hasGrammar: boolean;
}

export interface CharacterDef {
  name: string;
  color: string;
  bg: string;
  icon: string;
  desc: string;
  align: "left" | "right";
}

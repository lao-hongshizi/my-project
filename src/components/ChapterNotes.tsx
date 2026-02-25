"use client";

import { useState } from "react";
import type { GrammarNote, CultureNote } from "@/lib/types";

interface ChapterNotesProps {
  grammarNotes: GrammarNote[];
  cultureNotes: CultureNote[];
}

export function ChapterNotes({
  grammarNotes,
  cultureNotes,
}: ChapterNotesProps) {
  const [expandedGrammar, setExpandedGrammar] = useState<number | null>(null);

  if (grammarNotes.length === 0 && cultureNotes.length === 0) return null;

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      {/* Grammar Notes */}
      {grammarNotes.length > 0 && (
        <div className="mb-8">
          <div className="text-[11px] tracking-[3px] text-accent font-mono font-bold mb-4">
            文法 GRAMMAR
          </div>
          <div className="space-y-2">
            {grammarNotes.map((g, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedGrammar(expandedGrammar === i ? null : i);
                }}
                className="rounded-xl px-3.5 py-3 cursor-pointer transition-all"
                style={{
                  background:
                    expandedGrammar === i ? "#CE2D2D11" : "#ffffff06",
                  border: `1px solid ${expandedGrammar === i ? "#CE2D2D33" : "#ffffff0a"}`,
                }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: expandedGrammar === i ? "#CE2D2D" : "#ccc",
                  }}
                >
                  {g.title}
                </div>
                {expandedGrammar === i && (
                  <div className="text-[13px] text-[#999] mt-2.5 leading-relaxed font-serif">
                    {g.body}
                    {g.examples && g.examples.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {g.examples.map((ex, j) => (
                          <div
                            key={j}
                            className="text-xs pl-3"
                            style={{ borderLeft: "2px solid #CE2D2D33" }}
                          >
                            {ex.zh && (
                              <div className="text-foreground">{ex.zh}</div>
                            )}
                            {ex.en && (
                              <div className="text-muted">{ex.en}</div>
                            )}
                            {ex.formal && (
                              <div className="text-muted line-through">
                                {ex.formal}
                              </div>
                            )}
                            {ex.real && (
                              <div className="text-foreground">{ex.real}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Notes */}
      {cultureNotes.length > 0 && (
        <div>
          <div
            className="text-[11px] tracking-[3px] text-accent font-mono font-bold mb-4 pt-4"
            style={{ borderTop: "1px solid #ffffff0a" }}
          >
            文化 CULTURE
          </div>
          <div className="space-y-5">
            {cultureNotes.map((note, i) => (
              <div key={i}>
                <div className="text-sm font-semibold text-[#ccc] mb-1.5">
                  {note.title}
                </div>
                <div className="text-[13px] text-muted leading-relaxed font-serif">
                  {note.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom padding */}
      <div className="min-h-[40vh]" />
    </div>
  );
}

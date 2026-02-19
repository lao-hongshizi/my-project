"use client";

import { useState } from "react";
import type { GrammarNote, CultureNote } from "@/lib/types";

interface GrammarPanelProps {
  grammarNotes: GrammarNote[];
  cultureNotes: CultureNote[];
  onClose: () => void;
}

export function GrammarPanel({
  grammarNotes,
  cultureNotes,
  onClose,
}: GrammarPanelProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed top-0 right-0 bottom-0 z-[300] overflow-y-auto p-5 animate-fade-slide-in"
      style={{
        width: "min(340px, 85vw)",
        background: "#111111FA",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid #CE2D2D33",
      }}
    >
      <div className="flex justify-between items-center mb-5">
        <div className="text-[11px] tracking-[3px] text-accent font-mono font-bold">
          文法 GRAMMAR
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-dim text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>

      {grammarNotes.map((g, i) => (
        <div
          key={i}
          onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          className="mb-2 rounded-xl px-3.5 py-3 cursor-pointer transition-all"
          style={{
            background: activeIndex === i ? "#CE2D2D11" : "#ffffff06",
            border: `1px solid ${activeIndex === i ? "#CE2D2D33" : "#ffffff0a"}`,
          }}
        >
          <div
            className="text-sm font-semibold"
            style={{ color: activeIndex === i ? "#CE2D2D" : "#ccc" }}
          >
            {g.title}
          </div>
          {activeIndex === i && (
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
                      {ex.en && <div className="text-muted">{ex.en}</div>}
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

      {cultureNotes.length > 0 && (
        <div
          className="mt-6 pt-4"
          style={{ borderTop: "1px solid #ffffff0a" }}
        >
          <div className="text-[11px] tracking-[3px] text-accent font-mono font-bold mb-3">
            CULTURE NOTES
          </div>
          {cultureNotes.map((note, i) => (
            <div key={i} className="mb-4">
              <div className="text-sm font-semibold text-[#ccc] mb-1">
                {note.title}
              </div>
              <div className="text-[13px] text-muted leading-relaxed font-serif">
                {note.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import type { Section } from "@/lib/sections";
import { SceneLine } from "./SceneLine";
import { ActionLine } from "./ActionLine";
import { ChatBubble } from "./ChatBubble";
import { NarratorLine } from "./NarratorLine";
import { DualLine } from "./DualLine";

interface SectionPageProps {
  section: Section;
  revealedCount: number;
}

export function SectionPage({
  section,
  revealedCount,
}: SectionPageProps) {
  const { scene, lines } = section;
  const visibleLines = lines.slice(0, revealedCount);

  return (
    <div className="flex-1 px-4 py-4 overflow-y-auto">
      {/* Scene description — always visible */}
      {scene.text && <SceneLine text={scene.text} en={scene.en} />}

      {/* Revealed lines — space-y-5 gives scroll gutter between bubbles */}
      <div className="space-y-5 mt-2">
        {visibleLines.map((item, idx) => {
          if (item.type === "action") {
            return <ActionLine key={idx} text={item.text ?? ""} en={item.en} />;
          }

          if (item.type === "dual") {
            return (
              <DualLine
                key={idx}
                chars={item.chars ?? []}
                text={item.text ?? ""}
                pinyinText={item.pinyinText}
                en={item.en}
              />
            );
          }

          if (item.type === "line") {
            const charKey = item.char ?? "";

            if (charKey === "narrator") {
              return (
                <NarratorLine
                  key={idx}
                  text={item.text ?? ""}
                  pinyinText={item.pinyinText}
                />
              );
            }

            return (
              <ChatBubble
                key={idx}
                charKey={charKey}
                text={item.text ?? ""}
                pinyinText={item.pinyinText}
                sub={item.sub}
                en={item.en}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Scroll padding — enough empty space to scroll past the last bubble */}
      <div className="min-h-[60vh]">
        {/* Tap prompt when more lines remain */}
        {revealedCount < lines.length && (
          <div className="text-center py-8">
            <div className="text-[10px] text-subtle font-mono tracking-widest">
              TAP TO CONTINUE
            </div>
          </div>
        )}

        {/* Section complete indicator */}
        {lines.length > 0 && revealedCount >= lines.length && (
          <div className="text-center py-8">
            <div className="text-[10px] text-subtle font-mono tracking-widest">
              TAP FOR NEXT SECTION →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

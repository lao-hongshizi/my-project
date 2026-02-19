"use client";

import { CHARACTERS } from "@/lib/characters";
import { Avatar } from "./Avatar";

export function CharacterBar() {
  return (
    <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
      {Object.entries(CHARACTERS)
        .filter(([k]) => k !== "narrator")
        .map(([key, c]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 rounded-full pr-2.5 pl-1 py-1 shrink-0"
            style={{
              background: `${c.color}11`,
              border: `1px solid ${c.color}22`,
            }}
          >
            <Avatar charKey={key} size={22} />
            <div
              className="text-[10px] whitespace-nowrap font-medium"
              style={{ color: c.color }}
            >
              {c.name}
            </div>
          </div>
        ))}
    </div>
  );
}

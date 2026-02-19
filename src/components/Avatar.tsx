"use client";

import { CHARACTERS } from "@/lib/characters";

interface AvatarProps {
  charKey: string;
  size?: number;
}

export function Avatar({ charKey, size = 40 }: AvatarProps) {
  const c = CHARACTERS[charKey];
  if (!c) return null;

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${c.color}44, ${c.color}88)`,
        border: `2px solid ${c.color}`,
        fontSize: size * 0.45,
        boxShadow: `0 0 12px ${c.color}33`,
      }}
    >
      {c.icon}
    </div>
  );
}

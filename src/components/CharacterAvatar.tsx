"use client";

import { CHARACTERS } from "@/lib/characters";
import Image from "next/image";

interface CharacterAvatarProps {
  charKey: string | null;
}

export function CharacterAvatar({ charKey }: CharacterAvatarProps) {
  const char = charKey ? CHARACTERS[charKey] : null;
  if (!char?.avatar) return null;

  const isRight = char.align === "right";

  return (
    <div
      key={charKey}
      className="pointer-events-none absolute bottom-12 z-0"
      style={{
        [isRight ? "right" : "left"]: "-10px",
        animation: `avatar-slide-in-${isRight ? "right" : "left"} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both`,
      }}
    >
      <Image
        src={char.avatar}
        alt={char.name}
        width={180}
        height={220}
        className="object-contain object-bottom"
        style={{
          filter: "brightness(0.6)",
          maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
        }}
        priority
      />
    </div>
  );
}

"use client";

interface ActionLineProps {
  text: string;
  en?: string;
}

export function ActionLine({ text, en }: ActionLineProps) {
  return (
    <div className="animate-fade-slide-in py-2 px-7 my-1">
      <div
        className="text-[13px] text-[#777] italic leading-relaxed pl-3 font-serif"
        style={{ borderLeft: "2px solid #CE2D2D33" }}
      >
        {en || text}
      </div>
    </div>
  );
}

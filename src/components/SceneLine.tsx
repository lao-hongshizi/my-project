"use client";

interface SceneLineProps {
  text: string;
  en?: string;
}

export function SceneLine({ text, en }: SceneLineProps) {
  return (
    <div className="animate-fade-slide-in py-6 px-5 text-center">
      <div className="text-[13px] text-accent tracking-[2px] uppercase font-mono font-bold">
        ▬▬▬
      </div>
      <div className="text-base text-[#aaa] mt-2 italic leading-relaxed font-serif">
        {en || text}
      </div>
    </div>
  );
}

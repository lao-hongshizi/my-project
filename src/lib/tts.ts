"use client";

let currentAudio: HTMLAudioElement | null = null;
const preloaded = new Map<string, HTMLAudioElement>();

function audioSrc(chapterNum: number, scriptIndex: number, charKey: string) {
  const ch = String(chapterNum).padStart(2, "0");
  const idx = String(scriptIndex).padStart(3, "0");
  return `/audio/ch${ch}/${idx}_${charKey}.mp3`;
}

/** Preload audio files so they play instantly on tap. */
export function preloadAudio(
  chapterNum: number,
  lines: { _idx?: number; char?: string; type: string }[]
) {
  for (const line of lines) {
    if (line._idx == null) continue;
    if (line.type !== "line" && line.type !== "dual") continue;
    const src = audioSrc(chapterNum, line._idx, line.char ?? "narrator");
    if (preloaded.has(src)) continue;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;
    preloaded.set(src, audio);
  }
}

export async function speak(
  chapterNum: number,
  scriptIndex: number,
  charKey?: string
) {
  if (typeof window === "undefined") return;

  stopSpeaking();

  const src = audioSrc(chapterNum, scriptIndex, charKey ?? "narrator");

  // Use preloaded element if available, otherwise create new
  let audio = preloaded.get(src);
  if (audio) {
    audio.currentTime = 0;
  } else {
    audio = new Audio(src);
  }
  currentAudio = audio;

  try {
    await audio.play();
  } catch {
    // File doesn't exist yet or playback blocked — fail silently
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

import type { ScriptItem } from "./types";

export interface Section {
  scene: ScriptItem; // The "scene" item that starts this section
  lines: ScriptItem[]; // All non-scene items in this section
}

/**
 * Splits a chapter script into sections.
 * Each section starts with a "scene" type entry, followed by lines/actions/duals.
 * Consecutive scene entries without intervening lines become their own single-item sections.
 */
export function splitIntoSections(script: ScriptItem[]): Section[] {
  const sections: Section[] = [];
  let currentScene: ScriptItem | null = null;
  let currentLines: ScriptItem[] = [];

  for (const item of script) {
    if (item.type === "scene") {
      // Flush previous section if it exists
      if (currentScene) {
        sections.push({ scene: currentScene, lines: currentLines });
      }
      currentScene = item;
      currentLines = [];
    } else {
      if (!currentScene) {
        // Lines before any scene — create a synthetic scene
        currentScene = { type: "scene", text: "" };
      }
      currentLines.push(item);
    }
  }

  // Flush last section
  if (currentScene) {
    sections.push({ scene: currentScene, lines: currentLines });
  }

  return sections;
}

import { readFileSync } from 'fs';
import { join } from 'path';

const dir = join(import.meta.dirname, '..', 'content');
let totalItems = 0;
let totalMissing = 0;

for (let i = 1; i <= 20; i++) {
  const f = `ch${String(i).padStart(2, '0')}.json`;
  const d = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
  const items = d.script.filter(s => s.type === 'scene' || s.type === 'action');
  const missing = items.filter(s => !s.en);
  totalItems += items.length;
  totalMissing += missing.length;
  console.log(`${f}: ${items.length} scene/action items, ${missing.length} missing en`);
  if (missing.length > 0) {
    missing.forEach(m => console.log(`  MISSING: "${m.text}"`));
  }
}

console.log(`\nTotal: ${totalItems} items, ${totalMissing} missing`);

import { useState, useRef, useEffect } from "react";

// ─── VOCAB DATABASE ───
const VOCAB = {
  "哦": { pinyin: "ó", en: "oh! (surprise)", note: "Natural reaction, not textbook 你好" },
  "不好意思": { pinyin: "bù hǎo yìsi", en: "sorry / excuse me", note: "Way more common than 对不起 in daily life" },
  "没关系": { pinyin: "méi guānxi", en: "no problem / it's fine", note: "The real response to 不好意思" },
  "请问": { pinyin: "qǐng wèn", en: "may I ask", note: "Polite opener, slightly formal" },
  "你叫什么名字": { pinyin: "nǐ jiào shénme míngzi", en: "what's your name?", note: "Full form. Casual: 你叫什么？" },
  "你呢": { pinyin: "nǐ ne", en: "and you?", note: "呢 continues the topic without repeating the whole question" },
  "嘿": { pinyin: "hēi", en: "hey", note: "Casual greeting. Nobody under 30 says 你好 to peers." },
  "美女": { pinyin: "měinǚ", en: "beautiful girl / miss", note: "Can be flattering OR creepy depending on who says it and how" },
  "谢谢": { pinyin: "xièxie", en: "thanks", note: "Her pause before this says everything" },
  "美国人": { pinyin: "Měiguó rén", en: "American", note: "美国 = America, 人 = person" },
  "台湾人": { pinyin: "Táiwān rén", en: "Taiwanese person", note: "王崩 will DIE on this hill" },
  "中国人": { pinyin: "Zhōngguó rén", en: "Chinese person", note: "DO NOT call a Taiwanese person this" },
  "不是": { pinyin: "bú shì", en: "am not / is not", note: "Negation of 是. His voice is shaking." },
  "台湾": { pinyin: "Táiwān", en: "Taiwan", note: "A country. Don't @ 王崩." },
  "嗨": { pinyin: "hāi", en: "hi (from English)", note: "Another casual greeting, borrowed from English" },
  "很高兴认识你们": { pinyin: "hěn gāoxìng rènshi nǐmen", en: "nice to meet you all", note: "矮中文 is the only person who talks like a textbook" },
  "太好了": { pinyin: "tài hǎo le", en: "great! / awesome!", note: "矮中文's enthusiasm is... a lot" },
  "你好": { pinyin: "nǐ hǎo", en: "hello (FORMAL)", note: "Only 怪老师 says this. Because he's old." },
  "好听": { pinyin: "hǎotīng", en: "sounds nice / pleasant", note: "For names, music, voices. NOT for complimenting appearance." },
  "漂亮": { pinyin: "piàoliang", en: "pretty", note: "When your 60yo teacher says this to a student... 🚩" },
  "拜拜": { pinyin: "báibai", en: "bye (casual)", note: "From English 'bye bye'. Nobody says 再见." },
  "同学们": { pinyin: "tóngxuémen", en: "students / classmates", note: "们 = plural marker for people" },
  "老师": { pinyin: "lǎoshī", en: "teacher", note: "A title of respect. This one doesn't deserve it." },
  "我叫": { pinyin: "wǒ jiào", en: "my name is / I'm called", note: "叫 literally means 'to be called'" },
  "一半": { pinyin: "yí bàn", en: "half", note: "小李 is half-white, half-Chinese. 一半一半." },
  "今天": { pinyin: "jīntiān", en: "today", note: "今 = now/present, 天 = day" },
};

// ─── CHARACTER DATA ───
const CHARS = {
  xiaoli: { name: "小李", color: "#E8847C", bg: "#2D1B1B", icon: "♀", desc: "phone addict · half-white · vapes" },
  wangbeng: { name: "王崩", color: "#5B9BD5", bg: "#1B2230", icon: "♂", desc: "hot · Taiwanese · will correct you" },
  aizhongwen: { name: "矮中文", color: "#7EC87E", bg: "#1B2D1B", icon: "♂", desc: "white sinophile · cringe · tattoo" },
  guailaoshi: { name: "怪老师", color: "#C4A265", bg: "#2D2A1B", icon: "👴", desc: "60s · creepy · 'you're pretty today'" },
  xiaohei: { name: "小黑", color: "#D4A5D4", bg: "#2D1B2D", icon: "♀", desc: "K-pop · memes · wants 王崩" },
  qingqing: { name: "清清", color: "#A5D4D4", bg: "#1B2D2D", icon: "♀", desc: "perfect student · secret weakness" },
  narrator: { name: "旁白", color: "#888", bg: "#1a1a1a", icon: "✦", desc: "" },
};

// ─── DIALOGUE SCRIPT ───
const SCRIPT = [
  { type: "scene", text: "A university hallway. First day of Chinese class." },
  { type: "scene", text: "小李 walks with her eyes buried in her phone. Earbuds in. Vape in one hand. She doesn't see 王崩 coming around the corner." },
  { type: "action", text: "CRASH. Her bag spills — pills, vape pods, lip gloss, a cracked phone case, loose earbuds, receipts, and a single sad granola bar scatter across the floor." },

  { type: "dual", chars: ["xiaoli", "wangbeng"], text: "哦！" },

  { type: "line", char: "xiaoli", text: "不好意思。" },
  { type: "line", char: "wangbeng", text: "没关系。", sub: "(crouches, starts picking up her stuff)" },
  { type: "line", char: "wangbeng", text: "请问，你叫什么名字？" },
  { type: "line", char: "xiaoli", text: "小李。你呢？" },
  { type: "line", char: "wangbeng", text: "王崩。嘿。美女。" },
  { type: "action", text: "小李 pauses. Looks up from her phone for the first time." },
  { type: "line", char: "xiaoli", text: "……谢谢。你是美国人吗？" },
  { type: "line", char: "wangbeng", text: "我是台湾人。" },
  { type: "line", char: "xiaoli", text: "啊，你是中国人！" },
  { type: "action", text: "王崩 freezes. His jaw tightens. He's about to say something when—" },

  { type: "scene", text: "矮中文 appears from nowhere, already on his knees, gathering her scattered belongings with alarming enthusiasm." },

  { type: "line", char: "aizhongwen", text: "嗨！我来帮你！", sub: "(already holding three lip glosses)" },
  { type: "action", text: "王崩 watches this white guy scramble for 小李's purse contents. A rivalry is born." },
  { type: "line", char: "wangbeng", text: "……不是。台湾。不是中国。", sub: "(to 小李, but his eyes are on 矮中文)" },
  { type: "line", char: "aizhongwen", text: "嗨嗨嗨！我叫矮中文！很高兴认识你们！", sub: "(stands up, extends hand)" },
  { type: "line", char: "xiaoli", text: "……嗨。" },
  { type: "line", char: "wangbeng", text: "……嘿。", sub: "(does not shake hand)" },
  { type: "line", char: "aizhongwen", text: "你们也学中文吗？太好了！我们一起上课吧！" },

  { type: "scene", text: "Classroom. 小黑 and 清清 are already seated. 小黑 is scrolling TikTok. 清清 has her textbook open to the wrong chapter (on purpose, so she can read ahead)." },

  { type: "action", text: "怪老师 enters. He's 60-something. Tweed jacket. Smells like library paste and regret." },

  { type: "line", char: "guailaoshi", text: "同学们，你好。" },
  { type: "line", char: "narrator", text: "Nobody says 你好 back. Because nobody says 你好.", sub: "" },
  { type: "line", char: "guailaoshi", text: "请问，你叫什么名字？", sub: "(looking directly at 小李)" },
  { type: "line", char: "xiaoli", text: "小李。" },
  { type: "line", char: "guailaoshi", text: "小李。好听。你今天很漂亮。" },
  { type: "action", text: "The room goes silent. 小黑 looks up from her phone. 清清's pen stops moving." },
  { type: "line", char: "xiaoli", text: "……谢谢。", sub: "(already packing up mentally)" },

  { type: "scene", text: "After class." },
  { type: "line", char: "aizhongwen", text: "老师再见！" },
  { type: "action", text: "Everyone else just leaves. 小李 is the first one out." },
  { type: "line", char: "xiaoli", text: "拜拜。", sub: "(to no one in particular)" },

  { type: "scene", text: "END OF CHAPTER 1" },
];

// ─── GRAMMAR NOTES ───
const GRAMMAR = [
  { title: "嘿/嗨 vs 你好", body: "Your textbook lied. Nobody under 30 says 你好 to friends. Real greetings: 嘿 (hey), 嗨 (hi), 哈喽 (hālu), or just... nothing. 你好 is for strangers, customer service, and 怪老师." },
  { title: "你呢 — The Bounceback", body: "呢 bounces the question back without repeating it. \"你叫什么名字？\" → answer → \"你呢？\" means \"and you? (what's your name?)\" Works with almost anything." },
  { title: "美女 — Context Is Everything", body: "From a friend: compliment. From a street vendor: \"hey miss, buy something.\" From a hot guy your age: maybe okay. From your 60-year-old teacher: absolutely not." },
  { title: "拜拜 vs 再见", body: "再见 is textbook. 拜拜 is life. Also: 88 (text speak), 走了 (\"I'm out\"), or just... leave. Chinese goodbyes are either 拜拜 or ghosting." },
  { title: "台湾 ≠ 中国", body: "This is not a grammar point. This is a survival tip. Calling a Taiwanese person 中国人 is how you start an international incident at the dinner table. 王崩 will remember this forever." },
];

// ─── MAIN APP ───
export default function App() {
  const [vocabPopup, setVocabPopup] = useState(null);
  const [grammarOpen, setGrammarOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(3);
  const [activeGrammar, setActiveGrammar] = useState(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (visibleLines < SCRIPT.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 120);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleLines]);

  const renderVocabText = (text) => {
    const sorted = Object.keys(VOCAB).sort((a, b) => b.length - a.length);
    let parts = [{ text, isVocab: false }];
    for (const word of sorted) {
      const next = [];
      for (const part of parts) {
        if (part.isVocab) { next.push(part); continue; }
        const idx = part.text.indexOf(word);
        if (idx === -1) { next.push(part); continue; }
        if (idx > 0) next.push({ text: part.text.slice(0, idx), isVocab: false });
        next.push({ text: word, isVocab: true });
        if (idx + word.length < part.text.length) next.push({ text: part.text.slice(idx + word.length), isVocab: false });
      }
      parts = next;
    }
    return parts.map((p, i) =>
      p.isVocab ? (
        <span key={i} onClick={(e) => { e.stopPropagation(); setVocabPopup({ word: p.text, ...VOCAB[p.text], x: e.clientX, y: e.clientY }); }}
          style={{ borderBottom: "1.5px dotted #CE2D2D", cursor: "pointer", color: "inherit" }}>{p.text}</span>
      ) : <span key={i}>{p.text}</span>
    );
  };

  const Avatar = ({ charKey, size = 40 }) => {
    const c = CHARS[charKey];
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}44, ${c.color}88)`,
        border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45, flexShrink: 0, boxShadow: `0 0 12px ${c.color}33`,
      }}>{c.icon}</div>
    );
  };

  const renderLine = (item, idx) => {
    const fadeStyle = {
      animation: "fadeSlideIn 0.4s ease both",
      animationDelay: "0ms",
    };

    if (item.type === "scene") {
      return (
        <div key={idx} style={{ ...fadeStyle, padding: "24px 20px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#CE2D2D", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: 700 }}>
            ▬▬▬
          </div>
          <div style={{ fontSize: 14, color: "#aaa", marginTop: 8, fontStyle: "italic", lineHeight: 1.6, fontFamily: "'Georgia', serif" }}>
            {item.text}
          </div>
        </div>
      );
    }

    if (item.type === "action") {
      return (
        <div key={idx} style={{ ...fadeStyle, padding: "8px 28px", margin: "4px 0" }}>
          <div style={{ fontSize: 13, color: "#777", fontStyle: "italic", lineHeight: 1.6, borderLeft: "2px solid #CE2D2D33", paddingLeft: 12, fontFamily: "'Georgia', serif" }}>
            {item.text}
          </div>
        </div>
      );
    }

    if (item.type === "dual") {
      return (
        <div key={idx} style={{ ...fadeStyle, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "16px 20px", margin: "8px 0" }}>
          <Avatar charKey={item.chars[0]} size={36} />
          <div style={{
            background: "#CE2D2D22", border: "1px solid #CE2D2D44", borderRadius: 16,
            padding: "10px 20px", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 2,
          }}>
            {renderVocabText(item.text)}
          </div>
          <Avatar charKey={item.chars[1]} size={36} />
        </div>
      );
    }

    if (item.type === "line") {
      const c = CHARS[item.char];
      const isNarrator = item.char === "narrator";
      const isRight = ["xiaoli", "qingqing", "xiaohei"].includes(item.char);

      if (isNarrator) {
        return (
          <div key={idx} style={{ ...fadeStyle, padding: "8px 28px", margin: "4px 0", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
              {renderVocabText(item.text)}
            </div>
          </div>
        );
      }

      return (
        <div key={idx} style={{
          ...fadeStyle, display: "flex", alignItems: "flex-start", gap: 10,
          padding: "4px 16px", margin: "3px 0",
          flexDirection: isRight ? "row-reverse" : "row",
        }}>
          <Avatar charKey={item.char} size={36} />
          <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isRight ? "flex-end" : "flex-start" }}>
            <div style={{
              background: `${c.color}18`, border: `1px solid ${c.color}33`,
              borderRadius: isRight ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              padding: "10px 14px", fontSize: 16, color: "#e8e8e8", lineHeight: 1.5,
            }}>
              {renderVocabText(item.text)}
            </div>
            {item.sub && (
              <div style={{ fontSize: 11, color: "#666", marginTop: 3, padding: "0 4px", fontStyle: "italic" }}>
                {item.sub}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Noto Sans SC', 'PingFang SC', -apple-system, sans-serif" }}
      onClick={() => { setVocabPopup(null); setActiveGrammar(null); }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(1px, -1px); } 60% { transform: translate(-1px, 0); } 80% { transform: translate(1px, 1px); } 100% { transform: translate(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #CE2D2D44; border-radius: 3px; }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "linear-gradient(180deg, #0d0d0d 70%, transparent)", padding: "16px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#CE2D2D", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
              CHAPTER 01
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginTop: 2, lineHeight: 1.1 }}>
              <span style={{ color: "#CE2D2D" }}>嘿</span>
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4, fontFamily: "'Space Mono', monospace" }}>
              Hey · Greetings · First Impressions
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); setGrammarOpen(!grammarOpen); }}
              style={{
                background: grammarOpen ? "#CE2D2D" : "#CE2D2D22", border: "1px solid #CE2D2D66",
                color: grammarOpen ? "#fff" : "#CE2D2D", borderRadius: 8, padding: "6px 12px",
                fontSize: 11, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontWeight: 700,
                letterSpacing: 1,
              }}>
              文法
            </button>
          </div>
        </div>

        {/* ─── CHARACTER BAR ─── */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
          {Object.entries(CHARS).filter(([k]) => k !== "narrator").map(([key, c]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 6, background: `${c.color}11`,
              border: `1px solid ${c.color}22`, borderRadius: 20, padding: "4px 10px 4px 4px", flexShrink: 0,
            }}>
              <Avatar charKey={key} size={22} />
              <div style={{ fontSize: 10, color: c.color, whiteSpace: "nowrap", fontWeight: 500 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DIALOGUE SCROLL ─── */}
      <div ref={scrollRef} style={{ paddingBottom: 120 }}>
        {SCRIPT.slice(0, visibleLines).map((item, idx) => renderLine(item, idx))}
        <div ref={bottomRef} />
        {visibleLines < SCRIPT.length && (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#CE2D2D", margin: "0 auto", animation: "pulse 1.2s infinite" }} />
          </div>
        )}
      </div>

      {/* ─── VOCAB POPUP ─── */}
      {vocabPopup && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
          background: "linear-gradient(180deg, #1a1a1aF0, #111111FA)", backdropFilter: "blur(20px)",
          borderTop: "1px solid #CE2D2D44", padding: "20px 24px 28px", zIndex: 200,
          animation: "fadeSlideIn 0.2s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{vocabPopup.word}</span>
              <span style={{ fontSize: 14, color: "#CE2D2D", marginLeft: 12, fontFamily: "'Space Mono', monospace" }}>{vocabPopup.pinyin}</span>
            </div>
            <button onClick={() => setVocabPopup(null)} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ fontSize: 14, color: "#ccc", marginTop: 6 }}>{vocabPopup.en}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 8, lineHeight: 1.5, borderTop: "1px solid #ffffff11", paddingTop: 8, fontStyle: "italic" }}>
            {vocabPopup.note}
          </div>
        </div>
      )}

      {/* ─── GRAMMAR PANEL ─── */}
      {grammarOpen && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "min(340px, 85vw)",
          background: "#111111FA", backdropFilter: "blur(20px)", borderLeft: "1px solid #CE2D2D33",
          zIndex: 300, overflowY: "auto", padding: "20px 16px",
          animation: "fadeSlideIn 0.25s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#CE2D2D", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
              文法 GRAMMAR
            </div>
            <button onClick={() => setGrammarOpen(false)} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          {GRAMMAR.map((g, i) => (
            <div key={i} onClick={() => setActiveGrammar(activeGrammar === i ? null : i)}
              style={{
                marginBottom: 8, background: activeGrammar === i ? "#CE2D2D11" : "#ffffff06",
                border: `1px solid ${activeGrammar === i ? "#CE2D2D33" : "#ffffff0a"}`,
                borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s",
              }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: activeGrammar === i ? "#CE2D2D" : "#ccc" }}>
                {g.title}
              </div>
              {activeGrammar === i && (
                <div style={{ fontSize: 13, color: "#999", marginTop: 10, lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
                  {g.body}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 24, borderTop: "1px solid #ffffff0a", paddingTop: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#CE2D2D", fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 12 }}>
              CULTURE NOTE
            </div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
              This chapter teaches you how people actually greet each other. Your old textbook taught you 你好 and 再见 like they were universal. They're not. 你好 is for customer service reps, Siri, and 怪老师. Everyone else says 嘿, 嗨, 哈喽, or nothing at all. 再见 has been replaced by 拜拜 (or 88 in texts) since approximately 2003.
            </div>
          </div>

          <div style={{ marginTop: 24, borderTop: "1px solid #ffffff0a", paddingTop: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#CE2D2D", fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 12 }}>
              矮中文's TATTOO
            </div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
              矮中文 has a Chinese character tattoo on his forearm. He believes it says 爱中国 (Love China). It actually says 矮中文 — which is his own name, meaning "Short Chinese." Nobody has told him yet. This becomes a major plot point in Chapter 7.
            </div>
          </div>
        </div>
      )}

      {/* ─── BOTTOM BAR ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "linear-gradient(0deg, #0d0d0d 60%, transparent)", padding: "40px 20px 16px",
        zIndex: 50, display: vocabPopup ? "none" : "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 10, color: "#333", fontFamily: "'Space Mono', monospace" }}>
          崩中文 · DISINTEGRATIVE ZHONGWEN
        </div>
        <div style={{ fontSize: 10, color: "#333", fontFamily: "'Space Mono', monospace" }}>
          {Math.min(visibleLines, SCRIPT.length)}/{SCRIPT.length}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a seasoned, battle-hardened CEO mentor. Your wisdom is drawn from Andy Grove (Intel), Matt Mochary, Jim Collins (Good to Great), Steve Jobs (Apple), and Elon Musk. You blend these voices into ONE direct, honest, demanding mentor.

You are NOT a cheerleader. You are the mentor who tells the founder what they don't want to hear but need to hear.

## Response Protocol

### Step 1: Probe Before Advising
When a user brings a problem, never give advice first. Ask 1–3 sharp, targeted questions to understand the real situation. Cut through surface symptoms to root cause. Reveal what the CEO may be avoiding. Force clarity on what they actually want vs. what they think they want.

### Step 2: Diagnose
Once you have enough context, state your diagnosis clearly and bluntly. Name the real problem — even if it's uncomfortable. Use phrases like "Here's what I think is actually going on..." or "The real issue isn't X, it's Y."

### Step 3: Advise
Give specific, actionable advice. Draw on the mentor voices where relevant:
- Grove: OKRs, high-output management, ruthless prioritisation
- Mochary: Radical transparency, fear vs. anger root causes, emotional clearing
- Collins: First-who-then-what, Hedgehog Concept, confront brutal facts
- Jobs: Simplicity as strategy, say no to 1000 things, product as mission
- Musk: First principles thinking, aggressive timelines, question every assumption
- O'Leary: Signal vs noise discipline, respect over likability, brand authenticity, hire slow and test first, never let one bad outcome define you

## Kevin O'Leary's Business Frameworks

**Signal vs. Noise — the most important CEO discipline:**
You have 18 waking hours. Pick 3–5 things that MUST get done today. That's your signal. Everything else is noise. Jobs ran at 80% signal — world-class. Musk runs near 100%. Most failing CEOs are at 50/50. If you can't name your top 3 priorities right now, you're already losing. This is not about annual vision or weekly goals. It's about the next 18 hours, every single day.

**Respect over likability:**
Your team are not your friends. They are the people you've assembled to execute a mandate. You don't have to like them. You have to respect their ability to execute. The moment you manage based on relationships instead of performance, you are done. Kind doesn't work. Respect works.

**Hire slow, test first:**
Never hire without testing first. Use an apprenticeship model — bring people in, watch how they work, see if their DNA fits before you commit. Most founders learn this the expensive way.

**Brand authenticity is non-negotiable:**
Your reputation is your most valuable asset. Only back what you personally use and believe in. The moment your audience senses inauthenticity, you're finished. No amount of money is worth tainting your brand. When your gut says no, no number changes that.

**Never let one bad outcome define you:**
You will have failures. Bad investments, wrong hires, failed products. Never put yourself in a position where one bad outcome ends the game. Diversify risk so you can absorb losses and keep playing. You only need one big win.

**On entrepreneurship:**
Only 1 in 3 people have what it takes — risk tolerance, focus, and luck. If you're going to do it, launch early because you'll probably fail the first time, and you need time to recover and go again.

### Step 4: Challenge
End every substantive response with a challenge or accountability question like "What are you going to do about this in the next 48 hours?" or "Is this a strategy problem or a courage problem?"

## Tone Rules
- Brutally honest, not cruel. Clarity, not punishment.
- No flattery. Never say "great question" or "that's a good point."
- Short sentences. Every word carries weight.
- Use "you" statements. Personal, not theoretical.
- Never give generic tips that could apply to anyone.

## Opening Move
Respond with a short acknowledgement (1 sentence max — no flattery) followed by sharp probing questions.

The user is a founder or CEO. You don't know their company yet. In the first message, if they haven't shared context, ask one sharp question to understand their company stage, size, or situation before diving into the problem. Once you know enough, treat every response as personal and specific to them — never generic.`;

const STARTER_PROMPTS = [
  { category: "People", prompt: "I have a senior leader who's well-liked but consistently underdelivering. I keep giving them chances." },
  { category: "Strategy", prompt: "We're growing but I don't know if we're building the right thing. Everyone has a different opinion on direction." },
  { category: "Execution", prompt: "I'm the bottleneck. Decisions slow down waiting for me and I can't figure out how to fix it." },
  { category: "Founder", prompt: "I feel like I'm faking it. The team thinks I have a plan but I'm figuring it out as I go." },
  { category: "Growth", prompt: "Revenue is growing but margins are shrinking. I don't know where the money is going." },
  { category: "Focus", prompt: "I have ten priorities and I know that means I have none. I don't know what to cut." },
];

const GrovePortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    <ellipse cx="27" cy="23" rx="11" ry="12" fill="#c8906a"/>
    <rect x="23" y="33" width="8" height="5" fill="#c8906a"/>
    <path d="M11 54 Q27 40 43 54" fill="#2a1f0e"/>
    <path d="M21 36 L19 44 L27 41 L35 44 L33 36" fill="#3a2e1e"/>
    <rect x="17" y="20" width="7" height="5" rx="2.5" fill="none" stroke="#8a6a30" strokeWidth="1.3"/>
    <rect x="30" y="20" width="7" height="5" rx="2.5" fill="none" stroke="#8a6a30" strokeWidth="1.3"/>
    <line x1="24" y1="22.5" x2="30" y2="22.5" stroke="#8a6a30" strokeWidth="1.3"/>
    <line x1="17" y1="22.5" x2="14" y2="22" stroke="#8a6a30" strokeWidth="1"/>
    <line x1="37" y1="22.5" x2="40" y2="22" stroke="#8a6a30" strokeWidth="1"/>
    <ellipse cx="20.5" cy="22.5" rx="1.8" ry="1.4" fill="#2a1a0a"/>
    <ellipse cx="33.5" cy="22.5" rx="1.8" ry="1.4" fill="#2a1a0a"/>
    <path d="M26 24 L25 28 L28 28" fill="none" stroke="#a06840" strokeWidth="0.8"/>
    <path d="M23 30.5 Q27 32 31 30.5" fill="none" stroke="#8a5530" strokeWidth="1.1"/>
    <ellipse cx="16" cy="23" rx="2" ry="3" fill="#c8906a"/>
    <ellipse cx="38" cy="23" rx="2" ry="3" fill="#c8906a"/>
    <path d="M16 18 Q27 11 38 18 Q37 13 27 12 Q17 13 16 18" fill="#2a1a10"/>
  </svg>
);

const MocharyPortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    <ellipse cx="27" cy="24" rx="10" ry="13" fill="#d4a070"/>
    <rect x="23" y="35" width="8" height="5" fill="#d4a070"/>
    <path d="M11 54 Q27 40 43 54" fill="#1e3a2e"/>
    <path d="M20 38 L18 44 L27 41 L36 44 L34 38" fill="#1e3a2e"/>
    <path d="M23 38 L25 43 L27 40 L29 43 L31 38" fill="#2a4a3e"/>
    <ellipse cx="22" cy="22" rx="2.5" ry="2" fill="#fff"/>
    <ellipse cx="32" cy="22" rx="2.5" ry="2" fill="#fff"/>
    <ellipse cx="22.2" cy="22.4" rx="1.5" ry="1.5" fill="#1a0a00"/>
    <ellipse cx="32.2" cy="22.4" rx="1.5" ry="1.5" fill="#1a0a00"/>
    <path d="M19.5 19 Q22 18 24.5 19" fill="none" stroke="#5a3a18" strokeWidth="1.2"/>
    <path d="M29.5 19 Q32 18 34.5 19" fill="none" stroke="#5a3a18" strokeWidth="1.2"/>
    <path d="M26 24 L25 28 L29 28" fill="none" stroke="#a07040" strokeWidth="0.8"/>
    <path d="M22 31 Q27 34 32 31" fill="none" stroke="#8a4a28" strokeWidth="1.2"/>
    <ellipse cx="17" cy="24" rx="2" ry="3" fill="#d4a070"/>
    <ellipse cx="37" cy="24" rx="2" ry="3" fill="#d4a070"/>
    <path d="M17 18 Q27 9 37 18 Q35 11 27 10 Q19 11 17 18" fill="#1a1208"/>
    <path d="M21 31 Q27 36 33 31 Q33 34 27 36 Q21 34 21 31" fill="#a07040" opacity="0.25"/>
  </svg>
);

const CollinsPortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    <ellipse cx="27" cy="23" rx="10" ry="11" fill="#e8b888"/>
    <rect x="23" y="32" width="8" height="6" fill="#e8b888"/>
    <path d="M11 54 Q27 38 43 54" fill="#1a2a1a"/>
    <path d="M19 35 L17 44 L27 41 L37 44 L35 35" fill="#243020"/>
    <path d="M26 35 L25 39 L27 42 L29 39 L28 35" fill="#8a2020"/>
    <ellipse cx="22" cy="21" rx="2.5" ry="1.8" fill="#fff"/>
    <ellipse cx="32" cy="21" rx="2.5" ry="1.8" fill="#fff"/>
    <ellipse cx="22.3" cy="21.3" rx="1.4" ry="1.4" fill="#1a0a00"/>
    <ellipse cx="32.3" cy="21.3" rx="1.4" ry="1.4" fill="#1a0a00"/>
    <path d="M19.5 18 Q22 17 24.5 18.5" fill="none" stroke="#6a4a28" strokeWidth="1.4"/>
    <path d="M29.5 18 Q32 17 34.5 18.5" fill="none" stroke="#6a4a28" strokeWidth="1.4"/>
    <path d="M26 23 L25.5 27 L28.5 27" fill="none" stroke="#b87848" strokeWidth="0.8"/>
    <path d="M23 29.5 Q27 30.5 31 29.5" fill="none" stroke="#a05838" strokeWidth="1"/>
    <ellipse cx="17" cy="23" rx="2" ry="2.5" fill="#e8b888"/>
    <ellipse cx="37" cy="23" rx="2" ry="2.5" fill="#e8b888"/>
    <path d="M17 16 Q27 11 37 16 Q35 12 27 11 Q19 12 17 16" fill="#909090"/>
    <path d="M17 16 Q18 12 21 11 Q24 14 27 11" fill="#b0b0b0" opacity="0.7"/>
  </svg>
);

const JobsPortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    <path d="M17 15 Q27 11 37 15 L38 29 Q34 37 27 38 Q20 37 16 29 Z" fill="#c89060"/>
    <rect x="23" y="36" width="8" height="5" fill="#c89060"/>
    <path d="M11 54 Q27 40 43 54" fill="#111111"/>
    <path d="M19 38 L18 44 L27 42 L36 44 L35 38 Q31 36 27 37 Q23 36 19 38" fill="#111111"/>
    <path d="M22 37 Q27 39 32 37 Q32 41 27 42 Q22 41 22 37" fill="#1c1c1c"/>
    <ellipse cx="22" cy="22" rx="2.8" ry="2.2" fill="#fff"/>
    <ellipse cx="32" cy="22" rx="2.8" ry="2.2" fill="#fff"/>
    <ellipse cx="22.3" cy="22.3" rx="1.8" ry="1.8" fill="#100500"/>
    <ellipse cx="32.3" cy="22.3" rx="1.8" ry="1.8" fill="#100500"/>
    <circle cx="22.9" cy="21.8" r="0.5" fill="white" opacity="0.6"/>
    <circle cx="32.9" cy="21.8" r="0.5" fill="white" opacity="0.6"/>
    <path d="M19 19 Q22 17.5 25 19" fill="none" stroke="#2a1a08" strokeWidth="1.6"/>
    <path d="M29 19 Q32 17.5 35 19" fill="none" stroke="#2a1a08" strokeWidth="1.6"/>
    <path d="M27 24 L26 28.5 L29 29" fill="none" stroke="#9a6030" strokeWidth="1"/>
    <path d="M23 32 L31 32" fill="none" stroke="#7a4020" strokeWidth="1.2"/>
    <path d="M23 32 Q27 33.5 31 32" fill="none" stroke="#7a4020" strokeWidth="0.8"/>
    <ellipse cx="16" cy="23" rx="2" ry="2.8" fill="#c89060"/>
    <ellipse cx="38" cy="23" rx="2" ry="2.8" fill="#c89060"/>
    <path d="M16 15 Q27 8 38 15 Q36 10 27 10 Q18 10 16 15" fill="#111111"/>
    <path d="M20 30 Q27 35 34 30 Q34 34 27 36 Q20 34 20 30" fill="#7a4a20" opacity="0.2"/>
  </svg>
);

const MuskPortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    <path d="M15 18 Q27 12 39 18 L39 31 Q35 39 27 40 Q19 39 15 31 Z" fill="#daa878"/>
    <rect x="22" y="38" width="10" height="5" fill="#daa878"/>
    <path d="M11 54 Q27 40 43 54" fill="#0a1a2a"/>
    <path d="M18 40 L16 44 L27 42 L38 44 L36 40 Q31 37 27 38 Q23 37 18 40" fill="#122030"/>
    <path d="M23 39 L25 43 L27 41 L29 43 L31 39" fill="#0a1a2a"/>
    <ellipse cx="22" cy="23" rx="3" ry="2.2" fill="#fff"/>
    <ellipse cx="32" cy="23" rx="3" ry="2.2" fill="#fff"/>
    <ellipse cx="22.2" cy="23.3" rx="1.7" ry="1.7" fill="#2a3a4a"/>
    <ellipse cx="32.2" cy="23.3" rx="1.7" ry="1.7" fill="#2a3a4a"/>
    <circle cx="22.9" cy="22.8" r="0.5" fill="white" opacity="0.7"/>
    <circle cx="32.9" cy="22.8" r="0.5" fill="white" opacity="0.7"/>
    <path d="M19 20 L25 20" fill="none" stroke="#5a3a18" strokeWidth="1.6"/>
    <path d="M29 20 L35 20" fill="none" stroke="#5a3a18" strokeWidth="1.6"/>
    <path d="M27 25 L26.5 30 L23 31" fill="none" stroke="#aa7040" strokeWidth="0.9"/>
    <path d="M27 25 L27.5 30 L31 31" fill="none" stroke="#aa7040" strokeWidth="0.9"/>
    <path d="M22 34 Q25 35 29 34 Q31 34.5 32 34" fill="none" stroke="#9a5830" strokeWidth="1.2"/>
    <ellipse cx="15" cy="24" rx="2" ry="3" fill="#daa878"/>
    <ellipse cx="39" cy="24" rx="2" ry="3" fill="#daa878"/>
    <path d="M15 18 Q27 10 39 18 Q37 12 27 11 Q17 12 15 18" fill="#1a1208"/>
  </svg>
);

const OLearyPortrait = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="26" fill="#1c1408" stroke="#C8A96E" strokeWidth="1.2"/>
    {/* Head - round, confident */}
    <ellipse cx="27" cy="23" rx="11" ry="12" fill="#d4956a"/>
    {/* Neck */}
    <rect x="23" y="33" width="8" height="5" fill="#d4956a"/>
    {/* Shoulders - open collar, no tie - casual wealthy */}
    <path d="M11 54 Q27 40 43 54" fill="#1a1a2e"/>
    <path d="M20 36 L18 44 L27 41 L36 44 L34 36" fill="#1a1a2e"/>
    {/* Open shirt collar */}
    <path d="M23 36 L25 41 L27 39 L29 41 L31 36" fill="#252540"/>
    {/* Eyes - sharp, calculating, slightly narrowed */}
    <ellipse cx="21.5" cy="21" rx="2.8" ry="1.9" fill="#fff"/>
    <ellipse cx="32.5" cy="21" rx="2.8" ry="1.9" fill="#fff"/>
    <ellipse cx="21.7" cy="21.2" rx="1.7" ry="1.5" fill="#1a0a00"/>
    <ellipse cx="32.7" cy="21.2" rx="1.7" ry="1.5" fill="#1a0a00"/>
    <circle cx="22.3" cy="20.7" r="0.45" fill="white" opacity="0.6"/>
    <circle cx="33.3" cy="20.7" r="0.45" fill="white" opacity="0.6"/>
    {/* Eyebrows - flat, skeptical */}
    <path d="M19 18.5 Q21.5 17.5 24 18.5" fill="none" stroke="#3a2210" strokeWidth="1.5"/>
    <path d="M30 18.5 Q32.5 17.5 35 18.5" fill="none" stroke="#3a2210" strokeWidth="1.5"/>
    {/* Nose - prominent, rounded */}
    <path d="M27 23 L26 27 L24 28" fill="none" stroke="#aa6a38" strokeWidth="0.9"/>
    <path d="M27 23 L28 27 L30 28" fill="none" stroke="#aa6a38" strokeWidth="0.9"/>
    <ellipse cx="27" cy="28" rx="3.5" ry="1.2" fill="none" stroke="#aa6a38" strokeWidth="0.7"/>
    {/* Mouth - slight smirk, Mr. Wonderful confidence */}
    <path d="M22 31 Q25 30 28 31 Q30 31.5 32 31" fill="none" stroke="#8a4820" strokeWidth="1.2"/>
    {/* Ears */}
    <ellipse cx="16" cy="23" rx="2" ry="2.8" fill="#d4956a"/>
    <ellipse cx="38" cy="23" rx="2" ry="2.8" fill="#d4956a"/>
    {/* Hair - silvery, slightly thinning on top */}
    <path d="M16 17 Q27 10 38 17 Q36 12 27 11 Q18 12 16 17" fill="#888888"/>
    <path d="M16 17 Q18 13 22 12 Q25 14 27 11" fill="#aaaaaa" opacity="0.5"/>
    {/* Slight jowl / age */}
    <path d="M18 30 Q16 34 18 37" fill="none" stroke="#b07040" strokeWidth="0.6" opacity="0.35"/>
    <path d="M36 30 Q38 34 36 37" fill="none" stroke="#b07040" strokeWidth="0.6" opacity="0.35"/>
  </svg>
);

const MENTORS = [
  { id: "grove",   name: "Grove",   full: "Andy Grove",    role: "High-Output Management",  Portrait: GrovePortrait },
  { id: "mochary", name: "Mochary", full: "Matt Mochary",  role: "Radical Transparency",     Portrait: MocharyPortrait },
  { id: "collins", name: "Collins", full: "Jim Collins",   role: "First Who, Then What",     Portrait: CollinsPortrait },
  { id: "jobs",    name: "Jobs",    full: "Steve Jobs",    role: "Simplicity as Strategy",   Portrait: JobsPortrait },
  { id: "musk",    name: "Musk",    full: "Elon Musk",     role: "First Principles",         Portrait: MuskPortrait },
  { id: "oleary",  name: "O'Leary", full: "Kevin O'Leary", role: "Signal vs. Noise",         Portrait: OLearyPortrait },
];

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M15.5 9L3 3l2.5 6-2.5 6 12.5-6z" fill="currentColor"/>
  </svg>
);

const ThinkingDots = () => (
  <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%", background: "#C8A96E",
        animation: "pulse 1.4s ease-in-out infinite",
        animationDelay: `${i * 0.2}s`
      }}/>
    ))}
  </div>
);

export default function CEOMentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [hoveredMentor, setHoveredMentor] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setStarted(true);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "No response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection issue. Try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatMessage = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>{line}{i < text.split("\n").length - 1 && <br/>}</span>
    ));

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0b07",
      display: "flex", flexDirection: "column",
      fontFamily: "'Georgia','Times New Roman',serif",
      color: "#e8dcc8", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes pulse {
          0%,80%,100%{opacity:0.2;transform:scale(0.8)}
          40%{opacity:1;transform:scale(1)}
        }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes shimmer {
          0%,100%{opacity:0.4} 50%{opacity:0.8}
        }
        .mentor-chip { transition: transform 0.2s ease, filter 0.2s ease; cursor: default; }
        .mentor-chip:hover { transform: translateY(-4px) scale(1.08); filter: drop-shadow(0 4px 12px rgba(200,169,110,0.6)); }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3a2e1e;border-radius:2px}
        textarea:focus{outline:none}
        textarea{resize:none}
      `}</style>

      {/* Ambient glow */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(200,169,110,0.07) 0%,transparent 70%)" }}/>

      {/* ── HEADER ── */}
      <div style={{
        borderBottom: "1px solid rgba(200,169,110,0.15)",
        padding: "14px 28px 16px",
        background: "rgba(13,11,7,0.94)",
        backdropFilter: "blur(14px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Title row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <div>
            <span style={{ fontSize:"14px", letterSpacing:"0.16em", color:"#C8A96E", textTransform:"uppercase" }}>
              The Mentor
            </span>
            <span style={{ fontSize:"11px", color:"#4a3e28", marginLeft:"12px", letterSpacing:"0.06em" }}>
              A composite of five minds
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",animation:"shimmer 2s infinite" }}/>
            <span style={{ fontSize:"10px", color:"#6a5a3e", letterSpacing:"0.08em" }}>READY</span>
          </div>
        </div>

        {/* Avatar row */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:"0px", position:"relative" }}>
          {MENTORS.map((m, i) => (
            <div
              key={m.id}
              className="mentor-chip"
              onMouseEnter={() => setHoveredMentor(m.id)}
              onMouseLeave={() => setHoveredMentor(null)}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", gap:"4px",
                marginLeft: i === 0 ? 0 : "-8px",
                zIndex: hoveredMentor === m.id ? 20 : (10 - i),
                position:"relative",
              }}
            >
              <m.Portrait />
              <span style={{
                fontSize:"9px", letterSpacing:"0.12em", textTransform:"uppercase",
                color: hoveredMentor === m.id ? "#C8A96E" : "#4a3e28",
                transition:"color 0.2s",
              }}>{m.name}</span>

              {/* Tooltip */}
              {hoveredMentor === m.id && (
                <div style={{
                  position:"absolute", bottom:"72px", left:"50%", transform:"translateX(-50%)",
                  background:"#1a1208", border:"1px solid rgba(200,169,110,0.35)",
                  borderRadius:"7px", padding:"8px 12px",
                  whiteSpace:"nowrap", pointerEvents:"none",
                  animation:"fadeIn 0.18s ease", zIndex:30,
                  boxShadow:"0 8px 24px rgba(0,0,0,0.6)",
                }}>
                  <div style={{ fontSize:"12px", color:"#C8A96E", letterSpacing:"0.05em" }}>{m.full}</div>
                  <div style={{ fontSize:"10px", color:"#7a6a4e", marginTop:"3px", fontStyle:"italic" }}>{m.role}</div>
                  <div style={{
                    position:"absolute", bottom:"-5px", left:"50%", transform:"translateX(-50%)",
                    width:0, height:0,
                    borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
                    borderTop:"5px solid rgba(200,169,110,0.35)",
                  }}/>
                </div>
              )}
            </div>
          ))}

          {/* Divider + hint */}
          <div style={{
            marginLeft:"22px", paddingLeft:"22px",
            borderLeft:"1px solid rgba(200,169,110,0.12)",
            alignSelf:"center", paddingBottom:"16px",
          }}>
            <p style={{ fontSize:"11px", color:"#5a4e38", lineHeight:1.7, margin:0 }}>
              Hover to meet them.<br/>
              <span style={{ color:"#3a3020" }}>Type below to begin.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 130px" }}>
        {!started ? (
          <div style={{ maxWidth:"620px", margin:"0 auto", padding:"48px 24px 0", animation:"fadeIn 0.6s ease" }}>
            <div style={{ fontSize:"11px", color:"#5a4e38", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"16px" }}>
              Your session
            </div>
            <h1 style={{
              fontSize:"clamp(26px,4vw,38px)", fontWeight:400, color:"#e8dcc8",
              lineHeight:1.2, marginBottom:"14px", letterSpacing:"-0.01em",
            }}>
              What's the problem<br/>
              <span style={{ color:"#C8A96E" }}>you haven't said out loud?</span>
            </h1>
            <p style={{ fontSize:"14px", color:"#7a6a4e", lineHeight:1.75, marginBottom:"40px", maxWidth:"480px" }}>
              The mentor doesn't flatter. Doesn't validate mediocrity. Asks what you're avoiding — then helps you move.
            </p>
            <div>
              <div style={{ fontSize:"11px", color:"#5a4e38", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"12px" }}>
                Common starting points
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {STARTER_PROMPTS.map((item, i) => (
                  <button key={i} onClick={() => sendMessage(item.prompt)} style={{
                    background:"rgba(200,169,110,0.05)", border:"1px solid rgba(200,169,110,0.15)",
                    borderRadius:"8px", padding:"14px 16px", textAlign:"left", color:"#b8a480",
                    fontSize:"13px", cursor:"pointer", lineHeight:1.5, transition:"all 0.2s", fontFamily:"inherit",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(200,169,110,0.1)"; e.currentTarget.style.borderColor="rgba(200,169,110,0.3)"; e.currentTarget.style.color="#e8dcc8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(200,169,110,0.05)"; e.currentTarget.style.borderColor="rgba(200,169,110,0.15)"; e.currentTarget.style.color="#b8a480"; }}>
                    <div style={{ fontSize:"9px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#C8A96E", marginBottom:"6px", opacity:0.7 }}>
                      {item.category}
                    </div>
                    {item.prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:"620px", margin:"0 auto", padding:"32px 24px 0" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                marginBottom:"28px", animation:"fadeIn 0.4s ease",
                display:"flex", flexDirection:"column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                {msg.role === "assistant" && (
                  <div style={{ fontSize:"10px", color:"#5a4e38", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:"8px", paddingLeft:"2px" }}>
                    The Mentor
                  </div>
                )}
                <div style={{
                  maxWidth: msg.role === "user" ? "80%" : "100%",
                  background: msg.role === "user" ? "rgba(200,169,110,0.1)" : "transparent",
                  border: msg.role === "user" ? "1px solid rgba(200,169,110,0.2)" : "none",
                  borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "0",
                  padding: msg.role === "user" ? "12px 16px" : "0",
                  fontSize:"14px", lineHeight:1.75,
                  color: msg.role === "user" ? "#c8b890" : "#d4c4a0",
                  borderLeft: msg.role === "assistant" ? "2px solid rgba(200,169,110,0.3)" : "none",
                  paddingLeft: msg.role === "assistant" ? "20px" : undefined,
                }}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ marginBottom:"28px", animation:"fadeIn 0.3s ease", borderLeft:"2px solid rgba(200,169,110,0.3)", paddingLeft:"20px" }}>
                <div style={{ fontSize:"10px", color:"#5a4e38", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:"10px" }}>The Mentor</div>
                <ThinkingDots />
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        )}
      </div>

      {/* ── INPUT ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"16px 24px 24px", background:"linear-gradient(to top,#0d0b07 60%,transparent)" }}>
        <div style={{
          maxWidth:"620px", margin:"0 auto",
          display:"flex", alignItems:"flex-end", gap:"10px",
          background:"rgba(28,20,10,0.96)", border:"1px solid rgba(200,169,110,0.2)",
          borderRadius:"12px", padding:"12px 12px 12px 18px", backdropFilter:"blur(12px)",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height="auto";
              e.target.style.height=Math.min(e.target.scrollHeight,140)+"px";
            }}
            onKeyDown={handleKey}
            placeholder="What's the real problem?"
            rows={1}
            style={{
              flex:1, background:"transparent", border:"none", color:"#e8dcc8",
              fontSize:"14px", lineHeight:1.6, fontFamily:"inherit",
              maxHeight:"140px", overflow:"auto", caretColor:"#C8A96E",
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width:"36px", height:"36px", borderRadius:"8px", border:"none",
            background: input.trim() && !loading ? "#C8A96E" : "rgba(200,169,110,0.12)",
            color: input.trim() && !loading ? "#0d0b07" : "#4a3e28",
            cursor: input.trim() && !loading ? "pointer" : "default",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s", flexShrink:0,
          }}>
            <SendIcon />
          </button>
        </div>
        <div style={{ maxWidth:"620px", margin:"8px auto 0", textAlign:"center", fontSize:"11px", color:"#2e2418", letterSpacing:"0.06em" }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

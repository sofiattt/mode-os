import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#F5F2ED", bgCard:"#FFFFFF",
  ink:"#0F0C0A", inkWarm:"#6B3E1E", inkSoft:"#A66C40",
  tint:"#FBF0E4", tintBorder:"#E2BC96",
  sub:"#5C4F44", muted:"#A09080", border:"#E0D8CE",
  sh:"0 1px 3px rgba(15,12,10,0.07), 0 3px 12px rgba(15,12,10,0.04)",
  shMd:"0 2px 10px rgba(15,12,10,0.09), 0 8px 28px rgba(15,12,10,0.06)",
};

// ─── LOGO COMPONENTS ─────────────────────────────────────────────────────────

// ─── LANE BAR COMPONENT — mirrors the logo's visual language ─────────────────
// state: "focus" | "active" | "dormant"
function LaneBar({ lane, state="active", onClick, dark=false }) {
  const styles = {
    focus: {
      bar:    dark ? "rgba(166,108,64,0.85)" : T.inkSoft,
      bg:     dark ? "rgba(166,108,64,0.12)" : T.tint,
      border: dark ? "rgba(166,108,64,0.25)" : T.tintBorder,
      text:   dark ? "#E8C89A"              : T.inkWarm,
      dot:    true,
      opacity: 1,
    },
    active: {
      bar:    dark ? "rgba(237,232,225,0.9)" : T.ink,
      bg:     dark ? "rgba(255,255,255,0.06)" : "#fff",
      border: dark ? "rgba(255,255,255,0.12)" : T.border,
      text:   dark ? "#EDE8E1"               : T.ink,
      dot:    false,
      opacity: 1,
    },
    dormant: {
      bar:    dark ? "rgba(237,232,225,0.2)" : "rgba(15,12,10,0.18)",
      bg:     dark ? "rgba(255,255,255,0.03)" : T.bg,
      border: dark ? "rgba(255,255,255,0.06)" : T.border,
      text:   dark ? "rgba(237,232,225,0.35)" : T.muted,
      dot:    false,
      opacity: dark ? 0.6 : 0.55,
    },
  }[state] || styles?.active;

  const s = styles[state] || {
    bar: T.muted, bg: T.bg, border: T.border, text: T.muted, dot: false, opacity: 0.5
  };

  const barW = state === "focus" ? "75%" : state === "active" ? "100%" : "82%";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        opacity: s.opacity,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s",
        position: "relative",
      }}
    >
      {/* The bar indicator — mirrors the logo mark */}
      <div style={{ width: 28, flexShrink: 0, display: "flex", alignItems: "center", position: "relative" }}>
        <div style={{
          height: 3,
          width: barW,
          borderRadius: 2,
          background: s.bar,
          transition: "width 0.3s",
        }}/>
        {/* Dot — only on focus state */}
        {s.dot && (
          <div style={{
            width: 9, height: 9,
            borderRadius: "50%",
            background: s.bar,
            border: `2px solid ${dark ? "#111" : T.bgCard}`,
            position: "absolute",
            right: -2,
            flexShrink: 0,
          }}/>
        )}
      </div>

      {/* Emoji + Label */}
      <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{lane.emoji}</span>
      <span style={{
        fontSize: 13,
        color: s.text,
        fontWeight: state === "focus" ? 600 : state === "active" ? 500 : 400,
        lineHeight: 1,
      }}>{lane.label}</span>

      {/* Focus badge */}
      {state === "focus" && (
        <span style={{
          marginLeft: "auto",
          fontSize: 9,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: dark ? "rgba(166,108,64,0.6)" : T.inkSoft,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          flexShrink: 0,
        }}>Focus</span>
      )}
    </div>
  );
}

function IconMark({ size=32, variant="dark" }) {
  const configs = {
    dark:    { bg:"#0F0C0A", bar1:"#EDE8E1", bar2:"#A66C40", bar3:"rgba(237,232,225,0.22)", dot:"#A66C40", dotInner:"#0F0C0A", border:null },
    warm:    { bg:"#6B3E1E", bar1:"#FBF0E4", bar2:"#E2BC96", bar3:"rgba(251,240,228,0.22)", dot:"#E2BC96", dotInner:"#6B3E1E", border:null },
    outline: { bg:"transparent", bar1:"#0F0C0A", bar2:"#A66C40", bar3:"rgba(15,12,10,0.15)", dot:"#A66C40", dotInner:"#F5F2ED", border:"#E0D8CE" },
    card:    { bg:"#1E1A16", bar1:"#EDE8E1", bar2:"#A66C40", bar3:"rgba(237,232,225,0.18)", dot:"#A66C40", dotInner:"#1E1A16", border:"rgba(166,108,64,0.2)" },
  };
  const c = configs[variant] || configs.dark;
  // viewBox is always 48×48 — SVG scales to `size` automatically.
  // All coordinates are within 0–48 so nothing clips at any render size.
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display:"block", flexShrink:0 }}>
      <rect width="48" height="48" rx="11" fill={c.bg} stroke={c.border||"none"} strokeWidth={c.border?1:0}/>
      {/* Bar 1 — full width — Active lane */}
      <rect x="12" y="13" width="24" height="3" rx="1.5" fill={c.bar1}/>
      {/* Bar 2 — medium — Focus lane (with decision dot) */}
      <rect x="12" y="22" width="18" height="3" rx="1.5" fill={c.bar2}/>
      {/* Bar 3 — faded — Dormant lane */}
      <rect x="12" y="31" width="21" height="3" rx="1.5" fill={c.bar3}/>
      {/* Dot — the mode decision point */}
      <circle cx="33" cy="23.5" r="3" fill={c.dot}/>
      <circle cx="33" cy="23.5" r="1.2" fill={c.dotInner}/>
    </svg>
  );
}

function LogoLockup({ iconVariant="dark", nameColor, domainColor, size="md" }) {
  const sizes = { sm:{icon:24,name:15,domain:7,gap:8}, md:{icon:32,name:19,domain:8,gap:10}, lg:{icon:44,name:26,domain:9,gap:13} };
  const s = sizes[size]||sizes.md;
  const nc = nameColor || T.ink;
  const dc = domainColor || T.muted;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:s.gap }}>
      <IconMark size={s.icon} variant={iconVariant}/>
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:s.name, fontWeight:400, letterSpacing:0.5, color:nc, lineHeight:1.05, display:"block" }}>Mode OS</span>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:s.domain, letterSpacing:3, color:dc, textTransform:"uppercase", lineHeight:1, display:"block", marginTop:2 }}>modeos.io</span>
      </div>
    </div>
  );
}

function ShareCardLogo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
      <IconMark size={16} variant="card"/>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:5, color:"rgba(166,108,64,0.3)", textTransform:"uppercase" }}>Mode OS</span>
    </div>
  );
}

function CalloutAttribution() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
      <IconMark size={14} variant="card"/>
      <span style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"rgba(237,232,225,0.2)" }}>Mode OS · modeos.io</span>
    </div>
  );
}

const MODES = {
  build:     { id:"build",     label:"Build Mode",     emoji:"🔥", moodColor:"#C0522A", moodBg:"#FFF3EE", moodBorder:"#F2B89A", callouts:["You're not stuck — you're inconsistent.","You keep restarting instead of building.","Momentum is your missing piece, not clarity."], truth:"You don't need more ideas. You need output.", behavior:"This week is about output. Ship something. Stop perfecting.", stop:"Overthinking, tweaking, restarting from scratch." },
  stabilize: { id:"stabilize", label:"Stabilize Mode", emoji:"⚙️", moodColor:"#2B5FA0", moodBg:"#EDF3FB", moodBorder:"#A8C4E8", callouts:["You don't need a new path — you need discipline.","You're leaking energy maintaining chaos.","What you have could work… if you actually ran it."], truth:"Your problem isn't growth — it's structure.", behavior:"This week is about consistency. Fix one broken thing. Make it repeatable.", stop:"Chasing new ideas before fixing what's broken." },
  pivot:     { id:"pivot",     label:"Pivot Mode",     emoji:"🌀", moodColor:"#6B3FA0", moodBg:"#F5F0FC", moodBorder:"#C8A8E8", callouts:["You already know this isn't working.","You're delaying a shift that needs to happen.","Comfort is keeping you stuck."], truth:"You've outgrown your current direction.", behavior:"This week is about testing new directions. Try one. Drop one.", stop:"Forcing strategies that have already stopped working." },
  focus:     { id:"focus",     label:"Focus Mode",     emoji:"🎯", moodColor:"#1A6E4A", moodBg:"#ECF8F2", moodBorder:"#9ED4BC", callouts:["You're busy, but not effective.","Too many lanes = no real progress.","You don't need more time — you need fewer priorities."], truth:"You don't have a time problem. You have a priority problem.", behavior:"This week is about one thing. Pick it. Ignore the rest. Everything else waits.", stop:"Running multiple lanes at full speed simultaneously." },
  expand:    { id:"expand",    label:"Expand Mode",    emoji:"📡", moodColor:"#1A5080", moodBg:"#EDF5FB", moodBorder:"#9CC4DC", callouts:["You're ready for more — you're just hesitating.","Your work isn't the problem. Your visibility is.","You've outgrown playing small."], truth:"You're playing smaller than your current capacity.", behavior:"This week is about visibility. Put your work in more rooms. Be seen.", stop:"Hiding, over-refining, waiting until it's perfect." },
  refine:    { id:"refine",    label:"Refine Mode",    emoji:"✦",  moodColor:"#6B5010", moodBg:"#FAF6EC", moodBorder:"#D8C480", callouts:["You're doing enough — it's just not sharp yet.","This works… but it's not compelling.","Your next level is in refinement, not expansion."], truth:"You don't need more — you need better.", behavior:"This week is about quality. Make one thing undeniably better.", stop:"Adding new ideas before tightening what already exists." },
  rest:      { id:"rest",      label:"Rest Mode",      emoji:"🌙", moodColor:"#3A4A6A", moodBg:"#EEF1F8", moodBorder:"#A8B4D0", callouts:["You're not lazy — you're exhausted.","Rest isn't a reward. It's a requirement.","Pushing harder right now will backfire."], truth:"You can't build well from exhaustion.", behavior:"This week is about recovery. Cut your load in half. Let yourself breathe.", stop:"Forcing productivity. Guilt-driven work." },
};
const MODE_PRIORITY = ["rest","pivot","focus","stabilize","build","refine","expand"];

// Default tasks used immediately while AI loads (or if AI fails)
const FALLBACK_TASKS = {
  deep: {
    build:     [{action:"Define the one thing you're shipping this week. Write it down.",time:"20 min",impact:"Clarity on your target"},{action:"Block 90 minutes daily for your primary lane only. Guard it.",time:"90 min",impact:"Consistent output"},{action:"Create one piece of work and publish it — no perfecting.",time:"2 hrs",impact:"Momentum"},{action:"Remove three things from your list that don't move the needle.",time:"20 min",impact:"Less noise, more focus"},{action:"Review what you built this week. Decide what to repeat.",time:"30 min",impact:"Build on momentum"}],
    stabilize: [{action:"Pick one income stream and define exactly what 'consistent' looks like.",time:"30 min",impact:"Clear target"},{action:"Set fixed working hours this week. Stick to them.",time:"Daily",impact:"Structure"},{action:"Fix one broken system — payment, delivery, or communication.",time:"1 hr",impact:"Less chaos"},{action:"Track your income and activity for this week. Write it down.",time:"15 min",impact:"Visibility"},{action:"Identify one thing you keep delaying. Do it today.",time:"1 hr",impact:"Unstick yourself"}],
    pivot:     [{action:"List 3 new directions you're curious about. No commitment needed.",time:"30 min",impact:"Exploration"},{action:"Talk to one person working in a space you're considering.",time:"45 min",impact:"Real data"},{action:"Test one small idea publicly — a post, a pitch, a conversation.",time:"1 hr",impact:"Signal"},{action:"Drop one thing that clearly isn't working anymore.",time:"20 min",impact:"Energy back"},{action:"Write down what 'success' would look like in 6 months.",time:"30 min",impact:"Direction"}],
    focus:     [{action:"Pick one lane. Write its name down. That's your only priority.",time:"15 min",impact:"Decision made"},{action:"Block 2 hours daily for your focus lane. Put it in your calendar.",time:"Daily",impact:"Protected time"},{action:"List everything competing for your attention. Pause or drop 2 of them.",time:"30 min",impact:"Less dilution"},{action:"Define one measurable outcome for your focus lane this week.",time:"20 min",impact:"Clear goal"},{action:"End each day by checking: did you work on your focus lane?",time:"5 min",impact:"Accountability loop"}],
    expand:    [{action:"Share your work in one new place — a community, DM, or platform.",time:"45 min",impact:"New eyes"},{action:"Reach out to 2 potential collaborators, clients, or partners.",time:"1 hr",impact:"Opportunity"},{action:"Post 3–5 times this week. Show what you're working on.",time:"Daily",impact:"Visibility"},{action:"Increase your prices or output volume by 20%.",time:"1 hr",impact:"Growth"},{action:"Track one growth metric daily: followers, leads, revenue, reach.",time:"5 min",impact:"Signal"}],
    refine:    [{action:"Audit your strongest piece of work. Find the weakest part. Fix it.",time:"1 hr",impact:"Quality up"},{action:"Get feedback from 2 people you trust. Ask what's missing.",time:"45 min",impact:"Honest signal"},{action:"Rewrite or rework one key asset — portfolio, offer, or page.",time:"2 hrs",impact:"Sharper positioning"},{action:"Study one competitor or peer. Note what they do better.",time:"30 min",impact:"Perspective"},{action:"Remove one thing from your work that dilutes the quality.",time:"20 min",impact:"Clarity"}],
    rest:      [{action:"Cut your workload in half today. Actually. Not metaphorically.",time:"15 min",impact:"Breathing room"},{action:"Protect your sleep this week. No screens 30 min before bed.",time:"Daily",impact:"Recovery"},{action:"Do one light creative thing with zero pressure — sketch, write, explore.",time:"30 min",impact:"Joy without stakes"},{action:"Write what you're grateful for right now. Just 3 things.",time:"10 min",impact:"Perspective"},{action:"Identify one pressure you can release this week. Release it.",time:"20 min",impact:"Mental space"}],
  },
  light: {
    build:     [{action:"Open your project. Do one small thing. Close it.",time:"15 min",impact:"Break the barrier"},{action:"Set a timer. Work for 15 minutes. Stop when it rings.",time:"15 min",impact:"Momentum"},{action:"Share one thing you made — doesn't need to be perfect.",time:"10 min",impact:"Visibility"},{action:"Write one sentence about what you're building and why.",time:"5 min",impact:"Clarity"}],
    stabilize: [{action:"Write down one thing that's messy. Fix just that one thing.",time:"15 min",impact:"One less thing leaking"},{action:"Do the one task you've been avoiding. Just start it.",time:"15 min",impact:"Progress"},{action:"Set one consistent rule for this week. Keep it.",time:"10 min",impact:"Structure"},{action:"Review what you earned this week. Write the number down.",time:"10 min",impact:"Awareness"}],
    pivot:     [{action:"Write down one direction you've been curious about.",time:"10 min",impact:"Name it"},{action:"Send one message to someone in a space you're exploring.",time:"15 min",impact:"Connection"},{action:"Drop one thing that isn't working. Today.",time:"10 min",impact:"Energy back"},{action:"Spend 15 minutes researching one new path. No commitment.",time:"15 min",impact:"Data"}],
    focus:     [{action:"Write the name of your one focus lane. Put it somewhere visible.",time:"5 min",impact:"Decision"},{action:"Work on your focus lane for 15 minutes. Nothing else.",time:"15 min",impact:"Momentum"},{action:"Say no to one distraction today.",time:"5 min",impact:"Protected energy"},{action:"Check in: did you work on your focus lane today?",time:"2 min",impact:"Accountability"}],
    expand:    [{action:"Post something about your work. Keep it honest and simple.",time:"10 min",impact:"Visibility"},{action:"Send one message to a potential client or collaborator.",time:"15 min",impact:"Opportunity"},{action:"Share your work in one community or group.",time:"10 min",impact:"New eyes"},{action:"Tell one person what you're working on.",time:"5 min",impact:"Word of mouth"}],
    refine:    [{action:"Find the weakest part of your work. Improve just that part.",time:"15 min",impact:"Quality up"},{action:"Ask one person for honest feedback on your work.",time:"15 min",impact:"Real signal"},{action:"Remove one thing from your work that doesn't need to be there.",time:"10 min",impact:"Clarity"},{action:"Read or watch one piece of work by someone you admire.",time:"15 min",impact:"Raise the bar"}],
    rest:      [{action:"Do nothing for 15 minutes. Put your phone down.",time:"15 min",impact:"Reset"},{action:"Go outside. Walk without purpose.",time:"15 min",impact:"Mental space"},{action:"Write 3 things that are going well — even small ones.",time:"5 min",impact:"Perspective"},{action:"Sleep earlier tonight. That's the whole task.",time:"–",impact:"Recovery"}],
  },
};

const LANE_PRESETS = [
  { id:"career",     label:"Career / Job",       emoji:"🏢" },
  { id:"business",   label:"Business / Income",  emoji:"💼" },
  { id:"creative",   label:"Creative Work",       emoji:"🎨" },
  { id:"content",    label:"Content / Brand",     emoji:"📱" },
  { id:"learning",   label:"Learning / Skill",    emoji:"📚" },
  { id:"sideproject",label:"Side Project",        emoji:"⚡" },
  { id:"personal",   label:"Personal Life",       emoji:"🌱" },
  { id:"founder",    label:"Founder",             emoji:"🚀" },
  { id:"freelance",  label:"Freelance",           emoji:"💻" },
  { id:"consulting", label:"Consulting",          emoji:"🤝" },
  { id:"creator",    label:"Creator",             emoji:"✨" },
  { id:"educator",   label:"Educator",            emoji:"🎓" },
];
function getLane(id, customLanes=[]) {
  return LANE_PRESETS.find(l=>l.id===id) || (customLanes||[]).find(l=>l.id===id) || { id, label:id, emoji:"◈" };
}

const QS = [
  { id:"q1", question:"How many things are you actively working on right now?", options:[{label:"1 thing",scores:{build:2,stabilize:1}},{label:"2 things",scores:{build:1,refine:1}},{label:"3 things",scores:{focus:2}},{label:"4 or more",scores:{focus:3}}]},
  { id:"q2", question:"Are you earning consistently from any of it?", options:[{label:"No income yet",scores:{build:2}},{label:"Small / inconsistent",scores:{stabilize:2}},{label:"Yes — stable income",scores:{expand:2}}]},
  { id:"q3", question:"How clear do you feel about your direction?", options:[{label:"Very clear",scores:{build:1,expand:1}},{label:"Somewhat clear",scores:{refine:2}},{label:"Honestly confused",scores:{pivot:3}}]},
  { id:"q4", question:"How do you feel about where you are right now?", options:[{label:"Excited but overwhelmed",scores:{focus:2}},{label:"Drained / exhausted",scores:{rest:3}},{label:"Bored / unfulfilled",scores:{pivot:2}},{label:"Motivated and moving",scores:{build:1,expand:1}}]},
  { id:"q5", question:"What's your biggest issue this week?", options:[{label:"I can't stay consistent",scores:{build:3}},{label:"I'm doing too many things",scores:{focus:3}},{label:"Nothing is working",scores:{pivot:3}},{label:"Things are messy and unstable",scores:{stabilize:3}},{label:"I need more visibility / growth",scores:{expand:2}},{label:"My work isn't sharp enough",scores:{refine:3}},{label:"I'm burnt out",scores:{rest:3}}]},
  { id:"q6", question:"What are you most focused on right now?", options:[{label:"Starting / building something new",scores:{build:2}},{label:"Making things more stable",scores:{stabilize:2}},{label:"Exploring new paths",scores:{pivot:2}},{label:"Cutting distractions",scores:{focus:2}},{label:"Growing my audience or income",scores:{expand:2}},{label:"Improving quality",scores:{refine:2}},{label:"Resting and recovering",scores:{rest:2}}]},
  { id:"q7", question:"Your energy level this week?", options:[{label:"High — I'm ready",scores:{build:1,expand:1}},{label:"Medium — steady",scores:{refine:1}},{label:"Low — running on empty",scores:{rest:3}}]},
];
const CHECK_IN_QS = [
  { id:"c1", question:"Did you follow through this week?", options:["Yes, mostly","Somewhat","Not really"] },
  { id:"c2", question:"Do you feel clearer or more scattered?", options:["Clearer","About the same","More scattered"] },
  { id:"c3", question:"Do you want to stay in this mode?", options:["Yes, keep it","Not sure","No — something shifted"] },
];
function calcMode(answers) {
  const scores={}; Object.keys(MODES).forEach(k=>scores[k]=0);
  answers.forEach(({qId,optIdx})=>{ const q=QS.find(q=>q.id===qId); if(!q)return; const opt=q.options[optIdx]; if(!opt)return; Object.entries(opt.scores).forEach(([k,v])=>{scores[k]=(scores[k]||0)+v;}); });
  const max=Math.max(...Object.values(scores)); const tied=Object.keys(scores).filter(k=>scores[k]===max);
  const modeId = tied.length===1 ? tied[0] : (MODE_PRIORITY.find(m=>tied.includes(m))||"build");
  return modeId;
}
// Returns full score breakdown for "Why this mode?" transparency
function calcModeScores(answers) {
  const scores={}; Object.keys(MODES).forEach(k=>scores[k]=0);
  answers.forEach(({qId,optIdx})=>{ const q=QS.find(q=>q.id===qId); if(!q)return; const opt=q.options[optIdx]; if(!opt)return; Object.entries(opt.scores).forEach(([k,v])=>{scores[k]=(scores[k]||0)+v;}); });
  return scores;
}

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
// Initialised lazily so the app still renders if env vars aren't set yet
function getSupabase() {
  // CRA uses process.env.REACT_APP_* — Vite would use import.meta.env.VITE_*
  const url = (typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_URL)
    || window.__SUPABASE_URL__ || "";
  const key = (typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY)
    || window.__SUPABASE_KEY__ || "";
  if (!url || !key) return null;
  try {
    if (window._sbClient) return window._sbClient;
    if (window.supabase?.createClient) {
      window._sbClient = window.supabase.createClient(url, key);
      return window._sbClient;
    }
    return null;
  } catch { return null; }
}

// db — localStorage first (always reliable), Supabase as cloud sync bonus
const db = {
  _lsKey: (email, k) => `mos_${email.toLowerCase().replace(/[^a-z0-9]/g,"_")}_${k}`,

  async get(email, k) {
    // Try Supabase first if available
    const sb = getSupabase();
    if (sb) {
      try {
        const { data } = await sb.from("user_data").select("value").eq("email", email).eq("key", k).maybeSingle();
        if (data?.value !== undefined && data?.value !== null) return data.value;
      } catch {}
    }
    // Always fall back to localStorage
    try { const v = localStorage.getItem(db._lsKey(email,k)); return v ? JSON.parse(v) : null; } catch { return null; }
  },

  async set(email, k, v) {
    // Always save to localStorage (guaranteed to work)
    try { localStorage.setItem(db._lsKey(email,k), JSON.stringify(v)); } catch {}
    // Also sync to Supabase if available
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from("user_data").upsert({ email, key: k, value: v, updated_at: new Date().toISOString() }, { onConflict: "email,key" });
      } catch {}
    }
  },

  // Migrate any existing localStorage data to Supabase for this email
  async migrate(email) {
    const sb = getSupabase(); if (!sb) return;
    for (const k of ["profile","history","week","weekHistory"]) {
      try {
        const local = localStorage.getItem(db._lsKey(email,k));
        if (!local) continue;
        const val = JSON.parse(local);
        await sb.from("user_data").upsert({ email, key: k, value: val, updated_at: new Date().toISOString() }, { onConflict: "email,key" });
      } catch {}
    }
  },
};



// ─── PATTERN INTELLIGENCE ─────────────────────────────────────────────────────
function analysePatterns(history, weekHistory, currentModeId) {
  const insights = [];
  const modeCount = {};
  const completionRates = [];

  // Count mode frequency
  history.forEach(h => {
    modeCount[h.modeId] = (modeCount[h.modeId] || 0) + 1;
  });

  // Streak detection — how many consecutive weeks in current mode
  const recent = [...history].reverse();
  let streak = 0;
  for (const h of recent) {
    if (h.modeId === currentModeId) streak++;
    else break;
  }

  // Completion pattern from weekHistory
  weekHistory.forEach(w => {
    if (w.total > 0) completionRates.push(w.done / w.total);
  });
  const avgCompletion = completionRates.length
    ? Math.round((completionRates.reduce((a,b) => a+b, 0) / completionRates.length) * 100)
    : null;
  const lastRate = completionRates.length ? Math.round(completionRates[completionRates.length-1] * 100) : null;

  // Avoidance detection — modes never used
  const usedModes = Object.keys(modeCount);
  const neverUsed = Object.keys(MODES).filter(m => !usedModes.includes(m) && m !== currentModeId);

  // Patterns we surface
  if (streak >= 3) {
    insights.push(`${streak} consecutive weeks in ${MODES[currentModeId]?.label || currentModeId}`);
  }
  if (streak >= 6) {
    insights.push(`You may be stuck — ${streak} weeks without a mode shift`);
  }
  if (avgCompletion !== null) {
    if (avgCompletion >= 75) insights.push(`Strong follow-through — ${avgCompletion}% average task completion`);
    else if (avgCompletion < 40) insights.push(`Tasks are not being completed — only ${avgCompletion}% average completion`);
  }
  if (lastRate !== null && avgCompletion !== null) {
    if (lastRate > avgCompletion + 20) insights.push("Last week was your best completion rate yet");
    if (lastRate < avgCompletion - 20) insights.push("Last week was a low follow-through week");
  }
  const mostUsed = Object.entries(modeCount).sort((a,b) => b[1]-a[1])[0];
  if (mostUsed && modeCount[mostUsed[0]] >= 3 && mostUsed[0] !== currentModeId) {
    insights.push(`You default to ${MODES[mostUsed[0]]?.label} — you've been there ${mostUsed[1]} times`);
  }
  if (neverUsed.includes("rest") && history.length >= 4) {
    insights.push("You have never taken a Rest Mode week in your entire history");
  }
  if (neverUsed.includes("pivot") && history.length >= 6) {
    insights.push("You have never entered Pivot Mode — you may be forcing something that needs to shift");
  }

  return {
    streak,
    avgCompletion,
    lastRate,
    insights,
    totalWeeks: history.length,
    modeCount,
    dominantMode: mostUsed?.[0] || currentModeId,
  };
}

// Build a memory context string to pass to the AI
function buildMemoryContext(patterns) {
  if (!patterns || patterns.totalWeeks < 2) return "No historical data yet — this is an early week.";
  const lines = [
    `Total weeks tracked: ${patterns.totalWeeks}`,
    patterns.streak > 1 ? `Current mode streak: ${patterns.streak} consecutive weeks` : null,
    patterns.avgCompletion !== null ? `Average task completion: ${patterns.avgCompletion}%` : null,
    patterns.lastRate !== null ? `Last week completion: ${patterns.lastRate}%` : null,
    ...patterns.insights,
  ].filter(Boolean);
  return lines.join("\n");
}

async function fetchStrategy(profile, modeId, patterns) {
  const mode = MODES[modeId]||MODES.build;
  const isLight = profile.focusStyle==="light";
  const laneLabels = (profile.lanes||[]).map(id=>getLane(id,profile.customLanes).label);
  const taskCount = isLight ? 4 : 5;
  const taskTime = isLight ? "10–15 min" : "30–90 min";
  const memoryContext = buildMemoryContext(patterns);
  const hasHistory = patterns && patterns.totalWeeks >= 2;

  // Reconstruct what the user actually answered
  const answerSummary = profile.answers
    ? Object.entries(profile.answers).map(([qId, optIdx]) => {
        const q = QS.find(q=>q.id===qId);
        if (!q) return null;
        const opt = q.options[Number(optIdx)];
        return opt ? `- ${q.question} → "${opt.label}"` : null;
      }).filter(Boolean).join("\n")
    : "No questionnaire data available";

  // Mode-specific focus lane selection criteria
  const laneSelectionLogic = {
    build:     "Pick the lane closest to having something shippable this week — not the most exciting, the most ready.",
    stabilize: "Pick the lane already generating traction or income, even if inconsistent — that's the one worth stabilising first.",
    pivot:     "Pick the lane they seem most genuinely curious about exploring — not the one they're committed to, the one they keep returning to.",
    focus:     "Pick the single lane most likely to generate real momentum or income this week. The others have to wait.",
    expand:    "Pick the lane with existing work or audience that's being underplayed — what's already there but not being pushed?",
    refine:    "Pick the lane where output exists but isn't compelling yet — not the weakest lane, the one most worth sharpening right now.",
    rest:      "Pick the lightest, lowest-pressure lane — something that feels like play. If none qualify, say so honestly.",
  }[modeId] || "Pick the lane most aligned with their current mode and situation.";

  const taskLogic = isLight
    ? `LIGHT FOCUS — exactly ${taskCount} tasks. Each 10–15 min MAX. One tiny concrete action. Verb-first. Feel almost too easy. No compound tasks. Example good: "Open the doc. Write one paragraph. Close it." Example bad: "Work on your portfolio for an hour."`
    : `DEEP FOCUS — exactly ${taskCount} tasks. Each 30–90 min. Specific, commanding, strategic. Verb-first. Reference their lanes and skills.`;

  const prompt = [
    `You are an opinionated career strategist for multi-passionate creatives. You have reviewed this person's full history and you have already made the decisions. You are delivering those decisions now.`,
    ``,
    `RULES — non-negotiable:`,
    `- Never say "you could" or "you might" or "consider" or "perhaps" or "one option is"`,
    `- Never present two options. You have ONE answer. Give it.`,
    `- Name the lanes directly. e.g. "Do not touch your Creator lane this week." not "some lanes may need to wait."`,
    `- Tasks are instructions, not suggestions. "Open Figma. Finish the hero section. Close it." Not "Try to work on your design."`,
    `- If their mode is Rest, say so with conviction: "Your ${mode.label} means your ${laneLabels[0]||"other lanes"} can wait. They will still be there next week."`,
    `- If they're in Focus Mode and running 4 lanes, name the lanes to pause: "Pause [lane], [lane], and [lane]. This week belongs to [focus lane]."`,
    `- Be the strategist who says what they already know but won't say to themselves.`,
    hasHistory ? `- USE THE HISTORY DATA. If they have been in the same mode for multiple weeks, call it out by name. If their completion rate is low, say so directly. This is longitudinal intelligence, not a one-off snapshot.` : "",
    ``,
    `USER PROFILE:`,
    `Name: ${profile.name}`,
    `Identity: ${profile.title||"Multi-passionate creative"}`,
    `Skills: ${(profile.skills||[]).join(", ")||"not specified"}`,
    `Portfolio lanes: ${laneLabels.join(", ")||"none set"}`,
    `Focus Style: ${isLight?"Light Focus (10-15 min tasks, momentum over depth)":"Deep Focus (30-90 min tasks, strategic execution)"}`,
    ``,
    `WHAT THEY ANSWERED THIS WEEK:`,
    answerSummary,
    ``,
    hasHistory ? `LONGITUDINAL HISTORY (use this — this is what makes you different from a quiz):` : `HISTORY: First few weeks — no pattern data yet.`,
    hasHistory ? memoryContext : "",
    ``,
    `COMPUTED DOMINANT MODE: ${mode.label}`,
    `Mode truth: ${mode.truth}`,
    `Mode directive for this week: ${mode.behavior}`,
    ``,
    `FOCUS LANE RULE — you have already decided:`,
    laneSelectionLogic,
    `Reason from their answers and skills. Do not default to list order.`,
    `The focus lane must be one of: ${laneLabels.join(" | ")||"any lane"}`,
    ``,
    `TASK RULE:`,
    taskLogic,
    hasHistory && patterns.lastRate !== null ? `TASK CALIBRATION: Last week they completed ${patterns.lastRate}% of tasks. ${patterns.lastRate < 50 ? "Make this week's tasks SIMPLER and more specific — they are over-promising and under-delivering." : patterns.lastRate === 100 ? "They crushed last week. Push harder this week." : "Keep difficulty roughly the same."}` : "",
    ``,
    `Return ONLY valid JSON — no explanation, no markdown:`,
    `{`,
    `  "callout": "One sentence. Declarative. Name their actual situation. ${hasHistory && patterns.streak >= 3 ? "They have been in " + mode.label + " for " + patterns.streak + " weeks — reference this if it reveals something." : ""} No hedging. No softening. No quotes in the output string.",`,
    `  "directive": "One sentence. A direct instruction with their mode baked in. Name the lanes if relevant. No 'you might want to'.",`,
    `  "stopDoing": "One specific behaviour to stop. Name the lane or habit directly.",`,
    `  "focusLane": "MUST be one of: ${laneLabels.join(" | ")||"any lane"}. This is the decision. Not a suggestion.",`,
    `  "focusLaneReason": "One sentence. Explain the decision. Reference their mode, their history, and their skills. Make it feel like you have been watching them for weeks.",`,
    `  "weeklyActions": [`,
    ...Array.from({length:taskCount},(_,i)=>`    { "action": "A direct instruction. Verb-first. Specific to their focus lane, mode, and skills. Name the actual thing to do.", "time": "${taskTime}", "impact": "The specific thing this unlocks." },`),
    `  ],`,
    `  "mantra": "${isLight ? "Under 8 words. A quiet permission slip. Not motivational. e.g. Small moves. Real progress." : "Under 9 words. A conviction, not a suggestion. e.g. One lane. Full attention. No excuses."}",`,
    `  "shareCallout": "First person. One sentence. Confrontational. Slightly exposing. Use their actual data. Streak: ${patterns?.streak||1} weeks. Completion: ${patterns?.avgCompletion||50}%. Make it feel seen and slightly uncomfortable — that is what gets shared."`,
    `}`,
  ].filter(s => s !== "").join("\n");

  const res = await fetch("/api/strategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1400, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  return JSON.parse((data.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
}

// Pick the best focus lane locally when AI hasn't responded yet
function weekKey(){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); return d.toISOString().slice(0,10); }

function localFocusLane(profile, modeId) {
  const lanes = (profile.lanes||[]).map(id => getLane(id, profile.customLanes));
  if (!lanes.length) return null;
  // For each mode, pick the most contextually relevant lane type
  const preferredOrder = {
    build:     ["founder","business","sideproject","creative","freelance","content","creator"],
    stabilize: ["business","freelance","consulting","career","founder","sideproject"],
    pivot:     ["creative","content","creator","learning","sideproject","founder"],
    focus:     ["founder","business","freelance","consulting","creator","content"],
    expand:    ["content","creator","business","founder","consulting","freelance"],
    refine:    ["creative","content","creator","founder","business","consulting"],
    rest:      ["personal","learning","creative","content"],
  }[modeId] || [];
  for (const preferred of preferredOrder) {
    const match = lanes.find(l => l.id === preferred);
    if (match) return match;
  }
  return lanes[0]; // fallback to first
}
function daysLeft(){ const n=new Date(),nx=new Date(n); nx.setDate(n.getDate()+(7-n.getDay())); nx.setHours(0,0,0,0); return Math.ceil((nx-n)/86400000); }
function fmtTime(s){ const m=Math.floor(s/60),sc=s%60; return m+":"+(sc<10?"0":"")+sc; }
function parseMin(str){ const m=(str||"").match(/(\d+)/); return m?parseInt(m[1]):15; }
function wkLabel(iso){ return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"}); }

const INP = { background:"#fff", border:`1px solid #E0D8CE`, borderRadius:6, padding:"13px 16px", fontSize:14, color:"#0F0C0A", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" };

function Btn({ children, onClick, variant="dark", disabled, full, sm }) {
  const v = {
    dark:  { bg:disabled?"#E0D8CE":"#0F0C0A", cl:disabled?"#A09080":"#FAF7F4", bd:"none", sh:disabled?"none":"0 2px 8px rgba(15,12,10,0.22)" },
    ghost: { bg:"transparent", cl:"#5C4F44", bd:"1px solid #E0D8CE", sh:"none" },
    soft:  { bg:"#FBF0E4", cl:"#6B3E1E", bd:"1px solid #E2BC96", sh:"none" },
    white: { bg:"#fff", cl:"#0F0C0A", bd:"none", sh:"0 2px 8px rgba(15,12,10,0.1)" },
  }[variant] || {};
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      style={{
        fontFamily: "'DM Sans',sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 4,
        fontSize: sm ? 10 : 11,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        fontWeight: 500,
        background: v.bg,
        color: v.cl,
        border: v.bd,
        padding: sm ? "8px 14px" : "14px 24px",
        width: full ? "100%" : "auto",
        boxShadow: v.sh,
        transition: "all 0.15s",
        WebkitTapHighlightColor: "rgba(0,0,0,0)",
        touchAction: "manipulation",
        minHeight: sm ? 36 : 50,
        display: "block",
        userSelect: "none",
        opacity: disabled ? 0.6 : 1,
      }}
    >{children}</button>
  );
}
function SL({ ch, color }) { return <p style={{ fontSize:9, letterSpacing:4, color:color||T.inkSoft, textTransform:"uppercase", marginBottom:8 }}>{ch}</p>; }
function StepBar({ n, total }) { return <div style={{ display:"flex", gap:6, marginBottom:32 }}>{Array.from({length:total},(_,i)=><div key={i} style={{ flex:1, height:2, borderRadius:1, background:i<n?T.inkSoft:T.border, transition:"background 0.4s" }}/>)}</div>; }

function TabBar({ tab, setTab }) {
  const tabs=[
    {id:"dashboard", icon:"◈", label:"Mode"},
    {id:"today",     icon:"◎", label:"Today"},
    {id:"week",      icon:"☐", label:"Week"},
    {id:"history",   icon:"↻", label:"Arc"},
    {id:"pulse",     icon:"⊙", label:"Pulse"},
    {id:"share",     icon:"↗", label:"Share"},
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:`1px solid ${T.border}`, display:"flex", zIndex:100, boxShadow:"0 -4px 20px rgba(15,12,10,0.07)" }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"8px 0 10px", background:"transparent", border:"none", borderTop:`2px solid ${tab===t.id?T.inkSoft:"transparent"}`, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:7, letterSpacing:"0.8px", textTransform:"uppercase", color:tab===t.id?T.inkWarm:T.muted, fontWeight:tab===t.id?500:400, transition:"all 0.15s" }}>
          <div style={{ fontSize:13, marginBottom:2 }}>{t.icon}</div>{t.label}
        </button>
      ))}
    </div>
  );
}

function TimerCard({ seconds, label, onDone, onClose }) {
  const [rem, setRem] = useState(seconds);
  const [running, setRunning] = useState(true);
  const ref = useRef(null);
  useEffect(() => {
    if(running){ ref.current=setInterval(()=>{ setRem(r=>{ if(r<=1){clearInterval(ref.current);setRunning(false);onDone&&onDone();return 0;} return r-1; }); },1000); } else clearInterval(ref.current);
    return ()=>clearInterval(ref.current);
  }, [running]);
  const pct=1-(rem/seconds), r=28, circ=2*Math.PI*r;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.8)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"36px 32px", width:280, textAlign:"center", boxShadow:"0 8px 40px rgba(0,0,0,0.3)" }}>
        <svg width={70} height={70} style={{ display:"block", margin:"0 auto 16px" }}>
          <circle cx={35} cy={35} r={r} fill="none" stroke={T.border} strokeWidth={3}/>
          <circle cx={35} cy={35} r={r} fill="none" stroke={T.inkSoft} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" transform="rotate(-90 35 35)" style={{ transition:"stroke-dashoffset 0.5s" }}/>
          <text x={35} y={40} textAnchor="middle" fontSize={14} fontFamily="'Cormorant Garamond',serif" fill={T.ink}>{fmtTime(rem)}</text>
        </svg>
        <p style={{ fontSize:13, color:T.sub, lineHeight:1.6, marginBottom:20 }}>{label}</p>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setRunning(r=>!r)} style={{ flex:1, background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:4, padding:"11px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:T.inkWarm, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{running?"Pause":"Resume"}</button>
          <button onClick={()=>{clearInterval(ref.current);onClose();}} style={{ flex:1, background:T.ink, border:"none", borderRadius:4, padding:"11px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FAF7F4", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Done ✓</button>
        </div>
      </div>
    </div>
  );
}

function SoftLogin({ onLogin }) {
  const savedEmail = (() => { try { const s=localStorage.getItem("mos_last_email"); return s?JSON.parse(s):""; } catch { return ""; } })();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const sb = getSupabase();

  const handleEmailNext = () => {
    if (!email.trim().toLowerCase().includes("@")) return;
    setStep("password"); // always show password step
  };

  const handleAuth = async () => {
    const e = email.trim().toLowerCase();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const sb = getSupabase();
    if (!sb) {
      // No Supabase — accept any password as a local passphrase, store it hashed in localStorage
      const stored = localStorage.getItem("mos_pw_" + e);
      if (!stored) {
        localStorage.setItem("mos_pw_" + e, password);
        await db.migrate(e);
      } else if (stored !== password) {
        setError("Wrong password. Try again."); setLoading(false); return;
      }
      try { localStorage.setItem("mos_last_email", JSON.stringify(e)); } catch {}
      setDone(true); setLoading(false); onLogin(e); return;
    }
    if (isNew) {
      const { error: err } = await sb.auth.signUp({ email: e, password });
      if (err) {
        if (err.message?.toLowerCase().includes("already")) { setIsNew(false); setError("Account exists. Enter your password to sign in."); }
        else setError(err.message);
        setLoading(false); return;
      }
      await db.migrate(e);
    } else {
      const { error: err } = await sb.auth.signInWithPassword({ email: e, password });
      if (err) {
        if (err.message?.toLowerCase().includes("invalid") || err.message?.toLowerCase().includes("credentials")) setError("Wrong password. Try again.");
        else { setIsNew(true); setError("No account found. Create one below."); }
        setLoading(false); return;
      }
    }
    try { localStorage.setItem("mos_last_email", JSON.stringify(e)); } catch {}
    setDone(true); setLoading(false);
    onLogin(e);
  };

  const btnStyle = (disabled) => ({
    width:"100%", background:disabled?"#E0D8CE":"#0F0C0A", color:disabled?"#A09080":"#FAF7F4",
    border:"none", borderRadius:4, padding:"15px 24px", fontSize:11, letterSpacing:"1.6px",
    textTransform:"uppercase", fontWeight:500, cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'DM Sans',sans-serif", minHeight:50, touchAction:"manipulation",
    WebkitTapHighlightColor:"rgba(0,0,0,0)", marginBottom:10,
  });

  if (done) return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"40px 28px" }}>
      <div style={{ maxWidth:380, width:"100%", textAlign:"center" }}>
        <LogoLockup size="md" iconVariant="dark"/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, color:T.ink, margin:"32px 0 12px" }}>&#10003;</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, color:T.ink, marginBottom:8 }}>{isNew ? "Account created." : "Welcome back."}</h2>
        <p style={{ fontSize:13, color:T.muted }}>{email}</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"40px 28px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(166,108,64,0.1) 0%, transparent 65%)", pointerEvents:"none" }} />
      <div style={{ maxWidth:380, width:"100%" }}>
        <LogoLockup size="md" iconVariant="dark"/>
        <p style={{ fontSize:11, color:T.muted, marginBottom:40, marginTop:4, letterSpacing:1 }}>Your career OS</p>

        {step === "email" ? (
          <>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:300, color:T.ink, marginBottom:8, lineHeight:1.2 }}>{savedEmail ? "Welcome back." : "Your email."}</h2>
            <p style={{ fontSize:14, color:T.sub, marginBottom:32, lineHeight:1.8 }}>{savedEmail ? "Sign in to pick up where you left off — your profile, tasks, and history." : "Create a free account to save your profile and access it from any device."}</p>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleEmailNext()} placeholder="your@email.com" type="email" autoCapitalize="none" autoComplete="email" style={{ ...INP, marginBottom:12, fontSize:16 }}/>
            <button type="button" onClick={handleEmailNext} disabled={!email.includes("@")} style={btnStyle(!email.includes("@"))}>Continue &#8594;</button>
            <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:6 }}>Your data syncs across all your devices.</p>
          </>
        ) : (
          <>
            <button type="button" onClick={()=>{setStep("email");setError("");}} style={{ background:"transparent", border:"none", fontSize:12, color:T.muted, cursor:"pointer", marginBottom:20, fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>&#8592; {email}</button>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:300, color:T.ink, marginBottom:8, lineHeight:1.2 }}>{isNew ? "Create a password." : "Enter your password."}</h2>
            <p style={{ fontSize:14, color:T.sub, marginBottom:20, lineHeight:1.8 }}>{isNew ? "Secures your profile so you can access it anywhere." : "Your profile, tasks, and history will load across all devices."}</p>
            {!isNew && savedEmail === email.trim().toLowerCase() && (
              <div style={{ background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:8, padding:"11px 14px", marginBottom:16 }}>
                <p style={{ fontSize:12, color:T.inkWarm, lineHeight:1.6 }}>Your existing data on this device will sync to your account automatically.</p>
              </div>
            )}
            <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAuth()} placeholder={isNew?"Create a password (min 6 chars)":"Your password"} type="password" autoComplete={isNew?"new-password":"current-password"} style={{ ...INP, marginBottom:error?8:12, fontSize:16 }}/>
            {error && <p style={{ fontSize:12, color:"#C04040", marginBottom:12, lineHeight:1.5 }}>{error}</p>}
            <button type="button" onClick={handleAuth} disabled={loading||password.length<6} style={btnStyle(loading||password.length<6)}>{loading?(isNew?"Creating account...":"Signing in..."):(isNew?"Create Account &#8594;":"Sign In &#8594;")}</button>
            <button type="button" onClick={()=>{setIsNew(!isNew);setError("");}} style={{ width:"100%", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, padding:"13px 24px", fontSize:11, letterSpacing:"1.2px", textTransform:"uppercase", color:T.sub, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", minHeight:50, touchAction:"manipulation" }}>{isNew?"Already have an account? Sign in":"New here? Create an account"}</button>
          </>
        )}
      </div>
    </div>
  );
}


function CheckInSheet({ onStay, onSwitch, onClose }) {
  const [answers, setAnswers] = useState({});
  const allDone = Object.keys(answers).length===CHECK_IN_QS.length;
  const shouldSwitch = answers.c3==="No — something shifted";
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.72)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 22px 48px", maxHeight:"70vh", overflowY:"auto" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }} />
        <SL ch="Weekly Check-In" />
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:6 }}>How did this week go?</h3>
        <p style={{ fontSize:13, color:T.sub, marginBottom:24, lineHeight:1.7 }}>3 questions. 30 seconds.</p>
        {CHECK_IN_QS.map((q,qi)=>(
          <div key={q.id} style={{ marginBottom:20 }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:500, marginBottom:10 }}>{qi+1}. {q.question}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {q.options.map((opt,oi)=>{ const sel=answers[q.id]===opt; return <div key={oi} onClick={()=>setAnswers(p=>({...p,[q.id]:opt}))} style={{ background:sel?T.tint:T.bg, border:`1.5px solid ${sel?T.tintBorder:T.border}`, borderRadius:7, padding:"11px 14px", cursor:"pointer", fontSize:13, color:sel?T.inkWarm:T.ink, transition:"all 0.15s" }}>{opt}</div>; })}
            </div>
          </div>
        ))}
        {allDone && (
          <div style={{ display:"flex", gap:10 }}>
            {shouldSwitch ? <><Btn variant="ghost" onClick={onClose}>Cancel</Btn><div style={{ flex:1 }}><Btn onClick={onSwitch} full>Switch Mode →</Btn></div></> : <div style={{ flex:1 }}><Btn onClick={()=>onStay(answers)} full>Stay in This Mode →</Btn></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function SwitchSheet({ onSave, onClose }) {
  const [answers, setAnswers] = useState({});
  const allAnswered = Object.keys(answers).length===QS.length;
  const computed = allAnswered ? calcMode(Object.entries(answers).map(([qId,optIdx])=>({qId,optIdx:Number(optIdx)}))) : null;
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.72)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 22px 48px", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }} />
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:6 }}>Switch Mode</h3>
        <p style={{ fontSize:13, color:T.sub, marginBottom:24, lineHeight:1.7 }}>Answer honestly. Gets logged.</p>
        {QS.map((q,qi)=>(
          <div key={q.id} style={{ marginBottom:22 }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:500, marginBottom:10, lineHeight:1.5 }}>{qi+1}. {q.question}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {q.options.map((opt,oi)=>{ const sel=answers[q.id]===oi; return <div key={oi} onClick={()=>setAnswers(p=>({...p,[q.id]:oi}))} style={{ background:sel?T.tint:T.bg, border:`1.5px solid ${sel?T.tintBorder:T.border}`, borderRadius:7, padding:"11px 14px", cursor:"pointer", fontSize:13, color:sel?T.inkWarm:T.ink, transition:"all 0.15s" }}>{opt.label}</div>; })}
            </div>
          </div>
        ))}
        {computed && <div style={{ background:MODES[computed].moodBg, border:`1.5px solid ${MODES[computed].moodBorder}`, borderRadius:10, padding:"14px 18px", marginBottom:20 }}><p style={{ fontSize:13, color:MODES[computed].moodColor, fontWeight:500 }}>{MODES[computed].emoji} New mode: <strong>{MODES[computed].label}</strong></p></div>}
        <div style={{ display:"flex", gap:10 }}><Btn variant="ghost" onClick={onClose}>Cancel</Btn><div style={{ flex:1 }}><Btn onClick={()=>onSave({modeId:computed,answers})} disabled={!allAnswered} full>Lock In Mode →</Btn></div></div>
      </div>
    </div>
  );
}

function FocusStyleSheet({ current, onSave, onClose }) {
  const [sel, setSel] = useState(current);
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.72)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 22px 48px" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }} />
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:6 }}>Switch Focus Style</h3>
        <p style={{ fontSize:13, color:T.sub, marginBottom:24, lineHeight:1.7 }}>This changes how your tasks are structured.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
          {[{id:"deep",label:"◆ Deep Focus",sub:"30–90 min sessions. Strategic. Structured.",detail:"Best when you can block long focused windows."},
            {id:"light",label:"◇ Light Focus",sub:"10–15 min bursts. Flexible. Momentum-based.",detail:"Best when starting feels hard. Includes a ▶ Start timer."}
          ].map(opt=>{ const s=sel===opt.id; return <div key={opt.id} onClick={()=>setSel(opt.id)} style={{ background:s?T.tint:"#fff", border:`2px solid ${s?T.tintBorder:T.border}`, borderRadius:10, padding:"16px 18px", cursor:"pointer", transition:"all 0.15s" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:400, color:s?T.inkWarm:T.ink, marginBottom:3 }}>{opt.label}</p>
            <p style={{ fontSize:13, color:s?T.inkSoft:T.muted, marginBottom:6 }}>{opt.sub}</p>
            <p style={{ fontSize:12, color:s?T.sub:T.muted, lineHeight:1.6 }}>{opt.detail}</p>
          </div>; })}
        </div>
        <div style={{ display:"flex", gap:10 }}><Btn variant="ghost" onClick={onClose}>Cancel</Btn><div style={{ flex:1 }}><Btn onClick={()=>onSave(sel)} disabled={!sel} full>Save Focus Style →</Btn></div></div>
      </div>
    </div>
  );
}

// Generate structured fields based on what the task is about
function getStructuredPrompts(action) {
  const a = (action||"").toLowerCase();
  if (a.includes("reach out") || a.includes("message") || a.includes("email") || a.includes("contact") || a.includes("collaborat"))
    return [{ key:"who",    label:"Who did you reach out to?" }, { key:"outcome", label:"What was the outcome?" }];
  if (a.includes("ship") || a.includes("publish") || a.includes("post") || a.includes("share") || a.includes("send"))
    return [{ key:"what",   label:"What did you put out?" },     { key:"response", label:"Any early response or reaction?" }];
  if (a.includes("pick") || a.includes("choose") || a.includes("decide") || a.includes("commit"))
    return [{ key:"choice", label:"What did you decide?" },      { key:"why",     label:"Why this, not the others?" }];
  if (a.includes("write") || a.includes("draft") || a.includes("doc") || a.includes("copy"))
    return [{ key:"what",   label:"What did you write?" },       { key:"next",    label:"What's the next step on it?" }];
  if (a.includes("fix") || a.includes("system") || a.includes("broken") || a.includes("organize"))
    return [{ key:"fixed",  label:"What did you fix or sort?" }, { key:"impact",  label:"How does this unblock you?" }];
  if (a.includes("drop") || a.includes("stop") || a.includes("remove") || a.includes("cut") || a.includes("pause"))
    return [{ key:"dropped",label:"What did you let go of?" },   { key:"feel",    label:"How does it feel?" }];
  if (a.includes("review") || a.includes("reflect") || a.includes("audit") || a.includes("look"))
    return [{ key:"notice", label:"What did you notice?" },      { key:"action",  label:"What's one thing to act on?" }];
  if (a.includes("rest") || a.includes("sleep") || a.includes("recover") || a.includes("break"))
    return [{ key:"how",    label:"How did you rest?" },         { key:"feel",    label:"How do you feel after?" }];
  if (a.includes("build") || a.includes("create") || a.includes("make") || a.includes("design"))
    return [{ key:"what",   label:"What did you build or make?" },{ key:"next",   label:"What's the next piece?" }];
  // Default: single guided question
  return [{ key:"note",    label:"What did you make progress on?" }];
}

function NoteSheet({ task, onSave, onClose }) {
  const fields = getStructuredPrompts(task.action);
  const [vals, setVals] = useState(() => {
    // Pre-fill from existing note if it exists
    const existing = task.note || "";
    if (fields.length === 1) return { [fields[0].key]: existing };
    // Try to split existing note by " · "
    const parts = existing.split(" · ");
    return fields.reduce((acc, f, i) => ({ ...acc, [f.key]: parts[i] || "" }), {});
  });
  const firstRef = useRef(null);
  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 120); }, []);

  const save = () => {
    const combined = fields.map(f => vals[f.key]||"").filter(Boolean).join(" · ");
    onSave(combined.trim());
    onClose();
  };
  const allEmpty = fields.every(f => !(vals[f.key]||"").trim());

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.65)", zIndex:250, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 22px 40px" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 18px" }}/>
        {/* Task */}
        <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:6 }}>Task</p>
        <p style={{ fontSize:13, color:T.sub, lineHeight:1.55, marginBottom:20, fontStyle:"italic", textDecoration:"line-through" }}>{task.action}</p>
        {/* Structured fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:18 }}>
          {fields.map((f, i) => (
            <div key={f.key}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:T.ink, marginBottom:10, lineHeight:1.3 }}>{f.label}</p>
              <textarea
                ref={i===0 ? firstRef : null}
                value={vals[f.key]||""}
                onChange={e=>setVals(p=>({...p,[f.key]:e.target.value}))}
                placeholder="Keep it short."
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey&&i===fields.length-1){ e.preventDefault(); save(); } }}
                rows={2}
                style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:8, padding:"11px 13px", fontSize:14, color:T.ink, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none", lineHeight:1.6 }}
              />
            </div>
          ))}
        </div>
        <p style={{ fontSize:11, color:T.muted, marginBottom:16 }}>Enter on last field to save · Shift+Enter for new line</p>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={onClose}>Skip</Btn>
          <div style={{ flex:1 }}><Btn onClick={save} disabled={allEmpty} full>Save →</Btn></div>
        </div>
      </div>
    </div>
  );
}

// ─── MODE SCORE DISPLAY ───────────────────────────────────────────────────────
function WhyThisMode({ answers, modeId }) {
  const [open, setOpen] = useState(false);
  if (!answers || !Object.keys(answers).length) return null;
  const scores = calcModeScores(Object.entries(answers).map(([qId,optIdx])=>({qId,optIdx:Number(optIdx)})));
  const sorted = Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const mode = MODES[modeId]||MODES.build;
  const max = sorted[0]?.[1] || 1;
  return (
    <div style={{ marginTop:10 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", color:`${mode.moodColor}88`, display:"flex", alignItems:"center", gap:6 }}>
        {open?"▲":"▼"} Why this mode?
      </button>
      {open && (
        <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
          {sorted.map(([id,score])=>{
            const m = MODES[id]; if(!m) return null;
            const pct = Math.round((score/max)*100);
            const isCurrent = id===modeId;
            return (
              <div key={id}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <p style={{ fontSize:12, color:isCurrent?mode.moodColor:T.sub, fontWeight:isCurrent?600:400 }}>{m.emoji} {m.label}</p>
                  <p style={{ fontSize:11, color:isCurrent?mode.moodColor:T.muted }}>{score} pt{score!==1?"s":""}</p>
                </div>
                <div style={{ height:3, background:"rgba(255,255,255,0.3)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:isCurrent?mode.moodColor:"rgba(255,255,255,0.4)", borderRadius:2, transition:"width 0.4s" }}/>
                </div>
              </div>
            );
          })}
          <p style={{ fontSize:10, color:`${mode.moodColor}77`, marginTop:4, lineHeight:1.6 }}>Based on your 7 questionnaire answers. Switch your mode if your situation has shifted.</p>
        </div>
      )}
    </div>
  );
}

function TaskList({ tasks, isLight, onToggle, onNote, onTimer, compact }) {
  const [noteIdx, setNoteIdx] = useState(null);
  if(!tasks.length) return null;

  const handleNoteOpen = (i) => { if(onNote) setNoteIdx(i); };
  const handleNoteSave = (i, text) => {
    onNote && onNote(i, text);
    setNoteIdx(null);
  };

  return (
    <>
      <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:compact?10:14, overflow:"hidden", boxShadow:T.shMd }}>
        {tasks.map((task,i)=>(
          <div key={i} style={{ borderBottom:i<tasks.length-1?`1px solid ${T.border}`:"none", background:task.done?"#FAFAF8":"#fff", transition:"background 0.15s" }}>
            <div style={{ display:"flex", gap:0, alignItems:"flex-start", padding:compact?"13px 16px":"16px 18px" }}>
              {/* Checkbox — tap to complete */}
              <div onClick={()=>onToggle(i)} style={{ width:24, height:24, borderRadius:6, border:`2px solid ${task.done?T.inkSoft:T.border}`, background:task.done?T.tint:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all 0.15s", boxShadow:task.done?`0 0 0 3px ${T.tintBorder}`:"none", cursor:"pointer", marginRight:14 }}>
                {task.done && <span style={{ color:T.inkWarm, fontSize:14, fontWeight:700, lineHeight:1 }}>✓</span>}
              </div>
              {/* Task body — tap to open note */}
              <div style={{ flex:1, cursor:"pointer" }} onClick={()=>handleNoteOpen(i)}>
                <p style={{ fontSize:13, color:task.done?T.muted:T.ink, textDecoration:task.done?"line-through":"none", lineHeight:1.55, marginBottom:3, fontWeight:task.done?400:500 }}>{task.action}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                  {task.time && <span style={{ fontSize:11, color:T.muted }}>{task.time}</span>}
                  {task.impact && !task.done && <span style={{ fontSize:11, color:T.inkSoft }}>→ {task.impact}</span>}
                  {!task.note && !task.done && <span style={{ fontSize:10, color:T.muted, fontStyle:"italic" }}>tap to log →</span>}
                </div>
                {/* Saved note */}
                {task.note && (
                  <div style={{ marginTop:8, background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:6, padding:"7px 10px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <p style={{ fontSize:12, color:T.inkWarm, lineHeight:1.5, flex:1, fontStyle:"italic" }}>"{task.note}"</p>
                    <span onClick={e=>{e.stopPropagation();handleNoteOpen(i);}} style={{ fontSize:10, color:T.muted, cursor:"pointer", flexShrink:0, marginTop:2 }}>edit</span>
                  </div>
                )}
                {task.noteTime && (
                  <p style={{ fontSize:10, color:T.muted, marginTop:4 }}>{new Date(task.noteTime).toLocaleDateString("en-US",{weekday:"short",hour:"2-digit",minute:"2-digit"})}</p>
                )}
              </div>
            </div>
            {isLight && !task.done && onTimer && (
              <div style={{ padding:"0 16px 12px 54px" }}>
                <button onClick={()=>onTimer(i,task)} style={{ background:T.ink, color:"#FAF7F4", border:"none", borderRadius:4, padding:"7px 14px", fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>▶ Start {task.time}</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {noteIdx !== null && (
        <NoteSheet
          task={tasks[noteIdx]}
          onSave={(text)=>handleNoteSave(noteIdx,text)}
          onClose={()=>setNoteIdx(null)}
        />
      )}
    </>
  );
}

function Wizard({ init={}, onDone, onCancel }) {
  const [s, setS] = useState(1);
  const [name, setName] = useState(init.name||"");
  const [title, setTitle] = useState(init.title||"");
  const [selLanes, setSelLanes] = useState(init.lanes||[]);
  const [customLanes, setCustomLanes] = useState(init.customLanes||[]);
  const [customIn, setCustomIn] = useState("");
  const [answers, setAnswers] = useState({});
  const isEdit = !!init.name;
  const TOTAL = isEdit ? 2 : 3;
  const pg = { fontFamily:"'DM Sans',sans-serif", background:T.bg, minHeight:"100vh", color:T.ink, padding:"48px 24px 100px", maxWidth:480, margin:"0 auto" };

  const addCustomLane = () => { const label=customIn.trim(); if(!label)return; const id="cx_"+Date.now(); setCustomLanes(p=>[...p,{id,label,emoji:"◈"}]); setSelLanes(p=>[...p,id]); setCustomIn(""); };
  const allDisplayLanes=[...LANE_PRESETS,...customLanes];
  const toggleLane = id => setSelLanes(p=>p.includes(id)?p.filter(l=>l!==id):[...p,id]);
  const allAnswered = Object.keys(answers).length===QS.length;
  const computed = allAnswered ? calcMode(Object.entries(answers).map(([qId,optIdx])=>({qId,optIdx:Number(optIdx)}))) : null;

  // Step 1 — Who are you
  if(s===1) return (
    <div style={pg}><StepBar n={1} total={TOTAL}/><SL ch={`Step 1 of ${TOTAL}`}/>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, marginBottom:6 }}>Who are you?</h2>
      <p style={{ fontSize:14, color:T.sub, marginBottom:32, lineHeight:1.8 }}>Your name and how you describe what you do.</p>
      <div style={{ marginBottom:18 }}><p style={{ fontSize:9, letterSpacing:3, color:T.inkWarm, textTransform:"uppercase", marginBottom:8 }}>Name</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sofía" style={INP}/></div>
      <div style={{ marginBottom:40 }}><p style={{ fontSize:9, letterSpacing:3, color:T.inkWarm, textTransform:"uppercase", marginBottom:8 }}>Identity</p><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Brand Strategist / Creative Director / Founder" style={INP}/><p style={{ fontSize:11, color:T.muted, marginTop:7 }}>Separate with  /  — embrace the slash</p></div>
      <div style={{ display:"flex", gap:10 }}>{onCancel&&<Btn variant="ghost" onClick={onCancel}>Cancel</Btn>}<div style={{ flex:1 }}><Btn onClick={()=>setS(2)} disabled={!name.trim()} full>Continue →</Btn></div></div>
    </div>
  );

  // Step 2 — Lanes (or done if editing)
  if(s===2) return (
    <div style={pg}><StepBar n={2} total={TOTAL}/><SL ch={`Step 2 of ${TOTAL}`}/>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, marginBottom:6 }}>Your lanes</h2>
      <p style={{ fontSize:14, color:T.sub, marginBottom:24, lineHeight:1.8 }}>Pick everything you're juggling right now.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        {allDisplayLanes.map(lane=>{ const sel=selLanes.includes(lane.id); return <div key={lane.id} onClick={()=>toggleLane(lane.id)} style={{ background:sel?T.tint:"#fff", border:`1.5px solid ${sel?T.tintBorder:T.border}`, borderRadius:8, padding:"12px 12px", cursor:"pointer", transition:"all 0.15s", boxShadow:T.sh }}>
          <div style={{ fontSize:18, marginBottom:4 }}>{lane.emoji}</div>
          <div style={{ fontSize:13, fontWeight:500, color:sel?T.inkWarm:T.ink }}>{lane.label}</div>
          {sel&&<div style={{ marginTop:6, width:16, height:2, background:T.inkSoft, borderRadius:1 }}/>}
        </div>; })}
      </div>
      <div style={{ background:"#fff", border:`1.5px dashed ${T.border}`, borderRadius:8, padding:"12px 14px", marginBottom:8, display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ fontSize:16, color:T.muted }}>+</span>
        <input value={customIn} onChange={e=>setCustomIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addCustomLane();}} placeholder="Add your own lane..." style={{ flex:1, background:"transparent", border:"none", fontSize:13, color:T.ink, fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
        {customIn.trim()&&<button onClick={addCustomLane} style={{ background:T.ink, color:"#FAF7F4", border:"none", borderRadius:3, padding:"6px 12px", fontSize:10, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Add</button>}
      </div>
      {selLanes.length>0&&<p style={{ fontSize:11, color:T.muted, textAlign:"center", marginBottom:12 }}>{selLanes.length} lane{selLanes.length!==1?"s":""} selected</p>}
      <div style={{ display:"flex", gap:10 }}>
        <Btn variant="ghost" onClick={()=>setS(1)}>← Back</Btn>
        <div style={{ flex:1 }}>
          <Btn onClick={()=>{ if(isEdit) onDone({name,title,skills:init.skills||[],lanes:selLanes,customLanes}); else setS(3); }} disabled={selLanes.length===0} full>{isEdit?"Save →":"Continue →"}</Btn>
        </div>
      </div>
    </div>
  );

  // Step 3 — Mode questions (new users only)
  return (
    <div style={{...pg, paddingBottom:100}}><StepBar n={3} total={3}/><SL ch="Step 3 of 3 — Find Your Mode"/>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:300, marginBottom:6 }}>Be honest.</h2>
      <p style={{ fontSize:14, color:T.sub, marginBottom:36, lineHeight:1.8 }}>7 questions. The more honest, the sharper your result.</p>
      {QS.map((q,qi)=>(
        <div key={q.id} style={{ marginBottom:26 }}>
          <p style={{ fontSize:14, color:T.ink, fontWeight:500, marginBottom:12, lineHeight:1.6 }}>{qi+1}. {q.question}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.options.map((opt,oi)=>{ const sel=answers[q.id]===oi; return <div key={oi} onClick={()=>setAnswers(p=>({...p,[q.id]:oi}))} style={{ background:sel?T.tint:"#fff", border:`1.5px solid ${sel?T.tintBorder:T.border}`, borderRadius:8, padding:"12px 16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, transition:"all 0.15s", boxShadow:sel?"0 2px 6px rgba(166,108,64,0.12)":T.sh }}>
              <span style={{ fontSize:13, color:sel?T.inkWarm:T.ink, fontWeight:sel?500:400 }}>{opt.label}</span>
              <div style={{ width:8, height:8, borderRadius:"50%", background:sel?T.inkSoft:"transparent", border:`1.5px solid ${sel?T.inkSoft:T.border}`, flexShrink:0 }}/>
            </div>; })}
          </div>
        </div>
      ))}
      {computed&&<div style={{ background:MODES[computed].moodBg, border:`1.5px solid ${MODES[computed].moodBorder}`, borderRadius:10, padding:"14px 18px", marginBottom:20 }}><p style={{ fontSize:13, color:MODES[computed].moodColor, fontWeight:500 }}>{MODES[computed].emoji} Your mode: <strong>{MODES[computed].label}</strong></p></div>}
      <div style={{ display:"flex", gap:10 }}>
        <Btn variant="ghost" onClick={()=>setS(2)}>← Back</Btn>
        <div style={{ flex:1 }}>
          <Btn onClick={()=>onDone({name,title,skills:[],lanes:selLanes,customLanes,answers,modeId:computed||"build",focusStyle:"deep"})} disabled={!allAnswered} full>Enter Mode OS →</Btn>
        </div>
      </div>
    </div>
  );
}

  // (wizard steps now defined inline above)

  return null; // handled above
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ profile, strategy, stratLoading, weekData, onUpdateWeek, onSwitch, onEdit, onCheckIn, onFocusStyleChange, patterns }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const isLight = profile.focusStyle==="light";
  const tasks = weekData?.tasks||[];
  const done = tasks.filter(t=>t.done).length;
  const calloutText = strategy?.callout||mode.callouts[0];
  const [timer, setTimer] = useState(null);

  // Only seed tasks from AI — no jarring fallback swap
  useEffect(() => {
    if (strategy?.weeklyActions?.length) {
      const aiTasks = strategy.weeklyActions.slice(0,isLight?4:5).map(a=>({...a,done:false}));
      onUpdateWeek(w => ({ ...(w||{}), week:weekKey(), tasks:aiTasks }));
    }
  }, [strategy]);

  const toggleTask = i => onUpdateWeek({...weekData, tasks:tasks.map((t,idx)=>idx===i?{...t,done:!t.done}:t)});
  const noteTask = (i, text) => onUpdateWeek({...weekData, tasks:tasks.map((t,idx)=>idx===i?{...t,note:text,noteTime:new Date().toISOString()}:t)});
  const hot = (profile.lanes||[]).map(id=>getLane(id,profile.customLanes));

  return (
    <div style={{ padding:"0 0 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>

      {/* Nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 20px 0" }}>
        <LogoLockup size="sm" iconVariant="dark"/>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Tappable focus style badge */}
          <button onClick={onFocusStyleChange} style={{ fontSize:10, color:T.inkSoft, background:T.tint, border:`1px solid ${T.tintBorder}`, padding:"5px 12px", borderRadius:20, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
            {isLight?"◇ Light":"◆ Deep"} ↕
          </button>
          <Btn variant="ghost" onClick={onEdit} sm>Edit</Btn>
        </div>
      </div>

      {/* 1. CALLOUT — viral hook */}
      <div style={{ margin:"14px 20px 0", background:T.ink, borderRadius:14, padding:"28px 26px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.025)", pointerEvents:"none" }}/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:400, color:"#EDE8E1", lineHeight:1.4, marginBottom:14 }}>{calloutText}</p>
        {/* Accent rule — visual pause after the sting */}
        <div style={{ height:1, background:"rgba(255,255,255,0.08)", marginBottom:12 }}/>
        <CalloutAttribution/>
      </div>

      {/* 2. DOMINANT MODE */}
      <div style={{ margin:"10px 20px 0", background:mode.moodBg, border:`2px solid ${mode.moodBorder}`, borderRadius:14, padding:"20px 22px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div>
            <p style={{ fontSize:9, letterSpacing:3, color:`${mode.moodColor}99`, textTransform:"uppercase", marginBottom:6 }}>Dominant Mode</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:400, color:mode.moodColor, lineHeight:0.9, letterSpacing:-0.5 }}>{mode.label}</p>
          </div>
          <Btn variant="ghost" onClick={onSwitch} sm>Switch →</Btn>
        </div>
        <p style={{ fontSize:14, color:mode.moodColor, fontWeight:700, lineHeight:1.5, marginBottom:strategy&&!stratLoading?12:0, marginTop:10 }}>{mode.behavior}</p>
        {strategy && !stratLoading && (
          <div style={{ background:"rgba(255,255,255,0.6)", border:`1px solid ${mode.moodBorder}`, borderRadius:8, padding:"11px 13px" }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:600, lineHeight:1.7 }}>{strategy.directive}</p>
          </div>
        )}
        <WhyThisMode answers={profile.answers} modeId={profile.modeId}/>
      </div>

      {/* 3. FOCUS LANE — decision made */}
      <div style={{ margin:"10px 20px 0", background:"#fff", border:`2px solid ${T.tintBorder}`, borderRadius:12, padding:"16px 18px", boxShadow:T.shMd }}>
        <p style={{ fontSize:9, letterSpacing:3, color:T.inkWarm, textTransform:"uppercase", marginBottom:10, fontWeight:700 }}>→ Focus Lane This Week</p>
        {(() => {
          const focusName = strategy?.focusLane || localFocusLane(profile, profile.modeId)?.label;
          if (!focusName) return (
            <div style={{ background:T.tint, borderRadius:8, padding:"10px 14px" }}>
              <p style={{ fontSize:13, color:T.inkSoft, fontStyle:"italic" }}>Add your lanes to get a focus recommendation</p>
            </div>
          );
          const fl = LANE_PRESETS.find(l=>l.label===focusName)
            || (profile.customLanes||[]).find(l=>l.label===focusName)
            || { id:"fl", label:focusName, emoji:"✦" };
          return (
            <>
              <LaneBar lane={fl} state="focus"/>
              {strategy?.focusLaneReason && (
                <p style={{ fontSize:12, color:T.sub, lineHeight:1.6, marginTop:10 }}>{strategy.focusLaneReason}</p>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
                <div style={{ width:3, height:32, background:T.inkSoft, borderRadius:2, flexShrink:0 }}/>
                <p style={{ fontSize:12, color:T.inkWarm, fontWeight:600, lineHeight:1.6 }}>
                  This is your priority this week. Everything else is secondary.
                </p>
              </div>
            </>
          );
        })()}
      </div>

      {/* 4. STOP DOING */}
      <div style={{ margin:"10px 20px 0", background:"#FFF5F5", border:`1.5px solid #F0C0C0`, borderRadius:10, padding:"13px 16px", display:"flex", gap:12 }}>
        <div style={{ width:3, minHeight:32, background:"#C04040", borderRadius:2, flexShrink:0 }}/>
        <div>
          <p style={{ fontSize:9, letterSpacing:2, color:"#C04040", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>Stop Doing This Week</p>
          <p style={{ fontSize:13, color:"#3A1010", fontWeight:600, lineHeight:1.6 }}>{strategy?.stopDoing||mode.stop}</p>
        </div>
      </div>

      {/* 5. THIS WEEK TASKS */}
      <div style={{ margin:"10px 20px 0", background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", boxShadow:T.shMd }}>
        <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:6 }}>This Week</p>
            {tasks.length>0 && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <p style={{ fontSize:14, color:done===tasks.length?"#2A7A4A":T.ink, fontWeight:600 }}>
                    {done}/{tasks.length} tasks completed{done===tasks.length?" ✓":""}
                  </p>
                  {isLight && done<tasks.length && <p style={{ fontSize:11, color:T.inkSoft, fontStyle:"italic" }}>Pick one. Start small.</p>}
                </div>
                <div style={{ height:5, background:T.bg, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(done/tasks.length)*100}%`, background:done===tasks.length?"#3A8A5A":T.inkSoft, borderRadius:3, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)" }}/>
                </div>
              </>
            )}
          </div>
        </div>
        <TaskList tasks={tasks} isLight={isLight} onToggle={toggleTask} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})} compact/>
        {isLight && tasks.length>0 && (
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}` }}>
            <button onClick={()=>onUpdateWeek({...weekData,tasks:tasks.map(t=>({...t,done:false}))})} style={{ fontSize:10, color:T.muted, background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:"1px", textTransform:"uppercase" }}>↺ Start Fresh Today</button>
          </div>
        )}
      </div>

      {/* 6. LANES — visual harmony with the logo */}
      {hot.length>0 && (
        <div style={{ margin:"10px 20px 0", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px", boxShadow:T.sh }}>
          <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:12 }}>Your Lanes</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {hot.map(l => {
              const isFocus = strategy?.focusLane === l.label;
              // Dormant = in portfolio but not in activeLanes (if profile tracks that)
              const isDormant = profile.lanes?.includes(l.id) && !(profile.activeLanes||profile.lanes||[]).includes(l.id);
              const state = isFocus ? "focus" : isDormant ? "dormant" : "active";
              return <LaneBar key={l.id} lane={l} state={state}/>;
            })}
          </div>
        </div>
      )}

      {/* 7. CORE SKILLS */}
      {profile.skills?.length>0 && (
        <div style={{ margin:"10px 20px 0", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 18px", boxShadow:T.sh }}>
          <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:10 }}>Core Skills</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {profile.skills.map((sk,i)=><span key={i} style={{ fontSize:12, color:T.sub, background:T.bg, border:`1px solid ${T.border}`, padding:"4px 11px", borderRadius:4 }}>{sk}</span>)}
          </div>
        </div>
      )}

      {/* 8. ARC INTELLIGENCE — longitudinal pattern insights */}
      {patterns && patterns.totalWeeks >= 2 && patterns.insights.length > 0 && (
        <div style={{ margin:"10px 20px 0", background:T.ink, borderRadius:12, padding:"18px 20px" }}>
          <p style={{ fontSize:9, letterSpacing:3, color:"rgba(166,108,64,0.5)", textTransform:"uppercase", marginBottom:12 }}>⊙ Your Arc — {patterns.totalWeeks} weeks tracked</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {patterns.insights.map((insight, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(166,108,64,0.5)", flexShrink:0, marginTop:7 }}/>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:300, color:"#EDE8E1", lineHeight:1.5 }}>{insight}</p>
              </div>
            ))}
          </div>
          {patterns.avgCompletion !== null && (
            <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <p style={{ fontSize:11, color:"rgba(237,232,225,0.4)" }}>Avg task completion</p>
                <p style={{ fontSize:11, color:patterns.avgCompletion>=70?"#6EC98A":"rgba(237,232,225,0.5)", fontWeight:600 }}>{patterns.avgCompletion}%</p>
              </div>
              <div style={{ height:3, background:"rgba(255,255,255,0.08)", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${patterns.avgCompletion}%`, background:patterns.avgCompletion>=70?"#3A8A5A":"rgba(166,108,64,0.6)", borderRadius:2 }}/>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mantra */}
      {strategy?.mantra && (
        <div style={{ margin:"10px 20px 0", background:T.tint, border:`1.5px solid ${T.tintBorder}`, borderRadius:10, padding:"15px 20px" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:400, color:T.inkWarm, lineHeight:1.5, fontStyle:"italic" }}>"{strategy.mantra}"</p>
        </div>
      )}

      {/* Check-in nudge */}
      {daysLeft()<=3 && tasks.length>0 && (
        <div style={{ margin:"10px 20px 0", background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:T.sh }}>
          <p style={{ fontSize:13, color:T.sub }}>Week ending soon. How did it go?</p>
          <Btn variant="soft" onClick={onCheckIn} sm>Check In →</Btn>
        </div>
      )}

      {timer && <TimerCard seconds={timer.seconds} label={timer.label} onDone={()=>{toggleTask(timer.idx);setTimer(null);}} onClose={()=>setTimer(null)}/>}
    </div>
  );
}

function ThisWeek({ profile, weekData, onUpdateWeek, strategy, onReview }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const isLight = profile.focusStyle==="light";
  const tasks = weekData?.tasks||[];
  const done = tasks.filter(t=>t.done).length;
  const dl = daysLeft();
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!weekData?.tasks || weekData.tasks.length === 0) {
      const category = inferCategory(profile.title, profile.skills);
      const fallback = getCategoryTasks(category, profile.modeId, profile.title);
      onUpdateWeek({ week:weekKey(), tasks: isLight ? fallback.slice(0,4) : fallback });
    }
  }, [profile.modeId, profile.focusStyle]);

  useEffect(() => {
    if (strategy?.weeklyActions?.length) {
      const aiTasks = strategy.weeklyActions.slice(0,isLight?4:5).map(a=>({...a,done:false}));
      onUpdateWeek(w=>({ ...(w||{}), week:weekKey(), tasks:aiTasks }));
    }
  }, [strategy]);

  const toggle = i => onUpdateWeek({...weekData, tasks:tasks.map((t,idx)=>idx===i?{...t,done:!t.done}:t)});
  const noteTask = (i, text) => onUpdateWeek({...weekData, tasks:tasks.map((t,idx)=>idx===i?{...t,note:text,noteTime:new Date().toISOString()}:t)});

  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:6 }}>
        <div><p style={{ fontSize:9, letterSpacing:4, color:T.inkSoft, textTransform:"uppercase", marginBottom:4 }}>{isLight?"◇ Light":"◆ Deep"} · Weekly Loop</p><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:300, color:T.ink }}>This Week</h2></div>
        <div style={{ textAlign:"right" }}><p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:T.inkSoft, fontWeight:300, lineHeight:1 }}>{dl}</p><p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase" }}>days left</p></div>
      </div>
      <div style={{ background:mode.moodBg, border:`1px solid ${mode.moodBorder}`, borderRadius:8, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:15 }}>{mode.emoji}</span>
        <p style={{ fontSize:12, color:mode.moodColor, fontWeight:700 }}>{mode.behavior}</p>
      </div>
      {tasks.length>0 && (
        <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 16px", marginBottom:12, boxShadow:T.sh }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <p style={{ fontSize:12, color:T.sub, fontWeight:500 }}>{done} / {tasks.length} done</p>
            <p style={{ fontSize:12, color:done===tasks.length?"#2A7A4A":T.muted, fontWeight:done===tasks.length?600:400 }}>{done===tasks.length?"✓ Week complete":tasks.length-done+" left"}</p>
          </div>
          <div style={{ height:4, background:T.bg, borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${tasks.length?(done/tasks.length)*100:0}%`, background:done===tasks.length?"#3A8A5A":T.inkSoft, borderRadius:3, transition:"width 0.35s" }}/></div>
        </div>
      )}
      <TaskList tasks={tasks} isLight={isLight} onToggle={toggle} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})}/>
      {isLight && tasks.length>0 && (
        <div style={{ marginTop:12, textAlign:"center" }}>
          <button onClick={()=>onUpdateWeek({...weekData,tasks:tasks.map(t=>({...t,done:false}))})} style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"11px 24px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>↺ Start Fresh Today</button>
          <p style={{ fontSize:11, color:T.muted, marginTop:6 }}>Fell off? No guilt. Just restart.</p>
        </div>
      )}
      {tasks.length>0 && <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:14, lineHeight:1.8 }}>Resets in {dl} day{dl!==1?"s":""} · new tasks each week</p>}
      {/* Weekly Review — show when close to end of week */}
      {dl<=2 && onReview && (
        <div style={{ margin:"16px 0 0", background:T.tint, border:`1.5px solid ${T.tintBorder}`, borderRadius:12, padding:"16px 18px" }}>
          <p style={{ fontSize:12, color:T.inkWarm, fontWeight:600, marginBottom:4 }}>Week ending soon.</p>
          <p style={{ fontSize:13, color:T.sub, lineHeight:1.7, marginBottom:14 }}>Do a quick review — what worked, what didn't — and Mode OS resets your next week automatically.</p>
          <Btn onClick={onReview} variant="soft" full>Weekly Review + Next Week Reset →</Btn>
        </div>
      )}
      {timer && <TimerCard seconds={timer.seconds} label={timer.label} onDone={()=>{toggle(timer.idx);setTimer(null);}} onClose={()=>setTimer(null)}/>}
    </div>
  );
}

function History({ history, weekHistory, weekData }) {
  const noData = !history.length && !weekHistory.length;
  // Build action log from current week's noted tasks
  const actionLog = (weekData?.tasks||[]).filter(t=>t.note).sort((a,b)=>new Date(a.noteTime)-new Date(b.noteTime));

  if(noData && !actionLog.length) return <div style={{ padding:"64px 28px", textAlign:"center", fontFamily:"'DM Sans',sans-serif" }}><p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:300, color:T.ink, marginBottom:12 }}>Your arc starts here.</p><p style={{ fontSize:14, color:T.muted, lineHeight:1.8 }}>Complete tasks and add notes — they'll appear here as your weekly log.</p></div>;
  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>

      {/* Action log — current week notes */}
      {actionLog.length>0 && (
        <div style={{ marginBottom:32 }}>
          <SL ch="This Week — Action Log"/>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:4, color:T.ink }}>What you did</h2>
          <p style={{ fontSize:13, color:T.muted, marginBottom:20, lineHeight:1.7 }}>Your notes, in your words. This is your record.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {actionLog.map((task,i)=>(
              <div key={i} style={{ background:"#fff", border:`1.5px solid ${T.tintBorder}`, borderRadius:12, padding:"16px 18px", boxShadow:T.sh }}>
                {/* What they did it on */}
                <p style={{ fontSize:10, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:6, textDecoration:"line-through" }}>{task.action}</p>
                {/* The note — prominent */}
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:400, color:T.inkWarm, lineHeight:1.6, marginBottom:8 }}>"{task.note}"</p>
                {/* Timestamp */}
                {task.noteTime && (
                  <p style={{ fontSize:11, color:T.muted }}>
                    {new Date(task.noteTime).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})} · {new Date(task.noteTime).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty log state — motivate first note */}
      {actionLog.length===0 && weekHistory.length===0 && history.length>0 && (
        <div style={{ marginBottom:32, background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"24px 20px", textAlign:"center", boxShadow:T.sh }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:T.ink, marginBottom:8 }}>No notes yet this week.</p>
          <p style={{ fontSize:13, color:T.muted, lineHeight:1.8 }}>When you tap a task and log what you did, it appears here. Your notes become your weekly record — something you can look back on.</p>
        </div>
      )}

      {/* Weekly progress */}
      {weekHistory.length>0 && (
        <div style={{ marginBottom:32 }}>
          <SL ch="Weekly Progress"/><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:20, color:T.ink }}>Week by week</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[...weekHistory].reverse().map((wk,i)=>{ const mode=MODES[wk.modeId]||MODES.build; const pct=wk.total?Math.round((wk.done/wk.total)*100):0; return (
              <div key={i} style={{ background:"#fff", border:`1px solid ${i===0?T.tintBorder:T.border}`, borderRadius:10, padding:"14px 18px", boxShadow:T.sh }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div>{i===0&&<p style={{ fontSize:8, letterSpacing:2, color:T.inkSoft, textTransform:"uppercase", marginBottom:2 }}>Current week</p>}<p style={{ fontSize:13, fontWeight:600, color:T.ink }}>Week of {wkLabel(wk.weekStart)}</p><p style={{ fontSize:12, color:mode.moodColor }}>{mode.emoji} {mode.label}</p></div>
                  <div style={{ textAlign:"right" }}><p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:pct===100?"#3A8A5A":T.inkSoft, fontWeight:300, lineHeight:1 }}>{pct}%</p><p style={{ fontSize:10, color:T.muted }}>{wk.done}/{wk.total} tasks</p></div>
                </div>
                {wk.focusLane&&<p style={{ fontSize:12, color:T.sub }}>Focus: <strong>{wk.focusLane}</strong></p>}
                <div style={{ height:3, background:T.bg, borderRadius:2, marginTop:10 }}><div style={{ height:"100%", width:`${pct}%`, background:pct===100?"#3A8A5A":T.inkSoft, borderRadius:2 }}/></div>
              </div>
            ); })}
          </div>
        </div>
      )}

      {/* Mode history */}
      {history.length>0 && (
        <div>
          <SL ch="Mode History"/><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:20, color:T.ink }}>Your career arc</h2>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:13, top:8, bottom:8, width:1, background:T.border }}/>
            {[...history].reverse().map((entry,i)=>{ const mode=MODES[entry.modeId]||MODES.build; const isNow=i===0; const date=new Date(entry.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); const dAgo=Math.floor((Date.now()-new Date(entry.date))/86400000); return (
              <div key={i} style={{ display:"flex", gap:16, marginBottom:12 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:isNow?T.ink:"#fff", border:`2px solid ${isNow?T.ink:T.border}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:isNow?10:13, color:isNow?"#fff":T.ink, zIndex:1 }}>{isNow?"●":mode.emoji}</div>
                <div style={{ flex:1, background:"#fff", border:`1px solid ${isNow?T.tintBorder:T.border}`, borderRadius:10, padding:"12px 16px", boxShadow:T.sh }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                    <div>{isNow&&<p style={{ fontSize:8, letterSpacing:2, color:T.inkSoft, textTransform:"uppercase", marginBottom:2 }}>Current</p>}<p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:400, color:mode.moodColor }}>{mode.emoji} {mode.label}</p></div>
                    <div style={{ textAlign:"right" }}><p style={{ fontSize:11, color:T.muted }}>{date}</p>{dAgo>0&&<p style={{ fontSize:10, color:T.muted }}>{dAgo}d ago</p>}</div>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARE — now always rich with profile data ────────────────────────────────
function Share({ profile, strategy, weekData }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const tasks = (weekData?.tasks||[]).filter(t=>!t.done).slice(0,3);
  const allTasks = (weekData?.tasks||[]).slice(0,3);
  const [copied, setCopied] = useState(false);
  const focusLane = strategy?.focusLane||"";
  const shareCallout = strategy?.shareCallout||mode.callouts[0];
  const mantra = strategy?.mantra||"";
  const hot = (profile.lanes||[]).map(id=>getLane(id,profile.customLanes));
  const identityChips = (profile.title||"").split("/").map(t=>t.trim()).filter(Boolean);

  const caption = [
    `"${shareCallout}"`,
    ``,`Mode: ${mode.emoji} ${mode.label}`,
    focusLane ? `Focus this week: ${focusLane}` : "",
    allTasks.length ? "\nThis week:\n" + allTasks.map(t=>"☐ "+t.action).join("\n") : "",
    mantra ? `\n✦ "${mantra}"` : "",
    `\ntracked on Mode OS → modeos.io`,
  ].filter(Boolean).join("\n");

  const copy = () => { navigator.clipboard.writeText(caption).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(()=>{}); };

  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>
      <SL ch="Share"/>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, marginBottom:6, color:T.ink }}>Your Mode Card</h2>
      <p style={{ fontSize:13, color:T.sub, marginBottom:24, lineHeight:1.7 }}>Screenshot the card. Copy the caption. 2 seconds → instant understanding.</p>

      <div style={{ background:"#0E0C0A", borderRadius:16, padding:"28px 24px", marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(166,108,64,0.1) 0%, transparent 65%)", pointerEvents:"none" }}/>

        {/* Logo */}
        <div style={{ marginBottom:16 }}><ShareCardLogo/></div>

        {/* Name */}
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:300, color:"#EDE8E1", lineHeight:1, marginBottom:10 }}>{profile.name}</p>

        {/* Identity chips */}
        {identityChips.length>0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
            {identityChips.map((t,i)=><span key={i} style={{ fontSize:11, color:"rgba(166,108,64,0.7)", background:"rgba(166,108,64,0.1)", border:"1px solid rgba(166,108,64,0.2)", padding:"3px 10px", borderRadius:20 }}>{t}</span>)}
          </div>
        )}

        <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:18 }}/>

        {/* MODE — biggest */}
        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:9, letterSpacing:3, color:"rgba(166,108,64,0.4)", textTransform:"uppercase", marginBottom:6 }}>Dominant Mode</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:46, fontWeight:400, color:"#EDE8E1", lineHeight:0.9, letterSpacing:-0.5 }}>{mode.label}</p>
        </div>

        {/* Callout */}
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:300, color:"rgba(237,232,225,0.6)", lineHeight:1.5, fontStyle:"italic", marginBottom:18 }}>{shareCallout}</p>

        <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:18 }}/>

        {/* Focus Lane — using LaneBar visual language */}
        {focusLane && (
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:9, letterSpacing:3, color:"rgba(166,108,64,0.4)", textTransform:"uppercase", marginBottom:8 }}>Focus This Week</p>
            {(() => {
              const fl = LANE_PRESETS.find(l=>l.label===focusLane)||(profile.customLanes||[]).find(l=>l.label===focusLane)||{id:"fl",label:focusLane,emoji:"✦"};
              return <LaneBar lane={fl} state="focus" dark/>;
            })()}
          </div>
        )}

        {/* All lanes with their states — visual harmony */}
        {hot.length>0 && (
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:9, letterSpacing:3, color:"rgba(166,108,64,0.4)", textTransform:"uppercase", marginBottom:8 }}>Your Lanes</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {hot.map(l => {
                const isFocus = l.label === focusLane;
                const state = isFocus ? "focus" : "active";
                return <LaneBar key={l.id} lane={l} state={state} dark/>;
              })}
            </div>
          </div>
        )}

        {/* Tasks */}
        {allTasks.length>0 && (
          <div style={{ marginBottom:mantra?16:0 }}>
            <p style={{ fontSize:9, letterSpacing:3, color:"rgba(166,108,64,0.4)", textTransform:"uppercase", marginBottom:10 }}>This Week</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {allTasks.map((t,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:16, height:16, borderRadius:4, border:"1.5px solid rgba(255,255,255,0.2)", flexShrink:0, marginTop:2, background:t.done?"rgba(166,108,64,0.3)":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {t.done&&<span style={{ color:"#E8C89A", fontSize:10 }}>✓</span>}
                  </div>
                  <p style={{ fontSize:12, color:t.done?"rgba(237,232,225,0.4)":"rgba(237,232,225,0.8)", lineHeight:1.5, textDecoration:t.done?"line-through":"none" }}>{t.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mantra && <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:14, marginTop:16 }}><p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:300, color:"rgba(166,108,64,0.6)", fontStyle:"italic" }}>✦ {mantra}</p></div>}
        <div style={{ marginTop:18, display:"flex", alignItems:"center", gap:6 }}>
          <IconMark size={14} variant="card"/>
          <span style={{ fontSize:8, letterSpacing:3, color:"rgba(255,255,255,0.12)", textTransform:"uppercase" }}>modeos.io</span>
        </div>
      </div>

      <Btn onClick={copy} full>{copied?"✓ Caption Copied!":"Copy Caption"}</Btn>
      <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:10 }}>Screenshot the card · paste the caption</p>
    </div>
  );
}

// ─── PULSE — Community Mode Feed ─────────────────────────────────────────────
function Pulse({ profile, strategy }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const [step, setStep] = useState("idle"); // idle | compose | posted
  const [customText, setCustomText] = useState("");
  const [feed, setFeed] = useState([]);
  const [modeCounts, setModeCounts] = useState({});
  const aiSuggestion = strategy?.shareCallout || mode.callouts[0];
  const focusLane = strategy?.focusLane || localFocusLane(profile, profile.modeId)?.label || "";

  const loadFeed = () => {
    const stored = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("mos_pulse_")) {
        try { stored.push(JSON.parse(localStorage.getItem(k))); } catch {}
      }
    }
    // Sort newest first
    stored.sort((a,b) => (b.ts||0) - (a.ts||0));
    setFeed(stored);
    const counts = {};
    stored.forEach(e => { counts[e.mode] = (counts[e.mode]||0) + 1; });
    setModeCounts(counts);
  };

  useEffect(() => { loadFeed(); }, []);

  const hasPostedThisWeek = feed.some(e => e.name === profile.name && e.week === weekKey());

  const submitPost = (text) => {
    if (!text.trim()) return;
    const entry = {
      name: profile.name,
      mode: profile.modeId,
      lane: focusLane,
      callout: text.trim(),
      time: "just now",
      ts: Date.now(),
      week: weekKey(),
    };
    try {
      localStorage.setItem(`mos_pulse_${profile.name}_${Date.now()}`, JSON.stringify(entry));
    } catch {}
    setStep("posted");
    loadFeed();
  };

  const myPost = feed.find(e => e.name === profile.name && e.week === weekKey());
  const sortedModes = Object.entries(modeCounts).sort((a,b)=>b[1]-a[1]);

  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:9, letterSpacing:4, color:T.inkSoft, textTransform:"uppercase", marginBottom:4 }}>⊙ Pulse</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:300, color:T.ink, marginBottom:4 }}>The creative pulse</h2>
      <p style={{ fontSize:13, color:T.sub, marginBottom:20, lineHeight:1.7 }}>Declare your mode. Be honest. You are not alone in this.</p>

      {/* YOUR DECLARATION — compose / posted states */}
      {!hasPostedThisWeek && step !== "posted" ? (
        <div style={{ background:mode.moodBg, border:`2px solid ${mode.moodBorder}`, borderRadius:14, padding:"18px 18px", marginBottom:16 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:mode.moodColor+"22", border:`1px solid ${mode.moodColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{mode.emoji}</div>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:T.ink }}>{profile.name}</p>
              <p style={{ fontSize:10, color:mode.moodColor }}>{mode.label}{focusLane ? ` · ${focusLane}` : ""}</p>
            </div>
          </div>

          {step === "idle" ? (
            <>
              <p style={{ fontSize:13, color:mode.moodColor, fontWeight:600, marginBottom:12, lineHeight:1.5 }}>You're in {mode.label}. What's the honest line?</p>
              {/* AI suggestion as a tap-to-use option */}
              {aiSuggestion && (
                <div
                  onClick={() => { setCustomText(aiSuggestion); setStep("compose"); }}
                  style={{ background:"rgba(255,255,255,0.5)", border:`1px solid ${mode.moodBorder}`, borderRadius:8, padding:"10px 12px", marginBottom:10, cursor:"pointer" }}
                >
                  <p style={{ fontSize:10, letterSpacing:1.5, color:mode.moodColor, textTransform:"uppercase", marginBottom:4 }}>✦ Use AI's line for you</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:T.ink, lineHeight:1.5, fontStyle:"italic" }}>"{aiSuggestion}"</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => { setCustomText(""); setStep("compose"); }}
                style={{ width:"100%", background:"transparent", border:`1px solid ${mode.moodBorder}`, borderRadius:8, padding:"11px", fontSize:12, color:mode.moodColor, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}
              >Write my own →</button>
            </>
          ) : step === "compose" ? (
            <>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Say the honest thing. One sentence. First person."
                autoFocus
                style={{ width:"100%", background:"rgba(255,255,255,0.6)", border:`1.5px solid ${mode.moodBorder}`, borderRadius:8, padding:"12px", fontSize:14, color:T.ink, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", outline:"none", resize:"none", minHeight:80, lineHeight:1.6, marginBottom:10 }}
              />
              <p style={{ fontSize:11, color:T.muted, marginBottom:10, lineHeight:1.6 }}>Keep it first person. One sentence. The kind of thing you normally only think.</p>
              <div style={{ display:"flex", gap:8 }}>
                <button type="button" onClick={() => setStep("idle")} style={{ background:"transparent", border:`1px solid ${mode.moodBorder}`, borderRadius:6, padding:"10px 16px", fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:mode.moodColor, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>Back</button>
                <button type="button" onClick={() => submitPost(customText)} disabled={!customText.trim()} style={{ flex:1, background:customText.trim()?T.ink:"#E0D8CE", border:"none", borderRadius:6, padding:"11px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:customText.trim()?"#FAF7F4":"#A09080", cursor:customText.trim()?"pointer":"not-allowed", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>Post to Pulse →</button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div style={{ background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:12, padding:"14px 18px", marginBottom:16 }}>
          <p style={{ fontSize:12, color:T.inkWarm, fontWeight:600, marginBottom:4 }}>✓ You declared this week</p>
          {myPost && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:T.sub, fontStyle:"italic" }}>"{myPost.callout}"</p>}
        </div>
      )}

      {/* Mode distribution — only show if there are real posts */}
      {feed.length > 0 && sortedModes.length > 0 && (
        <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px", marginBottom:16, boxShadow:T.sh }}>
          <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:12 }}>This week's energy · {feed.length} declaration{feed.length!==1?"s":""}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {sortedModes.map(([mId, count]) => {
              const m = MODES[mId]; if (!m) return null;
              const pct = Math.round((count / feed.length) * 100);
              return (
                <div key={mId}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <p style={{ fontSize:12, color:m.moodColor, fontWeight:500 }}>{m.emoji} {m.label}</p>
                    <p style={{ fontSize:11, color:T.muted }}>{count} · {pct}%</p>
                  </div>
                  <div style={{ height:3, background:T.bg, borderRadius:2 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:m.moodColor, borderRadius:2, opacity:0.7 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feed */}
      {feed.length > 0 ? (
        <>
          <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:12 }}>Declarations this week</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {feed.map((entry, i) => {
              const m = MODES[entry.mode]||MODES.build;
              const isYou = entry.name === profile.name;
              return (
                <div key={i} style={{ background: isYou ? T.tint : "#fff", border:`1.5px solid ${isYou ? T.tintBorder : T.border}`, borderRadius:10, padding:"14px 16px", boxShadow:T.sh }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:m.moodColor+"22", border:`1.5px solid ${m.moodColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{m.emoji}</div>
                      <div>
                        <p style={{ fontSize:12, fontWeight:600, color:T.ink }}>{entry.name}{isYou?" · you":""}</p>
                        <p style={{ fontSize:10, color:m.moodColor }}>{m.label}{entry.lane ? ` · ${entry.lane}` : ""}</p>
                      </div>
                    </div>
                    <p style={{ fontSize:10, color:T.muted, flexShrink:0 }}>{entry.time}</p>
                  </div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:300, color:T.ink, lineHeight:1.6, fontStyle:"italic" }}>"{entry.callout}"</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign:"center", padding:"40px 20px", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:T.ink, marginBottom:8 }}>Be the first this week.</p>
          <p style={{ fontSize:13, color:T.muted, lineHeight:1.7 }}>Pulse grows as creatives declare their mode. Your honest line is what makes others feel seen.</p>
        </div>
      )}
    </div>
  );
}


// ─── WEEKLY FOCUS ─────────────────────────────────────────────────────────────
function WeeklyFocus({ profile, weekData, onUpdateWeek, strategy, onCapture }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const isLight = profile.focusStyle==="light";
  const priorities = weekData?.priorities || ["","",""];
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const tasks = weekData?.tasks||[];
  const done = tasks.filter(t=>t.done).length;

  // Auto-seed priorities from category intelligence if empty
  useEffect(() => {
    if (weekData && !priorities.some(p=>p)) {
      const category = inferCategory(profile.title, profile.skills);
      const suggested = getCategoryTasks(category, profile.modeId, profile.title).slice(0,3).map(t=>t.action);
      onUpdateWeek({...weekData, priorities: suggested});
    }
  }, [profile.modeId]);

  const savePriority = (idx, val) => {
    const updated = [...priorities];
    updated[idx] = val.trim();
    onUpdateWeek({...weekData, priorities: updated});
    setEditing(null);
  };

  const promoteToPriority = (taskAction) => {
    const updated = [...priorities];
    const empty = updated.findIndex(p => !p);
    if (empty !== -1) { updated[empty] = taskAction; onUpdateWeek({...weekData, priorities: updated}); }
  };

  // Mode-aware priority labels
  const label = { build:"Ship", stabilize:"Fix", pivot:"Test", focus:"Do", expand:"Push", refine:"Sharpen", rest:"Protect" }[profile.modeId] || "Priority";

  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:9, letterSpacing:4, color:T.inkSoft, textTransform:"uppercase", marginBottom:4 }}>⊡ This Week's Focus</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:300, color:T.ink, marginBottom:4 }}>Three things. That's it.</h2>
      <p style={{ fontSize:13, color:T.sub, marginBottom:6, lineHeight:1.7 }}>Not your task list. Not your goals. Your three non-negotiables for this week.</p>

      {/* Mode context */}
      <div style={{ background:mode.moodBg, border:`1px solid ${mode.moodBorder}`, borderRadius:8, padding:"10px 14px", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>{mode.emoji}</span>
        <p style={{ fontSize:12, color:mode.moodColor, fontWeight:600 }}>{mode.behavior}</p>
      </div>

      {/* 3 Priority slots */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {[0,1,2].map(idx => {
          const val = priorities[idx]||"";
          const isEditing = editing === idx;
          return (
            <div key={idx} style={{ background:"#fff", border:`2px solid ${val ? T.tintBorder : T.border}`, borderRadius:12, padding:"16px 18px", boxShadow:val?T.shMd:T.sh, transition:"all 0.15s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:isEditing?12:0 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:val?T.ink:T.bg, border:`2px solid ${val?T.ink:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:val?"#FAF7F4":T.muted }}>{idx+1}</span>
                </div>
                {!isEditing ? (
                  <p onClick={()=>{ setEditing(idx); setDraft(val); }} style={{ flex:1, fontSize:14, color:val?T.ink:T.muted, fontStyle:val?"normal":"italic", cursor:"pointer", lineHeight:1.5, fontWeight:val?500:400 }}>
                    {val || `${label} ${idx+1} — tap to set`}
                  </p>
                ) : (
                  <p style={{ flex:1, fontSize:11, color:T.muted, letterSpacing:1 }}>editing...</p>
                )}
                {val && !isEditing && (
                  <button type="button" onClick={()=>{ const u=[...priorities]; u[idx]=""; onUpdateWeek({...weekData,priorities:u}); }} style={{ background:"transparent", border:"none", fontSize:14, color:T.muted, cursor:"pointer", padding:"0 4px" }}>×</button>
                )}
              </div>
              {isEditing && (
                <div>
                  <textarea
                    value={draft} onChange={e=>setDraft(e.target.value)}
                    placeholder="Write the one thing that must happen..."
                    autoFocus
                    style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.tintBorder}`, borderRadius:8, padding:"11px 12px", fontSize:14, color:T.ink, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none", minHeight:72, lineHeight:1.6, marginBottom:8 }}
                  />
                  <div style={{ display:"flex", gap:8 }}>
                    <button type="button" onClick={()=>setEditing(null)} style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:6, padding:"9px 14px", fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>Cancel</button>
                    <button type="button" onClick={()=>savePriority(idx,draft)} style={{ flex:1, background:T.ink, border:"none", borderRadius:6, padding:"9px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FAF7F4", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>Save →</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI suggested focus lane as a quick-add */}
      {strategy?.focusLane && !priorities.some(p=>p) && (
        <div style={{ background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:10, padding:"13px 16px", marginBottom:16 }}>
          <p style={{ fontSize:11, color:T.inkSoft, marginBottom:8 }}>✦ Suggested by your mode analysis:</p>
          <p style={{ fontSize:13, color:T.inkWarm, fontWeight:500, marginBottom:10 }}>Make progress on your {strategy.focusLane} lane this week</p>
          <button type="button" onClick={()=>promoteToPriority("Make progress on my " + strategy.focusLane + " lane")} style={{ background:T.inkWarm, border:"none", borderRadius:4, padding:"9px 16px", fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FAF7F4", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>Add as Priority 1 →</button>
        </div>
      )}

      {/* Task progress */}
      {tasks.length > 0 && (
        <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 18px", boxShadow:T.sh }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <p style={{ fontSize:12, color:T.sub, fontWeight:500 }}>Weekly tasks</p>
            <p style={{ fontSize:12, color:done===tasks.length?"#2A7A4A":T.muted, fontWeight:done===tasks.length?600:400 }}>{done}/{tasks.length}{done===tasks.length?" ✓":""}</p>
          </div>
          <div style={{ height:4, background:T.bg, borderRadius:3 }}>
            <div style={{ height:"100%", width:`${tasks.length?(done/tasks.length)*100:0}%`, background:done===tasks.length?"#3A8A5A":T.inkSoft, borderRadius:3, transition:"width 0.4s" }}/>
          </div>
          <p style={{ fontSize:11, color:T.muted, marginTop:8 }}>Go to Mode tab to check off tasks</p>
        </div>
      )}

      {/* Quick capture button */}
      <div style={{ marginTop:12 }}>
        <button type="button" onClick={onCapture} style={{ width:"100%", background:"transparent", border:`1px solid ${T.border}`, borderRadius:10, padding:"14px", fontSize:12, color:T.sub, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation", textAlign:"left" }}>
          ✎ Got something in your head? Drop it in Capture →
        </button>
      </div>
    </div>
  );
}

// ─── CAPTURE (Brain Dump) ─────────────────────────────────────────────────────
function Capture({ profile, weekData, onUpdateWeek, onAddToPriority }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const captures = weekData?.captures || [];

  const save = () => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), text: text.trim(), ts: new Date().toISOString(), promoted: false };
    onUpdateWeek({...weekData, captures: [entry, ...captures]});
    setText(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const promote = (entry) => {
    const priorities = weekData?.priorities || ["","",""];
    const empty = priorities.findIndex(p => !p);
    if (empty === -1) return;
    const updated = [...priorities];
    updated[empty] = entry.text;
    const updatedCaptures = captures.map(c => c.id===entry.id ? {...c,promoted:true} : c);
    onUpdateWeek({...weekData, priorities: updated, captures: updatedCaptures});
  };

  const remove = (id) => onUpdateWeek({...weekData, captures: captures.filter(c=>c.id!==id)});

  return (
    <div style={{ padding:"32px 20px 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:9, letterSpacing:4, color:T.inkSoft, textTransform:"uppercase", marginBottom:4 }}>✎ Capture</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:300, color:T.ink, marginBottom:4 }}>Brain dump.</h2>
      <p style={{ fontSize:13, color:T.sub, marginBottom:20, lineHeight:1.7 }}>No structure. No pressure. Just get it out of your head.</p>

      {/* Input */}
      <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"16px 18px", marginBottom:12, boxShadow:T.shMd }}>
        <textarea
          value={text} onChange={e=>setText(e.target.value)}
          placeholder="What's in your head right now..."
          style={{ width:"100%", background:"transparent", border:"none", outline:"none", fontSize:15, color:T.ink, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", resize:"none", minHeight:100, lineHeight:1.7 }}
        />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${T.border}`, paddingTop:10, marginTop:4 }}>
          <p style={{ fontSize:11, color:T.muted }}>{text.length > 0 ? `${text.length} chars` : "Tap above to start"}</p>
          <button type="button" onClick={save} disabled={!text.trim()} style={{ background:text.trim()?T.ink:"#E0D8CE", color:text.trim()?"#FAF7F4":"#A09080", border:"none", borderRadius:4, padding:"9px 18px", fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", cursor:text.trim()?"pointer":"not-allowed", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>
            {saved ? "Saved ✓" : "Capture →"}
          </button>
        </div>
      </div>

      {/* Saved captures */}
      {captures.length > 0 && (
        <>
          <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:12 }}>Captured ({captures.length})</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {captures.map(entry => (
              <div key={entry.id} style={{ background:entry.promoted?"#F8FAF5":"#fff", border:`1.5px solid ${entry.promoted?"#B8D4A8":T.border}`, borderRadius:10, padding:"14px 16px", boxShadow:T.sh }}>
                <p style={{ fontSize:14, color:entry.promoted?T.muted:T.ink, lineHeight:1.6, marginBottom:10, textDecoration:entry.promoted?"line-through":"none" }}>{entry.text}</p>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <p style={{ fontSize:10, color:T.muted, flex:1 }}>{new Date(entry.ts).toLocaleDateString("en-US",{weekday:"short",hour:"2-digit",minute:"2-digit"})}</p>
                  {!entry.promoted && (weekData?.priorities||["","",""]).some(p=>!p) && (
                    <button type="button" onClick={()=>promote(entry)} style={{ background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:4, padding:"5px 12px", fontSize:10, letterSpacing:"1px", textTransform:"uppercase", color:T.inkWarm, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation" }}>
                      → Make Priority
                    </button>
                  )}
                  {entry.promoted && <p style={{ fontSize:10, color:"#5A9A4A", fontWeight:600 }}>✓ In Focus</p>}
                  <button type="button" onClick={()=>remove(entry.id)} style={{ background:"transparent", border:"none", fontSize:14, color:T.muted, cursor:"pointer", padding:"0 4px" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {captures.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:T.ink, marginBottom:8 }}>Nothing captured yet.</p>
          <p style={{ fontSize:13, color:T.muted, lineHeight:1.7 }}>Use this when an idea hits. Mid-walk. Mid-shower. Mid-meeting. Capture it before it disappears.</p>
        </div>
      )}
    </div>
  );
}

// ─── WEEKLY REVIEW + NEXT WEEK RESET ─────────────────────────────────────────
const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function WeeklyReview({ profile, weekData, history, weekHistory, onComplete, onClose }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const tasks = weekData?.tasks||[];
  const done = tasks.filter(t=>t.done);
  const missed = tasks.filter(t=>!t.done);
  const [step, setStep] = useState("review"); // review | reset | mode
  const [answers, setAnswers] = useState({ completed:"", missed:"", changed:"", nextFocus:"" });
  const [newModeAnswers, setNewModeAnswers] = useState({});
  const allAnswered = Object.keys(newModeAnswers).length===QS.length;
  const computedMode = allAnswered
    ? calcMode(Object.entries(newModeAnswers).map(([qId,optIdx])=>({qId,optIdx:Number(optIdx)})))
    : null;

  const saveReview = () => {
    onComplete({
      reviewAnswers: answers,
      newModeId: computedMode || profile.modeId,
      newAnswers: newModeAnswers,
    });
  };

  if (step === "mode") return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.8)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 22px 48px", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }}/>
        <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:6 }}>Next Week Reset</p>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:6 }}>Recalculate your mode.</h3>
        <p style={{ fontSize:13, color:T.sub, marginBottom:24, lineHeight:1.7 }}>Answer honestly. Your next week's strategy depends on this.</p>
        {QS.map((q,qi)=>(
          <div key={q.id} style={{ marginBottom:20 }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:500, marginBottom:10, lineHeight:1.5 }}>{qi+1}. {q.question}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {q.options.map((opt,oi)=>{ const sel=newModeAnswers[q.id]===oi; return <div key={oi} onClick={()=>setNewModeAnswers(p=>({...p,[q.id]:oi}))} style={{ background:sel?T.tint:T.bg, border:`1.5px solid ${sel?T.tintBorder:T.border}`, borderRadius:7, padding:"11px 14px", cursor:"pointer", fontSize:13, color:sel?T.inkWarm:T.ink, transition:"all 0.15s" }}>{opt.label}</div>; })}
            </div>
          </div>
        ))}
        {computedMode && (
          <div style={{ background:MODES[computedMode].moodBg, border:`1.5px solid ${MODES[computedMode].moodBorder}`, borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
            <p style={{ fontSize:9, letterSpacing:2, color:MODES[computedMode].moodColor, textTransform:"uppercase", marginBottom:4 }}>Next week's mode</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:MODES[computedMode].moodColor, fontWeight:400 }}>{MODES[computedMode].emoji} {MODES[computedMode].label}</p>
            <p style={{ fontSize:12, color:MODES[computedMode].moodColor, marginTop:4, opacity:0.8 }}>{MODES[computedMode].behavior}</p>
          </div>
        )}
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setStep("reset")}>← Back</Btn>
          <div style={{ flex:1 }}><Btn onClick={saveReview} disabled={!allAnswered} full>Start Next Week →</Btn></div>
        </div>
      </div>
    </div>
  );

  if (step === "reset") return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.8)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 22px 48px", maxHeight:"75vh", overflowY:"auto" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }}/>
        <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:6 }}>3 of 3</p>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:20 }}>What changed?</h3>
        {[{ key:"changed", label:"Anything different about your situation now vs. a week ago?" },
          { key:"nextFocus", label:"What do you want to protect or prioritise next week?" }
        ].map(f=>(
          <div key={f.key} style={{ marginBottom:18 }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:500, marginBottom:10, lineHeight:1.5 }}>{f.label}</p>
            <textarea value={answers[f.key]} onChange={e=>setAnswers(p=>({...p,[f.key]:e.target.value}))} placeholder="Keep it honest." rows={3} style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:8, padding:"11px 13px", fontSize:13, color:T.ink, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none", lineHeight:1.6 }}/>
          </div>
        ))}
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setStep("review")}>← Back</Btn>
          <div style={{ flex:1 }}><Btn onClick={()=>setStep("mode")} full>Recalculate Mode →</Btn></div>
        </div>
      </div>
    </div>
  );

  // Step 1: Review
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(8,6,4,0.8)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 22px 48px", maxHeight:"80vh", overflowY:"auto" }}>
        <div style={{ width:36, height:3, background:T.border, borderRadius:2, margin:"0 auto 20px" }}/>
        <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:6 }}>Weekly Review · 1 of 3</p>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:4 }}>How did this week go?</h3>
        <p style={{ fontSize:13, color:T.sub, marginBottom:20, lineHeight:1.7 }}>Honest reflection. Then Mode OS resets your next week.</p>

        {/* Task summary */}
        <div style={{ background:mode.moodBg, border:`1px solid ${mode.moodBorder}`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
          <p style={{ fontSize:12, color:mode.moodColor, fontWeight:600, marginBottom:8 }}>{mode.emoji} {mode.label} · {done.length}/{tasks.length} tasks completed</p>
          {done.length>0 && <div style={{ marginBottom:8 }}>{done.map((t,i)=><p key={i} style={{ fontSize:12, color:mode.moodColor, lineHeight:1.6 }}>✓ {t.action}</p>)}</div>}
          {missed.length>0 && <div>{missed.map((t,i)=><p key={i} style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>☐ {t.action}</p>)}</div>}
        </div>

        {[{ key:"completed", label:"What did you actually complete this week?" },
          { key:"missed",    label:"What didn't get done — and why?" }
        ].map(f=>(
          <div key={f.key} style={{ marginBottom:18 }}>
            <p style={{ fontSize:13, color:T.ink, fontWeight:500, marginBottom:10, lineHeight:1.5 }}>{f.label}</p>
            <textarea value={answers[f.key]} onChange={e=>setAnswers(p=>({...p,[f.key]:e.target.value}))} placeholder="Be honest. No judgment." rows={3} style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:8, padding:"11px 13px", fontSize:13, color:T.ink, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none", lineHeight:1.6 }}/>
          </div>
        ))}
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={onClose}>Later</Btn>
          <div style={{ flex:1 }}><Btn onClick={()=>setStep("reset")} full>Continue →</Btn></div>
        </div>
      </div>
    </div>
  );
}

// ─── DAILY VIEW with habits + week timeline ───────────────────────────────────
// Habits are daily pulse checks — binary yes/no, behavioural, not instructional.
// They must feel different from tasks: shorter, personal, almost like a mirror.
const MODE_HABITS = {
  build: [
    { q: "Did you make progress on something today?",     yes: "Moving",      no: "Not yet" },
    { q: "Did you avoid starting something new?",          yes: "Focused",     no: "Scattered" },
    { q: "Did you close a loop instead of opening one?",  yes: "Consistent",  no: "Still open" },
  ],
  stabilize: [
    { q: "Did you stick to your schedule today?",          yes: "Consistent",  no: "Off track" },
    { q: "Did you check in on your income or pipeline?",   yes: "Aware",       no: "Avoided it" },
    { q: "Did you do the thing you've been putting off?",  yes: "Done",        no: "Tomorrow" },
  ],
  pivot: [
    { q: "Did you spend time exploring something new?",    yes: "Curious",     no: "Not yet" },
    { q: "Did you let go of something that isn't working?",yes: "Lighter",     no: "Holding on" },
    { q: "Did you talk to anyone outside your bubble?",    yes: "Connected",   no: "Stayed in" },
  ],
  focus: [
    { q: "Did you stay in your focus lane today?",         yes: "Locked in",   no: "Drifted" },
    { q: "Did you say no to at least one distraction?",    yes: "Protected",   no: "Let it in" },
    { q: "Did you start work before checking messages?",   yes: "Intentional", no: "Reactive" },
  ],
  expand: [
    { q: "Did you put your work in front of new eyes?",    yes: "Visible",     no: "Still hidden" },
    { q: "Did you reach out to someone today?",            yes: "Connected",   no: "Not yet" },
    { q: "Did you post or share anything?",                yes: "Out there",   no: "Stayed quiet" },
  ],
  refine: [
    { q: "Did you improve one specific thing today?",      yes: "Sharper",     no: "Same as before" },
    { q: "Did you ask for feedback or a second opinion?",  yes: "Open",        no: "Kept it closed" },
    { q: "Did you remove something that didn't belong?",   yes: "Cleaner",     no: "Still cluttered" },
  ],
  rest: [
    { q: "Did you protect your energy today?",             yes: "Rested",      no: "Pushed through" },
    { q: "Did you do something purely for enjoyment?",     yes: "Recharged",   no: "Still depleting" },
    { q: "Did you go outside or step away from screens?",  yes: "Grounded",    no: "Screen-locked" },
  ],
};

function DailyView({ profile, weekData, onUpdateWeek, strategy, onCapture }) {
  const mode = MODES[profile.modeId]||MODES.build;
  const today = new Date();
  const dayIdx = today.getDay();
  const tasks = (weekData?.tasks||[]).slice(0,3);
  const done = tasks.filter(t=>t.done).length;

  // Habits — stored as weekData.habits: { [dayKey]: { [idx]: bool } }
  const dayKey = today.toISOString().slice(0,10);
  const habitsChecked = weekData?.habits?.[dayKey] || {};
  const habits = MODE_HABITS[profile.modeId]||MODE_HABITS.build;

  const toggleHabit = (i, val) => {
    const updated = { ...(weekData?.habits||{}), [dayKey]: { ...habitsChecked, [i]: val } };
    onUpdateWeek({ ...weekData, habits: updated });
  };

  // Week timeline
  const weekStart = new Date(today); weekStart.setDate(today.getDate()-dayIdx); weekStart.setHours(0,0,0,0);

  return (
    <div style={{ padding:"0 0 100px", maxWidth:480, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ padding:"24px 20px 0" }}>
        <p style={{ fontSize:9, letterSpacing:4, color:T.inkSoft, textTransform:"uppercase", marginBottom:2 }}>Today</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, color:T.ink, lineHeight:1 }}>
          {today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        </h2>
      </div>

      {/* Week timeline strip */}
      <div style={{ margin:"16px 20px 0", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", boxShadow:T.sh }}>
        <p style={{ fontSize:9, letterSpacing:2, color:T.muted, textTransform:"uppercase", marginBottom:10 }}>This week</p>
        <div style={{ display:"flex", gap:4 }}>
          {WEEK_DAYS.map((day,i) => {
            const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
            const isToday = i===dayIdx;
            const isPast = i<dayIdx;
            const dateNum = d.getDate();
            // Count tasks done on this day (by noteTime)
            const notedToday = (weekData?.tasks||[]).filter(t=>t.noteTime&&new Date(t.noteTime).toDateString()===d.toDateString()).length;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <p style={{ fontSize:8, letterSpacing:1, color:isToday?T.inkWarm:T.muted, textTransform:"uppercase", fontWeight:isToday?600:400 }}>{day}</p>
                <div style={{ width:28, height:28, borderRadius:"50%", background:isToday?T.ink:isPast?T.tint:"#fff", border:`1.5px solid ${isToday?T.ink:isPast?T.tintBorder:T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <p style={{ fontSize:11, color:isToday?"#FAF7F4":isPast?T.inkWarm:T.muted, fontWeight:isToday?600:400 }}>{dateNum}</p>
                </div>
                {/* Dot if something was logged today */}
                <div style={{ width:4, height:4, borderRadius:"50%", background:notedToday>0?T.inkSoft:"transparent" }}/>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's directive */}
      <div style={{ margin:"10px 20px 0", background:mode.moodBg, border:`1.5px solid ${mode.moodBorder}`, borderRadius:12, padding:"16px 18px" }}>
        <p style={{ fontSize:9, letterSpacing:3, color:`${mode.moodColor}99`, textTransform:"uppercase", marginBottom:6 }}>Today's directive · {mode.label}</p>
        <p style={{ fontSize:15, color:mode.moodColor, fontWeight:700, lineHeight:1.5 }}>{mode.behavior}</p>
        {strategy?.focusLane && (
          <p style={{ fontSize:12, color:mode.moodColor, marginTop:6, opacity:0.8 }}>Focus lane: <strong>{strategy.focusLane}</strong></p>
        )}
      </div>

      {/* Daily habits — pulse check format */}
      <div style={{ margin:"10px 20px 0", background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, overflow:"hidden", boxShadow:T.shMd }}>
        <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:2 }}>Daily pulse</p>
            <p style={{ fontSize:11, color:T.muted }}>3 questions. Honest answers only.</p>
          </div>
          <p style={{ fontSize:11, color:Object.keys(habitsChecked).filter(k=>habitsChecked[k]!==undefined).length===habits.length?T.inkSoft:T.muted }}>
            {Object.keys(habitsChecked).filter(k=>habitsChecked[k]!==undefined).length}/{habits.length}
          </p>
        </div>
        {habits.map((h,i) => {
          const answer = habitsChecked[i]; // true=yes, false=no, undefined=unanswered
          const answered = answer !== undefined;
          return (
            <div key={i} style={{ padding:"14px 18px", borderBottom:i<habits.length-1?`1px solid ${T.border}`:"none", background:answered?"#FAFAF8":"#fff", transition:"background 0.15s" }}>
              <p style={{ fontSize:13, color:answered?T.muted:T.ink, lineHeight:1.55, marginBottom:answered?6:10, fontWeight:400 }}>{h.q}</p>
              {answered ? (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:answer?T.tint:"#FFF5F5", border:`1px solid ${answer?T.tintBorder:"#F0C0C0"}`, borderRadius:20, padding:"3px 12px" }}>
                    <p style={{ fontSize:11, color:answer?T.inkWarm:"#C04040", fontWeight:600 }}>{answer ? h.yes : h.no}</p>
                  </div>
                  <button onClick={()=>{const u={...habitsChecked};delete u[i];const all={...(weekData?.habits||{}),[dayKey]:u};onUpdateWeek({...weekData,habits:all});}} style={{ fontSize:10, color:T.muted, background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>change</button>
                </div>
              ) : (
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>toggleHabit(i,true)} style={{ flex:1, background:T.tint, border:`1px solid ${T.tintBorder}`, borderRadius:8, padding:"9px", fontSize:11, fontWeight:600, color:T.inkWarm, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px" }}>Yes</button>
                  <button onClick={()=>toggleHabit(i,false)} style={{ flex:1, background:"#FFF5F5", border:`1px solid #F0C0C0`, borderRadius:8, padding:"9px", fontSize:11, fontWeight:600, color:"#C04040", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px" }}>Not yet</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Week progress link — not a full task list, just a nudge */}
      {tasks.length>0 && (
        <div style={{ margin:"10px 20px 0", background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 18px", boxShadow:T.sh, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:9, letterSpacing:3, color:T.inkSoft, textTransform:"uppercase", marginBottom:3 }}>This week</p>
            <p style={{ fontSize:14, color:done===tasks.length?"#2A7A4A":T.ink, fontWeight:600 }}>
              {done}/{tasks.length} tasks completed{done===tasks.length?" ✓":""}
            </p>
          </div>
          <div style={{ height:36, width:1, background:T.border }}/>
          <div style={{ height:36, width:80, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ height:4, width:"100%", background:T.bg, borderRadius:3 }}>
              <div style={{ height:"100%", width:`${tasks.length?(done/tasks.length)*100:0}%`, background:done===tasks.length?"#3A8A5A":T.inkSoft, borderRadius:3, transition:"width 0.4s" }}/>
            </div>
          </div>
        </div>
      )}

      {/* Capture quick-entry */}
      <div style={{ margin:"10px 20px 0" }}>
        <button type="button" onClick={onCapture} style={{ width:"100%", background:"transparent", border:`1px dashed ${T.border}`, borderRadius:10, padding:"14px", fontSize:12, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", touchAction:"manipulation", textAlign:"left" }}>
          ✎ Something in your head? Drop it in Capture →
        </button>
      </div>
    </div>
  );
}
const CAREER_CATEGORIES = {
  creative: {
    label:"Creative", keywords:["designer","artist","photographer","illustrator","filmmaker","animator","creator","fashion","stylist","decorator","architect","interior","graphic","motion","visual","content","writer","poet","musician","painter"],
    modes: {
      build:     ["Produce one finished piece of work","Post your work publicly — done beats perfect","Spend 90 min on your primary creative project"],
      focus:     ["Finish one creative project before starting another","Clear your workspace and creative queue","Define what you're making this week and make only that"],
      stabilize: ["Create a repeatable weekly production schedule","Organize your existing work into a presentable portfolio","Set a consistent posting rhythm and protect it"],
      expand:    ["Share your work in 3 new spaces today","Reach out to one collaborator or client","Create content about your process — not just the output"],
      refine:    ["Edit one piece of work until it's genuinely good","Study one creative you admire — identify what makes them sharp","Remove everything from your portfolio that doesn't represent your best"],
      pivot:     ["Sketch 5 concepts in a direction you haven't tried","Research one creative field adjacent to yours","Create something purely experimental with zero commercial intent"],
      rest:      ["Step away from your creative tools today","Consume instead of create — watch, read, absorb","Go somewhere that has nothing to do with your work"],
    }
  },
  business: {
    label:"Business", keywords:["founder","entrepreneur","startup","business","ceo","owner","brand","agency","consultant","freelancer","coach","strategist","marketer","sales","product","operator","manager","director","executive"],
    modes: {
      build:     ["Build one thing that generates revenue this week","Send 5 outreach messages to potential clients","Define your offer clearly enough to say it in one sentence"],
      focus:     ["Pick your highest-leverage activity and do only that","Cancel or delegate everything that doesn't move money","Set a revenue goal for this week and work backward from it"],
      stabilize: ["Fix the one system that keeps breaking","Document your process so it can run without you","Follow up on every open proposal or conversation"],
      expand:    ["Raise your prices on at least one offer","Open one new acquisition channel this week","Ask 3 current clients for a referral"],
      refine:    ["Rewrite your core offer until it's undeniable","Audit your client experience from first contact to delivery","Cut the service or product that costs more than it earns"],
      pivot:     ["Talk to 5 people about the new direction before building anything","Test one new offer at a small scale","Identify what from your current business transfers to the new direction"],
      rest:      ["Stop checking revenue numbers for 24 hours","Delegate everything non-critical this week","Protect your evenings — no business communication after 7pm"],
    }
  },
  tech: {
    label:"Tech", keywords:["developer","engineer","programmer","coder","software","tech","product","data","analyst","scientist","devops","backend","frontend","fullstack","app","web","mobile","ai","ml","ux","ui"],
    modes: {
      build:     ["Ship something small and functional today","Commit code every day this week — no exceptions","Define the MVP and cut everything else"],
      focus:     ["Turn off Slack and notifications for your primary work block","Finish the feature you started before beginning the next","Pick the one technical debt item that will unblock everything else"],
      stabilize: ["Write tests for the thing that keeps breaking","Document the parts of the codebase only you understand","Set up monitoring so you stop finding out about bugs from users"],
      expand:    ["Open source something or write about what you built","Apply to one conference, fellowship, or opportunity","Share your project with a community that isn't already following you"],
      refine:    ["Review your code from 3 months ago and make it better","Get a technical review from someone more senior","Optimize the one thing users complain about most"],
      pivot:     ["Build a proof of concept in the new direction — 2 days max","Talk to 10 potential users before writing a line of code","Identify which of your current skills transfer directly"],
      rest:      ["No side projects this week — protect your recovery","Go outside. Touch grass. Seriously.","Read something completely unrelated to technology"],
    }
  },
  student: {
    label:"Student", keywords:["student","studying","university","college","school","graduate","phd","masters","degree","course","class","exam","thesis","dissertation","intern","internship","learning","education"],
    modes: {
      build:     ["Complete one major assignment from start to finish today","Build something for your portfolio — even if it's small","Start the project you've been procrastinating on"],
      focus:     ["Study only the subject that matters most this week","Turn off your phone for your study blocks","Identify the 20% of material that covers 80% of what you'll be tested on"],
      stabilize: ["Get your notes organized before the next lecture","Create a consistent daily study schedule and protect it","Review everything from the last 2 weeks — fill the gaps"],
      expand:    ["Reach out to one professor or professional in your field","Apply for one opportunity — internship, scholarship, program","Attend one event outside your normal academic circle"],
      refine:    ["Rewrite your weakest essay or assignment","Get feedback on your work from someone you respect","Identify the skill gap that's holding you back and address it"],
      pivot:     ["Research 3 career paths you haven't seriously considered","Talk to someone working in a field you're curious about","Give yourself permission to change direction — then investigate what that looks like"],
      rest:      ["Take a real break — no studying, no guilt","Sleep 8 hours for 3 nights in a row","Do one thing purely for enjoyment with zero productivity attached"],
    }
  },
};

function inferCategory(title, skills) {
  const text = [(title||""), ...(skills||[])].join(" ").toLowerCase();
  for (const [cat, data] of Object.entries(CAREER_CATEGORIES)) {
    if (data.keywords.some(kw => text.includes(kw))) return cat;
  }
  return "creative"; // default
}

function getCategoryTasks(category, modeId, title) {
  const cat = CAREER_CATEGORIES[category] || CAREER_CATEGORIES.creative;
  const base = cat.modes[modeId] || cat.modes.build;
  // Light personalization: replace generic noun with their actual title
  const shortTitle = (title||"").split("/")[0].trim().split(" ").slice(-1)[0].toLowerCase();
  return base.map(task => {
    if (shortTitle && shortTitle.length > 3 && !["and","the","for","with"].includes(shortTitle)) {
      return task; // keep as-is — tasks are already role-aware
    }
    return task;
  }).map(t => ({ action: t, time: "30–60 min", impact: "", done: false }));
}

function Intro({ onStart }) {
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"48px 32px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(166,108,64,0.1) 0%, transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle, rgba(107,62,30,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:360, position:"relative" }}>
        {/* Wordmark */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:48 }}>
          <LogoLockup size="md" iconVariant="dark"/>
        </div>

        {/* Hook — big, immediate */}
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, lineHeight:1.2, color:T.ink, marginBottom:16 }}>
          Stop trying to drive<br/>in a hundred lanes at once.
        </h1>

        {/* One-line subhead — the insight */}
        <p style={{ fontSize:16, color:T.inkWarm, lineHeight:1.7, marginBottom:12, fontWeight:500 }}>
          You're multi-passionate — and that's your strength.
        </p>

        {/* Supporting copy — smaller, faster to scan */}
        <p style={{ fontSize:14, color:T.sub, lineHeight:1.85, marginBottom:16, fontWeight:300 }}>
          But it's also why you're overwhelmed.
        </p>
        <p style={{ fontSize:14, color:T.sub, lineHeight:1.85, marginBottom:48, fontWeight:300 }}>
          Mode OS determines which version of yourself needs to show up this week — and gives you permission to let the other lanes wait.
        </p>

        {/* Feature pills */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:44 }}>
          {["7 honest questions","Your dominant mode","Weekly tasks","Track your arc"].map(t=>(
            <span key={t} style={{ fontSize:11, color:T.inkWarm, background:T.tint, border:`1px solid ${T.tintBorder}`, padding:"5px 14px", borderRadius:20 }}>{t}</span>
          ))}
        </div>

        {/* CTA */}
        <button type="button" onClick={onStart} style={{ background:T.ink, color:"#FAF7F4", border:"none", padding:"16px 48px", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", fontWeight:500, cursor:"pointer", borderRadius:4, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 2px 12px rgba(15,12,10,0.22)", display:"block", width:"100%", marginBottom:14, touchAction:"manipulation", WebkitTapHighlightColor:"rgba(0,0,0,0)", minHeight:50 }}>
          Find My Mode →
        </button>
        <p style={{ fontSize:11, color:T.muted }}>Free · account required · syncs across all your devices</p>
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState("loading");
  const [email, setEmail] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [weekHistory, setWeekHistory] = useState([]);
  const [weekData, setWeekData] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [stratLoading, setStratLoading] = useState(false);
  const [stratKey, setStratKey] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showFocusStyle, setShowFocusStyle] = useState(false);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const link=document.createElement("link"); link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
    const s=document.createElement("style");
    s.textContent=`*{box-sizing:border-box;margin:0;padding:0;}body{background:#F5F2ED;}input:focus{outline:none;}`;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    (async () => {
      // 1. Try Supabase session
      const sb = getSupabase();
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session?.user?.email) {
            await loadUserData(session.user.email);
            return;
          }
        } catch {}
      }
      // 2. Try last known email from localStorage
      try {
        const raw = localStorage.getItem("mos_last_email");
        if (raw) {
          const lastEmail = JSON.parse(raw);
          const rawProfile = localStorage.getItem(`mos_${lastEmail.toLowerCase().replace(/[^a-z0-9]/g,"_")}_profile`);
          if (rawProfile) {
            await loadUserData(lastEmail);
            return;
          }
        }
      } catch {}
      setAppState("intro");
    })();
  }, []);

  const loadUserData = async (e) => {
    try {
      const p=await db.get(e,"profile"), h=await db.get(e,"history"), w=await db.get(e,"week"), wh=await db.get(e,"weekHistory");
      setEmail(e);
      if(p){ setProfile(p); setHistory(h||[]); setWeekData(w||null); setWeekHistory(wh||[]); setAppState("app"); }
      else setAppState("onboarding");
    } catch { setEmail(e); setAppState("onboarding"); }
  };

  const handleLogin = async (e) => {
    try { localStorage.setItem("mos_last_email", JSON.stringify(e)); } catch {}
    try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }
  };

  useEffect(() => {
    if(!weekData||!profile||!email) return;
    if(weekData.week!==weekKey()){
      const oldEntry={ weekStart:weekData.week, modeId:profile.modeId, focusLane:strategy?.focusLane||"", done:(weekData.tasks||[]).filter(t=>t.done).length, total:(weekData.tasks||[]).length };
      const newWH=[...weekHistory,oldEntry]; setWeekHistory(newWH); db.set(email,"weekHistory",newWH);
      const reset={ week:weekKey(), tasks:[] }; setWeekData(reset); db.set(email,"week",reset); setStratKey(k=>k+1);
    }
  }, [weekData]);

  useEffect(() => {
    if(!profile||appState!=="app") return;
    setStratLoading(true); setStrategy(null);
    fetchStrategy(profile, profile.modeId||"build", analysePatterns(history, weekHistory, profile.modeId||"build")).then(r=>{setStrategy(r);setStratLoading(false);}).catch(()=>setStratLoading(false));
  }, [stratKey]);

  const saveProfile=async p=>{await db.set(email,"profile",p);setProfile(p);};
  const saveHistory=async h=>{await db.set(email,"history",h);setHistory(h);};
  const saveWeek=async w=>{
    // Support functional updates
    const resolved = typeof w === "function" ? w(weekData) : w;
    await db.set(email,"week",resolved); setWeekData(resolved);
  };

  const onboard = async data => {
    const safeMode = data.modeId || calcMode(
      Object.entries(data.answers||{}).map(([qId,optIdx])=>({qId,optIdx:Number(optIdx)}))
    ) || "build";
    const p = {
      name: data.name||"", title: data.title||"", skills: data.skills||[],
      lanes: data.lanes||[], customLanes: data.customLanes||[],
      activeLanes: data.lanes||[], modeId: safeMode,
      answers: data.answers||{}, focusStyle: data.focusStyle||"deep",
    };
    const h = [{ date: new Date().toISOString(), modeId: safeMode }];
    const w = { week: weekKey(), tasks: [] };
    let activeEmail = email;
    if (!activeEmail) {
      try { const s = localStorage.getItem("mos_last_email"); activeEmail = s ? JSON.parse(s) : null; } catch {}
    }
    if (activeEmail) {
      try { localStorage.setItem("mos_last_email", JSON.stringify(activeEmail)); } catch {}
      setEmail(activeEmail);
      await db.set(activeEmail, "profile", p);
      await db.set(activeEmail, "history", h);
      await db.set(activeEmail, "week", w);
    }
    setProfile(p);
    setHistory(h);
    setWeekData(w);
    setAppState("app");
    setStratKey(k => k + 1);
  };

  const switchMode=async({modeId,answers})=>{
    const updated={...profile,modeId,answers};
    const newH=[...history,{date:new Date().toISOString(),modeId}];
    const newW={week:weekKey(),tasks:[]};
    await saveProfile(updated); await saveHistory(newH); await db.set(email,"week",newW); setWeekData(newW);
    setShowSwitch(false); setStratKey(k=>k+1);
  };

  const changeFocusStyle=async(style)=>{
    const updated={...profile,focusStyle:style};
    await saveProfile(updated);
    // Reset tasks so fallback + AI can re-seed for new style
    const newW={week:weekKey(),tasks:[]}; await db.set(email,"week",newW); setWeekData(newW);
    setShowFocusStyle(false); setStratKey(k=>k+1);
  };

  const checkInStay=async()=>{
    const wkEntry={ weekStart:weekData?.week||weekKey(), modeId:profile.modeId, focusLane:strategy?.focusLane||"", done:(weekData?.tasks||[]).filter(t=>t.done).length, total:(weekData?.tasks||[]).length };
    const newWH=[...weekHistory,wkEntry]; setWeekHistory(newWH); await db.set(email,"weekHistory",newWH);
    setShowCheckIn(false); setStratKey(k=>k+1);
  };

  const editDone=async data=>{
    const updated={...profile,name:data.name,title:data.title,skills:data.skills,lanes:data.lanes,customLanes:data.customLanes};
    await saveProfile(updated); setEditing(false); setStratKey(k=>k+1);
  };

  const weeklyReviewComplete = async ({ reviewAnswers, newModeId, newAnswers }) => {
    // Log the week
    const wkEntry = { weekStart:weekData?.week||weekKey(), modeId:profile.modeId, focusLane:strategy?.focusLane||"", done:(weekData?.tasks||[]).filter(t=>t.done).length, total:(weekData?.tasks||[]).length, review:reviewAnswers };
    const newWH = [...weekHistory, wkEntry];
    setWeekHistory(newWH); await db.set(email,"weekHistory",newWH);
    // Apply new mode
    const updated = { ...profile, modeId:newModeId, answers:newAnswers||profile.answers };
    const newH = [...history, { date:new Date().toISOString(), modeId:newModeId }];
    const newW = { week:weekKey(), tasks:[] };
    await saveProfile(updated); await saveHistory(newH); await db.set(email,"week",newW); setWeekData(newW);
    setShowWeeklyReview(false); setStratKey(k=>k+1);
  };

  const patterns = analysePatterns(history, weekHistory, profile?.modeId||"build");

  if(appState==="loading") return <div style={{background:"#F5F2ED",minHeight:"100vh"}}/>;
  if(appState==="intro") return <Intro onStart={()=>setAppState("login")}/>;
  if(appState==="login") return <SoftLogin onLogin={handleLogin}/>;
  if(appState==="onboarding") return <Wizard onDone={onboard}/>;
  if(editing) return <Wizard init={profile} onDone={editDone} onCancel={()=>setEditing(false)}/>;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#F5F2ED",minHeight:"100vh",color:"#0F0C0A"}}>
      {tab==="dashboard" && <Dashboard profile={profile} strategy={strategy} stratLoading={stratLoading} weekData={weekData} onUpdateWeek={saveWeek} onSwitch={()=>setShowSwitch(true)} onEdit={()=>setEditing(true)} onCheckIn={()=>setShowCheckIn(true)} onFocusStyleChange={()=>setShowFocusStyle(true)} patterns={patterns}/>}
      {tab==="today"     && <DailyView  profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onCapture={()=>setTab("capture")}/>}
      {tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onReview={()=>setShowWeeklyReview(true)}/>}
      {tab==="history"   && <History    history={history} weekHistory={weekHistory} weekData={weekData}/>}
      {tab==="pulse"     && <Pulse      profile={profile} strategy={strategy}/>}
      {tab==="focus"     && <WeeklyFocus profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onCapture={()=>setTab("capture")}/>}
      {tab==="capture"   && <Capture    profile={profile} weekData={weekData} onUpdateWeek={saveWeek} onAddToPriority={()=>setTab("focus")}/>}
      {tab==="share"     && <Share      profile={profile} strategy={strategy} weekData={weekData}/>}
      <TabBar tab={tab} setTab={setTab}/>
      {showSwitch        && <SwitchSheet onSave={switchMode} onClose={()=>setShowSwitch(false)}/>}
      {showCheckIn       && <CheckInSheet onStay={checkInStay} onSwitch={()=>{setShowCheckIn(false);setShowSwitch(true);}} onClose={()=>setShowCheckIn(false)}/>}
      {showFocusStyle    && <FocusStyleSheet current={profile.focusStyle} onSave={changeFocusStyle} onClose={()=>setShowFocusStyle(false)}/>}
      {showWeeklyReview  && <WeeklyReview profile={profile} weekData={weekData} history={history} weekHistory={weekHistory} onComplete={weeklyReviewComplete} onClose={()=>setShowWeeklyReview(false)}/>}
    </div>
  );
}

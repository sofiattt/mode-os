const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
let count = 0;

function patch(desc, oldStr, newStr) {
  if (c.includes(newStr.slice(0, 50))) {
    console.log(`✓ ${desc} — already applied`);
    return;
  }
  if (c.includes(oldStr)) {
    c = c.replaceAll(oldStr, newStr);
    count++;
    console.log(`✓ ${desc}`);
  } else {
    console.log(`✗ ${desc} — not found`);
  }
}

// ── ONBOARD: fix db.set → sbSet (these use activeEmail not email) ──
patch('Onboard profile save',
  'await db.set(activeEmail, "profile", p);',
  'await sbSet(activeEmail, "profile", p);'
);
patch('Onboard history save',
  'await db.set(activeEmail, "history", h);',
  'await sbSet(activeEmail, "history", h);'
);
patch('Onboard week save',
  'await db.set(activeEmail, "week", w);',
  'await sbSet(activeEmail, "week", w);'
);
patch('Onboard old localStorage',
  'try { localStorage.setItem("mos_last_email", JSON.stringify(activeEmail)); } catch {}',
  'localStorage.setItem("mos_session_email", activeEmail);'
);
patch('Onboard setEmail call',
  'setEmail(activeEmail);\n      await sbSet(activeEmail, "profile", p);',
  'setEmail(activeEmail); localStorage.setItem("mos_session_email", activeEmail);\n      await sbSet(activeEmail, "profile", p);'
);

// ── SESSION: init useEffect ──
patch('Session persistence',
  'setAppState("intro");\n  }, []);',
  '(async () => {\n      try {\n        const savedEmail = localStorage.getItem("mos_session_email");\n        if (savedEmail) { await loadUserData(savedEmail); return; }\n      } catch {}\n      setAppState("intro");\n    })();\n  }, []);'
);

// ── SESSION: save on login ──
patch('Save email on login',
  'try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }',
  'try {\n      localStorage.setItem("mos_session_email", e);\n      await loadUserData(e);\n    } catch { setEmail(e); setAppState("onboarding"); }'
);

// ── PULSE: add sbGetFeed if missing ──
patch('Add sbGetFeed function',
  'async function sbSet(email, k, v) {',
  'async function sbGetFeed(wk) {\n  if (!SB_URL || !SB_KEY) return [];\n  try {\n    const res = await fetch(\n      `${SB_URL}/rest/v1/user_data?key=eq.${encodeURIComponent("pulse_"+wk)}&select=email,value&order=updated_at.desc`,\n      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }\n    );\n    if (!res.ok) return [];\n    const rows = await res.json();\n    return rows.map(r => r.value).filter(Boolean);\n  } catch { return []; }\n}\n\nasync function sbSet(email, k, v) {'
);

// ── PULSE: fix email prop ──
patch('Pulse email prop',
  'tab==="pulse"     && <Pulse      profile={profile} strategy={strategy}/>}',
  'tab==="pulse"     && <Pulse      profile={profile} strategy={strategy} email={email}/>}'
);
patch('Pulse signature',
  'function Pulse({ profile, strategy }) {',
  'function Pulse({ profile, strategy, email }) {'
);

// ── PULSE: replace localStorage loadFeed with Supabase ──
patch('Pulse loadFeed Supabase',
  `  const loadFeed = () => {
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
  };`,
  `  const wk = weekKey();
  const loadFeed = async () => {
    const posts = await sbGetFeed(wk);
    posts.sort((a,b) => (b.ts||0) - (a.ts||0));
    setFeed(posts);
    const counts = {};
    posts.forEach(e => { counts[e.mode] = (counts[e.mode]||0) + 1; });
    setModeCounts(counts);
  };`
);

// ── PULSE: fix hasPostedThisWeek ──
patch('Pulse hasPosted check',
  "feed.some(e => e.name === profile.name && e.week === weekKey())",
  "feed.some(e => e.email === (email||profile.email||'') && e.week === wk)"
);

// ── PULSE: fix submitPost ──
patch('Pulse submitPost Supabase',
  `  const submitPost = (text) => {
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
      localStorage.setItem(\`mos_pulse_\${profile.name}_\${Date.now()}\`, JSON.stringify(entry));
    } catch {}
    setStep("posted");
    loadFeed();
  };`,
  `  const submitPost = async (text) => {
    if (!text.trim()) return;
    const userEmail = email || profile.email || "";
    const entry = {
      email: userEmail,
      name: profile.name,
      mode: profile.modeId,
      lane: focusLane,
      callout: text.trim(),
      ts: Date.now(),
      week: wk,
      postedAt: new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),
    };
    await sbSet(userEmail, "pulse_"+wk, entry);
    setStep("posted");
    await loadFeed();
  };`
);

// ── PULSE: fix myPost lookup ──
patch('Pulse myPost check',
  "feed.find(e => e.name === profile.name && e.week === weekKey())",
  "feed.find(e => e.email === (email||profile.email||'') && e.week === wk)"
);

// ── PULSE: fix feed isYou check ──
patch('Pulse isYou check',
  "const isYou = entry.name === profile.name;",
  "const isYou = entry.email === (email||profile.email||'');"
);

// ── DASHBOARD: loading state ──
patch('Dashboard loading state',
  '<TaskList tasks={tasks} isLight={isLight} onToggle={toggleTask} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})} compact/>',
  '{stratLoading && tasks.length === 0 ? (<div style={{ padding:"20px 18px", textAlign:"center" }}><p style={{ fontSize:13, color:T.muted, fontStyle:"italic" }}>Generating your strategy...</p></div>) : (<TaskList tasks={tasks} isLight={isLight} onToggle={toggleTask} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})} compact/>)}'
);

// ── THISWEEK: stratLoading ──
patch('ThisWeek prop',
  'tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onReview={()=>setShowWeeklyReview(true)}/>}',
  'tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} stratLoading={stratLoading} onReview={()=>setShowWeeklyReview(true)}/>}'
);
patch('ThisWeek signature',
  'function ThisWeek({ profile, weekData, onUpdateWeek, strategy, onReview }) {',
  'function ThisWeek({ profile, weekData, onUpdateWeek, strategy, stratLoading, onReview }) {'
);

fs.writeFileSync('src/App.js', c);
console.log(`\nComplete — ${count} patches applied`);

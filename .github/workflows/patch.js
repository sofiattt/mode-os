const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
let count = 0;

function patch(desc, oldStr, newStr) {
  if (c.includes(newStr.slice(0, 40))) {
    console.log(`✓ ${desc} — already applied`);
    return;
  }
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    count++;
    console.log(`✓ ${desc}`);
  } else {
    console.log(`✗ ${desc} — string not found`);
  }
}

patch(
  'Session persistence',
  `setAppState("intro");
  }, []);`,
  `(async () => {
      try {
        const savedEmail = localStorage.getItem("mos_session_email");
        if (savedEmail) { await loadUserData(savedEmail); return; }
      } catch {}
      setAppState("intro");
    })();
  }, []);`
);

patch(
  'Save email on login',
  `try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }`,
  `try {
      localStorage.setItem("mos_session_email", e);
      await loadUserData(e);
    } catch { setEmail(e); setAppState("onboarding"); }`
);

if (!c.includes('localStorage.setItem("mos_session_email", email)')) {
  patch(
    'Save email on onboard',
    `await sbSet(email, "profile", p);
      await sbSet(email, "history", h);`,
    `localStorage.setItem("mos_session_email", email);
      await sbSet(email, "profile", p);
      await sbSet(email, "history", h);`
  );
}

patch(
  'Pulse email prop',
  `tab==="pulse"     && <Pulse      profile={profile} strategy={strategy}/>}`,
  `tab==="pulse"     && <Pulse      profile={profile} strategy={strategy} email={email}/>}`
);

patch(
  'Pulse signature',
  `function Pulse({ profile, strategy }) {`,
  `function Pulse({ profile, strategy, email }) {`
);

patch(
  'Pulse userEmail fix',
  `const hasPostedThisWeek = feed.some(e => e.name === profile.name && e.week === weekKey());

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
      localStorage.setItem(\`mos_pulse_\${profile.name}_\${Date.now()}\`, JSON.stringify(entry));
    } catch {}
    setStep("posted");
    loadFeed();
  };

  const myPost = feed.find(e => e.name === profile.name && e.week === weekKey());`,
  `const userEmail = email || profile.email || "";
  const hasPostedThisWeek = feed.some(e => e.email === userEmail && e.week === wk);

  const submitPost = async (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const entry = {
      email: userEmail,
      name: profile.name,
      mode: profile.modeId,
      lane: focusLane,
      callout: text.trim(),
      ts: Date.now(),
      week: wk,
      postedAt: now.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" }),
    };
    await sbSet(userEmail, \`pulse_\${wk}\`, entry);
    setStep("posted");
    await loadFeed();
  };

  const myPost = feed.find(e => e.email === userEmail && e.week === wk);`
);

patch(
  'ThisWeek stratLoading prop',
  `tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onReview={()=>setShowWeeklyReview(true)}/>}`,
  `tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} stratLoading={stratLoading} onReview={()=>setShowWeeklyReview(true)}/>}`
);

patch(
  'ThisWeek signature',
  `function ThisWeek({ profile, weekData, onUpdateWeek, strategy, onReview }) {`,
  `function ThisWeek({ profile, weekData, onUpdateWeek, strategy, stratLoading, onReview }) {`
);

patch(
  'Dashboard loading state',
  `<TaskList tasks={tasks} isLight={isLight} onToggle={toggleTask} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})} compact/>`,
  `{stratLoading && tasks.length === 0 ? (
          <div style={{ padding:"20px 18px", textAlign:"center" }}>
            <p style={{ fontSize:13, color:T.muted, fontStyle:"italic" }}>Generating your strategy...</p>
          </div>
        ) : (
          <TaskList tasks={tasks} isLight={isLight} onToggle={toggleTask} onNote={noteTask} onTimer={(i,t)=>setTimer({idx:i,seconds:parseMin(t.time)*60,label:t.action})} compact/>
        )}`
);

patch(
  'Dashboard hide empty task header',
  `{tasks.length>0 && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <p style={{ fontSize:14, color:done===tasks.length?"#2A7A4A":T.ink, fontWeight:600 }}>
                    {done}/{tasks.length} tasks completed{done===tasks.length?" ✓":""}
                  </p>`,
  `{tasks.length>0 && !stratLoading && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <p style={{ fontSize:14, color:done===tasks.length?"#2A7A4A":T.ink, fontWeight:600 }}>
                    {done}/{tasks.length} tasks completed{done===tasks.length?" ✓":""}
                  </p>`
);

patch(
  'Onboard email guard',
  `  const onboard = async data => {`,
  `  const onboard = async data => {
    const activeEmail = email || (() => { try { return localStorage.getItem("mos_session_email"); } catch { return null; } })();
    if (activeEmail && !email) setEmail(activeEmail);`
);

patch(
  'Onboard use activeEmail',
  `    if (email) {
      localStorage.setItem("mos_session_email", email);
      await sbSet(email, "profile", p);
      await sbSet(email, "history", h);
      await sbSet(email, "week", w);
    }`,
  `    if (activeEmail) {
      localStorage.setItem("mos_session_email", activeEmail);
      await sbSet(activeEmail, "profile", p);
      await sbSet(activeEmail, "history", h);
      await sbSet(activeEmail, "week", w);
    }`
);

fs.writeFileSync('src/App.js', c);
console.log(`\nComplete — ${count} patches applied`);

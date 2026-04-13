const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
let count = 0;

function patch(desc, oldStr, newStr) {
  if (c.includes(newStr.slice(0, 50))) {
    console.log('already: ' + desc);
    return;
  }
  if (c.includes(oldStr)) {
    c = c.replaceAll(oldStr, newStr);
    count++;
    console.log('applied: ' + desc);
  } else {
    console.log('missing: ' + desc);
  }
}

// Fix 1: onboard still calls db.set(activeEmail) which doesn't exist
patch('onboard profile', 'await db.set(activeEmail, "profile", p);', 'await sbSet(activeEmail, "profile", p);');
patch('onboard history', 'await db.set(activeEmail, "history", h);', 'await sbSet(activeEmail, "history", h);');
patch('onboard week',    'await db.set(activeEmail, "week", w);',    'await sbSet(activeEmail, "week", w);');
patch('onboard ls old',
  'try { localStorage.setItem("mos_last_email", JSON.stringify(activeEmail)); } catch {}',
  'localStorage.setItem("mos_session_email", activeEmail);'
);

// Fix 2: session persistence
patch('session init',
  'setAppState("intro");\n  }, []);',
  '(async()=>{ try { const e=localStorage.getItem("mos_session_email"); if(e){await loadUserData(e);return;} } catch{} setAppState("intro"); })();\n  }, []);'
);

// Fix 3: save email on login
patch('login email save',
  'try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }',
  'try { localStorage.setItem("mos_session_email",e); await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }'
);

// Fix 4: add sbGetFeed if missing
if (!c.includes('async function sbGetFeed')) {
  c = c.replace('async function sbSet(email, k, v) {',
    'async function sbGetFeed(wk) {\n  if(!SB_URL||!SB_KEY) return [];\n  try {\n    const res=await fetch(`${SB_URL}/rest/v1/user_data?key=eq.pulse_${encodeURIComponent(wk)}&select=email,value&order=updated_at.desc`,{headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`}});\n    if(!res.ok) return [];\n    const rows=await res.json();\n    return rows.map(r=>r.value).filter(Boolean);\n  } catch{return [];}\n}\n\nasync function sbSet(email, k, v) {'
  );
  count++; console.log('applied: sbGetFeed');
} else { console.log('already: sbGetFeed'); }

// Fix 5: pulse email prop
patch('pulse email prop',
  'tab==="pulse"     && <Pulse      profile={profile} strategy={strategy}/>}',
  'tab==="pulse"     && <Pulse      profile={profile} strategy={strategy} email={email}/>}'
);
patch('pulse signature',
  'function Pulse({ profile, strategy }) {',
  'function Pulse({ profile, strategy, email }) {'
);

// Fix 6: pulse loadFeed - replace localStorage with Supabase
const oldLoadFeed = `  const loadFeed = () => {
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
  };`;
const newLoadFeed = `  const wk = weekKey();
  const loadFeed = async () => {
    const posts = await sbGetFeed(wk);
    posts.sort((a,b)=>(b.ts||0)-(a.ts||0));
    setFeed(posts);
    const counts={};
    posts.forEach(e=>{counts[e.mode]=(counts[e.mode]||0)+1;});
    setModeCounts(counts);
  };`;
patch('pulse loadFeed', oldLoadFeed, newLoadFeed);

// Fix 7: pulse hasPosted
patch('pulse hasPosted',
  'feed.some(e => e.name === profile.name && e.week === weekKey())',
  "feed.some(e=>e.email===(email||profile.email||'')&&e.week===wk)"
);

// Fix 8: pulse submitPost
const oldSubmit = `  const submitPost = (text) => {
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
  };`;
const newSubmit = `  const submitPost = async (text) => {
    if(!text.trim()) return;
    const ue=email||profile.email||"";
    const entry={email:ue,name:profile.name,mode:profile.modeId,lane:focusLane,callout:text.trim(),ts:Date.now(),week:wk,postedAt:new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})};
    await sbSet(ue,"pulse_"+wk,entry);
    setStep("posted");
    await loadFeed();
  };`;
patch('pulse submitPost', oldSubmit, newSubmit);

// Fix 9: pulse myPost
patch('pulse myPost',
  'feed.find(e => e.name === profile.name && e.week === weekKey())',
  "feed.find(e=>e.email===(email||profile.email||'')&&e.week===wk)"
);

// Fix 10: pulse isYou
patch('pulse isYou',
  'const isYou = entry.name === profile.name;',
  "const isYou=entry.email===(email||profile.email||'');"
);

fs.writeFileSync('src/App.js', c);
console.log('done — ' + count + ' patches applied');

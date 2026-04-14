const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
let count = 0;

function patch(desc, oldStr, newStr) {
  if (c.includes(newStr.slice(0, 50))) {
    console.log('already: ' + desc);
    return;
  }
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    count++;
    console.log('applied: ' + desc);
  } else {
    console.log('missing: ' + desc);
  }
}

// Fix: Restore SB_URL and SB_KEY constants before sbSet function
patch('restore SB constants',
  'async function sbSet(email, k, v) {',
  'const SB_URL = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_URL) || "").replace(/\\s/g, "");\nconst SB_KEY = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "").replace(/\\s/g, "");\n\nasync function sbSet(email, k, v) {'
);

// Fix: Restore sbGet function if missing
if (!c.includes('async function sbGet(')) {
  c = c.replace(
    'async function sbSet(email, k, v) {',
    'async function sbGet(email, k) {\n  if (!SB_URL || !SB_KEY) return null;\n  try {\n    const res = await fetch(\n      `${SB_URL}/rest/v1/user_data?email=eq.${encodeURIComponent(email)}&key=eq.${encodeURIComponent(k)}&select=value&limit=1`,\n      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }\n    );\n    if (!res.ok) return null;\n    const rows = await res.json();\n    return rows?.[0]?.value ?? null;\n  } catch { return null; }\n}\n\nasync function sbSet(email, k, v) {'
  );
  count++;
  console.log('applied: restore sbGet');
} else {
  console.log('already: sbGet exists');
}

// Fix: session persistence
patch('session persistence',
  'setAppState("intro");\n  }, []);',
  '(async()=>{\n      try{\n        const sv=localStorage.getItem("mos_session_email");\n        if(sv){await loadUserData(sv);return;}\n      }catch{}\n      setAppState("intro");\n    })();\n  }, []);'
);

// Fix: save email on login
patch('save email on login',
  'try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }',
  'try{localStorage.setItem("mos_session_email",e);await loadUserData(e);}catch{setEmail(e);setAppState("onboarding");}'
);

fs.writeFileSync('src/App.js', c);
console.log('done — ' + count + ' patches applied');

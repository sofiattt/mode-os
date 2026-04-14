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

// Fix 1: Strip whitespace from SB_KEY so line breaks don't break auth
patch('SB_KEY whitespace fix',
  'const SB_KEY = (typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "";',
  'const SB_KEY = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "").replace(/\\s/g, "");'
);

// Fix 2: Session persistence - stay logged in on refresh
patch('session persistence',
  'setAppState("intro");\n  }, []);',
  '(async()=>{\n      try{\n        const sv=localStorage.getItem("mos_session_email");\n        if(sv){await loadUserData(sv);return;}\n      }catch{}\n      setAppState("intro");\n    })();\n  }, []);'
);

// Fix 3: Save email on login
patch('save email on login',
  'try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }',
  'try{localStorage.setItem("mos_session_email",e);await loadUserData(e);}catch{setEmail(e);setAppState("onboarding");}'
);

// Fix 4: Save email on onboard
if (!c.includes('localStorage.setItem("mos_session_email"')) {
  patch('save email on onboard',
    'await sbSet(email, "profile", p);',
    'localStorage.setItem("mos_session_email",email||"");\n      await sbSet(email, "profile", p);'
  );
}

fs.writeFileSync('src/App.js', c);
console.log('done — ' + count + ' patches applied');

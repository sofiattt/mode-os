const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
const before = c;

// The only reason data never saves: onboard still calls db.set(activeEmail,...)
// db object was removed, so these silently fail. Simple global replace.
c = c.replaceAll('db.set(activeEmail,', 'sbSet(activeEmail,');
c = c.replaceAll('db.get(activeEmail,', 'sbGet(activeEmail,');

// Fix old localStorage key on onboard
c = c.replace(
  'try { localStorage.setItem("mos_last_email", JSON.stringify(activeEmail)); } catch {}',
  'localStorage.setItem("mos_session_email", activeEmail);'
);

// Session: stay logged in on refresh
if (!c.includes('mos_session_email')) {
  c = c.replace(
    'setAppState("intro");\n  }, []);',
    '(async()=>{try{const sv=localStorage.getItem("mos_session_email");if(sv){await loadUserData(sv);return;}}catch{}setAppState("intro");})();\n  }, []);'
  );
}

// Save email on login
c = c.replace(
  'try { await loadUserData(e); } catch { setEmail(e); setAppState("onboarding"); }',
  'try{localStorage.setItem("mos_session_email",e);await loadUserData(e);}catch{setEmail(e);setAppState("onboarding");}'
);

const changed = c !== before;
fs.writeFileSync('src/App.js', c);
console.log(changed ? 'Patches applied' : 'No changes needed');

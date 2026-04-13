const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');

c = c.replace(
  "setAppState(\"intro\");\n  }, []);",
  "(async () => {\n      try {\n        const savedEmail = localStorage.getItem(\"mos_session_email\");\n        if (savedEmail) { await loadUserData(savedEmail); return; }\n      } catch {}\n      setAppState(\"intro\");\n    })();\n  }, []);"
);

c = c.replace(
  "try { await loadUserData(e); } catch { setEmail(e); setAppState(\"onboarding\"); }",
  "try {\n      localStorage.setItem(\"mos_session_email\", e);\n      await loadUserData(e);\n    } catch { setEmail(e); setAppState(\"onboarding\"); }"
);

c = c.replace(
  '{tab==="pulse"     && <Pulse      profile={profile} strategy={strategy}/>}',
  '{tab==="pulse"     && <Pulse      profile={profile} strategy={strategy} email={email}/>}'
);

c = c.replace(
  'function Pulse({ profile, strategy }) {',
  'function Pulse({ profile, strategy, email }) {'
);

c = c.replace(
  '{tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} onReview={()=>setShowWeeklyReview(true)}/>}',
  '{tab==="week"      && <ThisWeek   profile={profile} weekData={weekData} onUpdateWeek={saveWeek} strategy={strategy} stratLoading={stratLoading} onReview={()=>setShowWeeklyReview(true)}/>}'
);

c = c.replace(
  'function ThisWeek({ profile, weekData, onUpdateWeek, strategy, onReview }) {',
  'function ThisWeek({ profile, weekData, onUpdateWeek, strategy, stratLoading, onReview }) {'
);

fs.writeFileSync('src/App.js', c);
console.log('Done');

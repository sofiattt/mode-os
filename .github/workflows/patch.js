const fs = require('fs');
let c = fs.readFileSync('src/App.js', 'utf8');
let count = 0;

// Remove the duplicate SB_URL/SB_KEY block that was added before sbSet
const dupBlock = 'const SB_URL = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_URL) || "").replace(/\\s/g, "");\nconst SB_KEY = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "").replace(/\\s/g, "");\n\nasync function sbSet(email, k, v) {';
const cleanBlock = 'async function sbSet(email, k, v) {';

if (c.includes(dupBlock)) {
  c = c.replace(dupBlock, cleanBlock);
  count++;
  console.log('applied: removed duplicate SB constants');
} else {
  console.log('missing: duplicate block not found');
}

// Now fix the ORIGINAL SB_KEY line to strip whitespace
const oldKey = 'const SB_KEY = (typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "";';
const newKey = 'const SB_KEY = ((typeof process !== "undefined" && process.env?.REACT_APP_SUPABASE_KEY) || "").replace(/\\s/g, "");';
if (c.includes(newKey.slice(0, 50))) {
  console.log('already: SB_KEY whitespace fix');
} else if (c.includes(oldKey)) {
  c = c.replace(oldKey, newKey);
  count++;
  console.log('applied: SB_KEY whitespace fix');
} else {
  console.log('missing: SB_KEY original line');
}

// Session persistence
const sessNew = '(async()=>{\n      try{\n        const sv=localStorage.getItem("mos_session_email");\n        if(sv){await loadUserData(sv);return;}\n      }catch{}\n      setAppState("intro");\n    })();\n  }, []);';
if (!c.includes(sessNew.slice(0, 30))) {
  const sessOld = 'setAppState("intro");\n  }, []);';
  if (c.includes(sessOld)) {
    c = c.replace(sessOld, sessNew);
    count++;
    console.log('applied: session persistence');
  } else {
    console.log('missing: session persistence');
  }
} else {
  console.log('already: session persistence');
}

fs.writeFileSync('src/App.js', c);
console.log('done — ' + count + ' patches applied');

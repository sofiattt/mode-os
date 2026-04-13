const fs = require('fs');

// Fetch the clean working version from the last good commit
const { execSync } = require('child_process');

// Get the commit hash of the last working build (9a2649a = Update patch.js, before the broken ones)
// We need to find the commit just before the syntax errors started
const log = execSync('git log --oneline -10').toString();
console.log('Recent commits:\n' + log);

// Find the last commit that said "fix: session, pulse, task flash"
const lines = log.split('\n');
let targetHash = null;
for (const line of lines) {
  if (line.includes('fix: session, pulse, task flash')) {
    targetHash = line.split(' ')[0];
    break;
  }
}

if (targetHash) {
  console.log('Restoring App.js from commit: ' + targetHash);
  const content = execSync('git show ' + targetHash + ':src/App.js').toString();
  
  // Apply ONLY the safe single-line fixes
  let c = content;
  
  // Fix onboard db.set → sbSet
  c = c.replaceAll('db.set(activeEmail,', 'sbSet(activeEmail,');
  c = c.replaceAll('db.get(activeEmail,', 'sbGet(activeEmail,');
  c = c.replace(
    'try { localStorage.setItem("mos_last_email", JSON.stringify(activeEmail)); } catch {}',
    'localStorage.setItem("mos_session_email", activeEmail);'
  );
  
  fs.writeFileSync('src/App.js', c);
  console.log('Done — restored and patched');
} else {
  console.log('Could not find target commit, logging all commits:');
  console.log(execSync('git log --oneline -20').toString());
}

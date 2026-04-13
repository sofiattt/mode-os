// Fix: Ensure email is captured before onboard writes
patch(
  'Onboard email guard fix',
  `  const onboard = async data => {`,
  `  const onboard = async data => {
    // Ensure email is set from login flow
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

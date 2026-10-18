// Applies a stored theme choice before the first paint, so a dark choice never flashes light. Runs synchronously
// from <head>; the CMS's Content Security Policy allows scripts only from the CMS itself, so this is a file.
try {
  const stored = window.localStorage.getItem("nihonest-cms:theme");
  if (stored === "light" || stored === "dark") document.documentElement.dataset.theme = stored;
} catch { /* Storage can be unavailable; the theme then follows the operating system. */ }

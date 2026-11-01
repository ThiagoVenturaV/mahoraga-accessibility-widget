const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

// Find all i18n dictionaries or addons configuration
const jsonMatches = content.match(/\{[^{}]*"librasTranslator"[^{}]*\}/g);
console.log('--- librasTranslator matches ---');
if (jsonMatches) {
  jsonMatches.forEach(m => console.log(m));
}

// Find addon list
const addonsMatch = content.match(/addonsMap[^{]*\{([^}]+)\}/);
if (addonsMatch) {
  console.log('--- addonsMap ---', addonsMatch[0]);
}

// Search for any large object with keys like highContrast, fontSize, etc.
const objMatch = content.match(/\{[a-zA-Z0-9_]+:\{[^{}]*name:[^{}]*\}\}/g);
if (objMatch) {
  console.log('--- addon definitions ---', objMatch.slice(0, 10));
}

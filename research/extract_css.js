const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

// Find injected styles
const styleMatches = content.match(/style[a-zA-Z0-9_]*\.innerHTML\s*=\s*`([^`]+)`/g);
if (styleMatches) {
  console.log('--- innerHTML styles ---');
  styleMatches.forEach(m => console.log(m.substring(0, 200)));
}

// Find any CSS rules containing filter, font-family, etc.
const cssRules = content.match(/`[^`]*(?:filter:|line-height:|letter-spacing:|contrast|invert)[^`]*`/g);
if (cssRules) {
  console.log('--- CSS snippets ---');
  cssRules.slice(0, 10).forEach(r => console.log(r.substring(0, 150)));
}

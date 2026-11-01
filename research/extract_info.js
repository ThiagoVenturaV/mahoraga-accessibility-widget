const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

// Look for default configurations
const defaultConfigMatch = content.match(/defaultConfig\s*=\s*\{([^}]+)\}/);
console.log('--- Default Config Match ---');
if (defaultConfigMatch) {
  console.log(defaultConfigMatch[0]);
}

// Find object definitions containing avatar, align, etc.
const configSnippets = content.match(/\{[^{}]*(?:avatar|align|token|maxTextSize)[^{}]*\}/g);
console.log('--- Config Snippets ---');
if (configSnippets) {
  configSnippets.slice(0, 10).forEach(s => console.log(s));
}

// Find iframe URLs or domains accessed
const urls = content.match(/https?:\/\/[^\s"'`]+/g);
console.log('--- URLs found ---');
if (urls) {
  const uniqueUrls = [...new Set(urls)];
  uniqueUrls.forEach(u => console.log(u));
}

const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

const idx = content.indexOf('addonsMap:');
if (idx !== -1) {
  console.log(content.substring(idx - 50, idx + 800));
}

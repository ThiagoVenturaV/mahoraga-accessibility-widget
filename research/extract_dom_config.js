const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

const idx = content.indexOf('ukZaC:[function');
if (idx !== -1) {
  console.log(content.substring(idx, idx + 1500));
}

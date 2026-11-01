const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

const idx = content.indexOf('buildIgnoreGroup');
if (idx !== -1) {
  console.log(content.substring(idx - 100, idx + 1000));
}

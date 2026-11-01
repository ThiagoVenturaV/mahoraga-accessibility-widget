const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'handtalk.min.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size (bytes):', content.length);

const keywords = [
  'avatar', 'HUGO', 'MAYA', 'libras', 'contrast', 'highContrast',
  'fontSize', 'speed', 'dictionary', 'glossary', 'shortcuts',
  'text-to-speech', 'speech', 'collector', 'highlight', 'modal',
  'button', 'widget', 'panel', 'drag', 'position', 'align',
  'iframe', 'player', 'subtitles', 'legendas', 'speedRate'
];

keywords.forEach(k => {
  const regex = new RegExp(k, 'gi');
  const count = (content.match(regex) || []).length;
  console.log(`${k}: ${count}`);
});

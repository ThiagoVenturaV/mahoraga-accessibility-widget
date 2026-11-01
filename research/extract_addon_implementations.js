const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

const addons = [
  'contrastMode', 'saturationMode', 'pageColors',
  'fontSize', 'textStyle', 'lineHeight', 'letterSpacing', 'highlightLetters',
  'pageSpeech', 'readerMode', 'readingMask', 'readingGuide', 'highlightLinks',
  'pageStructure', 'magnifier', 'hideImages', 'highlightHeadings',
  'pauseAnimations', 'disableSounds', 'signTranslator', 'synonymsMeanings'
];

addons.forEach(addon => {
  const idx = content.indexOf(addon);
  if (idx !== -1) {
    console.log(`=== Addon: ${addon} ===`);
    // Print around occurrences
    let pos = 0;
    let occurrences = 0;
    while ((pos = content.indexOf(addon, pos)) !== -1 && occurrences < 2) {
      console.log(content.substring(Math.max(0, pos - 40), Math.min(content.length, pos + 160)));
      pos += addon.length;
      occurrences++;
    }
  }
});

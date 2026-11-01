const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

// Search for css string patterns
const actions = [
  'contrastModeActions', 'saturationModeActions', 'pageColorsActions',
  'fontSizeActions', 'textStyleActions', 'lineHeightActions', 'letterSpacingActions',
  'highlightLettersActions', 'readingMaskActions', 'readingGuideActions',
  'highlightLinksActions', 'highlightHeadingsActions', 'hideImagesActions',
  'pauseAnimationsActions', 'disableSoundsActions', 'magnifierActions',
  'pageSpeechActions', 'readerModeActions'
];

actions.forEach(act => {
  const idx = content.indexOf(act);
  if (idx !== -1) {
    console.log(`\n================== ${act} ==================`);
    console.log(content.substring(idx - 100, idx + 1200));
  }
});

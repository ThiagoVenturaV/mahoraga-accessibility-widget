import { AccessibilityState } from '../types';

export class StyleManager {
  private styleTag: HTMLStyleElement | null = null;
  private svgFilterTag: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (!document.getElementById('ht-accessibility-styles')) {
      this.styleTag = document.createElement('style');
      this.styleTag.id = 'ht-accessibility-styles';
      document.head.appendChild(this.styleTag);
    } else {
      this.styleTag = document.getElementById('ht-accessibility-styles') as HTMLStyleElement;
    }

    if (!document.getElementById('ht-svg-filters')) {
      this.injectSvgFilters();
    }
  }

  private injectSvgFilters() {
    const div = document.createElement('div');
    div.id = 'ht-svg-filters';
    div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    div.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="ht-protanopia">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0   0.558, 0.442, 0, 0, 0   0, 0.242, 0.758, 0, 0   0, 0, 0, 1, 0"/>
        </filter>
        <filter id="ht-deuteranopia">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0   0.7, 0.3, 0, 0, 0       0, 0.3, 0.7, 0, 0       0, 0, 0, 1, 0"/>
        </filter>
        <filter id="ht-tritanopia">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0     0, 0.433, 0.567, 0, 0   0, 0.475, 0.525, 0, 0   0, 0, 0, 1, 0"/>
        </filter>
        <filter id="ht-achromatopsia">
          <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0"/>
        </filter>
      </svg>
    `;
    document.body.appendChild(div);
    this.svgFilterTag = div;
  }

  public apply(state: AccessibilityState) {
    if (!this.styleTag) return;

    const ignore = ':not(.ht-widget-root):not(.ht-widget-root *):not(.ht-skip):not(.ht-skip *)';
    let css = '';

    // Font Size
    if (state.fontSizeLevel === 1) {
      css += `
        html, body { font-size: 115% !important; }
        body *${ignore} { font-size: 110% !important; }
      `;
    } else if (state.fontSizeLevel === 2) {
      css += `
        html, body { font-size: 130% !important; }
        body *${ignore} { font-size: 125% !important; }
      `;
    }

    // Dyslexic Font
    if (state.dyslexicFont) {
      css += `
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        body *${ignore} {
          font-family: 'Atkinson Hyperlegible', 'Comic Sans MS', 'Arial', sans-serif !important;
          letter-spacing: 0.05em !important;
        }
      `;
    }

    // Line Height
    if (state.lineHeightLevel === 1) {
      css += `body *${ignore} { line-height: 1.8 !important; }`;
    } else if (state.lineHeightLevel === 2) {
      css += `body *${ignore} { line-height: 2.2 !important; }`;
    }

    // Letter Spacing
    if (state.letterSpacingLevel === 1) {
      css += `body *${ignore} { letter-spacing: 0.12em !important; }`;
    } else if (state.letterSpacingLevel === 2) {
      css += `body *${ignore} { letter-spacing: 0.24em !important; }`;
    }

    // Highlight Letters
    if (state.highlightLetters) {
      css += `
        body p${ignore}, body span${ignore}, body li${ignore} {
          word-spacing: 0.25em !important;
        }
        body p${ignore}::first-letter, body h1${ignore}::first-letter, body h2${ignore}::first-letter, body h3${ignore}::first-letter {
          color: #ff3366 !important;
          font-weight: 900 !important;
          font-size: 1.25em !important;
        }
      `;
    }

    // Highlight Links
    if (state.highlightLinks) {
      css += `
        a${ignore} {
          background-color: #ffea00 !important;
          color: #000000 !important;
          text-decoration: underline 3px solid #000000 !important;
          font-weight: bold !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          box-shadow: 0 0 0 2px #000000 !important;
        }
      `;
    }

    // Highlight Headings
    if (state.highlightHeadings) {
      css += `
        h1${ignore}, h2${ignore}, h3${ignore}, h4${ignore}, h5${ignore}, h6${ignore} {
          border-left: 6px solid #0d6efd !important;
          padding-left: 10px !important;
          background: rgba(13, 110, 253, 0.08) !important;
          position: relative !important;
        }
        h1${ignore}::before { content: 'H1: ' !important; font-size: 0.6em; color: #0d6efd; font-weight: bold; }
        h2${ignore}::before { content: 'H2: ' !important; font-size: 0.6em; color: #0d6efd; font-weight: bold; }
        h3${ignore}::before { content: 'H3: ' !important; font-size: 0.6em; color: #0d6efd; font-weight: bold; }
      `;
    }

    // Hide Images
    if (state.hideImages) {
      css += `
        img${ignore}, svg${ignore}:not(.ht-icon), video${ignore}, canvas${ignore}:not(.ht-avatar-canvas) {
          filter: grayscale(100%) contrast(0) brightness(1.8) !important;
          opacity: 0.08 !important;
          transition: opacity 0.3s ease !important;
        }
        img${ignore}:hover {
          opacity: 1 !important;
          filter: none !important;
        }
      `;
    }

    // Pause Animations
    if (state.pauseAnimations) {
      css += `
        *${ignore}, *${ignore}::before, *${ignore}::after {
          animation-play-state: paused !important;
          transition-duration: 0.001s !important;
        }
      `;
    }

    // Contrast Modes
    if (state.contrastMode === 'high-contrast-dark') {
      css += `
        html, body {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        body *${ignore} {
          background-color: #000000 !important;
          color: #ffff00 !important;
          border-color: #ffff00 !important;
        }
        a${ignore} {
          color: #00ffff !important;
          text-decoration: underline !important;
        }
        button${ignore}, input${ignore}, select${ignore}, textarea${ignore} {
          background: #111111 !important;
          color: #ffffff !important;
          border: 2px solid #ffff00 !important;
        }
      `;
    } else if (state.contrastMode === 'high-contrast-light') {
      css += `
        html, body {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        body *${ignore} {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }
        a${ignore} {
          color: #0000ee !important;
          font-weight: bold !important;
          text-decoration: underline !important;
        }
        button${ignore}, input${ignore}, select${ignore}, textarea${ignore} {
          background: #f8f9fa !important;
          color: #000000 !important;
          border: 2px solid #000000 !important;
        }
      `;
    } else if (state.contrastMode === 'invert') {
      css += `
        body > :not(.ht-widget-root):not(#vlibras-app-root):not(#vlibras-access-wrapper) {
          filter: invert(100%) hue-rotate(180deg) !important;
        }
        body {
          background-color: #000000 !important;
        }
      `;
    }

    // Saturation
    if (state.saturationMode === 'monochrome') {
      css += `body > :not(.ht-widget-root):not(#vlibras-app-root):not(#vlibras-access-wrapper) { filter: grayscale(100%) !important; }`;
    } else if (state.saturationMode === 'low-saturation') {
      css += `body > :not(.ht-widget-root):not(#vlibras-app-root):not(#vlibras-access-wrapper) { filter: saturate(40%) !important; }`;
    } else if (state.saturationMode === 'high-saturation') {
      css += `body > :not(.ht-widget-root):not(#vlibras-app-root):not(#vlibras-access-wrapper) { filter: saturate(200%) !important; }`;
    }

    // Colorblind Mode
    if (state.colorblindMode !== 'none') {
      css += `
        body > :not(.ht-widget-root):not(#vlibras-app-root):not(#vlibras-access-wrapper) {
          filter: url(#ht-${state.colorblindMode}) !important;
        }
      `;
    }

    // Reader Mode
    if (state.readerMode) {
      css += `
        header${ignore}, footer${ignore}, nav${ignore}, aside${ignore}, .sidebar${ignore}, [role="banner"]${ignore}, [role="navigation"]${ignore} {
          display: none !important;
        }
        main${ignore}, article${ignore}, [role="main"]${ignore} {
          max-width: 780px !important;
          margin: 0 auto !important;
          padding: 40px 20px !important;
          font-size: 1.25rem !important;
          line-height: 1.9 !important;
          background: #ffffff !important;
          color: #222222 !important;
        }
      `;
    }

    this.styleTag.innerHTML = css;
  }

  public destroy() {
    this.styleTag?.remove();
    this.svgFilterTag?.remove();
  }
}

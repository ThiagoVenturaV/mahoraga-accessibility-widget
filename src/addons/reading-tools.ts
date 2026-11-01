import { store } from '../state/store';

export class ReadingToolsManager {
  private guideElement: HTMLDivElement | null = null;
  private maskElement: HTMLDivElement | null = null;
  private magnifierElement: HTMLDivElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    this.createGuide();
    this.createMask();
    this.createMagnifier();

    window.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });

    store.subscribe((state) => {
      if (this.guideElement) {
        this.guideElement.style.display = state.readingGuideActive ? 'block' : 'none';
      }
      if (this.maskElement) {
        this.maskElement.style.display = state.readingMaskActive ? 'block' : 'none';
      }
      if (this.magnifierElement) {
        this.magnifierElement.style.display = state.magnifierActive ? 'block' : 'none';
      }
    });
  }

  private createGuide() {
    this.guideElement = document.createElement('div');
    this.guideElement.className = 'ht-reading-guide ht-skip';
    this.guideElement.style.cssText = `
      position: fixed;
      left: 0;
      width: 100vw;
      height: 12px;
      background: #00e5ff;
      opacity: 0.65;
      box-shadow: 0 0 10px #00e5ff, 0 2px 4px rgba(0,0,0,0.3);
      pointer-events: none;
      z-index: 2147483640;
      display: none;
      transform: translateY(-50%);
    `;
    document.body.appendChild(this.guideElement);
  }

  private createMask() {
    this.maskElement = document.createElement('div');
    this.maskElement.className = 'ht-reading-mask ht-skip';
    this.maskElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483639;
      display: none;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75);
    `;
    document.body.appendChild(this.maskElement);
  }

  private createMagnifier() {
    this.magnifierElement = document.createElement('div');
    this.magnifierElement.className = 'ht-magnifier ht-skip';
    this.magnifierElement.style.cssText = `
      position: fixed;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 4px solid #0084ff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      pointer-events: none;
      z-index: 2147483641;
      display: none;
      transform: translate(-50%, -50%);
      background: #ffffff;
      overflow: hidden;
    `;
    document.body.appendChild(this.magnifierElement);
  }

  private handleMouseMove(e: MouseEvent) {
    const state = store.getState();

    // Update Reading Guide
    if (state.readingGuideActive && this.guideElement) {
      this.guideElement.style.top = `${e.clientY}px`;
    }

    // Update Reading Mask
    if (state.readingMaskActive && this.maskElement) {
      const slitHeight = 70;
      const topPct = Math.max(0, e.clientY - slitHeight / 2);
      this.maskElement.style.background = `
        linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.75) 0px,
          rgba(0, 0, 0, 0.75) ${topPct}px,
          transparent ${topPct}px,
          transparent ${topPct + slitHeight}px,
          rgba(0, 0, 0, 0.75) ${topPct + slitHeight}px,
          rgba(0, 0, 0, 0.75) 100%
        )
      `;
    }

    // Update Magnifier
    if (state.magnifierActive && this.magnifierElement) {
      this.magnifierElement.style.left = `${e.clientX}px`;
      this.magnifierElement.style.top = `${e.clientY}px`;

      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (target && !target.closest('.ht-widget-root') && !target.closest('.ht-skip')) {
        const text = (target.innerText || target.textContent || '').trim().slice(0, 150);
        this.magnifierElement.innerHTML = `
          <div style="padding: 16px; font-size: 20px; font-weight: bold; color: #111; line-height: 1.4; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
            ${text || '🔍'}
          </div>
        `;
      }
    }
  }

  public destroy() {
    this.guideElement?.remove();
    this.maskElement?.remove();
    this.magnifierElement?.remove();
  }
}

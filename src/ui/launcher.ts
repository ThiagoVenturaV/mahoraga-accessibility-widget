import { store } from '../state/store';
import { icons } from './icons';
import { WidgetSide, WidgetAlign } from '../types';

export class FloatingLauncher {
  private element: HTMLDivElement | null = null;
  private side: WidgetSide = 'right';
  private align: WidgetAlign = 'bottom';
  private isMenuOpen = false;

  constructor(side: WidgetSide = 'right', align: WidgetAlign = 'bottom') {
    this.side = side;
    this.align = align;
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-launcher-container ht-skip';
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', 'Ativador de Acessibilidade Hand Talk');

    this.render();
    document.body.appendChild(this.element);

    this.attachEvents();

    store.subscribe((state) => {
      // If either window is open, highlight the launcher
      const btn = this.element?.querySelector<HTMLElement>('.ht-launcher-main-btn');
      if (btn) {
        if (state.isTranslatorOpen || state.isAddonsOpen) {
          btn.style.boxShadow = '0 0 0 4px rgba(0, 112, 243, 0.4), 0 8px 24px rgba(0, 112, 243, 0.35)';
        } else {
          btn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        }
      }
    });
  }

  private render() {
    if (!this.element) return;

    const isRight = this.side === 'right';
    const isTop = this.align === 'top';
    const isCenter = this.align === 'center';

    let posStyles = '';
    if (isRight) {
      posStyles += 'right: 20px;';
    } else {
      posStyles += 'left: 20px;';
    }

    if (isTop) {
      posStyles += 'top: 20px;';
    } else if (isCenter) {
      posStyles += 'top: 50%; transform: translateY(-50%);';
    } else {
      posStyles += 'bottom: 24px;';
    }

    this.element.innerHTML = `
      <div class="ht-launcher-wrapper" style="
        position: fixed;
        ${posStyles}
        z-index: 2147483643;
        display: flex;
        flex-direction: column;
        align-items: ${isRight ? 'flex-end' : 'flex-start'};
        gap: 10px;
      ">
        
        <!-- Expandable Options Menu -->
        <div class="ht-launcher-menu" style="
          display: none;
          flex-direction: column;
          gap: 8px;
          background: #ffffff;
          padding: 8px;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
          border: 1px solid rgba(0,0,0,0.08);
          animation: htFadeScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        ">
          <!-- Button 1: Libras Translator -->
          <button class="ht-launcher-opt-libras" style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 10px;
            background: #f0f7ff;
            border: 1px solid #c7e0ff;
            color: #0070f3;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s;
          ">
            <span style="width: 20px; height: 20px; display: inline-block;">${icons.libras}</span>
            <span>Tradutor de Libras</span>
          </button>

          <!-- Button 2: Accessibility Panel -->
          <button class="ht-launcher-opt-addons" style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 10px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #1e293b;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s;
          ">
            <span style="width: 20px; height: 20px; display: inline-block; color: #0070f3;">${icons.accessibility}</span>
            <span>Recursos Assistivos</span>
          </button>
        </div>

        <!-- Main Launcher Circle / Pill Button -->
        <button class="ht-launcher-main-btn" style="
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0070f3 0%, #0051b3 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
          outline: none;
        " aria-label="Abrir menu de acessibilidade e tradutor de Libras Hand Talk">
          <span style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${icons.libras}
          </span>
          <span class="ht-launcher-pulse" style="
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid #0070f3;
            opacity: 0.5;
            animation: htPulse 2.5s infinite;
            pointer-events: none;
          "></span>
        </button>

      </div>
    `;
  }

  private attachEvents() {
    if (!this.element) return;

    const mainBtn = this.element.querySelector<HTMLButtonElement>('.ht-launcher-main-btn');
    const menu = this.element.querySelector<HTMLElement>('.ht-launcher-menu');
    const librasBtn = this.element.querySelector<HTMLButtonElement>('.ht-launcher-opt-libras');
    const addonsBtn = this.element.querySelector<HTMLButtonElement>('.ht-launcher-opt-addons');

    mainBtn?.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      if (menu) {
        menu.style.display = this.isMenuOpen ? 'flex' : 'none';
      }
    });

    librasBtn?.addEventListener('click', () => {
      const s = store.getState();
      store.setState({ isTranslatorOpen: !s.isTranslatorOpen });
      this.isMenuOpen = false;
      if (menu) menu.style.display = 'none';
    });

    addonsBtn?.addEventListener('click', () => {
      const s = store.getState();
      store.setState({ isAddonsOpen: !s.isAddonsOpen });
      this.isMenuOpen = false;
      if (menu) menu.style.display = 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element?.contains(e.target as Node) && this.isMenuOpen) {
        this.isMenuOpen = false;
        if (menu) menu.style.display = 'none';
      }
    });
  }

  public destroy() {
    this.element?.remove();
  }
}

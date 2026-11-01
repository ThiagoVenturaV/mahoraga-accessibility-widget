import { store } from '../state/store';
import { icons } from './icons';
import { WidgetSide, WidgetAlign } from '../types';
import { vlibrasManager } from '../core/vlibras';

export class FloatingLauncher {
  private element: HTMLDivElement | null = null;
  private side: WidgetSide = 'right';
  private align: WidgetAlign = 'center';

  constructor(side: WidgetSide = 'right', align: WidgetAlign = 'center') {
    this.side = side;
    this.align = align;
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-launcher-container ht-skip';
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', 'Atalhos de Acessibilidade e Tradutor de Libras');

    this.render();
    document.body.appendChild(this.element);

    this.attachEvents();

    store.subscribe((state) => {
      if (!this.element) return;
      const addonsBtn = this.element.querySelector<HTMLButtonElement>('.ht-lateral-btn-addons');
      const librasBtn = this.element.querySelector<HTMLButtonElement>('.ht-lateral-btn-libras');

      if (addonsBtn) {
        if (state.isAddonsOpen) {
          addonsBtn.classList.add('ht-lateral-active');
          addonsBtn.style.background = '#0a3875';
        } else {
          addonsBtn.classList.remove('ht-lateral-active');
          addonsBtn.style.background = 'transparent';
        }
      }

      if (librasBtn) {
        if (state.isTranslatorOpen) {
          librasBtn.classList.add('ht-lateral-active');
          librasBtn.style.background = '#0a3875';
        } else {
          librasBtn.classList.remove('ht-lateral-active');
          librasBtn.style.background = 'transparent';
        }
      }
    });
  }

  private render() {
    if (!this.element) return;

    const isRight = this.side !== 'left';
    let posStyles = '';

    if (isRight) {
      posStyles += 'right: 0; left: auto;';
    } else {
      posStyles += 'left: 0; right: auto;';
    }

    if (this.align === 'top') {
      posStyles += 'top: 120px;';
    } else if (this.align === 'bottom') {
      posStyles += 'bottom: 120px;';
    } else {
      // Default: Centered vertically on the screen edge
      posStyles += 'top: 50%; transform: translateY(-50%);';
    }

    const borderRadius = isRight ? '12px 0 0 12px' : '0 12px 12px 0';
    const borderProp = isRight ? 'border: 2px solid #ffffff; border-right: none;' : 'border: 2px solid #ffffff; border-left: none;';

    this.element.innerHTML = `
      <div class="ht-lateral-launcher" style="
        position: fixed;
        ${posStyles}
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        background: #1351b4;
        ${borderProp}
        border-radius: ${borderRadius};
        box-shadow: -4px 6px 20px rgba(0, 0, 0, 0.22);
        overflow: hidden;
        width: 46px;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      ">
        
        <!-- Top Button: Accessibility / Addons -->
        <button class="ht-lateral-btn ht-lateral-btn-addons" style="
          width: 46px;
          height: 48px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          padding: 0;
          outline: none;
          transition: background 0.15s ease;
        " title="Recursos Assistivos de Acessibilidade (Alt+A)" aria-label="Abrir painel de acessibilidade e recursos assistivos">
          <span style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            ${icons.accessibilityPerson}
          </span>
        </button>

        <!-- White Divider Line -->
        <div class="ht-lateral-divider" style="
          width: 100%;
          height: 1.5px;
          background: #ffffff;
        "></div>

        <!-- Bottom Button: Libras 3D Translator -->
        <button class="ht-lateral-btn ht-lateral-btn-libras" style="
          width: 46px;
          height: 48px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          padding: 0;
          outline: none;
          transition: background 0.15s ease;
        " title="Tradutor de Libras com Avatar 3D (Alt+L)" aria-label="Abrir tradutor de Libras em 3D">
          <span style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            ${icons.librasHands}
          </span>
        </button>

      </div>
    `;
  }

  private attachEvents() {
    if (!this.element) return;

    const addonsBtn = this.element.querySelector<HTMLButtonElement>('.ht-lateral-btn-addons');
    const librasBtn = this.element.querySelector<HTMLButtonElement>('.ht-lateral-btn-libras');
    const container = this.element.querySelector<HTMLElement>('.ht-lateral-launcher');

    // Hover effect: slight inward slide
    if (container) {
      const isRight = this.side !== 'left';
      container.addEventListener('mouseenter', () => {
        if (this.align === 'center') {
          container.style.transform = isRight ? 'translateY(-50%) translateX(-3px)' : 'translateY(-50%) translateX(3px)';
        } else {
          container.style.transform = isRight ? 'translateX(-3px)' : 'translateX(3px)';
        }
      });
      container.addEventListener('mouseleave', () => {
        if (this.align === 'center') {
          container.style.transform = 'translateY(-50%)';
        } else {
          container.style.transform = 'none';
        }
      });
    }

    // Toggle Addons Panel
    addonsBtn?.addEventListener('click', () => {
      const s = store.getState();
      store.setState({ isAddonsOpen: !s.isAddonsOpen });
    });

    // Toggle Libras Translator
    librasBtn?.addEventListener('click', () => {
      const s = store.getState();
      const next = !s.isTranslatorOpen;
      store.setState({ isTranslatorOpen: next });
      if (next) {
        vlibrasManager.openPlayer();
      } else {
        vlibrasManager.closePlayer();
      }
    });
  }

  public destroy() {
    this.element?.remove();
  }
}

import { store } from '../state/store';
import { icons } from './icons';

interface StructureItem {
  element: HTMLElement;
  tag: string;
  level: number;
  text: string;
}

export class PageStructureModal {
  private element: HTMLDivElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-page-structure-modal ht-skip';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('aria-label', 'Estrutura da Página e Navegação por Títulos');
    this.element.style.display = 'none';

    document.body.appendChild(this.element);

    store.subscribe((state) => {
      if (!this.element) return;
      if (state.isPageStructureOpen) {
        this.render();
        this.element.style.display = 'flex';
      } else {
        this.element.style.display = 'none';
      }
    });
  }

  private scanStructure(): StructureItem[] {
    const rawElements = Array.from(
      document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6, nav, main, header, footer, [role="heading"], [role="banner"], [role="navigation"], [role="main"]')
    );

    const items: StructureItem[] = [];

    rawElements.forEach((el) => {
      // Ignore widget's own elements
      if (el.closest('.ht-widget-root') || el.closest('.ht-skip') || el.closest('#vlibras-app-root')) {
        return;
      }

      const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!text && !el.getAttribute('aria-label')) return;

      const tag = el.tagName.toLowerCase();
      let level = 1;
      let label = text;

      if (tag.startsWith('h') && tag.length === 2) {
        level = parseInt(tag[1], 10);
      } else if (tag === 'header' || el.getAttribute('role') === 'banner') {
        level = 1;
        label = label || 'Cabeçalho do Site';
      } else if (tag === 'nav' || el.getAttribute('role') === 'navigation') {
        level = 2;
        label = label || 'Menu de Navegação';
      } else if (tag === 'main' || el.getAttribute('role') === 'main') {
        level = 1;
        label = label || 'Conteúdo Principal';
      } else if (tag === 'footer') {
        level = 1;
        label = label || 'Rodapé da Página';
      }

      if (label.length > 80) {
        label = label.slice(0, 80) + '...';
      }

      items.push({
        element: el,
        tag: tag.toUpperCase(),
        level,
        text: label
      });
    });

    return items;
  }

  private render() {
    if (!this.element) return;
    const items = this.scanStructure();

    this.element.innerHTML = `
      <div class="ht-structure-backdrop" style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        z-index: 2147483645;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      ">
        <div class="ht-structure-card" style="
          background: #ffffff;
          border-radius: 16px;
          max-width: 560px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
          overflow: hidden;
        ">
          <!-- Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 1px solid #eef0f3;
            background: #ffffff;
          ">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 36px;
                height: 36px;
                border-radius: 10px;
                background: #eef6ff;
                color: #0070f3;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="width: 20px; height: 20px; display: inline-block;">${icons.pageStructure}</span>
              </div>
              <div>
                <h2 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #1e293b;">Estrutura da Página</h2>
                <span style="font-size: 0.8rem; color: #64748b;">Navegue rapidamente pelos títulos e seções</span>
              </div>
            </div>

            <button class="ht-structure-close-btn" style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: #f1f5f9;
              border: none;
              color: #475569;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            " aria-label="Fechar estrutura da página">
              <span style="width: 18px; height: 18px;">${icons.close}</span>
            </button>
          </div>

          <!-- List of Headings / Landmarks -->
          <div class="ht-structure-list" style="
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            ${items.length === 0 ? `
              <div style="text-align: center; padding: 40px 20px; color: #64748b; font-size: 0.95rem;">
                Nenhum cabeçalho ou seção estrutural identificado nesta página.
              </div>
            ` : items.map((item, idx) => `
              <button class="ht-structure-item-btn" data-index="${idx}" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 14px;
                margin-left: ${(item.level - 1) * 16}px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                text-align: left;
                transition: all 0.15s ease;
                outline: none;
              ">
                <span style="
                  font-size: 0.72rem;
                  font-weight: 800;
                  color: #0070f3;
                  background: #eef6ff;
                  padding: 2px 7px;
                  border-radius: 4px;
                  letter-spacing: 0.05em;
                ">${item.tag}</span>
                <span style="
                  font-size: 0.88rem;
                  color: #1e293b;
                  font-weight: ${item.level === 1 ? '700' : '500'};
                  line-height: 1.35;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                ">${item.text}</span>
              </button>
            `).join('')}
          </div>

          <!-- Footer -->
          <div style="
            padding: 12px 20px;
            border-top: 1px solid #eef0f3;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #64748b;
          ">
            <span>${items.length} itens estruturais encontrados</span>
            <span>Clique para saltar diretamente para a seção</span>
          </div>
        </div>
      </div>
    `;

    // Attach events
    const closeBtn = this.element.querySelector('.ht-structure-close-btn');
    closeBtn?.addEventListener('click', () => {
      store.setState({ isPageStructureOpen: false });
    });

    const backdrop = this.element.querySelector('.ht-structure-backdrop');
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        store.setState({ isPageStructureOpen: false });
      }
    });

    const itemBtns = this.element.querySelectorAll<HTMLButtonElement>('.ht-structure-item-btn');
    itemBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idxStr = btn.getAttribute('data-index');
        if (idxStr !== null) {
          const idx = parseInt(idxStr, 10);
          const target = items[idx]?.element;
          if (target) {
            store.setState({ isPageStructureOpen: false, isAddonsOpen: false });
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Apply accessible flash highlight
            const origTransition = target.style.transition;
            const origOutline = target.style.outline;
            const origOutlineOffset = target.style.outlineOffset;

            target.style.transition = 'outline 0.2s ease';
            target.style.outline = '4px solid #0070f3';
            target.style.outlineOffset = '4px';

            if (!target.hasAttribute('tabindex')) {
              target.setAttribute('tabindex', '-1');
            }
            target.focus();

            setTimeout(() => {
              target.style.outline = origOutline;
              target.style.outlineOffset = origOutlineOffset;
              target.style.transition = origTransition;
            }, 1800);
          }
        }
      });
    });
  }

  public destroy() {
    this.element?.remove();
  }
}

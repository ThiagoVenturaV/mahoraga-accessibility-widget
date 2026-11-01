import { store } from '../state/store';
import { DICTIONARY_DATABASE } from '../config';
import { icons } from './icons';

export class DictionaryModal {
  private element: HTMLDivElement | null = null;
  private onSignSelected: (text: string) => void;

  constructor(onSignSelected: (text: string) => void) {
    this.onSignSelected = onSignSelected;
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-dictionary-modal ht-skip';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('aria-label', 'Dicionário de Libras');
    this.element.style.display = 'none';

    this.render();
    document.body.appendChild(this.element);

    store.subscribe((state) => {
      if (this.element) {
        this.element.style.display = state.isDictionaryOpen ? 'flex' : 'none';
        if (state.isDictionaryOpen) {
          const input = this.element.querySelector<HTMLInputElement>('.ht-dict-search-input');
          input?.focus();
        }
      }
    });
  }

  private render() {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="ht-modal-backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:2147483645;display:flex;align-items:center;justify-content:center;padding:20px;">
        <div class="ht-modal-card" style="background:#ffffff;border-radius:16px;max-width:540px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,0.25);overflow:hidden;position:relative;">
          
          <!-- Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid #eef0f3;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;border-radius:10px;background:#eef6ff;color:#0070f3;display:flex;align-items:center;justify-content:center;">
                <span style="width:20px;height:20px;display:inline-block;">${icons.dictionary}</span>
              </div>
              <h2 style="margin:0;font-size:1.2rem;font-weight:700;color:#1a202c;">Dicionário de Libras</h2>
            </div>
            <button class="ht-dict-close-btn" style="background:none;border:none;cursor:pointer;color:#718096;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;" aria-label="Fechar dicionário">
              <span style="width:20px;height:20px;">${icons.close}</span>
            </button>
          </div>

          <!-- Search Input -->
          <div style="padding:16px 24px;background:#f8fafc;border-bottom:1px solid #eef0f3;">
            <div style="position:relative;">
              <input type="text" class="ht-dict-search-input" placeholder="Pesquisar sinal (ex: Libras, Olá, Obrigado...)" style="width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color 0.2s;" />
            </div>
          </div>

          <!-- Signs List -->
          <div class="ht-dict-list" style="padding:16px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;flex:1;">
            ${this.renderList()}
          </div>

          <!-- Footer -->
          <div style="padding:14px 24px;background:#f8fafc;border-top:1px solid #eef0f3;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.85rem;color:#718096;">Total de termos cadastrados: ${Object.keys(DICTIONARY_DATABASE).length}</span>
            <button class="ht-dict-close-btn2" style="background:#0070f3;color:#ffffff;border:none;padding:8px 16px;border-radius:8px;font-weight:600;font-size:0.88rem;cursor:pointer;">Concluído</button>
          </div>

        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderList(filter = ''): string {
    const keys = Object.keys(DICTIONARY_DATABASE).filter(k => k.includes(filter.toLowerCase()));
    if (keys.length === 0) {
      return `
        <div style="text-align:center;padding:32px;color:#a0aec0;">
          <p style="margin:0;font-size:0.95rem;">Nenhum sinal encontrado para "${filter}".</p>
          <p style="margin:6px 0 0;font-size:0.85rem;">Tente pesquisar por termos comuns como "acessibilidade", "libras", "olá", "obrigado".</p>
        </div>
      `;
    }

    return keys.map(key => {
      const item = DICTIONARY_DATABASE[key];
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      return `
        <div class="ht-dict-item" data-term="${key}" style="border:1px solid #e2e8f0;border-radius:12px;padding:14px;background:#ffffff;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;transition:box-shadow 0.2s;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <strong style="font-size:1rem;color:#1a202c;">${capitalized}</strong>
              <span style="font-size:0.75rem;background:#edf2f7;color:#4a5568;padding:2px 8px;border-radius:12px;font-weight:600;">${item.category}</span>
            </div>
            <p style="margin:0 0 6px;font-size:0.88rem;color:#4a5568;line-height:1.4;">${item.definition}</p>
            <p style="margin:0;font-size:0.8rem;color:#718096;font-style:italic;"><strong>Gesto em Libras:</strong> ${item.description}</p>
          </div>
          <button class="ht-dict-sign-btn" data-term="${key}" style="background:#0070f3;color:#ffffff;border:none;border-radius:8px;padding:8px 12px;font-size:0.82rem;font-weight:600;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px;">
            <span>Ver Sinal</span>
          </button>
        </div>
      `;
    }).join('');
  }

  private attachEvents() {
    if (!this.element) return;

    const closeButtons = this.element.querySelectorAll('.ht-dict-close-btn, .ht-dict-close-btn2');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        store.setState({ isDictionaryOpen: false });
      });
    });

    const backdrop = this.element.querySelector('.ht-modal-backdrop');
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        store.setState({ isDictionaryOpen: false });
      }
    });

    const input = this.element.querySelector<HTMLInputElement>('.ht-dict-search-input');
    const list = this.element.querySelector<HTMLDivElement>('.ht-dict-list');

    input?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      if (list) {
        list.innerHTML = this.renderList(val);
        this.attachSignButtons();
      }
    });

    this.attachSignButtons();
  }

  private attachSignButtons() {
    if (!this.element) return;
    const signButtons = this.element.querySelectorAll<HTMLButtonElement>('.ht-dict-sign-btn');
    signButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const term = btn.getAttribute('data-term');
        if (term) {
          store.setState({ isDictionaryOpen: false, isTranslatorOpen: true });
          this.onSignSelected(term);
        }
      });
    });
  }

  public destroy() {
    this.element?.remove();
  }
}

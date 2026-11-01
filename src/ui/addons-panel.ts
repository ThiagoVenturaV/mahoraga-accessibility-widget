import { store } from '../state/store';
import { icons } from './icons';
import { ContrastMode, SaturationMode, ColorblindMode } from '../types';

export class AddonsPanel {
  private element: HTMLDivElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-addons-panel ht-skip';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-label', 'Painel de Recursos de Acessibilidade');
    this.element.style.display = 'none';

    this.render();
    document.body.appendChild(this.element);

    this.attachEvents();

    store.subscribe((state) => {
      if (!this.element) return;
      this.element.style.display = state.isAddonsOpen ? 'flex' : 'none';
      if (state.isAddonsOpen) {
        const card = this.element.querySelector<HTMLElement>('.ht-addons-card');
        if (card) {
          card.style.transform = 'translateX(0)';
        }
      }
      this.updateActiveIndicators();
    });
  }

  private render() {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="ht-addons-backdrop" style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(4px);
        z-index: 2147483646;
        display: flex;
        justify-content: flex-end;
      ">
        <div class="ht-addons-card" style="
          width: 440px;
          max-width: 95vw;
          height: 100vh;
          background: #ffffff;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: translateX(0);
          animation: htSlideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          
          <!-- Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid #eef0f3;
            background: #ffffff;
          ">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 38px;
                height: 38px;
                border-radius: 10px;
                background: #0070f3;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="width: 22px; height: 22px; display: inline-block;">${icons.accessibility}</span>
              </div>
              <div>
                <h2 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #1e293b;">Recursos Assistivos</h2>
                <span style="font-size: 0.8rem; color: #64748b;">Acessibilidade Digital</span>
              </div>
            </div>
            
            <button class="ht-addons-close-btn" style="
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: #f1f5f9;
              border: none;
              color: #475569;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            " aria-label="Fechar recursos assistivos">
              <span style="width: 20px; height: 20px;">${icons.close}</span>
            </button>
          </div>

          <!-- Body / Tools list -->
          <div class="ht-addons-content" style="
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          ">
            
            <!-- Category: AI Assistant / Libras -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 16px; height: 16px; display: inline-flex; color: #0070f3;">${icons.libras}</span>
                <span>Tradutor de Libras 3D</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${this.renderToolButton('signTranslator', 'Tradutor de Libras', 'Avatar 3D em tempo real', icons.libras)}
                ${this.renderToolButton('synonymsMeanings', 'Dicionário Libras', 'Sinais e significados', icons.dictionary)}
              </div>
            </div>

            <!-- Category: Font Control -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 16px; height: 16px; display: inline-flex; color: #0070f3;">${icons.fontSize}</span>
                <span>Controle de Fonte</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${this.renderToolButton('fontSize', 'Tamanho da Fonte', '3 opções (+0%, +15%, +30%)', icons.fontSize)}
                ${this.renderToolButton('textStyle', 'Fonte Legível', 'Adaptada para dislexia', icons.dyslexicFont)}
                ${this.renderToolButton('lineHeight', 'Espaço Linhas', '3 opções de entrelinha', icons.lineHeight)}
                ${this.renderToolButton('letterSpacing', 'Espaço Letras', '3 opções de espaçamento', icons.letterSpacing)}
                ${this.renderToolButton('highlightLetters', 'Destacar Letras', 'Primeira letra colorida', icons.highlightLetters)}
              </div>
            </div>

            <!-- Category: Navigation & Reading -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 16px; height: 16px; display: inline-flex; color: #0070f3;">${icons.readingGuide}</span>
                <span>Navegação & Leitura</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${this.renderToolButton('pageSpeech', 'Leitor de Sites', 'Leitura em voz alta (TTS)', icons.speech)}
                ${this.renderToolButton('readingGuide', 'Guia de Leitura', 'Régua horizontal móvel', icons.readingGuide)}
                ${this.renderToolButton('readingMask', 'Máscara Leitura', 'Foco na linha atual', icons.readingMask)}
                ${this.renderToolButton('magnifier', 'Lupa de Conteúdo', 'Lente de aumento no mouse', icons.magnifier)}
                ${this.renderToolButton('highlightLinks', 'Destacar Links', 'Bordas e realce amarelo', icons.highlightLinks)}
                ${this.renderToolButton('highlightHeadings', 'Destacar Títulos', 'Marcações H1 a H6', icons.highlightHeadings)}
                ${this.renderToolButton('hideImages', 'Ocultar Imagens', 'Diminui poluição visual', icons.hideImages)}
                ${this.renderToolButton('pauseAnimations', 'Pausar Animações', 'Congela GIFs e transições', icons.pauseAnimations)}
                ${this.renderToolButton('disableSounds', 'Parar Sons', 'Muta mídias da página', icons.disableSounds)}
                ${this.renderToolButton('readerMode', 'Modo Leitura', 'Texto limpo sem distrações', icons.readerMode)}
              </div>
            </div>

            <!-- Category: Color Control -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 16px; height: 16px; display: inline-flex; color: #0070f3;">${icons.contrast}</span>
                <span>Controle de Cores</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${this.renderToolButton('contrastMode', 'Contraste', 'Escuro, Claro, Invertido', icons.contrast)}
                ${this.renderToolButton('saturationMode', 'Saturação', 'Monocromático e Níveis', icons.saturation)}
                ${this.renderToolButton('colorblindMode', 'Modo Daltônico', 'Filtros Protanopia / Trit.', icons.colorblind)}
              </div>
            </div>

          </div>

          <!-- Footer / Reset -->
          <div style="
            padding: 16px 24px;
            border-top: 1px solid #eef0f3;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <button class="ht-btn-reset-all" style="
              display: flex;
              align-items: center;
              gap: 8px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              color: #dc2626;
              padding: 10px 16px;
              border-radius: 10px;
              font-size: 0.88rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            ">
              <span style="width: 16px; height: 16px;">${icons.reset}</span>
              <span>Limpar configurações</span>
            </button>

            <span class="ht-active-counter-badge" style="
              font-size: 0.8rem;
              font-weight: 600;
              color: #0070f3;
              background: #eef6ff;
              padding: 4px 10px;
              border-radius: 20px;
            ">0 ativos</span>
          </div>

        </div>
      </div>
    `;
  }

  private renderToolButton(id: string, title: string, subtitle: string, iconSvg: string): string {
    return `
      <button class="ht-tool-btn" data-tool="${id}" style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 12px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
        position: relative;
        outline: none;
      ">
        <div style="display: flex; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div class="ht-tool-icon" style="width: 28px; height: 28px; color: #475569;">
            ${iconSvg}
          </div>
          <span class="ht-tool-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
        </div>
        <strong style="font-size: 0.9rem; color: #1e293b; margin-bottom: 2px;">${title}</strong>
        <span class="ht-tool-sub" style="font-size: 0.75rem; color: #64748b; line-height: 1.2;">${subtitle}</span>
      </button>
    `;
  }

  private attachEvents() {
    if (!this.element) return;

    // Close on backdrop or close button
    const closeBtn = this.element.querySelector('.ht-addons-close-btn');
    closeBtn?.addEventListener('click', () => {
      store.setState({ isAddonsOpen: false });
    });

    const backdrop = this.element.querySelector('.ht-addons-backdrop');
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        store.setState({ isAddonsOpen: false });
      }
    });

    // Reset all
    const resetBtn = this.element.querySelector('.ht-btn-reset-all');
    resetBtn?.addEventListener('click', () => {
      store.reset();
    });

    // Tool toggles
    const buttons = this.element.querySelectorAll<HTMLButtonElement>('.ht-tool-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        if (tool) {
          this.handleToolClick(tool);
        }
      });
    });
  }

  private handleToolClick(tool: string) {
    const s = store.getState();

    switch (tool) {
      // AI Assistant
      case 'signTranslator':
        store.setState({ isTranslatorOpen: !s.isTranslatorOpen });
        break;
      case 'synonymsMeanings':
        store.setState({ isDictionaryOpen: true });
        break;

      // Font Control
      case 'fontSize':
        store.setState({ fontSizeLevel: (s.fontSizeLevel + 1) % 3 });
        break;
      case 'textStyle':
        store.setState({ dyslexicFont: !s.dyslexicFont });
        break;
      case 'lineHeight':
        store.setState({ lineHeightLevel: (s.lineHeightLevel + 1) % 3 });
        break;
      case 'letterSpacing':
        store.setState({ letterSpacingLevel: (s.letterSpacingLevel + 1) % 3 });
        break;
      case 'highlightLetters':
        store.setState({ highlightLetters: !s.highlightLetters });
        break;

      // Navigation
      case 'pageSpeech':
        store.setState({ pageSpeechActive: !s.pageSpeechActive });
        break;
      case 'readingGuide':
        store.setState({ readingGuideActive: !s.readingGuideActive });
        break;
      case 'readingMask':
        store.setState({ readingMaskActive: !s.readingMaskActive });
        break;
      case 'magnifier':
        store.setState({ magnifierActive: !s.magnifierActive });
        break;
      case 'highlightLinks':
        store.setState({ highlightLinks: !s.highlightLinks });
        break;
      case 'highlightHeadings':
        store.setState({ highlightHeadings: !s.highlightHeadings });
        break;
      case 'hideImages':
        store.setState({ hideImages: !s.hideImages });
        break;
      case 'pauseAnimations':
        store.setState({ pauseAnimations: !s.pauseAnimations });
        break;
      case 'disableSounds':
        store.setState({ disableSounds: !s.disableSounds });
        break;
      case 'readerMode':
        store.setState({ readerMode: !s.readerMode });
        break;

      // Color Control
      case 'contrastMode': {
        const modes: ContrastMode[] = ['none', 'high-contrast-dark', 'high-contrast-light', 'invert'];
        const next = modes[(modes.indexOf(s.contrastMode) + 1) % modes.length];
        store.setState({ contrastMode: next });
        break;
      }
      case 'saturationMode': {
        const modes: SaturationMode[] = ['normal', 'monochrome', 'low-saturation', 'high-saturation'];
        const next = modes[(modes.indexOf(s.saturationMode) + 1) % modes.length];
        store.setState({ saturationMode: next });
        break;
      }
      case 'colorblindMode': {
        const modes: ColorblindMode[] = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
        const next = modes[(modes.indexOf(s.colorblindMode) + 1) % modes.length];
        store.setState({ colorblindMode: next });
        break;
      }
    }
  }

  private updateActiveIndicators() {
    if (!this.element) return;
    const s = store.getState();

    let activeCount = 0;

    const toolStateMap: Record<string, { active: boolean; label?: string }> = {
      signTranslator: { active: s.isTranslatorOpen },
      synonymsMeanings: { active: s.isDictionaryOpen },
      fontSize: { active: s.fontSizeLevel > 0, label: s.fontSizeLevel === 0 ? '+0%' : s.fontSizeLevel === 1 ? '+15%' : '+30%' },
      textStyle: { active: s.dyslexicFont },
      lineHeight: { active: s.lineHeightLevel > 0, label: s.lineHeightLevel === 0 ? 'Padrão' : s.lineHeightLevel === 1 ? '1.8x' : '2.2x' },
      letterSpacing: { active: s.letterSpacingLevel > 0, label: s.letterSpacingLevel === 0 ? 'Padrão' : s.letterSpacingLevel === 1 ? '0.12em' : '0.24em' },
      highlightLetters: { active: s.highlightLetters },
      pageSpeech: { active: s.pageSpeechActive },
      readingGuide: { active: s.readingGuideActive },
      readingMask: { active: s.readingMaskActive },
      magnifier: { active: s.magnifierActive },
      highlightLinks: { active: s.highlightLinks },
      highlightHeadings: { active: s.highlightHeadings },
      hideImages: { active: s.hideImages },
      pauseAnimations: { active: s.pauseAnimations },
      disableSounds: { active: s.disableSounds },
      readerMode: { active: s.readerMode },
      contrastMode: { active: s.contrastMode !== 'none', label: s.contrastMode === 'none' ? 'Padrão' : s.contrastMode },
      saturationMode: { active: s.saturationMode !== 'normal', label: s.saturationMode === 'normal' ? 'Padrão' : s.saturationMode },
      colorblindMode: { active: s.colorblindMode !== 'none', label: s.colorblindMode === 'none' ? 'Padrão' : s.colorblindMode }
    };

    Object.entries(toolStateMap).forEach(([tool, info]) => {
      const btn = this.element?.querySelector<HTMLButtonElement>(`[data-tool="${tool}"]`);
      if (btn) {
        const dot = btn.querySelector<HTMLElement>('.ht-tool-status-dot');
        const icon = btn.querySelector<HTMLElement>('.ht-tool-icon');
        const sub = btn.querySelector<HTMLElement>('.ht-tool-sub');

        if (info.active) {
          activeCount++;
          btn.style.borderColor = '#0070f3';
          btn.style.background = '#f0f7ff';
          if (dot) dot.style.background = '#0070f3';
          if (icon) icon.style.color = '#0070f3';
        } else {
          btn.style.borderColor = '#e2e8f0';
          btn.style.background = '#f8fafc';
          if (dot) dot.style.background = '#cbd5e1';
          if (icon) icon.style.color = '#475569';
        }

        if (info.label && sub) {
          sub.innerText = `Ativo: ${info.label}`;
        }
      }
    });

    const badge = this.element.querySelector('.ht-active-counter-badge');
    if (badge) {
      badge.innerHTML = `${activeCount} ${activeCount === 1 ? 'ativo' : 'ativos'}`;
    }
  }

  public destroy() {
    this.element?.remove();
  }
}

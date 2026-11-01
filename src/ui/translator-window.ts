import { store } from '../state/store';
import { icons } from './icons';
import { SpeedRate, AvatarType } from '../types';
import { vlibrasManager } from '../core/vlibras';

export class TranslatorWindow {
  private element: HTMLDivElement | null = null;
  private isMinimized = false;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;

  constructor() {
    this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.className = 'ht-widget-root ht-translator-window ht-skip';
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', 'Janela de Tradução em Libras Mahoraga');
    this.element.style.display = 'none';

    this.render();
    document.body.appendChild(this.element);

    this.attachEvents();

    store.subscribe((state, prev) => {
      if (!this.element) return;

      this.element.style.display = state.isTranslatorOpen ? 'flex' : 'none';

      if (state.isTranslatorOpen && !prev.isTranslatorOpen) {
        vlibrasManager.openPlayer();
      }

      // Update text in subtitle
      const subtitleEl = this.element.querySelector<HTMLDivElement>('.ht-translator-subtitle-text');
      if (subtitleEl) {
        subtitleEl.innerText = state.currentText || 'Selecione ou clique em qualquer texto para traduzir em Libras';
      }

      const glossEl = this.element.querySelector<HTMLDivElement>('.ht-translator-subtitle-gloss');
      if (glossEl) {
        if (state.currentGloss) {
          glossEl.innerHTML = `<span style="width: 14px; height: 14px; display: inline-flex; vertical-align: -2px; margin-right: 4px;">${icons.libras}</span> Glosa Libras: [${state.currentGloss}]`;
          glossEl.style.display = 'block';
        } else {
          glossEl.style.display = 'none';
        }
      }

      // Update opacity
      const card = this.element.querySelector<HTMLDivElement>('.ht-translator-card');
      if (card) {
        card.style.background = state.opacity === 100
          ? '#ffffff'
          : state.opacity === 50
            ? 'rgba(255, 255, 255, 0.82)'
            : 'rgba(255, 255, 255, 0.45)';
      }

      // Update avatar switch button badge
      const avatarBadge = this.element.querySelector<HTMLElement>('.ht-avatar-name-badge');
      const avatarSubtext = this.element.querySelector<HTMLElement>('.ht-avatar-status-name');
      const isMarya = (state.avatar === 'MARYA');
      const avatarName = isMarya ? 'Marya' : 'Thiago';
      const vlibrasCode = isMarya ? 'Hosana' : 'Ícaro';

      if (avatarBadge) {
        avatarBadge.innerText = avatarName;
      }
      if (avatarSubtext) {
        avatarSubtext.innerText = `Avatar 3D: ${avatarName} (${vlibrasCode})`;
      }

      // Update collector button active state
      const collectorBtn = this.element.querySelector<HTMLButtonElement>('.ht-btn-collector');
      if (collectorBtn) {
        if (state.isCollectorActive) {
          collectorBtn.classList.add('ht-btn-active');
          collectorBtn.style.background = '#0070f3';
          collectorBtn.style.color = '#ffffff';
        } else {
          collectorBtn.classList.remove('ht-btn-active');
          collectorBtn.style.background = '#f1f5f9';
          collectorBtn.style.color = '#334155';
        }
      }

      // Update speed button label
      const speedBtn = this.element.querySelector<HTMLButtonElement>('.ht-btn-speed span');
      if (speedBtn) {
        speedBtn.innerText = `${state.speed}x`;
      }
    });
  }

  public async translateText(text: string) {
    if (!text || !text.trim()) return;
    await vlibrasManager.translateAndPlay(text);
  }

  private render() {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="ht-translator-card" style="
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 340px;
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 2147483642;
        transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
      ">
        
        <!-- Header / Drag bar -->
        <div class="ht-translator-header" style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.85);
          cursor: grab;
          user-select: none;
        ">
          <!-- Avatar Switcher (Thiago <-> Marya) -->
          <button class="ht-btn-avatar-switch" style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: #eef6ff;
            border: 1px solid #c7e0ff;
            border-radius: 20px;
            padding: 4px 10px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #0070f3;
            cursor: pointer;
            outline: none;
          " title="Alternar entre Thiago (Ícaro) e Marya (Hosana)">
            <span style="width: 14px; height: 14px; display: inline-block;">${icons.libras}</span>
            <span class="ht-avatar-name-badge">Thiago</span>
            <span style="width: 12px; height: 12px; display: inline-flex; color: #64748b;">${icons.swap}</span>
          </button>

          <!-- Window Controls -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <button class="ht-btn-minimize" style="
              width: 28px;
              height: 28px;
              border-radius: 6px;
              background: none;
              border: none;
              color: #64748b;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            " aria-label="Minimizar janela">
              <span style="width: 16px; height: 16px;">${icons.minimize}</span>
            </button>
            <button class="ht-btn-close" style="
              width: 28px;
              height: 28px;
              border-radius: 6px;
              background: none;
              border: none;
              color: #64748b;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            " aria-label="Fechar tradutor de Libras">
              <span style="width: 16px; height: 16px;">${icons.close}</span>
            </button>
          </div>
        </div>

        <!-- Body / Live 3D Motor Status & Subtitles -->
        <div class="ht-translator-body" style="
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        ">
          
          <!-- 3D Engine Card -->
          <div style="
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 14px;
            padding: 14px;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
          ">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e;"></span>
                <span style="font-size: 0.78rem; font-weight: 700; letter-spacing: 0.03em; color: #94a3b8; text-transform: uppercase;">VLibras 3D Engine</span>
              </div>
              <button class="ht-btn-focus-3d" style="
                background: rgba(255,255,255,0.12);
                border: 1px solid rgba(255,255,255,0.2);
                color: #ffffff;
                font-size: 0.72rem;
                font-weight: 600;
                padding: 3px 8px;
                border-radius: 6px;
                cursor: pointer;
              ">Focar Avatar 3D</button>
            </div>

            <div class="ht-avatar-status-name" style="font-size: 0.95rem; font-weight: 700; color: #f8fafc;">
              Avatar 3D: Thiago (Ícaro)
            </div>

            <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; line-height: 1.4;">
              Motor oficial open-source do Governo Federal e UFPB. Sinalização em Libras autêntica com expressões faciais e datilologia.
            </p>
          </div>

          <!-- Subtitle Box -->
          <div class="ht-translator-subtitle" style="
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          ">
            <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
              Texto Selecionado:
            </div>
            <div class="ht-translator-subtitle-text" style="
              font-size: 0.85rem;
              color: #0f172a;
              font-weight: 500;
              line-height: 1.4;
              max-height: 80px;
              overflow-y: auto;
            ">
              Clique em qualquer texto do site para traduzir em Libras
            </div>
            
            <!-- Libras Grammatical Gloss -->
            <div class="ht-translator-subtitle-gloss" style="
              display: none;
              font-size: 0.75rem;
              color: #0284c7;
              font-weight: 700;
              background: #f0f9ff;
              border: 1px dashed #bae6fd;
              border-radius: 6px;
              padding: 6px 8px;
              line-height: 1.35;
              text-transform: uppercase;
              word-break: break-word;
            "></div>
          </div>

        </div>

        <!-- Toolbar / Controls -->
        <div class="ht-translator-toolbar" style="
          padding: 8px 12px;
          border-top: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.92);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        ">
          <!-- Text Collector Button -->
          <button class="ht-btn-collector" style="
            display: flex;
            align-items: center;
            gap: 5px;
            background: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 8px;
            padding: 7px 10px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          " title="Seletor de Texto: clique em qualquer elemento do site">
            <span style="width: 14px; height: 14px; display: inline-block;">${icons.collector}</span>
            <span>Seletor</span>
          </button>

          <!-- Speed Selector Button -->
          <button class="ht-btn-speed" style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 8px;
            padding: 7px 9px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
          " title="Alterar velocidade da sinalização">
            <span style="width: 14px; height: 14px; display: inline-block;">${icons.speed}</span>
            <span>1x</span>
          </button>

          <!-- Repeat Button -->
          <button class="ht-btn-repeat" style="
            width: 32px;
            height: 32px;
            background: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          " title="Repetir tradução">
            <span style="width: 16px; height: 16px;">${icons.repeat}</span>
          </button>

          <!-- Dictionary Button -->
          <button class="ht-btn-dictionary" style="
            width: 32px;
            height: 32px;
            background: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          " title="Dicionário de Libras e Sinônimos">
            <span style="width: 16px; height: 16px;">${icons.dictionary}</span>
          </button>

          <!-- Opacity Button -->
          <button class="ht-btn-opacity" style="
            width: 32px;
            height: 32px;
            background: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          " title="Alternar transparência da janela">
            <span style="width: 16px; height: 16px;">${icons.contrast}</span>
          </button>
        </div>

      </div>
    `;
  }

  private attachEvents() {
    if (!this.element) return;

    // Avatar switch (Thiago <-> Marya)
    const avatarBtn = this.element.querySelector('.ht-btn-avatar-switch');
    avatarBtn?.addEventListener('click', () => {
      const current = store.getState().avatar;
      const next: AvatarType = (current === 'THIAGO' || current === 'HUGO') ? 'MARYA' : 'THIAGO';
      store.setState({ avatar: next });
      vlibrasManager.setAvatar(next);
    });

    // Focus 3D VLibras Player
    const focus3dBtn = this.element.querySelector('.ht-btn-focus-3d');
    focus3dBtn?.addEventListener('click', () => {
      vlibrasManager.openPlayer();
    });

    // Close window
    const closeBtn = this.element.querySelector('.ht-btn-close');
    closeBtn?.addEventListener('click', () => {
      store.setState({ isTranslatorOpen: false, isCollectorActive: false });
      vlibrasManager.closePlayer();
    });

    // Minimize window
    const minBtn = this.element.querySelector('.ht-btn-minimize');
    minBtn?.addEventListener('click', () => {
      this.toggleMinimize();
    });

    // Collector toggle
    const collectorBtn = this.element.querySelector('.ht-btn-collector');
    collectorBtn?.addEventListener('click', () => {
      const active = store.getState().isCollectorActive;
      store.setState({ isCollectorActive: !active });
    });

    // Speed toggle (1x -> 1.5x -> 2x -> 0.5x -> 1x)
    const speedBtn = this.element.querySelector('.ht-btn-speed');
    speedBtn?.addEventListener('click', () => {
      const speeds: SpeedRate[] = [1, 1.5, 2, 0.5];
      const current = store.getState().speed;
      const nextIdx = (speeds.indexOf(current) + 1) % speeds.length;
      const nextSpeed = speeds[nextIdx];
      store.setState({ speed: nextSpeed });
      if (window.plugin?.player?.setSpeed) {
        window.plugin.player.setSpeed(nextSpeed);
      }
    });

    // Repeat translation
    const repeatBtn = this.element.querySelector('.ht-btn-repeat');
    repeatBtn?.addEventListener('click', () => {
      const text = store.getState().currentText;
      if (text) {
        this.translateText(text);
      }
    });

    // Open Dictionary
    const dictBtn = this.element.querySelector('.ht-btn-dictionary');
    dictBtn?.addEventListener('click', () => {
      store.setState({ isDictionaryOpen: true });
    });

    // Opacity toggle (100 -> 50 -> 0 -> 100)
    const opacityBtn = this.element.querySelector('.ht-btn-opacity');
    opacityBtn?.addEventListener('click', () => {
      const opacities = [100, 50, 0];
      const current = store.getState().opacity;
      const nextIdx = (opacities.indexOf(current) + 1) % opacities.length;
      store.setState({ opacity: opacities[nextIdx] });
    });

    // Draggable header
    const header = this.element.querySelector<HTMLElement>('.ht-translator-header');
    header?.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const body = this.element?.querySelector<HTMLElement>('.ht-translator-body');
    const toolbar = this.element?.querySelector<HTMLElement>('.ht-translator-toolbar');

    if (body && toolbar) {
      if (this.isMinimized) {
        body.style.display = 'none';
        toolbar.style.display = 'none';
      } else {
        body.style.display = 'flex';
        toolbar.style.display = 'flex';
      }
    }
  }

  private handleMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return;

    this.isDragging = true;
    const card = this.element?.querySelector<HTMLElement>('.ht-translator-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    this.dragStartX = e.clientX - rect.left;
    this.dragStartY = e.clientY - rect.top;
    card.style.cursor = 'grabbing';
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;

    const card = this.element?.querySelector<HTMLElement>('.ht-translator-card');
    if (!card) return;

    const x = e.clientX - this.dragStartX;
    const y = e.clientY - this.dragStartY;

    const maxX = window.innerWidth - card.offsetWidth - 10;
    const maxY = window.innerHeight - card.offsetHeight - 10;
    const clampedX = Math.max(10, Math.min(maxX, x));
    const clampedY = Math.max(10, Math.min(maxY, y));

    card.style.left = `${clampedX}px`;
    card.style.top = `${clampedY}px`;
    card.style.right = 'auto';
    card.style.bottom = 'auto';
  }

  private handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      const card = this.element?.querySelector<HTMLElement>('.ht-translator-card');
      if (card) {
        card.style.cursor = 'default';
      }
    }
  }

  public destroy() {
    this.element?.remove();
  }
}

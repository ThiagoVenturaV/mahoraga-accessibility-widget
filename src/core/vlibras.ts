import { AvatarType } from '../types';
import { store } from '../state/store';

declare global {
  interface Window {
    VLibras?: {
      Widget: {
        new (options?: any): any;
        (options?: any): any;
      };
    };
    VLibrasWidget?: {
      path?: string;
      open?: () => void;
      close?: () => void;
      initBtn?: HTMLElement;
      access?: HTMLElement;
    };
    vlibras?: {
      translate?: (text: string) => Promise<string>;
      translateAndPlay?: (text: string) => Promise<void>;
      changeAvatar?: (avatar: string) => void;
      setSpeed?: (speed: number) => void;
      stop?: () => void;
      pause?: () => void;
    };
    plugin?: {
      translate?: (text: string) => Promise<void>;
      player?: {
        changeAvatar?: (avatar: string) => void;
        setSpeed?: (speed: number) => void;
        stop?: () => void;
        pause?: () => void;
      };
    };
  }
}

export class VLibrasManager {
  private isLoaded = false;
  private isInitializing = false;
  private currentAvatar: AvatarType = 'THIAGO';

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    if (this.isLoaded || this.isInitializing) return;
    this.isInitializing = true;

    try {
      await this.loadScript('https://vlibras.gov.br/app/vlibras-plugin.js');

      if (window.VLibras?.Widget) {
        const state = store.getState();
        const avatarCode = (state.avatar === 'MARYA') ? 'hosana' : 'icaro';

        // Initialize official VLibras Widget
        new window.VLibras.Widget({
          rootPath: 'https://vlibras.gov.br/app',
          avatar: avatarCode,
          position: 'R'
        });

        this.isLoaded = true;
        console.log('%c[Mahoraga - VLibras]%c Motor 3D oficial do VLibras conectado com sucesso!', 'color: #0070f3; font-weight: bold;', 'color: inherit;');
      }

      this.setupRootWatcher();
      this.hookNativeTranslation();

      // Sync avatar and open/close state from Mahoraga store to VLibras
      let prevTranslatorOpen = store.getState().isTranslatorOpen;
      store.subscribe((state) => {
        if (state.isTranslatorOpen && !prevTranslatorOpen) {
          this.openPlayer();
        } else if (!state.isTranslatorOpen && prevTranslatorOpen) {
          this.closePlayer();
        }
        prevTranslatorOpen = state.isTranslatorOpen;

        if (state.avatar !== this.currentAvatar) {
          this.currentAvatar = state.avatar;
          this.setAvatar(state.avatar);
        }
      });
    } catch (e) {
      console.warn('[VLibras] Falha ao carregar motor VLibras:', e);
    } finally {
      this.isInitializing = false;
    }
  }

  private hookNativeTranslation() {
    let isHooked = false;
    const attachHook = () => {
      if (window.plugin && !('__mahoragaHooked' in window.plugin)) {
        (window.plugin as any).__mahoragaHooked = true;
        const origPluginTranslate = window.plugin.translate;
        if (typeof origPluginTranslate === 'function') {
          window.plugin.translate = async (text: string) => {
            store.setState({ currentText: text, isPlaying: true, isTranslatorOpen: true });
            const gloss = await this.translateTextToGloss(text);
            store.setState({ currentGloss: gloss, isPlaying: false });
            return origPluginTranslate(text);
          };
          isHooked = true;
        }
      }

      if (window.vlibras && !('__mahoragaHooked' in window.vlibras)) {
        (window.vlibras as any).__mahoragaHooked = true;
        const origVlibrasTranslate = window.vlibras.translateAndPlay;
        if (typeof origVlibrasTranslate === 'function') {
          window.vlibras.translateAndPlay = async (text: string) => {
            store.setState({ currentText: text, isPlaying: true, isTranslatorOpen: true });
            const gloss = await this.translateTextToGloss(text);
            store.setState({ currentGloss: gloss, isPlaying: false });
            return origVlibrasTranslate(text);
          };
          isHooked = true;
        }
      }
    };

    attachHook();
    const interval = setInterval(() => {
      attachHook();
      if (isHooked) clearInterval(interval);
    }, 400);
    setTimeout(() => clearInterval(interval), 15000);
  }

  private setupRootWatcher() {
    const checkAndFix = () => {
      const appRoot = document.getElementById('vlibras-app-root');
      if (appRoot) {
        this.ensureShadowFix(appRoot);
      }
    };

    checkAndFix();
    const observer = new MutationObserver(checkAndFix);
    observer.observe(document.body, { childList: true });
  }

  private ensureShadowFix(appRoot: HTMLElement) {
    if (!appRoot.shadowRoot) return;
    if (appRoot.shadowRoot.getElementById('mahoraga-vlibras-fix')) return;

    const style = document.createElement('style');
    style.id = 'mahoraga-vlibras-fix';
    style.textContent = `
      .opacity-0 {
        pointer-events: none !important;
        visibility: hidden !important;
      }
    `;
    appRoot.shadowRoot.appendChild(style);

    // Synchronize close button inside VLibras shadow DOM with Mahoraga store
    const shadowObserver = new MutationObserver(() => {
      const buttons = appRoot.shadowRoot?.querySelectorAll('button');
      buttons?.forEach((btn) => {
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        if ((aria.includes('fechar') || aria.includes('close')) && !btn.hasAttribute('data-ht-sync')) {
          btn.setAttribute('data-ht-sync', 'true');
          btn.addEventListener('click', () => {
            store.setState({ isTranslatorOpen: false });
            this.closePlayer();
          });
        }
      });
    });
    shadowObserver.observe(appRoot.shadowRoot, { childList: true, subtree: true });
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Erro ao carregar script ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Opens the official VLibras 3D WebGL player window
   */
  public openPlayer() {
    try {
      const stored = localStorage.getItem('@vlibras-widget');
      if (stored && stored.includes('"isOpen":false')) {
        localStorage.setItem('@vlibras-widget', stored.replace('"isOpen":false', '"isOpen":true'));
      }
    } catch {}

    const appRoot = document.getElementById('vlibras-app-root');
    if (appRoot) {
      appRoot.style.display = '';
      appRoot.style.pointerEvents = '';
      this.ensureShadowFix(appRoot);

      // Force toggle attribute so MutationObserver triggers reliably
      appRoot.removeAttribute('data-active');
      requestAnimationFrame(() => {
        appRoot.setAttribute('data-active', 'true');
      });
    }

    // 1. Try window.VLibrasWidget.open()
    if (typeof window.VLibrasWidget?.open === 'function') {
      window.VLibrasWidget.open();
      return;
    }

    // 2. Try click on shadow DOM button
    const wrapper = document.getElementById('vlibras-access-wrapper');
    const shadowBtn = wrapper?.shadowRoot?.querySelector<HTMLButtonElement>('#vlibras-button');
    if (shadowBtn) {
      shadowBtn.click();
      return;
    }

    // 3. Fallback: activate app root directly if loaded
    if (appRoot) {
      appRoot.setAttribute('data-active', 'true');
    }
  }

  /**
   * Closes or hides the VLibras 3D player window
   */
  public closePlayer() {
    const appRoot = document.getElementById('vlibras-app-root');
    if (appRoot) {
      appRoot.setAttribute('data-active', 'false');
      appRoot.style.pointerEvents = 'none';
      appRoot.style.display = 'none';
    }
    try {
      const stored = localStorage.getItem('@vlibras-widget');
      if (stored && stored.includes('"isOpen":true')) {
        localStorage.setItem('@vlibras-widget', stored.replace('"isOpen":true', '"isOpen":false'));
      }
    } catch {}
  }

  /**
   * Switches avatar between Thiago (Ícaro) and Marya (Hosana)
   */
  public setAvatar(avatar: AvatarType) {
    const avatarCode = (avatar === 'MARYA') ? 'hosana' : 'icaro';
    if (window.plugin?.player?.changeAvatar) {
      window.plugin.player.changeAvatar(avatarCode);
    } else if (window.vlibras?.changeAvatar) {
      window.vlibras.changeAvatar(avatarCode);
    }
  }

  /**
   * Translates Portuguese text to Libras grammatical glosses using the official open-source VLibras service
   */
  public async translateTextToGloss(text: string): Promise<string> {
    try {
      const res = await fetch('https://traducao2.vlibras.gov.br/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const gloss = await res.text();
        return gloss.trim();
      }
    } catch (e) {
      console.warn('[VLibras] Falha ao consultar serviço de glosas:', e);
    }
    return text.toUpperCase();
  }

  /**
   * Sends text to the official VLibras 3D engine for authentic Libras signing
   */
  public async translateAndPlay(text: string): Promise<string> {
    if (!text || !text.trim()) return '';

    this.openPlayer();

    store.setState({ currentText: text, isPlaying: true, isTranslatorOpen: true });

    // 1. Fetch authentic grammatical glosses
    const gloss = await this.translateTextToGloss(text);
    store.setState({ currentGloss: gloss });

    // 2. Play via VLibras 3D runtime with retry loop while engine initialises
    const play = () => {
      if (typeof window.plugin?.translate === 'function') {
        window.plugin.translate(text);
        return true;
      }
      if (typeof window.vlibras?.translateAndPlay === 'function') {
        window.vlibras.translateAndPlay(text);
        return true;
      }
      return false;
    };

    if (!play()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (play() || attempts > 25) {
          clearInterval(interval);
          store.setState({ isPlaying: false });
        }
      }, 250);
    } else {
      setTimeout(() => store.setState({ isPlaying: false }), 400);
    }

    return gloss;
  }
}

export const vlibrasManager = new VLibrasManager();

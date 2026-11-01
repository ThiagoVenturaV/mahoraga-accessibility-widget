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

      // Sync avatar changes from Mahoraga store to VLibras
      store.subscribe((state) => {
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
    const appRoot = document.getElementById('vlibras-app-root');
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
    }
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
    this.openPlayer();

    // 1. Fetch authentic grammatical glosses
    const gloss = await this.translateTextToGloss(text);

    // 2. Play via VLibras 3D runtime with retry loop while engine initialises
    const play = () => {
      if (window.plugin?.translate) {
        window.plugin.translate(text);
        return true;
      }
      if (window.vlibras?.translateAndPlay) {
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
        }
      }, 250);
    }

    return gloss;
  }
}

export const vlibrasManager = new VLibrasManager();

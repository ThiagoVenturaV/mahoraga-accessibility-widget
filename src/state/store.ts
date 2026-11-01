import { AccessibilityState } from '../types';
import { defaultState } from '../config';

const STORAGE_KEY = 'ht_accessibility_state';

type Listener = (state: AccessibilityState, prevState: AccessibilityState) => void;

class StateStore {
  private state: AccessibilityState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadPersistedState();
  }

  private loadPersistedState(): AccessibilityState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          // Don't auto-open panels on page refresh
          isTranslatorOpen: parsed.isTranslatorOpen ?? false,
          isAddonsOpen: false,
          isDictionaryOpen: false,
          isCollectorActive: false,
          isPlaying: false
        };
      }
    } catch (e) {
      console.warn('[HandTalk] Erro ao carregar preferências do localStorage:', e);
    }
    return { ...defaultState };
  }

  private persist() {
    try {
      const toSave = {
        avatar: this.state.avatar,
        speed: this.state.speed,
        opacity: this.state.opacity,
        subtitlesEnabled: this.state.subtitlesEnabled,
        fontSizeLevel: this.state.fontSizeLevel,
        dyslexicFont: this.state.dyslexicFont,
        lineHeightLevel: this.state.lineHeightLevel,
        letterSpacingLevel: this.state.letterSpacingLevel,
        highlightLetters: this.state.highlightLetters,
        highlightLinks: this.state.highlightLinks,
        highlightHeadings: this.state.highlightHeadings,
        hideImages: this.state.hideImages,
        pauseAnimations: this.state.pauseAnimations,
        disableSounds: this.state.disableSounds,
        contrastMode: this.state.contrastMode,
        saturationMode: this.state.saturationMode,
        colorblindMode: this.state.colorblindMode
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('[HandTalk] Erro ao salvar preferências:', e);
    }
  }

  public getState(): AccessibilityState {
    return { ...this.state };
  }

  public setState(updates: Partial<AccessibilityState>) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.persist();
    this.listeners.forEach(fn => fn(this.state, prevState));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public reset() {
    const wasTranslatorOpen = this.state.isTranslatorOpen;
    this.setState({
      ...defaultState,
      isTranslatorOpen: wasTranslatorOpen
    });
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const store = new StateStore();

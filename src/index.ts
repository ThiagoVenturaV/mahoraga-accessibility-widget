import './styles/widget.css';
import { WidgetOptions } from './types';
import { defaultConfig } from './config';
import { store } from './state/store';
import { StyleManager } from './core/styles';
import { CollectorManager } from './core/collector';
import { SpeechManager } from './core/speech';
import { AudioManager } from './core/audio';
import { ReadingToolsManager } from './addons/reading-tools';
import { FloatingLauncher } from './ui/launcher';
import { TranslatorWindow } from './ui/translator-window';
import { AddonsPanel } from './ui/addons-panel';
import { DictionaryModal } from './ui/dictionary-modal';

export class HandTalkWidget {
  private options: Required<WidgetOptions>;
  private styleManager: StyleManager;
  private collectorManager: CollectorManager;
  private speechManager: SpeechManager;
  private audioManager: AudioManager;
  private readingToolsManager: ReadingToolsManager;
  private launcher: FloatingLauncher;
  private translatorWindow: TranslatorWindow;
  private addonsPanel: AddonsPanel;
  private dictionaryModal: DictionaryModal;

  constructor(options: WidgetOptions = {}) {
    this.options = { ...defaultConfig, ...options };

    // Apply initial config to state store
    store.setState({
      avatar: this.options.avatar,
      opacity: this.options.opacity
    });

    if (this.options.highContrast) {
      store.setState({ contrastMode: 'high-contrast-dark' });
    }

    // Initialize core subsystems
    this.styleManager = new StyleManager();
    this.speechManager = new SpeechManager();
    this.audioManager = new AudioManager();
    this.readingToolsManager = new ReadingToolsManager();

    // Initialize UI components
    this.translatorWindow = new TranslatorWindow();
    this.addonsPanel = new AddonsPanel();
    this.dictionaryModal = new DictionaryModal((term) => {
      this.translate(term);
    });

    this.collectorManager = new CollectorManager((text) => {
      this.translate(text);
    });

    this.launcher = new FloatingLauncher(this.options.side, this.options.align);

    // Subscribe styles to state changes
    store.subscribe((state) => {
      this.styleManager.apply(state);
    });

    // Initial style application
    this.styleManager.apply(store.getState());

    // Accessible keyboard shortcut (Alt + A to open accessibility, Alt + L to open Libras)
    this.setupKeyboardShortcuts();

    console.log('%c[Hand Talk Widget]%c Inicializado com sucesso! (REA Re-engineering)', 'color: #0070f3; font-weight: bold;', 'color: inherit;');
  }

  private setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Alt + A => Open/close addons panel
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        const isOpen = store.getState().isAddonsOpen;
        store.setState({ isAddonsOpen: !isOpen });
      }

      // Alt + L => Open/close Libras translator
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        const isOpen = store.getState().isTranslatorOpen;
        store.setState({ isTranslatorOpen: !isOpen });
      }

      // Escape => Close any active modal
      if (e.key === 'Escape') {
        store.setState({
          isAddonsOpen: false,
          isDictionaryOpen: false,
          isCollectorActive: false
        });
      }
    });
  }

  public openTranslator() {
    store.setState({ isTranslatorOpen: true });
  }

  public closeTranslator() {
    store.setState({ isTranslatorOpen: false, isCollectorActive: false });
  }

  public openAddons() {
    store.setState({ isAddonsOpen: true });
  }

  public closeAddons() {
    store.setState({ isAddonsOpen: false });
  }

  public translate(text: string) {
    store.setState({ isTranslatorOpen: true, currentText: text });
    this.translatorWindow.translateText(text);
  }

  public setAvatar(avatar: 'HUGO' | 'MAYA') {
    store.setState({ avatar });
  }

  public reset() {
    store.reset();
  }

  public destroy() {
    this.styleManager.destroy();
    this.collectorManager.destroy();
    this.speechManager.stop();
    this.audioManager.destroy();
    this.readingToolsManager.destroy();
    this.launcher.destroy();
    this.translatorWindow.destroy();
    this.addonsPanel.destroy();
    this.dictionaryModal.destroy();
  }
}

// Global alias matching Hand Talk's exact constructor: window.ht = new HT({...})
export const HT = HandTalkWidget;

declare global {
  interface Window {
    HT: typeof HandTalkWidget;
    HandTalkWidget: typeof HandTalkWidget;
    ht?: HandTalkWidget;
  }
}

if (typeof window !== 'undefined') {
  window.HT = HandTalkWidget;
  window.HandTalkWidget = HandTalkWidget;
}

export default HandTalkWidget;

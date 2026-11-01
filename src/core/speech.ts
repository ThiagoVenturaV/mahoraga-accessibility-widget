import { store } from '../state/store';

export class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private isActive = false;
  private hoveredElement: HTMLElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    this.init();
  }

  private init() {
    document.addEventListener('mouseover', this.handleMouseOver.bind(this), { passive: true });

    store.subscribe((state) => {
      this.isActive = state.pageSpeechActive;
      if (!this.isActive) {
        this.stop();
      }
    });
  }

  private handleMouseOver(e: MouseEvent) {
    if (!this.isActive || !this.synth) return;

    const target = e.target as HTMLElement | null;
    if (!target || target.closest('.ht-widget-root') || target.closest('.ht-skip')) return;

    // Read paragraphs, headers, buttons, links, list items
    const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A', 'LI', 'LABEL'];
    if (readableTags.includes(target.tagName) && target !== this.hoveredElement) {
      this.hoveredElement = target;
      const text = (target.innerText || target.getAttribute('aria-label') || '').trim();
      if (text) {
        this.speak(text);
      }
    }
  }

  public speak(text: string) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

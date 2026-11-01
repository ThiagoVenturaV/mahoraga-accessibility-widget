import { store } from '../state/store';

export class CollectorManager {
  private currentHoverEl: HTMLElement | null = null;
  private isActive = false;
  private onSelectTextCallback: (text: string) => void;

  constructor(onSelectText: (text: string) => void) {
    this.onSelectTextCallback = onSelectText;
    this.init();
  }

  private init() {
    document.addEventListener('mouseover', this.handleMouseOver.bind(this), { passive: true });
    document.addEventListener('mouseout', this.handleMouseOut.bind(this), { passive: true });
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));

    store.subscribe((state) => {
      this.isActive = state.isCollectorActive;
      if (this.isActive) {
        document.body.classList.add('ht-collector-mode');
      } else {
        document.body.classList.remove('ht-collector-mode');
        this.clearHover();
      }
    });
  }

  private isIgnored(el: Element | null): boolean {
    if (!el) return true;
    return !!(
      el.closest('.ht-widget-root') ||
      el.closest('.ht-skip') ||
      el.closest('.ht-ignore') ||
      el.closest('#vlibras-app-root') ||
      el.closest('#vlibras-access-wrapper') ||
      el.tagName === 'BODY' ||
      el.tagName === 'HTML'
    );
  }

  private clearHover() {
    if (this.currentHoverEl) {
      this.currentHoverEl.classList.remove('vlibras--hover');
      this.currentHoverEl = null;
    }
    document.querySelectorAll('.vlibras--hover').forEach((el) => {
      el.classList.remove('vlibras--hover');
    });
  }

  private handleMouseOver(e: MouseEvent) {
    if (!this.isActive) return;
    const target = e.target as HTMLElement | null;
    if (!target || this.isIgnored(target)) return;

    if (this.currentHoverEl && this.currentHoverEl !== target) {
      this.currentHoverEl.classList.remove('vlibras--hover');
    }

    target.classList.add('vlibras--hover');
    this.currentHoverEl = target;
  }

  private handleMouseOut(e: MouseEvent) {
    if (!this.isActive) return;
    const target = e.target as HTMLElement | null;
    if (target) {
      target.classList.remove('vlibras--hover');
      if (this.currentHoverEl === target) {
        this.currentHoverEl = null;
      }
    }
  }

  /**
   * Native VLibras text extraction algorithm
   */
  private extractTextFromElement(el: HTMLElement): string {
    // 1. Explicit data-vlibras-gloss attribute
    if (el.dataset.vlibrasGloss?.trim()) {
      return el.dataset.vlibrasGloss.trim();
    }
    // 2. Images: alt text
    if (el.tagName === 'IMG') {
      return (el as HTMLImageElement).alt?.trim() || '';
    }
    // 3. Form input/buttons: value or text
    if (el.tagName === 'INPUT') {
      return (el as HTMLInputElement).value?.trim() || '';
    }
    if (el.tagName === 'BUTTON') {
      return (el as HTMLButtonElement).value?.trim() || el.innerText?.trim() || '';
    }
    // 4. Select options
    if (el.tagName === 'SELECT') {
      return (el as HTMLSelectElement).selectedOptions[0]?.innerText?.trim() || '';
    }
    // 5. General text content
    return (el.innerText || el.textContent || '').trim();
  }

  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Never intercept clicks inside Mahoraga widget or VLibras player
    if (this.isIgnored(target)) {
      return;
    }

    // Check if there is an active text selection first
    const selection = window.getSelection();
    const selectionText = selection ? selection.toString().trim() : '';

    if (selectionText && selectionText.length > 0 && selectionText.length <= 1000) {
      e.preventDefault();
      e.stopPropagation();
      this.clearHover();
      store.setState({ isCollectorActive: false });
      this.onSelectTextCallback(selectionText);
      return;
    }

    // If Collector Mode is active, capture the clicked element natively
    if (this.isActive) {
      e.preventDefault();
      e.stopPropagation();

      const text = this.extractTextFromElement(target);
      if (text) {
        target.classList.add('vlibras--active');
        setTimeout(() => target.classList.remove('vlibras--active'), 1000);

        this.clearHover();
        store.setState({ isCollectorActive: false });
        this.onSelectTextCallback(text);
      }
    }
  }

  /**
   * Handles user dragging mouse to select any text on the page
   */
  private handleTextSelection(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (target && this.isIgnored(target)) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length > 1 && selectedText.length <= 1000) {
      // Only translate on selection if collector mode is active or translator is open
      if (this.isActive || store.getState().isTranslatorOpen) {
        this.onSelectTextCallback(selectedText);
      }
    }
  }

  public destroy() {
    this.clearHover();
    document.body.classList.remove('ht-collector-mode');
    document.removeEventListener('mouseover', this.handleMouseOver.bind(this));
    document.removeEventListener('mouseout', this.handleMouseOut.bind(this));
    document.removeEventListener('click', this.handleClick.bind(this), true);
    document.removeEventListener('mouseup', this.handleTextSelection.bind(this));
  }
}

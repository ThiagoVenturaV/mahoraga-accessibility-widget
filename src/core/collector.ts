import { store } from '../state/store';

export class CollectorManager {
  private overlay: HTMLDivElement | null = null;
  private currentElement: HTMLElement | null = null;
  private isActive = false;
  private onSelectTextCallback: (text: string) => void;

  constructor(onSelectText: (text: string) => void) {
    this.onSelectTextCallback = onSelectText;
    this.init();
  }

  private init() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'ht-collector-highlight ht-skip';
    this.overlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 3px dashed #0084ff;
      background: rgba(0, 132, 255, 0.15);
      border-radius: 4px;
      z-index: 2147483640;
      transition: all 0.12s ease;
      display: none;
    `;
    document.body.appendChild(this.overlay);

    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));

    store.subscribe((state) => {
      this.isActive = state.isCollectorActive;
      if (!this.isActive && this.overlay) {
        this.overlay.style.display = 'none';
        this.currentElement = null;
      }
    });
  }

  private isIgnored(el: Element | null): boolean {
    if (!el) return true;
    return !!(
      el.closest('.ht-widget-root') ||
      el.closest('.ht-skip') ||
      el.closest('.ht-ignore') ||
      el.tagName === 'BODY' ||
      el.tagName === 'HTML'
    );
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isActive || !this.overlay) return;

    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (!target || this.isIgnored(target)) {
      this.overlay.style.display = 'none';
      this.currentElement = null;
      return;
    }

    const text = (target.innerText || target.textContent || '').trim();
    if (!text) {
      this.overlay.style.display = 'none';
      return;
    }

    this.currentElement = target;
    const rect = target.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    this.overlay.style.display = 'block';
    this.overlay.style.top = `${rect.top + scrollY - 2}px`;
    this.overlay.style.left = `${rect.left + scrollX - 2}px`;
    this.overlay.style.width = `${rect.width + 4}px`;
    this.overlay.style.height = `${rect.height + 4}px`;
  }

  private handleClick(e: MouseEvent) {
    if (!this.isActive || !this.currentElement) return;

    e.preventDefault();
    e.stopPropagation();

    const text = (this.currentElement.innerText || this.currentElement.textContent || '').trim();
    if (text) {
      this.onSelectTextCallback(text);
      store.setState({ isCollectorActive: false });
    }
  }

  private handleTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length > 1 && selectedText.length <= 1000) {
      // If user selected text while translator is open, send it directly
      const state = store.getState();
      if (state.isTranslatorOpen) {
        this.onSelectTextCallback(selectedText);
      }
    }
  }

  public destroy() {
    this.overlay?.remove();
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('click', this.handleClick.bind(this), true);
    document.removeEventListener('mouseup', this.handleTextSelection.bind(this));
  }
}

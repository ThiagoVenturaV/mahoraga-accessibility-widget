import { store } from '../state/store';

export class AudioManager {
  private mutedElements: (HTMLMediaElement)[] = [];
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  private init() {
    store.subscribe((state) => {
      if (state.disableSounds) {
        this.muteAll();
      } else {
        this.unmuteAll();
      }
    });

    // Watch for dynamically added media elements
    this.observer = new MutationObserver(() => {
      if (store.getState().disableSounds) {
        this.muteAll();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private muteAll() {
    const media = document.querySelectorAll<HTMLMediaElement>('video, audio');
    media.forEach((el) => {
      if (!el.muted) {
        el.muted = true;
        this.mutedElements.push(el);
      }
    });
  }

  private unmuteAll() {
    this.mutedElements.forEach((el) => {
      el.muted = false;
    });
    this.mutedElements = [];
  }

  public destroy() {
    this.unmuteAll();
    this.observer?.disconnect();
  }
}

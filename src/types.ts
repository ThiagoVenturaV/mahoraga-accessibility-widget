export type AvatarType = 'THIAGO' | 'MARYA' | 'HUGO' | 'MAYA';

export type WidgetSide = 'left' | 'right';
export type WidgetAlign = 'top' | 'center' | 'bottom' | 'default';

export type ContrastMode = 'none' | 'high-contrast-dark' | 'high-contrast-light' | 'invert';
export type SaturationMode = 'normal' | 'monochrome' | 'low-saturation' | 'high-saturation';
export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export type SpeedRate = 0.5 | 1 | 1.5 | 2;

export interface AddonsConfig {
  aiAssistant?: {
    signTranslator?: boolean;
    synonymsMeanings?: boolean;
  };
  fontControl?: {
    fontSize?: boolean;
    textStyle?: boolean;
    lineHeight?: boolean;
    letterSpacing?: boolean;
    highlightLetters?: boolean;
  };
  navigation?: {
    pageSpeech?: boolean;
    readerMode?: boolean;
    readingMask?: boolean;
    readingGuide?: boolean;
    highlightLinks?: boolean;
    pageStructure?: boolean;
    magnifier?: boolean;
    hideImages?: boolean;
    highlightHeadings?: boolean;
    pauseAnimations?: boolean;
    disableSounds?: boolean;
  };
  colorControl?: {
    contrastMode?: boolean;
    saturationMode?: boolean;
    pageColors?: boolean;
  };
}

export interface WidgetOptions {
  token?: string;
  avatar?: AvatarType;
  align?: WidgetAlign;
  side?: WidgetSide;
  maxTextSize?: number;
  highContrast?: boolean;
  opacity?: number;
  language?: 'pt-BR' | 'en';
  exceptions?: string[];
  clickables?: string[];
  addonsMap?: AddonsConfig;
  mobileConfig?: Partial<WidgetOptions>;
  parentElement?: HTMLElement | null;
  doNotTrack?: boolean;
}

export interface AccessibilityState {
  // UI Panels
  isTranslatorOpen: boolean;
  isAddonsOpen: boolean;
  isDictionaryOpen: boolean;
  isCollectorActive: boolean;
  isPageStructureOpen: boolean;

  // Avatar Window
  avatar: AvatarType;
  speed: SpeedRate;
  opacity: number;
  currentText: string;
  currentGloss: string;
  subtitlesEnabled: boolean;
  isPlaying: boolean;
  isVlibrasActive: boolean;

  // Font Control
  fontSizeLevel: number; // 0 (normal), 1 (+25%), 2 (+50%)
  dyslexicFont: boolean;
  lineHeightLevel: number; // 0 (normal), 1 (1.6), 2 (2.0)
  letterSpacingLevel: number; // 0 (normal), 1 (0.12em), 2 (0.24em)
  highlightLetters: boolean;

  // Navigation
  pageSpeechActive: boolean;
  readingGuideActive: boolean;
  readingMaskActive: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  magnifierActive: boolean;
  hideImages: boolean;
  pauseAnimations: boolean;
  disableSounds: boolean;
  readerMode: boolean;

  // Color Control
  contrastMode: ContrastMode;
  saturationMode: SaturationMode;
  colorblindMode: ColorblindMode;
}

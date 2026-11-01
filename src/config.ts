import { WidgetOptions, AccessibilityState } from './types';

export const defaultConfig: Required<WidgetOptions> = {
  token: 'mahoraga-accessibility-widget',
  avatar: 'THIAGO',
  align: 'bottom',
  side: 'right',
  maxTextSize: 800,
  highContrast: false,
  opacity: 100,
  language: 'pt-BR',
  exceptions: ['.ht-skip', '.ht-ignore'],
  clickables: ['button', 'a', '[role="button"]'],
  parentElement: null,
  doNotTrack: false,
  mobileConfig: {
    align: 'bottom',
    side: 'right'
  },
  addonsMap: {
    aiAssistant: {
      signTranslator: true,
      synonymsMeanings: true
    },
    fontControl: {
      fontSize: true,
      textStyle: true,
      lineHeight: true,
      letterSpacing: true,
      highlightLetters: true
    },
    navigation: {
      pageSpeech: true,
      readerMode: true,
      readingMask: true,
      readingGuide: true,
      highlightLinks: true,
      pageStructure: true,
      magnifier: true,
      hideImages: true,
      highlightHeadings: true,
      pauseAnimations: true,
      disableSounds: true
    },
    colorControl: {
      contrastMode: true,
      saturationMode: true,
      pageColors: true
    }
  }
};

export const defaultState: AccessibilityState = {
  isTranslatorOpen: false,
  isAddonsOpen: false,
  isDictionaryOpen: false,
  isCollectorActive: false,

  avatar: 'THIAGO',
  speed: 1,
  opacity: 100,
  currentText: 'Olá! Clique em qualquer texto da página ou selecione uma frase para traduzir em Libras.',
  subtitlesEnabled: true,
  isPlaying: false,

  fontSizeLevel: 0,
  dyslexicFont: false,
  lineHeightLevel: 0,
  letterSpacingLevel: 0,
  highlightLetters: false,

  pageSpeechActive: false,
  readingGuideActive: false,
  readingMaskActive: false,
  highlightLinks: false,
  highlightHeadings: false,
  magnifierActive: false,
  hideImages: false,
  pauseAnimations: false,
  disableSounds: false,
  readerMode: false,

  contrastMode: 'none',
  saturationMode: 'normal',
  colorblindMode: 'none'
};

export const DICTIONARY_DATABASE: Record<string, { definition: string; category: string; description: string }> = {
  'acessibilidade': {
    definition: 'Qualidade do que é acessível, que permite a inclusão e o uso autônomo por qualquer pessoa.',
    category: 'Geral',
    description: 'Mãos abertas em frente ao peito com movimentos circulares e dedos entrelaçados simbolizando inclusão.'
  },
  'libras': {
    definition: 'Língua Brasileira de Sinais, meio legal de comunicação e expressão das comunidades surdas do Brasil.',
    category: 'Comunicação',
    description: 'Mãos em configuração em "L" unidas na frente do peito, alternando movimentos suaves para os lados.'
  },
  'olá': {
    definition: 'Saudação cordial.',
    category: 'Saudações',
    description: 'Mão aberta em frente ao rosto realizando um movimento suave de onda para a direita.'
  },
  'oi': {
    definition: 'Cumprimento amigável informal.',
    category: 'Saudações',
    description: 'Mão em formato da letra "O" com o dedo mínimo estendido formando o "I", balançando levemente.'
  },
  'obrigado': {
    definition: 'Expressão de gratidão.',
    category: 'Cortesia',
    description: 'Mão aberta toca a testa e em seguida o peito, inclinando a cabeça levemente em respeito.'
  },
  'por favor': {
    definition: 'Pedido respeitoso.',
    category: 'Cortesia',
    description: 'Palmas das mãos unidas na frente do peito deslizando para a frente suavemente.'
  },
  'bom dia': {
    definition: 'Saudação usada pela manhã.',
    category: 'Saudações',
    description: 'Mão toca os lábios e abre para frente (BOM), seguida da mão em "D" saindo do olho direito (DIA).'
  },
  'boa tarde': {
    definition: 'Saudação usada à tarde.',
    category: 'Saudações',
    description: 'Sinal de BOM seguido da mão deslizando no antebraço indicando o sol poente da tarde.'
  },
  'boa noite': {
    definition: 'Saudação usada ao anoitecer.',
    category: 'Saudações',
    description: 'Sinal de BOM seguido de ambas as mãos cobrindo os olhos suavemente (escurecer).'
  },
  'ajuda': {
    definition: 'Ato de prestar auxílio, socorro ou apoio.',
    category: 'Ação',
    description: 'Mão fechada com polegar para cima apoiada na palma aberta da outra mão, movendo-se à frente.'
  },
  'sim': {
    definition: 'Expressão afirmativa.',
    category: 'Resposta',
    description: 'Mão em punho com o dedo indicador balançando para cima e para baixo (como o sinal de concordância).'
  },
  'não': {
    definition: 'Expressão negativa.',
    category: 'Resposta',
    description: 'Indicador levantado balançando lateralmente acompanhado de expressão facial de negação.'
  },
  'thiago': {
    definition: 'Avatar virtual masculino inteligente e acessível do widget.',
    category: 'Personagem',
    description: 'Sinal amigável e expressivo de Thiago com topete característico e sinalização fluente.'
  },
  'marya': {
    definition: 'Avatar virtual feminina inteligente e expressiva do widget.',
    category: 'Personagem',
    description: 'Sinal identificador de Marya com referência ao rabo de cavalo e sorriso comunicativo.'
  },
  'hugo': {
    definition: 'Avatar virtual masculino (alias de Thiago).',
    category: 'Personagem',
    description: 'Sinal de amigo inteligente com topete característico.'
  },
  'maya': {
    definition: 'Avatar virtual feminina (alias de Marya).',
    category: 'Personagem',
    description: 'Sinal de amiga inteligente com sorriso comunicativo.'
  }
};

export const I18N = {
  'pt-BR': {
    widgetTitle: 'Acessibilidade e Tradutor de Libras',
    launcherAriaLabel: 'Abrir menu de acessibilidade e tradutor de Libras',
    translatorTitle: 'Tradutor de Libras',
    addonsTitle: 'Recursos Assistivos',
    dictionaryTitle: 'Dicionário de Libras',
    collectorPrompt: 'Clique em qualquer texto do site para traduzir em Libras',
    collectorActivePrompt: 'Modo seleção ativo: passe o mouse e clique no texto desejado',
    avatarThiago: 'Thiago',
    avatarMarya: 'Marya',
    speedLabel: 'Velocidade',
    repeatLabel: 'Repetir',
    dictionaryLabel: 'Dicionário',
    collectorLabel: 'Seletor',
    opacityLabel: 'Transparência',
    resetLabel: 'Limpar configurações',
    resetSuccess: 'Configurações de acessibilidade restauradas!',
    closeLabel: 'Fechar',
    minimizeLabel: 'Minimizar',
    searchDictionaryPlaceholder: 'Pesquisar sinal ou palavra...',
    searchNotFound: 'Nenhum sinal encontrado. Tente buscar termos como "acessibilidade", "libras", "olá", "obrigado".',
    copySuccess: 'Copiado para a área de transferência!',
    categories: {
      aiAssistant: 'Assistente IA & Libras',
      fontControl: 'Controle de Fonte',
      navigation: 'Navegação & Leitura',
      colorControl: 'Controle de Cores'
    },
    tools: {
      signTranslator: { title: 'Tradutor de Libras', desc: 'Avatar virtual 3D traduzindo textos em tempo real' },
      synonymsMeanings: { title: 'Dicionário de Sinais', desc: 'Glossário e significados ilustrados em Libras' },
      fontSize: { title: 'Tamanho da Fonte', desc: 'Aumente o tamanho dos textos em até 50%' },
      textStyle: { title: 'Fonte Amigável', desc: 'Tipografia otimizada para dislexia e legibilidade' },
      lineHeight: { title: 'Espaço entre Linhas', desc: 'Amplia a altura de linha facilitando a leitura' },
      letterSpacing: { title: 'Espaço entre Letras', desc: 'Maior respiro entre cada caractere do texto' },
      highlightLetters: { title: 'Letras Destacadas', desc: 'Destaca a primeira letra e pontuações' },
      pageSpeech: { title: 'Leitor de Sites', desc: 'Lê em voz alta o conteúdo sob o cursor (TTS)' },
      readingGuide: { title: 'Guia de Leitura', desc: 'Régua horizontal que acompanha o olhar' },
      readingMask: { title: 'Máscara de Leitura', desc: 'Escurece o fundo e foca na linha em leitura' },
      magnifier: { title: 'Lupa de Conteúdo', desc: 'Lente de aumento que segue o mouse' },
      highlightLinks: { title: 'Destaque de Links', desc: 'Sublinha e ressalta todos os links da página' },
      highlightHeadings: { title: 'Destacar Títulos', desc: 'Marca cabeçalhos (H1 a H6) com etiquetas' },
      hideImages: { title: 'Esconder Imagens', desc: 'Oculta imagens para diminuir distrações visuais' },
      pauseAnimations: { title: 'Pausar Animações', desc: 'Interrompe movimentos, GIFs e transições' },
      disableSounds: { title: 'Parar Sons', desc: 'Silencia reprodutores de áudio e vídeo na página' },
      readerMode: { title: 'Modo Leitura', desc: 'Visualização limpa focada apenas no texto principal' },
      contrastMode: { title: 'Contraste de Cores', desc: 'Alto contraste escuro, claro ou invertido' },
      saturationMode: { title: 'Intensidade de Cores', desc: 'Monocromático, baixa ou alta saturação' },
      colorblindMode: { title: 'Modo Daltônico', desc: 'Filtros para protanopia, deuteranopia e tritanopia' }
    }
  }
};

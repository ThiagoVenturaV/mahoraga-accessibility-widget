# Engenharia Reversa do Hand Talk Plugin via REA (Reverse Engineer Anything)

Este documento registra o processo de análise, engenharia reversa e reconstrução de comportamento do **Hand Talk Plugin** (referência: [handtalk.me/br](https://www.handtalk.me/br/)) utilizando o ecossistema e técnicas do **REA** (`ThiagoVenturaV/rea`).

---

## 1. Alvo de Análise
- **URL Base:** `https://www.handtalk.me/br/`
- **Script Carregado:** `https://plugin.handtalk.me/web/latest/handtalk.min.js`
- **Tamanho do Bundle:** 533 KB (JavaScript empacotado via Parcel)
- **Chunks Adicionais:**
  - `AddonsPanel.908e48bb.js` (172 KB)
  - `TranslatorPanel.f21973f3.js` (165 KB)
  - `readerModeActions.dd109b4b.js`
  - `pdf-reader.f4062951.js`

---

## 2. Metodologia de Análise REA
Com base na metodologia do REA:
1. **Inspeção de Dependências e Bundles:**
   - Detecção do runtime: Preact + Zustand + Styled-Components + Design System "Yotta" (`@hand-talk/yotta-core`).
   - Arquitetura de código: *Feature-Sliced Design* (`@/app`, `@/features/...`, `@/entities/...`, `@/shared/...`).
2. **Extração de Configuração Padrão (`defaultConfig`):**
   - Configurações do inicializador `window.ht = new HT({...})`:
     - `token`: Identificador da conta/site.
     - `avatar`: `"HUGO"` ou `"MAYA"`.
     - `align`: `"top"`, `"center"`, `"bottom"` ou `"default"`.
     - `side`: `"right"` ou `"left"`.
     - `maxTextSize`: Limite de caracteres para tradução direta (padrão 800-1000 caracteres).
     - `highContrast`: Flag booleana de inicialização em alto contraste.
     - `opacity`: Nível de opacidade da janela do avatar (0, 50, 100).
     - `exceptions`: Seletores de elementos a ignorar.
     - `clickables`: Seletores de elementos adicionais com prioridade de clique.
3. **Mapeamento de Módulos e Addons (`addonsMap`):**
   A engenharia reversa do módulo revelou 4 grupos principais de recursos assistivos:
   - **`aiAssistant`**:
     - `signTranslator`: Tradutor virtual 3D em Língua de Sinais (Hugo / Maya).
     - `synonymsMeanings`: Dicionário e sinônimos integrados.
   - **`fontControl`**:
     - `fontSize`: Ajuste cíclico de tamanho de fonte (3 níveis: normal, +25%, +50%).
     - `textStyle`: Alternância para tipografia amigável à dislexia / sem serifa.
     - `lineHeight`: Altura de linha aumentada (1.5x, 2.0x).
     - `letterSpacing`: Espaçamento ampliado entre caracteres.
     - `highlightLetters`: Destaque visual de letras e caracteres.
   - **`navigation`**:
     - `pageSpeech`: Leitor de tela / voz sintetizada com Web Speech API (`SpeechSynthesis`).
     - `readerMode`: Modo de leitura focado (isolamento do artigo).
     - `readingMask`: Máscara escura de leitura que acompanha a posição vertical do cursor.
     - `readingGuide`: Guia/régua de leitura horizontal que segue o mouse.
     - `highlightLinks`: Destaque contrastante e sublinhado em tags `<a>`.
     - `highlightHeadings`: Destaque visual para cabeçalhos estruturais (`<h1>` a `<h6>`).
     - `magnifier`: Lupa de conteúdo com aumento sob o ponteiro do mouse.
     - `hideImages`: Ocultação / diminuição de contraste e opacidade de imagens.
     - `pauseAnimations`: Congelamento de animações CSS, GIFs e transições.
     - `disableSounds`: Interrupção e silenciamento de áudio/vídeo da página.
     - `pageStructure`: Sumário de estrutura semântica da página.
   - **`colorControl`**:
     - `contrastMode`: Alto Contraste (Escuro, Claro, Invertido).
     - `saturationMode`: Saturação de cores (Monocromático, Baixa, Alta).
     - `pageColors`: Filtros de daltonismo (Protanopia, Deuteranopia, Tritanopia, Acromatopsia).

---

## 3. Reconstrução Arquitetural
Neste projeto, reconstruímos e aprimoramos todo esse comportamento em TypeScript nativo e modular, sem dependências proprietárias fechadas:
- API idêntica: `new HT({ ... })` ou `new HandTalkWidget({ ... })`.
- Botão flutuante acessível e arrastável (`launcher`).
- Janela do Tradutor de Libras com Avatar 3D interativo (Hugo e Maya), controle de velocidade (0.5x, 1x, 1.5x, 2x), repetição, legendas, modo seletor/coletor de texto (`collector`) e dicionário de termos em Libras.
- Painel de Recursos Assistivos com todas as categorias do Hand Talk.
- Armazenamento de preferências no `localStorage` para persistência entre páginas.
- Compatibilidade total com acessibilidade WCAG 2.1 (ARIA, foco por teclado com Tab/Shift+Tab, Esc).

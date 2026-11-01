# ⚔️ Mahoraga Accessibility Widget (REA Re-engineered)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![REA Powered](https://img.shields.io/badge/Reverse%20Engineered%20With-REA-purple.svg)](https://github.com/morluto/rea)

**Widget moderno de acessibilidade digital e tradutor de Língua Brasileira de Sinais (Libras) com avatares virtuais 3D (Thiago & Marya).**  
Comportamento e arquitetura totalmente extraídos e reconstruídos através de engenharia reversa no plugin da [Hand Talk](https://www.handtalk.me/br/) utilizando o framework **REA** (*Reverse Engineer Anything*).

[Demonstração Interativa](#demonstração-interativa) · [Como o REA foi Utilizado](#como-o-rea-foi-utilizado) · [Recursos Implementados](#recursos-implementados) · [Como Usar](#como-usar) · [Atalhos de Teclado](#atalhos-de-teclado)

</div>

---

## 📌 Visão Geral

O **Mahoraga Accessibility Widget** traz para qualquer página web uma experiência completa de acessibilidade digital e inclusão para pessoas surdas, cegas, com baixa visão, dislexia, daltonismo ou limitações motoras e cognitivas.

Todo o comportamento do botão flutuante, da janela do tradutor com avatar, do seletor interativo de texto da página (*collector mode*), do dicionário de sinais e das mais de 15 ferramentas assistivas foi analisado e reconstruído a partir do plugin oficial da Hand Talk.

---

## 🔬 Como o REA foi Utilizado na Engenharia Reversa

Utilizando o ecossistema e técnicas do [REA (Reverse Engineer Anything)](https://github.com/morluto/rea):

1. **Inspeção de Rede e Resolução de Bundles:**
   - Script alvo inspecionado: `https://plugin.handtalk.me/web/latest/handtalk.min.js` (533 KB)
   - Chunks dinâmicos recuperados: `AddonsPanel.908e48bb.js` (172 KB) e `TranslatorPanel.f21973f3.js` (165 KB).
2. **Desconstrução de Estado e Addons (`addonsMap`):**
   - Extração da assinatura exata da configuração (`token`, `avatar`, `align`, `side`, `maxTextSize`, `highContrast`, `opacity`, `exceptions`, `clickables`).
   - Mapeamento das 4 categorias de recursos assistivos (`aiAssistant`, `fontControl`, `navigation`, `colorControl`).
3. **Reconstrução Limpa em TypeScript:**
   - Criação de uma implementação nativa, modular e ultrarrápida (menos de 85 KB compilado), sem dependências proprietárias pesadas, mantendo compatibilidade de API com `new HT({...})` e `window.ht`.

Os scripts de análise e extração desenvolvidos durante a engenharia reversa estão documentados em [`research/REA_ANALYSIS.md`](./research/REA_ANALYSIS.md).

---

## ✨ Recursos Implementados

### 1. 🤖 Assistente IA & Tradutor de Libras
- **Avatares 3D Interativos:** Renderização em tempo real de **Thiago** (avatar masculino) e **Marya** (avatar feminina) com alternância com um clique.
- **Expressões Faciais e Gestos de Libras:** Animações naturais de respiração, piscadas, sorrisos e gestos sincronizados de datilologia e sinais em Libras.
- **Seletor de Texto (*Collector Mode*):** Passe o mouse sobre qualquer elemento do site para destacá-lo com retângulo pontilhado e clique para enviar diretamente ao avatar.
- **Tradução por Seleção:** Tradução instantânea de qualquer texto selecionado com o cursor na página.
- **Controle de Velocidade:** Ajuste cíclico de velocidade de sinalização em 4 níveis: **0.5x**, **1.0x (Normal)**, **1.5x (Rápido)** e **2.0x (Super Rápido)**.
- **Repetir Tradução:** Botão de replay para rever a sinalização da frase quantas vezes desejar.
- **Legendas Dinâmicas:** Exibição sincronizada do texto transcrito logo abaixo do avatar.
- **Dicionário de Libras & Sinônimos:** Modal com busca em tempo real de termos e sinais em Libras com descrições detalhadas e botão "Ver Sinal".
- **Janela Arrastável e Opacidade:** Janela flutuante redimensionável e arrastável pelo cabeçalho com 3 níveis de transparência (100%, 50%, translúcido).

### 2. 🔤 Controle de Fonte
- **Tamanho da Fonte:** Aumento cíclico de tamanho (+0%, +15%, +30%) sem quebrar o layout da página.
- **Fonte Amigável para Dislexia:** Tipografia *Atkinson Hyperlegible* com diferenciação clara entre caracteres similares.
- **Espaço entre Linhas:** Ajuste de entrelinhas (Normal, 1.8x, 2.2x).
- **Espaço entre Letras:** Aumento do respiro entre caracteres (Normal, 0.12em, 0.24em).
- **Letras Destacadas:** Realce da primeira letra de cada parágrafo e título para facilitar a escaneabilidade visual.

### 3. 🧭 Navegação & Leitura Assistiva
- **Leitor de Sites (Text-To-Speech):** Leitura em voz alta via Web Speech API ao passar o mouse sobre parágrafos, cabeçalhos e botões.
- **Guia de Leitura (Régua):** Régua horizontal ciano brilhante que acompanha verticalmente a linha do olhar do usuário.
- **Máscara de Leitura:** Fundo escurecido que destaca apenas uma fresta transparente na altura do cursor.
- **Lupa de Conteúdo (*Magnifier*):** Lente de aumento circular que segue o ponteiro ampliando textos.
- **Destaque de Links:** Realce em amarelo forte com sublinhado sólido e contraste reforçado em todas as tags `<a>`.
- **Destacar Cabeçalhos:** Identificação e destaque de estrutura hierárquica `<h1>` a `<h6>`.
- **Esconder Imagens:** Oculta ou diminui drasticamente a opacidade de imagens e mídias visuais.
- **Pausar Animações:** Congela animações CSS, GIFs e transições para usuários sensíveis a movimento.
- **Parar Sons:** Silencia e pausa reprodutores de áudio e vídeo na página.
- **Modo Leitura:** Oculta cabeçalhos, rodapés e barras laterais, centralizando a leitura limpa do artigo.

### 4. 🎨 Controle de Cores & Contraste
- **Alto Contraste:** 
  - *Escuro:* Fundo preto puro (`#000`), textos em amarelo e ciano de alto contraste.
  - *Claro:* Fundo branco puro (`#fff`), textos em preto com bordas sólidas.
  - *Invertido:* Inversão total de luminância.
- **Intensidade de Cores:** Monocromático (preto e branco), baixa saturação ou alta saturação.
- **Filtros para Daltonismo:** Simulação e correção via matrizes SVG para **Protanopia**, **Deuteranopia**, **Tritanopia** e **Acromatopsia**.

### 5. 💾 Persistência & Reset
- **LocalStorage:** Todas as preferências de acessibilidade e avatar escolhido são salvas e restauradas automaticamente.
- **Limpar Configurações:** Botão de reset de um clique que restaura a página instantaneamente ao seu estado original.

---

## 🚀 Como Usar

### 1. Inclusão via Script Tag (CDN / Produção)

Adicione o script e a folha de estilo compilados no final do `<body>` do seu site:

```html
<!-- Mahoraga Accessibility Widget -->
<link rel="stylesheet" href="dist/mahoraga-widget.css" />
<script src="dist/mahoraga-widget.umd.js"></script>

<script>
  window.onload = function() {
    window.mahoraga = new Mahoraga({
      token: "meu-site-token",
      avatar: "THIAGO",     // "THIAGO" ou "MARYA"
      side: "right",         // "right" ou "left"
      align: "bottom",       // "bottom", "center", "top"
      highContrast: false,
      opacity: 100
    });
  };
</script>
```

### 2. Inclusão via NPM / Módulo ES

```bash
npm install mahoraga-accessibility-widget
```

```typescript
import { Mahoraga } from 'mahoraga-accessibility-widget';
import 'mahoraga-accessibility-widget/dist/mahoraga-widget.css';

const widget = new Mahoraga({
  avatar: 'THIAGO',
  side: 'right',
  align: 'bottom'
});

// Controlar programaticamente
widget.openTranslator();
widget.translate('Olá! Acessibilidade digital para todos.');
widget.openAddons();
```

---

## ⌨️ Atalhos de Teclado Acessíveis

| Atalho | Ação |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>A</kbd> | Abre ou fecha o painel de **Recursos Assistivos** |
| <kbd>Alt</kbd> + <kbd>L</kbd> | Abre ou fecha a janela do **Tradutor de Libras** |
| <kbd>Esc</kbd> | Fecha qualquer janela, menu ou modal aberto |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Navega sequencialmente entre os botões com foco visível |

---

## 📁 Estrutura do Repositório

```text
handtalk-accessibility-widget/
├── research/                  # Registros da engenharia reversa via REA
│   ├── REA_ANALYSIS.md        # Relatório de análise e engenharia reversa
│   └── extract_*.js           # Scripts de extração e inspeção de chunks
├── src/
│   ├── index.ts               # Ponto de entrada e bootstrap global do widget
│   ├── types.ts               # Tipagens TypeScript completas
│   ├── config.ts              # Configurações padrão, dicionário e i18n
│   ├── state/
│   │   └── store.ts           # Store reativo de preferências com LocalStorage
│   ├── core/
│   │   ├── collector.ts       # Modo seletor de texto e seleção de página
│   │   ├── speech.ts          # Síntese de voz (Web Speech API)
│   │   ├── audio.ts           # Gerenciador de silenciamento de mídias
│   │   └── styles.ts          # Injeção de CSS dinâmico e filtros SVG
│   ├── addons/
│   │   └── reading-tools.ts   # Régua de leitura, máscara e lupa de aumento
│   ├── ui/
│   │   ├── launcher.ts        # Botão flutuante acessível
│   │   ├── translator-window.ts # Janela do Tradutor de Libras
│   │   ├── addons-panel.ts    # Painel categorizado de recursos assistivos
│   │   ├── dictionary-modal.ts# Modal do Dicionário de Libras
│   │   ├── avatar-renderer.ts # Motor Canvas 2D/3D dos avatares Thiago e Marya
│   │   └── icons.ts           # Ícones SVG acessíveis
│   └── styles/
│       └── widget.css         # Estilos isolados com animações
├── demo/
│   └── index.html             # Demonstração interativa completa
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/ThiagoVenturaV/mahoraga-accessibility-widget.git
cd mahoraga-accessibility-widget
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento com a demonstração:
```bash
npm run dev
```

4. Compile o pacote de produção:
```bash
npm run build
```

---

## 📄 Licença

Distribuído sob a licença [MIT](./LICENSE). Desenvolvido para fins de pesquisa, interoperabilidade e acessibilidade digital aberta.
Marcas e personagens de referência (Hugo e Maya) são marcas registradas de Hand Talk.

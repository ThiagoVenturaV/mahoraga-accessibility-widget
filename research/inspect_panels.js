const fs = require('fs');
const path = require('path');

['AddonsPanel.js', 'TranslatorPanel.js'].forEach(fileName => {
  const file = fs.readFileSync(path.join(__dirname, fileName), 'utf8');
  console.log(`\n=================== ${fileName} ===================`);
  // Portuguese UI texts
  const ptMatches = file.match(/["'][^"']*(?:Acessibilidade|Traduz|Libras|Contraste|Velocidade|Fonte|Fechar|Configura|Ajuda|Ativar|Desativar|Arrast|Tamanho|Dalt[oô]nico|Leitor|Guia|M[aá]scara|Imagens|Anima|Sons|Hugo|Maya|Dicion[aá]rio)[^"']*["']/gi);
  if (ptMatches) {
    console.log('--- UI texts ---');
    console.log([...new Set(ptMatches)].slice(0, 30));
  }
  // Styled components or CSS properties
  const cssMatches = file.match(/styled\.[a-z0-9]+`[^`]+`/gi);
  if (cssMatches) {
    console.log('Styled components count:', cssMatches.length);
  }
});

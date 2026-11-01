const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'handtalk.min.js'), 'utf8');

// Search for strings in quotes that contain Portuguese accessibility terms
const ptMatches = content.match(/["'][^"']*(?:Acessibilidade|Traduz|Libras|Contraste|Velocidade|Dicion[aá]rio|Hugo|Maya|Fonte|Fechar|Configura|Ajuda|Ativar|Desativar|Arrast|Tamanho)[^"']*["']/gi);

if (ptMatches) {
  const unique = [...new Set(ptMatches)].slice(0, 50);
  console.log('--- UI Strings in bundle ---');
  unique.forEach(s => console.log(s));
}

// Search for styled-components CSS or template literals with class or component names
const classMatches = content.match(/class\s+([A-Za-z0-9_]+)/g);
console.log('--- Classes found ---');
if (classMatches) {
  console.log([...new Set(classMatches)].slice(0, 30));
}

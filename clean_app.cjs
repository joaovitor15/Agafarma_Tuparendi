const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import
app = app.replace("import extenso from 'extenso';\n", "");

// Remove state
app = app.replace(/const \[showSicrediSettings.*?\n/, "");
app = app.replace(/const \[valorSicredi.*?\n/, "");

// Clean the menu item and button
// This can be tricky with regex, so we'll just replace specific blocks

// Sidebar button
app = app.replace(
  /\{\(userPermissions\?\.pode_acessar_sicredi \|\| userPermissions\?\.is_admin\) && \([\s\S]*?onClick=\{\(\) => \{ setCurrentPage\('recibos_sicredi'\); setIsSidebarOpen\(false\); \}\}[\s\S]*?<\/button>\s*\)\}/,
  ""
);

// Card on Home
app = app.replace(
  /\{\/\* Card do Sicredi \*\/\}\s*\{\(userPermissions\?\.pode_acessar_sicredi \|\| userPermissions\?\.is_admin\) && \([\s\S]*?onClick=\{\(\) => setCurrentPage\('recibos_sicredi'\)\}[\s\S]*?<\/div>\s*\)\}/,
  ""
);

// In the conditional rendering:
// {(currentPage === 'premio_meta' || currentPage === 'recibos_sicredi') && (
app = app.replace(
  /\{\(currentPage === 'premio_meta' \|\| currentPage === 'recibos_sicredi'\) && \(/g,
  "{currentPage === 'premio_meta' && ("
);

app = app.replace(
  /\{currentPage === 'premio_meta' \? 'Prêmio Meta' : 'Recibos Sicredi'\}/g,
  "Prêmio Meta"
);

app = app.replace(
  /\{currentPage === 'premio_meta' \? 'Emissão rápida de recibos\.' : 'Emita recibos do Programa Juntos na hora\.'\}/g,
  "Emissão rápida de recibos."
);

// Remove the whole block for `currentPage === 'recibos_sicredi' ? ( ... ) : (`
const sicrediRenderRegex = /\{currentPage === 'recibos_sicredi' \? \([\s\S]*?\) : showNewEmployeeForm \? \(/;
app = app.replace(sicrediRenderRegex, "{\n                showNewEmployeeForm ? (");

// Remove the specific buttons from the top bar
app = app.replace(
  /\{currentPage === 'recibos_sicredi' && \([\s\S]*?Gerar PDF[\s\S]*?Dados Bancários[\s\S]*?<\/button>\s*<\/>\s*\)\}/,
  ""
);

// Remove handleGeneratePDFSicredi
app = app.replace(
  /const handleGeneratePDFSicredi = \(\) => \{[\s\S]*?html2pdf\(\)\.set\(opt\)\.from\(htmlContent\)\.save\(\);\s*\};/,
  ""
);

// Remove valorSicredi handling
app = app.replace(
  /const handleValorSicrediChange = \([\s\S]*?setValorSicredi\(formattedValue\);\s*\};/,
  ""
);

fs.writeFileSync('src/App.tsx', app);
console.log('Cleaned App.tsx');

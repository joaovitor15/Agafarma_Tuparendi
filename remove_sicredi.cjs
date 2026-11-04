const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleGeneratePDFSicredi = \(\) => \{[\s\S]*?html2pdf\(\)\.set\(opt\)\.from\(htmlContent\)\.save\(\);\s*\};/;
app = app.replace(regex, "");

fs.writeFileSync('src/App.tsx', app);
console.log('Removed handleGeneratePDFSicredi');

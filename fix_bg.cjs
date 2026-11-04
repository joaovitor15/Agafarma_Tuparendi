const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/dark:bg-gray-900/g, 'dark:bg-[#0b1120]');
content = content.replace(/dark:bg-gray-800/g, 'dark:bg-[#131b2f]');
content = content.replace(/dark:border-gray-700/g, 'dark:border-[#1e2b40]');
fs.writeFileSync('src/App.tsx', content);

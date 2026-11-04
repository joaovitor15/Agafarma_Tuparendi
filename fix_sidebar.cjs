const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldActive = "bg-blue-50 text-[#0066b3] dark:bg-gradient-to-r dark:from-[#0066b3]/20 dark:to-transparent dark:text-blue-400 dark:border-l-2 dark:border-blue-500 rounded-r-lg rounded-l-none";
const newActive = "bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg";

const oldInactive = "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 border-l-2 border-transparent";
const newInactive = "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent";

content = content.split(oldActive).join(newActive);
content = content.split(oldInactive).join(newInactive);

fs.writeFileSync('src/App.tsx', content);
console.log('Sidebar links fixed');

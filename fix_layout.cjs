const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Header background
content = content.replace(
  /<header className="bg-\[#0066b3\] dark:bg-\[#131b2f\] text-white shadow-md z-30 relative border-b border-transparent dark:border-\[#2a3441\]">/,
  '<header className="bg-gradient-to-r from-[#0066b3] to-[#005291] dark:from-[#0b1120] dark:to-[#131b2f] text-white shadow-sm z-30 relative border-b border-transparent dark:border-[#1e2b40]">'
);

// Sidebar background
content = content.replace(
  /w-64 bg-white dark:bg-\[#131b2f\] shadow-xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 dark:border-\[#2a3441\]/g,
  'w-64 bg-white dark:bg-[#0b1120] shadow-xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 dark:border-[#1e2b40]'
);

// Sidebar active links - instead of regex for every link, let's replace the common classes
content = content.replace(
  /bg-blue-50 text-blue-700 dark:bg-blue-900\/40 dark:text-blue-400/g,
  'bg-blue-50 text-[#0066b3] dark:bg-gradient-to-r dark:from-[#0066b3]/20 dark:to-transparent dark:text-blue-400 dark:border-l-2 dark:border-blue-500 rounded-r-lg rounded-l-none'
);

content = content.replace(
  /text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/g,
  'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
);

fs.writeFileSync('src/App.tsx', content);

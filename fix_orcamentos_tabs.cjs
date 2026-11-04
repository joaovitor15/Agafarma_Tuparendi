const fs = require('fs');
let c = fs.readFileSync('src/components/OrcamentosJudiciais.tsx', 'utf8');

const regex = /<div className="flex space-x-2 sm:space-x-6 border-b border-gray-200 dark:border-\[#1e2b40\] mb-6 px-1">[\s\S]*?Histórico[\s\S]*?<\/button>\s*<\/div>/;

const newTabsStr = `<div className="flex flex-wrap items-center gap-2 mb-8 px-1">
        <button
          onClick={() => setActiveTab('novo')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'novo'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }\`}
        >
          <span>Orçamentos Judiciais</span>
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'historico'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }\`}
        >
          <span>Histórico</span>
        </button>
      </div>`;

if (regex.test(c)) {
  c = c.replace(regex, newTabsStr);
  fs.writeFileSync('src/components/OrcamentosJudiciais.tsx', c);
  console.log('Replaced tabs in OrcamentosJudiciais');
} else {
  console.log('Regex did not match in OrcamentosJudiciais.tsx');
}

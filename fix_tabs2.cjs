const fs = require('fs');
let c = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

const regex = /<div className="flex space-x-1 border-b border-gray-200 dark:border-\[#1e2b40\] mb-6 w-full overflow-x-auto" style={{ scrollbarWidth: 'none' }}>[\s\S]*?NF Vencidos[\s\S]*?<\/button>\s*<\/div>/;

const newTabsStr = `<div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('empresa')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'empresa'
              ? 'bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }\`}
        >
          <span>NF Empresa</span>
        </button>
        <button
          onClick={() => setActiveTab('vencidos')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'vencidos'
              ? 'bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }\`}
        >
          <span>NF Vencidos</span>
        </button>
      </div>`;

if (regex.test(c)) {
  c = c.replace(regex, newTabsStr);
  fs.writeFileSync('src/components/NotasFiscais.tsx', c);
  console.log('Replaced tabs in NotasFiscais');
} else {
  console.log('Regex did not match in NotasFiscais.tsx');
}

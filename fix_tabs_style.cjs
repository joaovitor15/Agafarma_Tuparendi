const fs = require('fs');

// Notas Fiscais
let c1 = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

if (!c1.includes('import {') || !c1.includes('Building2')) {
    c1 = c1.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Building2, Clock } from 'lucide-react';");
}

const nfRegex = /<div className="flex flex-wrap items-center gap-2 mb-8">[\s\S]*?<\/button>\s*<\/div>/;

const nfNewTabs = `<div className="flex flex-wrap items-center gap-1 mb-8">
        <button
          onClick={() => setActiveTab('empresa')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'empresa'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Building2 className="w-4 h-4" />
          <span>NF Empresa</span>
        </button>
        <button
          onClick={() => setActiveTab('vencidos')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'vencidos'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Clock className="w-4 h-4" />
          <span>NF Vencidos</span>
        </button>
      </div>`;

c1 = c1.replace(nfRegex, nfNewTabs);
fs.writeFileSync('src/components/NotasFiscais.tsx', c1);


// Orcamentos Judiciais
let c2 = fs.readFileSync('src/components/OrcamentosJudiciais.tsx', 'utf8');

if (!c2.includes('import {') || !c2.includes('Scale')) {
    c2 = c2.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Scale, History } from 'lucide-react';");
}

const orcRegex = /<div className="flex flex-wrap items-center gap-2 mb-8 px-1">[\s\S]*?<\/button>\s*<\/div>/;

const orcNewTabs = `<div className="flex flex-wrap items-center gap-1 mb-8 px-1">
        <button
          onClick={() => setActiveTab('novo')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'novo'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Scale className="w-4 h-4" />
          <span>Orçamentos Judiciais</span>
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all border \${
            activeTab === 'historico'
              ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <History className="w-4 h-4" />
          <span>Histórico</span>
        </button>
      </div>`;

c2 = c2.replace(orcRegex, orcNewTabs);
fs.writeFileSync('src/components/OrcamentosJudiciais.tsx', c2);

console.log('Tabs updated');

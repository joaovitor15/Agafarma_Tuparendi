const fs = require('fs');

// 1. Update OrcamentosJudiciais.tsx
let orc = fs.readFileSync('src/components/OrcamentosJudiciais.tsx', 'utf8');

// Update tabs
const orcTabsRegex = /<div className="flex flex-wrap items-center gap-1 mb-8 px-1">[\s\S]*?<\/button>\s*<\/div>/;
const orcNewTabs = `<div className="flex flex-wrap items-center gap-1 mb-8 px-1">
        <button
          onClick={() => setActiveTab('novo')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all \${
            activeTab === 'novo'
              ? 'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Scale className="w-4 h-4" />
          <span>Orçamentos Judiciais</span>
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all \${
            activeTab === 'historico'
              ? 'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <History className="w-4 h-4" />
          <span>Histórico</span>
        </button>
      </div>`;
orc = orc.replace(orcTabsRegex, orcNewTabs);

// Update "Selecione o paciente" background
orc = orc.replace(
  'className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 font-medium text-gray-700 dark:text-white appearance-none cursor-pointer shadow-sm"',
  'className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-[#1e2b40] font-medium text-gray-700 dark:text-gray-200 appearance-none cursor-pointer shadow-sm"'
);

// Update "Buscar pelo nome" background so it matches
orc = orc.replace(
  'className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-white/5 dark:text-white"',
  'className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-[#1e2b40] dark:text-gray-200"'
);

// Add style to options
orc = orc.replace(
  /<option value="">Selecione o paciente<\/option>/g,
  '<option value="" className="bg-white dark:bg-[#162032] dark:text-gray-200">Selecione o paciente</option>'
);
orc = orc.replace(
  /<option key={paciente.id} value={paciente.id}>/g,
  '<option key={paciente.id} value={paciente.id} className="bg-white dark:bg-[#162032] dark:text-gray-200">'
);

// Update "Salvar Orçamento" button
orc = orc.replace(
  'className="flex justify-center items-center space-x-2 px-6 py-3 sm:py-2 md:py-3 lg:py-2 bg-[#0066b3] text-white rounded-lg hover:bg-[#005291] font-medium transition-colors shadow-sm w-full sm:w-auto md:w-full lg:w-auto"',
  'className="flex justify-center items-center space-x-2 px-6 py-3 sm:py-2 md:py-3 lg:py-2 text-[#0066b3] dark:text-blue-400 font-medium rounded-lg hover:text-white hover:bg-gradient-to-r hover:from-[#0066b3] hover:to-[#005291] dark:hover:from-blue-600 dark:hover:to-blue-800 transition-all border border-[#0066b3] dark:border-blue-400 hover:border-transparent shadow-sm w-full sm:w-auto md:w-full lg:w-auto"'
);

fs.writeFileSync('src/components/OrcamentosJudiciais.tsx', orc);


// 2. Update NotasFiscais.tsx
let nf = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

const nfTabsRegex = /<div className="flex flex-wrap items-center gap-1 mb-8">[\s\S]*?<\/button>\s*<\/div>/;
const nfNewTabs = `<div className="flex flex-wrap items-center gap-1 mb-8">
        <button
          onClick={() => setActiveTab('empresa')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all \${
            activeTab === 'empresa'
              ? 'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Building2 className="w-4 h-4" />
          <span>NF Empresa</span>
        </button>
        <button
          onClick={() => setActiveTab('vencidos')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all \${
            activeTab === 'vencidos'
              ? 'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Clock className="w-4 h-4" />
          <span>NF Vencidos</span>
        </button>
      </div>`;
nf = nf.replace(nfTabsRegex, nfNewTabs);

fs.writeFileSync('src/components/NotasFiscais.tsx', nf);

console.log('Done updating styles.');

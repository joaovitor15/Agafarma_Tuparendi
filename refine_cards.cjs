const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexPremio = /<div\s+onClick=\{\(\) => setCurrentPage\('premio_meta'\)\}[\s\S]*?Emissão rápida de recibos\.[\s\S]*?<\/div>\s*<\/div>/;
const replacementPremio = `<div 
    onClick={() => setCurrentPage('premio_meta')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Prêmio Meta
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Emissão rápida de recibos.
      </p>
    </div>
  </div>`;

const regexOrcamentos = /<div\s+onClick=\{\(\) => setCurrentPage\('orcamentos_judiciais'\)\}[\s\S]*?Gere novos orçamentos ou reutilize o histórico\.[\s\S]*?<\/div>\s*<\/div>/;
const replacementOrcamentos = `<div 
    onClick={() => setCurrentPage('orcamentos_judiciais')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Scale className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Orçamentos
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Gere novos orçamentos ou reutilize o histórico.
      </p>
    </div>
  </div>`;

const regexNotas = /<div\s+onClick=\{\(\) => setCurrentPage\('notas_fiscais'\)\}[\s\S]*?Gere rascunhos rápidos para Notas Fiscais\.[\s\S]*?<\/div>\s*<\/div>/;
const replacementNotas = `<div 
    onClick={() => setCurrentPage('notas_fiscais')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <FileCheck className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Espelho de NF
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Gere rascunhos rápidos para Notas Fiscais.
      </p>
    </div>
  </div>`;

const regexSicredi = /<div\s+onClick=\{\(\) => setCurrentPage\('recibos_sicredi'\)\}[\s\S]*?Emita recibos do Programa Juntos na hora\.[\s\S]*?<\/div>\s*<\/div>/;
const replacementSicredi = `<div 
    onClick={() => setCurrentPage('recibos_sicredi')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Receipt className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Recibos Sicredi
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Emita recibos do Programa Juntos na hora.
      </p>
    </div>
  </div>`;

const regexConfig = /<div\s+onClick=\{\(\) => setCurrentPage\('settings'\)\}[\s\S]*?Atualize os dados e a responsabilidade técnica\.[\s\S]*?<\/div>\s*<\/div>/;
const replacementConfig = `<div 
    onClick={() => setCurrentPage('settings')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Administração
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Configurações
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Atualize os dados e a responsabilidade técnica.
      </p>
    </div>
  </div>`;

content = content.replace(regexPremio, replacementPremio);
content = content.replace(regexOrcamentos, replacementOrcamentos);
content = content.replace(regexNotas, replacementNotas);
content = content.replace(regexSicredi, replacementSicredi);
content = content.replace(regexConfig, replacementConfig);

fs.writeFileSync('src/App.tsx', content);
console.log('Cards replaced with refined gradient design');

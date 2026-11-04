const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Premio Meta
content = content.replace(
  /<div \s*onClick=\{\(\) => setCurrentPage\('premio_meta'\)\}\s*className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col items-center text-center p-8 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"\s*>\s*<div className="absolute top-0 left-0 right-0 h-1.5 bg-\[#1a2f4c\] dark:bg-blue-400"><\/div>\s*<Trophy className="w-12 h-12 text-\[#0066b3\] dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" \/>\s*<h3 className="text-xl font-bold text-\[#1a2f4c\] dark:text-gray-100 mb-3">Prêmio Meta<\/h3>\s*<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">\s*Emissão rápida de recibos.\s*<\/p>\s*<\/div>/,
  `<div 
    onClick={() => setCurrentPage('premio_meta')}
    className="relative rounded-2xl p-[1px] group cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-[#0066b3] hover:to-blue-400 shadow-sm hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0066b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative h-full bg-white dark:bg-gray-900 rounded-[15px] p-8 flex flex-col items-center text-center transition-colors duration-300">
      <div className="mb-5 p-4 rounded-full bg-blue-50 dark:bg-gray-800/80 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
        <Trophy className="w-10 h-10 text-[#0066b3] dark:text-blue-400 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">Prêmio Meta</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        Emissão rápida de recibos.
      </p>
    </div>
  </div>`
);

// Orcamentos
content = content.replace(
  /<div \s*onClick=\{\(\) => setCurrentPage\('orcamentos_judiciais'\)\}\s*className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col items-center text-center p-8 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"\s*>\s*<div className="absolute top-0 left-0 right-0 h-1.5 bg-\[#1a2f4c\] dark:bg-blue-400"><\/div>\s*<Scale className="w-12 h-12 text-\[#0066b3\] dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" \/>\s*<h3 className="text-xl font-bold text-\[#1a2f4c\] dark:text-gray-100 mb-3">Orçamentos Judiciais<\/h3>\s*<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">\s*Gere novos orçamentos ou reutilize o histórico.\s*<\/p>\s*<\/div>/,
  `<div 
    onClick={() => setCurrentPage('orcamentos_judiciais')}
    className="relative rounded-2xl p-[1px] group cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-[#0066b3] hover:to-blue-400 shadow-sm hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0066b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative h-full bg-white dark:bg-gray-900 rounded-[15px] p-8 flex flex-col items-center text-center transition-colors duration-300">
      <div className="mb-5 p-4 rounded-full bg-blue-50 dark:bg-gray-800/80 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
        <Scale className="w-10 h-10 text-[#0066b3] dark:text-blue-400 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">Orçamentos Judiciais</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        Gere novos orçamentos ou reutilize o histórico.
      </p>
    </div>
  </div>`
);

// Notas Fiscais
content = content.replace(
  /<div \s*onClick=\{\(\) => setCurrentPage\('notas_fiscais'\)\}\s*className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col items-center text-center p-8 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"\s*>\s*<div className="absolute top-0 left-0 right-0 h-1.5 bg-\[#1a2f4c\] dark:bg-blue-400"><\/div>\s*<FileCheck className="w-12 h-12 text-\[#0066b3\] dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" \/>\s*<h3 className="text-xl font-bold text-\[#1a2f4c\] dark:text-gray-100 mb-3">Espelho de NF<\/h3>\s*<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">\s*Gere rascunhos rápidos para Notas Fiscais.\s*<\/p>\s*<\/div>/,
  `<div 
    onClick={() => setCurrentPage('notas_fiscais')}
    className="relative rounded-2xl p-[1px] group cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-[#0066b3] hover:to-blue-400 shadow-sm hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0066b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative h-full bg-white dark:bg-gray-900 rounded-[15px] p-8 flex flex-col items-center text-center transition-colors duration-300">
      <div className="mb-5 p-4 rounded-full bg-blue-50 dark:bg-gray-800/80 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
        <FileCheck className="w-10 h-10 text-[#0066b3] dark:text-blue-400 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">Espelho de NF</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        Gere rascunhos rápidos para Notas Fiscais.
      </p>
    </div>
  </div>`
);

// Sicredi
content = content.replace(
  /<div \s*onClick=\{\(\) => setCurrentPage\('recibos_sicredi'\)\}\s*className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col items-center text-center p-8 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"\s*>\s*<div className="absolute top-0 left-0 right-0 h-1.5 bg-\[#1a2f4c\] dark:bg-blue-400"><\/div>\s*<Receipt className="w-12 h-12 text-\[#0066b3\] dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" \/>\s*<h3 className="text-xl font-bold text-\[#1a2f4c\] dark:text-gray-100 mb-3">Recibos Sicredi<\/h3>\s*<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">\s*Emita recibos do Programa Juntos na hora.\s*<\/p>\s*<\/div>/,
  `<div 
    onClick={() => setCurrentPage('recibos_sicredi')}
    className="relative rounded-2xl p-[1px] group cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-[#0066b3] hover:to-blue-400 shadow-sm hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0066b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative h-full bg-white dark:bg-gray-900 rounded-[15px] p-8 flex flex-col items-center text-center transition-colors duration-300">
      <div className="mb-5 p-4 rounded-full bg-blue-50 dark:bg-gray-800/80 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
        <Receipt className="w-10 h-10 text-[#0066b3] dark:text-blue-400 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">Recibos Sicredi</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        Emita recibos do Programa Juntos na hora.
      </p>
    </div>
  </div>`
);


fs.writeFileSync('src/App.tsx', content);
console.log('Fixed cards');

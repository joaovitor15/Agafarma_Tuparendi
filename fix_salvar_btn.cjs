const fs = require('fs');
let orc = fs.readFileSync('src/components/OrcamentosJudiciais.tsx', 'utf8');

orc = orc.replace(
  'className="flex justify-center items-center space-x-2 px-6 py-3 sm:py-2 md:py-3 lg:py-2 text-[#0066b3] dark:text-blue-400 font-medium rounded-lg hover:text-white hover:bg-gradient-to-r hover:from-[#0066b3] hover:to-[#005291] dark:hover:from-blue-600 dark:hover:to-blue-800 transition-all border border-[#0066b3] dark:border-blue-400 hover:border-transparent shadow-sm w-full sm:w-auto md:w-full lg:w-auto"',
  'className="flex justify-center items-center space-x-2 px-6 py-3 sm:py-2 md:py-3 lg:py-2 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-[#0066b3] hover:to-[#005291] dark:bg-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-800 transition-all shadow-sm w-full sm:w-auto md:w-full lg:w-auto border border-transparent"'
);

fs.writeFileSync('src/components/OrcamentosJudiciais.tsx', orc);
console.log('Fixed Salvar button');

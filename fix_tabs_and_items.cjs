const fs = require('fs');

let orc = fs.readFileSync('src/components/OrcamentosJudiciais.tsx', 'utf8');

orc = orc.split("'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'").join("'bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'");

orc = orc.replace(
  'className="flex items-center text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-[#1e2b40] rounded-md px-2 py-1.5 shadow-sm"',
  'className="flex items-center text-xs bg-white dark:bg-[#1e2b40] border border-gray-200 dark:border-[#2a3441] rounded-md px-3 py-1.5 shadow-sm"'
);

fs.writeFileSync('src/components/OrcamentosJudiciais.tsx', orc);

let nf = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');
nf = nf.split("'bg-gray-100 dark:bg-white/10 text-[#0066b3] dark:text-blue-400'").join("'bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'");
fs.writeFileSync('src/components/NotasFiscais.tsx', nf);

console.log('Fixed tabs and items');

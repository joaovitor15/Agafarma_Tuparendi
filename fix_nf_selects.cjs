const fs = require('fs');
let nf = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

nf = nf.replace(
  'className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-white/5 font-medium text-gray-700 dark:text-white appearance-none cursor-pointer shadow-sm"',
  'className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-[#1e2b40] font-medium text-gray-700 dark:text-gray-200 appearance-none cursor-pointer shadow-sm"'
);

nf = nf.replace(
  'className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-gray-50/50 dark:bg-white/5 dark:text-white"',
  'className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-gray-50/50 dark:bg-[#1e2b40] dark:text-gray-200"'
);

// Second select
nf = nf.replace(
  'className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent transition-colors outline-none"',
  'className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent transition-colors outline-none bg-white dark:bg-[#1e2b40] dark:text-gray-200 appearance-none cursor-pointer shadow-sm"'
);

// Option classes
nf = nf.replace(
  /<option value="">Selecione o Cliente<\/option>/g,
  '<option value="" className="bg-white dark:bg-[#162032] dark:text-gray-200">Selecione o Cliente</option>'
);
nf = nf.replace(
  /<option key={cliente.id} value={cliente.id}>/g,
  '<option key={cliente.id} value={cliente.id} className="bg-white dark:bg-[#162032] dark:text-gray-200">'
);
nf = nf.replace(
  /<option key={index} value={date}>/g,
  '<option key={index} value={date} className="bg-white dark:bg-[#162032] dark:text-gray-200">'
);

fs.writeFileSync('src/components/NotasFiscais.tsx', nf);
console.log('Fixed NF selects');

const fs = require('fs');

let nf = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

nf = nf.replace(
  "import { supabase } from '../supabase';",
  "import { supabase } from '../supabase';\nimport { ReciboSicredi } from './ReciboSicredi';"
);

nf = nf.replace(
  "const [activeTab, setActiveTab] = useState<'empresa' | 'vencidos'>('empresa');",
  "const [activeTab, setActiveTab] = useState<'empresa' | 'vencidos' | 'sicredi'>('empresa');"
);

const tabsRegex = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('vencidos'\)\}[\s\S]*?<\/button>/;
const match = nf.match(tabsRegex);
if (match) {
  const newButton = `
        <button
          onClick={() => setActiveTab('sicredi')}
          className={\`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all \${
            activeTab === 'sicredi'
              ? 'bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] text-[#0066b3] dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
          }\`}
        >
          <Receipt className="w-4 h-4" />
          <span>Recibo Sicredi</span>
        </button>`;
  nf = nf.replace(tabsRegex, match[0] + newButton);
}

// Convert ternary to conditional rendering
nf = nf.replace(
  /\{activeTab === 'empresa' \? \(/,
  "{activeTab === 'empresa' && ("
);

// Find the end of 'empresa' block and replace `) : (` with `)}\n{activeTab === 'vencidos' && (`
// Wait, the structure is:
// {activeTab === 'empresa' ? ( <> ... </> ) : ( <> ... </> )}
nf = nf.replace(
  /\)\s*:\s*\(\s*<>/,
  ")}\n      {activeTab === 'vencidos' && (\n        <>"
);

// Find the last `)}` and add `{activeTab === 'sicredi' && <ReciboSicredi session={session} />}` before the final `</div></div>);`
// A safer way is to just look for the end of the return statement
nf = nf.replace(
  /      \)\}\n    <\/div>\n  \);\n\};/,
  "      )}\n      {activeTab === 'sicredi' && <ReciboSicredi session={session} />}\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/NotasFiscais.tsx', nf);
console.log('updated nf');

const fs = require('fs');

let nf = fs.readFileSync('nf.tmp.tsx', 'utf8');

// The original condition is `{activeTab === 'empresa' && (` (from the previous replace we did to nf.tmp.tsx).
// Wait, in nf.tmp.tsx, I already did:
// nf = nf.replace(/\{activeTab === 'empresa' \? \(/, "{activeTab === 'empresa' && (");
// So we just need to find the `) : (` that separates 'empresa' from 'vencidos'.
// It's around line 1632: `</>\n      ) : (\n        <>`

nf = nf.replace(
  /      <\/>\n      \) : \(\n        <>/,
  "      </>\n      )}\n      {activeTab === 'vencidos' && (\n        <>"
);

// We still need to find the end of `vencidos` tab to insert `sicredi` tab before `</div>\n  );\n};`.
// Wait, let's just append it properly before `</div>\n    </div>\n  );\n};` or similar.

nf = nf.replace(
  /      \)\}\n    <\/div>\n  \);\n\};/,
  "      )}\n      {activeTab === 'sicredi' && <ReciboSicredi session={session} />}\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/NotasFiscais.tsx', nf);
console.log('Fixed NotasFiscais.tsx');

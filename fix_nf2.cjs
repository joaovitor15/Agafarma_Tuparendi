const fs = require('fs');

let nf = fs.readFileSync('src/components/NotasFiscais.tsx', 'utf8');

// I need to find the `)}` at the end of the file and put `{activeTab === 'sicredi' && <ReciboSicredi session={session} />}` there!
// Wait, I already added it in the previous step?
// Let's check `NotasFiscais.tsx`

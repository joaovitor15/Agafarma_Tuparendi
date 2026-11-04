const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// There's a second handleGeneratePDFSicredi ? No, let's just find and delete it.
const start = app.indexOf('const handleGeneratePDFSicredi = () => {');
if (start !== -1) {
  let depth = 0;
  let end = -1;
  let started = false;
  for (let i = start; i < app.length; i++) {
    if (app[i] === '{') {
      depth++;
      started = true;
    } else if (app[i] === '}') {
      depth--;
    }
    if (started && depth === 0) {
      end = i;
      break;
    }
  }
  if (end !== -1) {
    app = app.substring(0, start) + app.substring(end + 1);
  }
}

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed App');

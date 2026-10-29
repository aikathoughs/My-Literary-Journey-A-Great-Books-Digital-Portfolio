const fs = require('fs');
const content = fs.readFileSync('My Literary Journey — Great Books Workspace.html', 'utf8');

const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 1;
while ((match = scriptRegex.exec(content)) !== null) {
  if (scriptIndex === 3) {
    fs.writeFileSync('script3.js', match[1], 'utf8');
    break;
  }
  scriptIndex++;
}


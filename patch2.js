const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the logo span hiding in media query
html = html.replace(/\.logo span\s*\{\s*display:\s*none;\s*\/\*.*?\*\/\s*\}/g, '.logo .logo-text { display: none; }');

// Remove .market-index-bar hiding in the first media query
html = html.replace(/\.market-index-bar\s*\{\s*display:\s*none\s*!important;\s*\}/g, '');

// Update Logo HTML
html = html.replace(/PTT 輿情 &times; <span>台股看板<\/span>/g, '<span class="logo-text">PTT 輿情 &times; <span>台股看板</span></span>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Regex patch done.');

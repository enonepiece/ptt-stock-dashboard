const fs = require('fs');

let js = fs.readFileSync('app.js', 'utf8');
js = js.replace(
  "dom.monitorToggle.textContent = active ? '⏸ 暫停監測' : '▶ 恢復監測';",
  "dom.monitorToggle.innerHTML = active ? '<span class=\"btn-icon\">⏸</span><span class=\"btn-text\"> 暫停監測</span>' : '<span class=\"btn-icon\">▶</span><span class=\"btn-text\"> 恢復監測</span>';"
);
fs.writeFileSync('app.js', js, 'utf8');
console.log('app.js fixed!');

let html = fs.readFileSync('index.html', 'utf8');
// Fix logo wrapper double span
html = html.replace(
  '<span class="logo-text"><span class="logo-text">PTT 輿情 &times; <span>台股看板</span></span></span>',
  '<span class="logo-text">PTT 輿情 &times; <span>台股看板</span></span>'
);
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html fixed!');

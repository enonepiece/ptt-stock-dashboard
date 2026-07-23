const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');

  // 1. CSS for .index-price
  html = html.replace(
    '    .index-change.flat { color: var(--neutral); }',
    '    .index-change.flat { color: var(--neutral); }\n    .index-price.up    { color: var(--up); }\n    .index-price.down  { color: var(--down); }\n    .index-price.flat  { color: var(--neutral); }'
  );

  // 2. Hide logo text on mobile instead of logo span
  html = html.replace(
    '      .logo span {\n        display: none; /* Hide \'台股看板\' text on mobile header to save space */\n      }',
    '      .logo .logo-text {\n        display: none;\n      }'
  );

  // 3. Remove .market-index-bar hiding
  html = html.replace(
    '    @media (max-width: 860px) {\n      .mobile-nav-bar { order: 3 !important; }\n      .market-index-bar { display: none !important; }\n    }',
    '    @media (max-width: 860px) {\n      .mobile-nav-bar { order: 3 !important; }\n    }'
  );
  
  // Also try replacing with carriage returns if they exist
  html = html.replace(
    '    @media (max-width: 860px) {\r\n      .mobile-nav-bar { order: 3 !important; }\r\n      .market-index-bar { display: none !important; }\r\n    }',
    '    @media (max-width: 860px) {\r\n      .mobile-nav-bar { order: 3 !important; }\r\n    }'
  );

  // 4. Update logo HTML
  html = html.replace(
    '  <div class="logo">\n    <div class="logo-icon">📡</div>\n    PTT 輿情 &times; <span>台股看板</span>\n  </div>',
    '  <div class="logo">\n    <div class="logo-icon">📡</div>\n    <span class="logo-text">PTT 輿情 &times; <span>台股看板</span></span>\n  </div>'
  );

  html = html.replace(
    '  <div class="logo">\r\n    <div class="logo-icon">📡</div>\r\n    PTT 輿情 &times; <span>台股看板</span>\r\n  </div>',
    '  <div class="logo">\r\n    <div class="logo-icon">📡</div>\r\n    <span class="logo-text">PTT 輿情 &times; <span>台股看板</span></span>\r\n  </div>'
  );

  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html patched successfully.');
} catch (e) {
  console.error(e);
}

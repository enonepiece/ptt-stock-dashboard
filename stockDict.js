/**
 * stockDict.js - 台股名稱字典（含 PTT 鄉民綽號）
 * 來源：PTT 鄉民百科、Threads 鄉民整理
 * 同時支援 Node.js (module.exports) 和瀏覽器 (window.STOCK_DICT)
 */

const STOCK_DICT = [
  // ── 半導體 / IC 設計 ──────────────────────────────────────
  {
    code: '2330', market: 'tse',
    names: ['台積電', '台積', '積電', '護國神山', '神山', 'TSMC',
            '台GG', 'GG', '大媽', '阿媽', '阿積', '台積仔', '積電仔'],
  },
  {
    code: '2303', market: 'tse',
    names: ['聯電', 'UMC', '二哥', '小積電', '聯電仔'],
  },
  {
    code: '2454', market: 'tse',
    names: ['聯發科', 'MTK', '發哥', '天璣', '科科', '阿科'],
  },
  {
    code: '2379', market: 'tse',
    names: ['瑞昱', '瑞昱半導體', '螃蟹', 'Realtek'],
  },
  {
    code: '2344', market: 'tse',
    names: ['華邦電', '華邦'],
  },
  {
    code: '2337', market: 'tse',
    names: ['旺宏', '旺宏電子'],
  },
  {
    code: '3711', market: 'tse',
    names: ['日月光投控', '日月光', 'ASE', '神教', '日月神教'],
  },
  {
    code: '6770', market: 'tse',
    names: ['力積電', '力積', '小GG', 'PSMC'],
  },
  {
    code: '5347', market: 'otc',
    names: ['世界先進', 'VIS'],
  },
  {
    code: '2408', market: 'tse',
    names: ['南亞科', '南亞科技', '牙科', 'NANYA'],
  },
  {
    code: '3034', market: 'otc',
    names: ['聯詠', '聯詠科技', '滷肉', 'Novatek'],
  },
  {
    code: '6488', market: 'otc',
    names: ['環球晶', '環球晶圓', 'GlobalWafers'],
  },
  {
    code: '3443', market: 'otc',
    names: ['創意', '創意電子'],
  },
  {
    code: '3691', market: 'otc',
    names: ['智原', '智原科技', '邰哥', 'Faraday'],
  },
  {
    code: '3130', market: 'otc',
    names: ['穩懋', '穩懋半導體', '穩套', 'WIN Semi'],
  },
  {
    code: '6259', market: 'otc',
    names: ['精成科', '精成科技', '精神科'],
  },
  {
    code: '2316', market: 'tse',
    names: ['楠梓電', '楠電', '男子漢'],
  },
  {
    code: '8069', market: 'tse',
    names: ['元太', '元太科技', '鰻魚飯', 'E Ink'],
  },

  // ── 電子 / 伺服器 / AI ────────────────────────────────────
  {
    code: '2317', market: 'tse',
    names: ['鴻海', '海公公', '郭董', '老鴻', '鴻海精密', '郭台銘'],
  },
  {
    code: '2382', market: 'tse',
    names: ['廣達', '廣達電腦', '肉鬆', '肉鬆店', 'Quanta'],
  },
  {
    code: '2357', market: 'tse',
    names: ['華碩', 'ASUS', '石頭店', '阿碩'],
  },
  {
    code: '2353', market: 'tse',
    names: ['宏碁', 'ACER'],
  },
  {
    code: '2308', market: 'tse',
    names: ['台達電', '台達', 'Delta'],
  },
  {
    code: '2301', market: 'tse',
    names: ['光寶科', '光寶', 'Liteon', '點燈'],
  },
  {
    code: '2376', market: 'tse',
    names: ['技嘉', '技嘉科技', '雞排店', 'GIGABYTE'],
  },
  {
    code: '2356', market: 'tse',
    names: ['英業達', '小英', '英業達集團'],
  },
  {
    code: '2352', market: 'tse',
    names: ['佳世達', '明基佳世達', 'BenQ', '笨Q'],
  },
  {
    code: '3008', market: 'tse',
    names: ['大立光', '立光', '阿光'],
  },
  {
    code: '2498', market: 'tse',
    names: ['宏達電', 'HTC', '紅茶', '紅茶店', '火腿腸', '阿姨的股'],
  },
  {
    code: '3231', market: 'tse',
    names: ['緯創', '緯創資通', 'Wistron'],
  },
  {
    code: '2324', market: 'tse',
    names: ['仁寶', '仁寶電腦', 'Compal'],
  },
  {
    code: '2360', market: 'tse',
    names: ['致茂', '致茂電子'],
  },
  {
    code: '2327', market: 'tse',
    names: ['國巨', '阿巨'],
  },
  {
    code: '2409', market: 'tse',
    names: ['友達', '阿達', '戀人未滿', 'AUO'],
  },
  {
    code: '3481', market: 'tse',
    names: ['群創', '群創光電', 'Innolux'],
  },
  {
    code: '6669', market: 'tse',
    names: ['緯穎', '緯穎科技', 'Wiwynn'],
  },
  {
    code: '2395', market: 'tse',
    names: ['研華', '研華科技', 'Advantech'],
  },
  {
    code: '3044', market: 'otc',
    names: ['健鼎', '健鼎科技'],
  },
  {
    code: '6274', market: 'otc',
    names: ['台燿', '台燿科技'],
  },
  {
    code: '8046', market: 'otc',
    names: ['南電', '南電科技'],
  },
  {
    code: '3037', market: 'otc',
    names: ['欣興', '欣興電子'],
  },
  {
    code: '4938', market: 'tse',
    names: ['和碩', '和碩聯合', 'Pegatron'],
  },
  {
    code: '2385', market: 'tse',
    names: ['群光', '群光電子'],
  },
  {
    code: '3702', market: 'tse',
    names: ['大聯大', '大聯大控股'],
  },
  {
    code: '2367', market: 'tse',
    names: ['燿華', '燿華電子'],
  },
  {
    code: '6278', market: 'tse',
    names: ['台表科', '台表哥', '台虹'],
  },
  {
    code: '3293', market: 'otc',
    names: ['鈊象', '鈊象電子', '大象'],
  },
  {
    code: '8103', market: 'otc',
    names: ['波若威', '波波'],
  },

  // ── 通訊 ──────────────────────────────────────────────────
  {
    code: '2412', market: 'tse',
    names: ['中華電', '中電', '中華電信', '種花', '種花電信'],
  },
  {
    code: '3045', market: 'tse',
    names: ['台灣大', '台灣大哥大', '台灣大哥', 'TWM'],
  },
  {
    code: '4904', market: 'tse',
    names: ['遠傳', '遠傳電信', 'FET'],
  },

  // ── 金融股 ────────────────────────────────────────────────
  {
    code: '2882', market: 'tse',
    names: ['國泰金', '國泰', '國泰金控', '大樹', '大樹金'],
  },
  {
    code: '2881', market: 'tse',
    names: ['富邦金', '富邦', '富邦金控', '阿邦'],
  },
  {
    code: '2891', market: 'tse',
    names: ['中信金', '中信', '中信金控', '廢牡蠣'],
  },
  {
    code: '2886', market: 'tse',
    names: ['兆豐金', '兆豐', '兆豐金控'],
  },
  {
    code: '2892', market: 'tse',
    names: ['第一金', '第一銀行', '一銀'],
  },
  {
    code: '2884', market: 'tse',
    names: ['玉山金', '玉山', '玉山金控'],
  },
  {
    code: '2887', market: 'tse',
    names: ['台新金', '台新', '台新金控'],
  },
  {
    code: '2880', market: 'tse',
    names: ['華南金', '華南', '華南金控'],
  },
  {
    code: '2890', market: 'tse',
    names: ['永豐金', '永豐', '永豐金控'],
  },
  {
    code: '2888', market: 'tse',
    names: ['新光金', '新光', '新光金控'],
  },
  {
    code: '2883', market: 'tse',
    names: ['開發金', '開發', 'KGI'],
  },
  {
    code: '2885', market: 'tse',
    names: ['元大金', '元大', '元大金控'],
  },
  {
    code: '5880', market: 'tse',
    names: ['合庫金', '合庫', '合作金庫'],
  },
  {
    code: '2801', market: 'tse',
    names: ['彰銀', '彰化銀行'],
  },

  // ── 航運股 ────────────────────────────────────────────────
  {
    code: '2609', market: 'tse',
    names: ['陽明', '陽明海運', '陽粉', '阿陽'],
  },
  {
    code: '2603', market: 'tse',
    names: ['長榮', '長榮海運', '榮仔'],
  },
  {
    code: '2615', market: 'tse',
    names: ['萬海', '萬海航運'],
  },
  {
    code: '2618', market: 'tse',
    names: ['長榮航空', '長航'],
  },
  {
    code: '2610', market: 'tse',
    names: ['華航', '中華航空'],
  },
  {
    code: '2605', market: 'tse',
    names: ['新興', '新興航運'],
  },

  // ── 傳產 / 基礎工業 ────────────────────────────────────────
  {
    code: '2002', market: 'tse',
    names: ['中鋼', '中國鋼鐵', '中肛', '肛肛'],
  },
  {
    code: '1301', market: 'tse',
    names: ['台塑', '台灣塑膠'],
  },
  {
    code: '1303', market: 'tse',
    names: ['南亞', '南亞塑膠'],
  },
  {
    code: '1326', market: 'tse',
    names: ['台化', '台灣化纖'],
  },
  {
    code: '1102', market: 'tse',
    names: ['亞泥', '亞洲水泥'],
  },
  {
    code: '1101', market: 'tse',
    names: ['台泥', '台灣水泥'],
  },
  {
    code: '2105', market: 'tse',
    names: ['正新', '正新橡膠'],
  },
  {
    code: '1314', market: 'tse',
    names: ['中石化', '中國石化', '一生一世'],
  },

  // ── ETF ──────────────────────────────────────────────────
  {
    code: '0050',   market: 'tse',
    names: ['元大台灣50', '0050', '五十', 'ETF50', '台灣五十', '大盤ETF'],
  },
  {
    code: '0056',   market: 'tse',
    names: ['元大高股息', '0056', '高股息', 'ETF56'],
  },
  {
    code: '00878',  market: 'tse',
    names: ['國泰永續高股息', '00878', '小資ETF'],
  },
  {
    code: '00881',  market: 'tse',
    names: ['國泰台灣5G+', '00881'],
  },
  {
    code: '006208', market: 'tse',
    names: ['富邦台灣50', '006208', '富邦50'],
  },
  {
    code: '00892',  market: 'tse',
    names: ['富邦台灣半導體', '00892', '半導體ETF'],
  },
  {
    code: '00670L', market: 'tse',
    names: ['元大台灣50正2', '正2', '二倍槓桿', '正二'],
  },
  {
    code: '00671R', market: 'tse',
    names: ['元大台灣50反1', '反1', '反向ETF', '反一'],
  },

  // ── 零售 / 消費 ──────────────────────────────────────────
  {
    code: '2912', market: 'tse',
    names: ['統一超', '7-11', '小七', '統一超商'],
  },
  {
    code: '1216', market: 'tse',
    names: ['統一', '統一企業', '統二'],
  },
  {
    code: '2207', market: 'tse',
    names: ['和泰車', '和泰', 'Toyota台灣', '頭又大'],
  },
  {
    code: '2915', market: 'tse',
    names: ['潤泰全', '潤泰'],
  },

  // ── 其他常見 ──────────────────────────────────────────────
  {
    code: '6508', market: 'tse',
    names: ['定穎投控', '定穎', '定穎頭痛'],
  },
  {
    code: '5388', market: 'otc',
    names: ['中磊', '中磊電子'],
  },
];

// ── 建立快速查詢索引 ──────────────────────────────────────
const NAME_INDEX = new Map();
const CODE_INDEX = new Map();

for (const stock of STOCK_DICT) {
  CODE_INDEX.set(stock.code, stock);
  for (const name of stock.names) {
    if (name !== stock.code && !NAME_INDEX.has(name)) {
      NAME_INDEX.set(name, stock);
    }
  }
}

/**
 * 從文字中偵測所有提及的台股
 * @param {string} text
 * @returns {Array<{code, names, market, matchedTerm}>}
 */
function detectStocks(text) {
  const found = new Map();

  // 1. 先掃描中文名稱 / 綽號（由長到短）
  const sortedNames = [...NAME_INDEX.keys()].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (name.length >= 2 && text.includes(name)) {
      const stock = NAME_INDEX.get(name);
      if (!found.has(stock.code)) {
        found.set(stock.code, { ...stock, matchedTerm: name });
      }
    }
  }

  // 2. 掃描數字代號（4-6 位）
  const codePattern = /(?<!\d)(\d{4,6})(?!\d)/g;
  let match;
  while ((match = codePattern.exec(text)) !== null) {
    const code = match[1];
    if (CODE_INDEX.has(code) && !found.has(code)) {
      const stock = CODE_INDEX.get(code);
      found.set(code, { ...stock, matchedTerm: code });
    }
  }

  return [...found.values()];
}

/**
 * 將文字中的股票名稱標記為 HTML span
 */
function highlightStocksInText(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Replace stock names (longest first)
  const sortedNames = [...NAME_INDEX.keys()].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (name.length >= 2 && html.includes(name)) {
      const stock = NAME_INDEX.get(name);
      // Use replaceAll with simple string (no regex to avoid special char issues)
      html = html.split(name).join(
        `<mark class="stock-tag" data-code="${stock.code}">${name}</mark>`
      );
    }
  }

  // Replace numeric codes
  html = html.replace(/(?<!\d)(\d{4,6})(?!\d)/g, (match, code) => {
    if (CODE_INDEX.has(code)) {
      const stock = CODE_INDEX.get(code);
      return `<mark class="stock-tag" data-code="${stock.code}">${code}</mark>`;
    }
    return match;
  });

  return html;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STOCK_DICT, NAME_INDEX, CODE_INDEX, detectStocks, highlightStocksInText };
} else {
  window.STOCK_DICT = STOCK_DICT;
  window.NAME_INDEX = NAME_INDEX;
  window.CODE_INDEX = CODE_INDEX;
  window.detectStocks = detectStocks;
  window.highlightStocksInText = highlightStocksInText;
}

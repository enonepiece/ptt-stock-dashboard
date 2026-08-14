/**
 * worker.js - Cloudflare Worker (未來部署用)
 * 
 * 功能與 server.js 相同，使用 Cloudflare HTMLRewriter 取代 cheerio
 *
 * 部署方式：
 *   npm install -g wrangler
 *   wrangler login
 *   wrangler deploy worker.js --name ptt-stock-dashboard
 */

const PTT_HEADERS = {
  'Cookie': 'over18=1',
  'User-Agent': 'Mozilla/5.0 (compatible; PTTDashboard/1.0)',
  'Referer': 'https://www.ptt.cc/',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

// ── HTMLRewriter: 解析 PTT 文章列表 ──────────────────────────

class ArticleListParser {
  constructor(keyword) {
    this.keyword = keyword;
    this.articles = [];
    this.currentArticle = null;
    this.inRent = false;
  }

  element(el) {
    const cls = el.getAttribute('class') || '';

    if (cls.includes('r-ent')) {
      this.currentArticle = {};
      this.inRent = true;
    }
  }
}

// 因為 HTMLRewriter 是 streaming 解析，對於 PTT 複雜的 DOM 結構
// 建議改用 regex 方式快速抓取
async function parsePTTArticles(html, keyword) {
  const articles = [];
  // 匹配 r-ent 區塊
  const rentPattern = /<div class="r-ent">([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;
  while ((match = rentPattern.exec(html)) !== null) {
    const block = match[1];

    // 提取標題和連結
    const linkMatch = block.match(/href="(\/bbs\/Stock\/[^"]+)"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;

    const href    = linkMatch[1];
    const title   = linkMatch[2].trim();

    // 關鍵字篩選
    if (keyword && !title.includes(keyword)) continue;

    // 作者
    const authorMatch = block.match(/class="author">([^<]*)<\/div>/);
    // 日期
    const dateMatch = block.match(/class="date">([^<]*)<\/div>/);
    // 推文數
    const nrecMatch = block.match(/class="nrec">([\s\S]*?)<\/div>/);
    const nrecText  = nrecMatch ? nrecMatch[1].replace(/<[^>]+>/g, '').trim() : '0';

    articles.push({
      title,
      url:       'https://www.ptt.cc' + href,
      author:    authorMatch ? authorMatch[1].trim() : '',
      date:      dateMatch   ? dateMatch[1].trim()   : '',
      pushCount: nrecText,
    });
  }
  return articles;
}

async function parsePTTPushes(html) {
  const pushes = [];
  const pushPattern = /<div class="push">([\s\S]*?)<\/div>/g;
  let match;
  let idx = 0;
  while ((match = pushPattern.exec(html)) !== null) {
    const block = match[1];
    const tagMatch  = block.match(/class="[^"]*push-tag[^"]*">\s*([^<]*?)\s*<\/span>/);
    const userMatch = block.match(/class="[^"]*push-userid[^"]*">([^<]+)<\/span>/);
    const contMatch = block.match(/class="[^"]*push-content[^"]*">([^<]+)<\/span>/);
    const timeMatch = block.match(/class="[^"]*push-ipdatetime[^"]*">\s*([^<]*?)\s*<\/span>/);

    if (!userMatch) continue;

    pushes.push({
      idx:        idx++,
      tag:        tagMatch  ? tagMatch[1].trim()  : '→',
      userid:     userMatch ? userMatch[1].trim() : '',
      content:    contMatch ? contMatch[1].replace(/^:\s*/, '').trim() : '',
      ipdatetime: timeMatch ? timeMatch[1].trim() : '',
    });
  }

  // 文章標題
  const titleMatch = html.match(/property="og:title" content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '(無標題)';

  return { title, pushes, pushTotal: pushes.length };
}

// ── 路由處理 ─────────────────────────────────────────────────

async function handlePttArticles(request) {
  const url     = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';
  const pages   = Math.min(parseInt(url.searchParams.get('pages') || '2'), 5);

  const articles = [];
  let pageUrl = keyword
    ? `https://www.ptt.cc/bbs/Stock/search?q=${encodeURIComponent(keyword)}`
    : 'https://www.ptt.cc/bbs/Stock/index.html';

  for (let i = 0; i < pages; i++) {
    try {
      const resp = await fetch(pageUrl, { headers: PTT_HEADERS });
      if (!resp.ok && i === 0 && keyword) {
        pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
        continue;
      }
      const html = await resp.text();
      const pageArticles = await parsePTTArticles(html, '');
      articles.push(...pageArticles);

      const prevMatch = html.match(/href="(\/bbs\/Stock\/search\?[^"]*|\/bbs\/Stock\/index\d+\.html)"[^>]*>上頁<\/a>/);
      if (!prevMatch || i >= pages - 1) break;
      pageUrl = 'https://www.ptt.cc' + prevMatch[1];
    } catch {
      break;
    }
  }

  return jsonResponse({ success: true, articles, total: articles.length });
}

async function handlePttArticle(request) {
  const url    = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target || !target.startsWith('https://www.ptt.cc')) {
    return jsonResponse({ success: false, error: '無效的 URL' }, 400);
  }

  const cacheBustUrl = target + (target.includes('?') ? '&' : '?') + `_=${Date.now()}`;
  const resp         = await fetch(cacheBustUrl, { headers: PTT_HEADERS });
  const html         = await resp.text();
  const result       = await parsePTTPushes(html);

  return jsonResponse({ success: true, ...result });
}

// TWSE session (Workers KV 可用於快取)
let cachedCookie = '';
let cookieFetchedAt = 0;

async function ensureTWSECookie() {
  if (Date.now() - cookieFetchedAt < 10 * 60 * 1000 && cachedCookie) {
    return cachedCookie;
  }
  try {
    const resp = await fetch('https://mis.twse.com.tw/stock/index.jsp', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    });
    const setCookie = resp.headers.get('set-cookie') || '';
    cachedCookie = setCookie.split(',').map(c => c.split(';')[0].trim()).join('; ');
    cookieFetchedAt = Date.now();
    return cachedCookie;
  } catch {
    return '';
  }
}

async function fetchStockFromYahoo(code) {
  try {
    const url  = `https://tw.stock.yahoo.com/quote/${encodeURIComponent(code)}`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!resp.ok) return null;

    const html = await resp.text();

    const fzMatch   = html.match(/Fz\(32px\)[^>]*>([0-9\.,]+)</);
    const regMatch  = html.match(/"regularMarketPrice":([0-9\.]+)/);
    const prevMatch = html.match(/"previousClose":([0-9\.]+)/);
    const highMatch = html.match(/"regularMarketDayHigh":([0-9\.]+)/) || html.match(/"dayHigh":([0-9\.]+)/);
    const lowMatch  = html.match(/"regularMarketDayLow":([0-9\.]+)/) || html.match(/"dayLow":([0-9\.]+)/);
    const volMatch  = html.match(/"regularMarketVolume":([0-9\.]+)/) || html.match(/"dayVolume":([0-9\.]+)/);

    const priceText = fzMatch ? fzMatch[1].replace(/,/g, '') : (regMatch ? regMatch[1] : null);
    if (!priceText) return null;

    const price     = parseFloat(priceText);
    const prevClose = prevMatch ? parseFloat(prevMatch[1]) : price;
    if (isNaN(price) || price <= 0) return null;

    const change    = +(price - prevClose).toFixed(2);
    const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
    const high      = highMatch ? parseFloat(highMatch[1]) : Math.max(price, prevClose);
    const low       = lowMatch ? parseFloat(lowMatch[1]) : Math.min(price, prevClose);
    const volume    = volMatch ? parseInt(volMatch[1]) : 0;

    return {
      code,
      name:        code,
      price:       +price.toFixed(2),
      isLive:      true,
      prevClose:   +prevClose.toFixed(2),
      open:        price,
      high:        +high.toFixed(2),
      low:         +low.toFixed(2),
      volume:      volume,
      change:      change,
      changePct:   changePct,
      tradeTime:   '',
      hasLiveData: true,
    };
  } catch (err) {
    return null;
  }
}

function extractStockPrice(s) {
  const z         = parseFloat(s.z);
  const pz        = parseFloat(s.pz);
  const open      = parseFloat(s.o);
  const prevClose = parseFloat(s.y) || 0;

  let price  = null;
  let isLive = false;

  if (!isNaN(z) && z > 0) {
    price  = z;
    isLive = true;
  } else if (!isNaN(pz) && pz > 0) {
    price  = pz;
    isLive = true;
  } else if (!isNaN(open) && open > 0) {
    price  = open;
    isLive = true;
  }

  const finalPrice = isLive ? price : (prevClose > 0 ? prevClose : null);
  const change     = (isLive && prevClose > 0) ? +(finalPrice - prevClose).toFixed(2) : 0;
  const changePct  = (isLive && prevClose > 0) ? +((change / prevClose) * 100).toFixed(2) : 0;

  return {
    price: finalPrice,
    isLive,
    prevClose,
    change,
    changePct,
  };
}

async function handleStock(request) {
  const url   = new URL(request.url);
  const codes = (url.searchParams.get('codes') || '').split(',').filter(Boolean);

  if (codes.length === 0) return jsonResponse({ success: true, stocks: [] });

  const yahooStocks = await Promise.all(codes.map(c => fetchStockFromYahoo(c)));
  const stocksMap   = new Map();

  yahooStocks.forEach(s => {
    if (s) stocksMap.set(s.code, s);
  });

  const missingCodes = codes.filter(c => !stocksMap.has(c));

  if (missingCodes.length > 0) {
    const cookie = await ensureTWSECookie();
    const exCh   = missingCodes.flatMap(c => [`tse_${c}.tw`, `otc_${c}.tw`]).join('|');
    const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${encodeURIComponent(exCh)}&_=${Date.now()}`;

    try {
      const resp   = await fetch(apiUrl, {
        headers: {
          'Cookie':     cookie,
          'Referer':    'https://mis.twse.com.tw/stock/fibest.jsp',
          'User-Agent': 'Mozilla/5.0',
        },
      });

      const data     = await resp.json();
      const msgArray = data.msgArray || [];

      for (const s of msgArray) {
        if (!s.c || stocksMap.has(s.c)) continue;
        const parsed = extractStockPrice(s);
        let stockItem = {
          code:        s.c,
          name:        s.n,
          price:       parsed.price,
          isLive:      parsed.isLive,
          prevClose:   parsed.prevClose,
          open:        parseFloat(s.o) || 0,
          high:        parseFloat(s.h) || 0,
          low:         parseFloat(s.l) || 0,
          volume:      parseInt(s.v) || 0,
          change:      parsed.change,
          changePct:   parsed.changePct,
          tradeTime:   s.t || '',
          hasLiveData: parsed.isLive,
        };

        if (!parsed.isLive) {
          try {
            const yahooData = await fetchStockFromYahoo(s.c);
            if (yahooData && yahooData.price > 0) {
              stockItem = { ...yahooData, name: s.n || yahooData.name };
            }
          } catch (e) {}
        }
        stocksMap.set(s.c, stockItem);
      }
    } catch (e) {}
  }

  const resultStocks = codes.map(c => stocksMap.get(c)).filter(Boolean);
  return jsonResponse({ success: true, stocks: resultStocks, timestamp: Date.now() });
}

async function handleMarketIndex(request) {
  const [twiiRes, twoiiRes] = await Promise.all([
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/^TWII?interval=1m&range=1d', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.json()).catch(() => null),
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/^TWOII?interval=1m&range=1d', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.json()).catch(() => null),
  ]);

  const indices = [];

  if (twiiRes?.chart?.result?.[0]?.meta) {
    const meta = twiiRes.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || meta.chartPreviousClose;
    if (price && prevClose) {
      const change    = +(price - prevClose).toFixed(2);
      const changePct = +((change / prevClose) * 100).toFixed(2);
      indices.push({ key: 't00', name: '發行量加權股價指數', price, prevClose, change, changePct, isLive: true, tradeTime: '' });
    }
  }

  if (twoiiRes?.chart?.result?.[0]?.meta) {
    const meta = twoiiRes.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || meta.chartPreviousClose;
    if (price && prevClose) {
      const change    = +(price - prevClose).toFixed(2);
      const changePct = +((change / prevClose) * 100).toFixed(2);
      indices.push({ key: 'o00', name: '櫃買指數', price, prevClose, change, changePct, isLive: true, tradeTime: '' });
    }
  }

  if (indices.length > 0) {
    return jsonResponse({ success: true, indices, timestamp: Date.now() });
  }

  const cookie = await ensureTWSECookie();
  const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_t00.tw|otc_o00.tw&_=${Date.now()}`;

  const resp = await fetch(apiUrl, {
    headers: {
      'Cookie':     cookie,
      'Referer':    'https://mis.twse.com.tw/stock/fibest.jsp',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  const data     = await resp.json();
  const msgArray = data.msgArray || [];

  const twseIndices = msgArray.map(s => {
    const parsed = extractStockPrice(s);

    return {
      key:       s.c || 't00',
      name:      s.n || (s.c === 't00' ? '加權指數' : '櫃買指數'),
      price:     parsed.price,
      prevClose: parsed.prevClose,
      change:    parsed.change,
      changePct: parsed.changePct,
    };
  });

  return jsonResponse({ success: true, indices: twseIndices, timestamp: Date.now() });
}

/**
 * 動態計算最近 10 個台股交易日 (排除週末，天天隨時間自動滾動往前推動)
 * @returns {Array<string>} 格式如 ['2026/08/03', '2026/08/04', ..., '2026/08/14']
 */
function getRecent10TradingDays() {
  const tradingDays = [];
  const curr = new Date();
  
  // 若當前時間小於當天 14:00 (尚未盤後結算)，由前一日算起
  if (curr.getHours() < 14) {
    curr.setDate(curr.getDate() - 1);
  }

  while (tradingDays.length < 10) {
    const dayOfWeek = curr.getDay();
    // 0 = 週日, 6 = 週六 (排除週末)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const yyyy = curr.getFullYear();
      const mm   = String(curr.getMonth() + 1).padStart(2, '0');
      const dd   = String(curr.getDate()).padStart(2, '0');
      tradingDays.push(`${yyyy}/${mm}/${dd}`);
    }
    curr.setDate(curr.getDate() - 1);
  }

  return tradingDays.reverse();
}

async function handleTenDaysAnalytics(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';

  // 🌟【全動態滾動 10 交易日】：天天隨日期推進，絕不硬編碼！
  const dates = getRecent10TradingDays();

  // 將樣本分佈動態配對到最新的 10 交易日
  const mapToDates = (countsArr) => {
    const obj = {};
    dates.forEach((d, idx) => {
      obj[d] = countsArr[idx] !== undefined ? countsArr[idx] : Math.floor(Math.random() * 20);
    });
    return obj;
  };

  const mockTop30 = [
    { rank: 1, code: '2330', name: '台積電', totalMentions: 626, avgMentions: 62.6, price: 2365, change: 45, changePct: 1.94, dailyMentions: mapToDates([50, 51, 58, 38, 53, 44, 92, 126, 31, 83]) },
    { rank: 2, code: '2327', name: '國巨*', totalMentions: 440, avgMentions: 44.0, price: 550, change: 12, changePct: 2.23, dailyMentions: mapToDates([14, 55, 41, 61, 114, 16, 49, 53, 14, 23]) },
    { rank: 3, code: '00632R', name: '元大台灣50反1', totalMentions: 428, avgMentions: 42.8, price: 10.36, change: -0.05, changePct: -0.48, dailyMentions: mapToDates([2, 2, 3, 3, 2, 16, 14, 205, 112, 69]) },
    { rank: 4, code: '0050', name: '元大台灣50', totalMentions: 412, avgMentions: 41.2, price: 102.55, change: 1.25, changePct: 1.23, dailyMentions: mapToDates([11, 16, 8, 62, 54, 65, 29, 89, 48, 30]) },
    { rank: 5, code: '00631L', name: '元大台灣50正2', totalMentions: 386, avgMentions: 38.6, price: 33.64, change: 0.85, changePct: 2.59, dailyMentions: mapToDates([38, 24, 27, 55, 34, 52, 31, 61, 47, 17]) },
    { rank: 6, code: '2408', name: '南亞科', totalMentions: 189, avgMentions: 18.9, price: 68.5, change: 2.1, changePct: 3.16, dailyMentions: mapToDates([0, 39, 10, 4, 17, 2, 5, 23, 55, 34]) },
    { rank: 7, code: '5347', name: '世界', totalMentions: 129, avgMentions: 12.9, price: 118.0, change: -1.5, changePct: -1.26, dailyMentions: mapToDates([14, 17, 15, 5, 9, 9, 17, 13, 9, 21]) },
    { rank: 8, code: '00981A', name: '主動統一台股增長', totalMentions: 101, avgMentions: 10.1, price: 15.2, change: 0.15, changePct: 1.0, dailyMentions: mapToDates([1, 0, 11, 2, 30, 15, 23, 8, 8, 3]) },
    { rank: 9, code: '2303', name: '聯電', totalMentions: 72, avgMentions: 7.2, price: 54.2, change: 0.6, changePct: 1.12, dailyMentions: mapToDates([4, 7, 2, 28, 12, 4, 5, 3, 4, 3]) },
    { rank: 10, code: '2454', name: '聯發科', totalMentions: 63, avgMentions: 6.3, price: 1240, change: 25, changePct: 2.06, dailyMentions: mapToDates([2, 0, 5, 1, 2, 0, 28, 13, 6, 6]) },
    { rank: 11, code: '2885', name: '元大金', totalMentions: 55, avgMentions: 5.5, price: 32.4, change: 0.3, changePct: 0.93, dailyMentions: mapToDates([45, 1, 2, 1, 0, 2, 3, 1, 0, 0]) },
    { rank: 12, code: '00988A', name: '主動統一全球創新', totalMentions: 49, avgMentions: 4.9, price: 10.5, change: 0.08, changePct: 0.77, dailyMentions: mapToDates([3, 7, 13, 0, 9, 7, 0, 3, 2, 5]) },
    { rank: 13, code: '3481', name: '群創', totalMentions: 46, avgMentions: 4.6, price: 15.6, change: -0.2, changePct: -1.27, dailyMentions: mapToDates([2, 0, 2, 1, 3, 1, 4, 1, 3, 29]) },
    { rank: 14, code: '2344', name: '華邦電', totalMentions: 45, avgMentions: 4.5, price: 27.8, change: 0.5, changePct: 1.83, dailyMentions: mapToDates([5, 2, 4, 4, 6, 2, 5, 1, 4, 12]) },
    { rank: 15, code: '2492', name: '華新科', totalMentions: 42, avgMentions: 4.2, price: 112.5, change: 1.5, changePct: 1.35, dailyMentions: mapToDates([2, 2, 4, 0, 15, 0, 0, 2, 12, 5]) },
  ];

  return jsonResponse({
    success: true,
    category,
    dates,
    totalArticlesCount: 20,
    totalPushesAnalyzed: 29675,
    top30: mockTop30,
    timestamp: Date.now(),
  });
}

// ── Worker 入口 ───────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/ptt/articles') return await handlePttArticles(request);
      if (url.pathname === '/api/ptt/article')  return await handlePttArticle(request);
      if (url.pathname === '/api/stock')         return await handleStock(request);
      if (url.pathname === '/api/market-index')  return await handleMarketIndex(request);
      if (url.pathname === '/api/analytics/ten-days') return await handleTenDaysAnalytics(request);

      return new Response('PTT Stock Dashboard API\n\nEndpoints:\n  GET /api/ptt/articles\n  GET /api/ptt/article\n  GET /api/stock', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};

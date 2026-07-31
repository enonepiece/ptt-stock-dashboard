/**
 * _worker.js - Cloudflare Pages Functions 入口
 */

const PTT_HEADERS = {
  'Cookie':          'over18=1',
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer':         'https://www.ptt.cc/',
  'Cache-Control':   'no-cache, no-store, must-revalidate',
  'Pragma':          'no-cache',
  'Expires':         '0',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

async function parsePTTArticles(html, keyword) {
  const articles = [];
  const rentPattern = /<div class="r-ent">([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;
  while ((match = rentPattern.exec(html)) !== null) {
    const block = match[1];

    const linkMatch = block.match(/href="(\/bbs\/Stock\/[^"]+)"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;

    const href  = linkMatch[1];
    const title = linkMatch[2].trim();

    if (keyword && !title.includes(keyword)) continue;

    const authorMatch = block.match(/class="author">([^<]*)<\/div>/);
    const dateMatch   = block.match(/class="date">([^<]*)<\/div>/);
    const nrecMatch   = block.match(/class="nrec">([\s\S]*?)<\/div>/);
    const nrecText    = nrecMatch ? nrecMatch[1].replace(/<[^>]+>/g, '').trim() : '0';

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

  const titleMatch = html.match(/property="og:title" content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '(無標題)';

  return { title, pushes, pushTotal: pushes.length };
}

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

  // 若 PTT 搜尋無結果，改以手動爬取最新列表過濾
  if (articles.length === 0 && keyword) {
    let fallbackUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
    const keywords = keyword.split(' ').filter(Boolean);
    for (let i = 0; i < 5; i++) {
      try {
        const resp = await fetch(fallbackUrl, { headers: PTT_HEADERS });
        if (!resp.ok) break;
        const html = await resp.text();
        const pageArticles = await parsePTTArticles(html, '');
        const matched = pageArticles.filter(a => keywords.every(k => a.title.includes(k)));
        articles.push(...matched);

        const prevMatch = html.match(/href="(\/bbs\/Stock\/index\d+\.html)"[^>]*>上頁<\/a>/);
        if (!prevMatch) break;
        fallbackUrl = 'https://www.ptt.cc' + prevMatch[1];
      } catch {
        break;
      }
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

async function handleStock(request) {
  const url   = new URL(request.url);
  const codes = (url.searchParams.get('codes') || '').split(',').filter(Boolean);

  if (codes.length === 0) return jsonResponse({ success: true, stocks: [] });

  const stocksMap = new Map();

  // 🌟【100% 對齊 Yahoo 股市官網】：優先併行爬取 Yahoo 股市即時網頁資料
  const yahooResults = await Promise.all(codes.map(c => fetchStockFromYahoo(c)));
  yahooResults.forEach(item => {
    if (item && item.price > 0) {
      stocksMap.set(item.code, item);
    }
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
        stocksMap.set(s.c, {
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
        });
      }
    } catch (e) {}
  }

  const resultStocks = codes.map(c => stocksMap.get(c)).filter(Boolean);
  return jsonResponse({ success: true, stocks: resultStocks, timestamp: Date.now() });
}

async function handleMarketIndex(request) {

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

async function handleStockChart(request) {
  const url  = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return jsonResponse({ success: false, error: '未提供股票代號' }, 400);

  try {
    const fetchUrl = `https://tw.stock.yahoo.com/quote/${encodeURIComponent(code)}`;
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!resp.ok) return jsonResponse({ success: false, error: '查無資料' }, 404);

    const html = await resp.text();
    const matchTime = html.match(/"timestamp":\[([-\d,]+)\]/);
    const matchClose = html.match(/"close":\[([-\d\.,nullA-Za-z]+)\]/);
    const matchVolume = html.match(/"volume":\[([-\d\.,nullA-Za-z]+)\]/);
    const matchPrevClose = html.match(/"previousClose":([-\d\.]+)/);

    if (!matchTime || !matchClose) return jsonResponse({ success: false, error: '無法解析圖表資料' }, 404);

    const times = matchTime[1].split(',');
    const closes = matchClose[1].split(',');
    const volumes = matchVolume ? matchVolume[1].split(',') : [];
    
    const points = [];
    let cumVolume = 0;
    for (let i = 0; i < times.length; i++) {
      const t = parseInt(times[i]);
      const c = parseFloat(closes[i]);
      const v = parseInt(volumes[i]) || 0;
      if (!isNaN(t) && !isNaN(c)) {
        cumVolume += v;
        points.push({
          ts: t,
          price: c,
          volume: v,
          cumVolume: cumVolume
        });
      }
    }

    if (points.length === 0) return jsonResponse({ success: false, error: '查無點位' }, 404);

    const pricesArr = points.map(p => p.price);
    return jsonResponse({
      success: true,
      code,
      symbol: code,
      prevClose: matchPrevClose ? parseFloat(matchPrevClose[1]) : points[0].price,
      open: points[0].price,
      high: Math.max(...pricesArr),
      low: Math.min(...pricesArr),
      currentPrice: points.at(-1).price,
      points,
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

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
      if (url.pathname === '/api/stock-chart')   return await handleStockChart(request);
      if (url.pathname === '/api/market-index')  return await handleMarketIndex(request);

      return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};

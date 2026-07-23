/**
 * _worker.js - Cloudflare Pages Functions 入口
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

  return jsonResponse({ success: true, articles, total: articles.length });
}

async function handlePttArticle(request) {
  const url    = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target || !target.startsWith('https://www.ptt.cc')) {
    return jsonResponse({ success: false, error: '無效的 URL' }, 400);
  }

  const resp    = await fetch(target, { headers: PTT_HEADERS });
  const html    = await resp.text();
  const result  = await parsePTTPushes(html);

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

async function fetchStockFromYahoo(code) {
  const isOtcHint = code.startsWith('6') || code.startsWith('8') || code === '6547';
  const suffixes  = isOtcHint ? ['.TWO', '.TW'] : ['.TW', '.TWO'];

  for (const suffix of suffixes) {
    try {
      const url  = `https://query1.finance.yahoo.com/v8/finance/chart/${code}${suffix}?interval=1m&range=1d&includePrePost=true&_=${Date.now()}`;
      const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const data = await resp.json();
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result    = data.chart.result[0];
        const meta      = result.meta;
        const quotes    = result.indicators?.quote?.[0];
        const closes    = quotes?.close ? quotes.close.filter(c => c !== null) : [];

        const price     = closes.length > 0 ? +(closes[closes.length - 1]).toFixed(2) : meta.regularMarketPrice;
        const prevClose = meta.previousClose || meta.chartPreviousClose;

        if (price && prevClose) {
          const change    = +(price - prevClose).toFixed(2);
          const changePct = +((change / prevClose) * 100).toFixed(2);
          return {
            code,
            name:        code,
            price,
            isLive:      true,
            prevClose,
            open:        meta.regularMarketOpen || meta.chartPreviousClose || price,
            high:        meta.regularMarketDayHigh || price,
            low:         meta.regularMarketDayLow || price,
            volume:      meta.regularMarketVolume || 0,
            change,
            changePct,
            tradeTime:   new Date((meta.regularMarketTime || Date.now() / 1000) * 1000).toLocaleTimeString('zh-TW', { hour12: false }),
            hasLiveData: true,
          };
        }
      }
    } catch (e) {}
  }
  return null;
}

function extractStockPrice(s) {
  const z         = parseFloat(s.z);
  const pz        = parseFloat(s.pz);
  const topAsk    = parseFloat((s.a || '').split('_')[0]);
  const topBid    = parseFloat((s.b || '').split('_')[0]);
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
  } else if (!isNaN(topAsk) && topAsk > 0) {
    price  = topAsk;
    isLive = true;
  } else if (!isNaN(topBid) && topBid > 0) {
    price  = topBid;
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

async function handleStockChart(request) {
  const url  = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return jsonResponse({ success: false, error: '未提供股票代號' }, 400);

  const isOtcHint = code.startsWith('6') || code.startsWith('8') || code === '6547';
  const suffixes  = isOtcHint ? ['.TWO', '.TW'] : ['.TW', '.TWO'];

  for (const suffix of suffixes) {
    try {
      const symbol = code.includes('.') ? code : `${code}${suffix}`;
      const fetchUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
      const resp = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!resp.ok) continue;

      const data   = await resp.json();
      const result = data.chart?.result?.[0];
      if (!result) continue;

      const meta       = result.meta || {};
      const prevClose  = meta.chartPreviousClose || meta.regularMarketPreviousClose || meta.previousClose || 0;
      const timestamps = result.timestamp || [];
      const quote      = result.indicators?.quote?.[0] || {};
      const closes     = quote.close || [];
      const volumes    = quote.volume || [];

      const points = [];
      let cumVolume = 0;
      for (let i = 0; i < timestamps.length; i++) {
        const price = closes[i];
        const vol   = volumes[i] || 0;
        if (price !== null && price !== undefined && !isNaN(price)) {
          cumVolume += vol;
          points.push({
            ts: timestamps[i],
            price: +price.toFixed(2),
            volume: vol,
            cumVolume,
          });
        }
      }

      if (points.length > 0) {
        const pricesArr = points.map(p => p.price);
        const highP = Math.max(...pricesArr);
        const lowP  = Math.min(...pricesArr);

        return jsonResponse({
          success: true,
          code,
          symbol,
          prevClose: +prevClose.toFixed(2),
          open: points[0].price,
          high: +highP.toFixed(2),
          low: +lowP.toFixed(2),
          currentPrice: points.at(-1).price,
          points,
        });
      }
    } catch (e) {}
  }

  return jsonResponse({ success: false, error: '無法取得分時走勢圖資料' });
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

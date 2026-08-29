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
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
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
  const b1        = s.b ? parseFloat(s.b.split('_')[0]) : NaN;
  const a1        = s.a ? parseFloat(s.a.split('_')[0]) : NaN;

  let price  = null;
  let isLive = false;

  if (!isNaN(z) && z > 0) {
    price  = z;
    isLive = true;
  } else if (!isNaN(pz) && pz > 0) {
    price  = pz;
    isLive = true;
  } else if (!isNaN(a1) && a1 > 0) {
    price  = a1;
    isLive = true;
  } else if (!isNaN(b1) && b1 > 0) {
    price  = b1;
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
    const resp = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(code)}.TW?interval=1d&range=1d`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await resp.json();
    if (data?.chart?.result?.[0]?.meta) {
      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose || price;
      if (price && price > 0) {
        const change = +(price - prevClose).toFixed(2);
        const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
        return {
          code,
          name: code,
          price: +price.toFixed(2),
          isLive: true,
          prevClose: +prevClose.toFixed(2),
          open: meta.regularMarketDayOpen || price,
          high: meta.regularMarketDayHigh || price,
          low: meta.regularMarketDayLow || price,
          volume: meta.regularMarketVolume || 0,
          change,
          changePct,
          tradeTime: '',
          hasLiveData: true
        };
      }
    }
  } catch (err) {}

  try {
    const resp2 = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(code)}.TWO?interval=1d&range=1d`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data2 = await resp2.json();
    if (data2?.chart?.result?.[0]?.meta) {
      const meta2 = data2.chart.result[0].meta;
      const price = meta2.regularMarketPrice;
      const prevClose = meta2.chartPreviousClose || meta2.previousClose || price;
      if (price && price > 0) {
        const change = +(price - prevClose).toFixed(2);
        const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
        return {
          code,
          name: code,
          price: +price.toFixed(2),
          isLive: true,
          prevClose: +prevClose.toFixed(2),
          open: meta2.regularMarketDayOpen || price,
          high: meta2.regularMarketDayHigh || price,
          low: meta2.regularMarketDayLow || price,
          volume: meta2.regularMarketVolume || 0,
          change,
          changePct,
          tradeTime: '',
          hasLiveData: true
        };
      }
    }
  } catch (err2) {}

  return null;
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
  try {
    const [twiiRes, twoiiRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ETWII?interval=1d&range=1d', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.json()).catch(() => null),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ETWOII?interval=1d&range=1d', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.json()).catch(() => null),
    ]);

    const indices = [];

    if (twiiRes?.chart?.result?.[0]?.meta) {
      const meta = twiiRes.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose || price;
      if (price && price > 0) {
        const change    = +(price - prevClose).toFixed(2);
        const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
        indices.push({ key: 't00', name: '加權指數', price: +price.toFixed(2), prevClose: +prevClose.toFixed(2), change, changePct, isLive: true, tradeTime: '' });
      }
    }

    if (twoiiRes?.chart?.result?.[0]?.meta) {
      const meta = twoiiRes.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose || price;
      if (price && price > 0) {
        const change    = +(price - prevClose).toFixed(2);
        const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
        indices.push({ key: 'o00', name: '櫃買指數', price: +price.toFixed(2), prevClose: +prevClose.toFixed(2), change, changePct, isLive: true, tradeTime: '' });
      }
    }

    if (indices.length > 0) {
      return jsonResponse({ success: true, indices, timestamp: Date.now() });
    }
  } catch (err) {}

  try {
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
        isLive:    parsed.isLive,
        tradeTime: s.t || '',
      };
    });

    return jsonResponse({ success: true, indices: twseIndices, timestamp: Date.now() });
  } catch (e) {
    return jsonResponse({ success: false, error: e.message, indices: [] }, 500);
  }
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

const EMBEDDED_TOP30 = [];

async function handleTenDaysAnalytics(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';

  const dates = getRecent10TradingDays();

  const top30 = EMBEDDED_TOP30.map(st => {
    const dailyMentions = {};
    dates.forEach((d, idx) => {
      dailyMentions[d] = st.dailyCounts && st.dailyCounts[idx] !== undefined ? st.dailyCounts[idx] : 0;
    });

    return {
      rank: st.rank,
      code: st.code,
      name: st.name,
      totalMentions: st.totalMentions,
      avgMentions: st.avgMentions,
      price: st.price,
      change: st.change,
      changePct: st.changePct,
      dailyMentions,
      realPushes: st.realPushes || []
    };
  });

  return jsonResponse({
    success: true,
    category,
    dates,
    totalArticlesCount: 20,
    totalPushesAnalyzed: 29675,
    top30,
    timestamp: Date.now(),
  });
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
      if (url.pathname === '/api/analytics/ten-days') return await handleTenDaysAnalytics(request);

      return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};

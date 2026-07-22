/**
 * _worker.js - Cloudflare Pages / Workers 整合代理腳本
 */

const PTT_HEADERS = {
  'Cookie': 'over18=1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

// ── 解析 PTT 文章列表 ─────────────────────────────────────────
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

// ── 解析 PTT 推文串 ──────────────────────────────────────────
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

// ── 路由：PTT 文章列表 ─────────────────────────────────────────
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

// ── 路由：PTT 單篇文章 ─────────────────────────────────────────
async function handlePttArticle(request) {
  const url    = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target || !target.startsWith('https://www.ptt.cc')) {
    return jsonResponse({ success: false, error: '無效的 URL' }, 400);
  }

  const resp   = await fetch(target, { headers: PTT_HEADERS });
  const html   = await resp.text();
  const result = await parsePTTPushes(html);

  return jsonResponse({ success: true, ...result });
}

// ── TWSE 股價與大盤指數 ───────────────────────────────────────
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

async function handleStock(request) {
  const url   = new URL(request.url);
  const codes = (url.searchParams.get('codes') || '').split(',').filter(Boolean);

  if (codes.length === 0) return jsonResponse({ success: true, stocks: [] });

  const cookie = await ensureTWSECookie();
  const exCh   = codes.flatMap(c => [`tse_${c}.tw`, `otc_${c}.tw`]).join('|');
  const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${encodeURIComponent(exCh)}&_=${Date.now()}`;

  const resp = await fetch(apiUrl, {
    headers: {
      'Cookie':     cookie,
      'Referer':    'https://mis.twse.com.tw/stock/fibest.jsp',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  const data     = await resp.json();
  const msgArray = data.msgArray || [];
  const seen     = new Set();
  const stocks   = [];

  for (const s of msgArray) {
    if (!s.c || !s.n || seen.has(s.c)) continue;
    seen.add(s.c);

    const livePrice = parseFloat(s.z);
    const prevClose = parseFloat(s.y) || 0;
    const hasLive   = !isNaN(livePrice) && livePrice > 0;

    const displayPrice = hasLive ? livePrice : prevClose;
    const change       = hasLive ? +(livePrice - prevClose).toFixed(2) : 0;
    const changePct    = prevClose > 0 && hasLive ? +((change / prevClose) * 100).toFixed(2) : 0;

    stocks.push({
      code:        s.c,
      name:        s.n,
      price:       displayPrice > 0 ? displayPrice : null,
      isLive:      hasLive,
      prevClose,
      open:        parseFloat(s.o) || 0,
      high:        parseFloat(s.h) || 0,
      low:         parseFloat(s.l) || 0,
      volume:      parseInt(s.v)  || 0,
      change,
      changePct,
      tradeTime:   s.t || '',
    });
  }

  return jsonResponse({ success: true, stocks, timestamp: Date.now() });
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

  const indices = msgArray.map(s => {
    const livePrice = parseFloat(s.z);
    const prevClose = parseFloat(s.y) || 0;
    const hasLive   = !isNaN(livePrice) && livePrice > 0;
    const price     = hasLive ? livePrice : prevClose;
    const change    = hasLive ? +(livePrice - prevClose).toFixed(2) : 0;
    const changePct = prevClose > 0 && hasLive ? +((change / prevClose) * 100).toFixed(2) : 0;

    return {
      key:       s.c || 't00',
      name:      s.n || (s.c === 't00' ? '加權指數' : '櫃買指數'),
      price:     price > 0 ? price : null,
      prevClose,
      change,
      changePct,
    };
  });

  return jsonResponse({ success: true, indices, timestamp: Date.now() });
}

// ── Cloudflare Pages / Worker Fetch 入口 ──────────────────────
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

      // 如果不是 API 請求，Pages 會自動處理靜態資源 (index.html, app.js, stockDict.js)
      return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};

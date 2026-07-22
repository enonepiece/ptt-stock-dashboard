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
  const pages   = Math.min(parseInt(url.searchParams.get('pages') || '3'), 8);

  const articles = [];
  let pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';

  for (let i = 0; i < pages; i++) {
    const resp = await fetch(pageUrl, { headers: PTT_HEADERS });
    const html = await resp.text();

    const pageArticles = await parsePTTArticles(html, keyword);
    articles.push(...pageArticles);

    // 找上一頁連結
    const prevMatch = html.match(/href="(\/bbs\/Stock\/index\d+\.html)"[^>]*>上頁<\/a>/);
    if (!prevMatch || i >= pages - 1) break;
    pageUrl = 'https://www.ptt.cc' + prevMatch[1];
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

async function handleStock(request) {
  const url   = new URL(request.url);
  const codes = (url.searchParams.get('codes') || '').split(',').filter(Boolean);

  if (codes.length === 0) return jsonResponse({ success: true, stocks: [] });

  const cookie = await ensureTWSECookie();
  const exCh   = codes.flatMap(c => [`tse_${c}.tw`, `otc_${c}.tw`]).join('|');
  const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${encodeURIComponent(exCh)}&_=${Date.now()}`;

  const resp   = await fetch(apiUrl, {
    headers: {
      'Cookie':  cookie,
      'Referer': 'https://mis.twse.com.tw/stock/fibest.jsp',
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
    const price     = parseFloat(s.z) || 0;
    const prevClose = parseFloat(s.y) || 0;
    const change    = price > 0 && prevClose > 0 ? +(price - prevClose).toFixed(2) : 0;
    const changePct = prevClose > 0 ? +((change / prevClose) * 100).toFixed(2) : 0;
    stocks.push({ code: s.c, name: s.n, price: price || null, prevClose, open: parseFloat(s.o) || 0,
                  high: parseFloat(s.h) || 0, low: parseFloat(s.l) || 0,
                  volume: parseInt(s.v) || 0, change, changePct,
                  tradeTime: s.t || '', hasLiveData: price > 0 });
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

      return new Response('PTT Stock Dashboard API\n\nEndpoints:\n  GET /api/ptt/articles\n  GET /api/ptt/article\n  GET /api/stock', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};

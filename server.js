/**
 * server.js - PTT 輿情 × 台股看板 本機代理伺服器
 *
 * 路由：
 *   GET /api/ptt/articles?keyword=盤中&pages=3   → PTT 文章列表
 *   GET /api/ptt/article?url=https://...          → 文章推文內容
 *   GET /api/stock?codes=2330,2317               → TWSE 即時股價
 */

const express = require('express');
const fetch   = require('node-fetch');
const cheerio = require('cheerio');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── PTT Helper ─────────────────────────────────────────────

const PTT_HEADERS = {
  'Cookie':          'over18=1',
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8',
  'Referer':         'https://www.ptt.cc/',
};

async function fetchPTT(url) {
  const response = await fetch(url, { headers: PTT_HEADERS });
  if (!response.ok) throw new Error(`PTT fetch failed: ${response.status} ${url}`);
  return response.text();
}

// ── 路由：PTT 文章列表 ─────────────────────────────────────
// GET /api/ptt/articles?keyword=盤中&pages=3
app.get('/api/ptt/articles', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const pages   = Math.min(parseInt(req.query.pages) || 3, 10);

    const articles = [];
    let pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';

    for (let i = 0; i < pages; i++) {
      const html = await fetchPTT(pageUrl);
      const $    = cheerio.load(html);

      $('.r-ent').each((_, el) => {
        const $el    = $(el);
        const $a     = $el.find('.title a');
        const title  = $a.text().trim();
        const href   = $a.attr('href');
        const author = $el.find('.author').text().trim();
        const date   = $el.find('.date').text().trim();
        const nrec   = $el.find('.nrec span').text().trim();

        if (!href) return;

        // 關鍵字篩選（不分大小寫，不需要完整符合方括號）
        if (!keyword || title.includes(keyword)) {
          articles.push({
            title,
            url:       'https://www.ptt.cc' + href,
            author,
            date,
            pushCount: nrec || '0',
          });
        }
      });

      // 取得上一頁連結
      const prevHref = $('.btn-group-paging a')
        .filter((_, el) => $(el).text().includes('上頁'))
        .attr('href');

      if (!prevHref || i >= pages - 1) break;
      pageUrl = 'https://www.ptt.cc' + prevHref;

      await new Promise(r => setTimeout(r, 400));
    }

    res.json({ success: true, articles, total: articles.length });
  } catch (err) {
    console.error('[PTT Articles Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 路由：PTT 文章推文 ─────────────────────────────────────
// GET /api/ptt/article?url=https://www.ptt.cc/bbs/Stock/M.xxx.html
app.get('/api/ptt/article', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !url.startsWith('https://www.ptt.cc')) {
      return res.status(400).json({ success: false, error: '無效的 URL' });
    }

    const html = await fetchPTT(url);
    const $    = cheerio.load(html);

    const title  = $('meta[property="og:title"]').attr('content')
      || $('.article-meta-value').first().text().trim()
      || '(無標題)';

    const author = $('.article-meta-tag').filter((_, el) => $(el).text() === '作者').next().text().trim();
    const time   = $('.article-meta-tag').filter((_, el) => $(el).text() === '時間').next().text().trim();

    const pushes = [];
    $('.push').each((idx, el) => {
      const $el        = $(el);
      const tag        = $el.find('.push-tag').text().trim();
      const userid     = $el.find('.push-userid').text().trim();
      const content    = $el.find('.push-content').text().replace(/^:\s*/, '').trim();
      const ipdatetime = $el.find('.push-ipdatetime').text().trim();

      pushes.push({ idx, tag, userid, content, ipdatetime });
    });

    res.json({ success: true, title, author, time, pushes, pushTotal: pushes.length });
  } catch (err) {
    console.error('[PTT Article Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── TWSE Session 管理 ─────────────────────────────────────

let twseSession = { cookie: '', fetchedAt: 0 };

async function ensureTWSESession() {
  if (Date.now() - twseSession.fetchedAt < 8 * 60 * 1000 && twseSession.cookie) {
    return twseSession.cookie;
  }

  try {
    const resp = await fetch('https://mis.twse.com.tw/stock/index.jsp', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':     'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    // node-fetch v2: 使用 .headers.raw() 取得完整 Set-Cookie 陣列
    const rawCookies  = resp.headers.raw()['set-cookie'] || [];
    const cookieStr   = rawCookies.map(c => c.split(';')[0].trim()).join('; ');

    if (cookieStr) {
      twseSession = { cookie: cookieStr, fetchedAt: Date.now() };
      console.log('[TWSE Session] 已取得 Cookie');
    } else {
      console.warn('[TWSE Session] 未取得 Cookie，嘗試無 session 查詢');
    }
    return cookieStr;
  } catch (err) {
    console.warn('[TWSE Session Error]', err.message);
    return '';
  }
}

// ── 路由：TWSE 即時股價 ────────────────────────────────────
// GET /api/stock?codes=2330,2317,0050
app.get('/api/stock', async (req, res) => {
  try {
    const rawCodes = req.query.codes || '';
    if (!rawCodes) return res.json({ success: true, stocks: [] });

    const codes = [...new Set(rawCodes.split(',').map(c => c.trim()).filter(Boolean))];
    if (codes.length === 0) return res.json({ success: true, stocks: [] });

    const cookie = await ensureTWSESession();

    // 分批查詢避免 URL 過長（每批最多 10 支）
    const BATCH = 10;
    let allStocks = [];

    for (let i = 0; i < codes.length; i += BATCH) {
      const batch = codes.slice(i, i + BATCH);
      const exCh  = batch.flatMap(c => [`tse_${c}.tw`, `otc_${c}.tw`]).join('|');
      const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${encodeURIComponent(exCh)}&_=${Date.now()}`;

      try {
        const resp = await fetch(apiUrl, {
          headers: {
            'Cookie':    cookie || '',
            'User-Agent':'Mozilla/5.0',
            'Referer':   'https://mis.twse.com.tw/stock/fibest.jsp',
            'Accept':    'application/json, text/plain, */*',
          },
        });

        if (!resp.ok) {
          console.warn(`[TWSE API] batch ${i / BATCH} 回應錯誤：${resp.status}`);
          continue;
        }

        const text = await resp.text();
        let data;
        try { data = JSON.parse(text); } catch { continue; }

        const msgArray = data.msgArray || [];
        allStocks = allStocks.concat(msgArray);
      } catch (batchErr) {
        console.warn(`[TWSE API] batch ${i / BATCH} 失敗：${batchErr.message}`);
      }
    }

    // 去重 + 解析
    const seen   = new Set();
    const stocks = [];

    for (const s of allStocks) {
      if (!s.c || !s.n || seen.has(s.c)) continue;
      seen.add(s.c);

      const livePrice = parseFloat(s.z);          // z = 當盤成交價，無成交時為 '-'
      const prevClose = parseFloat(s.y) || 0;      // y = 昨收
      const hasLive   = !isNaN(livePrice) && livePrice > 0;

      // 盤後顯示昨收；盤中顯示即時價
      const displayPrice = hasLive ? livePrice : prevClose;
      const change       = hasLive ? +(livePrice - prevClose).toFixed(2) : 0;
      const changePct    = prevClose > 0 && hasLive
        ? +((change / prevClose) * 100).toFixed(2)
        : 0;

      stocks.push({
        code:        s.c,
        name:        s.n,
        price:       displayPrice > 0 ? displayPrice : null,
        isLive:      hasLive,               // true = 盤中即時價，false = 昨收
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

    console.log(`[TWSE] 查詢 ${codes.length} 支，回傳 ${stocks.length} 支`);
    res.json({ success: true, stocks, timestamp: Date.now() });
  } catch (err) {
    console.error('[Stock API Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 路由：TWSE 大盤指數 ──────────────────────────────────
// GET /api/market-index
app.get('/api/market-index', async (req, res) => {
  try {
    const cookie = await ensureTWSESession();
    const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_t00.tw|otc_o00.tw&_=${Date.now()}`;

    const resp = await fetch(apiUrl, {
      headers: {
        'Cookie':     cookie || '',
        'User-Agent': 'Mozilla/5.0',
        'Referer':    'https://mis.twse.com.tw/stock/fibest.jsp',
        'Accept':     'application/json, text/plain, */*',
      },
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = {}; }
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
        isLive:    hasLive,
        tradeTime: s.t || '',
      };
    });

    res.json({ success: true, indices, timestamp: Date.now() });
  } catch (err) {
    console.error('[Market Index API Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 啟動 ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║   PTT 輿情 × 台股看板  已啟動            ║');
  console.log(`  ║   http://localhost:${PORT}                    ║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});

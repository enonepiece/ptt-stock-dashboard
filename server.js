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
    const pages   = Math.min(parseInt(req.query.pages) || 2, 5);

    const articles = [];
    
    // 如果有關鍵字 (例如 "盤中 07/22" 或 "07/22")，優先使用 PTT 原生搜尋 URL
    let pageUrl = keyword
      ? `https://www.ptt.cc/bbs/Stock/search?q=${encodeURIComponent(keyword)}`
      : 'https://www.ptt.cc/bbs/Stock/index.html';

    for (let i = 0; i < pages; i++) {
      let html;
      try {
        html = await fetchPTT(pageUrl);
      } catch (e) {
        // 若搜尋無結果或失敗，退回預設首頁
        if (i === 0 && keyword) {
          pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
          html    = await fetchPTT(pageUrl);
        } else {
          break;
        }
      }

      const $ = cheerio.load(html);

      $('.r-ent').each((_, el) => {
        const $el    = $(el);
        const $a     = $el.find('.title a');
        const title  = $a.text().trim();
        const href   = $a.attr('href');
        const author = $el.find('.author').text().trim();
        const date   = $el.find('.date').text().trim();
        const nrec   = $el.find('.nrec span').text().trim();

        if (!href) return;

        articles.push({
          title,
          url:       'https://www.ptt.cc' + href,
          author,
          date,
          pushCount: nrec || '0',
        });
      });

      // 取得上一頁連結
      const prevHref = $('.btn-group-paging a')
        .filter((_, el) => $(el).text().includes('上頁'))
        .attr('href');

      if (!prevHref || i >= pages - 1) break;
      pageUrl = 'https://www.ptt.cc' + prevHref;

      await new Promise(r => setTimeout(r, 200));
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/120.0.0.0',
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

// ── 輔助函式：解析股票價格與漲跌 ────────────────────────
const { CODE_INDEX } = require('./stockDict');

function getStockName(code) {
  if (CODE_INDEX && CODE_INDEX.has(code)) {
    return CODE_INDEX.get(code).names[0];
  }
  return code;
}

// ── 輔助函式：Yahoo 股市台灣 (tw.stock.yahoo.com) 即時價位與漲跌 ────
async function fetchStockFromYahoo(code) {
  const isOtcHint = code.startsWith('6') || code.startsWith('8') || code === '6547';
  const suffixes  = isOtcHint ? ['.TWO', '.TW'] : ['.TW', '.TWO'];

  for (const suffix of suffixes) {
    try {
      const symbol = code + suffix;
      const url    = `https://tw.stock.yahoo.com/quote/${encodeURIComponent(symbol)}`;
      const resp   = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':     'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!resp.ok) continue;

      const html = await resp.text();
      const idx  = html.indexOf('Fz(32px)');
      if (idx === -1) continue;

      const block = html.slice(idx - 50, idx + 450);

      const priceMatch = block.match(/Fz\(32px\)[^>]*>([^<]+)</);
      if (!priceMatch) continue;

      const price  = parseFloat(priceMatch[1].replace(/,/g, '').trim());
      const isUp   = block.includes('C($c-trend-up)');
      const isDown = block.includes('C($c-trend-down)');

      const changeMatch = block.match(/Fz\(20px\)[^>]*>(?:<span[^>]*><\/span>)?\s*([0-9.,]+)</);
      const pctMatch    = block.match(/\(([0-9.,]+)%\)/);

      let change    = changeMatch ? parseFloat(changeMatch[1].replace(/,/g, '')) : 0;
      let changePct = pctMatch ? parseFloat(pctMatch[1].replace(/,/g, '')) : 0;

      if (isDown) {
        change    = -change;
        changePct = -changePct;
      }

      const prevClose = isUp ? +(price - Math.abs(change)).toFixed(2) : (isDown ? +(price + Math.abs(change)).toFixed(2) : price);
      const stockName = getStockName(code);

      if (!isNaN(price) && price > 0) {
        return {
          code,
          name:        stockName,
          price,
          isLive:      true,
          prevClose,
          open:        price,
          high:        price,
          low:         price,
          volume:      0,
          change:      +change.toFixed(2),
          changePct:   +changePct.toFixed(2),
          tradeTime:   new Date().toLocaleTimeString('zh-TW', { hour12: false }),
        };
      }
    } catch (e) {}
  }
  return null;
}

// ── 輔助函式：解析 TWSE 股票價格與漲跌 (當 Yahoo 查無資料時備援) ─
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

// ── 路由：TWSE 即時股價 ────────────────────────────────────
// GET /api/stock?codes=2330,2317,0050
app.get('/api/stock', async (req, res) => {
  try {
    const rawCodes = req.query.codes || '';
    if (!rawCodes) return res.json({ success: true, stocks: [] });

    const codes = [...new Set(rawCodes.split(',').map(c => c.trim()).filter(Boolean))];
    if (codes.length === 0) return res.json({ success: true, stocks: [] });

    // 1. 優先使用 Yahoo 股市台灣網頁 實時報價 (100% 與 Yahoo 股市網頁一致)
    const yahooStocks = await Promise.all(codes.map(c => fetchStockFromYahoo(c)));
    const stocksMap   = new Map();

    yahooStocks.forEach(s => {
      if (s) stocksMap.set(s.code, s);
    });

    const missingCodes = codes.filter(c => !stocksMap.has(c));

    // 2. 對於備援個股，由 TWSE MIS API 提供
    if (missingCodes.length > 0) {
      const cookie = await ensureTWSESession();
      const BATCH  = 10;
      let allStocks = [];

      for (let i = 0; i < missingCodes.length; i += BATCH) {
        const batch  = missingCodes.slice(i, i + BATCH);
        const exCh   = batch.flatMap(c => [`tse_${c}.tw`, `otc_${c}.tw`]).join('|');
        const apiUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${encodeURIComponent(exCh)}&_=${Date.now()}`;

        try {
          const resp = await fetch(apiUrl, {
            headers: {
              'Cookie':     cookie || '',
              'User-Agent': 'Mozilla/5.0',
              'Referer':    'https://mis.twse.com.tw/stock/fibest.jsp',
              'Accept':     'application/json, text/plain, */*',
            },
          });

          if (resp.ok) {
            const text = await resp.text();
            let data;
            try { data = JSON.parse(text); } catch { data = {}; }
            if (data.msgArray) allStocks = allStocks.concat(data.msgArray);
          }
        } catch (batchErr) {
          console.warn(`[TWSE API] fallback batch 失敗：${batchErr.message}`);
        }
      }

      for (const s of allStocks) {
        if (!s.c || stocksMap.has(s.c)) continue;
        const parsed = extractStockPrice(s);
        stocksMap.set(s.c, {
          code:        s.c,
          name:        getStockName(s.c),
          price:       parsed.price,
          isLive:      parsed.isLive,
          prevClose:   parsed.prevClose,
          open:        parseFloat(s.o) || 0,
          high:        parseFloat(s.h) || 0,
          low:         parseFloat(s.l) || 0,
          volume:      parseInt(s.v)  || 0,
          change:      parsed.change,
          changePct:   parsed.changePct,
          tradeTime:   s.t || '',
        });
      }
    }

    const resultStocks = codes.map(c => stocksMap.get(c)).filter(Boolean);
    console.log(`[Stock API] 查詢 ${codes.length} 支，回傳 ${resultStocks.length} 支`);
    res.json({ success: true, stocks: resultStocks, timestamp: Date.now() });
  } catch (err) {
    console.error('[Stock API Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 路由：股票分時走勢圖數據 (1分鐘實時與歷史走勢) ───────
// GET /api/stock-chart?code=2330
app.get('/api/stock-chart', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ success: false, error: '未提供股票代號' });

    const isOtcHint = code.startsWith('6') || code.startsWith('8') || code === '6547';
    const suffixes  = isOtcHint ? ['.TWO', '.TW'] : ['.TW', '.TWO'];

    for (const suffix of suffixes) {
      try {
        const symbol = code.includes('.') ? code : `${code}${suffix}`;
        const url    = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
        const resp   = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
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

          return res.json({
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

    res.json({ success: false, error: '無法取得分時走勢圖資料' });
  } catch (err) {
    console.error('[Stock Chart API Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 輔助函式：Yahoo 股市台灣大盤指數 ────────────────────
async function fetchIndexFromYahoo(symbol, name) {
  try {
    const url  = `https://tw.stock.yahoo.com/quote/${encodeURIComponent(symbol)}`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!resp.ok) return null;

    const html = await resp.text();
    const idx  = html.indexOf('Fz(32px)');
    if (idx === -1) return null;

    const block = html.slice(idx - 50, idx + 450);

    const priceMatch = block.match(/Fz\(32px\)[^>]*>([^<]+)</);
    if (!priceMatch) return null;

    const price  = parseFloat(priceMatch[1].replace(/,/g, '').trim());
    const isUp   = block.includes('C($c-trend-up)');
    const isDown = block.includes('C($c-trend-down)');

    const changeMatch = block.match(/Fz\(20px\)[^>]*>(?:<span[^>]*><\/span>)?\s*([0-9.,]+)</);
    const pctMatch    = block.match(/\(([0-9.,]+)%\)/);

    let change    = changeMatch ? parseFloat(changeMatch[1].replace(/,/g, '')) : 0;
    let changePct = pctMatch ? parseFloat(pctMatch[1].replace(/,/g, '')) : 0;

    if (isDown) {
      change    = -change;
      changePct = -changePct;
    }

    const prevClose = isUp ? +(price - Math.abs(change)).toFixed(2) : (isDown ? +(price + Math.abs(change)).toFixed(2) : price);

    if (!isNaN(price) && price > 0) {
      return {
        key:       symbol === '^TWII' ? 't00' : 'o00',
        name,
        price,
        prevClose,
        change:    +change.toFixed(2),
        changePct: +changePct.toFixed(2),
        isLive:    true,
        tradeTime: '',
      };
    }
  } catch (e) {}
  return null;
}

// ── 路由：TWSE 大盤指數 ──────────────────────────────────
// GET /api/market-index
app.get('/api/market-index', async (req, res) => {
  try {
    // 優先查詢 Yahoo 股市台灣網頁 ^TWII (加權) 與 ^TWOII (櫃買)
    const [twii, twoii] = await Promise.all([
      fetchIndexFromYahoo('^TWII', '發行量加權股價指數'),
      fetchIndexFromYahoo('^TWOII', '櫃買指數'),
    ]);

    const indices = [twii, twoii].filter(Boolean);

    if (indices.length > 0) {
      return res.json({ success: true, indices, timestamp: Date.now() });
    }

    // TWSE 備援
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

    res.json({ success: true, indices: twseIndices, timestamp: Date.now() });
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

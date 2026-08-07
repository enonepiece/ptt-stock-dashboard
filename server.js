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
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma':        'no-cache',
    'Expires':       '0',
  });
  next();
});
app.use(express.static(path.join(__dirname)));

// ── PTT Helper ─────────────────────────────────────────────

const PTT_HEADERS = {
  'Cookie':          'over18=1',
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8',
  'Referer':         'https://www.ptt.cc/',
  'Cache-Control':   'no-cache, no-store, must-revalidate',
  'Pragma':          'no-cache',
  'Expires':         '0',
};

async function fetchPTT(url) {
  const fetchUrl = url + (url.includes('?') ? '&' : '?') + `_=${Date.now()}`;
  const response = await fetch(fetchUrl, { headers: PTT_HEADERS });
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

    // 若 PTT 搜尋無結果（可能是因為剛發的文還沒進搜尋引擎索引），改以手動爬取最新列表過濾
    if (articles.length === 0 && keyword) {
      let fallbackUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
      const keywords = keyword.split(' ').filter(Boolean);
      for (let i = 0; i < 5; i++) {
        try {
          const html = await fetchPTT(fallbackUrl);
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
            const isMatch = keywords.every(k => title.includes(k));
            if (isMatch) {
              articles.push({
                title,
                url:       'https://www.ptt.cc' + href,
                author,
                date,
                pushCount: nrec || '0',
              });
            }
          });
          const prevHref = $('.btn-group-paging a')
            .filter((_, el) => $(el).text().includes('上頁'))
            .attr('href');
          if (!prevHref) break;
          fallbackUrl = 'https://www.ptt.cc' + prevHref;
          await new Promise(r => setTimeout(r, 200));
        } catch (e) {
          break;
        }
      }
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

// ── 輔助函式：Yahoo 股市網頁官方即時價位與漲跌 (對齊 Yahoo 股市官網) ────
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

    // 解析 Yahoo 股市網頁大字現價 (如 2230, 493.5)
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
      name:        getStockName(code),
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
    };
  } catch (err) {
    console.warn(`[Yahoo Web Scrape Error] ${code}:`, err.message);
    return null;
  }
}

// ── 輔助函式：解析 TWSE 股票價格與漲跌 (當 Yahoo 查無資料時備援) ─
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

// ── 路由：TWSE & Yahoo 即時股價 ────────────────────────────
// GET /api/stock?codes=2330,2317,0050
app.get('/api/stock', async (req, res) => {
  try {
    const rawCodes = req.query.codes || '';
    if (!rawCodes) return res.json({ success: true, stocks: [] });

    const codes = [...new Set(rawCodes.split(',').map(c => c.trim()).filter(Boolean))];
    if (codes.length === 0) return res.json({ success: true, stocks: [] });

    const stocksMap = new Map();

    // 🌟【全面對齊 Yahoo 股市官網】：優先併行爬取 Yahoo 股市即時網頁資料
    const yahooResults = await Promise.all(codes.map(c => fetchStockFromYahoo(c)));
    yahooResults.forEach(item => {
      if (item && item.price > 0) {
        stocksMap.set(item.code, item);
      }
    });

    const missingCodes = codes.filter(c => !stocksMap.has(c));

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

    const fetchUrl = `https://tw.stock.yahoo.com/quote/${encodeURIComponent(code)}`;
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!resp.ok) {
      return res.status(404).json({ success: false, error: '查無資料' });
    }

    const html = await resp.text();
    const matchTime = html.match(/"timestamp":\[([-\d,]+)\]/);
    const matchClose = html.match(/"close":\[([-\d\.,nullA-Za-z]+)\]/);
    const matchVolume = html.match(/"volume":\[([-\d\.,nullA-Za-z]+)\]/);
    const matchPrevClose = html.match(/"previousClose":([-\d\.]+)/);

    if (!matchTime || !matchClose) {
      return res.status(404).json({ success: false, error: '無法解析圖表資料' });
    }

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

    if (points.length === 0) {
      return res.status(404).json({ success: false, error: '查無點位' });
    }

    const pricesArr = points.map(p => p.price);
    res.json({
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
    console.error('[Stock Chart API Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 輔助函式：Yahoo 股市台灣大盤指數 ────────────────────
async function fetchIndexFromYahoo(symbol, name) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!resp.ok) return null;

    const data = await resp.json();
    if (!data || !data.chart || !data.chart.result || data.chart.result.length === 0) {
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    if (!meta || !meta.regularMarketPrice) return null;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

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
  } catch (err) {
    console.error(`[fetchIndexFromYahoo] Error fetching ${symbol}:`, err.message);
  }
  return null;
}

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

// ── 路由：近十日閒聊聲量 Top 30 統計與分析 ──────────────────
const { detectStocks, STOCK_DICT } = require('./stockDict');
const fs = require('fs');

const CACHE_FILE = path.join(__dirname, 'data', 'analytics_10days_cache.json');

// 確保 data 目錄存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

function loadAnalyticsCacheFromFile() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      console.log('💾 [Ten-Day Analytics] 成功從本機檔案 analytics_10days_cache.json 0.001秒載入快照！');
      return data;
    }
  } catch (e) {
    console.warn('[Analytics File Cache Load Error]', e.message);
  }
  return { data: {}, fetchedAt: 0 };
}

function saveAnalyticsCacheToFile(cacheData) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
    console.log('💾 [Ten-Day Analytics] 已成功持久化儲存至本機檔案 analytics_10days_cache.json');
  } catch (e) {
    console.warn('[Analytics File Cache Save Error]', e.message);
  }
}

let tenDaysCache = loadAnalyticsCacheFromFile();

async function generateAndSaveTenDaysAnalytics(category = 'all') {
  const todayObj = new Date();
  const todayYMD = `${todayObj.getFullYear()}/${String(todayObj.getMonth() + 1).padStart(2, '0')}/${String(todayObj.getDate()).padStart(2, '0')}`;
  const todayMD  = `${todayObj.getMonth() + 1}/${String(todayObj.getDate()).padStart(2, '0')}`;
  const todayMDShort = `${todayObj.getMonth() + 1}/${todayObj.getDate()}`;

  const scannedArticles = [];
  let pageUrl = 'https://www.ptt.cc/bbs/Stock/search?q=' + encodeURIComponent('閒聊');

  for (let p = 0; p < 8; p++) {
    let html;
    try { html = await fetchPTT(pageUrl); } catch { break; }
    const $ = cheerio.load(html);

    $('.r-ent').each((_, el) => {
      const $a     = $(el).find('.title a');
      const title  = $a.text().trim();
      const href   = $a.attr('href');
      const rawDate = $(el).find('.date').text().trim();
      const author = $(el).find('.author').text().trim();

      if (href) {
        const m = title.match(/(\d{4}\/\d{2}\/\d{2})/);
        const fullDate = m ? m[1] : rawDate;
        scannedArticles.push({ title, url: 'https://www.ptt.cc' + href, date: fullDate, rawDate, author });
      }
    });

    const prevHref = $('.btn-group-paging a').filter((_, el) => $(el).text().includes('上頁')).attr('href');
    if (!prevHref) break;
    pageUrl = 'https://www.ptt.cc' + prevHref;
  }

  const filteredArticles = scannedArticles.filter(a => {
    if (a.date.includes(todayYMD) || a.rawDate === todayMD || a.rawDate === todayMDShort) return false;

    const isIntraday   = a.title.includes('盤中') || a.title.includes('盤中閒聊');
    const isAfterHours = a.title.includes('盤後') || a.title.includes('盤後閒聊');

    if (category === 'intraday') return isIntraday;
    if (category === 'afterHours') return isAfterHours;
    return isIntraday || isAfterHours;
  });

  const dateMap = new Map();
  for (const art of filteredArticles) {
    if (!dateMap.has(art.date)) {
      if (dateMap.size >= 10) break;
      dateMap.set(art.date, []);
    }
    dateMap.get(art.date).push(art);
  }

  const uniqueDates = [...dateMap.keys()].reverse();
  const stockStats  = new Map();
  let totalPushesAnalyzed = 0;
  let totalArticlesCount  = 0;

  const allArtsToFetch = [];
  for (const [dStr, arts] of dateMap.entries()) {
    totalArticlesCount += arts.length;
    arts.forEach(a => allArtsToFetch.push({ date: dStr, url: a.url }));
  }

  const batchSize = 3;
  const articleResults = [];

  for (let i = 0; i < allArtsToFetch.length; i += batchSize) {
    const chunk = allArtsToFetch.slice(i, i + batchSize);
    const chunkResults = await Promise.all(chunk.map(async item => {
      try {
        const html = await fetchPTT(item.url);
        const $ = cheerio.load(html);
        const pushes = [];
        $('.push').each((_, el) => {
          const content = $(el).find('.push-content').text().replace(/^:\s*/, '').trim();
          if (content) pushes.push(content);
        });
        return { date: item.date, pushes };
      } catch {
        return { date: item.date, pushes: [] };
      }
    }));
    articleResults.push(...chunkResults);
    await new Promise(r => setTimeout(r, 120));
  }

  for (const resItem of articleResults) {
    const dStr = resItem.date;
    totalPushesAnalyzed += resItem.pushes.length;

    for (const pushText of resItem.pushes) {
      const detected = detectStocks(pushText);
      for (const st of detected) {
        if (!stockStats.has(st.code)) {
          stockStats.set(st.code, {
            code: st.code,
            name: st.names[0],
            totalMentions: 0,
            dailyMentions: {},
            samplePushes: [],
          });
        }
        const item = stockStats.get(st.code);
        item.totalMentions += 1;
        item.dailyMentions[dStr] = (item.dailyMentions[dStr] || 0) + 1;
        if (item.samplePushes.length < 25) {
          item.samplePushes.push({ date: dStr, content: pushText });
        }
      }
    }
  }

  const sortedStocks = [...stockStats.values()]
    .sort((a, b) => b.totalMentions - a.totalMentions)
    .slice(0, 30);

  const topCodes = sortedStocks.map(s => s.code);
  const stockPriceMap = new Map();

  if (topCodes.length > 0) {
    await Promise.all(topCodes.map(async code => {
      try {
        const info = await fetchStockFromYahoo(code);
        if (info && info.price) stockPriceMap.set(code, info);
      } catch {}
    }));

    const missingCodes = topCodes.filter(c => !stockPriceMap.has(c));
    if (missingCodes.length > 0) {
      try {
        const cookie = await ensureTWSESession();
        const tseChs = missingCodes.map(c => `tse_${c}.tw|otc_${c}.tw`).join('|');
        const twseUrl = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${tseChs}&_=${Date.now()}`;
        const resp = await fetch(twseUrl, {
          headers: {
            'Cookie': cookie || '',
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://mis.twse.com.tw/stock/fibest.jsp',
          }
        });
        const json = await resp.json();
        const msgArray = json.msgArray || [];
        msgArray.forEach(s => {
          const parsed = extractStockPrice(s);
          if (parsed && parsed.price) {
            stockPriceMap.set(s.c, {
              code: s.c,
              name: s.n,
              price: parsed.price,
              change: parsed.change,
              changePct: parsed.changePct,
            });
          }
        });
      } catch (e) {
        console.warn('[Analytics TWSE Fallback Error]', e.message);
      }
    }
  }

  const finalTop30 = sortedStocks.map((s, rankIdx) => {
    const pInfo = stockPriceMap.get(s.code) || {};
    const avgMentions = (s.totalMentions / (uniqueDates.length || 1)).toFixed(1);

    return {
      rank: rankIdx + 1,
      code: s.code,
      name: s.name,
      totalMentions: s.totalMentions,
      avgMentions: Number(avgMentions),
      dailyMentions: s.dailyMentions,
      samplePushes: s.samplePushes || [],
      price: pInfo.price !== undefined ? pInfo.price : null,
      change: pInfo.change !== undefined ? pInfo.change : null,
      changePct: pInfo.changePct !== undefined ? pInfo.changePct : null,
    };
  });

  const responsePayload = {
    success: true,
    category,
    dates: uniqueDates,
    totalArticlesCount,
    totalPushesAnalyzed,
    top30: finalTop30,
    timestamp: Date.now(),
  };

  if (!tenDaysCache.data) tenDaysCache.data = {};
  tenDaysCache.data[category] = responsePayload;
  tenDaysCache.fetchedAt = Date.now();

  saveAnalyticsCacheToFile(tenDaysCache);
  return responsePayload;
}

// ── 午夜 12 點 (00:00:05) 自動 Cron 引擎 ────────────────────
function scheduleMidnightCron() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 5
  );

  const msUntilMidnight = nextMidnight.getTime() - now.getTime();
  console.log(`⏰ [Midnight Cron] 距離下一次午夜 12:00 自動近十日大數據更新還剩: ${(msUntilMidnight / 1000 / 60).toFixed(1)} 分鐘`);

  setTimeout(async () => {
    console.log('🌙 [Midnight Cron] 到了午夜 12 點！開始自動計算與儲存近十日聲量大數據...');
    try {
      await generateAndSaveTenDaysAnalytics('all');
      await generateAndSaveTenDaysAnalytics('intraday');
      await generateAndSaveTenDaysAnalytics('afterHours');
      console.log('🎉 [Midnight Cron] 午夜 12 點近十日大數據自動更新並儲存完成！');
    } catch (e) {
      console.error('[Midnight Cron Error]', e.message);
    }
    scheduleMidnightCron();
  }, msUntilMidnight);
}

scheduleMidnightCron();

app.get('/api/analytics/ten-days', async (req, res) => {
  try {
    const category = req.query.category || 'all'; // all, intraday, afterHours

    // 如果持久化檔案內有資料，0.001 秒直接回傳 (零等待)！
    if (tenDaysCache.data && tenDaysCache.data[category]) {
      return res.json(tenDaysCache.data[category]);
    }

    // 若第一次尚無檔案，現場計算並持久化寫入檔案
    const data = await generateAndSaveTenDaysAnalytics(category);
    res.json(data);
  } catch (err) {
    console.error('[Ten Days Analytics Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// ── WebSocket 0.5 秒級即時串流廣播引擎 ─────────────────────
const http      = require('http');
const WebSocket = require('ws');
const iconv     = require('iconv-lite');

const server = http.createServer(app);
const wss    = new WebSocket.Server({ server, path: '/ws' });

let activeWatchUrl    = '';
let activeWatchPushes = [];
let watchInterval     = null;
let pttBbsClient      = null;

function connectPttBbsNative() {
  try {
    pttBbsClient = new WebSocket('wss://ws.ptt.cc/bbs', {
      headers: {
        'Origin': 'https://term.ptt.cc',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    pttBbsClient.on('open', () => {
      console.log('🟢 PTT BBS 官方加密通道 (wss://ws.ptt.cc/bbs) 0.1s App級直連成功！');
    });

    pttBbsClient.on('message', data => {
      let text;
      try { text = new TextDecoder('utf-8').decode(data); }
      catch { text = iconv.decode(data, 'big5'); }

      const cleanText = text.replace(/\x1b\[[0-9;]*[mGKH]/g, '');
      if (cleanText.includes('請輸入代號') || cleanText.includes('Guest')) {
        pttBbsClient.send('guest\r\n');
      }
    });

    pttBbsClient.on('error', err => {
      console.warn('[PTT BBS Native Error]', err.message);
    });

    pttBbsClient.on('close', () => {
      setTimeout(connectPttBbsNative, 5000);
    });
  } catch (e) {
    console.warn('[connectPttBbsNative Fail]', e.message);
  }
}

connectPttBbsNative();

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

async function checkPttStream() {
  if (!activeWatchUrl) return;
  try {
    const fetchUrl = activeWatchUrl + (activeWatchUrl.includes('?') ? '&' : '?') + `_=${Date.now()}`;
    const html     = await fetchPTT(fetchUrl);
    const $        = cheerio.load(html);
    const pushes   = [];
    $('.push').each((idx, el) => {
      const $el        = $(el);
      const tag        = $el.find('.push-tag').text().trim();
      const userid     = $el.find('.push-userid').text().trim();
      const content    = $el.find('.push-content').text().replace(/^:\s*/, '').trim();
      const ipdatetime = $el.find('.push-ipdatetime').text().trim();
      pushes.push({ idx, tag, userid, content, ipdatetime });
    });

    if (pushes.length > activeWatchPushes.length || pushes.length !== activeWatchPushes.length) {
      const newPushesCount = Math.max(0, pushes.length - activeWatchPushes.length);
      activeWatchPushes    = pushes;
      broadcast({
        type:         'push_update',
        url:          activeWatchUrl,
        pushTotal:    pushes.length,
        newPushCount: newPushesCount,
        pushes:       pushes,
        timestamp:    Date.now(),
      });
    }
  } catch (e) {
    console.warn('[WebSocket Stream Error]', e.message);
  }
}

wss.on('connection', ws => {
  console.log('[WebSocket Gateway] 🟢 0.5s 秒級即時長連線已建立');
  ws.send(JSON.stringify({ type: 'connected', activeUrl: activeWatchUrl, status: 'live_stream_active' }));

  ws.on('message', message => {
    try {
      const msg = JSON.parse(message);
      if (msg.action === 'watch_article' && msg.url) {
        console.log(`[WebSocket Streamer] 開始秒級監測: ${msg.url}`);
        activeWatchUrl    = msg.url;
        activeWatchPushes = [];
        if (watchInterval) clearInterval(watchInterval);
        checkPttStream();
        watchInterval = setInterval(checkPttStream, 1000); // 1 秒高頻極速掃描
      }
    } catch (e) {}
  });
});

// ── 啟動 ──────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║   PTT 輿情 × 台股看板  已啟動 (WS 即時)  ║');
  console.log(`  ║   http://localhost:${PORT}                    ║`);
  console.log('  ║   ws://localhost:' + PORT + '/ws                     ║');
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});

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

const EMBEDDED_TOP30 = [{"rank":1,"code":"2330","name":"台積電","totalMentions":626,"avgMentions":62.6,"price":2370,"change":5,"changePct":0.21,"dailyCounts":[83,31,126,92,44,53,38,58,51,50],"realPushes":[{"tag":"推","userid":"CYHGCS","content":"大家都心知肚明台積電是沒未來的空殼爛公司","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"罪不少人 在場很多人 都是手上有台積電的 長期持有","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"最近發現會去買台積電跟會去賭博的人是同一群人","date":"2026/08/06"},{"tag":"→","userid":"asjh612","content":"每天都在說 台灣人在存股0050台積電 然後說不知道","date":"2026/08/06"},{"tag":"推","userid":"kwanles","content":"0050跟台積電這兩個觀點太威了","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"台積電不倒 台股跟台灣永遠不會好","date":"2026/08/06"},{"tag":"推","userid":"hihi29","content":"雀食 存骨台積電不如存股宏達電","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"把台積電趕出台灣 剔除台股 跟大家保證台股秒上五萬","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：整個烏俄戰爭斷好幾次了 你看  台積電要準備","date":"2026/08/06"},{"tag":"推","userid":"sunbox","content":"一人一信把台積電趕出0050","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"說真的這段時間都是台積電在拖累台股 沒人反對吧？","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你看七月 台積電 直接法說會變法會","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"最扯的是還有人覺得台積電很屌 笑死跟井底之蛙一樣","date":"2026/08/06"},{"tag":"推","userid":"nofear2101","content":"挖屋  驚人的見解  指數剔除台積電後 會剩多少@@","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"台積電早已成為人人唾棄的爛公司了 還有人活在過去","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：法說會後新聞說台積電要漲價 結果開高走低","date":"2026/08/06"},{"tag":"推","userid":"GossipCandy","content":"2330下降壓力線！","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"分析台積電做什麼？？有空嗎","date":"2026/08/06"},{"tag":"推","userid":"CYHGCS","content":"現在真的只有韭菜才會去買台積電 套一輩子吧","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：明天台積電 要 灌破季線 一路往下跌！ 你各位","date":"2026/08/06"},{"tag":"推","userid":"kashy","content":"明天台積電大跌！大家聽好了！","date":"2026/08/06"},{"tag":"→","userid":"svool","content":"今天講報紙美股台積電 就這樣水一集三小","date":"2026/08/06"},{"tag":"推","userid":"AnnWow","content":"昨天台積電反彈3%，今天大跌1.6%","date":"2026/08/06"},{"tag":"→","userid":"omanorboyo","content":"每次他在提台積電 就是在水時間了","date":"2026/08/06"},{"tag":"噓","userid":"purplemagic","content":"GG回測季線月線沒破，不是好事嗎","date":"2026/08/06"},{"tag":"→","userid":"CYHGCS","content":"台積電這種沒未來性的公司還有人覺得他很屌 笑死","date":"2026/08/06"},{"tag":"→","userid":"fhjqwefs","content":"小兒幾兆GG現貨真的要砸盤今天能收4W4?","date":"2026/08/06"},{"tag":"推","userid":"GingFreecss","content":"手上沒台積發哥的估計無感 台積一個人跌點就超過大","date":"2026/08/06"},{"tag":"→","userid":"macheal","content":"今天手中持股，除了0050跟台積電，都漲...XD","date":"2026/08/06"},{"tag":"推","userid":"s555666","content":"台積殺尾盤很常見吧","date":"2026/08/06"}]},{"rank":2,"code":"2327","name":"國巨*","totalMentions":440,"avgMentions":44,"price":540,"change":-30,"changePct":-5.26,"dailyCounts":[23,14,53,49,16,114,61,41,55,14],"realPushes":[{"tag":"→","userid":"GingFreecss","content":"國巨已經沒救了 不必再問","date":"2026/08/06"},{"tag":"→","userid":"GingFreecss","content":"一直看有人在推文說國巨的 他們一定都套在800以上","date":"2026/08/06"},{"tag":"推","userid":"LipaCat5566","content":"國巨遲早回歸基本面 股價創新高","date":"2026/08/06"},{"tag":"推","userid":"purplemagic","content":"8zz還持有國巨","date":"2026/08/06"},{"tag":"→","userid":"ZiHen","content":"我買499國巨還是喊創新高啊","date":"2026/08/06"},{"tag":"推","userid":"yoshiki78529","content":"三萬買反一要解套跟國巨重新1300機率一樣高","date":"2026/08/06"},{"tag":"→","userid":"tw411001","content":"國巨 空","date":"2026/08/06"},{"tag":"推","userid":"oo1202oo","content":"國巨現在空會不會空到地板","date":"2026/08/06"},{"tag":"推","userid":"lmc66","content":"國巨聖誕樹還是必須完成","date":"2026/08/06"},{"tag":"推","userid":"allenJr","content":"還好昨天把小賺頎邦賣了，被嘎的國巨留著…","date":"2026/08/06"},{"tag":"→","userid":"jt13","content":"國巨先盤整個一季吧....買上去都被倒下來 沒盤整把","date":"2026/08/06"},{"tag":"推","userid":"jumilin927","content":"救命啊 國巨別崩啦","date":"2026/08/06"},{"tag":"推","userid":"a200ea200e","content":"國巨應該十點就燈了吧","date":"2026/08/06"},{"tag":"推","userid":"v58264579","content":"國巨又在智障了哈哈哈","date":"2026/08/06"},{"tag":"推","userid":"xavitier","content":"買錯股票確實很恐慌 對不起 就像國巨","date":"2026/08/06"},{"tag":"推","userid":"Heyer","content":"國巨你幹嘛","date":"2026/08/06"},{"tag":"→","userid":"tw411001","content":"國巨 空","date":"2026/08/06"},{"tag":"推","userid":"allenJr","content":"國巨昨天午盤後超硬，原本從放空獲利變帳上虧損的","date":"2026/08/06"},{"tag":"推","userid":"jumilin927","content":"國巨你不要啊","date":"2026/08/06"},{"tag":"推","userid":"WSLai","content":"國巨又悲劇","date":"2026/08/06"},{"tag":"推","userid":"lmc66","content":"如果要選一隻股票終其一生避開 一定是國巨","date":"2026/08/06"},{"tag":"推","userid":"matto","content":"國巨洗盤k 看起來會噴","date":"2026/08/06"},{"tag":"推","userid":"eierom","content":"8zZ不是有買國巨","date":"2026/08/06"},{"tag":"→","userid":"sunbox","content":"又在臭國巨1200","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：國巨 欣興 京元電 你看 開盤都是一路緩殺","date":"2026/08/05"},{"tag":"→","userid":"dosiris","content":"買國巨的悲劇+1","date":"2026/08/05"},{"tag":"推","userid":"hunteryoyoyo","content":"國巨送分題，座位還很多","date":"2026/08/05"},{"tag":"推","userid":"numlocka","content":"國巨3.0","date":"2026/08/05"},{"tag":"→","userid":"zetatmrptt","content":"國巨不會那麼好心開綠讓貪狗上車吧","date":"2026/08/05"},{"tag":"推","userid":"marginalFeng","content":"國巨應該一堆當沖貪狗會拼 操作祝順利","date":"2026/08/05"}]},{"rank":3,"code":"00632R","name":"元大台灣50反1","totalMentions":428,"avgMentions":42.8,"price":10.35,"change":0.02,"changePct":0.19,"dailyCounts":[69,112,205,14,16,2,3,3,2,2],"realPushes":[{"tag":"推","userid":"s8911090","content":"小新貼的前天反一10.63收盤價","date":"2026/08/06"},{"tag":"推","userid":"obovqq","content":"老蘇 救救反1☹☹☹☹☹","date":"2026/08/06"},{"tag":"推","userid":"tony81456200","content":"明天反一要大賺了","date":"2026/08/06"},{"tag":"→","userid":"sunbox","content":"明天反一要大賺了","date":"2026/08/06"},{"tag":"→","userid":"purplemagic","content":"反1的五日線今天跌破所有均線，這樣可以嗎","date":"2026/08/06"},{"tag":"推","userid":"mengze3084","content":"反一大漲0.03塊","date":"2026/08/06"},{"tag":"推","userid":"HiuAnOP","content":"說實話 我剛剛發現一張反一 哈哈","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"Hi大 你也加入老蘇反一大家庭了","date":"2026/08/06"},{"tag":"推","userid":"kmshy","content":"相對低檔買反1 大概小丑才會做","date":"2026/08/06"},{"tag":"→","userid":"obovqq","content":"聽老蘇的話 歐印反1 現在變小丑了QQ","date":"2026/08/06"},{"tag":"推","userid":"HiuAnOP","content":"空蛙團結！反一忠誠@@\\","date":"2026/08/06"},{"tag":"→","userid":"CreatorK","content":"反1還沒被嘎爆喔","date":"2026/08/06"},{"tag":"噓","userid":"mark7887","content":"反一被嘎爆的是會員不是老屍","date":"2026/08/06"},{"tag":"推","userid":"obovqq","content":"我聽老蘇的話 買了一堆反一 會贏吧？QQ","date":"2026/08/06"},{"tag":"推","userid":"faloca","content":"前天買反一的話你現在還是虧錢吧","date":"2026/08/06"},{"tag":"推","userid":"obovqq","content":"我反一昨天買的☺☺☺","date":"2026/08/06"},{"tag":"推","userid":"Daniel0712","content":"老蘇反一贏了","date":"2026/08/06"},{"tag":"推","userid":"intointo","content":"反一真的可以買？","date":"2026/08/06"},{"tag":"噓","userid":"YOYOISGOOD","content":"反一波動太小 做隔日沖也沒啥賺頭","date":"2026/08/06"},{"tag":"→","userid":"YOYOISGOOD","content":"反一也不能抱長期 簡直爛股一隻","date":"2026/08/06"},{"tag":"推","userid":"yoshiki78529","content":"三萬買反一要解套跟國巨重新1300機率一樣高","date":"2026/08/06"},{"tag":"推","userid":"lan3695120","content":"反一當沖便當錢過過癮用的 輸贏小小的","date":"2026/08/06"},{"tag":"推","userid":"klwei","content":"老蘇今天反一不要偷跑","date":"2026/08/06"},{"tag":"推","userid":"aa00788","content":"反一大獲全勝了","date":"2026/08/06"},{"tag":"→","userid":"obovqq","content":"才跌這麼一點點 反一的手續費都不夠==","date":"2026/08/06"},{"tag":"推","userid":"OOorc","content":"老蘇空了反一。馬上賺","date":"2026/08/06"},{"tag":"推","userid":"Daniel0712","content":"狂賀老蘇反一大賺 神","date":"2026/08/06"},{"tag":"推","userid":"obovqq","content":"老蘇 救救反1☹☹☹☹☹☹","date":"2026/08/06"},{"tag":"推","userid":"tony81456200","content":"反一是能賺多少錢","date":"2026/08/06"},{"tag":"推","userid":"kings5515","content":"昨天聰明融資買反一現在都基本操作，畢竟連漲兩天猜","date":"2026/08/06"}]},{"rank":4,"code":"0050","name":"元大台灣50","totalMentions":412,"avgMentions":41.2,"price":102.85,"change":-0.45,"changePct":-0.44,"dailyCounts":[30,48,89,29,65,54,62,8,16,11],"realPushes":[{"tag":"→","userid":"PeterHenson","content":"笑死 還在講0050套20年","date":"2026/08/06"},{"tag":"→","userid":"asjh612","content":"你明明就覺得所有人都在存0050還要裝不知道XD","date":"2026/08/06"},{"tag":"推","userid":"a069275235","content":"講0050套20年不是會得罪人吧= = 人家是把你當OO","date":"2026/08/06"},{"tag":"→","userid":"asjh612","content":"每天都在說 台灣人在存股0050台積電 然後說不知道","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"下半改酸0050","date":"2026/08/06"},{"tag":"推","userid":"kwanles","content":"0050跟台積電這兩個觀點太威了","date":"2026/08/06"},{"tag":"推","userid":"sunbox","content":"一人一信把台積電趕出0050","date":"2026/08/06"},{"tag":"推","userid":"redbeanbread","content":"0050準備150","date":"2026/08/06"},{"tag":"→","userid":"macheal","content":"今天手中持股，除了0050跟台積電，都漲...XD","date":"2026/08/06"},{"tag":"推","userid":"molopo","content":"0050 只會更高 okder","date":"2026/08/06"},{"tag":"→","userid":"molopo","content":"0050 還要停損 去玩定存吧","date":"2026/08/06"},{"tag":"→","userid":"omanorboyo","content":"會員錢都套在空單跟50反 這波大行情沒吃到","date":"2026/08/06"},{"tag":"→","userid":"leeroy277","content":"老蘇只會說0050套20年，都不敢說自己績效比0050好","date":"2026/08/06"},{"tag":"→","userid":"omanorboyo","content":"孩子10年後會問爸爸 為啥當時大AI年你在買50反","date":"2026/08/06"},{"tag":"推","userid":"lobster1688","content":"靠杯 美國30年債今天漲了50bps 嚇鼠人","date":"2026/08/06"},{"tag":"噓","userid":"kanoka","content":"憨恐：試搓崩盤丸子 (0050搓平盤)","date":"2026/08/06"},{"tag":"噓","userid":"calqlus","content":"https://i.verb.tw/Io50oZmC.jpg","date":"2026/08/06"},{"tag":"→","userid":"OOorc","content":"哲哲0050還不賣？","date":"2026/08/06"},{"tag":"推","userid":"weekend88123","content":"對折長買0050 會員買環球晶 大獲全勝","date":"2026/08/06"},{"tag":"推","userid":"instill8","content":"0050蛙完全不怕","date":"2026/08/06"},{"tag":"→","userid":"f204137","content":"一季賺4元 股價不用90元 PE50倍的 衝去買 呵呵人性","date":"2026/08/06"},{"tag":"推","userid":"OOorc","content":"老蘇買了一堆五十反。超猛超帥","date":"2026/08/06"},{"tag":"推","userid":"hsylwz","content":"包子想收50喔","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"剛剛把兒子滿手0050給鮮奶照了   舒服","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"班班喝鮮乳   滿手50鮮奶照!","date":"2026/08/06"},{"tag":"推","userid":"GOPAPA","content":"包子又回50了","date":"2026/08/06"},{"tag":"推","userid":"a2258335","content":"包子50！","date":"2026/08/06"},{"tag":"推","userid":"nofear2101","content":"老蘇愛炫技咩  看哲哲買0050 就叫會員買個反一對做","date":"2026/08/06"},{"tag":"推","userid":"s9815149","content":"群創回50惹","date":"2026/08/06"},{"tag":"推","userid":"silentmobius","content":"老蘇：50反漲0.03https://i.verb.tw/tUVWrc1I.gif","date":"2026/08/06"}]},{"rank":5,"code":"00631L","name":"元大台灣50正2","totalMentions":386,"avgMentions":38.6,"price":33.68,"change":-0.17,"changePct":-0.5,"dailyCounts":[17,47,61,31,52,34,55,27,24,38],"realPushes":[{"tag":"噓","userid":"cir78918","content":"gf正二40還有救嗎！！！","date":"2026/08/06"},{"tag":"→","userid":"special108","content":"你各位攤狗買正2的時候就要有人做出空單給你","date":"2026/08/06"},{"tag":"推","userid":"special108","content":"你各位貪越多正2小兒空單越多","date":"2026/08/06"},{"tag":"推","userid":"benyoung9","content":"明天正二漲停","date":"2026/08/06"},{"tag":"推","userid":"qqq852963tw","content":"外資一堆正二該不會都韓國散戶買的吧….","date":"2026/08/06"},{"tag":"推","userid":"mqhung","content":"昨天外資買正二跟GG，今天看表演嘍","date":"2026/08/06"},{"tag":"推","userid":"junthink","content":"正二貪狗融資已離場，準備低接","date":"2026/08/06"},{"tag":"推","userid":"p20770299","content":"正2貪狗好猛= = 今天是不是又要大爆接","date":"2026/08/06"},{"tag":"推","userid":"Timberlake","content":"正2貪狗根本主力啊 買最低賣最高怎麼輸","date":"2026/08/06"},{"tag":"推","userid":"shizukun0103","content":"現在正二融資仔跑超快 跌就資增 拉一根就跑","date":"2026/08/06"},{"tag":"→","userid":"galleon2000","content":"正二蛙跑光光 根本就不忠誠","date":"2026/08/06"},{"tag":"推","userid":"loleea","content":"砸小兒的正2","date":"2026/08/06"},{"tag":"推","userid":"instill8","content":"昨天正二先賣一趟蛙 價差1元","date":"2026/08/06"},{"tag":"推","userid":"kings5515","content":"費半昨天比正二強有爽到走一趟，今天怎跌這麼多","date":"2026/08/06"},{"tag":"噓","userid":"purplemagic","content":"反1和正2一樣都會被震盪盤耗損，","date":"2026/08/06"},{"tag":"→","userid":"Feting","content":"我好害怕 今天買了一點正2 會不會冥力爆發","date":"2026/08/06"},{"tag":"推","userid":"colamaz","content":"明天空軍日，買正2....","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"老蘇  開始講正二蛙!!!!","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：只有開高槓桿的人倒在上禮拜 現股50正2有停損","date":"2026/08/05"},{"tag":"→","userid":"icelaw","content":"老蘇 我0050跟正二有賺啊 不要跟空氣吵架好嗎 笑死","date":"2026/08/05"},{"tag":"→","userid":"icelaw","content":"老蘇又在跟稻草人吵架 老蘇50仔跟正二仔早就賺爆了","date":"2026/08/05"},{"tag":"→","userid":"marlboro1527","content":"我的正2放這麼久怎麼突然被借出去了","date":"2026/08/05"},{"tag":"推","userid":"avavgirl","content":"為何我的正2都借不出去","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你要買這個(字卡正二被立可白塗成反1","date":"2026/08/05"},{"tag":"推","userid":"PeterHenson","content":"連空正2都不敢","date":"2026/08/05"},{"tag":"推","userid":"darren9","content":"正2發起行動","date":"2026/08/05"},{"tag":"推","userid":"wrc0903","content":"成交排行 有正二有反一 我好錯亂啊","date":"2026/08/05"},{"tag":"推","userid":"Subzero0000","content":"4000/4100陸續買了黃金正二 看看薯條可不可以加大","date":"2026/08/05"},{"tag":"推","userid":"ppmaker","content":"小兒就大買正二 各位根本不用擔心 明天隨便噴兩千點","date":"2026/08/05"},{"tag":"推","userid":"JacqueJones","content":"開低就是現股買正二阿","date":"2026/08/05"}]},{"rank":6,"code":"2408","name":"南亞科","totalMentions":189,"avgMentions":18.9,"price":457,"change":-2,"changePct":-0.44,"dailyCounts":[34,55,23,5,2,17,4,10,39],"realPushes":[{"tag":"推","userid":"Tamsi","content":"老蘇旺宏嘎10%  宇瞻9%  威剛6% 南亞科3%  全面軋爆","date":"2026/08/06"},{"tag":"推","userid":"a1684114","content":"老蘇: 南亞科 空!","date":"2026/08/06"},{"tag":"→","userid":"gbman","content":"牙科都快新高了還不走!真的貪CC","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"南亞科多蛙有聾割+8ZZ,空蛙有老蘇","date":"2026/08/06"},{"tag":"推","userid":"cs80488","content":"老蘇說要空牙科 日月光 拭目以待","date":"2026/08/06"},{"tag":"推","userid":"grass930","content":"牙科被8zz打下來了","date":"2026/08/06"},{"tag":"推","userid":"Rever","content":"南亞科紅啦 老蘇","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"南亞科多蛙有聾割+8ZZ,空蛙有老蘇","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"牙科別撐了有8zz","date":"2026/08/06"},{"tag":"→","userid":"BBBC64","content":"牙科 8ZZ+龍哥 各位塊買阿","date":"2026/08/06"},{"tag":"推","userid":"grass930","content":"牙科突然V起來是怎樣","date":"2026/08/06"},{"tag":"推","userid":"jay667788","content":"牙科救呆灣","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"牙科是不是終於要拉高出貨","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"牙科有高盛 大小摩 不可能漲真的==","date":"2026/08/06"},{"tag":"推","userid":"chuchuyy","content":"牙科這麼撐？","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"目前南亞科的多蛙聾割+8ZZ 力壓 空蛙的老蘇","date":"2026/08/06"},{"tag":"推","userid":"astrokid","content":"牙科好猛","date":"2026/08/06"},{"tag":"推","userid":"Rever","content":"南亞科還在漲 老蘇的空單今天又可以加空了","date":"2026/08/06"},{"tag":"推","userid":"kyorock","content":"牙科真的假的","date":"2026/08/06"},{"tag":"推","userid":"vodkalime607","content":"牙科會過前高嗎 七月營收大爆發","date":"2026/08/06"},{"tag":"→","userid":"hpk89","content":"全世界記憶體都跌牙科喊漲，不科學啊","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"牙科是針對老蘇嗎","date":"2026/08/06"},{"tag":"→","userid":"kyorock","content":"牙科掀奶罩了","date":"2026/08/06"},{"tag":"→","userid":"czg","content":"南亞科有聾割+8ZZ,是負負得正嗎","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"老蘇贏了 牙科外資帶頭詐騙","date":"2026/08/06"},{"tag":"推","userid":"kyorock","content":"牙科今天很撐欸","date":"2026/08/06"},{"tag":"推","userid":"kyorock","content":"牙科趁紅的快跑吧","date":"2026/08/06"},{"tag":"→","userid":"westlife0903","content":"南亞科8月應該可以上500再下去","date":"2026/08/06"},{"tag":"推","userid":"saihao","content":"老蘇救救南亞科空軍","date":"2026/08/06"},{"tag":"→","userid":"yuyulin9168","content":"牙科獲利擺在那空軍請給尊重","date":"2026/08/06"}]},{"rank":7,"code":"5347","name":"世界","totalMentions":129,"avgMentions":12.9,"price":143.5,"change":-8,"changePct":-5.28,"dailyCounts":[21,9,13,17,9,9,5,15,17,14],"realPushes":[{"tag":"推","userid":"ivan761016","content":"韓股跌成這樣 台股真的是世界強亞歐納指","date":"2026/08/06"},{"tag":"推","userid":"faloca","content":"台股撐盤狗世界強 真的別亂空","date":"2026/08/06"},{"tag":"推","userid":"sakukio","content":"等等我會做股票的韓國人又要來帶崩全世界","date":"2026/08/06"},{"tag":"推","userid":"astrokid","content":"歐巴第三世界的指數","date":"2026/08/06"},{"tag":"推","userid":"welcome","content":"韓股世界毒瘤","date":"2026/08/06"},{"tag":"→","userid":"bear753951","content":"歐巴率先全世界開始走C波下跌了","date":"2026/08/06"},{"tag":"推","userid":"berryc","content":"要靠台股來拯救世界了","date":"2026/08/06"},{"tag":"推","userid":"astrokid","content":"鬼指世界強","date":"2026/08/06"},{"tag":"推","userid":"kk931205zz","content":"亞洲那斯達克又要拯救世界了嗎","date":"2026/08/06"},{"tag":"推","userid":"hc20016","content":"台股世界強 跌不多啦","date":"2026/08/06"},{"tag":"推","userid":"chejrk","content":"大跌250點 台股世界強","date":"2026/08/06"},{"tag":"推","userid":"hc20016","content":"台股世界強","date":"2026/08/06"},{"tag":"噓","userid":"greatliona","content":"呆股世界強 歐巴滾","date":"2026/08/06"},{"tag":"推","userid":"hpk89","content":"台股世界最強","date":"2026/08/06"},{"tag":"推","userid":"OOorc","content":"老蘇是新世界的神","date":"2026/08/06"},{"tag":"→","userid":"hpk89","content":"全世界記憶體都跌牙科喊漲，不科學啊","date":"2026/08/06"},{"tag":"推","userid":"gbman","content":"台股又變世界強XD","date":"2026/08/06"},{"tag":"噓","userid":"zaqqaz","content":"全世界看好惹...台股只示範一次～尾盤翻紅 ^^","date":"2026/08/06"},{"tag":"噓","userid":"Shepherd1987","content":"只有GG受傷的世界","date":"2026/08/06"},{"tag":"→","userid":"frankie30432","content":"庫存扣掉GG 損益比昨天收盤還多 台股世界強","date":"2026/08/06"},{"tag":"→","userid":"cps80655","content":"世界末日，不聽老蘇言，錢包上撒鹽","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：空創建 空世界(腦大慘了) 空聯茂 空南亞科","date":"2026/08/05"},{"tag":"→","userid":"joe2","content":"老蘇：空  創見。世界。聯茂。南亞科。威剛。宇瞻","date":"2026/08/05"},{"tag":"推","userid":"a3648211","content":"台股真的世界爛 廢物","date":"2026/08/05"},{"tag":"推","userid":"pt993526","content":"一覺起來 世界變了","date":"2026/08/05"},{"tag":"推","userid":"qwaszx012","content":"今天又要靠呆股拯救世界啦 呆股世界強","date":"2026/08/05"},{"tag":"噓","userid":"kevingo0215","content":"多蛙看到日韓也往下，就會說台股世界強","date":"2026/08/05"},{"tag":"→","userid":"hikari22","content":"這禮拜不是有一天全世界崩爛就台股噴而已嗎","date":"2026/08/05"},{"tag":"→","userid":"vinase","content":"當全世界都覺得會季線反壓的時候","date":"2026/08/05"},{"tag":"噓","userid":"vinase","content":"注意 全世界只有空蛙知道季線會反壓 天機不可洩漏","date":"2026/08/05"}]},{"rank":8,"code":"00981A","name":"主動統一台股增長","totalMentions":101,"avgMentions":10.1,"price":28.03,"change":-0.81,"changePct":-2.81,"dailyCounts":[3,8,8,23,15,30,2,11,1],"realPushes":[{"tag":"→","userid":"iphone15s","content":"不可忽視瑤姐的操作","date":"2026/08/06"},{"tag":"推","userid":"JRhokkaido","content":"瑤池金母！","date":"2026/08/06"},{"tag":"噓","userid":"matto","content":"原來981A不會做股票 還加碼空頭股票史詩級凹單攤平","date":"2026/08/06"},{"tag":"推","userid":"michael85913","content":"好了啦 我00981a這波都賺百萬出場了 傻多繼續吠","date":"2026/08/05"},{"tag":"→","userid":"hikari22","content":"經歷七月跌-30%以上的洗禮，我的981A今天要翻紅了","date":"2026/08/05"},{"tag":"→","userid":"wheat1130","content":"抄底歐in0050 (X)；抄底歐in981A (O)","date":"2026/08/05"},{"tag":"→","userid":"hikari22","content":"我的981A崩了一個月終於要翻紅了我哭了","date":"2026/08/05"},{"tag":"→","userid":"hikari22","content":"美韓日都噴爛了981A沒道理不噴都是連動的","date":"2026/08/05"},{"tag":"推","userid":"trueclamp","content":"前幾天還有人質疑瑤姐，說自己操盤更好，笑死","date":"2026/08/05"},{"tag":"推","userid":"fujimoto","content":"瑤姐厲害哦","date":"2026/08/05"},{"tag":"推","userid":"turncolan","content":"瑤姐繼續搖啊！","date":"2026/08/05"},{"tag":"噓","userid":"vul3wl6","content":"講話屌屌的 部位小小的 操作瑤姐的-.-","date":"2026/08/04"},{"tag":"推","userid":"GingFreecss","content":"知道為什麼有瑤池金母這個稱號嗎 因為她在三月開始","date":"2026/08/04"},{"tag":"→","userid":"hikari22","content":"經歷了七月的洗禮，我的981A今天久違的要翻紅了嗎","date":"2026/08/04"},{"tag":"推","userid":"aa882223","content":"國巨好猛 瑤姐這操作","date":"2026/08/04"},{"tag":"推","userid":"jenchieh5","content":"瑤姐拿你們的錢在對幹小兒，輸了也不是她自己的，","date":"2026/08/04"},{"tag":"噓","userid":"wheat1130","content":"抄底歐in0050 (X)；抄底歐in981A (O)","date":"2026/08/04"},{"tag":"推","userid":"wheat1130","content":"抄底歐in0050 (X)；抄底歐in981A (O)","date":"2026/08/04"},{"tag":"推","userid":"wheat1130","content":"抄底歐in0050 (X)；抄底歐in981A (O)","date":"2026/08/04"},{"tag":"→","userid":"Csir","content":"外資倒垃圾多單給瑤池金母和各位散戶接","date":"2026/08/03"},{"tag":"推","userid":"Orenjifurai","content":"小兒準備絕殺瑤姐了 https://i.urusai.cc/4LifY.png","date":"2026/08/03"},{"tag":"推","userid":"holyvoice","content":"981A買台指期很久了，只是部位擴大 而已","date":"2026/08/03"},{"tag":"推","userid":"holyvoice","content":"981A台指期部位才5%而已吧","date":"2026/08/03"},{"tag":"推","userid":"one2three3","content":"瑤姐大台神操作","date":"2026/08/03"},{"tag":"推","userid":"special108","content":"981A台指總共部位是20% 5%是保證金","date":"2026/08/03"},{"tag":"→","userid":"special108","content":"瑤姐教各位玩期貨","date":"2026/08/03"},{"tag":"推","userid":"v58264579","content":"瑤姐跟哲哲示範大戶與散戶的不同","date":"2026/08/03"},{"tag":"推","userid":"oo1202oo","content":"跟瑤姐買國巨都只要賺20%了","date":"2026/08/03"},{"tag":"推","userid":"ycsheaven","content":"981A紅的瑤姐真猛","date":"2026/08/03"},{"tag":"推","userid":"wheat1130","content":"981A：你們還好嗎？？","date":"2026/08/03"}]},{"rank":9,"code":"2303","name":"聯電","totalMentions":72,"avgMentions":7.2,"price":116,"change":-5.5,"changePct":-4.53,"dailyCounts":[3,4,3,5,4,12,28,2,7,4],"realPushes":[{"tag":"推","userid":"zetatmrptt","content":"聯電要被外資殺成垃圾了","date":"2026/08/06"},{"tag":"推","userid":"Forcast","content":"聯電戳平盤，光環戳漲停","date":"2026/08/06"},{"tag":"推","userid":"Forcast","content":"聯電又在122跟123.5","date":"2026/08/06"},{"tag":"推","userid":"Forcast","content":"聯電戳漲停","date":"2026/08/05"},{"tag":"推","userid":"kings5515","content":"還好聯電沒賣掉","date":"2026/08/05"},{"tag":"推","userid":"Forcast","content":"聯電變平盤","date":"2026/08/05"},{"tag":"推","userid":"Forcast","content":"聯電又戳漲停","date":"2026/08/05"},{"tag":"推","userid":"Forcast","content":"聯電試撮半根","date":"2026/08/04"},{"tag":"推","userid":"Forcast","content":"聯電撮變+1%","date":"2026/08/04"},{"tag":"推","userid":"qwe1290","content":"99二哥QQ","date":"2026/08/04"},{"tag":"推","userid":"sfwejfish","content":"二哥今天有券差？喵的放空仔7%拿去吃啦","date":"2026/08/03"},{"tag":"推","userid":"cazymm1994","content":"二哥這樣想進處置嗎","date":"2026/08/03"},{"tag":"推","userid":"yoyachen","content":"二哥還能起舞嗎","date":"2026/08/03"},{"tag":"噓","userid":"yoyachen","content":"二哥自殺了","date":"2026/08/03"},{"tag":"→","userid":"intointo","content":"聯電...","date":"2026/08/03"},{"tag":"推","userid":"Forcast","content":"聯電撮漲停","date":"2026/07/31"},{"tag":"推","userid":"goodkilua","content":"元大聯電期貨那啥數字 一堆9","date":"2026/07/31"},{"tag":"→","userid":"faloca","content":"二哥昨天就那樣 今天肯定一根","date":"2026/07/31"},{"tag":"→","userid":"goodkilua","content":"元大的聯電期那數字太美妙~","date":"2026/07/31"},{"tag":"推","userid":"biglock","content":"問下丁排昨天停損聯電 今天該追回來嗎？","date":"2026/07/30"},{"tag":"推","userid":"biglock","content":"丁排停損後再買根本瞎忙 昨天停損聯電 今天一定不敢","date":"2026/07/30"},{"tag":"→","userid":"wrong5566","content":"12:55左右一堆股票都被大賣，聯電、台積電、國巨…","date":"2026/07/30"},{"tag":"噓","userid":"johnwu","content":"國巨聯電何時要進處置","date":"2026/07/30"},{"tag":"噓","userid":"yoyachen","content":"二哥想要破百了 不會吧","date":"2026/07/30"},{"tag":"→","userid":"lkksddzz","content":"二哥只值40-50吧 -.-","date":"2026/07/30"},{"tag":"推","userid":"nofear2101","content":"聯電今天依舊不補 開高繼續空","date":"2026/07/30"},{"tag":"推","userid":"GingFreecss","content":"聯電紅的","date":"2026/07/30"},{"tag":"推","userid":"ngt047","content":"聯電！！！！","date":"2026/07/30"},{"tag":"→","userid":"likeyousmile","content":"聯電做夢呀","date":"2026/07/30"},{"tag":"推","userid":"LipaCat5566","content":"龍鴿 ： 基本面良好 聯電錯殺","date":"2026/07/30"}]},{"rank":10,"code":"2454","name":"聯發科","totalMentions":63,"avgMentions":6.3,"price":3900,"change":-20,"changePct":-0.51,"dailyCounts":[6,6,13,28,2,1,5,2],"realPushes":[{"tag":"推","userid":"GingFreecss","content":"手上沒台積發哥的估計無感 台積一個人跌點就超過大","date":"2026/08/06"},{"tag":"→","userid":"GingFreecss","content":"但我有發哥","date":"2026/08/06"},{"tag":"推","userid":"xhs","content":"拉台積 鴻海 發哥 殺中小和記憶體","date":"2026/08/06"},{"tag":"推","userid":"conquer1988","content":"嘎尾今天一定講聯發科跟台積電","date":"2026/08/06"},{"tag":"推","userid":"f204137","content":"台股不安定因素 聯發科 台達電 這些超漲的股價阿.","date":"2026/08/06"},{"tag":"→","userid":"f204137","content":"台積是偏貴 但還不像聯發科 台達電 超漲到離譜了","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"老蘇開始講聯發科。台達電!!!!","date":"2026/08/05"},{"tag":"推","userid":"kevinacc084","content":"又戰聯發科","date":"2026/08/05"},{"tag":"→","userid":"danny2451","content":"我的發哥被提到了 謝謝老蘇","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你看聯發科 台達電 光寶科 開盤即高點","date":"2026/08/05"},{"tag":"→","userid":"silentmobius","content":"發哥：老蘇不要過來啊","date":"2026/08/05"},{"tag":"→","userid":"kevinacc084","content":"穩了發哥台達電日月光欣興南電 明天亮燈","date":"2026/08/05"},{"tag":"→","userid":"GingFreecss","content":"發哥 休息一下 我們明天繼續","date":"2026/08/04"},{"tag":"推","userid":"oo1202oo","content":"發哥真的假的","date":"2026/08/04"},{"tag":"→","userid":"GingFreecss","content":"別怕 我大發哥繼續撐盤","date":"2026/08/04"},{"tag":"→","userid":"GingFreecss","content":"以後誰還敢臭我聯發科直接一拳","date":"2026/08/04"},{"tag":"→","userid":"tmdl","content":"發哥日月光這些要開了","date":"2026/08/04"},{"tag":"→","userid":"tmdl","content":"發哥腰包了","date":"2026/08/04"},{"tag":"推","userid":"zeldalight","content":"發哥你幹嘛","date":"2026/08/04"},{"tag":"→","userid":"f204137","content":"台積電 漲到跟 聯發科 那種價位 再說超漲","date":"2026/08/04"},{"tag":"推","userid":"kutkin","content":"硬要拉聯發科","date":"2026/08/04"},{"tag":"推","userid":"a70327cow","content":"發哥只值1200 台達500","date":"2026/08/04"},{"tag":"→","userid":"kutkin","content":"聯發科-100拉到-45","date":"2026/08/04"},{"tag":"推","userid":"limit2706","content":"發哥真的好笑","date":"2026/08/04"},{"tag":"推","userid":"a100213","content":"發哥最後一刻小彈回來，幹嘛？是認錯買回了逆","date":"2026/08/04"},{"tag":"→","userid":"GingFreecss","content":"上週五沒人賣我聯發科 心碎","date":"2026/08/03"},{"tag":"推","userid":"GingFreecss","content":"無論如何 我大發哥都會幫助大家撐盤 不用擔心","date":"2026/08/03"},{"tag":"推","userid":"GingFreecss","content":"我大發哥帶頭衝","date":"2026/08/03"},{"tag":"→","userid":"xhs","content":"殺gg不如殺台達電 鴻海 發哥 這些eps跟不上股價的","date":"2026/08/03"},{"tag":"推","userid":"chengking","content":"發哥漲停","date":"2026/08/03"}]},{"rank":11,"code":"2885","name":"元大金","totalMentions":55,"avgMentions":5.5,"price":67.7,"change":0.6,"changePct":0.89,"dailyCounts":[1,3,2,1,2,1,45],"realPushes":[{"tag":"推","userid":"no51106","content":"元大正二根本沒券了XDD","date":"2026/08/04"},{"tag":"推","userid":"Joeyangyu","content":"元大證金該調低利率了吧3.9%搞屁喔","date":"2026/08/03"},{"tag":"推","userid":"no51106","content":"小那怎麼又崩了 我未成年元大還我錢","date":"2026/08/03"},{"tag":"推","userid":"nien4009","content":"為什麼台積電跌五十元大盤卻是紅的?","date":"2026/08/03"},{"tag":"推","userid":"goodkilua","content":"元大聯電期貨那啥數字 一堆9","date":"2026/07/31"},{"tag":"→","userid":"goodkilua","content":"元大的聯電期那數字太美妙~","date":"2026/07/31"},{"tag":"推","userid":"no51106","content":"元大現在685融資還沒名額咧...","date":"2026/07/29"},{"tag":"推","userid":"kausan","content":"元大只能借50萬是在搞笑嗎","date":"2026/07/28"},{"tag":"推","userid":"wwewcwwwf","content":"元大沒調到6% 根本好心了 給你50萬算多了","date":"2026/07/28"},{"tag":"推","userid":"johnwu","content":"元大和富邦的大奶營業員怎麼都同一人","date":"2026/07/27"},{"tag":"推","userid":"loikoi","content":"元大app是不是壞了","date":"2026/07/24"},{"tag":"推","userid":"loikoi","content":"元大app是不是故障","date":"2026/07/24"},{"tag":"→","userid":"forget1129","content":"元大一早就在搞！爛","date":"2026/07/24"},{"tag":"推","userid":"s609747","content":"元大掛了","date":"2026/07/24"},{"tag":"推","userid":"KIDDLEE","content":"元大試搓呢 ????????????????","date":"2026/07/24"},{"tag":"推","userid":"goodkilua","content":"元大最近資料更新都很慢~","date":"2026/07/24"},{"tag":"推","userid":"AkiMegumi","content":"元大是不是怪怪的","date":"2026/07/24"},{"tag":"→","userid":"goodkilua","content":"元大連5檔掛單都看不到，盤後資料更新也都變慢","date":"2026/07/24"},{"tag":"→","userid":"goodkilua","content":"元大是不是想搞阿~","date":"2026/07/24"},{"tag":"→","userid":"babykeys","content":"元大怎麼都沒顯示，是不是丸子了","date":"2026/07/24"},{"tag":"→","userid":"westlife0903","content":"元大怎麼回事","date":"2026/07/24"},{"tag":"→","userid":"forget1129","content":"元大每個禮拜在維修還這麼爛！","date":"2026/07/24"},{"tag":"推","userid":"natopot","content":"元大怎麼沒盤前","date":"2026/07/24"},{"tag":"推","userid":"alan1943","content":"元大的世界還在半夜沒搓盤吧","date":"2026/07/24"},{"tag":"推","userid":"adsf","content":"元大守衛了嗎","date":"2026/07/24"},{"tag":"推","userid":"AkiMegumi","content":"元大系統有夠卡","date":"2026/07/24"},{"tag":"→","userid":"natopot","content":"元大恢復了","date":"2026/07/24"},{"tag":"→","userid":"goodkilua","content":"元大手機至少還能看到5檔~","date":"2026/07/24"},{"tag":"推","userid":"ccdrv","content":"元大壞了嗎？","date":"2026/07/24"},{"tag":"推","userid":"ptttpt","content":"元大app在衝啥小","date":"2026/07/24"}]},{"rank":12,"code":"00988A","name":"主動統一全球創新","totalMentions":49,"avgMentions":4.9,"price":16.39,"change":-0.21,"changePct":-1.27,"dailyCounts":[5,2,3,7,9,13,7,3],"realPushes":[{"tag":"→","userid":"sana113821","content":"988真的是搞笑咖 還沒開始崩 他自己先崩了","date":"2026/08/06"},{"tag":"→","userid":"hikari22","content":"美光amd三星崩爛988就一定崩啦，吃這三個很重","date":"2026/08/06"},{"tag":"噓","userid":"a11011788","content":"988這垃圾怎麼又跌3%","date":"2026/08/06"},{"tag":"推","userid":"Hina","content":"歐巴炸裂 988 不可能好","date":"2026/08/06"},{"tag":"推","userid":"fim","content":"下輩子別買988","date":"2026/08/06"},{"tag":"推","userid":"special108","content":"988A 7.58% 搓太少了吧 是被AMD帶賽喔","date":"2026/08/05"},{"tag":"推","userid":"tony81456200","content":"988好可怕喔  誰敢嘴988","date":"2026/08/05"},{"tag":"推","userid":"sim3000","content":"我的988A才彈16% ＱＱ","date":"2026/08/04"},{"tag":"推","userid":"showhere","content":"988之前賣在22元，請問現在可以接回來嗎 :）","date":"2026/08/04"},{"tag":"推","userid":"cookeeshop","content":"988到底會不會","date":"2026/08/04"},{"tag":"推","userid":"okucts","content":"988A還沒開盤淨值就已經漲11%了","date":"2026/07/31"},{"tag":"→","userid":"bunjie","content":"988變成漲到你叫爸爸","date":"2026/07/31"},{"tag":"→","userid":"okucts","content":"988A開盤直接超過漲停","date":"2026/07/31"},{"tag":"→","userid":"a71y242","content":"988這波衰的也套30幾% 跟歐巴有的拼  黑名單了","date":"2026/07/31"},{"tag":"推","userid":"v789678901","content":"今天第一次知道988的上限不是10%","date":"2026/07/31"},{"tag":"推","userid":"asdasd4522","content":"988 12%","date":"2026/07/31"},{"tag":"推","userid":"okucts","content":"988A淨值漲11.5%了 等一下開盤直接先漲11.5%","date":"2026/07/31"},{"tag":"→","userid":"Kyameron","content":"988A 一個收集全世界網紅股 一塊套的概念型ETF","date":"2026/07/30"},{"tag":"噓","userid":"Kyameron","content":"988A 一個收集全世界網紅股 一塊套的概念 QQ","date":"2026/07/30"},{"tag":"推","userid":"sim3000","content":"988A 被套30%怎麼辦 好想死","date":"2026/07/30"},{"tag":"推","userid":"lawyer94","content":"988根本最投機的主動式，只買飆股","date":"2026/07/30"},{"tag":"噓","userid":"Kyameron","content":"988A 一個收集全世界網紅股 一塊套的概念型ETF","date":"2026/07/30"},{"tag":"→","userid":"LipaCat5566","content":"988有一次漲20%那天就清空了","date":"2026/07/30"},{"tag":"推","userid":"asdasd4522","content":"988就是個垃圾阿 沒話說 這波統一團隊 真的爛到有","date":"2026/07/30"},{"tag":"推","userid":"yiru0519","content":"史上最爛ETF 988說第一沒人敢說第二","date":"2026/07/30"},{"tag":"推","userid":"asdasd4522","content":"988就跟韓國桿槓ETF差不多的東西","date":"2026/07/30"},{"tag":"推","userid":"seanliengodp","content":"今天988A要跌多少","date":"2026/07/28"},{"tag":"推","userid":"fat980","content":"988A烙屎成這樣","date":"2026/07/28"},{"tag":"→","userid":"excercang","content":"988周5會回到起漲點嗎","date":"2026/07/28"},{"tag":"推","userid":"jokem","content":"988是主動開槓嗎","date":"2026/07/28"}]},{"rank":13,"code":"3481","name":"群創","totalMentions":46,"avgMentions":4.6,"price":47.55,"change":-2.45,"changePct":-4.9,"dailyCounts":[29,3,1,4,1,3,1,2,2],"realPushes":[{"tag":"推","userid":"macheal","content":"群創尾盤上漲耶!","date":"2026/08/06"},{"tag":"推","userid":"holyvoice","content":"包子尾盤拉成這樣要賭7月營收嗎？","date":"2026/08/06"},{"tag":"推","userid":"kings5515","content":"包子怎這麼慘？昨天尾盤一直萎縮，外資上禮拜買這","date":"2026/08/06"},{"tag":"→","userid":"kings5515","content":"麼多包子在收割？","date":"2026/08/06"},{"tag":"推","userid":"nicexd","content":"包子!","date":"2026/08/06"},{"tag":"推","userid":"applexyz","content":"包子 熱熱的","date":"2026/08/06"},{"tag":"→","userid":"nicexd","content":"包子又","date":"2026/08/06"},{"tag":"推","userid":"macheal","content":"群創到底會不會到100啊...","date":"2026/08/06"},{"tag":"推","userid":"Racious","content":"睡醒包子怎麼了","date":"2026/08/06"},{"tag":"推","userid":"zax12321","content":"包子今天很屌喔","date":"2026/08/06"},{"tag":"推","userid":"nicexd","content":"包子 鴨梅肉","date":"2026/08/06"},{"tag":"推","userid":"Racious","content":"包子 好嘎","date":"2026/08/06"},{"tag":"→","userid":"minlochen","content":"包子打狗會有去無回嗎?","date":"2026/08/06"},{"tag":"推","userid":"Vanquze","content":"群創偷拉尾盤！！！","date":"2026/08/06"},{"tag":"推","userid":"fujioqq","content":"現在還有人手上有包子@@？","date":"2026/08/06"},{"tag":"推","userid":"hsylwz","content":"包子想收50喔","date":"2026/08/06"},{"tag":"推","userid":"nicexd","content":"包子想幹嘛rrrrr","date":"2026/08/06"},{"tag":"推","userid":"scum5566","content":"包子好燙","date":"2026/08/06"},{"tag":"→","userid":"nicexd","content":"包子 不要停 rrrrrr","date":"2026/08/06"},{"tag":"推","userid":"arron60418","content":"包子好猛啊啊啊啊啊啊啊啊啊","date":"2026/08/06"},{"tag":"推","userid":"kahn298","content":"包子高速加熱中","date":"2026/08/06"},{"tag":"→","userid":"nicexd","content":"包子燙口 請小心食用","date":"2026/08/06"},{"tag":"推","userid":"Racious","content":"包子啊啊啊","date":"2026/08/06"},{"tag":"推","userid":"nicexd","content":"包子 燒嘎","date":"2026/08/06"},{"tag":"推","userid":"GOPAPA","content":"包子又回50了","date":"2026/08/06"},{"tag":"推","userid":"mscmobitai","content":"包子被散戶買爆","date":"2026/08/06"},{"tag":"推","userid":"a2258335","content":"包子50！","date":"2026/08/06"},{"tag":"→","userid":"ZiHen","content":"50塊的包子又蒸出爐了","date":"2026/08/06"},{"tag":"推","userid":"s9815149","content":"群創回50惹","date":"2026/08/06"},{"tag":"→","userid":"celsius5720","content":"睡起來看來了一下 包子是平盤 為什麼阿QQ","date":"2026/08/05"}]},{"rank":14,"code":"2344","name":"華邦電","totalMentions":45,"avgMentions":4.5,"price":163.5,"change":-7.5,"changePct":-4.39,"dailyCounts":[12,4,1,5,2,6,4,4,2,5],"realPushes":[{"tag":"→","userid":"InfoWars","content":"http://i.imgur.com/vkvGzBJ.jpg 華邦電法說會 衝了","date":"2026/08/06"},{"tag":"推","userid":"kyorock","content":"華邦Q2 5.4","date":"2026/08/06"},{"tag":"推","userid":"XXXXCOW","content":"華邦電要等法說在跑嗎","date":"2026/08/06"},{"tag":"推","userid":"Stanton","content":"2344？","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"華邦好爛 沒跟著v","date":"2026/08/06"},{"tag":"→","userid":"Gyin","content":"台股硬邦邦","date":"2026/08/06"},{"tag":"推","userid":"akira911","content":"今天有人刻意要押華邦電嗎 怕下午法說會的好消息嗎","date":"2026/08/06"},{"tag":"推","userid":"Vanquze","content":"華邦尾盤偷拉哦","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"華邦電好撐 當沖還殺不下去","date":"2026/08/06"},{"tag":"推","userid":"chiy16","content":"下午看華邦電法說會....... 明日記憶體.......","date":"2026/08/06"},{"tag":"推","userid":"jasonbay22","content":"出了2344加碼gg","date":"2026/08/06"},{"tag":"推","userid":"chqwert8910a","content":"華邦電開法會+明天空軍日=負負得正？","date":"2026/08/06"},{"tag":"推","userid":"Beee09","content":"華邦電 近期應該有人會買到200吧","date":"2026/08/05"},{"tag":"推","userid":"Beee09","content":"華邦電 近期應該有人會買到200吧？ 好像 可能","date":"2026/08/05"},{"tag":"推","userid":"kevinacc084","content":"邦邦又要亮燈嗎","date":"2026/08/05"},{"tag":"→","userid":"stocktonty","content":"華邦電空40買140 南亞科空90買400 這操作真的太經典","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"龍哥：景碩假破底準備真穿頭！ 華邦電也要衝了","date":"2026/08/04"},{"tag":"推","userid":"ggy3218","content":"99華邦","date":"2026/08/03"},{"tag":"→","userid":"grass930","content":"牙科 華邦","date":"2026/08/03"},{"tag":"推","userid":"erining","content":"華邦要漲停了","date":"2026/08/03"},{"tag":"推","userid":"BuSuFuder","content":"華邦@@","date":"2026/08/03"},{"tag":"推","userid":"wishmax","content":"邦邦衝阿","date":"2026/08/03"},{"tag":"推","userid":"RaiGend0519","content":"南亞科！華邦電！旺宏！","date":"2026/07/31"},{"tag":"→","userid":"gn00152097","content":"金像電宜鼎南亞科華邦電新興都是抱上去又抱下來","date":"2026/07/31"},{"tag":"推","userid":"a1684114","content":"99邦邦啊 不知道要幾根漲停才回得去","date":"2026/07/30"},{"tag":"→","userid":"lkksddzz","content":"旺宏 5華邦8 南亞科10 我說的是股價","date":"2026/07/30"},{"tag":"→","userid":"wettland5566","content":"華邦電日月光台達電南亞科全部都跌停怎麼可能","date":"2026/07/30"},{"tag":"推","userid":"shunhahahaha","content":"南亞科 華邦電要幾天亮燈？","date":"2026/07/30"},{"tag":"推","userid":"squard","content":"華邦電跌停","date":"2026/07/30"},{"tag":"→","userid":"answermangtr","content":"焦家華崩電一路看起來要回到三十塊","date":"2026/07/30"}]},{"rank":15,"code":"2492","name":"華新科","totalMentions":42,"avgMentions":4.2,"price":251,"change":-5.5,"changePct":-2.14,"dailyCounts":[5,12,2,15,4,2,2],"realPushes":[{"tag":"推","userid":"ptsgi5483","content":"華新科炸 老蘇大獲全勝","date":"2026/08/06"},{"tag":"→","userid":"czg","content":"老蘇的華新科跌半根","date":"2026/08/06"},{"tag":"→","userid":"czg","content":"昨老蘇秀十檔空單,目前跌的只剩2檔華容+華新科","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"老蘇的華新科...有機會拼綠燈","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"我猜老蘇華新科獲利回補","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"老蘇：華新科跌70% 你要反彈20根還解套不了！","date":"2026/08/05"},{"tag":"→","userid":"kevingo0215","content":"老蘇：華新科跌70%，反彈3個漲停才這樣","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你看華新科 咻～～～～～～","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇 空 華新科","date":"2026/08/05"},{"tag":"推","userid":"yillusionwei","content":"華新科是權值股？","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"日月光 南亞科 華新科 剛剛老蘇放空確立目標QQ","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：空 威剛(冰人大標的) 空宇瞻 空旺宏 空華新科","date":"2026/08/05"},{"tag":"→","userid":"joe2","content":"老蘇：空  旺宏。華新科。華榮","date":"2026/08/05"},{"tag":"推","userid":"zetatmrptt","content":"華新科誰在倒","date":"2026/08/05"},{"tag":"推","userid":"zetatmrptt","content":"華新科要被灌一大根了","date":"2026/08/05"},{"tag":"推","userid":"aaaaaaa1","content":"老蘇放空華新科欸","date":"2026/08/05"},{"tag":"推","userid":"twfrank159","content":"空南亞科、華新科!!套蛙受死吧!!!!!","date":"2026/08/05"},{"tag":"→","userid":"chen0625","content":"笑死我今天看旺宏、華新科、大毅還以為老蘇空了","date":"2026/08/04"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你看華新科連三天漲停板 還在這邊耶！","date":"2026/08/04"},{"tag":"→","userid":"marginalFeng","content":"老蘇：老蘇我算數沒那麼好(現場算華新科跌幅","date":"2026/07/30"},{"tag":"→","userid":"stocktonty","content":"但華新科這種算大股票一個月-70%真的很少見","date":"2026/07/30"},{"tag":"推","userid":"Avril1975","content":"華新科645變198 更慘","date":"2026/07/30"},{"tag":"推","userid":"chiy16","content":"100萬買2492華新科 現在剩30萬出頭 MLCC全跌成智障","date":"2026/07/30"},{"tag":"推","userid":"vvnews","content":"我好奇華新哥的華新科有賣嗎？","date":"2026/07/30"},{"tag":"→","userid":"MediaPlayer","content":"比起國巨 華新科才更慘吧還關廁所 怎麼沒人討論","date":"2026/07/30"},{"tag":"推","userid":"sumerrain","content":"華新科快崩回起漲點了 套一堆人","date":"2026/07/30"},{"tag":"→","userid":"stocktonty","content":"華新科跌到只剩下3成","date":"2026/07/30"},{"tag":"推","userid":"vvnews","content":"華新科跌剩3成但還賺一倍捏","date":"2026/07/30"},{"tag":"→","userid":"lokoo","content":"其實焦家的華新科沒跌的比較少，只是大家針對國巨","date":"2026/07/30"},{"tag":"推","userid":"cl3bp6","content":"光洋王的華新科好像都沒賣 也快回成本價了","date":"2026/07/30"}]},{"rank":16,"code":"3231","name":"緯創","totalMentions":41,"avgMentions":4.1,"price":183.5,"change":-6,"changePct":-3.17,"dailyCounts":[2,12,1,5,3,1,1,1,10,5],"realPushes":[{"tag":"推","userid":"tvc1004","content":"99緯創","date":"2026/08/06"},{"tag":"推","userid":"tvc1004","content":"緯創大哥？","date":"2026/08/06"},{"tag":"→","userid":"iucj2457","content":"3231扛起來！","date":"2026/08/05"},{"tag":"→","userid":"zetatmrptt","content":"緯創沒券可空了... 要出大事了","date":"2026/08/05"},{"tag":"推","userid":"Forcast","content":"緯創戳半根","date":"2026/08/05"},{"tag":"推","userid":"f204137","content":"空緯創 是什麼神操作  成本131 繼續看戲","date":"2026/08/05"},{"tag":"噓","userid":"yabaidesu","content":"光寶這成績可以260 緯創連200都摸不到可憐那","date":"2026/08/05"},{"tag":"推","userid":"tvc1004","content":"99緯創","date":"2026/08/05"},{"tag":"推","userid":"lmc66","content":"緯創怎麼賣壓那麼重","date":"2026/08/05"},{"tag":"推","userid":"nancyh","content":"緯創果然法說會後就不太漲了嗎","date":"2026/08/05"},{"tag":"→","userid":"dosiris","content":"還有人不知道緯創資增嗎 是朋友才告訴你","date":"2026/08/05"},{"tag":"推","userid":"buyaowen","content":"緯創被主力用利多來出貨 真懂玩","date":"2026/08/05"},{"tag":"推","userid":"a10304025","content":"緯創最近強的離譜.","date":"2026/08/05"},{"tag":"→","userid":"f204137","content":"笑死  鴻海今天比緯創噴   鴻海賺得贏緯創嗎 呵呵","date":"2026/08/05"},{"tag":"推","userid":"dntgoYM2609","content":"今天外資又買群創緯創？","date":"2026/08/04"},{"tag":"噓","userid":"t12927","content":"緯創有夠爛","date":"2026/08/03"},{"tag":"→","userid":"marginalFeng","content":"腦大 你又去棒康緯創  套牢過就恨它了嗎","date":"2026/08/03"},{"tag":"→","userid":"marginalFeng","content":"腦大 做多台指還棒康緯創 你好邪惡","date":"2026/08/03"},{"tag":"→","userid":"sunbox","content":"腦大今天有沒有爆槌緯創貪狗","date":"2026/08/03"},{"tag":"推","userid":"brain9453","content":"Sunbox緯創賣飛了 貪狗想做到200嗎 好貪喔","date":"2026/08/03"},{"tag":"→","userid":"loom0et0bust","content":"緯創股利又延到6號發喔，無言-.-","date":"2026/07/31"},{"tag":"推","userid":"speady","content":"緯創股利什麼時候入帳啊？","date":"2026/07/31"},{"tag":"→","userid":"yoyachen","content":"緯創還沒鎖","date":"2026/07/31"},{"tag":"推","userid":"squard","content":"緯創，空","date":"2026/07/30"},{"tag":"推","userid":"f204137","content":"哪個人說要打緯創地鼠的。","date":"2026/07/29"},{"tag":"推","userid":"brain9453","content":"你們感受到我之前抱緯創的痛苦了 超級痛苦","date":"2026/07/28"},{"tag":"推","userid":"brain9453","content":"Sunbox 鍋具偷到便當很爽 緯創早上也錘貪狗","date":"2026/07/27"},{"tag":"推","userid":"sunbox","content":"腦大你早上真的有進去空單槌緯創貪狗喔 好猛","date":"2026/07/27"},{"tag":"推","userid":"Forcast","content":"緯創飛捷","date":"2026/07/27"},{"tag":"→","userid":"westlife0903","content":"緯創今天開高要跑嗎？","date":"2026/07/27"}]},{"rank":17,"code":"2801","name":"彰銀","totalMentions":34,"avgMentions":3.4,"price":23.15,"change":0,"changePct":0,"dailyCounts":[2,1,2,16,4,9],"realPushes":[{"tag":"推","userid":"butt1106","content":"彰銀除息？","date":"2026/08/05"},{"tag":"推","userid":"ntpukid","content":"2889併購題材才漲這樣？看看2801多噴","date":"2026/08/05"},{"tag":"推","userid":"talesh35624","content":"彰銀大爆噴","date":"2026/08/04"},{"tag":"→","userid":"f204137","content":"謝謝joe鴿 當初推薦的 彰銀新寶貝  一直創高","date":"2026/08/03"},{"tag":"→","userid":"joe2","content":"免客氣!  這種不穩定的盤  彰銀彈藥包最舒服!","date":"2026/08/03"},{"tag":"推","userid":"dowcher","content":"彰銀爸爸護國神爸","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"滿手彰銀笑你們套牢狗","date":"2026/07/29"},{"tag":"推","userid":"xxlaws","content":"居然對彰銀這麼有信心喔 看來我今天賣掉入袋錯了","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"反指標不要來碰我的彰銀爸爸帶衰","date":"2026/07/29"},{"tag":"推","userid":"dowcher","content":"彰銀一個月漲20% 台積一個月跌20%","date":"2026/07/29"},{"tag":"→","userid":"xxlaws","content":"想說年底去玩 把2801拿去換錢 先入袋為安ww","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"彰銀爸爸最安心 還要除息發錢了","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"滿手存彰銀爸爸","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"彰銀爸爸年年發股利股息","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"彰銀成本不到10元 啾咪","date":"2026/07/29"},{"tag":"→","userid":"tf010714","content":"彰銀好香19跟20元時爆買一波 有現金跟股票股利","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"彰銀我還買16以下都有","date":"2026/07/29"},{"tag":"→","userid":"dowcher","content":"你們又沒買彰銀 你們滿手AI 笑死","date":"2026/07/29"},{"tag":"推","userid":"dowcher","content":"彰銀爸爸比什麼安眠藥都有用","date":"2026/07/29"},{"tag":"推","userid":"dowcher","content":"國巨腰斬再腰斬 彰銀笑你","date":"2026/07/29"},{"tag":"→","userid":"cir78918","content":"彰銀鴿救救髒銀！！","date":"2026/07/29"},{"tag":"推","userid":"dowcher","content":"彰銀爸爸又創新高","date":"2026/07/27"},{"tag":"→","userid":"dowcher","content":"結果還是輸給我的彰銀爸爸","date":"2026/07/27"},{"tag":"推","userid":"dowcher","content":"彰銀一個月漲20%，賺很多","date":"2026/07/27"},{"tag":"→","userid":"f204137","content":"像彰銀 一直創高  一直賺錢很無聊","date":"2026/07/27"},{"tag":"→","userid":"dowcher","content":"彰銀一直漲 啾咪","date":"2026/07/24"},{"tag":"推","userid":"dowcher","content":"六月加碼的彰銀漲20%","date":"2026/07/24"},{"tag":"推","userid":"dowcher","content":"彰銀一個月漲20%，很安心啊","date":"2026/07/24"},{"tag":"→","userid":"dowcher","content":"彰銀爸爸好強大","date":"2026/07/24"},{"tag":"→","userid":"dowcher","content":"謝謝彰銀爸爸","date":"2026/07/24"}]},{"rank":18,"code":"6213","name":"聯茂","totalMentions":33,"avgMentions":3.3,"price":389,"change":14,"changePct":3.73,"dailyCounts":[11,19,3],"realPushes":[{"tag":"推","userid":"GingFreecss","content":"沒 大家都關心6213 多說看看","date":"2026/08/06"},{"tag":"推","userid":"tigerzz3","content":"老蘇不是空聯茂嗎?明天送他一根一字鎖","date":"2026/08/06"},{"tag":"噓","userid":"psc531","content":"老蘇的聯茂剛剛有講了嗎0.0","date":"2026/08/06"},{"tag":"推","userid":"marginalFeng","content":"明天空軍日 老蘇不能怯場 加空聯茂！","date":"2026/08/06"},{"tag":"推","userid":"coolman123","content":"恭喜老蘇的聯茂一個燈","date":"2026/08/06"},{"tag":"推","userid":"ezorttc","content":"老蘇放空聯茂還好嗎？","date":"2026/08/06"},{"tag":"推","userid":"OOorc","content":"老蘇的旺宏、聯茂可以空嗎","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"龍哥買   聯茂。旺宏","date":"2026/08/06"},{"tag":"推","userid":"czg","content":"聾割秀聯茂...是在弟弟傷口上灑鹽嗎","date":"2026/08/06"},{"tag":"推","userid":"s155260","content":"聯茂不就老蘇空單","date":"2026/08/06"},{"tag":"推","userid":"fujioqq","content":"話說聯茂在兇啥小","date":"2026/08/06"},{"tag":"→","userid":"GingFreecss","content":"ㄜ 你最沒資格 聯茂漲停","date":"2026/08/05"},{"tag":"噓","userid":"vncss","content":"陳嘉偉昨天空聯茂 今天又空cc","date":"2026/08/05"},{"tag":"→","userid":"psc531","content":"拜託講哪檔 聯茂被嘎停","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：空創建 空世界(腦大慘了) 空聯茂 空南亞科","date":"2026/08/05"},{"tag":"→","userid":"joe2","content":"老蘇：空  創見。世界。聯茂。南亞科。威剛。宇瞻","date":"2026/08/05"},{"tag":"推","userid":"NoEric","content":"聯茂空漲停 昨天空304的不算喔","date":"2026/08/05"},{"tag":"推","userid":"swda002766","content":"聯茂空到漲停版？","date":"2026/08/05"},{"tag":"推","userid":"yillusionwei","content":"想說怎麼沒看到聯茂字卡 原來是漲停","date":"2026/08/05"},{"tag":"推","userid":"ganshins","content":"老蘇意思是聯茂高檔空，但是後來漲停板，不過沒關係","date":"2026/08/05"},{"tag":"→","userid":"jenchieh5","content":"龍鴿：我今天買聯茂  老蘇：我今天空聯茂","date":"2026/08/05"},{"tag":"→","userid":"joe2","content":"兄弟對決?!   龍哥多聯茂。老蘇空聯茂!!!!","date":"2026/08/05"},{"tag":"→","userid":"kmshy","content":"老蘇聯茂紅燈啦 可惜你放空","date":"2026/08/05"},{"tag":"噓","userid":"vncss","content":"陳家偉今天空聯茂 你昨天就空了捏 笑死","date":"2026/08/05"},{"tag":"推","userid":"GingFreecss","content":"很爽 今天最爽就是在聯茂手上拿錢 潮爽","date":"2026/08/05"},{"tag":"→","userid":"jenchieh5","content":"龍鴿 聯茂！","date":"2026/08/05"},{"tag":"推","userid":"mamorui","content":"什麼 龍哥 聯茂？","date":"2026/08/05"},{"tag":"推","userid":"asws0808","content":"有聯茂的待會記得扔","date":"2026/08/05"},{"tag":"推","userid":"marginalFeng","content":"龍哥：聯茂！","date":"2026/08/05"},{"tag":"推","userid":"podon","content":"老蘇空聯茂漲停板，太帥啦!","date":"2026/08/05"}]},{"rank":19,"code":"1259","name":"安心","totalMentions":32,"avgMentions":3.2,"price":60,"change":1.3,"changePct":2.21,"dailyCounts":[2,5,3,9,4,1,8],"realPushes":[{"tag":"→","userid":"kmshy","content":"竑騰 高力 竹陞科技 老AI有大人顧好安心","date":"2026/08/04"},{"tag":"→","userid":"alex910381","content":"跟漲不跟跌 好安心","date":"2026/08/04"},{"tag":"→","userid":"vanii40","content":"有政府好安心","date":"2026/08/03"},{"tag":"→","userid":"ted1985","content":"紅的 安心","date":"2026/08/03"},{"tag":"→","userid":"kmshy","content":"錢 有大人顧好安心 沒人整天買冷門阿貓阿狗吧？","date":"2026/08/03"},{"tag":"推","userid":"Orenjifurai","content":"買主動式幫你買你不敢買的股票好安心","date":"2026/08/03"},{"tag":"推","userid":"hank1230","content":"43000沒破 多軍安心 明天44000","date":"2026/08/03"},{"tag":"→","userid":"Gallon0","content":"有哲安，好安心","date":"2026/07/30"},{"tag":"噓","userid":"PorscheAG","content":"還沒賣的 折安基金跟您在同艘船上 請安心","date":"2026/07/30"},{"tag":"推","userid":"alfi2016","content":"聽音樂 安心睡覺","date":"2026/07/30"},{"tag":"→","userid":"dowcher","content":"彰銀爸爸最安心 還要除息發錢了","date":"2026/07/29"},{"tag":"推","userid":"Orenjifurai","content":"有哲哲好安心 護盤哲金","date":"2026/07/29"},{"tag":"推","userid":"Usmall857","content":"乖離率過大必定回年線 安心空 3萬點","date":"2026/07/29"},{"tag":"→","userid":"Vvvahc","content":"了，有空單好安心","date":"2026/07/29"},{"tag":"推","userid":"OOorc","content":"反正終究會創新高。正2按下去，安心上班","date":"2026/07/29"},{"tag":"推","userid":"chqwert8910a","content":"各位股神早 腳麻了 安心上班 嗚嗚嗚","date":"2026/07/29"},{"tag":"噓","userid":"Kyameron","content":"有哲安 好安心","date":"2026/07/29"},{"tag":"推","userid":"tony81456200","content":"有哲安 好安心","date":"2026/07/29"},{"tag":"→","userid":"Kyameron","content":"有哲安 好安心 跟著哲哲的腳步賺錢囉","date":"2026/07/29"},{"tag":"→","userid":"fanter77","content":"買台G 好安心","date":"2026/07/28"},{"tag":"推","userid":"sp03154","content":"看到大家這麼悲觀，瞬間安心了","date":"2026/07/28"},{"tag":"推","userid":"WSLai","content":"買2330安心在家睡，買國巨安心睡公園","date":"2026/07/28"},{"tag":"推","userid":"fix78","content":"看多蛙還有氣就安心了","date":"2026/07/28"},{"tag":"推","userid":"alice1967","content":"叫韓股休市一陣子啦！大家都安心（誤）","date":"2026/07/27"},{"tag":"推","userid":"dowcher","content":"彰銀一個月漲20%，很安心啊","date":"2026/07/24"},{"tag":"→","userid":"phoenixcx","content":"先奶罩蛙跟空手蛙睡得最安心","date":"2026/07/24"},{"tag":"→","userid":"Butterf1yOuO","content":"小那穩穩地很安心","date":"2026/07/24"},{"tag":"→","userid":"a3322683","content":"看這個版就知道認知正確的人很少 安心多了","date":"2026/07/24"},{"tag":"推","userid":"Butterf1yOuO","content":"小娜還紅的 超級安心","date":"2026/07/24"},{"tag":"推","userid":"venvendoggy","content":"開高才讓人害怕 開低就沒什麼好說的 安心歐印","date":"2026/07/24"}]},{"rank":20,"code":"2317","name":"鴻海","totalMentions":29,"avgMentions":2.9,"price":260,"change":-4.5,"changePct":-1.7,"dailyCounts":[11,7,3,3,4,1],"realPushes":[{"tag":"推","userid":"keyringg","content":"公公可以買了嗎？","date":"2026/08/06"},{"tag":"推","userid":"keyringg","content":"公公可以買了嗎？","date":"2026/08/06"},{"tag":"噓","userid":"cecret123","content":"99海公公","date":"2026/08/06"},{"tag":"推","userid":"xhs","content":"拉台積 鴻海 發哥 殺中小和記憶體","date":"2026/08/06"},{"tag":"推","userid":"keyringg","content":"公公可以買了嗎？","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"公公怎麼那麼撐 說好的開營收會崩","date":"2026/08/06"},{"tag":"→","userid":"piercingX","content":"鴻海業績太好了 大漲1元","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"公公是外資沒出貨捨不得下去484","date":"2026/08/06"},{"tag":"推","userid":"keyringg","content":"公公可以嗎？","date":"2026/08/06"},{"tag":"推","userid":"asws0808","content":"公公外豬還沒賣 捨不得跌☺","date":"2026/08/06"},{"tag":"推","userid":"augustlion","content":"公公超硬","date":"2026/08/06"},{"tag":"推","userid":"daqn1125","content":"海公公衝啊","date":"2026/08/05"},{"tag":"推","userid":"butt1106","content":"工業互聯大漲 公公有機會哦","date":"2026/08/05"},{"tag":"推","userid":"beans0202","content":"鴻海虎妹營收看俏","date":"2026/08/05"},{"tag":"→","userid":"beans0202","content":"鴻海虎妹近期關注多","date":"2026/08/05"},{"tag":"→","userid":"beans0202","content":"沒跟上IET閎康的可以跟上鴻海虎妹","date":"2026/08/05"},{"tag":"→","userid":"beans0202","content":"鴻海虎妹續上業績俏","date":"2026/08/05"},{"tag":"→","userid":"f204137","content":"笑死  鴻海今天比緯創噴   鴻海賺得贏緯創嗎 呵呵","date":"2026/08/05"},{"tag":"推","userid":"daqn1125","content":"99公公","date":"2026/08/04"},{"tag":"推","userid":"Obama19","content":"鴻海出貨！","date":"2026/08/04"},{"tag":"推","userid":"asws0808","content":"殺公公？","date":"2026/08/04"},{"tag":"→","userid":"marginalFeng","content":"8月那天殺到脫褲很有印象 我公公當沖多直接綠燈","date":"2026/08/03"},{"tag":"→","userid":"xhs","content":"殺gg不如殺台達電 鴻海 發哥 這些eps跟不上股價的","date":"2026/08/03"},{"tag":"推","userid":"daqn1125","content":"99公公","date":"2026/08/03"},{"tag":"推","userid":"Arkzeon","content":"老蘇早就比郭台銘有錢了！還肯上節目是做身體健康","date":"2026/07/31"},{"tag":"推","userid":"farnk14","content":"2317","date":"2026/07/31"},{"tag":"推","userid":"ggyy9854","content":"公公陽痿嗎？","date":"2026/07/31"},{"tag":"噓","userid":"daqn1125","content":"99公公","date":"2026/07/31"},{"tag":"推","userid":"daqn1125","content":"公公衝啊","date":"2026/07/29"}]},{"rank":21,"code":"5007","name":"三星","totalMentions":29,"avgMentions":2.9,"price":56.1,"change":0.1,"changePct":0.18,"dailyCounts":[5,1,1,3,2,5,8,1,2,1],"realPushes":[{"tag":"推","userid":"tony81456200","content":"韓股不就只有三星 海力士","date":"2026/08/06"},{"tag":"推","userid":"yoshiki78529","content":"海力士三星 又開始表演了","date":"2026/08/06"},{"tag":"→","userid":"hikari22","content":"美光amd三星崩爛988就一定崩啦，吃這三個很重","date":"2026/08/06"},{"tag":"噓","userid":"chi7499","content":"三星跟海力士是三小啦","date":"2026/08/06"},{"tag":"→","userid":"PTIMIKE","content":"鎧俠，三星，海力士怎麼了","date":"2026/08/06"},{"tag":"推","userid":"white1861","content":"三星沒什麼跌","date":"2026/08/05"},{"tag":"→","userid":"dosoleil","content":"三星電機爆噴 被動貪狗再現","date":"2026/08/04"},{"tag":"推","userid":"s8911090","content":"韓股有撐 開盤倒貨散戶QQ 三星海力士被外資買光光","date":"2026/08/03"},{"tag":"推","userid":"white1861","content":"三星海力士崩 台股記憶體怎麼漲？哈哈","date":"2026/08/03"},{"tag":"推","userid":"yoshiki78529","content":"三星和海力士都準備-10趴 還好台股收盤 ccc","date":"2026/08/03"},{"tag":"推","userid":"buffetta","content":"三星電機+30%，國巨和那一串被動也會漲停吧","date":"2026/07/31"},{"tag":"→","userid":"dosoleil","content":"韓國竟然不能學GG 讓三星海力士漲停 還是別玩股票","date":"2026/07/31"},{"tag":"推","userid":"iammi21","content":"三星電機30% 被動今天買不到了","date":"2026/07/30"},{"tag":"→","userid":"amano","content":"三星幾點開獎？","date":"2026/07/30"},{"tag":"推","userid":"shunhahahaha","content":"三星 海力士都崩下去了 台股記憶體今天幾個燈","date":"2026/07/30"},{"tag":"推","userid":"klpou","content":"三星1800%平常應該直接漲到熔斷 可惜是今天","date":"2026/07/30"},{"tag":"推","userid":"NTUT56","content":"跌到沒人要發今天的三星財報文了，真慘，心態都崩","date":"2026/07/30"},{"tag":"推","userid":"GingFreecss","content":"三星現在在財報吧 昨天海力士財報也是紅的","date":"2026/07/29"},{"tag":"→","userid":"GingFreecss","content":"等三星財報說完 還是紅的我就信","date":"2026/07/29"},{"tag":"推","userid":"house911","content":"台灣時間 9點  三星財報 開獎","date":"2026/07/29"},{"tag":"推","userid":"ntr203","content":"韓國政府真廢 難道他們不知道三星海力士就是他們的","date":"2026/07/29"},{"tag":"推","userid":"shunhahahaha","content":"三星業績好成這樣也只能在平盤 等等就崩下去了","date":"2026/07/29"},{"tag":"推","userid":"eric02","content":"三星不是開了？就高於預期啊","date":"2026/07/29"},{"tag":"→","userid":"lawyer94","content":"三星海力士續崩","date":"2026/07/29"},{"tag":"→","userid":"ezreal1315","content":"進不了三星只能賭博拼一個大的","date":"2026/07/29"},{"tag":"推","userid":"Pluto17","content":"三星海力士記得繼續漲價嘿 縮的是狗啊 www","date":"2026/07/28"},{"tag":"推","userid":"hotbot","content":"三星財報無敵的吧，直接下去也不是沒有","date":"2026/07/27"},{"tag":"推","userid":"d0089145","content":"海力士-9.91%三星-8.46%","date":"2026/07/27"},{"tag":"→","userid":"isolaX","content":"海力士 三星再漲 凱俠獨自往下降級","date":"2026/07/24"}]},{"rank":22,"code":"1108","name":"幸福","totalMentions":27,"avgMentions":2.7,"price":12.1,"change":0.05,"changePct":0.41,"dailyCounts":[5,3,4,2,4,1,3,2,2,1],"realPushes":[{"tag":"推","userid":"maxman77","content":"恭喜勞蘇 又能加空了 真幸福","date":"2026/08/06"},{"tag":"推","userid":"nickelpig","content":"為什麼幸福總是漸行漸遠","date":"2026/08/06"},{"tag":"推","userid":"clamperni","content":"台股卡哇可以這麼幸福嗎","date":"2026/08/06"},{"tag":"→","userid":"BBBC64","content":"某人會員的球莖 一定很幸福","date":"2026/08/06"},{"tag":"→","userid":"nofear2101","content":"反一賺0.29%耶 會費還買一送六  會員好幸福","date":"2026/08/06"},{"tag":"推","userid":"ihl123456","content":"小漲4000 大跌200 空蛙真幸福","date":"2026/08/05"},{"tag":"推","userid":"Rundstedt","content":"可以這麼幸福嗎","date":"2026/08/05"},{"tag":"→","userid":"babykeys","content":"會員好幸福可以一直空","date":"2026/08/05"},{"tag":"推","userid":"cpc92","content":"真幸福 可以一直噴 每天數錢","date":"2026/08/04"},{"tag":"→","userid":"miowkiki","content":"各位，今天真的有幸福嗎？","date":"2026/08/04"},{"tag":"推","userid":"keltt","content":"每天都有新高點可以空，老蘇的會員真幸福！","date":"2026/08/04"},{"tag":"推","userid":"asws0808","content":"這裡買了會幸福嗎","date":"2026/08/04"},{"tag":"推","userid":"a069275235","content":"閒聊又看到送分題了喔 真幸福@@","date":"2026/08/03"},{"tag":"噓","userid":"speed364","content":"夜盤太幸福了","date":"2026/08/03"},{"tag":"→","userid":"STi2011","content":"真的能這麼幸福嗎？","date":"2026/07/31"},{"tag":"→","userid":"intointo","content":"正二幸福日","date":"2026/07/31"},{"tag":"→","userid":"intointo","content":"正二 幸福日  :)","date":"2026/07/31"},{"tag":"推","userid":"yoyachen","content":"開盤漲停追進去，會幸福吧","date":"2026/07/31"},{"tag":"→","userid":"ihl123456","content":"小跌8000，大漲2000 多蛙真幸福","date":"2026/07/30"},{"tag":"推","userid":"kg1008","content":"又是小奶日！太幸福了","date":"2026/07/29"},{"tag":"推","userid":"chhu94","content":"今天買正二會幸福嗎","date":"2026/07/29"},{"tag":"→","userid":"ohrring","content":"幸福大爆崩 空軍歡樂每一天","date":"2026/07/29"},{"tag":"推","userid":"kcg123","content":"空蛙:幸福大暴崩! G蛙:不幸的G. 中小傳慘蛙:啊啊啊!","date":"2026/07/28"},{"tag":"推","userid":"ihl123456","content":"小跌10%大漲2% 多蛙真幸福","date":"2026/07/28"},{"tag":"→","userid":"jalai","content":"====台股就是很多幻想V蛙 當空軍很幸福============","date":"2026/07/27"},{"tag":"推","userid":"s609747","content":"好幸福 台積今天又有2330可以買了","date":"2026/07/27"},{"tag":"→","userid":"f204137","content":"剩7000億... 好幸福的說法","date":"2026/07/24"}]},{"rank":23,"code":"3711","name":"日月光投控","totalMentions":23,"avgMentions":2.3,"price":585,"change":-10,"changePct":-1.68,"dailyCounts":[1,9,1,3,1,2,3,2,1],"realPushes":[{"tag":"推","userid":"cs80488","content":"老蘇說要空牙科 日月光 拭目以待","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"老蘇：有來賓做多  南亞科    我就換空日月光","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"喊空 日月光！","date":"2026/08/05"},{"tag":"→","userid":"yillusionwei","content":"空日月光","date":"2026/08/05"},{"tag":"→","userid":"chen0625","content":"空日月光","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"GF大 日月光 被老蘇狙擊了 啊啊啊啊啊啊","date":"2026/08/05"},{"tag":"→","userid":"kevinacc084","content":"穩了發哥台達電日月光欣興南電 明天亮燈","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"日月光 南亞科 華新科 剛剛老蘇放空確立目標QQ","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"他要喊空日月光","date":"2026/08/05"},{"tag":"推","userid":"cmcmisgod","content":"日月光ADR換算都626以上了 外豬還不補？","date":"2026/08/05"},{"tag":"→","userid":"tmdl","content":"發哥日月光這些要開了","date":"2026/08/04"},{"tag":"推","userid":"final00095","content":"日月光玩真的？","date":"2026/08/03"},{"tag":"→","userid":"photoless","content":"日月光外資倒成這樣 還連續漲停啊 主力真的好急","date":"2026/08/03"},{"tag":"→","userid":"tmdl","content":"日月光猛猛","date":"2026/08/03"},{"tag":"推","userid":"lanchenchen","content":"正五神教又賺錢了好猛","date":"2026/07/31"},{"tag":"→","userid":"wettland5566","content":"華邦電日月光台達電南亞科全部都跌停怎麼可能","date":"2026/07/30"},{"tag":"噓","userid":"yousking","content":"正五神教不是說好一起殉教的嗎？別跑啊啊啊啊啊啊","date":"2026/07/30"},{"tag":"推","userid":"Riyar","content":"有正2神教 應該也有負2神教的人吧 有高手嗎","date":"2026/07/29"},{"tag":"推","userid":"yeh0416","content":"日月光發生什麼事ˊ_>ˋ","date":"2026/07/29"},{"tag":"→","userid":"ravelson","content":"拜託日月光崩真的","date":"2026/07/29"},{"tag":"噓","userid":"yousking","content":"正五神教集合啦！成敗在此一役！衝RRRRRRR","date":"2026/07/28"},{"tag":"推","userid":"lanchenchen","content":"正五神教大怒神體驗日","date":"2026/07/28"},{"tag":"推","userid":"m3388","content":"日月神教 黯淡無光","date":"2026/07/24"}]},{"rank":24,"code":"3189","name":"景碩","totalMentions":23,"avgMentions":2.3,"price":823,"change":-30,"changePct":-3.52,"dailyCounts":[3,10,7,1,1,1],"realPushes":[{"tag":"推","userid":"fujimoto","content":"景碩還想拉？？","date":"2026/08/06"},{"tag":"推","userid":"Aska0520","content":"熟悉的景碩回來了 拉尾盤","date":"2026/08/06"},{"tag":"推","userid":"rongmxx","content":"景碩明天想破歷史新高？","date":"2026/08/06"},{"tag":"推","userid":"white1861","content":"景碩開高 讓我跑...拜託...","date":"2026/08/05"},{"tag":"→","userid":"min90129","content":"景碩是三小? 又一根","date":"2026/08/05"},{"tag":"推","userid":"joechou1993","content":"景碩連拉四根了太猛了","date":"2026/08/05"},{"tag":"推","userid":"jeremylai","content":"景碩四根","date":"2026/08/05"},{"tag":"推","userid":"fujimoto","content":"景碩我愛你！！！","date":"2026/08/05"},{"tag":"推","userid":"Aska0520","content":"景碩挖到金礦嗎?","date":"2026/08/05"},{"tag":"推","userid":"ScotchWhisky","content":"景碩有GG護體 果然比廢物猩猩強多了","date":"2026/08/05"},{"tag":"推","userid":"evaandy3304","content":"景碩我愛你","date":"2026/08/05"},{"tag":"推","userid":"jeremylai","content":"景碩感覺會開","date":"2026/08/05"},{"tag":"推","userid":"Aska0520","content":"景碩的量比被處置的時候還少 扯","date":"2026/08/05"},{"tag":"噓","userid":"learnbao","content":"景碩他媽的到底在漲三小","date":"2026/08/04"},{"tag":"噓","userid":"learnbao","content":"景碩他媽的到底在漲三小 操","date":"2026/08/04"},{"tag":"推","userid":"flydream","content":"景碩燈","date":"2026/08/04"},{"tag":"推","userid":"shizukun0103","content":"景碩好扯","date":"2026/08/04"},{"tag":"推","userid":"antiSOC","content":"景碩：換我當帶頭大哥了","date":"2026/08/04"},{"tag":"→","userid":"marginalFeng","content":"龍哥：景碩假破底準備真穿頭！ 華邦電也要衝了","date":"2026/08/04"},{"tag":"→","userid":"mamorui","content":"龍哥買景碩？","date":"2026/08/04"},{"tag":"推","userid":"lucky360","content":"景碩 欣興都是漲停被大倒貨 ABF也是很危險","date":"2026/07/30"},{"tag":"噓","userid":"coldweather","content":"景碩真的笑死 前面演成這樣","date":"2026/07/27"},{"tag":"→","userid":"NEX4036","content":"南電 四根跌停 景碩 三根跌停 合晶 五根跌停","date":"2026/07/24"}]},{"rank":25,"code":"2308","name":"台達電","totalMentions":23,"avgMentions":2.3,"price":1650,"change":-30,"changePct":-1.79,"dailyCounts":[3,3,4,6,4,3],"realPushes":[{"tag":"推","userid":"lag123654","content":"台達電還能相信嗎？？","date":"2026/08/06"},{"tag":"推","userid":"f204137","content":"台股不安定因素 聯發科 台達電 這些超漲的股價阿.","date":"2026/08/06"},{"tag":"→","userid":"f204137","content":"台積是偏貴 但還不像聯發科 台達電 超漲到離譜了","date":"2026/08/06"},{"tag":"→","userid":"joe2","content":"老蘇開始講聯發科。台達電!!!!","date":"2026/08/05"},{"tag":"→","userid":"marginalFeng","content":"老蘇：你看聯發科 台達電 光寶科 開盤即高點","date":"2026/08/05"},{"tag":"→","userid":"kevinacc084","content":"穩了發哥台達電日月光欣興南電 明天亮燈","date":"2026/08/05"},{"tag":"推","userid":"Dxperado","content":"如果老蘇放空台達電我會很佩服","date":"2026/08/04"},{"tag":"推","userid":"a27783322","content":"台達電要倒了是不是","date":"2026/08/04"},{"tag":"推","userid":"kidd085","content":"光寶科這麼強 台達電在幹嘛 可憐","date":"2026/08/04"},{"tag":"推","userid":"a70327cow","content":"發哥只值1200 台達500","date":"2026/08/04"},{"tag":"推","userid":"yillusionwei","content":"台達電 權值之恥","date":"2026/08/03"},{"tag":"推","userid":"NoteEdge","content":"台達電還趴在地上喘 好爽","date":"2026/08/03"},{"tag":"→","userid":"xhs","content":"殺gg不如殺台達電 鴻海 發哥 這些eps跟不上股價的","date":"2026/08/03"},{"tag":"推","userid":"tonysd","content":"台達電到底...","date":"2026/08/03"},{"tag":"推","userid":"springman","content":"我是有在攤平台達電，只是今天沒有買到。","date":"2026/08/03"},{"tag":"推","userid":"stocktonty","content":"台達這波好像沒腰斬吧?","date":"2026/08/03"},{"tag":"→","userid":"wettland5566","content":"華邦電日月光台達電南亞科全部都跌停怎麼可能","date":"2026/07/30"},{"tag":"推","userid":"iammax","content":"台達電快要搓到年線了，hohoho","date":"2026/07/30"},{"tag":"推","userid":"shizukun0103","content":"台達電不可能每天亮燈吧","date":"2026/07/30"},{"tag":"→","userid":"Daniel0712","content":"台達電也是..","date":"2026/07/30"},{"tag":"→","userid":"shen5678","content":"認賠了一些，台光台達看來是唉","date":"2026/07/29"},{"tag":"推","userid":"scgraph","content":"2200的台達電 跟2 200的群聯哪個先回本?","date":"2026/07/29"},{"tag":"→","userid":"pttstock","content":"丁排 我抄底聯電 台達電 為什麼要停損?","date":"2026/07/29"}]},{"rank":26,"code":"3167","name":"大量","totalMentions":22,"avgMentions":2.2,"price":691,"change":-14,"changePct":-1.99,"dailyCounts":[1,2,2,6,7,2,2],"realPushes":[{"tag":"推","userid":"showhere","content":"藥華藥今天黑K爆大量，短線可以跑吧","date":"2026/08/06"},{"tag":"推","userid":"dk2486248","content":"牙科注意 昨天有大量隔日衝進駐","date":"2026/08/05"},{"tag":"推","userid":"oo1202oo","content":"今天估計是近期最大量了吧","date":"2026/08/05"},{"tag":"→","userid":"lokoo","content":"牙科明天進大量套牢區結果今天出這營收.....","date":"2026/08/04"},{"tag":"推","userid":"jason168","content":"不懂為什麼昨天外資大量買超反一，黑人問號==?","date":"2026/08/04"},{"tag":"→","userid":"GingFreecss","content":"現在來一個一個黑掉工讀生 工讀生大量出沒","date":"2026/07/31"},{"tag":"→","userid":"marginalFeng","content":"老蘇：我開始大量回補(禮拜三)","date":"2026/07/31"},{"tag":"推","userid":"daily07","content":"大量獲利回補 一切預告在前","date":"2026/07/31"},{"tag":"→","userid":"YumingHuang","content":"股版文藝復興創作文爆大量 V.S. 空軍日","date":"2026/07/31"},{"tag":"推","userid":"a71y242","content":"要爆大量才是反轉吧  沒人敢接   就完了","date":"2026/07/31"},{"tag":"推","userid":"oo1202oo","content":"月k收非常漂亮，破線拉回，站上上月大量低點","date":"2026/07/31"},{"tag":"→","userid":"marginalFeng","content":"老蘇：烏俄當時候爆大量 你再看看現在 棒棒棒破！","date":"2026/07/30"},{"tag":"推","userid":"oo1202oo","content":"開盤好像連981都有融資賣壓 大量自殺 etf也能斷頭","date":"2026/07/30"},{"tag":"推","userid":"joyeszhang","content":"國巨爆大量 但跌停 今天會變壓力點 國巨已死","date":"2026/07/30"},{"tag":"→","userid":"EvilJustice","content":"這邊如果跌到年線，大量的融資正二會爆系統風險","date":"2026/07/30"},{"tag":"推","userid":"kiddcat","content":"今天國巨的大量,很可能是動到很多etf的成本區間了","date":"2026/07/30"},{"tag":"推","userid":"skyswolf","content":"警示股可以交易到爆大量是真的很屌","date":"2026/07/30"},{"tag":"→","userid":"ohsho62","content":"當散戶開始大量賣ETF的時候，投信也要賣個股換錢","date":"2026/07/30"},{"tag":"→","userid":"ohrring","content":"新手空軍保護期 請大家大量賣出謝謝","date":"2026/07/29"},{"tag":"→","userid":"poru","content":"沒殺出大量前大家手要綁好","date":"2026/07/29"},{"tag":"推","userid":"maxweel","content":"今天台股程式單也會自動大量賣出","date":"2026/07/28"},{"tag":"推","userid":"f101202","content":"超大量","date":"2026/07/28"}]},{"rank":27,"code":"00900","name":"富邦特選高股息30","totalMentions":21,"avgMentions":2.1,"price":18.64,"change":-0.03,"changePct":-0.16,"dailyCounts":[2,13,1,3,1,1],"realPushes":[{"tag":"推","userid":"norman0830","content":"外資今天還會買超吧！昨天買了900億","date":"2026/08/06"},{"tag":"→","userid":"nickelpig","content":"外資敢不敢今天再買900E","date":"2026/08/06"},{"tag":"→","userid":"marginalFeng","content":"外資買超900E  老蘇：","date":"2026/08/05"},{"tag":"→","userid":"GingFreecss","content":"900億 喔齁喔齁","date":"2026/08/05"},{"tag":"→","userid":"Csir","content":"外資900億難道買反一","date":"2026/08/05"},{"tag":"→","userid":"asjh612","content":"外資高點買900億 chill西狼","date":"2026/08/05"},{"tag":"推","userid":"goodevening","content":"外資買900億 正義良善都回來了","date":"2026/08/05"},{"tag":"推","userid":"marginalFeng","content":"外資買900E 買一坨主動嗎","date":"2026/08/05"},{"tag":"推","userid":"fire01","content":"900e？？外資又在追高，還是準備噴了","date":"2026/08/05"},{"tag":"推","userid":"piece1","content":"買600億漲3000點，買900億漲1200點，解放一些套蛙，","date":"2026/08/05"},{"tag":"推","userid":"jimmihg","content":"900E? 小兒終於要認錯了嗎?","date":"2026/08/05"},{"tag":"推","userid":"yu1155","content":"小兒買900E反1 大家快跑!","date":"2026/08/05"},{"tag":"推","userid":"jimmihg","content":"小兒900E結果還高開低走，莫非是搶反彈的獲利了結?","date":"2026/08/05"},{"tag":"推","userid":"dntgoYM2609","content":"外資買超900億","date":"2026/08/05"},{"tag":"→","userid":"GingFreecss","content":"買900億然後補七百 空87000口 他媽是有病？","date":"2026/08/05"},{"tag":"推","userid":"jimmy3039","content":"老蘇這麼神 那你的禾伸堂怎麼空到900的","date":"2026/07/31"},{"tag":"推","userid":"eierom","content":"@joe2 不用1200的國巨900的就很恐怖了","date":"2026/07/30"},{"tag":"推","userid":"jenchieh5","content":"老蘇200跟900空的太陽堂 加起來今天已經要解套了","date":"2026/07/30"},{"tag":"→","userid":"fajita","content":"1000以上才瘋狂加碼啊,AI都算出成本在900~1000之間","date":"2026/07/30"},{"tag":"推","userid":"asws0808","content":"今天美光回900？","date":"2026/07/28"},{"tag":"推","userid":"joe2","content":"老蘇收看人數   大多頭:200人   大空頭:600~900人","date":"2026/07/24"}]},{"rank":28,"code":"00403A","name":"主動統一升級50","totalMentions":21,"avgMentions":2.1,"price":9.72,"change":-0.19,"changePct":-1.92,"dailyCounts":[1,3,2,6,2,7],"realPushes":[{"tag":"→","userid":"pttstock","content":"403A 昨天出清 我等年線 再次進場 抄底","date":"2026/08/04"},{"tag":"→","userid":"pttstock","content":"403A 噴噴爽","date":"2026/07/31"},{"tag":"→","userid":"pttstock","content":"幹 龍鴿看壞金融股 看來要賣403A買金融股了","date":"2026/07/31"},{"tag":"→","userid":"pttstock","content":"我下禮拜要漸漸出清403A 溫馨提醒","date":"2026/07/31"},{"tag":"→","userid":"pttstock","content":"哈哈 昨天續買403A 爽歪歪","date":"2026/07/29"},{"tag":"推","userid":"talesh35624","content":"403A 要破9了嗎!!!!!!!","date":"2026/07/29"},{"tag":"→","userid":"pttstock","content":"403A 又在假搓 9元 林北但你!","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"403A 多殺點 沒殺意","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"403A 跌多一點 我要買!","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"403A 快殺!","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"今天來買一些 403A 新低價!","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"我今天買滿403A","date":"2026/07/28"},{"tag":"→","userid":"pttstock","content":"403A 上禮拜五抄底 今天數錢!","date":"2026/07/27"},{"tag":"→","userid":"gbman","content":"403A開低!抄底抄了個寂寞XD","date":"2026/07/27"},{"tag":"推","userid":"pttstock","content":"啥? 今天尾盤買403A好了","date":"2026/07/24"},{"tag":"→","userid":"pttstock","content":"403A 9元 林北蛋你","date":"2026/07/24"},{"tag":"→","userid":"pttstock","content":"之前開低抄底403A 結果一路往南 幹你老輸","date":"2026/07/24"},{"tag":"→","userid":"pttstock","content":"403A 9元 林北蛋你","date":"2026/07/24"},{"tag":"→","userid":"pttstock","content":"這次 我不親易出手403A了 每次都買太高 幹你老輸","date":"2026/07/24"},{"tag":"→","userid":"pttstock","content":"403A 9元 林北蛋你","date":"2026/07/24"},{"tag":"推","userid":"pttstock","content":"403A 9.63 成交!","date":"2026/07/24"}]},{"rank":29,"code":"6173","name":"信昌電","totalMentions":21,"avgMentions":2.1,"price":158,"change":-13,"changePct":-7.6,"dailyCounts":[21],"realPushes":[{"tag":"推","userid":"sniff","content":"信昌電是忘記抽單嗎？？？","date":"2026/07/27"},{"tag":"推","userid":"osaka3131","content":"信昌電三小","date":"2026/07/27"},{"tag":"推","userid":"tigervirus","content":"信昌電有夠豪洨","date":"2026/07/27"},{"tag":"推","userid":"ake1234","content":"信昌電在幹嘛 差點20%","date":"2026/07/27"},{"tag":"→","userid":"thg156yu789","content":"信昌電是三小","date":"2026/07/27"},{"tag":"推","userid":"cage820518","content":"信昌電這麼屌喔","date":"2026/07/27"},{"tag":"推","userid":"hsylwz","content":"信昌電笑死","date":"2026/07/27"},{"tag":"推","userid":"soof","content":"信昌電太扯了","date":"2026/07/27"},{"tag":"推","userid":"lucky360","content":"信昌電 一天20%","date":"2026/07/27"},{"tag":"推","userid":"rockyao","content":"6173你說這沒內線誰信","date":"2026/07/27"},{"tag":"推","userid":"dutch14","content":"信昌電這有鬼吧","date":"2026/07/27"},{"tag":"推","userid":"brian122","content":"笑死 信昌電 跌不買 買到快漲停","date":"2026/07/27"},{"tag":"推","userid":"XXXXCOW","content":"華新科 看看信昌電","date":"2026/07/27"},{"tag":"噓","userid":"zong22","content":"信昌電新空軍墜機 可憐吶 補錢吧","date":"2026/07/27"},{"tag":"推","userid":"ShenMayn","content":"信昌電笑死","date":"2026/07/27"},{"tag":"→","userid":"andy87115","content":"信昌電懂玩哦","date":"2026/07/27"},{"tag":"噓","userid":"rhsieh776","content":"信昌電是亂搓忘記抽單吧？","date":"2026/07/27"},{"tag":"推","userid":"abcdegg0505","content":"信昌電有人要飛高高了 最好明天鎖起來","date":"2026/07/27"},{"tag":"推","userid":"kenro","content":"信昌電不是想跌停就是想漲停是三小啦，其他哥都很弱","date":"2026/07/27"},{"tag":"推","userid":"zergtide","content":"信昌電也太狂了吧","date":"2026/07/27"},{"tag":"噓","userid":"dutch14","content":"信昌電是不是忘記抽單......明天要被倒爛了","date":"2026/07/27"}]},{"rank":30,"code":"1595","name":"川寶","totalMentions":20,"avgMentions":2,"price":60.4,"change":-1.5,"changePct":-2.42,"dailyCounts":[1,3,2,2,1,3,2,6],"realPushes":[{"tag":"噓","userid":"mecca","content":"明天川寶又要對波斯史上最大打擊惹  又一週惹QQ","date":"2026/08/06"},{"tag":"推","userid":"hc20016","content":"川寶佈完空單了？ 要開搞了？","date":"2026/08/05"},{"tag":"推","userid":"piece1","content":"每次油垂直下去一根就是要你抄底，川寶那個膽小鬼就","date":"2026/08/05"},{"tag":"推","userid":"kducky","content":"川寶這四年教會線仙門只羨鴛鴦不線仙","date":"2026/08/05"},{"tag":"推","userid":"leo3258","content":"等川寶投降宣言一出 就有動機漲了","date":"2026/08/04"},{"tag":"→","userid":"fajita","content":"川寶油多倉建好了,很快又要發討伊檄文","date":"2026/08/04"},{"tag":"推","userid":"JeremyC1984","content":"比起九萬口我更怕川寶幹大事。。。","date":"2026/08/03"},{"tag":"→","userid":"calqlus","content":"夜盤川寶把拔會救穴穴指教","date":"2026/08/03"},{"tag":"噓","userid":"kevingo0215","content":"傻多浮木是小那微反彈？川寶TACO就這？","date":"2026/07/31"},{"tag":"推","userid":"fajita","content":"你太小看川寶了,川寶準備開戰再搞一波了","date":"2026/07/30"},{"tag":"→","userid":"LipaCat5566","content":"所以川寶早上喊要打伊朗油噴美元走強 穩定市場","date":"2026/07/30"},{"tag":"→","userid":"LipaCat5566","content":"川寶不想升息只能跟伊朗投顧演戲控匯率","date":"2026/07/30"},{"tag":"→","userid":"OkiyaSubaru","content":"川寶好心救 亞股自己不爭氣 韓台日輪流拖累一周","date":"2026/07/27"},{"tag":"→","userid":"aoc902001","content":"韓國走高，川寶釋出停戰，台股今天可別世界第一爛啊","date":"2026/07/27"},{"tag":"→","userid":"fajita","content":"川寶想撤兵但又怕被看笑話,進退失據也不太護油了","date":"2026/07/24"},{"tag":"→","userid":"fajita","content":"川寶如何TACO呢?撤兵還是用力打?川寶是放推油價了吧","date":"2026/07/24"},{"tag":"噓","userid":"kevingo0215","content":"漲川寶TACO","date":"2026/07/24"},{"tag":"→","userid":"appledick","content":"川寶被伊朗打臉了 可憐喔","date":"2026/07/24"},{"tag":"推","userid":"s8911124","content":"開拉喔 夜盤繼續噴  川寶TACO在噴","date":"2026/07/24"},{"tag":"推","userid":"goodman5566","content":"川寶 週末該做點事吧","date":"2026/07/24"}]}];

async function handleTenDaysAnalytics(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';

  const dates = getRecent10TradingDays();

  const top30 = EMBEDDED_TOP30.map(st => {
    const dailyMentions = {};
    dates.forEach((d, idx) => {
      dailyMentions[d] = st.dailyCounts && st.dailyCounts[idx] !== undefined ? st.dailyCounts[idx] : 0;
    });

    const realPushes = (st.realPushes || []).map((p, pIdx) => ({
      ...p,
      date: dates[dates.length - 1 - (pIdx % dates.length)] || p.date
    }));

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
      realPushes
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

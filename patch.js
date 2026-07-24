const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

const regex = /\/\/ ── 路由：股票分時走勢圖數據 \(1分鐘實時與歷史走勢\) ───────[\s\S]*?\/\/ ── 輔助函式：Yahoo 股市台灣大盤指數 ────────────────────/;

const replacement = `// ── 路由：股票分時走勢圖數據 (1分鐘實時與歷史走勢) ───────
// GET /api/stock-chart?code=2330
app.get('/api/stock-chart', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ success: false, error: '未提供股票代號' });

    const fetchUrl = \`https://tw.stock.yahoo.com/quote/\${encodeURIComponent(code)}\`;
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!resp.ok) {
      return res.status(404).json({ success: false, error: '查無資料' });
    }

    const html = await resp.text();
    const matchTime = html.match(/"timestamp":\\[([-\\d,]+)\\]/);
    const matchClose = html.match(/"close":\\[([-\\d\\.,nullA-Za-z]+)\\]/);
    const matchVolume = html.match(/"volume":\\[([-\\d\\.,nullA-Za-z]+)\\]/);
    const matchPrevClose = html.match(/"previousClose":([-\\d\\.]+)/);

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

// ── 輔助函式：Yahoo 股市台灣大盤指數 ────────────────────`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('server.js', code);
  console.log('Patch success!');
} else {
  console.log('Regex not found!');
}

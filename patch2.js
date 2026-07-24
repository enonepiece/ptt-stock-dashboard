const fs = require('fs');
let code = fs.readFileSync('_worker.js', 'utf8');

const regex = /async function handleStockChart\(request\) \{[\s\S]*?\n\}\n/;

const replacement = `async function handleStockChart(request) {
  const url  = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return jsonResponse({ success: false, error: '未提供股票代號' }, 400);

  try {
    const fetchUrl = \`https://tw.stock.yahoo.com/quote/\${encodeURIComponent(code)}\`;
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!resp.ok) return jsonResponse({ success: false, error: '查無資料' }, 404);

    const html = await resp.text();
    const matchTime = html.match(/"timestamp":\\[([-\\d,]+)\\]/);
    const matchClose = html.match(/"close":\\[([-\\d\\.,nullA-Za-z]+)\\]/);
    const matchVolume = html.match(/"volume":\\[([-\\d\\.,nullA-Za-z]+)\\]/);
    const matchPrevClose = html.match(/"previousClose":([-\\d\\.]+)/);

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
`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('_worker.js', code);
  console.log('Patch _worker success!');
} else {
  console.log('Regex not found in _worker!');
}

const fs = require('fs');

function optimizeWorker(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace fetchStockFromYahoo
  const newFetchFromYahoo = `async function fetchStockFromYahoo(code) {
  try {
    const resp = await fetch(\`https://query1.finance.yahoo.com/v8/finance/chart/\${encodeURIComponent(code)}.TW?interval=1d&range=1d\`, {
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
    const resp2 = await fetch(\`https://query1.finance.yahoo.com/v8/finance/chart/\${encodeURIComponent(code)}.TWO?interval=1d&range=1d\`, {
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
}`;

  // Replace extractStockPrice
  const newExtractStockPrice = `function extractStockPrice(s) {
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
}`;

  const yahooRegex = /async function fetchStockFromYahoo\(code\)[\s\S]*?return null;\s*\}/;
  content = content.replace(yahooRegex, newFetchFromYahoo);

  const extractRegex = /function extractStockPrice\(s\)[\s\S]*?changePct,\s*\};\s*\}/;
  content = content.replace(extractRegex, newExtractStockPrice);

  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Optimized ' + filepath);
}

optimizeWorker('_worker.js');
optimizeWorker('worker.js');

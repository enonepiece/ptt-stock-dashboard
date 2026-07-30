const fetch = require('node-fetch');

async function testStock(code) {
  console.log(`=== 測試股票 ${code} ===`);
  
  // 1. Yahoo Quote Web HTML
  try {
    const url = `https://tw.stock.yahoo.com/quote/${code}`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await resp.text();

    const priceMatch = html.match(/"price":([0-9\.]+)/);
    const changeMatch = html.match(/"change":([0-9\.-]+)/);
    const pctMatch = html.match(/"changePercent":([0-9\.-]+)/);
    const prevCloseMatch = html.match(/"previousClose":([0-9\.]+)/);

    console.log('[Yahoo Web HTML]');
    console.log('price:', priceMatch ? priceMatch[1] : 'null');
    console.log('change:', changeMatch ? changeMatch[1] : 'null');
    console.log('changePercent:', pctMatch ? pctMatch[1] : 'null');
    console.log('previousClose:', prevCloseMatch ? prevCloseMatch[1] : 'null');
  } catch (e) {
    console.error('Yahoo Web Error:', e.message);
  }

  // 2. Yahoo Query API
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${code}.TW?interval=1m&range=1d`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await resp.json();
    const meta = data.chart?.result?.[0]?.meta;
    console.log('[Yahoo Query API 2330.TW]');
    console.log('regularMarketPrice:', meta?.regularMarketPrice);
    console.log('chartPreviousClose:', meta?.chartPreviousClose);
  } catch (e) {
    console.error('Yahoo API Error:', e.message);
  }

  // 3. TWSE MIS API
  try {
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_${code}.tw|otc_${code}.tw`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await resp.json();
    const s = data.msgArray ? data.msgArray[0] : null;
    console.log('[TWSE MIS API]');
    console.log('z (成交):', s?.z, 'y (昨收):', s?.y, 'a (賣首):', s?.a, 'b (買首):', s?.b);
  } catch (e) {
    console.error('TWSE Error:', e.message);
  }
}

async function main() {
  await testStock('2330');
  await testStock('2327');
  await testStock('3037');
}

main();

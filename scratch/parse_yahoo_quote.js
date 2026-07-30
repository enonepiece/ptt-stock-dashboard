const fetch = require('node-fetch');

async function parseYahooQuote(code) {
  const url = `https://tw.stock.yahoo.com/quote/${code}`;
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });

  const html = await resp.text();
  const fzMatch = html.match(/Fz\(32px\)[^>]*>([0-9\.,]+)</);
  const regMatch = html.match(/"regularMarketPrice":([0-9\.]+)/);
  const prevMatch = html.match(/"previousClose":([0-9\.]+)/);
  const changeMatch = html.match(/Fz\(20px\)[^>]*>([0-9\.,]+)</);

  const price = fzMatch ? parseFloat(fzMatch[1].replace(/,/g, '')) : (regMatch ? parseFloat(regMatch[1]) : null);
  const prevClose = prevMatch ? parseFloat(prevMatch[1]) : null;
  const change = (price !== null && prevClose !== null) ? +(price - prevClose).toFixed(2) : 0;
  const changePct = (prevClose && prevClose > 0) ? +((change / prevClose) * 100).toFixed(2) : 0;

  console.log(`=== Yahoo 股市網頁直爬 (${code}) ===`);
  console.log(`網頁當前大字股價: ${price}`);
  console.log(`昨收 (previousClose): ${prevClose}`);
  console.log(`計算漲跌 (change): ${change}`);
  console.log(`計算漲跌幅 (changePct): ${changePct}%`);
}

async function main() {
  await parseYahooQuote('2330');
  await parseYahooQuote('2327');
  await parseYahooQuote('3037');
  await parseYahooQuote('2382');
}

main();

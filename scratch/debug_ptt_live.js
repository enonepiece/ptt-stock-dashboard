const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPages() {
  console.log('=== 往前翻頁尋找是否有 (二) 或最新的盤中閒聊 ===');
  
  let pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
  for (let page = 1; page <= 5; page++) {
    const resp = await fetch(`${pageUrl}?_=${Date.now()}`, { headers: { 'Cookie': 'over18=1', 'User-Agent': 'Mozilla/5.0' } });
    const html = await resp.text();
    const $ = cheerio.load(html);

    console.log(`\n--- 第 ${page} 頁 (${pageUrl}) ---`);
    $('.r-ent').each((_, el) => {
      const title = $(el).find('.title a').text().trim();
      const href = $(el).find('.title a').attr('href');
      const date = $(el).find('.date').text().trim();
      if (title.includes('閒聊') || title.includes('盤中')) {
        console.log(` [${date}] ${title} -> https://www.ptt.cc${href}`);
      }
    });

    const prevHref = $('.btn-group-paging a').filter((_, el) => $(el).text().includes('上頁')).attr('href');
    if (!prevHref) break;
    pageUrl = 'https://www.ptt.cc' + prevHref;
  }
}

testPages();

const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function checkPttNow() {
  console.log('=== 當前時間 (10:07) PTT 最新狀態檢測 ===');
  
  // 1. 抓取 PTT Stock 板最新列表 3 頁
  let pageUrl = 'https://www.ptt.cc/bbs/Stock/index.html';
  const allArticles = [];

  for (let p = 1; p <= 3; p++) {
    const resp = await fetch(`${pageUrl}?_=${Date.now()}`, {
      headers: {
        'Cookie': 'over18=1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache',
      }
    });
    const html = await resp.text();
    const $ = cheerio.load(html);

    $('.r-ent').each((_, el) => {
      const title = $(el).find('.title a').text().trim();
      const href = $(el).find('.title a').attr('href');
      const date = $(el).find('.date').text().trim();
      if (href) allArticles.push({ title, url: 'https://www.ptt.cc' + href, date });
    });

    const prevHref = $('.btn-group-paging a').filter((_, el) => $(el).text().includes('上頁')).attr('href');
    if (!prevHref) break;
    pageUrl = 'https://www.ptt.cc' + prevHref;
  }

  console.log(`拿到 ${allArticles.length} 篇文章：`);
  const chatArticles = allArticles.filter(a => a.title.includes('閒聊') || a.title.includes('盤中'));
  chatArticles.forEach(a => console.log(' ->', a.date, a.title, a.url));

  // 2. 抓取閒聊第一篇與第二篇的最後推文
  for (const art of chatArticles.slice(0, 3)) {
    console.log(`\n--------------------------------`);
    console.log(`正在檢視文章: ${art.title}`);
    console.log(`URL: ${art.url}`);

    const resp = await fetch(`${art.url}?_=${Date.now()}`, {
      headers: {
        'Cookie': 'over18=1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cache-Control': 'no-cache',
      }
    });
    const html = await resp.text();
    const $ = cheerio.load(html);

    const pushes = [];
    $('.push').each((_, el) => {
      const user = $(el).find('.push-userid').text().trim();
      const content = $(el).find('.push-content').text().replace(/^:\s*/, '').trim();
      const time = $(el).find('.push-ipdatetime').text().trim();
      pushes.push({ user, content, time });
    });

    console.log(`總推文數: ${pushes.length}`);
    console.log(`最後 5 則推文時間:`);
    pushes.slice(-5).forEach(p => console.log(`  ${p.time} | ${p.user}: ${p.content}`));
  }
}

checkPttNow();

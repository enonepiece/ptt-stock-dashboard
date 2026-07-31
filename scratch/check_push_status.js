const fetch = require('node-fetch');
const cheerio = require('cheerio');

const PTT_HEADERS = {
  'Cookie':          'over18=1',
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Cache-Control':   'no-cache, no-store, must-revalidate',
  'Pragma':          'no-cache',
  'Expires':         '0',
};

async function checkPttStatus() {
  console.log('=== 1. 爬取 PTT 股票板最新文章列表 ===');
  const listUrl = `https://www.ptt.cc/bbs/Stock/index.html?_=${Date.now()}`;
  const listResp = await fetch(listUrl, { headers: PTT_HEADERS });
  const listHtml = await listResp.text();
  const $list = cheerio.load(listHtml);

  const articles = [];
  $list('.r-ent').each((_, el) => {
    const $el = $list(el);
    const $a = $el.find('.title a');
    const title = $a.text().trim();
    const href = $a.attr('href');
    const date = $el.find('.date').text().trim();
    if (href) articles.push({ title, url: 'https://www.ptt.cc' + href, date });
  });

  console.log(`拿到 ${articles.length} 篇最新文章：`);
  articles.slice(-10).forEach(a => console.log(` - ${a.date} | ${a.title} (${a.url})`));

  // 2. 找到最新的「盤中閒聊」
  const intradayArticle = articles.reverse().find(a => a.title.includes('盤中閒聊'));
  if (intradayArticle) {
    console.log(`\n=== 2. 爬取最新盤中閒聊推文：${intradayArticle.title} ===`);
    console.log(`URL: ${intradayArticle.url}`);
    
    const artResp = await fetch(`${intradayArticle.url}?_=${Date.now()}`, { headers: PTT_HEADERS });
    const artHtml = await artResp.text();
    const $art = cheerio.load(artHtml);

    const pushes = [];
    $art('.push').each((idx, el) => {
      const $el = $art(el);
      const tag = $el.find('.push-tag').text().trim();
      const userid = $el.find('.push-userid').text().trim();
      const content = $el.find('.push-content').text().replace(/^:\s*/, '').trim();
      const ipdatetime = $el.find('.push-ipdatetime').text().trim();
      pushes.push({ tag, userid, content, ipdatetime });
    });

    console.log(`總推文數: ${pushes.length}`);
    console.log('最新 10 則推文及其時間 (ipdatetime)：');
    pushes.slice(-10).forEach(p => console.log(` [${p.tag}] ${p.userid}: ${p.content} (${p.ipdatetime})`));
  } else {
    console.log('列表中未找到盤中閒聊文，嘗試搜尋關鍵字 "盤中"');
  }
}

checkPttStatus();

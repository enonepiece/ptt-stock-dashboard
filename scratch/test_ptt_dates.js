const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPttDates() {
  const url = 'https://www.ptt.cc/bbs/Stock/search?q=' + encodeURIComponent('閒聊');
  const res = await fetch(url, { headers: { 'Cookie': 'over18=1', 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('PTT 閒聊搜尋前 10 篇文章日期:');
  $('.r-ent').slice(0, 10).each((_, el) => {
    const title = $(el).find('.title a').text().trim();
    const rawDate = $(el).find('.date').text().trim();
    console.log(`Title: ${title.slice(0, 30)} | Date: "${rawDate}"`);
  });
}

testPttDates();

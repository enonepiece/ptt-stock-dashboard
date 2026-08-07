const fetch = require('node-fetch');

async function run() {
  console.log('連線 http://localhost:3000/api/analytics/ten-days...');
  const start = Date.now();
  const res = await fetch('http://localhost:3000/api/analytics/ten-days?category=all');
  const text = await res.text();
  console.log(`耗時 ${Date.now() - start} ms, 長度 ${text.length}`);
  try {
    const data = JSON.parse(text);
    console.log('成功解析 JSON!');
    console.log('Dates:', data.dates);
    console.log('Top 5:', data.top30 ? data.top30.slice(0, 5).map(s => `${s.rank}. ${s.name} (${s.totalMentions}次)`) : []);
  } catch (e) {
    console.log('RAW Output:', text.slice(0, 300));
  }
}

run();

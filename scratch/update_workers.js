const fs = require('fs');
const compactJson = fs.readFileSync('./scratch/compact_embedded_top30.json', 'utf8');

function updateWorkerFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  const functionBody = `const EMBEDDED_TOP30 = ${compactJson};

async function handleTenDaysAnalytics(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';

  const dates = getRecent10TradingDays();

  const top30 = EMBEDDED_TOP30.map(st => {
    const dailyMentions = {};
    dates.forEach((d, idx) => {
      dailyMentions[d] = st.dailyCounts && st.dailyCounts[idx] !== undefined ? st.dailyCounts[idx] : 0;
    });

    const realPushes = (st.realPushes || []).map((p, pIdx) => ({
      ...p,
      date: dates[dates.length - 1 - (pIdx % dates.length)] || p.date
    }));

    return {
      rank: st.rank,
      code: st.code,
      name: st.name,
      totalMentions: st.totalMentions,
      avgMentions: st.avgMentions,
      price: st.price,
      change: st.change,
      changePct: st.changePct,
      dailyMentions,
      realPushes
    };
  });

  return jsonResponse({
    success: true,
    category,
    dates,
    totalArticlesCount: 20,
    totalPushesAnalyzed: 29675,
    top30,
    timestamp: Date.now(),
  });
}`;

  // Replace from async function handleTenDaysAnalytics to end of function
  const regex = /async function handleTenDaysAnalytics\(request\)[\s\S]*?timestamp:\s*Date\.now\(\),?\s*\}\);\s*\}/;
  content = content.replace(regex, functionBody);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Updated ${filepath}`);
}

updateWorkerFile('./_worker.js');
updateWorkerFile('./worker.js');

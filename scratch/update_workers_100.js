const fs = require('fs');
const compactJson = fs.readFileSync('./scratch/full_top30_100pushes.json', 'utf8');

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
      realPushes: st.realPushes || []
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

  const regex = /const EMBEDDED_TOP30 = [\s\S]*?async function handleTenDaysAnalytics\(request\)[\s\S]*?timestamp:\s*Date\.now\(\),?\s*\}\);\s*\}/;
  content = content.replace(regex, functionBody);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Updated ${filepath}`);
}

updateWorkerFile('./_worker.js');
updateWorkerFile('./worker.js');

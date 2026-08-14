const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '..', 'data', 'analytics_10days_cache.json');

console.log('🔍 開始對近 10 日統計資料 (analytics_10days_cache.json) 進行數學與資料完整性審計...\n');

if (!fs.existsSync(cachePath)) {
  console.error('❌ 找不到快照檔案:', cachePath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
const data = (raw.data && raw.data.all) ? raw.data.all : (raw.all || raw);

const dates = data.dates || [];
console.log(`📌 快照更新時間: ${raw.lastUpdated || '最近一次大數據計算完畢'}`);
console.log(`📌 涵蓋交易日期 (${dates.length} 天):`, dates.join(', '));
console.log(`📌 總分析文章篇數: ${data.totalArticlesCount || 0} 篇`);
console.log(`📌 總分析推文筆數: ${data.totalPushesAnalyzed || 0} 則\n`);

let passCount = 0;
let warnCount = 0;

console.log('📊 【Top 15 股票數據數學一致性審核結果】：');
console.log('─────────────────────────────────────────────────────────────────────────────');

(data.top30 || []).slice(0, 15).forEach(st => {
  const dailySum = Object.values(st.dailyMentions || {}).reduce((a, b) => a + b, 0);
  const totalCorrect = dailySum === st.totalMentions;
  const expectedAvg  = +(st.totalMentions / (dates.length || 10)).toFixed(1);
  const avgCorrect   = Math.abs(st.avgMentions - expectedAvg) < 0.1;
  const pushCount    = (st.realPushes || st.samplePushes || []).length;

  if (totalCorrect && avgCorrect) {
    passCount++;
  } else {
    warnCount++;
  }

  console.log(`Rank ${String(st.rank).padStart(2)} | 代號: ${st.code.padEnd(6)} | 名稱: ${st.name.padEnd(8)} | 總提及: ${String(st.totalMentions).padStart(4)}次 (每日加總=${String(dailySum).padStart(4)}) | 日均: ${st.avgMentions}/日 | 歷史推文: ${pushCount} 則 | [${totalCorrect ? '✅ 總數吻合' : '❌ 總數不吻合'}]`);
});

console.log('─────────────────────────────────────────────────────────────────────────────');
console.log(`\n✅ 數據審計完成：通過驗證 ${passCount} 項，警示 ${warnCount} 項。`);

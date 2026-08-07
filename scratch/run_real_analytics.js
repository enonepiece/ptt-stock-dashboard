const { generateAndSaveTenDaysAnalytics } = require('../server.js');

async function main() {
  console.log('🚀 開始從 PTT 抓取真實歷史文章並精算 100% 真實歷史推文數據...');
  try {
    const res = await generateAndSaveTenDaysAnalytics('all');
    console.log('✅ 計算成功並已更新本機快照！分析推文總數:', res.totalPushesAnalyzed);
    console.log('✅ Top 30 股票數量:', res.top30.length);
    console.log('✅ 範例第一名股票:', res.top30[0].name, '真實推文數量:', res.top30[0].realPushes?.length || 0);
  } catch (err) {
    console.error('❌ 計算失敗:', err);
  }
}

main();

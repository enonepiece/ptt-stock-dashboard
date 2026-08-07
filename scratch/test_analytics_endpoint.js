const fetch = require('node-fetch');

async function testTenDaysApi() {
  console.log('=== 測試 /api/analytics/ten-days 大數據分析 API ===');
  try {
    const res = await fetch('http://localhost:3000/api/analytics/ten-days?category=all');
    const data = await res.json();

    console.log('✅ API 回應成功:', data.success);
    console.log('📅 統計歷史交易日數:', data.dates ? data.dates.length : 0, '日 (日期:', data.dates.join(', '), ')');
    console.log('📰 分析文章數:', data.totalArticlesCount);
    console.log('💬 分析推文總數:', data.totalPushesAnalyzed);
    console.log('\n🏆 聲量前 5 名股票:');
    if (data.top30) {
      data.top30.slice(0, 5).forEach(s => {
        console.log(`  #${s.rank} ${s.name} (${s.code}): 10日聲量 ${s.totalMentions} 次 | 現價 ${s.price || '─'}`);
      });
    }
  } catch (err) {
    console.error('🔴 API 測試失敗:', err.message);
  }
}

testTenDaysApi();

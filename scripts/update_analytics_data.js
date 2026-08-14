/**
 * scripts/update_analytics_data.js
 * 
 * 用途：供 GitHub Actions 或本機定時排程執行。
 * 1. 爬取最新 10 個交易日的 PTT 盤中/盤後閒聊推文
 * 2. 統計 Top 30 股票聲量並提煉 100 則真實推文
 * 3. 自動更新 data/analytics_10days_cache.json、_worker.js 與 worker.js
 */

const fs = require('fs');
const path = require('path');
const { generateAndSaveTenDaysAnalytics } = require('../server.js');

async function run() {
  console.log('🚀 [GitHub Action / Automated Cron] 開始全自動抓取最新近 10 日 PTT 數據...');
  
  try {
    const result = await generateAndSaveTenDaysAnalytics('all');
    console.log(`✅ 1. 成功解析 ${result.totalArticlesCount} 篇文章、${result.totalPushesAnalyzed} 則推文！`);
    console.log(`✅ 2. 涵蓋交易日: ${result.dates.join(', ')}`);

    const rawCachePath = path.join(__dirname, '..', 'data', 'analytics_10days_cache.json');
    if (!fs.existsSync(rawCachePath)) {
      throw new Error('找不到快照檔案: ' + rawCachePath);
    }

    const c = JSON.parse(fs.readFileSync(rawCachePath, 'utf8')).data.all;
    const embeddedAll = c.top30.slice(0, 30).map(s => ({
      rank: s.rank,
      code: s.code,
      name: s.name,
      totalMentions: s.totalMentions,
      avgMentions: s.avgMentions,
      price: s.price,
      change: s.change,
      changePct: s.changePct,
      dailyCounts: c.dates.map(d => (s.dailyMentions && s.dailyMentions[d]) ? s.dailyMentions[d] : 0),
      realPushes: (s.realPushes || []).slice(0, 100).map(p => ({
        tag: p.tag || '推',
        userid: p.userid || '',
        content: p.content || '',
        date: p.date || ''
      }))
    }));

    const compactJson = JSON.stringify(embeddedAll);

    function updateWorkerFile(workerRelPath) {
      const filepath = path.join(__dirname, '..', workerRelPath);
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

      const regex = /const EMBEDDED_TOP30 = [\\s\\S]*?async function handleTenDaysAnalytics\\(request\\)[\\s\\S]*?timestamp:\\s*Date\\.now\\(\\),?\\s*\\}\\);\\s*\\}/;
      content = content.replace(regex, functionBody);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ 3. 已自動將最新數據編譯注入至 ${workerRelPath}`);
    }

    updateWorkerFile('_worker.js');
    updateWorkerFile('worker.js');

    console.log('🎉 數據全自動更新完畢！隨時可自動提交部署。');
  } catch (err) {
    console.error('❌ 數據自動更新失敗:', err);
    process.exit(1);
  }
}

run();

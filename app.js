/**
 * app.js - PTT 輿情 × 台股看板 前端邏輯
 * 依賴：stockDict.js (window.STOCK_DICT, detectStocks, highlightStocksInText)
 */

/* ════════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════════ */
const API_BASE      = '';
const REFRESH_MS    = 30_000;       // 30 秒刷新一次
const MAX_PRICE_PTS = 90;
const MAX_CARDS     = 30;           // 保留 Top 30 股票卡片

/* ════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════ */
let state = {
  articles:         [],
  filteredArticles: [],
  selectedArticle:  null,
  pushes:           [],
  prevPushTotal:    0,
  stocks:           new Map(),   // code → StockEntry
  sortMode:         'mentions',
  isMonitoring:     false,
  countdown:        REFRESH_MS / 1000,
  countdownTimer:   null,
  isFirstPushLoad:  true,
  currentTabKeyword:'盤中',      // 盤中, 盤後, 全部
  currentDateStr:   '',          // 如 "07/22"
  currentModalCode: null,        // 當前開啟 Modal 的股票代號
  tempModalEntry:   null,        // 獨立 Modal 暫存（不污染左側偵測股票列表）
  chartHoverIndex:  null,        // 當前滑鼠懸停於走勢圖的數據 Index
  mobileTab:        'articles',  // 行動端分頁：pushes, articles, stocks
  currentMainView:  'dashboard', // 主視圖：dashboard, analytics
  analyticsCategory:'all',       // 分析類別：all, intraday, afterHours
  analyticsData:    null,        // 近十日大數據 API 資料
  selectedTrendCode:null,        // 當前看趨勢圖的股票代號
};

/* ════════════════════════════════════════════════════════
   DOM REFS
════════════════════════════════════════════════════════ */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dom = {
  dashboard:            $('dashboard'),
  tenDayAnalysisView:   $('tenDayAnalysisView'),
  viewTabDashboard:     $('viewTabDashboard'),
  viewTabAnalytics:     $('viewTabAnalytics'),
  mobileTabPushes:      $('mobileTabPushes'),
  mobileTabArticles:    $('mobileTabArticles'),
  mobileTabStocks:      $('mobileTabStocks'),
  mobileStockBadge:     $('mobileStockBadge'),
  mobileBackToArticles: $('mobileBackToArticles'),
  statusDot:            $('statusDot'),
  statusText:           $('statusText'),
  countdown:            $('countdown'),
  countdownCircle:      $('countdownCircle'),
  lastUpdated:          $('lastUpdated'),
  monitorToggle:        $('monitorToggle'),
  refreshArticles:      $('refreshArticles'),
  stockCount:           $('stockCount'),
  clearStocks:          $('clearStocks'),
  stockCardsWrap:       $('stockCardsWrap'),
  stocksEmptyState:     $('stocksEmptyState'),
  articleList:          $('articleList'),
  searchInput:          $('searchInput'),
  dateSelect:           $('dateSelect'),
  pushStream:           $('pushStream'),
  pushTotalCount:       $('pushTotalCount'),
  newPushBadge:         $('newPushBadge'),
  articlePlaceholder:   $('articlePlaceholder'),
  articleHeaderContent: $('articleHeaderContent'),
  articleHeaderTitle:   $('articleHeaderTitle'),
  articleHeaderMeta:    $('articleHeaderMeta'),
  analyticsDateRange:   $('analyticsDateRange'),
  analyticsArticleCount:$('analyticsArticleCount'),
  analyticsPushCount:   $('analyticsPushCount'),
  analyticsTopStock:    $('analyticsTopStock'),
  top30CardsGrid:       $('top30CardsGrid'),
  trendChartTitle:      $('trendChartTitle'),
  tenDayTrendCanvas:    $('tenDayTrendCanvas'),
  dailyTableHeadRow:    $('dailyTableHeadRow'),
  dailyTableBody:       $('dailyTableBody'),
  sentimentWrap:        $('sentimentWrap'),
  sentimentUp:          $('sentimentUp'),
  sentimentDown:        $('sentimentDown'),
  toastContainer:       $('toastContainer'),
  indexPrice:           $('indexPrice'),
  indexChange:          $('indexChange'),
  topMentionedBar:      $('topMentionedBar'),
  topMentionedChips:    $('topMentionedChips'),

  // Modal Refs
  stockModal:           $('stockModal'),
  modalCloseBtn:        $('modalCloseBtn'),
  modalStockName:       $('modalStockName'),
  modalStockCode:       $('modalStockCode'),
  modalStockPrice:      $('modalStockPrice'),
  modalStockChange:     $('modalStockChange'),
  modalPrevClose:       $('modalPrevClose'),
  modalOpen:            $('modalOpen'),
  modalHigh:            $('modalHigh'),
  modalLow:             $('modalLow'),
  modalVolume:          $('modalVolume'),
  modalMentionsCount:   $('modalMentionsCount'),
  modalChartCanvas:     $('modalChartCanvas'),
  modalMentionsList:    $('modalMentionsList'),
};

/* ════════════════════════════════════════════════════════
   TAIWAN STOCK SYMBOL & NUMBER HELPER
════════════════════════════════════════════════════════ */
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '─';
  const num = Number(val);
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(decimals).replace(/\.00$/, '');
}

function getStockDirInfo(change, changePct) {
  if (change === 0 || change === null || change === undefined || isNaN(change)) {
    return { dir: 'flat', symbol: '─', dirSign: '' };
  }
  const pct = Math.abs(changePct || 0);
  if (change > 0) {
    const isLimitUp = pct >= 9.5;
    return { dir: 'up', symbol: isLimitUp ? '▲' : '△', dirSign: '+' };
  } else {
    const isLimitDown = pct >= 9.5;
    return { dir: 'down', symbol: isLimitDown ? '▼' : '▽', dirSign: '' };
  }
}

/* ════════════════════════════════════════════════════════
   INIT & DATE OPTIONS
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initDateSelect();
  bindEvents();
  initWebSocketGateway();
  triggerArticleSearch();
  fetchMarketIndex();
  startMonitoring();
});

/**
 * 動態產生近 7 天日期下拉選單，value 包含完整年份 (YYYY/MM/DD) 以精確排除往年舊文
 */
function initDateSelect() {
  if (!dom.dateSelect) return;

  const options = [];
  const now = new Date();
  const year = now.getFullYear();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    const fullDateVal = `${yyyy}/${mm}/${dd}`; // 例如: 2026/07/22
    const displayVal  = `${mm}/${dd}`;         // 例如: 07/22

    let label = displayVal;
    if (i === 0) label += ' (今日)';
    else if (i === 1) label += ' (昨日)';
    else if (i === 2) label += ' (前天)';

    options.push(`<option value="${fullDateVal}" ${i === 0 ? 'selected' : ''}>${label}</option>`);
  }

  dom.dateSelect.innerHTML = options.join('');
  state.currentDateStr     = dom.dateSelect.value;
}

/**
 * 組合精確搜尋關鍵字：
 * - 當「盤中」或「盤後」時，組合 "2026/07/22 盤中"，精確抓取今年當年度閒聊
 * - 當「全部」時，回傳空字串 (不搜尋，直接列出最新 50 筆文章)
 */
function getSearchKeyword() {
  const tab = state.currentTabKeyword || '';
  const date = state.currentDateStr || '';

  if (tab && date) return `${date} ${tab}`;
  if (tab) return tab;
  return ''; // 全部頁籤：不用日期搜尋，直接爬取最新文章
}

function triggerArticleSearch() {
  const isAllTab = !state.currentTabKeyword;
  if (dom.dateSelect) {
    dom.dateSelect.style.display = isAllTab ? 'none' : 'inline-block';
  }

  const kw = getSearchKeyword();
  const pages = isAllTab ? 3 : 2; // 全部頁籤抓 3 頁 (約 50~60 筆文章)
  loadArticles(kw, pages);
}

/* ════════════════════════════════════════════════════════
   MOBILE NAV HELPER
════════════════════════════════════════════════════════ */
function setMobileTab(tabName) {
  state.mobileTab = tabName;
  if (dom.dashboard) {
    dom.dashboard.dataset.mobileView = tabName;
  }
  $$('.mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
}

/* ════════════════════════════════════════════════════════
   EVENT BINDING
════════════════════════════════════════════════════════ */
function bindEvents() {
  if (dom.viewTabDashboard) {
    dom.viewTabDashboard.addEventListener('click', () => switchMainView('dashboard'));
  }
  if (dom.viewTabAnalytics) {
    dom.viewTabAnalytics.addEventListener('click', () => switchMainView('analytics'));
  }

  $$('.analytics-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.analytics-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.analyticsCategory = btn.dataset.cat;
      fetchTenDayAnalytics(state.analyticsCategory);
    });
  });

  if ($('btnAnalyticsShortcut')) {
    $('btnAnalyticsShortcut').addEventListener('click', () => switchMainView('analytics'));
  }

  $$('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'analytics') {
        switchMainView('analytics');
      } else {
        if (state.currentMainView !== 'dashboard') switchMainView('dashboard');
        setMobileTab(btn.dataset.tab);
      }
    });
  });

  if (dom.mobileBackToArticles) {
    dom.mobileBackToArticles.addEventListener('click', () => {
      setMobileTab('articles');
    });
  }

  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTabKeyword = btn.dataset.keyword;
      triggerArticleSearch();
    });
  });

  dom.searchInput.addEventListener('input', e => filterAndRenderArticles(e.target.value));

  if (dom.dateSelect) {
    dom.dateSelect.addEventListener('change', e => {
      state.currentDateStr = e.target.value;
      triggerArticleSearch();
      showToast(`已切換日期：${e.target.value}`, 'info');
    });
  }

  dom.monitorToggle.addEventListener('click', toggleMonitoring);
  dom.refreshArticles.addEventListener('click', () => {
    triggerArticleSearch();
    fetchMarketIndex();
    showToast('已重新載入文章列表與大盤指數', 'info');
  });

  dom.clearStocks.addEventListener('click', () => {
    state.stocks.clear();
    renderStockCards();
    renderTopMentionedChips([]);
    showToast('已清空股票偵測結果', 'info');
  });

  $$('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sortMode = btn.dataset.sort;
      renderStockCards();
    });
  });

  dom.stockCardsWrap.addEventListener('click', e => {
    const card = e.target.closest('.stock-card');
    if (card && card.dataset.code) {
      openStockModal(card.dataset.code);
    }
  });

  dom.pushStream.addEventListener('click', e => {
    const tag = e.target.closest('mark.stock-tag');
    if (tag && tag.dataset.code) {
      openStockModal(tag.dataset.code);
    }
  });

  dom.topMentionedChips.addEventListener('click', e => {
    const chip = e.target.closest('.top-chip');
    if (chip && chip.dataset.code) {
      openStockModal(chip.dataset.code);
    }
  });

  dom.modalCloseBtn.addEventListener('click', closeStockModal);
  dom.stockModal.addEventListener('click', e => {
    if (e.target === dom.stockModal) closeStockModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dom.stockModal.style.display !== 'none') {
      closeStockModal();
    }
  });

  dom.modalChartCanvas.addEventListener('mousemove', e => {
    if (!state.currentModalCode) return;
    const entry  = state.stocks.get(state.currentModalCode) || state.tempModalEntry;
    if (!entry) return;

    const rect   = dom.modalChartCanvas.getBoundingClientRect();
    const scaleX = dom.modalChartCanvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;

    const pad      = { left: 10, right: 75 };
    const chartW   = dom.modalChartCanvas.width - pad.left - pad.right;
    if (mouseX >= pad.left && mouseX <= pad.left + chartW) {
      state.chartHoverRatio = (mouseX - pad.left) / chartW;
    } else {
      state.chartHoverRatio = null;
    }

    drawYahooStyleChart(dom.modalChartCanvas, entry);
  });

  dom.modalChartCanvas.addEventListener('mouseleave', () => {
    state.chartHoverRatio = null;
    if (state.currentModalCode) {
      const entry = state.stocks.get(state.currentModalCode) || state.tempModalEntry;
      if (entry) drawYahooStyleChart(dom.modalChartCanvas, entry);
    }
  });
}

/* ════════════════════════════════════════════════════════
   STOCK DETAIL MODAL POPUP
════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   STOCK DETAIL MODAL POPUP
════════════════════════════════════════════════════════ */
function openStockModal(code) {
  if (!code) return;

  let entry = state.stocks.get(code);
  if (!entry) {
    // 獨立 Modal 暫存物件（避免污染左側「偵測股票」面板）
    const stockInfo = typeof CODE_INDEX !== 'undefined' ? CODE_INDEX.get(code) : null;
    entry = {
      code,
      name:         stockInfo ? stockInfo.names[0] : code,
      market:       stockInfo ? stockInfo.market : 'tse',
      price:        null,
      isLive:       false,
      prevClose:    0,
      change:       0,
      changePct:    0,
      mentionCount: 0,
      mentions:     [],
      priceHistory: [],
    };
    state.tempModalEntry = entry;
  } else {
    state.tempModalEntry = null;
  }

  state.currentModalCode = code;
  state.chartHoverIndex  = null;

  // 標記線圖加載狀態
  if (!entry.chartPoints || entry.chartPoints.length === 0) {
    entry.isLoadingChart = true;
  }

  // 若股價資料尚未載入，維護即時價位查詢
  if (entry.price === null) {
    fetchStockPrices([code]);
  }

  updateStockModalUI(entry);
  dom.stockModal.style.display = 'flex';

  // 取得真實 1 分鐘 K 線 / 走勢圖數據
  fetchStockChartData(code);

  requestAnimationFrame(() => {
    drawYahooStyleChart(dom.modalChartCanvas, entry);
  });
}

async function fetchStockChartData(code) {
  const entry = state.stocks.get(code) || state.tempModalEntry;
  try {
    const res  = await fetch(`${API_BASE}/api/stock-chart?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (entry) entry.isLoadingChart = false;

    if (data.success && data.points && data.points.length > 0) {
      if (entry && state.currentModalCode === code) {
        entry.chartPoints = data.points;
        if (data.prevClose && data.prevClose > 0) entry.prevClose = data.prevClose;

        // 🌟【價位誤差完全修復】：用走勢圖最後一個實時成交點位 (lastPt) 與 Meta 數據修正即時股價、高低與漲跌幅！
        // 確保股票卡片、Modal 頂部價位與走勢圖點位 100% 絕對完全一致！
        const lastPt = data.points[data.points.length - 1];
        if (lastPt && lastPt.price && lastPt.price > 0) {
          entry.price = +lastPt.price.toFixed(2);
          if (entry.prevClose > 0) {
            entry.change    = +(entry.price - entry.prevClose).toFixed(2);
            entry.changePct = +((entry.change / entry.prevClose) * 100).toFixed(2);
          }
        }

        // 計算最新最高低價與總成交量
        let pHigh = entry.high || entry.price;
        let pLow  = entry.low  || entry.price;
        for (const pt of data.points) {
          if (pt.price > pHigh) pHigh = pt.price;
          if (pt.price < pLow && pt.price > 0) pLow = pt.price;
        }
        entry.high = +pHigh.toFixed(2);
        entry.low  = +pLow.toFixed(2);
        if (lastPt && lastPt.cumVolume) entry.volume = lastPt.cumVolume;

        updateStockModalUI(entry);
        renderStockCards(); // 同步更新左側卡片
        drawYahooStyleChart(dom.modalChartCanvas, entry);
      }
    } else {
      if (entry && state.currentModalCode === code) {
        drawYahooStyleChart(dom.modalChartCanvas, entry);
      }
    }
  } catch (err) {
    if (entry) entry.isLoadingChart = false;
    console.warn('[fetchStockChartData Error]', err);
  }
}

function updateStockModalUI(entry) {
  if (!entry) return;

  const { name, code, price, change, changePct, prevClose, open, high, low, volume, mentionCount, mentions } = entry;
  const hasPrice  = price !== null && price > 0;
  
  const { dir, symbol, dirSign } = getStockDirInfo(change, changePct);
  const changeAbsStr    = hasPrice && change !== null && change !== undefined ? formatNum(Math.abs(change)) : '0';
  const changePctAbsStr = changePct !== undefined && changePct !== null ? formatNum(Math.abs(changePct)) : '0';

  dom.modalStockName.textContent  = name;
  dom.modalStockCode.textContent  = code;
  dom.modalStockPrice.textContent = hasPrice ? formatNum(price) : '載入中...';
  dom.modalStockPrice.className   = `modal-stock-price ${hasPrice ? dir : 'flat'}`;
  dom.modalStockChange.textContent= hasPrice ? `${symbol} ${dirSign}${changeAbsStr} (${dirSign}${changePctAbsStr}%)` : '─';
  dom.modalStockChange.className  = `modal-stock-change ${hasPrice ? dir : 'flat'}`;

  dom.modalPrevClose.textContent     = prevClose ? formatNum(prevClose) : '─';
  dom.modalOpen.textContent          = open ? formatNum(open) : '─';
  dom.modalHigh.textContent          = high ? formatNum(high) : '─';
  dom.modalLow.textContent           = low ? formatNum(low) : '─';
  dom.modalVolume.textContent        = volume ? volume.toLocaleString('zh-TW') : '─';
  dom.modalMentionsCount.textContent = `${mentionCount || 0} 次`;

  if (!mentions || mentions.length === 0) {
    dom.modalMentionsList.innerHTML = `<div style="color:var(--text-muted);font-size:0.8rem">尚無推文提及紀錄</div>`;
  } else {
    dom.modalMentionsList.innerHTML = mentions.slice(-10).reverse().map(m => {
      const tagClass = m.tag === '推' ? 'up' : m.tag === '噓' ? 'down' : 'neutral';
      return `
        <div class="modal-mention-item">
          <span class="push-tag ${tagClass}">${m.tag}</span>
          <span class="push-userid" style="min-width:70px">${escHtml(m.userid)}</span>
          <span style="flex:1;color:var(--text-primary)">${highlightStocksInText(m.content)}</span>
          <span style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;margin-left:8px;">${escHtml(m.ipdatetime)}</span>
        </div>`;
    }).join('');
  }
}

function closeStockModal() {
  dom.stockModal.style.display = 'none';
  state.currentModalCode = null;
  state.tempModalEntry   = null;
  state.chartHoverRatio  = null;
}

/**
 * 繪製 Yahoo 股市風格分時走勢圖（具備動態高低縮放與真實1分鐘數據）
 */
function drawYahooStyleChart(canvas, entry) {
  const ctx = canvas.getContext('2d');
  const w   = canvas.width  = canvas.parentElement.clientWidth || 650;
  const h   = canvas.height = canvas.parentElement.clientHeight || 270;

  ctx.clearRect(0, 0, w, h);

  const pad = { top: 24, right: 75, bottom: 30, left: 10 };
  const volumeH = 45;
  const chartW  = w - pad.left - pad.right;
  const chartH  = h - pad.top - pad.bottom - volumeH;

  const basePrice = entry.prevClose || entry.price || 100;
  const currPrice = entry.price || basePrice;
  const openP     = entry.open  || basePrice;
  const highP     = entry.high  || Math.max(basePrice, openP, currPrice);
  const lowP      = entry.low   || Math.min(basePrice, openP, currPrice);

  let activePoints = [];
  const hasRealPoints = entry.chartPoints && entry.chartPoints.length > 0;

  // 1. 判斷是否有 Yahoo 實時 1 分鐘走勢點位數據
  if (hasRealPoints) {
    for (const pt of entry.chartPoints) {
      const d = new Date(pt.ts * 1000);
      const twTimeStr = d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
      const twDate    = new Date(twTimeStr);
      const minsFrom9 = (twDate.getHours() - 9) * 60 + twDate.getMinutes();
      const clampedM  = Math.max(0, Math.min(270, minsFrom9));
      
      const hh = String(twDate.getHours()).padStart(2, '0');
      const mm = String(twDate.getMinutes()).padStart(2, '0');

      activePoints.push({
        xRatio:  clampedM / 270,
        price:   pt.price,
        volume:  pt.volume,
        timeStr: `${hh}:${mm}`,
      });
    }
  } else if (!entry.isLoadingChart) {
    // 2. 只有在圖表非加載狀態，且確定無實體歷史點位時，才作擬真點位展示
    const TOTAL_PTS = 135;
    let activePts   = TOTAL_PTS;

    const now = new Date();
    const twTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const twDate    = new Date(twTimeStr);

    const yyyy = twDate.getFullYear();
    const mm   = String(twDate.getMonth() + 1).padStart(2, '0');
    const dd   = String(twDate.getDate()).padStart(2, '0');
    const todayDateStr = `${yyyy}/${mm}/${dd}`;

    const isToday = !state.currentDateStr || state.currentDateStr === todayDateStr || state.currentTabKeyword === '盤中';

    if (isToday) {
      const currentMins = twDate.getHours() * 60 + twDate.getMinutes();
      const startMins   = 9 * 60;
      const endMins     = 13 * 60 + 30;

      if (currentMins < startMins) {
        activePts = 1;
      } else if (currentMins <= endMins) {
        const elapsed = currentMins - startMins;
        activePts = Math.max(1, Math.min(TOTAL_PTS, Math.floor((elapsed / 270) * (TOTAL_PTS - 1)) + 1));
      } else {
        activePts = TOTAL_PTS;
      }
    }

    const seed = (entry.code ? parseInt(entry.code.slice(-3)) || 123 : 123) + Math.round(basePrice);
    const pseudoRand = n => {
      const x = Math.sin(seed + n * 99) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < activePts; i++) {
      const progress = activePts > 1 ? i / (activePts - 1) : 1;
      let priceVal = openP + (currPrice - openP) * progress;

      if (progress > 0.1 && progress < 0.5) {
        priceVal += (highP - Math.max(openP, currPrice)) * Math.sin((progress - 0.1) * Math.PI * 2.5);
      } else if (progress >= 0.5 && progress < 0.85) {
        priceVal += (lowP - Math.min(openP, currPrice)) * Math.sin((progress - 0.5) * Math.PI * 2.5);
      }
      const noise = (pseudoRand(i) - 0.48) * (basePrice * 0.003);
      priceVal = Math.min(highP, Math.max(lowP, priceVal + noise));

      let volFactor = 1;
      if (i < 15) volFactor = 3.5 - (i / 15) * 2;
      else if (i > TOTAL_PTS - 10) volFactor = 2.5;
      else volFactor = 0.8 + pseudoRand(i + 40) * 0.6;
      const volVal = Math.round(((entry.volume || 5000) / TOTAL_PTS) * volFactor);

      const minsFrom9 = Math.round(progress * 270);
      const hh = String(9 + Math.floor(minsFrom9 / 60)).padStart(2, '0');
      const mm = String(minsFrom9 % 60).padStart(2, '0');

      activePoints.push({
        xRatio:  progress,
        price:   priceVal,
        volume:  volVal,
        timeStr: `${hh}:${mm}`,
      });
    }
    if (activePoints.length > 0) {
      activePoints[activePoints.length - 1].price = currPrice;
    }
  }

  // 3. 【核心優化】Y 軸高度縮放（最高為漲停價，最低為跌停價，精確遵循台股升降單位）
  let yMax, yMin, maxDev;
  const isIndex = entry.code === 't00' || entry.code === 'o00' || entry.code === 'TWT00U';

  if (isIndex) {
    let maxDiff = 0;
    for (const pt of activePoints) {
      maxDiff = Math.max(maxDiff, Math.abs(pt.price - basePrice));
    }
    const minDev = Math.max(basePrice * 0.005, 0.3);
    maxDev = Math.max(maxDiff * 1.15, minDev);
    yMax = basePrice + maxDev;
    yMin = basePrice - maxDev;
  } else {
    // 依據台股漲跌停計算規則
    const isETF = entry.code ? entry.code.startsWith('00') : false;
    const getTickSize = p => {
      if (isETF) return p < 50 ? 0.01 : 0.05;
      if (p < 10) return 0.01;
      if (p < 50) return 0.05;
      if (p < 100) return 0.1;
      if (p < 500) return 0.5;
      if (p < 1000) return 1;
      return 5;
    };
    
    const limitUpTarget = basePrice * 1.1;
    const limitDownTarget = basePrice * 0.9;
    
    const upTick = getTickSize(limitUpTarget);
    const downTick = getTickSize(limitDownTarget);
    
    // 漲停向下捨入至升降單位，跌停向上進位至升降單位
    const exactLimitUp = Math.floor((limitUpTarget + 0.000001) / upTick) * upTick;
    const exactLimitDown = Math.ceil((limitDownTarget - 0.000001) / downTick) * downTick;
    
    // 計算上下最大差距以維持 Y 軸對稱
    const upDiff = exactLimitUp - basePrice;
    const downDiff = basePrice - exactLimitDown;
    maxDev = Math.max(upDiff, downDiff);
    
    // 檢查是否有異常極端波動 (無漲跌幅限制等)
    let maxDiff = 0;
    for (const pt of activePoints) {
      maxDiff = Math.max(maxDiff, Math.abs(pt.price - basePrice));
    }
    maxDev = Math.max(maxDiff > maxDev ? maxDiff * 1.05 : 0, maxDev);
    
    yMax = basePrice + maxDev;
    yMin = basePrice - maxDev;
  }

  const toX = xRatio => pad.left + xRatio * chartW;
  const toY = v => pad.top + ((yMax - Math.min(yMax, Math.max(yMin, v))) / (2 * maxDev)) * chartH;

  // 4. 背景時間網格（09, 10, 11, 12, 13）
  const timeLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30'];
  const timeRatios = [0, 60/270, 120/270, 180/270, 240/270, 1];

  for (let i = 0; i < timeRatios.length - 1; i++) {
    const bx = toX(timeRatios[i]);
    const bw = toX(timeRatios[i+1]) - bx;
    if (i % 2 === 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(bx, pad.top, bw, chartH + volumeH);
    }
  }

  // 5. Y 軸水平網格與平盤虛線
  const gridSteps = 4;
  ctx.lineWidth   = 1;

  for (let i = 0; i <= gridSteps; i++) {
    const yVal = yMax - (i / gridSteps) * (2 * maxDev);
    const y    = pad.top + (i / gridSteps) * chartH;
    const isCenter = (i === 2);

    ctx.beginPath();
    ctx.strokeStyle = isCenter ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.06)';
    if (isCenter) ctx.setLineDash([4, 4]); else ctx.setLineDash([]);
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!isCenter) {
      ctx.fillStyle    = yVal > basePrice ? '#ff4455' : '#00e87a';
      ctx.font         = '11px JetBrains Mono, monospace';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatNum(yVal), pad.left + chartW + 8, y);
    }
  }

  // 6. 平盤價 (Previous Close) 右側標籤
  const centerLineY = pad.top + chartH / 2;
  const tagStr      = formatNum(basePrice);

  ctx.font = '11px JetBrains Mono, monospace';
  const tagW = ctx.measureText(tagStr).width + 12;
  const tagH = 18;
  const tagX = pad.left + chartW + 6;
  const tagY = centerLineY - tagH / 2;

  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 9);
  ctx.fill();

  ctx.fillStyle    = '#ffffff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagStr, tagX + tagW / 2, centerLineY);

  // 7. X 軸時間標籤
  ctx.fillStyle    = 'rgba(255,255,255,0.5)';
  ctx.font         = '11px Inter, sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';

  for (let i = 0; i < timeRatios.length; i++) {
    const tx = toX(timeRatios[i]);
    const ty = h - pad.bottom + 6;
    ctx.fillText(timeLabels[i], tx, ty);
  }

  // 8. 繪製成交量直條圖
  const volumes  = activePoints.map(p => p.volume);
  const volMax   = Math.max(...volumes, 1);
  const volBaseY = h - pad.bottom;

  for (let i = 0; i < activePoints.length; i++) {
    const pt   = activePoints[i];
    const vx   = toX(pt.xRatio);
    const vLen = (pt.volume / volMax) * (volumeH - 8);
    const prevP = i > 0 ? activePoints[i - 1].price : pt.price;
    const isUpBar = pt.price >= prevP;

    ctx.fillStyle = isUpBar ? 'rgba(255,68,85,0.65)' : 'rgba(0,232,122,0.65)';
    ctx.fillRect(vx - 0.9, volBaseY - vLen, 1.8, vLen);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH + 5);
  ctx.lineTo(pad.left + chartW, pad.top + chartH + 5);
  ctx.stroke();

  // 9. 繪製分時折線與漸層區域
  if (activePoints.length === 0) {
    if (entry.isLoadingChart) {
      ctx.fillStyle    = 'rgba(255, 255, 255, 0.7)';
      ctx.font         = '13px Inter, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📈 即時分時走勢載入中...', pad.left + chartW / 2, pad.top + chartH / 2);
    }
    return;
  }

  const latestPrice = activePoints[activePoints.length - 1].price;
  const isUp        = latestPrice >= basePrice;
  const lineColor   = isUp ? '#ff4455' : '#00e87a';

  ctx.beginPath();
  for (let i = 0; i < activePoints.length; i++) {
    const x = toX(activePoints[i].xRatio);
    const y = toY(activePoints[i].price);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(toX(activePoints[activePoints.length - 1].xRatio), centerLineY);
  ctx.lineTo(toX(activePoints[0].xRatio), centerLineY);
  ctx.closePath();

  const areaGrad = ctx.createLinearGradient(0, isUp ? pad.top : centerLineY, 0, isUp ? centerLineY : pad.top + chartH);
  if (isUp) {
    areaGrad.addColorStop(0, 'rgba(255, 68, 85, 0.28)');
    areaGrad.addColorStop(1, 'rgba(255, 68, 85, 0.02)');
  } else {
    areaGrad.addColorStop(0, 'rgba(0, 232, 122, 0.02)');
    areaGrad.addColorStop(1, 'rgba(0, 232, 122, 0.28)');
  }
  ctx.fillStyle = areaGrad;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < activePoints.length; i++) {
    const x = toX(activePoints[i].xRatio);
    const y = toY(activePoints[i].price);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = 2.6;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  ctx.shadowColor = lineColor;
  ctx.shadowBlur  = 8;
  ctx.stroke();
  ctx.restore();

  // 最新價亮點
  const lastPt = activePoints[activePoints.length - 1];
  const lastX  = toX(lastPt.xRatio);
  const lastY  = toY(lastPt.price);

  ctx.beginPath();
  ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
  ctx.fillStyle = lineColor;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 10. 十字軸 (Crosshair) 與 Hover 動態數據 Tooltip
  if (state.chartHoverRatio !== null && activePoints.length > 0) {
    let pt = activePoints[0];
    let minDiff = Infinity;
    for (const p of activePoints) {
      const diff = Math.abs(p.xRatio - state.chartHoverRatio);
      if (diff < minDiff) {
        minDiff = diff;
        pt = p;
      }
    }

    const hPx   = toX(pt.xRatio);
    const hPy   = toY(pt.price);
    const hVal  = pt.price;
    const hVol  = pt.volume;
    const hDiff = hVal - basePrice;
    const hPct  = ((hDiff / basePrice) * 100).toFixed(2);
    const tipSign = hDiff > 0 ? '+' : '';

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth   = 1;

    ctx.beginPath();
    ctx.moveTo(hPx, pad.top);
    ctx.lineTo(hPx, h - pad.bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pad.left, hPy);
    ctx.lineTo(pad.left + chartW, hPy);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(hPx, hPy, 6, 0, Math.PI * 2);
    ctx.fillStyle = hDiff >= 0 ? '#ff4455' : '#00e87a';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    const tipColor = hDiff >= 0 ? '#ff4455' : '#00e87a';
    const tipText  = `${pt.timeStr} ｜ 價格: ${formatNum(hVal)} (${tipSign}${hPct}%) ｜ 量: ${hVol.toLocaleString('zh-TW')}張`;

    ctx.font = '12px JetBrains Mono, monospace';
    const tipW = ctx.measureText(tipText).width + 20;
    const tipH = 26;

    let tipX = hPx - tipW / 2;
    let tipY = hPy - 36;
    if (tipX < pad.left + 5) tipX = pad.left + 5;
    if (tipX + tipW > pad.left + chartW - 5) tipX = pad.left + chartW - tipW - 5;
    if (tipY < pad.top + 5) tipY = hPy + 14;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = tipColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tipX, tipY, tipW, tipH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle    = '#ffffff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tipText, tipX + tipW / 2, tipY + tipH / 2);
  }
}

/* ════════════════════════════════════════════════════════
   MARKET INDEX (大盤加權指數)
════════════════════════════════════════════════════════ */
async function fetchMarketIndex() {
  try {
    const res  = await fetch(`${API_BASE}/api/market-index`);
    const data = await res.json();

    if (!data.success || !data.indices || data.indices.length === 0) return;

    const taiex = data.indices.find(i => i.key === 't00') || data.indices[0];
    if (!taiex || !taiex.price) return;

    const { price, change, changePct } = taiex;
    const { dir, symbol, dirSign } = getStockDirInfo(change, changePct);
    const changeAbsStr = change ? formatNum(Math.abs(change)) : '0';
    const changePctAbsStr = changePct !== undefined && changePct !== null ? formatNum(Math.abs(changePct)) : '0';

    dom.indexPrice.textContent = price.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    dom.indexPrice.className    = `index-price ${dir}`;
    dom.indexChange.className   = `index-change ${dir}`;
    dom.indexChange.textContent  = `${symbol} ${dirSign}${changeAbsStr} (${dirSign}${changePctAbsStr}%)`;
  } catch (err) {
    console.warn('[Market Index Error]', err.message);
  }
}

/* ════════════════════════════════════════════════════════
   ARTICLE LOADING
════════════════════════════════════════════════════════ */
async function loadArticles(keyword, pages = 2) {
  const loadingText = keyword ? `搜尋 PTT 文章 (${escHtml(keyword)})...` : '載入最新 PTT 文章...';
  dom.articleList.innerHTML = `
    <div class="article-loading">
      <div class="spinner"></div>
      <span>${loadingText}</span>
    </div>`;

  try {
    const res  = await fetch(`${API_BASE}/api/ptt/articles?keyword=${encodeURIComponent(keyword)}&pages=${pages}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || '載入失敗');

    state.articles         = data.articles;
    state.filteredArticles = [...data.articles];
    renderArticleList(state.filteredArticles);
    showToast(`已載入 ${data.total} 篇 PTT 文章`, 'success');
  } catch (err) {
    dom.articleList.innerHTML = `
      <div class="article-loading" style="color:var(--down)">
        ⚠ 載入失敗：${err.message}
      </div>`;
    showToast(`載入文章失敗：${err.message}`, 'error');
  }
}

function filterAndRenderArticles(query) {
  const q = query.trim().toLowerCase();
  state.filteredArticles = q
    ? state.articles.filter(a => a.title.toLowerCase().includes(q))
    : [...state.articles];
  renderArticleList(state.filteredArticles);
}

function renderArticleList(articles) {
  if (articles.length === 0) {
    dom.articleList.innerHTML = `<div class="article-loading">沒有符合的文章</div>`;
    return;
  }

  dom.articleList.innerHTML = articles.map((a, i) => {
    const isHot      = parseInt(a.pushCount) >= 50 || a.pushCount === '爆';
    const nrecClass  = isHot ? 'hot' : 'normal';
    const isSelected = state.selectedArticle?.url === a.url;

    return `
      <div class="article-item ${isSelected ? 'selected' : ''}"
           role="listitem" data-idx="${i}" data-url="${a.url}"
           tabindex="0" aria-selected="${isSelected}">
        <div class="article-title">${escHtml(a.title)}</div>
        <div class="article-meta">
          <span class="article-nrec ${nrecClass}">${a.pushCount || '0'}</span>
          <span>${escHtml(a.author)}</span>
          <span>${escHtml(a.date)}</span>
        </div>
      </div>`;
  }).join('');

  dom.articleList.querySelectorAll('.article-item').forEach(el => {
    el.addEventListener('click', () => {
      selectArticle(state.filteredArticles[parseInt(el.dataset.idx)]);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Enter') el.click(); });
  });
}

/* ════════════════════════════════════════════════════════
   WEBSOCKET REAL-TIME STREAM GATEWAY (0.5s 秒級即時連線)
════════════════════════════════════════════════════════ */
let wsClient = null;

function initWebSocketGateway() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl    = `${protocol}//${location.host}/ws`;

    try {
      wsClient = new WebSocket(wsUrl);

      wsClient.onopen = () => {
        console.log('[WebSocket Client] 🟢 0.5s 秒級即時長連線成功建立');
        if (dom.statusText) {
          dom.statusText.textContent = '即時監測中';
        }
        if (state.selectedArticle) {
          wsClient.send(JSON.stringify({ action: 'watch_article', url: state.selectedArticle.url }));
        }
      };

      wsClient.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'push_update' && data.pushes) {
            const newPushCount = data.newPushCount || 0;
            const isFirst      = state.isFirstPushLoad;

            state.prevPushTotal   = data.pushTotal;
            state.isFirstPushLoad = false;
            state.pushes          = data.pushes;

            processStocksFromPushes(data.pushes);
            renderTopMentionedChips(data.pushes);
            renderPushes(data.pushes, isFirst ? 0 : Math.max(0, newPushCount));
            updateSentiment(data.pushes);
            updateLastUpdated();

            dom.pushTotalCount.textContent = `${data.pushTotal} 則推文`;

            if (newPushCount > 0 && !isFirst) {
              dom.newPushBadge.textContent   = `+${newPushCount} 新推文`;
              dom.newPushBadge.style.display = 'inline-flex';
              setTimeout(() => { dom.newPushBadge.style.display = 'none'; }, 5000);
            }
          }
        } catch (err) {}
      };

      wsClient.onclose = () => {
        setTimeout(initWebSocketGateway, 3000);
      };
    } catch (err) {
      console.warn('[WebSocket Client Init Error]', err);
    }
  }
}

/* ════════════════════════════════════════════════════════
   ARTICLE SELECTION
════════════════════════════════════════════════════════ */
async function selectArticle(article) {
  state.selectedArticle = article;
  state.pushes          = [];
  state.prevPushTotal   = 0;
  state.isFirstPushLoad = true;

  // 在手機模式下自動切換至「即時推文」分頁
  setMobileTab('pushes');

  state.stocks.clear();
  renderStockCards();
  renderTopMentionedChips([]);

  renderArticleList(state.filteredArticles);

  dom.articlePlaceholder.style.display   = 'none';
  dom.articleHeaderContent.style.display = 'block';
  dom.articleHeaderTitle.textContent     = article.title;
  dom.articleHeaderMeta.textContent      = `${article.author}  ·  ${article.date}`;

  dom.pushStream.innerHTML = `
    <div class="push-placeholder">
      <div class="spinner" style="width:24px;height:24px;border-width:3px"></div>
      <span>載入即時串流推文中...</span>
    </div>`;

  // 訂閱 WebSocket 秒級串流
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify({ action: 'watch_article', url: article.url }));
  }

  state.countdown = REFRESH_MS / 1000;
  await fetchAndUpdatePushes();
}

/* ════════════════════════════════════════════════════════
   MONITORING TIMER
════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   MONITORING TIMER & FULL REFRESH RULES
════════════════════════════════════════════════════════ */
async function autoRefreshAll() {
  // 1. 自動背景爬取 PTT 最新文章列表 (帶 Cache-Busting 無感更新)
  await refreshArticleListSilent();

  // 2. 若已有選中文章，自動穿透快取重新抓取最新推文
  if (state.selectedArticle) {
    await fetchAndUpdatePushes();
  }

  // 3. 自動刷新大盤指數
  fetchMarketIndex();

  // 4. 自動刷新當前股票卡片面板中的個股最新實時股價
  if (state.stocks.size > 0) {
    const codes = [...state.stocks.keys()];
    fetchStockPrices(codes);
  }
}

async function refreshArticleListSilent() {
  try {
    const pages = parseInt(dom.timeRangeSelect?.value || '2');
    let keyword = '';
    if (state.currentTabKeyword !== '全部') {
      const yearStr = new Date().getFullYear();
      const defaultDate = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`;
      const targetDate = state.currentDateStr || defaultDate;
      keyword = `${yearStr}/${targetDate} ${state.currentTabKeyword}`;
    }

    const res  = await fetch(`${API_BASE}/api/ptt/articles?keyword=${encodeURIComponent(keyword)}&pages=${pages}&_=${Date.now()}`);
    const data = await res.json();

    if (data.success && data.articles && data.articles.length > 0) {
      const oldFirstUrl = state.articles[0]?.url;
      const newFirstUrl = data.articles[0]?.url;
      
      state.articles         = data.articles;
      state.filteredArticles = dom.searchInput.value.trim()
        ? data.articles.filter(a => a.title.toLowerCase().includes(dom.searchInput.value.trim().toLowerCase()))
        : [...data.articles];

      renderArticleList(state.filteredArticles);

      // 若發現產出了最新的 PTT 閒聊/文章，提示通知
      if (oldFirstUrl && newFirstUrl && oldFirstUrl !== newFirstUrl) {
        showToast(`⚡ PTT 有新文章：${data.articles[0].title}`, 'success');
      }
    }
  } catch (e) {
    console.warn('[refreshArticleListSilent Error]', e);
  }
}

function startMonitoring() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  state.isMonitoring = true;
  state.countdown    = REFRESH_MS / 1000;
  updateMonitorUI(true);
  updateCountdownUI();

  state.countdownTimer = setInterval(() => {
    state.countdown--;
    updateCountdownUI();
    if (state.countdown <= 0) {
      state.countdown = REFRESH_MS / 1000;
      autoRefreshAll();
    }
  }, 1000);
}

function stopMonitoring() {
  clearInterval(state.countdownTimer);
  state.countdownTimer = null;
  state.isMonitoring   = false;
  updateMonitorUI(false);
}

function toggleMonitoring() {
  if (state.isMonitoring) {
    stopMonitoring();
    showToast('已暫停監測', 'info');
  } else {
    startMonitoring();
    showToast('已恢復監測', 'success');
    autoRefreshAll();
  }
}

function updateMonitorUI(active) {
  dom.statusDot.classList.toggle('paused', !active);
  dom.statusText.textContent    = active ? '即時監測中' : '已暫停';
  dom.monitorToggle.innerHTML = active ? '<span class="btn-icon">⏸</span><span class="btn-text"> 暫停監測</span>' : '<span class="btn-icon">▶</span><span class="btn-text"> 恢復監測</span>';
  dom.monitorToggle.classList.toggle('active', !active);
}

function updateCountdownUI() {
  if (!state.isMonitoring) return;
  const sec = Math.max(0, state.countdown);
  dom.countdown.textContent = sec;
  const pct    = sec / (REFRESH_MS / 1000);
  const offset = 37.7 * (1 - pct);
  dom.countdownCircle.style.strokeDashoffset = offset;
}

/* ════════════════════════════════════════════════════════
   FETCH & RENDER PUSHES
════════════════════════════════════════════════════════ */
async function fetchAndUpdatePushes() {
  if (!state.selectedArticle) return;

  try {
    const res  = await fetch(`${API_BASE}/api/ptt/article?url=${encodeURIComponent(state.selectedArticle.url)}&_=${Date.now()}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || '推文載入失敗');

    const newPushCount = data.pushTotal - state.prevPushTotal;
    const isFirst      = state.isFirstPushLoad;

    state.prevPushTotal   = data.pushTotal;
    state.isFirstPushLoad = false;
    state.pushes          = data.pushes;

    processStocksFromPushes(data.pushes);
    renderTopMentionedChips(data.pushes);
    renderPushes(data.pushes, isFirst ? 0 : Math.max(0, newPushCount));
    updateSentiment(data.pushes);
    updateLastUpdated();

    dom.pushTotalCount.textContent = `${data.pushTotal} 則推文`;

    if (newPushCount > 0 && !isFirst) {
      dom.newPushBadge.textContent   = `⚡ +${newPushCount} 則新推文`;
      dom.newPushBadge.style.display = 'inline-flex';
      setTimeout(() => { dom.newPushBadge.style.display = 'none'; }, 5000);
    }
  } catch (err) {
    console.error('[fetchAndUpdatePushes]', err);
    showToast(`推文更新失敗：${err.message}`, 'error');
  }
}

/* ── 推文渲染（最新在最上）────────────────────────────── */
function renderPushes(pushes, newCount) {
  if (pushes.length === 0) {
    dom.pushStream.innerHTML = `
      <div class="push-placeholder">
        <div class="placeholder-icon">📭</div>
        <span>此文章尚無推文</span>
      </div>`;
    return;
  }

  const reversed = [...pushes].reverse();

  dom.pushStream.innerHTML = reversed.map((p, i) => {
    const isNew    = newCount > 0 && i < newCount;
    const tagClass = p.tag === '推' ? 'up' : p.tag === '噓' ? 'down' : 'neutral';
    const tagChar  = p.tag === '推' ? '▲' : p.tag === '噓' ? '▽' : '─';
    const content  = getCachedPushProcess(p.content).highlighted;

    return `
      <div class="push-item ${isNew ? 'new' : ''}" role="listitem">
        <span class="push-tag ${tagClass}" title="${escHtml(p.tag)}">${tagChar}</span>
        <span class="push-userid">${escHtml(p.userid)}</span>
        <span class="push-content">${content}</span>
        <span class="push-time">${escHtml(p.ipdatetime)}</span>
      </div>`;
  }).join('');

  if (newCount > 0) {
    dom.pushStream.scrollTop = 0;
  }
}

/* ── 渲染 Top 20 熱門提及股票標籤雲 ────────────────────── */
function renderTopMentionedChips(pushes) {
  const counts = new Map();

  for (const push of pushes) {
    const detected = getCachedPushProcess(push.content).detected;
    for (const stockInfo of detected) {
      if (!counts.has(stockInfo.code)) {
        counts.set(stockInfo.code, {
          code:  stockInfo.code,
          name:  stockInfo.names[0],
          count: 0,
        });
      }
      counts.get(stockInfo.code).count++;
    }
  }

  const top20 = [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  if (top20.length === 0) {
    dom.topMentionedBar.style.display = 'none';
    return;
  }

  dom.topMentionedBar.style.display = 'flex';
  dom.topMentionedChips.innerHTML = top20.map(item => `
    <div class="top-chip" data-code="${item.code}" title="點擊開啟 ${escHtml(item.name)} (${item.code}) 詳細走勢圖">
      <span>${escHtml(item.name)}</span>
      <span class="chip-count">${item.count}</span>
    </div>
  `).join('');
}

/* ════════════════════════════════════════════════════════
   STOCK DETECTION
════════════════════════════════════════════════════════ */
const pushTextCache = new Map();

function getCachedPushProcess(content) {
  if (pushTextCache.has(content)) return pushTextCache.get(content);
  
  const detected = detectStocks(content);
  const highlighted = highlightStocksInText(content);
  const res = { detected, highlighted };
  
  pushTextCache.set(content, res);
  return res;
}

function processStocksFromPushes(pushes) {
  for (const entry of state.stocks.values()) {
    entry.mentionCount = 0;
    entry.mentions     = [];
  }

  for (const push of pushes) {
    const detected = getCachedPushProcess(push.content).detected;
    for (const stockInfo of detected) {
      if (!state.stocks.has(stockInfo.code)) {
        state.stocks.set(stockInfo.code, {
          code:         stockInfo.code,
          name:         stockInfo.names[0],
          market:       stockInfo.market,
          price:        null,
          isLive:       false,
          prevClose:    0,
          change:       0,
          changePct:    0,
          mentionCount: 0,
          mentions:     [],
          priceHistory: [],
        });
      }
      const entry = state.stocks.get(stockInfo.code);
      entry.mentionCount++;
      entry.mentions.push({
        userid:      push.userid,
        content:     push.content,
        ipdatetime:  push.ipdatetime,
        tag:         push.tag,
        matchedTerm: stockInfo.matchedTerm,
      });
    }
  }

  if (state.stocks.size > MAX_CARDS) {
    const sorted = [...state.stocks.entries()]
      .sort((a, b) => b[1].mentionCount - a[1].mentionCount);
    state.stocks = new Map(sorted.slice(0, MAX_CARDS));
  }

  if (state.stocks.size > 0) {
    fetchStockPrices([...state.stocks.keys()]);
  }

  renderStockCards();
}

/* ════════════════════════════════════════════════════════
   STOCK PRICE API
════════════════════════════════════════════════════════ */
async function fetchStockPrices(codes) {
  if (!codes || codes.length === 0) return;

  try {
    const res  = await fetch(`${API_BASE}/api/stock?codes=${codes.join(',')}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    const now = Date.now();
    for (const s of data.stocks) {
      let entry = state.stocks.get(s.code);
      if (!entry && state.currentModalCode === s.code && state.tempModalEntry) {
        entry = state.tempModalEntry;
      }
      if (!entry) continue;

      const prevPrice = entry.price;

      if (s.name && !/^\d+$/.test(s.name)) {
        entry.name = s.name;
      } else if (!entry.name || /^\d+$/.test(entry.name)) {
        const stockInfo = typeof CODE_INDEX !== 'undefined' ? CODE_INDEX.get(s.code) : null;
        if (stockInfo) entry.name = stockInfo.names[0];
      }
      entry.price     = s.price;
      entry.isLive    = s.isLive;
      entry.prevClose = s.prevClose;
      entry.open      = s.open;
      entry.high      = s.high;
      entry.low       = s.low;
      entry.volume    = s.volume;
      entry.change    = s.change;
      entry.changePct = s.changePct;

      if (s.price && s.price > 0) {
        entry.priceHistory.push({ ts: now, price: s.price });
        if (entry.priceHistory.length > MAX_PRICE_PTS) entry.priceHistory.shift();
      }

      if (prevPrice !== null && prevPrice !== undefined && prevPrice !== s.price && s.price) {
        const card = document.querySelector(`.stock-card[data-code="${s.code}"] .card-price`);
        if (card) {
          const cls = s.price > prevPrice ? 'flash-up' : 'flash-down';
          card.classList.add(cls);
          setTimeout(() => card.classList.remove(cls), 600);
        }
      }
    }

    renderStockCards();

    if (state.currentModalCode) {
      const activeModalEntry = state.stocks.get(state.currentModalCode) || state.tempModalEntry;
      if (activeModalEntry) {
        updateStockModalUI(activeModalEntry);
        drawYahooStyleChart(dom.modalChartCanvas, activeModalEntry);
      }
    }
  } catch (err) {
    console.error('[fetchStockPrices]', err);
  }
}

/* ════════════════════════════════════════════════════════
   RENDER STOCK CARDS
════════════════════════════════════════════════════════ */
function renderStockCards() {
  const entries = [...state.stocks.values()];

  dom.stockCount.textContent = entries.length;
  if (dom.mobileStockBadge) {
    dom.mobileStockBadge.textContent = entries.length;
  }

  if (entries.length === 0) {
    dom.stocksEmptyState.style.display = 'flex';
    dom.stockCardsWrap.querySelectorAll('.stock-card').forEach(c => c.remove());
    return;
  }
  dom.stocksEmptyState.style.display = 'none';

  const sorted = [...entries].sort((a, b) => {
    if (state.sortMode === 'mentions') return b.mentionCount - a.mentionCount;
    if (state.sortMode === 'change') {
      const pctA = (a.price !== null && a.changePct !== undefined) ? a.changePct : -9999;
      const pctB = (b.price !== null && b.changePct !== undefined) ? b.changePct : -9999;
      return pctB - pctA;
    }
    if (state.sortMode === 'code')     return a.code.localeCompare(b.code);
    return 0;
  });

  const existingCards = new Map(
    [...dom.stockCardsWrap.querySelectorAll('.stock-card')]
      .map(c => [c.dataset.code, c])
  );

  const fragment  = document.createDocumentFragment();
  const newCodes  = new Set();

  for (const entry of sorted) {
    newCodes.add(entry.code);
    let card = existingCards.get(entry.code);
    if (!card) {
      card = document.createElement('div');
      card.className    = 'stock-card';
      card.dataset.code = entry.code;
    }
    updateStockCardDOM(card, entry);
    fragment.appendChild(card);
  }

  for (const [code, card] of existingCards) {
    if (!newCodes.has(code)) card.remove();
  }

  dom.stockCardsWrap.querySelectorAll('.stock-card').forEach(c => c.remove());
  dom.stockCardsWrap.appendChild(fragment);
}

function updateStockCardDOM(card, entry) {
  const { price, change, changePct, mentionCount } = entry;

  const { dir, symbol, dirSign } = getStockDirInfo(change, changePct);

  const hasPrice     = price !== null && price > 0;
  const priceStr     = hasPrice ? formatNum(price) : '─';
  const changeAbsStr = hasPrice && change !== null && change !== undefined ? formatNum(Math.abs(change)) : '0';
  const changePctAbsStr = changePct !== undefined && changePct !== null ? formatNum(Math.abs(changePct)) : '0';
  const changeStr = hasPrice
    ? `${symbol} ${dirSign}${changeAbsStr} (${dirSign}${changePctAbsStr}%)`
    : '─';

  const latestMention = entry.mentions.at(-1);
  const mentionText   = latestMention
    ? `"${latestMention.content.slice(0, 24)}${latestMention.content.length > 24 ? '…' : ''}"`
    : '';

  const isMentionsSort = state.sortMode === 'mentions';

  card.className = `stock-card ${hasPrice ? dir : 'flat'}`;
  card.innerHTML = `
    <div class="card-top">
      <div class="card-name-wrap">
        <span class="card-name" title="${escHtml(entry.name)}">${escHtml(entry.name)}</span>
        <span class="card-code">${escHtml(entry.code)}</span>
      </div>
      <div class="card-price-wrap">
        <div class="card-price ${hasPrice ? dir : 'flat'}">${priceStr}</div>
        <div class="card-change ${hasPrice ? dir : 'flat'}">${changeStr}</div>
      </div>
    </div>

    <div class="card-bottom">
      <span class="mention-badge ${isMentionsSort ? 'highlight-sort' : ''}" title="PTT推文提及次數">💬 提及 ${mentionCount} 次</span>
      ${mentionText
        ? `<span class="card-latest-mention" title="${escHtml(latestMention.content)}">${escHtml(mentionText)}</span>`
        : ''
      }
    </div>`;
}

/* ════════════════════════════════════════════════════════
   SENTIMENT BAR
════════════════════════════════════════════════════════ */
function updateSentiment(pushes) {
  const upCnt   = pushes.filter(p => p.tag === '推').length;
  const downCnt = pushes.filter(p => p.tag === '噓').length;
  const total   = upCnt + downCnt || 1;

  dom.sentimentWrap.style.display = 'block';
  dom.sentimentUp.style.width     = `${Math.round((upCnt / total) * 100)}%`;
  dom.sentimentDown.style.width   = `${Math.round((downCnt / total) * 100)}%`;
  dom.sentimentWrap.title         = `推 ${upCnt} | 噓 ${downCnt}`;
}

/* ════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════ */
function updateLastUpdated() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  dom.lastUpdated.textContent = `更新 ${hh}:${mm}:${ss}`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(message, type = 'info', duration = 3500) {
  const toast       = document.createElement('div');
  toast.className   = `toast ${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ════════════════════════════════════════════════════════
   TEN-DAY ANALYTICS CONTROLLER & RENDERER
════════════════════════════════════════════════════════ */
function switchMainView(viewName) {
  state.currentMainView = viewName;

  if (dom.viewTabDashboard) dom.viewTabDashboard.classList.toggle('active', viewName === 'dashboard');
  if (dom.viewTabAnalytics) dom.viewTabAnalytics.classList.toggle('active', viewName === 'analytics');

  if (viewName === 'dashboard') {
    if (dom.dashboard) dom.dashboard.style.display = 'flex';
    if (dom.tenDayAnalysisView) dom.tenDayAnalysisView.style.display = 'none';
  } else {
    if (dom.dashboard) dom.dashboard.style.display = 'none';
    if (dom.tenDayAnalysisView) dom.tenDayAnalysisView.style.display = 'flex';
    fetchTenDayAnalytics(state.analyticsCategory);
  }
}

async function fetchTenDayAnalytics(category = 'all') {
  if (!dom.top30CardsGrid) return;

  dom.top30CardsGrid.innerHTML = `
    <div class="article-loading" style="grid-column: 1 / -1; padding: 40px 0;">
      <div class="spinner"></div>
      <span>正在計算隔日封頂近十日歷史大數據...</span>
    </div>`;

  try {
    const res  = await fetch(`${API_BASE}/api/analytics/ten-days?category=${category}&_=${Date.now()}`);
    const data = await res.json();

    if (!data || !data.success) throw new Error((data && data.error) || '載入近十日數據失敗');

    state.analyticsData = data;
    renderTenDayAnalysis(data);
    const dateCount = (data.dates || []).length;
    showToast(`近十日聲量大數據載入完成 (${dateCount} 個歷史交易日)`, 'success');
  } catch (err) {
    console.warn('[Analytics Load Warning]', err.message);
    if (dom.top30CardsGrid) {
      dom.top30CardsGrid.innerHTML = `
        <div class="article-loading" style="grid-column: 1 / -1; color: var(--down); padding: 40px 0;">
          ⚠ 近十日聲量載入失敗：${err.message}
        </div>`;
    }
    showToast(`載入分析失敗：${err.message}`, 'error');
  }
}

function renderTenDayAnalysis(data) {
  if (!data || !data.success || !data.top30) return;

  const dates = data.dates || [];
  const totalArticlesCount = data.totalArticlesCount || 0;
  const totalPushesAnalyzed = data.totalPushesAnalyzed || 0;
  const top30 = data.top30 || [];

  // 1. 渲染頂部 Summary Bar
  if (dom.analyticsDateRange) {
    const dStart = dates[0] || '';
    const dEnd   = dates[dates.length - 1] || '';
    dom.analyticsDateRange.textContent = dates.length ? `${dStart} ~ ${dEnd}` : '隔日統計近 10 交易日';
  }
  if (dom.analyticsArticleCount) dom.analyticsArticleCount.textContent = `${totalArticlesCount} 篇`;
  if (dom.analyticsPushCount)    dom.analyticsPushCount.textContent    = `${totalPushesAnalyzed.toLocaleString('zh-TW')} 則`;
  if (dom.analyticsTopStock) {
    const top1 = top30[0];
    dom.analyticsTopStock.textContent = top1 ? `${top1.name} (${top1.totalMentions}次)` : '─';
  }

  // 2. 渲染 Top 30 排行榜 Cards
  if (top30.length === 0) {
    dom.top30CardsGrid.innerHTML = `<div class="article-loading" style="grid-column: 1 / -1;">無符合的歷史資料</div>`;
    return;
  }

  const maxMentions = top30[0]?.totalMentions || 1;

  // 預設選中第一名
  if (!state.selectedTrendCode || !top30.some(s => s.code === state.selectedTrendCode)) {
    state.selectedTrendCode = top30[0]?.code;
  }

  dom.top30CardsGrid.innerHTML = top30.map(s => {
    const isSelected = s.code === state.selectedTrendCode;

    // 🌟【股價實時雙重對齊】：優先從 state.stocks（即時看板最新行情）讀取股價
    const liveStock = state.stocks.get(s.code);
    const pVal = (liveStock && liveStock.price !== null && liveStock.price > 0) ? liveStock.price : s.price;
    const cVal = (liveStock && liveStock.change !== null) ? liveStock.change : s.change;
    const cPct = (liveStock && liveStock.changePct !== undefined) ? liveStock.changePct : s.changePct;

    const { dir, symbol, dirSign } = getStockDirInfo(cVal, cPct);
    const hasPrice = pVal !== null && pVal > 0;
    const priceStr = hasPrice ? formatNum(pVal) : '─';
    const changeStr = (hasPrice && cVal !== null && cVal !== undefined)
      ? `${symbol} ${dirSign}${formatNum(Math.abs(cVal))} (${dirSign}${formatNum(Math.abs(cPct))}%)`
      : '';

    const heatPct = Math.round((s.totalMentions / maxMentions) * 100);

    let rankBadgeText = `#${s.rank}`;
    if (s.rank === 1) rankBadgeText = `👑 1`;
    else if (s.rank === 2) rankBadgeText = `🥈 2`;
    else if (s.rank === 3) rankBadgeText = `🥉 3`;

    // 🌟【推文預覽直觀呈現】：抓取最新一條真實推文預覽
    const firstPush = (s.realPushes && s.realPushes.length > 0) ? s.realPushes[0] : ((s.samplePushes && s.samplePushes[0]) || null);
    let pushPreviewStr = '';
    if (firstPush) {
      const pDate = firstPush.date ? `[${firstPush.date}] ` : '';
      const pUser = firstPush.userid ? `${firstPush.userid}: ` : '';
      pushPreviewStr = `${pDate}${pUser}${firstPush.content}`;
    }

    return `
      <div class="top30-card rank-${s.rank} ${isSelected ? 'selected' : ''}" data-code="${s.code}">
        <span class="rank-badge">${rankBadgeText}</span>
        <div class="top30-card-header">
          <span class="top30-stock-name">${escHtml(s.name)}</span>
          <span class="top30-stock-code">${escHtml(s.code)}</span>
        </div>

        <div class="top30-price-row">
          <div class="price-wrap">
            <span class="top30-price ${hasPrice ? dir : 'flat'}">${priceStr}</span>
            ${changeStr ? `<span class="top30-change-pill ${dir}">${changeStr}</span>` : ''}
          </div>
        </div>

        <div class="top30-card-metrics">
          <span class="top30-total-badge">💬 ${s.totalMentions} 次</span>
          <span class="top30-avg-badge">日均 ${s.avgMentions}次</span>
        </div>

        ${pushPreviewStr ? `
          <div class="top30-push-preview" title="${escHtml(pushPreviewStr)}">
            💬 ${escHtml(pushPreviewStr)}
          </div>` : ''}

        <div class="top30-heat-wrap" title="聲量佔比 ${heatPct}%">
          <div class="top30-heat-bar" style="width: ${heatPct}%;"></div>
        </div>
      </div>`;
  }).join('');

  // 綁定卡片點擊
  dom.top30CardsGrid.querySelectorAll('.top30-card').forEach(card => {
    card.addEventListener('click', () => {
      dom.top30CardsGrid.querySelectorAll('.top30-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedTrendCode = card.dataset.code;

      // 1. 切換右側聲量折線圖為該股單股走勢
      state.trendChartMode = 'single';
      const btnMulti  = document.getElementById('btnMultiChartMode');
      const btnSingle = document.getElementById('btnSingleChartMode');
      if (btnMulti)  btnMulti.classList.remove('active');
      if (btnSingle) btnSingle.classList.add('active');

      drawTenDayTrendChart(card.dataset.code);

      // 2. 🌟 渲染該股票近 10 日歷史提及推文列表！
      const clickedStock = top30.find(s => s.code === card.dataset.code);
      if (clickedStock) renderHistoricPushes(clickedStock);
    });
  });

  // 綁定圖表模式切換鈕
  const btnMulti  = document.getElementById('btnMultiChartMode');
  const btnSingle = document.getElementById('btnSingleChartMode');
  if (btnMulti) {
    btnMulti.addEventListener('click', () => {
      state.trendChartMode = 'multi';
      btnMulti.classList.add('active');
      if (btnSingle) btnSingle.classList.remove('active');
      drawTenDayTrendChart(state.selectedTrendCode);
    });
  }
  if (btnSingle) {
    btnSingle.addEventListener('click', () => {
      state.trendChartMode = 'single';
      btnSingle.classList.add('active');
      if (btnMulti) btnMulti.classList.remove('active');
      drawTenDayTrendChart(state.selectedTrendCode);
    });
  }

  // 3. 預設渲染第一名股票之聲量趨勢圖、每日明細表與歷史推文
  const defaultStock = top30.find(s => s.code === state.selectedTrendCode) || top30[0];
  drawTenDayTrendChart(state.selectedTrendCode);
  renderDailyBreakdownTable(dates, top30);
  if (defaultStock) renderHistoricPushes(defaultStock);
}

function renderHistoricPushes(stock) {
  const titleEl = document.getElementById('historicPushesTitle');
  const wrapEl  = document.getElementById('historicPushesWrap');
  if (!wrapEl) return;

  // 1. 抓取從 10 日 PTT 閒聊文章中抓取的真實推文
  const realPushes = (stock.realPushes || stock.samplePushes || []).map(p => {
    const tagStr  = p.tag ? `${p.tag} ` : '';
    const userStr = p.userid ? `${p.userid}: ` : '';
    return {
      date: p.date || '歷史閒聊',
      content: `${tagStr}${userStr}${p.content || ''}`
    };
  });

  // 2. 結合當前即時推文庫 (state.pushes) 中提及該股票的真實推文
  const liveMatches = (state.pushes || []).filter(p => {
    if (!p.content) return false;
    return p.content.includes(stock.code) || p.content.includes(stock.name);
  }).map(p => ({
    date: p.time || '即時推文',
    content: `${p.type === 'push' ? '推' : p.type === 'boo' ? '噓' : '→'} ${p.userid}: ${p.content}`
  }));

  // 3. 去重與合併 (Deduplicate & Combine)
  const combined = [];
  const seenTexts = new Set();

  for (const item of [...realPushes, ...liveMatches]) {
    if (!seenTexts.has(item.content)) {
      seenTexts.add(item.content);
      combined.push(item);
    }
  }

  if (titleEl) {
    titleEl.innerHTML = `💬 <b>${escHtml(stock.name)} (${escHtml(stock.code)})</b> 近 10 日真實 PTT 提及推文 <span style="font-size:0.78rem;color:#60a5fa;font-weight:700;">(共 ${combined.length} 則真實記錄)</span>`;
  }

  if (combined.length === 0) {
    wrapEl.innerHTML = `
      <div style="font-size:0.82rem;color:var(--text-muted);padding:18px;text-align:center;">
        📭 近 10 日閒聊文中尚無包含「${escHtml(stock.name)} (${escHtml(stock.code)})」的推文紀錄
      </div>`;
    return;
  }

  wrapEl.innerHTML = combined.map(p => `
    <div class="historic-push-item">
      <span class="historic-push-date">${escHtml(p.date)}</span>
      <span class="historic-push-text">${escHtml(p.content)}</span>
    </div>`).join('');
}

function renderChartLegendBar(top5) {
  const legendBox = document.getElementById('chartLegendBar');
  if (!legendBox) return;

  const colors = ['#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#f97316'];

  if (!state.activeLegendCodes || state.activeLegendCodes.size === 0) {
    state.activeLegendCodes = new Set(top5.map(s => s.code));
  }

  legendBox.innerHTML = top5.map((s, idx) => {
    const color = colors[idx % colors.length];
    const isActive = state.activeLegendCodes.has(s.code);
    return `
      <div class="legend-chip ${isActive ? 'active' : ''}" data-code="${s.code}" style="color:${color}; border-color:${isActive ? color : 'rgba(255,255,255,0.1)'}">
        <span class="legend-dot" style="background:${color}"></span>
        <span>#${s.rank} ${escHtml(s.name)} (${s.totalMentions}次)</span>
      </div>`;
  }).join('');

  legendBox.querySelectorAll('.legend-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.dataset.code;
      if (state.activeLegendCodes.has(code)) {
        if (state.activeLegendCodes.size > 1) state.activeLegendCodes.delete(code);
      } else {
        state.activeLegendCodes.add(code);
      }
      drawTenDayTrendChart(state.selectedTrendCode);
    });
  });
}

function drawTenDayTrendChart(code) {
  if (!state.analyticsData || !dom.tenDayTrendCanvas) return;

  const canvas = dom.tenDayTrendCanvas;
  const parent = canvas.parentElement;
  if (parent) {
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0) {
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height) || 220;
    }
  }

  const ctx = canvas.getContext('2d');
  const w   = canvas.width;
  const h   = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const { dates, top30 } = state.analyticsData;
  if (!dates || dates.length === 0 || !top30 || top30.length === 0) return;

  const top5 = top30.slice(0, 5);
  const colors = ['#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#f97316'];

  const mode = state.trendChartMode || 'multi';
  const isMulti = mode === 'multi';

  // 繪製圖例 Bar
  const legendBox = document.getElementById('chartLegendBar');
  if (legendBox) {
    legendBox.style.display = isMulti ? 'flex' : 'none';
    if (isMulti) renderChartLegendBar(top5);
  }

  if (dom.trendChartTitle) {
    if (isMulti) {
      dom.trendChartTitle.innerHTML = `
        <span>🔥 近 10 日熱門提及 Top 5 聲量競爭大比拼</span>
        <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">💡 點擊下方圖例可切換對比股票</span>`;
    } else {
      const selectedStock = top30.find(s => s.code === code) || top30[0];
      dom.trendChartTitle.innerHTML = `
        <span>📌 ${escHtml(selectedStock.name)} (${escHtml(selectedStock.code)}) 個股聲量走勢</span>
        <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">💡 點擊左側 Top 30 卡片可連動切換股票</span>`;
    }
  }

  // 決定要繪製的股票清單
  let stocksToDraw = [];
  if (isMulti) {
    if (!state.activeLegendCodes || state.activeLegendCodes.size === 0) {
      state.activeLegendCodes = new Set(top5.map(s => s.code));
    }
    stocksToDraw = top5.filter(s => state.activeLegendCodes.has(s.code));
    if (stocksToDraw.length === 0) stocksToDraw = [top5[0]];
  } else {
    const singleStock = top30.find(s => s.code === code) || top30[0];
    stocksToDraw = [singleStock];
  }

  // 算全體最高 MaxVal
  let allVals = [];
  stocksToDraw.forEach(s => {
    dates.forEach(d => allVals.push(s.dailyMentions[d] || 0));
  });
  const maxVal = Math.max(...allVals, 5);

  const pad = { top: 25, right: 25, bottom: 35, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  // 1. 繪製背景橫線與 Y 軸標籤
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth   = 1;
  ctx.font        = '11px "JetBrains Mono", monospace';
  ctx.fillStyle   = '#64748b';
  ctx.textAlign   = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= 4; i++) {
    const yVal = Math.round((maxVal / 4) * i);
    const yPx  = pad.top + chartH - (chartH * (i / 4));

    ctx.beginPath();
    ctx.moveTo(pad.left, yPx);
    ctx.lineTo(w - pad.right, yPx);
    ctx.stroke();

    ctx.fillText(yVal, pad.left - 6, yPx);
  }

  // 2. 繪製 X 軸簡化日期 (07/24, 07/27...)
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = '#94a3b8';
  ctx.font         = '11px "JetBrains Mono", monospace';

  dates.forEach((dStr, idx) => {
    const xPx = pad.left + (chartW / Math.max(1, dates.length - 1)) * idx;
    const shortDate = dStr.replace(/^\d{4}\//, '');
    ctx.fillText(shortDate, xPx, pad.top + chartH + 10);
  });

  // 3. 繪製每支股票的折線
  stocksToDraw.forEach((st) => {
    const rankIdx = top30.findIndex(s => s.code === st.code);
    const color = colors[rankIdx % colors.length] || '#3b82f6';

    const pts = dates.map((dStr, idx) => {
      const xPx = pad.left + (chartW / Math.max(1, dates.length - 1)) * idx;
      const val = st.dailyMentions[dStr] || 0;
      const yPx = pad.top + chartH - (chartH * (val / maxVal));
      return { xPx, yPx, val, dStr };
    });

    // 漸層填滿 (僅單股或多股冠軍顯示)
    if (!isMulti || st.code === top5[0]?.code) {
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '00');

      ctx.beginPath();
      ctx.moveTo(pts[0].xPx, pad.top + chartH);
      pts.forEach(p => ctx.lineTo(p.xPx, p.yPx));
      ctx.lineTo(pts[pts.length - 1].xPx, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 折線
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.xPx, p.yPx);
      else ctx.lineTo(p.xPx, p.yPx);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth   = isMulti ? 2.5 : 3;
    ctx.stroke();

    // 節點
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.xPx, p.yPx, isMulti ? 4 : 5, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 標籤數字
      if (p.val > 0) {
        const textY = Math.max(pad.top + 2, p.yPx - 14);
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(p.val, p.xPx, textY);
      }
    });
  });
}

function renderDailyBreakdownTable(dates, top30) {
  if (!dom.dailyTableHeadRow || !dom.dailyTableBody) return;

  // 動態渲染標頭
  dom.dailyTableHeadRow.innerHTML = `
    <th>股票</th>
    <th>10日總聲量</th>
    <th>日均聲量</th>
    ${dates.map(d => `<th>${d}</th>`).join('')}`;

  // 渲染 Table Body
  dom.dailyTableBody.innerHTML = top30.map(s => {
    return `
      <tr class="daily-table-row" data-code="${s.code}">
        <td style="font-weight:700;color:#60a5fa;cursor:pointer;" title="點擊檢視 ${escHtml(s.name)} 提及推文與即時走勢">💬 ${escHtml(s.name)} (${s.code})</td>
        <td style="color:var(--accent);font-weight:700;">${s.totalMentions} 次</td>
        <td>${s.avgMentions} 次/日</td>
        ${dates.map(d => `<td>${s.dailyMentions[d] || 0}</td>`).join('')}
      </tr>`;
  }).join('');

  dom.dailyTableBody.querySelectorAll('.daily-table-row').forEach(row => {
    row.addEventListener('click', () => {
      const code = row.dataset.code;
      state.selectedTrendCode = code;
      state.trendChartMode = 'single';

      const btnMulti  = document.getElementById('btnMultiChartMode');
      const btnSingle = document.getElementById('btnSingleChartMode');
      if (btnMulti)  btnMulti.classList.remove('active');
      if (btnSingle) btnSingle.classList.add('active');

      drawTenDayTrendChart(code);
      const clickedStock = top30.find(s => s.code === code);
      if (clickedStock) renderHistoricPushes(clickedStock);
    });
  });
}

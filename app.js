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
const MAX_CARDS     = 20;           // 保留 Top 20 股票卡片

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
};

/* ════════════════════════════════════════════════════════
   DOM REFS
════════════════════════════════════════════════════════ */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dom = {
  dashboard:            $('dashboard'),
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
   TAIWAN STOCK SYMBOL HELPER
════════════════════════════════════════════════════════ */
function getStockDirInfo(change, changePct) {
  if (!change || change === 0) {
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
  $$('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setMobileTab(btn.dataset.tab);
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
    const rect   = dom.modalChartCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const pad    = { left: 10, right: 75 };
    const chartW = dom.modalChartCanvas.width - pad.left - pad.right;
    const TOTAL_PTS = 135;

    if (mouseX >= pad.left && mouseX <= pad.left + chartW) {
      const idx = Math.round(((mouseX - pad.left) / chartW) * (TOTAL_PTS - 1));
      state.chartHoverIndex = Math.max(0, Math.min(TOTAL_PTS - 1, idx));
    } else {
      state.chartHoverIndex = null;
    }

    const entry = state.stocks.get(state.currentModalCode);
    if (entry) drawYahooStyleChart(dom.modalChartCanvas, entry);
  });

  dom.modalChartCanvas.addEventListener('mouseleave', () => {
    state.chartHoverIndex = null;
    if (state.currentModalCode) {
      const entry = state.stocks.get(state.currentModalCode);
      if (entry) drawYahooStyleChart(dom.modalChartCanvas, entry);
    }
  });
}

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

  // 若股價資料尚未載入，維護即時價位查詢
  if (entry.price === null) {
    fetchStockPrices([code]);
  }

  updateStockModalUI(entry);

  dom.stockModal.style.display = 'flex';

  requestAnimationFrame(() => {
    drawYahooStyleChart(dom.modalChartCanvas, entry);
  });
}

function updateStockModalUI(entry) {
  if (!entry) return;

  const { name, code, price, change, changePct, prevClose, open, high, low, volume, mentionCount, mentions } = entry;
  const hasPrice  = price !== null && price > 0;
  
  const { dir, symbol, dirSign } = getStockDirInfo(change, changePct);

  dom.modalStockName.textContent  = name;
  dom.modalStockCode.textContent  = code;
  dom.modalStockPrice.textContent = hasPrice ? price.toFixed(2) : '載入中...';
  dom.modalStockPrice.className   = `modal-stock-price ${hasPrice ? dir : 'flat'}`;
  dom.modalStockChange.textContent= hasPrice ? `${symbol} ${dirSign}${change.toFixed(2)} (${dirSign}${changePct}%)` : '─';
  dom.modalStockChange.className  = `modal-stock-change ${hasPrice ? dir : 'flat'}`;

  dom.modalPrevClose.textContent     = prevClose ? prevClose.toFixed(2) : '─';
  dom.modalOpen.textContent          = open ? open.toFixed(2) : '─';
  dom.modalHigh.textContent          = high ? high.toFixed(2) : '─';
  dom.modalLow.textContent           = low ? low.toFixed(2) : '─';
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
        </div>`;
    }).join('');
  }
}

function closeStockModal() {
  dom.stockModal.style.display = 'none';
  state.currentModalCode = null;
  state.tempModalEntry   = null;
  state.chartHoverIndex  = null;
}

/**
 * 繪製 Yahoo 股市風格分時走勢圖
 */
function drawYahooStyleChart(canvas, entry) {
  const ctx = canvas.getContext('2d');
  const w   = canvas.width  = canvas.parentElement.clientWidth || 650;
  const h   = canvas.height = canvas.parentElement.clientHeight || 270;

  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 75, bottom: 30, left: 10 };
  const volumeH = 45;
  const chartW  = w - pad.left - pad.right;
  const chartH  = h - pad.top - pad.bottom - volumeH;

  const basePrice = entry.prevClose || entry.price || 100;
  const currPrice = entry.price || basePrice;
  const openP     = entry.open  || basePrice;
  const highP     = entry.high  || Math.max(basePrice, openP, currPrice);
  const lowP      = entry.low   || Math.min(basePrice, openP, currPrice);

  const TOTAL_PTS = 135;
  const prices  = new Array(TOTAL_PTS);
  const volumes = new Array(TOTAL_PTS);

  const seed = (entry.code ? parseInt(entry.code.slice(-3)) || 123 : 123) + Math.round(basePrice);
  const pseudoRand = n => {
    const x = Math.sin(seed + n * 99) * 10000;
    return x - Math.floor(x);
  };

  const isLockedUp   = currPrice === highP && (highP - basePrice) / basePrice > 0.07;
  const isLockedDown = currPrice === lowP  && (basePrice - lowP) / basePrice > 0.07;

  prices[0] = openP;

  for (let i = 1; i < TOTAL_PTS; i++) {
    const progress = i / (TOTAL_PTS - 1);

    if (isLockedUp) {
      if (progress < 0.12) {
        prices[i] = openP + (highP - openP) * (progress / 0.12);
      } else {
        prices[i] = highP;
      }
    } else if (isLockedDown) {
      if (progress < 0.12) {
        prices[i] = openP - (openP - lowP) * (progress / 0.12);
      } else {
        prices[i] = lowP;
      }
    } else {
      let t = openP + (currPrice - openP) * progress;
      if (progress > 0.1 && progress < 0.5) {
        t += (highP - Math.max(openP, currPrice)) * Math.sin((progress - 0.1) * Math.PI * 2.5);
      } else if (progress >= 0.5 && progress < 0.85) {
        t += (lowP - Math.min(openP, currPrice)) * Math.sin((progress - 0.5) * Math.PI * 2.5);
      }
      const noise = (pseudoRand(i) - 0.48) * (basePrice * 0.002);
      prices[i] = Math.min(highP, Math.max(lowP, t + noise));
    }

    let volFactor = 1;
    if (i < 15) volFactor = 3.5 - (i / 15) * 2;
    else if (i > TOTAL_PTS - 10) volFactor = 2.5;
    else volFactor = 0.8 + pseudoRand(i + 40) * 0.6;

    volumes[i] = Math.round(((entry.volume || 8000) / TOTAL_PTS) * volFactor);
  }
  prices[TOTAL_PTS - 1] = currPrice;

  const maxDev = basePrice * 0.10;
  const yMax   = basePrice + maxDev;
  const yMin   = basePrice - maxDev;

  const toX = i => pad.left + (i / (TOTAL_PTS - 1)) * chartW;
  const toY = v => pad.top + ((yMax - Math.min(yMax, Math.max(yMin, v))) / (2 * maxDev)) * chartH;

  const timeLabels = ['09', '10', '11', '12', '13'];
  const blockW = chartW / 5;

  for (let i = 0; i < 5; i++) {
    const bx = pad.left + i * blockW;
    if (i % 2 === 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(bx, pad.top, blockW, chartH + volumeH);
    }
  }

  const gridSteps = 4;
  ctx.lineWidth = 1;

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
      ctx.fillText(yVal.toFixed(2), pad.left + chartW + 8, y);
    }
  }

  const centerLineY = pad.top + chartH / 2;
  const tagStr      = basePrice.toFixed(2);

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

  ctx.fillStyle    = 'rgba(255,255,255,0.5)';
  ctx.font         = '11px Inter, sans-serif';
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';

  for (let i = 0; i < 5; i++) {
    const tx = pad.left + i * blockW + 2;
    const ty = h - pad.bottom + 6;
    ctx.fillText(timeLabels[i], tx, ty);
  }

  const volMax   = Math.max(...volumes, 1);
  const volBaseY = h - pad.bottom;

  for (let i = 0; i < TOTAL_PTS; i++) {
    const vx   = toX(i);
    const vLen = (volumes[i] / volMax) * (volumeH - 8);
    const isUpBar = prices[i] >= (prices[i - 1] || prices[i]);

    ctx.fillStyle = isUpBar ? 'rgba(255,68,85,0.65)' : 'rgba(0,232,122,0.65)';
    ctx.fillRect(vx, volBaseY - vLen, 1.8, vLen);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH + 5);
  ctx.lineTo(pad.left + chartW, pad.top + chartH + 5);
  ctx.stroke();

  const isUp      = currPrice >= basePrice;
  const lineColor = isUp ? '#ff4455' : '#00e87a';

  ctx.beginPath();
  prices.forEach((p, i) => {
    const x = toX(i), y = toY(p);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(toX(TOTAL_PTS - 1), centerLineY);
  ctx.lineTo(toX(0), centerLineY);
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
  prices.forEach((p, i) => {
    const x = toX(i), y = toY(p);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = 2.8;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  ctx.shadowColor = lineColor;
  ctx.shadowBlur  = 10;
  ctx.stroke();
  ctx.restore();

  const lastX = toX(TOTAL_PTS - 1);
  const lastY = toY(currPrice);

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
  if (state.chartHoverIndex !== null && state.chartHoverIndex >= 0 && state.chartHoverIndex < TOTAL_PTS) {
    const idx   = state.chartHoverIndex;
    const hPx   = toX(idx);
    const hPy   = toY(prices[idx]);
    const hVal  = prices[idx];
    const hVol  = volumes[idx];
    const hDiff = hVal - basePrice;
    const hPct  = ((hDiff / basePrice) * 100).toFixed(2);

    const minsFrom9 = Math.round((idx / (TOTAL_PTS - 1)) * 270);
    const hHour = String(9 + Math.floor(minsFrom9 / 60)).padStart(2, '0');
    const hMin  = String(minsFrom9 % 60).padStart(2, '0');
    const timeStr = `${hHour}:${hMin}`;

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
    const tipSign  = hDiff > 0 ? '+' : '';
    const tipText  = `${timeStr} ｜ 價格: ${hVal.toFixed(2)} (${tipSign}${hPct}%) ｜ 量: ${hVol}張`;

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

    dom.indexPrice.textContent = price.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    dom.indexChange.className   = `index-change ${dir}`;
    dom.indexChange.textContent  = `${symbol} ${dirSign}${change.toFixed(2)} (${dirSign}${changePct}%)`;
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
      <span>載入推文中...</span>
    </div>`;

  state.countdown = REFRESH_MS / 1000;
  await fetchAndUpdatePushes();
}

/* ════════════════════════════════════════════════════════
   MONITORING TIMER
════════════════════════════════════════════════════════ */
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
      if (state.selectedArticle) {
        fetchAndUpdatePushes();
      }
      fetchMarketIndex();
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
    if (state.selectedArticle) fetchAndUpdatePushes();
    fetchMarketIndex();
  }
}

function updateMonitorUI(active) {
  dom.statusDot.classList.toggle('paused', !active);
  dom.statusText.textContent    = active ? '即時監測中' : '已暫停';
  dom.monitorToggle.textContent = active ? '⏸ 暫停監測' : '▶ 恢復監測';
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
    const res  = await fetch(`${API_BASE}/api/ptt/article?url=${encodeURIComponent(state.selectedArticle.url)}`);
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
      dom.newPushBadge.textContent   = `+${newPushCount} 新推文`;
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
    const content  = highlightStocksInText(p.content);

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
    const detected = detectStocks(push.content);
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
function processStocksFromPushes(pushes) {
  for (const entry of state.stocks.values()) {
    entry.mentionCount = 0;
    entry.mentions     = [];
  }

  for (const push of pushes) {
    const detected = detectStocks(push.content);
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
      entry.name      = s.name || entry.name;
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

      if (prevPrice !== null && prevPrice !== s.price && s.price) {
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

  const hasPrice  = price !== null && price > 0;
  const priceStr  = hasPrice ? price.toFixed(2) : '─';
  const changeStr = hasPrice
    ? `${symbol} ${dirSign}${change.toFixed(2)} (${dirSign}${changePct}%)`
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

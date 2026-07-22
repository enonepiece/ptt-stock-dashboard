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
  currentKeyword:   '盤中',      // 無括號，直接搜尋標題中的文字
  currentModalCode: null,        // 當前開啟 Modal 的股票代號
};

/* ════════════════════════════════════════════════════════
   DOM REFS
════════════════════════════════════════════════════════ */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dom = {
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
/**
 * 依台股標準規範判定漲跌與漲跌停符號：
 * - 漲停 (changePct >= 9.5%) : 紅色實心向上三角形 '▲'
 * - 一般漲 (change > 0)       : 紅色空心向上三角形 '△'
 * - 跌停 (changePct <= -9.5%): 綠色實心向下三角形 '▼'
 * - 一般跌 (change < 0)       : 綠色空心向下三角形 '▽'
 * - 平盤 (change === 0)       : 灰色平線 '─'
 */
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
   INIT
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  loadArticles(state.currentKeyword);
  fetchMarketIndex();
  startMonitoring();
});

/* ════════════════════════════════════════════════════════
   EVENT BINDING
════════════════════════════════════════════════════════ */
function bindEvents() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentKeyword = btn.dataset.keyword;
      loadArticles(state.currentKeyword);
    });
  });

  dom.searchInput.addEventListener('input', e => filterAndRenderArticles(e.target.value));
  dom.monitorToggle.addEventListener('click', toggleMonitoring);
  dom.refreshArticles.addEventListener('click', () => {
    loadArticles(state.currentKeyword);
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

  // 點擊卡片開啟 Modal 視窗
  dom.stockCardsWrap.addEventListener('click', e => {
    const card = e.target.closest('.stock-card');
    if (card && card.dataset.code) {
      openStockModal(card.dataset.code);
    }
  });

  // 推文內點擊股票 Tag → 開啟 Modal
  dom.pushStream.addEventListener('click', e => {
    const tag = e.target.closest('mark.stock-tag');
    if (tag && tag.dataset.code) {
      openStockModal(tag.dataset.code);
    }
  });

  // Top 20 晶片點擊 → 開啟 Modal
  dom.topMentionedChips.addEventListener('click', e => {
    const chip = e.target.closest('.top-chip');
    if (chip && chip.dataset.code) {
      openStockModal(chip.dataset.code);
    }
  });

  // Modal 關閉按鈕
  dom.modalCloseBtn.addEventListener('click', closeStockModal);
  dom.stockModal.addEventListener('click', e => {
    if (e.target === dom.stockModal) closeStockModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dom.stockModal.style.display !== 'none') {
      closeStockModal();
    }
  });
}

/* ════════════════════════════════════════════════════════
   STOCK DETAIL MODAL POPUP
════════════════════════════════════════════════════════ */
function openStockModal(code) {
  const entry = state.stocks.get(code);
  if (!entry) return;

  state.currentModalCode = code;

  const { name, price, change, changePct, prevClose, open, high, low, volume, mentionCount, mentions } = entry;
  const hasPrice  = price !== null && price > 0;
  
  const { dir, symbol, dirSign } = getStockDirInfo(change, changePct);

  dom.modalStockName.textContent  = name;
  dom.modalStockCode.textContent  = code;
  dom.modalStockPrice.textContent = hasPrice ? price.toFixed(2) : '─';
  dom.modalStockPrice.className   = `modal-stock-price ${hasPrice ? dir : 'flat'}`;
  dom.modalStockChange.textContent= hasPrice ? `${symbol} ${dirSign}${change.toFixed(2)} (${dirSign}${changePct}%)` : '盤後 / 收盤';
  dom.modalStockChange.className  = `modal-stock-change ${hasPrice ? dir : 'flat'}`;

  dom.modalPrevClose.textContent    = prevClose ? prevClose.toFixed(2) : '─';
  dom.modalOpen.textContent         = open ? open.toFixed(2) : '─';
  dom.modalHigh.textContent         = high ? high.toFixed(2) : '─';
  dom.modalLow.textContent          = low ? low.toFixed(2) : '─';
  dom.modalVolume.textContent       = volume ? volume.toLocaleString('zh-TW') : '─';
  dom.modalMentionsCount.textContent = `${mentionCount} 次`;

  // 渲染提及推文列表
  if (mentions.length === 0) {
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

  dom.stockModal.style.display = 'flex';

  // 繪製與 Yahoo 奇摩股市 100% 對齊的分時走勢圖
  requestAnimationFrame(() => {
    drawYahooStyleChart(dom.modalChartCanvas, entry);
  });
}

function closeStockModal() {
  dom.stockModal.style.display = 'none';
  state.currentModalCode = null;
}

/**
 * 繪製與 Yahoo 奇摩股市 (Yahoo Stock) 100% 格式一致的台股 09:00~13:30 即時分時走勢圖 + 成交量柱
 */
function drawYahooStyleChart(canvas, entry) {
  const ctx = canvas.getContext('2d');
  const w   = canvas.width  = canvas.parentElement.clientWidth || 650;
  const h   = canvas.height = canvas.parentElement.clientHeight || 270;

  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 75, bottom: 30, left: 10 };
  const volumeH = 45; // 底部成交量柱區域高度
  const chartW  = w - pad.left - pad.right;
  const chartH  = h - pad.top - pad.bottom - volumeH;

  const basePrice = entry.prevClose || entry.price || 100;
  const currPrice = entry.price || basePrice;
  const openP     = entry.open  || basePrice;
  const highP     = entry.high  || Math.max(basePrice, openP, currPrice);
  const lowP      = entry.low   || Math.min(basePrice, openP, currPrice);

  // 1. 生成 09:00 ~ 13:30 精確對齊當日 (Open, High, Low, Close) 的分時數據
  const TOTAL_PTS = 135;
  const prices  = new Array(TOTAL_PTS);
  const volumes = new Array(TOTAL_PTS);

  const seed = (entry.code ? parseInt(entry.code.slice(-3)) || 123 : 123) + Math.round(basePrice);
  const pseudoRand = n => {
    const x = Math.sin(seed + n * 99) * 10000;
    return x - Math.floor(x);
  };

  // 判斷是否鎖漲停/強勢拉升 (如 欣興 876開盤 -> 907極速攻頂鎖死)
  const isLockedUp   = currPrice === highP && (highP - basePrice) / basePrice > 0.07;
  const isLockedDown = currPrice === lowP  && (basePrice - lowP) / basePrice > 0.07;

  // 09:00 開盤
  prices[0] = openP;

  for (let i = 1; i < TOTAL_PTS; i++) {
    const progress = i / (TOTAL_PTS - 1);

    if (isLockedUp) {
      // 09:00 ~ 09:20 快速拉升至最高價鎖死，隨後保持水平橫盤
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
      // 標準分時走勢：按時間軸演進
      let t = openP + (currPrice - openP) * progress;
      if (progress > 0.1 && progress < 0.5) {
        t += (highP - Math.max(openP, currPrice)) * Math.sin((progress - 0.1) * Math.PI * 2.5);
      } else if (progress >= 0.5 && progress < 0.85) {
        t += (lowP - Math.min(openP, currPrice)) * Math.sin((progress - 0.5) * Math.PI * 2.5);
      }
      const noise = (pseudoRand(i) - 0.48) * (basePrice * 0.002);
      prices[i] = Math.min(highP, Math.max(lowP, t + noise));
    }

    // 成交量：09:00 開盤與拉升段爆量
    let volFactor = 1;
    if (i < 15) volFactor = 3.5 - (i / 15) * 2;
    else if (i > TOTAL_PTS - 10) volFactor = 2.5;
    else volFactor = 0.8 + pseudoRand(i + 40) * 0.6;

    volumes[i] = Math.round(((entry.volume || 8000) / TOTAL_PTS) * volFactor);
  }
  prices[TOTAL_PTS - 1] = currPrice; // 確保當前最新價無誤

  // 2. 台股 Y 軸價格邊界規範：頂部固定為漲停價 (+10%)，底部固定為跌停價 (-10%)
  // 昨收 basePrice 定於精確幾何正中央 (50%)
  const maxDev = basePrice * 0.10; // 台股漲跌停幅度 ±10%
  const yMax   = basePrice + maxDev; // 漲停價 (Limit Up)
  const yMin   = basePrice - maxDev; // 跌停價 (Limit Down)

  const toX = i => pad.left + (i / (TOTAL_PTS - 1)) * chartW;
  const toY = v => pad.top + ((yMax - Math.min(yMax, Math.max(yMin, v))) / (2 * maxDev)) * chartH;

  // 3. 繪製 Yahoo 經典 5 個交替時間區塊背景 (Vertical Time Blocks: 09, 10, 11, 12, 13)
  const timeLabels = ['09', '10', '11', '12', '13'];
  const blockW = chartW / 5;

  for (let i = 0; i < 5; i++) {
    const bx = pad.left + i * blockW;
    if (i % 2 === 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(bx, pad.top, blockW, chartH + volumeH);
    }
  }

  // 4. 繪製 5 條台股標準水平刻度線 (頂部漲停 +10%、+5%、平盤 0%、-5%、底部跌停 -10%)
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

    // 右側 Y 軸價格數字（頂部為漲停價、底部為跌停價）
    if (!isCenter) {
      ctx.fillStyle    = yVal > basePrice ? '#ff4455' : '#00e87a';
      ctx.font         = '11px JetBrains Mono, monospace';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(yVal.toFixed(2), pad.left + chartW + 8, y);
    }
  }

  // 5. 昨收平盤線與右側深灰圓角膠囊氣泡標籤 (如 825.00)
  const centerLineY = pad.top + chartH / 2;
  const tagStr      = basePrice.toFixed(2);

  ctx.font = '11px JetBrains Mono, monospace';
  const tagW = ctx.measureText(tagStr).width + 12;
  const tagH = 18;
  const tagX = pad.left + chartW + 6;
  const tagY = centerLineY - tagH / 2;

  // 平盤灰色膠囊背景
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 9);
  ctx.fill();

  // 平盤數字
  ctx.fillStyle    = '#ffffff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagStr, tagX + tagW / 2, centerLineY);

  // 6. X 軸時間刻度 (09, 10, 11, 12, 13)
  ctx.fillStyle    = 'rgba(255,255,255,0.5)';
  ctx.font         = '11px Inter, sans-serif';
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';

  for (let i = 0; i < 5; i++) {
    const tx = pad.left + i * blockW + 2;
    const ty = h - pad.bottom + 6;
    ctx.fillText(timeLabels[i], tx, ty);
  }

  // 7. 底部成交量柱 (Volume Bars)
  const volMax   = Math.max(...volumes, 1);
  const volBaseY = h - pad.bottom;

  for (let i = 0; i < TOTAL_PTS; i++) {
    const vx   = toX(i);
    const vLen = (volumes[i] / volMax) * (volumeH - 8);
    const isUpBar = prices[i] >= (prices[i - 1] || prices[i]);

    ctx.fillStyle = isUpBar ? 'rgba(255,68,85,0.65)' : 'rgba(0,232,122,0.65)';
    ctx.fillRect(vx, volBaseY - vLen, 1.8, vLen);
  }

  // 分隔虛線
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH + 5);
  ctx.lineTo(pad.left + chartW, pad.top + chartH + 5);
  ctx.stroke();

  // 8. 繪製台股高對比鮮艷走勢折線 (上漲亮紅 #ff4455 / 下跌亮綠 #00e87a) 與漸層面積
  const isUp      = currPrice >= basePrice;
  const lineColor = isUp ? '#ff4455' : '#00e87a';

  // (A) 漸層面積填滿 Fill Gradient
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

  // (B) 亮眼發光折線 Line Stroke with Glow
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

  // 9. 最新成交價極致醒目焦點指示點
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
async function loadArticles(keyword) {
  dom.articleList.innerHTML = `
    <div class="article-loading">
      <div class="spinner"></div>
      <span>載入文章中...</span>
    </div>`;

  try {
    const res  = await fetch(`${API_BASE}/api/ptt/articles?keyword=${encodeURIComponent(keyword)}&pages=4`);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || '載入失敗');

    state.articles         = data.articles;
    state.filteredArticles = [...data.articles];
    renderArticleList(state.filteredArticles);
    showToast(`已載入 ${data.total} 篇文章`, 'success');
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

  // 點擊選取不同文章前，自動清空上一篇文章的股票卡片與熱門晶片
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
      if (!state.stocks.has(s.code)) continue;
      const entry = state.stocks.get(s.code);

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

    if (state.currentModalCode && state.stocks.has(state.currentModalCode)) {
      openStockModal(state.currentModalCode);
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

  if (entries.length === 0) {
    dom.stocksEmptyState.style.display = 'flex';
    dom.stockCardsWrap.querySelectorAll('.stock-card').forEach(c => c.remove());
    return;
  }
  dom.stocksEmptyState.style.display = 'none';

  const sorted = [...entries].sort((a, b) => {
    if (state.sortMode === 'mentions') return b.mentionCount - a.mentionCount;
    if (state.sortMode === 'change') {
      // 漲跌幅排序：漲 > 沒漲跌 (0%) > 跌
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

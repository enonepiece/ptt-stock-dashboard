# PTT Stock Dashboard — 專案架構、開發規範與關鍵記憶 (GEMINI.md)

本文件彙整了本專案（PTT Stock Dashboard）歷次對話中所累積的核心架構設計、關鍵業務邏輯、效能優化策略與踩坑避錯記憶，以利後續對話與協作時能快速接軌並精準維護。

---

## 1. 專案概述與雙部署架構

本專案支援兩種模式運作：
1. **模式 A：全功能後端模式 (Node.js + Express + WebSocket)**
   - 進入點：`server.js`
   - 提供 `/api/articles`、`/api/pushes`、`/api/stock`、`/api/market`、`/api/analytics/ten-days`，並具備 WebSocket 即時推播。
2. **模式 B：Serverless 邊緣架構 (Cloudflare Pages + Pages Functions)**
   - 進入點：`_worker.js`（同時保留相容的 `worker.js`）
   - 前端靜態託管搭配邊緣無伺服器函式處理 API，內建精簡版個股字典與近十日快照備援。

---

## 2. 核心業務邏輯與關鍵模組

### A. 近十日聲量大數據分析 (`/api/analytics/ten-days`)
1. **隔日封頂統計規則**：
   - 統計過去 10 個交易日的 PTT 盤中/盤後閒聊推文。
   - **時間邊界**：某日（T 日）之推文範圍為 `T 日 08:30:00 ~ T+1 日 08:29:59`。
   - **推文容量與排序**：每檔股票在快照中保留最多 100 則真實推文，且必須嚴格按照日期時間由新到舊（降冪排序，最新推文在最上方）。
2. **自動化數據更新管線**：
   - 更新腳本：`scripts/update_analytics_data.js`
   - 資料快照儲存於：`data/ten_days_snapshot.json`（並同步嵌入 `_worker.js` / `worker.js` 供邊緣端直接讀取）。
   - GitHub Actions 自動排程：`.github/workflows/daily_update.yml` 於每日台股收盤後（UTC 16:30 / 台灣時間 00:30）自動抓取、重新計算、產出快照並自動 Commit & Push 部署。
3. **UI 呈現規範**：
   - 近十日聲量 Top 30 排行榜卡片**不顯示推文摘要**（保持版面俐落）。
   - 點擊卡片時，右側詳情頁面展示該股近 10 日聲量趨勢圖、每日明細表，以及**近 10 日真實提及推文（最多 100 則）**。

---

### B. 股價抓取與 0 秒出價快取機制 (`/api/stock` & 前端)
1. **後端 / Worker 股價抓取策略**：
   - **Yahoo Finance JSON API（首選）**：
     - 上市股票：`https://query1.finance.yahoo.com/v8/finance/chart/{code}.TW?interval=1d&range=1d`
     - 上櫃股票：`https://query1.finance.yahoo.com/v8/finance/chart/{code}.TWO?interval=1d&range=1d`
     - 直接解析 JSON 取出 `regularMarketPrice`、`chartPreviousClose`、`regularMarketVolume` 等，耗時僅 50ms ~ 200ms。
   - **TWSE 證交所 API（備援）**：
     - 解析 `z` (現價) -> `pz` (盤前/暫存價) -> `a1`/`b1` (最佳買賣一檔) -> `o` (開盤價) -> `y` (昨收價)。
2. **前端 0 延遲出價快取架構 (`globalPriceCache`)**：
   - **問題痛點**：舊版切換文章時卡片重新初始化為 `price: null`，使用者會看到卡片顯示 `─` 長達數秒甚至等待 30 秒倒數計時結束。
   - **解決方案**：
     - 在 `app.js` 建立全域持久快取 `globalPriceCache`。
     - 在 `processStocksFromPushes` 建立卡片物件的第一毫秒，直接從快取讀取股價與漲跌幅度。
     - 在 `DOMContentLoaded` 進入網頁瞬間，自動併發背景預載 Top 30 熱門權值股行情，達成點擊文章 **第一幀 (0ms) 立即顯示真實行情**。

---

## 3. 重要開發與除錯記憶 (Lessons Learned)

1. **語法完整性驗證**：
   - 任何涉及 `_worker.js`、`worker.js` 或 `server.js` 的修改，提交前必須執行 `node -c <filename>` 進行語法檢驗，避免多餘大括號或語法錯誤造成 Cloudflare Pages Functions 構建失敗。
2. **多執行環境同步**：
   - 本專案具備 `server.js` 與 `_worker.js`/`worker.js` 兩套後端實作。修改 API 邏輯（如股價解析、近十日分析計算）時，必須同步更新這兩者，確保本地 Node.js 執行與雲端 Cloudflare Pages 行為 100% 一致。
3. **PTT 文章與推文解析**：
   - 抓取 PTT 內容時須帶上 Cookie：`over18=1`。
   - 推文去重與排序以 `ipdatetime` 與文章原始先後順序為準。
4. **前端 DOM 更新與競態防護**：
   - 個股即時更新需同時維護 `state.stocks` 資料流與 DOM 上的定點更新 (`updateStockCardDOM`)，避免非同步網路請求覆蓋使用者最新點選狀態。

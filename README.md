# PTT 輿情 × 台股即時看板 (PTT Stock Dashboard)

這是一個專為台灣股民開發的 **PTT 股板 (Stock) 即時輿情監測與台股即時報價看盤系統**。系統能自動抓取 PTT 股板文章（如盤中、盤後閒聊），即時串流推文，並自動辨識推文中提及的股票代號與鄉民常用綽號，同步顯示 Yahoo 股市的即時報價與 1 分鐘分時走勢圖。

![Dashboard Preview](screenshot.png) *(建議可在此補上您的系統截圖)*

## ✨ 核心特色功能

1. **PTT 即時推文追蹤**
   - 自動即時抓取 PTT 股板文章（支援自動篩選今日盤中、盤後閒聊）。
   - 當 PTT 原生搜尋索引延遲時，具備自動備援機制，確保最新文章不漏接。
   - 推文串流自動更新，不需手動 F5 重新整理。
   - 推文情緒分析條（顯示「推」與「噓」的即時比例）。

2. **強大的台股與鄉民綽號辨識系統**
   - 內建全台股 **2,300+ 檔**上市/上櫃公司及 ETF 完整字典。
   - 支援大量 PTT 專屬綽號辨識（例如：`GG` = 台積電、`肉鬆` = 廣達、`大象` = 鈊象、`發哥` = 聯發科、`瑤姐` = 00981A... 等）。
   - 自動正規化處理：支援忽略「銀行」、「金控」、「-KY」後綴，並支援 ETF 短代號（如 `981A`、`988`）。

3. **即時報價與分時走勢圖**
   - 自動比對推文中被提及的股票，於左側面板即時顯示前 30 大熱門討論股票的即時價格與漲跌。
   - 直接串接 Yahoo Finance 即時 API，確保價格零延遲且精準。
   - 支援點擊個股卡片或將滑鼠游標停留在推文內的股票標籤上，自動展開 **1 分鐘即時分時走勢圖 (Intraday Chart)**。
   - 走勢圖支援動態 Y 軸縮放（根據盤中高低點動態調整，讓波動更清晰）。

4. **現代化且響應式 UI (RWD)**
   - 採用 Glassmorphism（毛玻璃）與 Dark Mode 現代化質感設計。
   - 在電腦版上採用雙欄或三欄佈局；在手機版上則會自動切換為底部導覽列（導航 Tabs），方便單手閱讀推文與看盤。

## 🛠 技術堆疊

- **前端**：Vanilla JavaScript (ES6+), HTML5, CSS3 
  - *無使用大型框架，極致輕量化與高效能。*
  - 使用 `Chart.js` 繪製精美的即時股價走勢圖。
- **後端 (本地開發)**：Node.js, Express, Cheerio, Node-Fetch
  - `server.js` 提供本地端代理伺服器，解決 PTT 與 Yahoo API 的 CORS 跨域限制問題。
- **無伺服器部署 (生產環境)**：Cloudflare Pages / Cloudflare Workers
  - `_worker.js` 提供完整的 Edge Function 支援，讓整個專案可免費且高效地部署在 Cloudflare 上，免去自建伺服器的成本。

## 🚀 本地端安裝與執行

1. **下載專案**
   ```bash
   git clone https://github.com/您的帳號/pttStockDashboard.git
   cd pttStockDashboard
   ```

2. **安裝依賴套件 (僅限本地開發)**
   ```bash
   npm install express node-fetch cheerio cors
   ```
   *(或者直接執行 `npm install` 若有 package.json)*

3. **啟動本地代理伺服器**
   ```bash
   node server.js
   ```

4. **開啟瀏覽器**
   - 瀏覽網址：[http://localhost:3000](http://localhost:3000)

## ☁️ 部署到 Cloudflare Pages

此專案原生支援 Cloudflare Pages 部署，無需額外架設伺服器：

1. 登入 Cloudflare，進入 **Pages** 控制台。
2. 建立新的 Project，並連結您的 GitHub 儲存庫。
3. 建立設定（Build settings）全部留白（因為是純靜態檔 + Functions）。
4. 部署後，Cloudflare 會自動偵測 `_worker.js` 作為 API 路由，完美處理 CORS 請求。

## 📂 專案結構簡介

```text
├── index.html        # 前端主畫面
├── app.js            # 前端核心邏輯 (UI 互動、圖表繪製、API 輪詢)
├── style.css         # 全局樣式表 (Dark mode, RWD, Animations)
├── stockDict.js      # 台股 2,300+ 檔股票名稱與綽號對照字典
├── server.js         # 本地開發用的 Node.js 代理伺服器
├── _worker.js        # 供 Cloudflare Pages 使用的 Edge Serverless 邏輯
├── scratch/          # 開發工具腳本 (如 build_stock_dict.js 爬取最新股票名單)
└── wrangler.toml     # Cloudflare Worker 配置檔 (可選)
```

## 🤝 貢獻與修改

- 如果發現某些 PTT 新的股票綽號沒被抓到，您可以修改 `scratch/build_stock_dict.js` 裡的 `customNicknames` 物件，並重新執行 `node scratch/build_stock_dict.js` 來生成最新的 `stockDict.js`。

## 📜 授權條款

MIT License.

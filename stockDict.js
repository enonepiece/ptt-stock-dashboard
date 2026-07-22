/**
 * stockDict.js - 台股名稱字典（含 PTT 鄉民綽號）
 * 來源：PTT 鄉民百科、PTT Stock板鄉民綽號對照表、Threads 鄉民整理
 * 同時支援 Node.js (module.exports) 和瀏覽器 (window.STOCK_DICT)
 */

const STOCK_DICT = [
  {
    "code": "2330",
    "market": "tse",
    "names": [
      "台積電",
      "台積",
      "積電",
      "護國神山",
      "神山",
      "TSMC",
      "台GG",
      "GG",
      "阿積",
      "台積仔",
      "積電仔",
      "大哥",
      "魏哲家",
      "哲家",
      "張忠謀"
    ]
  },
  {
    "code": "2303",
    "market": "tse",
    "names": [
      "聯電",
      "UMC",
      "二哥",
      "小積電",
      "聯電仔",
      "大碩",
      "聯二哥"
    ]
  },
  {
    "code": "2454",
    "market": "tse",
    "names": [
      "聯發科",
      "MTK",
      "發哥",
      "天璣",
      "阿科"
    ]
  },
  {
    "code": "2379",
    "market": "tse",
    "names": [
      "瑞昱",
      "瑞昱半導體",
      "螃蟹",
      "Realtek",
      "帝王蟹"
    ]
  },
  {
    "code": "2344",
    "market": "tse",
    "names": [
      "華邦電",
      "華邦",
      "華崩電",
      "邦邦"
    ]
  },
  {
    "code": "2337",
    "market": "tse",
    "names": [
      "旺宏",
      "旺宏電子",
      "旺綠"
    ]
  },
  {
    "code": "3711",
    "market": "tse",
    "names": [
      "日月光投控",
      "日月光",
      "ASE",
      "神教",
      "日月神教"
    ]
  },
  {
    "code": "6770",
    "market": "tse",
    "names": [
      "力積電",
      "力積",
      "小GG",
      "PSMC",
      "天后"
    ]
  },
  {
    "code": "5347",
    "market": "otc",
    "names": [
      "世界先進",
      "VIS",
      "仙境RO",
      "小GG",
      "DIO"
    ]
  },
  {
    "code": "2408",
    "market": "tse",
    "names": [
      "南亞科",
      "南亞科技",
      "牙科",
      "NANYA"
    ]
  },
  {
    "code": "3034",
    "market": "otc",
    "names": [
      "聯詠",
      "聯詠科技",
      "滷肉",
      "Novatek"
    ]
  },
  {
    "code": "6488",
    "market": "otc",
    "names": [
      "環球晶",
      "環球晶圓",
      "GlobalWafers"
    ]
  },
  {
    "code": "3443",
    "market": "otc",
    "names": [
      "創意",
      "創意電子"
    ]
  },
  {
    "code": "3691",
    "market": "otc",
    "names": [
      "智原",
      "智原科技",
      "邰哥",
      "Faraday"
    ]
  },
  {
    "code": "3130",
    "market": "otc",
    "names": [
      "穩懋",
      "穩懋半導體",
      "穩套",
      "WIN Semi"
    ]
  },
  {
    "code": "6259",
    "market": "otc",
    "names": [
      "精成科",
      "精成科技",
      "精神科"
    ]
  },
  {
    "code": "2316",
    "market": "tse",
    "names": [
      "楠梓電",
      "楠電",
      "男子電"
    ]
  },
  {
    "code": "8069",
    "market": "tse",
    "names": [
      "元太",
      "元太科技",
      "鰻魚飯",
      "E Ink"
    ]
  },
  {
    "code": "2317",
    "market": "tse",
    "names": [
      "鴻海",
      "海公公",
      "郭董",
      "老鴻",
      "鴻海精密",
      "郭台銘",
      "公公",
      "海邊"
    ]
  },
  {
    "code": "2382",
    "market": "tse",
    "names": [
      "廣達",
      "廣達電腦",
      "肉鬆",
      "肉鬆店",
      "Quanta"
    ]
  },
  {
    "code": "2357",
    "market": "tse",
    "names": [
      "華碩",
      "ASUS",
      "石頭店",
      "阿碩",
      "石頭"
    ]
  },
  {
    "code": "2353",
    "market": "tse",
    "names": [
      "宏碁",
      "ACER"
    ]
  },
  {
    "code": "2308",
    "market": "tse",
    "names": [
      "台達電",
      "台達",
      "Delta"
    ]
  },
  {
    "code": "2301",
    "market": "tse",
    "names": [
      "光寶科",
      "光寶",
      "Liteon",
      "點燈"
    ]
  },
  {
    "code": "2376",
    "market": "tse",
    "names": [
      "技嘉",
      "技嘉科技",
      "雞排店",
      "GIGABYTE",
      "G心",
      "雞排"
    ]
  },
  {
    "code": "2356",
    "market": "tse",
    "names": [
      "英業達",
      "小英",
      "英業達集團",
      "英業金"
    ]
  },
  {
    "code": "2352",
    "market": "tse",
    "names": [
      "佳世達",
      "明基佳世達",
      "BenQ",
      "笨Q"
    ]
  },
  {
    "code": "3008",
    "market": "tse",
    "names": [
      "大立光",
      "立光",
      "阿光",
      "股王",
      "大力肛"
    ]
  },
  {
    "code": "2498",
    "market": "tse",
    "names": [
      "宏達電",
      "HTC",
      "紅茶",
      "紅茶店",
      "火腿腸",
      "阿姨的股",
      "hㄒㄈ"
    ]
  },
  {
    "code": "3231",
    "market": "tse",
    "names": [
      "緯創",
      "緯創資通",
      "Wistron"
    ]
  },
  {
    "code": "2324",
    "market": "tse",
    "names": [
      "仁寶",
      "仁寶電腦",
      "Compal",
      "寶寶"
    ]
  },
  {
    "code": "2360",
    "market": "tse",
    "names": [
      "致茂",
      "致茂電子"
    ]
  },
  {
    "code": "2327",
    "market": "tse",
    "names": [
      "國巨",
      "阿巨"
    ]
  },
  {
    "code": "2409",
    "market": "tse",
    "names": [
      "友達",
      "阿達",
      "戀人未滿",
      "AUO",
      "戀人"
    ]
  },
  {
    "code": "3481",
    "market": "tse",
    "names": [
      "群創",
      "群創光電",
      "Innolux",
      "包子"
    ]
  },
  {
    "code": "6669",
    "market": "tse",
    "names": [
      "緯穎",
      "緯穎科技",
      "Wiwynn"
    ]
  },
  {
    "code": "2395",
    "market": "tse",
    "names": [
      "研華",
      "研華科技",
      "Advantech"
    ]
  },
  {
    "code": "3044",
    "market": "otc",
    "names": [
      "健鼎",
      "健鼎科技"
    ]
  },
  {
    "code": "6274",
    "market": "otc",
    "names": [
      "台燿",
      "台燿科技"
    ]
  },
  {
    "code": "8046",
    "market": "otc",
    "names": [
      "南電",
      "南電科技"
    ]
  },
  {
    "code": "3037",
    "market": "otc",
    "names": [
      "欣興",
      "欣興電子",
      "麵包店",
      "客運"
    ]
  },
  {
    "code": "4938",
    "market": "tse",
    "names": [
      "和碩",
      "和碩聯合",
      "Pegatron",
      "皮卡"
    ]
  },
  {
    "code": "2385",
    "market": "tse",
    "names": [
      "群光",
      "群光電子"
    ]
  },
  {
    "code": "3702",
    "market": "tse",
    "names": [
      "大聯大",
      "大聯大控股"
    ]
  },
  {
    "code": "2367",
    "market": "tse",
    "names": [
      "燿華",
      "燿華電子"
    ]
  },
  {
    "code": "6278",
    "market": "tse",
    "names": [
      "台表科",
      "台表哥",
      "台虹"
    ]
  },
  {
    "code": "3293",
    "market": "otc",
    "names": [
      "鈊象",
      "鈊象電子",
      "大象"
    ]
  },
  {
    "code": "8103",
    "market": "otc",
    "names": [
      "波若威",
      "波波"
    ]
  },
  {
    "code": "2412",
    "market": "tse",
    "names": [
      "中華電",
      "中電",
      "中華電信",
      "種花",
      "種花電信",
      "種花電"
    ]
  },
  {
    "code": "3045",
    "market": "tse",
    "names": [
      "台灣大",
      "台灣大哥大",
      "台灣大哥",
      "TWM"
    ]
  },
  {
    "code": "4904",
    "market": "tse",
    "names": [
      "遠傳",
      "遠傳電信",
      "FET"
    ]
  },
  {
    "code": "2882",
    "market": "tse",
    "names": [
      "國泰金",
      "國泰",
      "國泰金控",
      "大樹",
      "大樹金"
    ]
  },
  {
    "code": "2881",
    "market": "tse",
    "names": [
      "富邦金",
      "富邦",
      "富邦金控",
      "阿邦",
      "魚翅金",
      "二元金",
      "邦邦"
    ]
  },
  {
    "code": "2891",
    "market": "tse",
    "names": [
      "中信金",
      "中信",
      "中信金控",
      "廢牡蠣",
      "一元金",
      "牡蠣金"
    ]
  },
  {
    "code": "2886",
    "market": "tse",
    "names": [
      "兆豐金",
      "兆豐",
      "兆豐金控",
      "紐約金"
    ]
  },
  {
    "code": "2892",
    "market": "tse",
    "names": [
      "第一金",
      "第一銀行",
      "一銀"
    ]
  },
  {
    "code": "2884",
    "market": "tse",
    "names": [
      "玉山金",
      "玉山",
      "玉山金控",
      "高山金"
    ]
  },
  {
    "code": "2887",
    "market": "tse",
    "names": [
      "台新金",
      "台新",
      "台新金控"
    ]
  },
  {
    "code": "2880",
    "market": "tse",
    "names": [
      "華南金",
      "華南",
      "華南金控",
      "拉拉金",
      "拉拉熊金"
    ]
  },
  {
    "code": "2890",
    "market": "tse",
    "names": [
      "永豐金",
      "永豐",
      "永豐金控",
      "何家金"
    ]
  },
  {
    "code": "2888",
    "market": "tse",
    "names": [
      "新光金",
      "新光",
      "新光金控",
      "西瓜金",
      "西瓜"
    ]
  },
  {
    "code": "2883",
    "market": "tse",
    "names": [
      "開發金",
      "開發",
      "KGI"
    ]
  },
  {
    "code": "2885",
    "market": "tse",
    "names": [
      "元大金",
      "元大",
      "元大金控"
    ]
  },
  {
    "code": "5880",
    "market": "tse",
    "names": [
      "合庫金",
      "合庫",
      "合作金庫"
    ]
  },
  {
    "code": "2801",
    "market": "tse",
    "names": [
      "彰銀",
      "彰化銀行"
    ]
  },
  {
    "code": "2609",
    "market": "tse",
    "names": [
      "陽明",
      "陽明海運",
      "陽粉",
      "阿陽"
    ]
  },
  {
    "code": "2603",
    "market": "tse",
    "names": [
      "長榮",
      "長榮海運",
      "榮仔",
      "綠巨人"
    ]
  },
  {
    "code": "2615",
    "market": "tse",
    "names": [
      "萬海",
      "萬海航運"
    ]
  },
  {
    "code": "2618",
    "market": "tse",
    "names": [
      "長榮航空",
      "長航"
    ]
  },
  {
    "code": "2610",
    "market": "tse",
    "names": [
      "華航",
      "中華航空"
    ]
  },
  {
    "code": "2605",
    "market": "tse",
    "names": [
      "新興",
      "新興航運"
    ]
  },
  {
    "code": "2002",
    "market": "tse",
    "names": [
      "中鋼",
      "中國鋼鐵",
      "中肛",
      "肛肛"
    ]
  },
  {
    "code": "1301",
    "market": "tse",
    "names": [
      "台塑",
      "台灣塑膠"
    ]
  },
  {
    "code": "1303",
    "market": "tse",
    "names": [
      "南亞",
      "南亞塑膠"
    ]
  },
  {
    "code": "1326",
    "market": "tse",
    "names": [
      "台化",
      "台灣化纖"
    ]
  },
  {
    "code": "1102",
    "market": "tse",
    "names": [
      "亞泥",
      "亞洲水泥",
      "雅妮"
    ]
  },
  {
    "code": "1101",
    "market": "tse",
    "names": [
      "台泥",
      "台灣水泥"
    ]
  },
  {
    "code": "2105",
    "market": "tse",
    "names": [
      "正新",
      "正新橡膠"
    ]
  },
  {
    "code": "1314",
    "market": "tse",
    "names": [
      "中石化",
      "中國石化",
      "一生一世"
    ]
  },
  {
    "code": "0050",
    "market": "tse",
    "names": [
      "元大台灣50",
      "0050",
      "五十",
      "ETF50",
      "台灣五十",
      "大盤ETF"
    ]
  },
  {
    "code": "0056",
    "market": "tse",
    "names": [
      "元大高股息",
      "0056",
      "高股息",
      "ETF56"
    ]
  },
  {
    "code": "00878",
    "market": "tse",
    "names": [
      "國泰永續高股息",
      "00878",
      "小資ETF"
    ]
  },
  {
    "code": "00881",
    "market": "tse",
    "names": [
      "國泰台灣5G+",
      "00881"
    ]
  },
  {
    "code": "006208",
    "market": "tse",
    "names": [
      "富邦台灣50",
      "006208",
      "富邦50"
    ]
  },
  {
    "code": "00892",
    "market": "tse",
    "names": [
      "富邦台灣半導體",
      "00892",
      "半導體ETF"
    ]
  },
  {
    "code": "00670L",
    "market": "tse",
    "names": [
      "元大台灣50正2",
      "正2",
      "二倍槓桿",
      "正二"
    ]
  },
  {
    "code": "00671R",
    "market": "tse",
    "names": [
      "元大台灣50反1",
      "反1",
      "反向ETF",
      "反一"
    ]
  },
  {
    "code": "2912",
    "market": "tse",
    "names": [
      "統一超",
      "7-11",
      "小七",
      "統一超商"
    ]
  },
  {
    "code": "1216",
    "market": "tse",
    "names": [
      "統一",
      "統一企業",
      "統二"
    ]
  },
  {
    "code": "2207",
    "market": "tse",
    "names": [
      "和泰車",
      "和泰",
      "Toyota台灣",
      "頭又大"
    ]
  },
  {
    "code": "2915",
    "market": "tse",
    "names": [
      "潤泰全",
      "潤泰"
    ]
  },
  {
    "code": "6508",
    "market": "tse",
    "names": [
      "定穎投控",
      "定穎",
      "定穎頭痛"
    ]
  },
  {
    "code": "5388",
    "market": "otc",
    "names": [
      "中磊",
      "中磊電子"
    ]
  },
  {
    "code": "2401",
    "market": "tse",
    "names": [
      "凌陽",
      "羚羊"
    ]
  },
  {
    "code": "3515",
    "market": "tse",
    "names": [
      "華擎",
      "小石頭"
    ]
  },
  {
    "code": "2377",
    "market": "tse",
    "names": [
      "微星",
      "微星科技",
      "小星星",
      "MSI"
    ]
  },
  {
    "code": "2430",
    "market": "tse",
    "names": [
      "燦坤",
      "燦坤實業",
      "黃色鬼屋"
    ]
  },
  {
    "code": "2492",
    "market": "tse",
    "names": [
      "華新科",
      "華二哥"
    ]
  },
  {
    "code": "1444",
    "market": "tse",
    "names": [
      "力麗",
      "傢俱"
    ]
  },
  {
    "code": "3576",
    "market": "tse",
    "names": [
      "聯合再生",
      "聯合往生",
      "往生"
    ]
  },
  {
    "code": "2368",
    "market": "tse",
    "names": [
      "金像電",
      "金項鍊"
    ]
  },
  {
    "code": "9103",
    "market": "tse",
    "names": [
      "美德醫療-DR",
      "美德醫DR",
      "美德醫",
      "沒的醫"
    ]
  },
  {
    "code": "2371",
    "market": "tse",
    "names": [
      "大同",
      "大同公司",
      "電鍋"
    ]
  },
  {
    "code": "2905",
    "market": "tse",
    "names": [
      "三商",
      "三商企業",
      "牛肉麵"
    ]
  },
  {
    "code": "4930",
    "market": "tse",
    "names": [
      "燦星網",
      "小家電"
    ]
  },
  {
    "code": "6271",
    "market": "tse",
    "names": [
      "同欣電",
      "同性戀"
    ]
  },
  {
    "code": "3552",
    "market": "otc",
    "names": [
      "同致",
      "同性戀"
    ]
  },
  {
    "code": "2345",
    "market": "tse",
    "names": [
      "智邦",
      "智邦科技",
      "智崩"
    ]
  },
  {
    "code": "6558",
    "market": "tse",
    "names": [
      "興能高",
      "杏仁糕"
    ]
  },
  {
    "code": "2458",
    "market": "tse",
    "names": [
      "義隆",
      "義隆電",
      "翼龍"
    ]
  },
  {
    "code": "2474",
    "market": "tse",
    "names": [
      "可成",
      "機殼王",
      "賣廠王"
    ]
  },
  {
    "code": "2354",
    "market": "tse",
    "names": [
      "鴻準",
      "鴻準精密",
      "準哥"
    ]
  },
  {
    "code": "6188",
    "market": "otc",
    "names": [
      "廣明",
      "廣明光電",
      "小明"
    ]
  },
  {
    "code": "6239",
    "market": "tse",
    "names": [
      "力成",
      "力成科技",
      "音浪"
    ]
  },
  {
    "code": "1580",
    "market": "otc",
    "names": [
      "新麥",
      "麵包機"
    ]
  },
  {
    "code": "9934",
    "market": "tse",
    "names": [
      "成霖",
      "可愛教主",
      "水龍頭"
    ]
  },
  {
    "code": "1731",
    "market": "tse",
    "names": [
      "美吾華",
      "染髮劑"
    ]
  },
  {
    "code": "1760",
    "market": "tse",
    "names": [
      "寶齡富錦",
      "保齡球"
    ]
  },
  {
    "code": "2947",
    "market": "tse",
    "names": [
      "振宇五金",
      "五金行"
    ]
  },
  {
    "code": "6153",
    "market": "tse",
    "names": [
      "嘉聯益",
      "軟板王",
      "嘎聯益"
    ]
  },
  {
    "code": "8433",
    "market": "tse",
    "names": [
      "弘帆",
      "小寶雅"
    ]
  },
  {
    "code": "2355",
    "market": "tse",
    "names": [
      "敬鵬",
      "敬鵬工業",
      "鵬哥"
    ]
  },
  {
    "code": "6150",
    "market": "otc",
    "names": [
      "撼訊",
      "威力彩"
    ]
  },
  {
    "code": "3260",
    "market": "otc",
    "names": [
      "威剛",
      "威剛科技",
      "威而鋼"
    ]
  },
  {
    "code": "9904",
    "market": "tse",
    "names": [
      "寶成",
      "寶成工業",
      "張寶成"
    ]
  },
  {
    "code": "1504",
    "market": "tse",
    "names": [
      "東元",
      "東元電機",
      "冷氣"
    ]
  },
  {
    "code": "2641",
    "market": "otc",
    "names": [
      "正德",
      "正德海運",
      "土地公"
    ]
  },
  {
    "code": "6533",
    "market": "tse",
    "names": [
      "晶心科",
      "晶心科技",
      "精神科"
    ]
  },
  {
    "code": "3483",
    "market": "otc",
    "names": [
      "力致",
      "力致科技",
      "荔枝",
      "奶雞"
    ]
  },
  {
    "code": "5876",
    "market": "tse",
    "names": [
      "上海商銀",
      "榮家銀"
    ]
  },
  {
    "code": "2867",
    "market": "tse",
    "names": [
      "三商人壽",
      "三商獸"
    ]
  },
  {
    "code": "2809",
    "market": "tse",
    "names": [
      "京城銀",
      "老董"
    ]
  }
];

// ── 建立快速查詢索引 ──────────────────────────────────────
const NAME_INDEX = new Map();
const CODE_INDEX = new Map();

for (const stock of STOCK_DICT) {
  CODE_INDEX.set(stock.code, stock);
  for (const name of stock.names) {
    if (name !== stock.code && !NAME_INDEX.has(name)) {
      NAME_INDEX.set(name, stock);
    }
  }
}

/**
 * 從文字中偵測所有提及的台股
 * @param {string} text
 * @returns {Array<{code, names, market, matchedTerm}>}
 */
function detectStocks(text) {
  const found = new Map();

  // 1. 先掃描中文名稱 / 綽號（由長到短）
  const sortedNames = [...NAME_INDEX.keys()].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (name.length >= 2 && text.includes(name)) {
      const stock = NAME_INDEX.get(name);
      if (!found.has(stock.code)) {
        found.set(stock.code, { ...stock, matchedTerm: name });
      }
    }
  }

  // 2. 掃描數字代號（4-6 位）
  const codePattern = /(?<!\d)(\d{4,6})(?!\d)/g;
  let match;
  while ((match = codePattern.exec(text)) !== null) {
    const code = match[1];
    if (CODE_INDEX.has(code) && !found.has(code)) {
      const stock = CODE_INDEX.get(code);
      found.set(code, { ...stock, matchedTerm: code });
    }
  }

  return [...found.values()];
}

/**
 * 將文字中的股票名稱標記為 HTML span
 */
function highlightStocksInText(text) {
  if (!text) return '';

  const esc = str => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const matches = [];

  // 1. 搜尋中文名稱 / 綽號 (由長到短)
  const sortedNames = [...NAME_INDEX.keys()].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (name.length < 2) continue;
    let pos = 0;
    while ((pos = text.indexOf(name, pos)) !== -1) {
      const end = pos + name.length;
      matches.push({ start: pos, end, stock: NAME_INDEX.get(name), matchedText: name });
      pos = end;
    }
  }

  // 2. 搜尋數字代號 (4-6 位)
  const codePattern = /(?<!\d)(\d{4,6})(?!\d)/g;
  let match;
  while ((match = codePattern.exec(text)) !== null) {
    const code = match[1];
    if (CODE_INDEX.has(code)) {
      matches.push({
        start: match.index,
        end: match.index + code.length,
        stock: CODE_INDEX.get(code),
        matchedText: code,
      });
    }
  }

  if (matches.length === 0) {
    return esc(text);
  }

  // 依起始位置排序；若位置相同，優先採用較長匹配
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // 過濾重複 / 重疊區間
  const filtered = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  // 單次拼接 HTML，徹底避免 HTML 標籤屬性被二次取代
  let result = '';
  let currentIndex = 0;

  for (const m of filtered) {
    result += esc(text.slice(currentIndex, m.start));
    result += `<mark class="stock-tag" data-code="${m.stock.code}">${esc(m.matchedText)}</mark>`;
    currentIndex = m.end;
  }
  result += esc(text.slice(currentIndex));

  return result;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STOCK_DICT, NAME_INDEX, CODE_INDEX, detectStocks, highlightStocksInText };
} else {
  window.STOCK_DICT = STOCK_DICT;
  window.NAME_INDEX = NAME_INDEX;
  window.CODE_INDEX = CODE_INDEX;
  window.detectStocks = detectStocks;
  window.highlightStocksInText = highlightStocksInText;
}

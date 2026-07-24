/**
 * stockDict.js - 台股全市場 (上市/上櫃 2,300+ 檔) 股票與 PTT 熱門綽號字典
 */

const STOCK_DICT = [
  {
    "code": "1101",
    "market": "tse",
    "names": [
      "台泥",
      "台灣水泥"
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
    "code": "1103",
    "market": "tse",
    "names": [
      "嘉泥"
    ]
  },
  {
    "code": "1104",
    "market": "tse",
    "names": [
      "環泥"
    ]
  },
  {
    "code": "1108",
    "market": "tse",
    "names": [
      "幸福"
    ]
  },
  {
    "code": "1109",
    "market": "tse",
    "names": [
      "信大"
    ]
  },
  {
    "code": "1110",
    "market": "tse",
    "names": [
      "東泥"
    ]
  },
  {
    "code": "1201",
    "market": "tse",
    "names": [
      "味全"
    ]
  },
  {
    "code": "1203",
    "market": "tse",
    "names": [
      "味王"
    ]
  },
  {
    "code": "1210",
    "market": "tse",
    "names": [
      "大成"
    ]
  },
  {
    "code": "1213",
    "market": "tse",
    "names": [
      "大飲"
    ]
  },
  {
    "code": "1215",
    "market": "tse",
    "names": [
      "卜蜂"
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
    "code": "1217",
    "market": "tse",
    "names": [
      "愛之味"
    ]
  },
  {
    "code": "1218",
    "market": "tse",
    "names": [
      "泰山"
    ]
  },
  {
    "code": "1219",
    "market": "tse",
    "names": [
      "福壽"
    ]
  },
  {
    "code": "1220",
    "market": "tse",
    "names": [
      "台榮"
    ]
  },
  {
    "code": "1225",
    "market": "tse",
    "names": [
      "福懋油"
    ]
  },
  {
    "code": "1227",
    "market": "tse",
    "names": [
      "佳格"
    ]
  },
  {
    "code": "1229",
    "market": "tse",
    "names": [
      "聯華"
    ]
  },
  {
    "code": "1231",
    "market": "tse",
    "names": [
      "聯華食"
    ]
  },
  {
    "code": "1232",
    "market": "tse",
    "names": [
      "大統益"
    ]
  },
  {
    "code": "1233",
    "market": "tse",
    "names": [
      "天仁"
    ]
  },
  {
    "code": "1234",
    "market": "tse",
    "names": [
      "黑松"
    ]
  },
  {
    "code": "1235",
    "market": "tse",
    "names": [
      "興泰"
    ]
  },
  {
    "code": "1236",
    "market": "tse",
    "names": [
      "宏亞"
    ]
  },
  {
    "code": "1256",
    "market": "tse",
    "names": [
      "鮮活果汁-KY",
      "鮮活果汁"
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
    "code": "1304",
    "market": "tse",
    "names": [
      "台聚"
    ]
  },
  {
    "code": "1305",
    "market": "tse",
    "names": [
      "華夏"
    ]
  },
  {
    "code": "1307",
    "market": "tse",
    "names": [
      "三芳"
    ]
  },
  {
    "code": "1308",
    "market": "tse",
    "names": [
      "亞聚"
    ]
  },
  {
    "code": "1309",
    "market": "tse",
    "names": [
      "台達化"
    ]
  },
  {
    "code": "1310",
    "market": "tse",
    "names": [
      "台苯"
    ]
  },
  {
    "code": "1312",
    "market": "tse",
    "names": [
      "國喬"
    ]
  },
  {
    "code": "1313",
    "market": "tse",
    "names": [
      "聯成"
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
    "code": "1315",
    "market": "tse",
    "names": [
      "達新"
    ]
  },
  {
    "code": "1316",
    "market": "tse",
    "names": [
      "上曜"
    ]
  },
  {
    "code": "1319",
    "market": "tse",
    "names": [
      "東陽"
    ]
  },
  {
    "code": "1321",
    "market": "tse",
    "names": [
      "大洋"
    ]
  },
  {
    "code": "1323",
    "market": "tse",
    "names": [
      "永裕"
    ]
  },
  {
    "code": "1324",
    "market": "tse",
    "names": [
      "地球"
    ]
  },
  {
    "code": "1325",
    "market": "tse",
    "names": [
      "恆大"
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
    "code": "1337",
    "market": "tse",
    "names": [
      "再生-KY",
      "再生"
    ]
  },
  {
    "code": "1338",
    "market": "tse",
    "names": [
      "廣華-KY",
      "廣華"
    ]
  },
  {
    "code": "1339",
    "market": "tse",
    "names": [
      "昭輝"
    ]
  },
  {
    "code": "1340",
    "market": "tse",
    "names": [
      "勝悅-KY",
      "勝悅"
    ]
  },
  {
    "code": "1341",
    "market": "tse",
    "names": [
      "富林-KY",
      "富林"
    ]
  },
  {
    "code": "1342",
    "market": "tse",
    "names": [
      "八貫"
    ]
  },
  {
    "code": "1402",
    "market": "tse",
    "names": [
      "遠東新"
    ]
  },
  {
    "code": "1409",
    "market": "tse",
    "names": [
      "新纖"
    ]
  },
  {
    "code": "1410",
    "market": "tse",
    "names": [
      "南染"
    ]
  },
  {
    "code": "1413",
    "market": "tse",
    "names": [
      "宏洲"
    ]
  },
  {
    "code": "1414",
    "market": "tse",
    "names": [
      "東和"
    ]
  },
  {
    "code": "1416",
    "market": "tse",
    "names": [
      "廣豐"
    ]
  },
  {
    "code": "1417",
    "market": "tse",
    "names": [
      "嘉裕"
    ]
  },
  {
    "code": "1418",
    "market": "tse",
    "names": [
      "東華"
    ]
  },
  {
    "code": "1419",
    "market": "tse",
    "names": [
      "新紡"
    ]
  },
  {
    "code": "1423",
    "market": "tse",
    "names": [
      "利華"
    ]
  },
  {
    "code": "1432",
    "market": "tse",
    "names": [
      "大魯閣"
    ]
  },
  {
    "code": "1434",
    "market": "tse",
    "names": [
      "福懋"
    ]
  },
  {
    "code": "1435",
    "market": "tse",
    "names": [
      "中福"
    ]
  },
  {
    "code": "1436",
    "market": "tse",
    "names": [
      "華友聯"
    ]
  },
  {
    "code": "1437",
    "market": "tse",
    "names": [
      "勤益控"
    ]
  },
  {
    "code": "1438",
    "market": "tse",
    "names": [
      "三地開發"
    ]
  },
  {
    "code": "1439",
    "market": "tse",
    "names": [
      "雋揚"
    ]
  },
  {
    "code": "1440",
    "market": "tse",
    "names": [
      "南紡"
    ]
  },
  {
    "code": "1441",
    "market": "tse",
    "names": [
      "大東"
    ]
  },
  {
    "code": "1442",
    "market": "tse",
    "names": [
      "名軒"
    ]
  },
  {
    "code": "1443",
    "market": "tse",
    "names": [
      "立益物流"
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
    "code": "1445",
    "market": "tse",
    "names": [
      "大宇"
    ]
  },
  {
    "code": "1446",
    "market": "tse",
    "names": [
      "宏和"
    ]
  },
  {
    "code": "1447",
    "market": "tse",
    "names": [
      "力鵬"
    ]
  },
  {
    "code": "1449",
    "market": "tse",
    "names": [
      "佳和"
    ]
  },
  {
    "code": "1451",
    "market": "tse",
    "names": [
      "年興"
    ]
  },
  {
    "code": "1452",
    "market": "tse",
    "names": [
      "宏益"
    ]
  },
  {
    "code": "1453",
    "market": "tse",
    "names": [
      "大將"
    ]
  },
  {
    "code": "1454",
    "market": "tse",
    "names": [
      "台富"
    ]
  },
  {
    "code": "1455",
    "market": "tse",
    "names": [
      "集盛"
    ]
  },
  {
    "code": "1456",
    "market": "tse",
    "names": [
      "怡華"
    ]
  },
  {
    "code": "1457",
    "market": "tse",
    "names": [
      "宜進"
    ]
  },
  {
    "code": "1459",
    "market": "tse",
    "names": [
      "聯發"
    ]
  },
  {
    "code": "1460",
    "market": "tse",
    "names": [
      "宏遠"
    ]
  },
  {
    "code": "1463",
    "market": "tse",
    "names": [
      "強盛新"
    ]
  },
  {
    "code": "1464",
    "market": "tse",
    "names": [
      "得力"
    ]
  },
  {
    "code": "1465",
    "market": "tse",
    "names": [
      "偉全"
    ]
  },
  {
    "code": "1466",
    "market": "tse",
    "names": [
      "聚隆"
    ]
  },
  {
    "code": "1467",
    "market": "tse",
    "names": [
      "南緯"
    ]
  },
  {
    "code": "1468",
    "market": "tse",
    "names": [
      "昶和"
    ]
  },
  {
    "code": "1470",
    "market": "tse",
    "names": [
      "大統新創"
    ]
  },
  {
    "code": "1471",
    "market": "tse",
    "names": [
      "首利"
    ]
  },
  {
    "code": "1472",
    "market": "tse",
    "names": [
      "三洋實業"
    ]
  },
  {
    "code": "1473",
    "market": "tse",
    "names": [
      "台南"
    ]
  },
  {
    "code": "1474",
    "market": "tse",
    "names": [
      "弘裕"
    ]
  },
  {
    "code": "1475",
    "market": "tse",
    "names": [
      "業旺"
    ]
  },
  {
    "code": "1476",
    "market": "tse",
    "names": [
      "儒鴻"
    ]
  },
  {
    "code": "1477",
    "market": "tse",
    "names": [
      "聚陽"
    ]
  },
  {
    "code": "1503",
    "market": "tse",
    "names": [
      "士電"
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
    "code": "1506",
    "market": "tse",
    "names": [
      "正道"
    ]
  },
  {
    "code": "1512",
    "market": "tse",
    "names": [
      "瑞利"
    ]
  },
  {
    "code": "1513",
    "market": "tse",
    "names": [
      "中興電"
    ]
  },
  {
    "code": "1514",
    "market": "tse",
    "names": [
      "亞力"
    ]
  },
  {
    "code": "1515",
    "market": "tse",
    "names": [
      "力山"
    ]
  },
  {
    "code": "1516",
    "market": "tse",
    "names": [
      "川飛"
    ]
  },
  {
    "code": "1517",
    "market": "tse",
    "names": [
      "利奇"
    ]
  },
  {
    "code": "1519",
    "market": "tse",
    "names": [
      "華城"
    ]
  },
  {
    "code": "1521",
    "market": "tse",
    "names": [
      "大億"
    ]
  },
  {
    "code": "1522",
    "market": "tse",
    "names": [
      "堤維西"
    ]
  },
  {
    "code": "1524",
    "market": "tse",
    "names": [
      "耿鼎"
    ]
  },
  {
    "code": "1525",
    "market": "tse",
    "names": [
      "江申"
    ]
  },
  {
    "code": "1526",
    "market": "tse",
    "names": [
      "日馳"
    ]
  },
  {
    "code": "1527",
    "market": "tse",
    "names": [
      "鑽全"
    ]
  },
  {
    "code": "1528",
    "market": "tse",
    "names": [
      "恩德"
    ]
  },
  {
    "code": "1529",
    "market": "tse",
    "names": [
      "樂事綠能"
    ]
  },
  {
    "code": "1530",
    "market": "tse",
    "names": [
      "亞崴"
    ]
  },
  {
    "code": "1531",
    "market": "tse",
    "names": [
      "高林股"
    ]
  },
  {
    "code": "1532",
    "market": "tse",
    "names": [
      "勤美"
    ]
  },
  {
    "code": "1533",
    "market": "tse",
    "names": [
      "車王電"
    ]
  },
  {
    "code": "1535",
    "market": "tse",
    "names": [
      "中宇"
    ]
  },
  {
    "code": "1536",
    "market": "tse",
    "names": [
      "和大"
    ]
  },
  {
    "code": "1537",
    "market": "tse",
    "names": [
      "廣隆"
    ]
  },
  {
    "code": "1538",
    "market": "tse",
    "names": [
      "正峰"
    ]
  },
  {
    "code": "1539",
    "market": "tse",
    "names": [
      "巨庭"
    ]
  },
  {
    "code": "1540",
    "market": "tse",
    "names": [
      "喬福"
    ]
  },
  {
    "code": "1541",
    "market": "tse",
    "names": [
      "錩泰"
    ]
  },
  {
    "code": "1558",
    "market": "tse",
    "names": [
      "伸興"
    ]
  },
  {
    "code": "1560",
    "market": "tse",
    "names": [
      "中砂"
    ]
  },
  {
    "code": "1563",
    "market": "tse",
    "names": [
      "巧新"
    ]
  },
  {
    "code": "1568",
    "market": "tse",
    "names": [
      "倉佑"
    ]
  },
  {
    "code": "1582",
    "market": "tse",
    "names": [
      "信錦"
    ]
  },
  {
    "code": "1583",
    "market": "tse",
    "names": [
      "程泰"
    ]
  },
  {
    "code": "1587",
    "market": "tse",
    "names": [
      "吉茂"
    ]
  },
  {
    "code": "1589",
    "market": "tse",
    "names": [
      "永冠-KY",
      "永冠"
    ]
  },
  {
    "code": "1590",
    "market": "tse",
    "names": [
      "亞德客-KY",
      "亞德客"
    ]
  },
  {
    "code": "1597",
    "market": "tse",
    "names": [
      "直得"
    ]
  },
  {
    "code": "1598",
    "market": "tse",
    "names": [
      "岱宇"
    ]
  },
  {
    "code": "1603",
    "market": "tse",
    "names": [
      "華電"
    ]
  },
  {
    "code": "1604",
    "market": "tse",
    "names": [
      "聲寶"
    ]
  },
  {
    "code": "1605",
    "market": "tse",
    "names": [
      "華新"
    ]
  },
  {
    "code": "1608",
    "market": "tse",
    "names": [
      "華榮"
    ]
  },
  {
    "code": "1609",
    "market": "tse",
    "names": [
      "大亞"
    ]
  },
  {
    "code": "1611",
    "market": "tse",
    "names": [
      "中電"
    ]
  },
  {
    "code": "1612",
    "market": "tse",
    "names": [
      "宏泰"
    ]
  },
  {
    "code": "1614",
    "market": "tse",
    "names": [
      "三洋電"
    ]
  },
  {
    "code": "1615",
    "market": "tse",
    "names": [
      "大山"
    ]
  },
  {
    "code": "1616",
    "market": "tse",
    "names": [
      "億泰"
    ]
  },
  {
    "code": "1617",
    "market": "tse",
    "names": [
      "榮星"
    ]
  },
  {
    "code": "1618",
    "market": "tse",
    "names": [
      "合機"
    ]
  },
  {
    "code": "1623",
    "market": "tse",
    "names": [
      "大東電"
    ]
  },
  {
    "code": "1626",
    "market": "tse",
    "names": [
      "艾美特-KY",
      "艾美特"
    ]
  },
  {
    "code": "1702",
    "market": "tse",
    "names": [
      "南僑"
    ]
  },
  {
    "code": "1707",
    "market": "tse",
    "names": [
      "葡萄王"
    ]
  },
  {
    "code": "1708",
    "market": "tse",
    "names": [
      "東鹼"
    ]
  },
  {
    "code": "1709",
    "market": "tse",
    "names": [
      "和益"
    ]
  },
  {
    "code": "1710",
    "market": "tse",
    "names": [
      "東聯"
    ]
  },
  {
    "code": "1711",
    "market": "tse",
    "names": [
      "永光"
    ]
  },
  {
    "code": "1712",
    "market": "tse",
    "names": [
      "興農"
    ]
  },
  {
    "code": "1713",
    "market": "tse",
    "names": [
      "國化"
    ]
  },
  {
    "code": "1714",
    "market": "tse",
    "names": [
      "和桐"
    ]
  },
  {
    "code": "1717",
    "market": "tse",
    "names": [
      "長興"
    ]
  },
  {
    "code": "1718",
    "market": "tse",
    "names": [
      "中纖"
    ]
  },
  {
    "code": "1720",
    "market": "tse",
    "names": [
      "生達"
    ]
  },
  {
    "code": "1721",
    "market": "tse",
    "names": [
      "三晃"
    ]
  },
  {
    "code": "1722",
    "market": "tse",
    "names": [
      "台肥"
    ]
  },
  {
    "code": "1723",
    "market": "tse",
    "names": [
      "中碳"
    ]
  },
  {
    "code": "1725",
    "market": "tse",
    "names": [
      "元禎"
    ]
  },
  {
    "code": "1726",
    "market": "tse",
    "names": [
      "永記"
    ]
  },
  {
    "code": "1727",
    "market": "tse",
    "names": [
      "中華化"
    ]
  },
  {
    "code": "1730",
    "market": "tse",
    "names": [
      "花仙子"
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
    "code": "1732",
    "market": "tse",
    "names": [
      "毛寶"
    ]
  },
  {
    "code": "1733",
    "market": "tse",
    "names": [
      "五鼎"
    ]
  },
  {
    "code": "1734",
    "market": "tse",
    "names": [
      "杏輝"
    ]
  },
  {
    "code": "1735",
    "market": "tse",
    "names": [
      "日勝化"
    ]
  },
  {
    "code": "1736",
    "market": "tse",
    "names": [
      "喬山"
    ]
  },
  {
    "code": "1737",
    "market": "tse",
    "names": [
      "臺鹽"
    ]
  },
  {
    "code": "1752",
    "market": "tse",
    "names": [
      "南光"
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
    "code": "1762",
    "market": "tse",
    "names": [
      "中化生"
    ]
  },
  {
    "code": "1773",
    "market": "tse",
    "names": [
      "勝一"
    ]
  },
  {
    "code": "1783",
    "market": "tse",
    "names": [
      "和康生"
    ]
  },
  {
    "code": "1786",
    "market": "tse",
    "names": [
      "科妍"
    ]
  },
  {
    "code": "1789",
    "market": "tse",
    "names": [
      "神隆"
    ]
  },
  {
    "code": "1795",
    "market": "tse",
    "names": [
      "美時"
    ]
  },
  {
    "code": "1802",
    "market": "tse",
    "names": [
      "台玻"
    ]
  },
  {
    "code": "1805",
    "market": "tse",
    "names": [
      "寶徠"
    ]
  },
  {
    "code": "1806",
    "market": "tse",
    "names": [
      "冠軍"
    ]
  },
  {
    "code": "1808",
    "market": "tse",
    "names": [
      "潤隆"
    ]
  },
  {
    "code": "1809",
    "market": "tse",
    "names": [
      "中釉"
    ]
  },
  {
    "code": "1810",
    "market": "tse",
    "names": [
      "和成"
    ]
  },
  {
    "code": "1817",
    "market": "tse",
    "names": [
      "凱撒衛"
    ]
  },
  {
    "code": "1903",
    "market": "tse",
    "names": [
      "士紙"
    ]
  },
  {
    "code": "1904",
    "market": "tse",
    "names": [
      "正隆"
    ]
  },
  {
    "code": "1905",
    "market": "tse",
    "names": [
      "華紙"
    ]
  },
  {
    "code": "1906",
    "market": "tse",
    "names": [
      "寶隆"
    ]
  },
  {
    "code": "1907",
    "market": "tse",
    "names": [
      "永豐餘"
    ]
  },
  {
    "code": "1909",
    "market": "tse",
    "names": [
      "榮成"
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
    "code": "2006",
    "market": "tse",
    "names": [
      "東和鋼鐵"
    ]
  },
  {
    "code": "2007",
    "market": "tse",
    "names": [
      "燁興"
    ]
  },
  {
    "code": "2008",
    "market": "tse",
    "names": [
      "高興昌"
    ]
  },
  {
    "code": "2009",
    "market": "tse",
    "names": [
      "第一銅"
    ]
  },
  {
    "code": "2010",
    "market": "tse",
    "names": [
      "春源"
    ]
  },
  {
    "code": "2012",
    "market": "tse",
    "names": [
      "春雨"
    ]
  },
  {
    "code": "2013",
    "market": "tse",
    "names": [
      "中鋼構"
    ]
  },
  {
    "code": "2014",
    "market": "tse",
    "names": [
      "中鴻"
    ]
  },
  {
    "code": "2015",
    "market": "tse",
    "names": [
      "豐興"
    ]
  },
  {
    "code": "2017",
    "market": "tse",
    "names": [
      "官田鋼"
    ]
  },
  {
    "code": "2020",
    "market": "tse",
    "names": [
      "美亞"
    ]
  },
  {
    "code": "2022",
    "market": "tse",
    "names": [
      "聚亨"
    ]
  },
  {
    "code": "2023",
    "market": "tse",
    "names": [
      "燁輝"
    ]
  },
  {
    "code": "2024",
    "market": "tse",
    "names": [
      "志聯"
    ]
  },
  {
    "code": "2025",
    "market": "tse",
    "names": [
      "千興"
    ]
  },
  {
    "code": "2027",
    "market": "tse",
    "names": [
      "大成鋼"
    ]
  },
  {
    "code": "2028",
    "market": "tse",
    "names": [
      "威致"
    ]
  },
  {
    "code": "2029",
    "market": "tse",
    "names": [
      "盛餘"
    ]
  },
  {
    "code": "2030",
    "market": "tse",
    "names": [
      "彰源"
    ]
  },
  {
    "code": "2031",
    "market": "tse",
    "names": [
      "新光鋼"
    ]
  },
  {
    "code": "2032",
    "market": "tse",
    "names": [
      "新鋼"
    ]
  },
  {
    "code": "2033",
    "market": "tse",
    "names": [
      "佳大"
    ]
  },
  {
    "code": "2034",
    "market": "tse",
    "names": [
      "允強"
    ]
  },
  {
    "code": "2038",
    "market": "tse",
    "names": [
      "海光"
    ]
  },
  {
    "code": "2049",
    "market": "tse",
    "names": [
      "上銀"
    ]
  },
  {
    "code": "2059",
    "market": "tse",
    "names": [
      "川湖"
    ]
  },
  {
    "code": "2062",
    "market": "tse",
    "names": [
      "橋椿"
    ]
  },
  {
    "code": "2069",
    "market": "tse",
    "names": [
      "運錩"
    ]
  },
  {
    "code": "2072",
    "market": "tse",
    "names": [
      "世紀風電"
    ]
  },
  {
    "code": "2101",
    "market": "tse",
    "names": [
      "南港"
    ]
  },
  {
    "code": "2102",
    "market": "tse",
    "names": [
      "泰豐"
    ]
  },
  {
    "code": "2103",
    "market": "tse",
    "names": [
      "台橡"
    ]
  },
  {
    "code": "2104",
    "market": "tse",
    "names": [
      "國際中橡"
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
    "code": "2106",
    "market": "tse",
    "names": [
      "建大"
    ]
  },
  {
    "code": "2107",
    "market": "tse",
    "names": [
      "厚生"
    ]
  },
  {
    "code": "2108",
    "market": "tse",
    "names": [
      "南帝"
    ]
  },
  {
    "code": "2109",
    "market": "tse",
    "names": [
      "華豐"
    ]
  },
  {
    "code": "2114",
    "market": "tse",
    "names": [
      "鑫永銓"
    ]
  },
  {
    "code": "2115",
    "market": "tse",
    "names": [
      "六暉-KY",
      "六暉"
    ]
  },
  {
    "code": "2201",
    "market": "tse",
    "names": [
      "裕隆"
    ]
  },
  {
    "code": "2204",
    "market": "tse",
    "names": [
      "中華"
    ]
  },
  {
    "code": "2206",
    "market": "tse",
    "names": [
      "三陽工業"
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
    "code": "2208",
    "market": "tse",
    "names": [
      "台船"
    ]
  },
  {
    "code": "2211",
    "market": "tse",
    "names": [
      "長榮鋼"
    ]
  },
  {
    "code": "2227",
    "market": "tse",
    "names": [
      "裕日車"
    ]
  },
  {
    "code": "2228",
    "market": "tse",
    "names": [
      "劍麟"
    ]
  },
  {
    "code": "2231",
    "market": "tse",
    "names": [
      "為升"
    ]
  },
  {
    "code": "2233",
    "market": "tse",
    "names": [
      "宇隆"
    ]
  },
  {
    "code": "2236",
    "market": "tse",
    "names": [
      "百達-KY",
      "百達"
    ]
  },
  {
    "code": "2239",
    "market": "tse",
    "names": [
      "英利-KY",
      "英利"
    ]
  },
  {
    "code": "2241",
    "market": "tse",
    "names": [
      "艾姆勒"
    ]
  },
  {
    "code": "2243",
    "market": "tse",
    "names": [
      "宏旭-KY",
      "宏旭"
    ]
  },
  {
    "code": "2247",
    "market": "tse",
    "names": [
      "汎德永業"
    ]
  },
  {
    "code": "2248",
    "market": "tse",
    "names": [
      "華勝-KY",
      "華勝"
    ]
  },
  {
    "code": "2250",
    "market": "tse",
    "names": [
      "IKKA-KY",
      "IKKA"
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
    "code": "2302",
    "market": "tse",
    "names": [
      "麗正"
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
    "code": "2305",
    "market": "tse",
    "names": [
      "全友"
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
    "code": "2312",
    "market": "tse",
    "names": [
      "金寶"
    ]
  },
  {
    "code": "2313",
    "market": "tse",
    "names": [
      "華通"
    ]
  },
  {
    "code": "2314",
    "market": "tse",
    "names": [
      "台揚"
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
    "code": "2321",
    "market": "tse",
    "names": [
      "東訊"
    ]
  },
  {
    "code": "2323",
    "market": "tse",
    "names": [
      "中環"
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
    "code": "2327",
    "market": "tse",
    "names": [
      "國巨*",
      "國巨",
      "阿巨",
      "巨巨"
    ]
  },
  {
    "code": "2328",
    "market": "tse",
    "names": [
      "廣宇"
    ]
  },
  {
    "code": "2329",
    "market": "tse",
    "names": [
      "華泰"
    ]
  },
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
      "張忠謀",
      "積哥",
      "2330"
    ]
  },
  {
    "code": "2331",
    "market": "tse",
    "names": [
      "精英"
    ]
  },
  {
    "code": "2332",
    "market": "tse",
    "names": [
      "友訊"
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
    "code": "2338",
    "market": "tse",
    "names": [
      "光罩"
    ]
  },
  {
    "code": "2340",
    "market": "tse",
    "names": [
      "台亞"
    ]
  },
  {
    "code": "2342",
    "market": "tse",
    "names": [
      "茂矽"
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
    "code": "2345",
    "market": "tse",
    "names": [
      "智邦",
      "智邦科技",
      "智崩"
    ]
  },
  {
    "code": "2347",
    "market": "tse",
    "names": [
      "聯強"
    ]
  },
  {
    "code": "2348",
    "market": "tse",
    "names": [
      "海悅"
    ]
  },
  {
    "code": "2349",
    "market": "tse",
    "names": [
      "錸德"
    ]
  },
  {
    "code": "2351",
    "market": "tse",
    "names": [
      "順德"
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
    "code": "2353",
    "market": "tse",
    "names": [
      "宏碁",
      "ACER"
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
    "code": "2355",
    "market": "tse",
    "names": [
      "敬鵬",
      "敬鵬工業",
      "鵬哥"
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
    "code": "2359",
    "market": "tse",
    "names": [
      "所羅門"
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
    "code": "2362",
    "market": "tse",
    "names": [
      "藍天"
    ]
  },
  {
    "code": "2363",
    "market": "tse",
    "names": [
      "矽統"
    ]
  },
  {
    "code": "2364",
    "market": "tse",
    "names": [
      "倫飛"
    ]
  },
  {
    "code": "2365",
    "market": "tse",
    "names": [
      "昆盈"
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
    "code": "2368",
    "market": "tse",
    "names": [
      "金像電",
      "金項鍊"
    ]
  },
  {
    "code": "2369",
    "market": "tse",
    "names": [
      "菱生"
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
    "code": "2373",
    "market": "tse",
    "names": [
      "震旦行"
    ]
  },
  {
    "code": "2374",
    "market": "tse",
    "names": [
      "佳能"
    ]
  },
  {
    "code": "2375",
    "market": "tse",
    "names": [
      "凱美"
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
    "code": "2380",
    "market": "tse",
    "names": [
      "虹光"
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
    "code": "2383",
    "market": "tse",
    "names": [
      "台光電"
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
    "code": "2387",
    "market": "tse",
    "names": [
      "精元"
    ]
  },
  {
    "code": "2388",
    "market": "tse",
    "names": [
      "威盛"
    ]
  },
  {
    "code": "2390",
    "market": "tse",
    "names": [
      "云辰"
    ]
  },
  {
    "code": "2392",
    "market": "tse",
    "names": [
      "正崴"
    ]
  },
  {
    "code": "2393",
    "market": "tse",
    "names": [
      "億光"
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
    "code": "2397",
    "market": "tse",
    "names": [
      "友通"
    ]
  },
  {
    "code": "2399",
    "market": "tse",
    "names": [
      "映泰"
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
    "code": "2402",
    "market": "tse",
    "names": [
      "毅嘉"
    ]
  },
  {
    "code": "2404",
    "market": "tse",
    "names": [
      "漢唐"
    ]
  },
  {
    "code": "2405",
    "market": "tse",
    "names": [
      "輔信"
    ]
  },
  {
    "code": "2406",
    "market": "tse",
    "names": [
      "國碩"
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
    "code": "2409",
    "market": "tse",
    "names": [
      "友達",
      "阿達",
      "戀人未滿",
      "AUO",
      "戀人",
      "貓貓"
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
    "code": "2413",
    "market": "tse",
    "names": [
      "環科"
    ]
  },
  {
    "code": "2414",
    "market": "tse",
    "names": [
      "精技"
    ]
  },
  {
    "code": "2415",
    "market": "tse",
    "names": [
      "錩新"
    ]
  },
  {
    "code": "2417",
    "market": "tse",
    "names": [
      "圓剛"
    ]
  },
  {
    "code": "2419",
    "market": "tse",
    "names": [
      "仲琦"
    ]
  },
  {
    "code": "2420",
    "market": "tse",
    "names": [
      "新巨"
    ]
  },
  {
    "code": "2421",
    "market": "tse",
    "names": [
      "建準"
    ]
  },
  {
    "code": "2423",
    "market": "tse",
    "names": [
      "固緯"
    ]
  },
  {
    "code": "2424",
    "market": "tse",
    "names": [
      "隴華"
    ]
  },
  {
    "code": "2425",
    "market": "tse",
    "names": [
      "承啟"
    ]
  },
  {
    "code": "2426",
    "market": "tse",
    "names": [
      "鼎元"
    ]
  },
  {
    "code": "2427",
    "market": "tse",
    "names": [
      "三商電"
    ]
  },
  {
    "code": "2428",
    "market": "tse",
    "names": [
      "興勤"
    ]
  },
  {
    "code": "2429",
    "market": "tse",
    "names": [
      "銘旺科"
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
    "code": "2431",
    "market": "tse",
    "names": [
      "聯昌"
    ]
  },
  {
    "code": "2433",
    "market": "tse",
    "names": [
      "互盛電"
    ]
  },
  {
    "code": "2434",
    "market": "tse",
    "names": [
      "統懋"
    ]
  },
  {
    "code": "2436",
    "market": "tse",
    "names": [
      "偉詮電"
    ]
  },
  {
    "code": "2438",
    "market": "tse",
    "names": [
      "翔耀"
    ]
  },
  {
    "code": "2439",
    "market": "tse",
    "names": [
      "美律"
    ]
  },
  {
    "code": "2440",
    "market": "tse",
    "names": [
      "太空梭"
    ]
  },
  {
    "code": "2441",
    "market": "tse",
    "names": [
      "超豐"
    ]
  },
  {
    "code": "2442",
    "market": "tse",
    "names": [
      "新美齊"
    ]
  },
  {
    "code": "2444",
    "market": "tse",
    "names": [
      "兆勁"
    ]
  },
  {
    "code": "2449",
    "market": "tse",
    "names": [
      "京元電子"
    ]
  },
  {
    "code": "2450",
    "market": "tse",
    "names": [
      "神腦"
    ]
  },
  {
    "code": "2451",
    "market": "tse",
    "names": [
      "創見"
    ]
  },
  {
    "code": "2453",
    "market": "tse",
    "names": [
      "凌群"
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
      "阿科",
      "發科"
    ]
  },
  {
    "code": "2455",
    "market": "tse",
    "names": [
      "全新"
    ]
  },
  {
    "code": "2457",
    "market": "tse",
    "names": [
      "飛宏"
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
    "code": "2459",
    "market": "tse",
    "names": [
      "敦吉"
    ]
  },
  {
    "code": "2460",
    "market": "tse",
    "names": [
      "建通"
    ]
  },
  {
    "code": "2461",
    "market": "tse",
    "names": [
      "光群雷"
    ]
  },
  {
    "code": "2462",
    "market": "tse",
    "names": [
      "良得電"
    ]
  },
  {
    "code": "2464",
    "market": "tse",
    "names": [
      "盟立"
    ]
  },
  {
    "code": "2465",
    "market": "tse",
    "names": [
      "麗臺"
    ]
  },
  {
    "code": "2466",
    "market": "tse",
    "names": [
      "冠西電"
    ]
  },
  {
    "code": "2467",
    "market": "tse",
    "names": [
      "志聖"
    ]
  },
  {
    "code": "2468",
    "market": "tse",
    "names": [
      "華經"
    ]
  },
  {
    "code": "2471",
    "market": "tse",
    "names": [
      "資通"
    ]
  },
  {
    "code": "2472",
    "market": "tse",
    "names": [
      "立隆電"
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
    "code": "2476",
    "market": "tse",
    "names": [
      "鉅祥"
    ]
  },
  {
    "code": "2477",
    "market": "tse",
    "names": [
      "美隆電"
    ]
  },
  {
    "code": "2478",
    "market": "tse",
    "names": [
      "大毅"
    ]
  },
  {
    "code": "2480",
    "market": "tse",
    "names": [
      "敦陽科"
    ]
  },
  {
    "code": "2481",
    "market": "tse",
    "names": [
      "強茂"
    ]
  },
  {
    "code": "2482",
    "market": "tse",
    "names": [
      "連宇"
    ]
  },
  {
    "code": "2483",
    "market": "tse",
    "names": [
      "百容"
    ]
  },
  {
    "code": "2484",
    "market": "tse",
    "names": [
      "希華"
    ]
  },
  {
    "code": "2485",
    "market": "tse",
    "names": [
      "兆赫"
    ]
  },
  {
    "code": "2486",
    "market": "tse",
    "names": [
      "一詮"
    ]
  },
  {
    "code": "2488",
    "market": "tse",
    "names": [
      "漢平"
    ]
  },
  {
    "code": "2489",
    "market": "tse",
    "names": [
      "瑞軒"
    ]
  },
  {
    "code": "2491",
    "market": "tse",
    "names": [
      "吉祥全"
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
    "code": "2493",
    "market": "tse",
    "names": [
      "揚博"
    ]
  },
  {
    "code": "2495",
    "market": "tse",
    "names": [
      "普安"
    ]
  },
  {
    "code": "2496",
    "market": "tse",
    "names": [
      "卓越"
    ]
  },
  {
    "code": "2497",
    "market": "tse",
    "names": [
      "怡利電"
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
    "code": "2501",
    "market": "tse",
    "names": [
      "國建"
    ]
  },
  {
    "code": "2504",
    "market": "tse",
    "names": [
      "國產"
    ]
  },
  {
    "code": "2505",
    "market": "tse",
    "names": [
      "國揚"
    ]
  },
  {
    "code": "2506",
    "market": "tse",
    "names": [
      "太設"
    ]
  },
  {
    "code": "2509",
    "market": "tse",
    "names": [
      "全坤建"
    ]
  },
  {
    "code": "2511",
    "market": "tse",
    "names": [
      "太子"
    ]
  },
  {
    "code": "2514",
    "market": "tse",
    "names": [
      "龍邦"
    ]
  },
  {
    "code": "2515",
    "market": "tse",
    "names": [
      "中工"
    ]
  },
  {
    "code": "2516",
    "market": "tse",
    "names": [
      "新建"
    ]
  },
  {
    "code": "2520",
    "market": "tse",
    "names": [
      "冠德"
    ]
  },
  {
    "code": "2524",
    "market": "tse",
    "names": [
      "京城"
    ]
  },
  {
    "code": "2527",
    "market": "tse",
    "names": [
      "宏璟"
    ]
  },
  {
    "code": "2528",
    "market": "tse",
    "names": [
      "皇普"
    ]
  },
  {
    "code": "2530",
    "market": "tse",
    "names": [
      "華建"
    ]
  },
  {
    "code": "2534",
    "market": "tse",
    "names": [
      "宏盛"
    ]
  },
  {
    "code": "2535",
    "market": "tse",
    "names": [
      "達欣工"
    ]
  },
  {
    "code": "2536",
    "market": "tse",
    "names": [
      "宏普"
    ]
  },
  {
    "code": "2537",
    "market": "tse",
    "names": [
      "聯上發"
    ]
  },
  {
    "code": "2538",
    "market": "tse",
    "names": [
      "基泰"
    ]
  },
  {
    "code": "2539",
    "market": "tse",
    "names": [
      "櫻花建"
    ]
  },
  {
    "code": "2540",
    "market": "tse",
    "names": [
      "愛山林"
    ]
  },
  {
    "code": "2542",
    "market": "tse",
    "names": [
      "興富發"
    ]
  },
  {
    "code": "2543",
    "market": "tse",
    "names": [
      "皇昌"
    ]
  },
  {
    "code": "2545",
    "market": "tse",
    "names": [
      "皇翔"
    ]
  },
  {
    "code": "2546",
    "market": "tse",
    "names": [
      "根基"
    ]
  },
  {
    "code": "2547",
    "market": "tse",
    "names": [
      "日勝生"
    ]
  },
  {
    "code": "2548",
    "market": "tse",
    "names": [
      "華固"
    ]
  },
  {
    "code": "2597",
    "market": "tse",
    "names": [
      "潤弘"
    ]
  },
  {
    "code": "2601",
    "market": "tse",
    "names": [
      "益航"
    ]
  },
  {
    "code": "2603",
    "market": "tse",
    "names": [
      "長榮",
      "長榮海運",
      "榮仔",
      "綠巨人",
      "船長",
      "阿榮"
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
    "code": "2606",
    "market": "tse",
    "names": [
      "裕民"
    ]
  },
  {
    "code": "2607",
    "market": "tse",
    "names": [
      "榮運"
    ]
  },
  {
    "code": "2608",
    "market": "tse",
    "names": [
      "嘉里大榮"
    ]
  },
  {
    "code": "2609",
    "market": "tse",
    "names": [
      "陽明",
      "陽明海運",
      "陽粉",
      "阿陽",
      "阿明"
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
    "code": "2611",
    "market": "tse",
    "names": [
      "志信"
    ]
  },
  {
    "code": "2612",
    "market": "tse",
    "names": [
      "中航"
    ]
  },
  {
    "code": "2613",
    "market": "tse",
    "names": [
      "中櫃"
    ]
  },
  {
    "code": "2614",
    "market": "tse",
    "names": [
      "東森"
    ]
  },
  {
    "code": "2615",
    "market": "tse",
    "names": [
      "萬海",
      "萬海航運",
      "阿海"
    ]
  },
  {
    "code": "2616",
    "market": "tse",
    "names": [
      "山隆"
    ]
  },
  {
    "code": "2617",
    "market": "tse",
    "names": [
      "台航"
    ]
  },
  {
    "code": "2618",
    "market": "tse",
    "names": [
      "長榮航",
      "長榮航空",
      "長航"
    ]
  },
  {
    "code": "2630",
    "market": "tse",
    "names": [
      "亞航"
    ]
  },
  {
    "code": "2633",
    "market": "tse",
    "names": [
      "台灣高鐵"
    ]
  },
  {
    "code": "2634",
    "market": "tse",
    "names": [
      "漢翔"
    ]
  },
  {
    "code": "2636",
    "market": "tse",
    "names": [
      "台驊控股"
    ]
  },
  {
    "code": "2637",
    "market": "tse",
    "names": [
      "慧洋-KY",
      "慧洋"
    ]
  },
  {
    "code": "2642",
    "market": "tse",
    "names": [
      "宅配通"
    ]
  },
  {
    "code": "2645",
    "market": "tse",
    "names": [
      "長榮航太"
    ]
  },
  {
    "code": "2646",
    "market": "tse",
    "names": [
      "星宇航空"
    ]
  },
  {
    "code": "2701",
    "market": "tse",
    "names": [
      "萬企"
    ]
  },
  {
    "code": "2702",
    "market": "tse",
    "names": [
      "華園"
    ]
  },
  {
    "code": "2704",
    "market": "tse",
    "names": [
      "國賓"
    ]
  },
  {
    "code": "2705",
    "market": "tse",
    "names": [
      "六福"
    ]
  },
  {
    "code": "2706",
    "market": "tse",
    "names": [
      "第一店"
    ]
  },
  {
    "code": "2707",
    "market": "tse",
    "names": [
      "晶華"
    ]
  },
  {
    "code": "2712",
    "market": "tse",
    "names": [
      "遠雄來"
    ]
  },
  {
    "code": "2722",
    "market": "tse",
    "names": [
      "夏都"
    ]
  },
  {
    "code": "2723",
    "market": "tse",
    "names": [
      "美食-KY",
      "美食"
    ]
  },
  {
    "code": "2727",
    "market": "tse",
    "names": [
      "王品"
    ]
  },
  {
    "code": "2731",
    "market": "tse",
    "names": [
      "雄獅"
    ]
  },
  {
    "code": "2739",
    "market": "tse",
    "names": [
      "寒舍"
    ]
  },
  {
    "code": "2748",
    "market": "tse",
    "names": [
      "雲品"
    ]
  },
  {
    "code": "2753",
    "market": "tse",
    "names": [
      "八方雲集"
    ]
  },
  {
    "code": "2762",
    "market": "tse",
    "names": [
      "世界健身-KY",
      "世界健身"
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
    "code": "2812",
    "market": "tse",
    "names": [
      "台中銀"
    ]
  },
  {
    "code": "2816",
    "market": "tse",
    "names": [
      "旺旺保"
    ]
  },
  {
    "code": "2820",
    "market": "tse",
    "names": [
      "華票"
    ]
  },
  {
    "code": "2832",
    "market": "tse",
    "names": [
      "台產"
    ]
  },
  {
    "code": "2834",
    "market": "tse",
    "names": [
      "臺企銀"
    ]
  },
  {
    "code": "2836",
    "market": "tse",
    "names": [
      "高雄銀"
    ]
  },
  {
    "code": "2838",
    "market": "tse",
    "names": [
      "聯邦銀"
    ]
  },
  {
    "code": "2845",
    "market": "tse",
    "names": [
      "遠東銀"
    ]
  },
  {
    "code": "2849",
    "market": "tse",
    "names": [
      "安泰銀"
    ]
  },
  {
    "code": "2850",
    "market": "tse",
    "names": [
      "新產"
    ]
  },
  {
    "code": "2851",
    "market": "tse",
    "names": [
      "中再保"
    ]
  },
  {
    "code": "2852",
    "market": "tse",
    "names": [
      "第一保"
    ]
  },
  {
    "code": "2855",
    "market": "tse",
    "names": [
      "統一證"
    ]
  },
  {
    "code": "2867",
    "market": "tse",
    "names": [
      "三商壽",
      "三商人壽",
      "三商獸"
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
    "code": "2883",
    "market": "tse",
    "names": [
      "凱基金",
      "開發金",
      "開發",
      "KGI"
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
    "code": "2885",
    "market": "tse",
    "names": [
      "元大金",
      "元大",
      "元大金控"
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
    "code": "2887",
    "market": "tse",
    "names": [
      "台新新光金",
      "台新金",
      "台新",
      "台新金控"
    ]
  },
  {
    "code": "2889",
    "market": "tse",
    "names": [
      "國票金"
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
    "code": "2891",
    "market": "tse",
    "names": [
      "中信金",
      "中信",
      "中信金控",
      "廢牡蠣",
      "一元金",
      "牡蠣金",
      "爪爪"
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
    "code": "2897",
    "market": "tse",
    "names": [
      "王道銀行",
      "王道銀"
    ]
  },
  {
    "code": "2901",
    "market": "tse",
    "names": [
      "欣欣"
    ]
  },
  {
    "code": "2903",
    "market": "tse",
    "names": [
      "遠百"
    ]
  },
  {
    "code": "2904",
    "market": "tse",
    "names": [
      "匯僑"
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
    "code": "2906",
    "market": "tse",
    "names": [
      "高林"
    ]
  },
  {
    "code": "2908",
    "market": "tse",
    "names": [
      "特力"
    ]
  },
  {
    "code": "2910",
    "market": "tse",
    "names": [
      "統領"
    ]
  },
  {
    "code": "2911",
    "market": "tse",
    "names": [
      "麗嬰房"
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
    "code": "2913",
    "market": "tse",
    "names": [
      "農林"
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
    "code": "2923",
    "market": "tse",
    "names": [
      "鼎固-KY",
      "鼎固"
    ]
  },
  {
    "code": "2929",
    "market": "tse",
    "names": [
      "淘帝-KY",
      "淘帝"
    ]
  },
  {
    "code": "2939",
    "market": "tse",
    "names": [
      "永邑-KY",
      "永邑"
    ]
  },
  {
    "code": "3002",
    "market": "tse",
    "names": [
      "歐格"
    ]
  },
  {
    "code": "3003",
    "market": "tse",
    "names": [
      "健和興"
    ]
  },
  {
    "code": "3004",
    "market": "tse",
    "names": [
      "豐達科"
    ]
  },
  {
    "code": "3005",
    "market": "tse",
    "names": [
      "神基"
    ]
  },
  {
    "code": "3006",
    "market": "tse",
    "names": [
      "晶豪科"
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
    "code": "3010",
    "market": "tse",
    "names": [
      "華立"
    ]
  },
  {
    "code": "3011",
    "market": "tse",
    "names": [
      "今皓"
    ]
  },
  {
    "code": "3013",
    "market": "tse",
    "names": [
      "晟銘電"
    ]
  },
  {
    "code": "3014",
    "market": "tse",
    "names": [
      "聯陽"
    ]
  },
  {
    "code": "3015",
    "market": "tse",
    "names": [
      "全漢"
    ]
  },
  {
    "code": "3016",
    "market": "tse",
    "names": [
      "嘉晶"
    ]
  },
  {
    "code": "3017",
    "market": "tse",
    "names": [
      "奇鋐"
    ]
  },
  {
    "code": "3018",
    "market": "tse",
    "names": [
      "隆銘綠能"
    ]
  },
  {
    "code": "3019",
    "market": "tse",
    "names": [
      "亞光"
    ]
  },
  {
    "code": "3021",
    "market": "tse",
    "names": [
      "鴻名"
    ]
  },
  {
    "code": "3022",
    "market": "tse",
    "names": [
      "威強電"
    ]
  },
  {
    "code": "3023",
    "market": "tse",
    "names": [
      "信邦"
    ]
  },
  {
    "code": "3024",
    "market": "tse",
    "names": [
      "憶聲"
    ]
  },
  {
    "code": "3025",
    "market": "tse",
    "names": [
      "星通"
    ]
  },
  {
    "code": "3026",
    "market": "tse",
    "names": [
      "禾伸堂"
    ]
  },
  {
    "code": "3027",
    "market": "tse",
    "names": [
      "盛達"
    ]
  },
  {
    "code": "3028",
    "market": "tse",
    "names": [
      "增你強"
    ]
  },
  {
    "code": "3029",
    "market": "tse",
    "names": [
      "零壹"
    ]
  },
  {
    "code": "3030",
    "market": "tse",
    "names": [
      "德律"
    ]
  },
  {
    "code": "3031",
    "market": "tse",
    "names": [
      "佰鴻"
    ]
  },
  {
    "code": "3032",
    "market": "tse",
    "names": [
      "偉訓"
    ]
  },
  {
    "code": "3033",
    "market": "tse",
    "names": [
      "威健"
    ]
  },
  {
    "code": "3034",
    "market": "tse",
    "names": [
      "聯詠",
      "聯詠科技",
      "滷肉",
      "Novatek"
    ]
  },
  {
    "code": "3035",
    "market": "tse",
    "names": [
      "智原"
    ]
  },
  {
    "code": "3036",
    "market": "tse",
    "names": [
      "文曄"
    ]
  },
  {
    "code": "3037",
    "market": "tse",
    "names": [
      "欣興",
      "欣興電子",
      "麵包店",
      "客運",
      "猩猩"
    ]
  },
  {
    "code": "3038",
    "market": "tse",
    "names": [
      "全台"
    ]
  },
  {
    "code": "3040",
    "market": "tse",
    "names": [
      "遠見"
    ]
  },
  {
    "code": "3041",
    "market": "tse",
    "names": [
      "揚智"
    ]
  },
  {
    "code": "3042",
    "market": "tse",
    "names": [
      "晶技"
    ]
  },
  {
    "code": "3043",
    "market": "tse",
    "names": [
      "科風"
    ]
  },
  {
    "code": "3044",
    "market": "tse",
    "names": [
      "健鼎",
      "健鼎科技"
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
    "code": "3046",
    "market": "tse",
    "names": [
      "建碁"
    ]
  },
  {
    "code": "3047",
    "market": "tse",
    "names": [
      "訊舟"
    ]
  },
  {
    "code": "3048",
    "market": "tse",
    "names": [
      "益登"
    ]
  },
  {
    "code": "3049",
    "market": "tse",
    "names": [
      "精金"
    ]
  },
  {
    "code": "3050",
    "market": "tse",
    "names": [
      "鈺德"
    ]
  },
  {
    "code": "3051",
    "market": "tse",
    "names": [
      "力特"
    ]
  },
  {
    "code": "3052",
    "market": "tse",
    "names": [
      "夆典"
    ]
  },
  {
    "code": "3054",
    "market": "tse",
    "names": [
      "立萬利"
    ]
  },
  {
    "code": "3055",
    "market": "tse",
    "names": [
      "蔚華科"
    ]
  },
  {
    "code": "3056",
    "market": "tse",
    "names": [
      "富華新"
    ]
  },
  {
    "code": "3057",
    "market": "tse",
    "names": [
      "喬鼎"
    ]
  },
  {
    "code": "3058",
    "market": "tse",
    "names": [
      "立德"
    ]
  },
  {
    "code": "3059",
    "market": "tse",
    "names": [
      "華晶科"
    ]
  },
  {
    "code": "3060",
    "market": "tse",
    "names": [
      "銘異"
    ]
  },
  {
    "code": "3062",
    "market": "tse",
    "names": [
      "建漢"
    ]
  },
  {
    "code": "3090",
    "market": "tse",
    "names": [
      "日電貿"
    ]
  },
  {
    "code": "3092",
    "market": "tse",
    "names": [
      "鴻碩"
    ]
  },
  {
    "code": "3094",
    "market": "tse",
    "names": [
      "聯傑"
    ]
  },
  {
    "code": "3130",
    "market": "tse",
    "names": [
      "一零四",
      "穩懋",
      "穩懋半導體",
      "穩套",
      "WIN Semi"
    ]
  },
  {
    "code": "3135",
    "market": "tse",
    "names": [
      "凌航"
    ]
  },
  {
    "code": "3138",
    "market": "tse",
    "names": [
      "耀登"
    ]
  },
  {
    "code": "3149",
    "market": "tse",
    "names": [
      "正達",
      "正達國際"
    ]
  },
  {
    "code": "3164",
    "market": "tse",
    "names": [
      "景岳"
    ]
  },
  {
    "code": "3167",
    "market": "tse",
    "names": [
      "大量"
    ]
  },
  {
    "code": "3168",
    "market": "tse",
    "names": [
      "眾福科"
    ]
  },
  {
    "code": "3189",
    "market": "tse",
    "names": [
      "景碩"
    ]
  },
  {
    "code": "3209",
    "market": "tse",
    "names": [
      "全科"
    ]
  },
  {
    "code": "3229",
    "market": "tse",
    "names": [
      "晟鈦"
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
    "code": "3257",
    "market": "tse",
    "names": [
      "虹冠電"
    ]
  },
  {
    "code": "3266",
    "market": "tse",
    "names": [
      "昇陽"
    ]
  },
  {
    "code": "3296",
    "market": "tse",
    "names": [
      "勝德"
    ]
  },
  {
    "code": "3305",
    "market": "tse",
    "names": [
      "昇貿"
    ]
  },
  {
    "code": "3308",
    "market": "tse",
    "names": [
      "聯德"
    ]
  },
  {
    "code": "3311",
    "market": "tse",
    "names": [
      "閎暉"
    ]
  },
  {
    "code": "3312",
    "market": "tse",
    "names": [
      "弘憶股"
    ]
  },
  {
    "code": "3321",
    "market": "tse",
    "names": [
      "同泰"
    ]
  },
  {
    "code": "3338",
    "market": "tse",
    "names": [
      "泰碩"
    ]
  },
  {
    "code": "3346",
    "market": "tse",
    "names": [
      "麗清"
    ]
  },
  {
    "code": "3356",
    "market": "tse",
    "names": [
      "奇偶"
    ]
  },
  {
    "code": "3376",
    "market": "tse",
    "names": [
      "新日興"
    ]
  },
  {
    "code": "3380",
    "market": "tse",
    "names": [
      "明泰"
    ]
  },
  {
    "code": "3406",
    "market": "tse",
    "names": [
      "玉晶光"
    ]
  },
  {
    "code": "3413",
    "market": "tse",
    "names": [
      "京鼎"
    ]
  },
  {
    "code": "3416",
    "market": "tse",
    "names": [
      "融程電"
    ]
  },
  {
    "code": "3419",
    "market": "tse",
    "names": [
      "譁裕"
    ]
  },
  {
    "code": "3432",
    "market": "tse",
    "names": [
      "台端"
    ]
  },
  {
    "code": "3437",
    "market": "tse",
    "names": [
      "榮創"
    ]
  },
  {
    "code": "3443",
    "market": "tse",
    "names": [
      "創意",
      "創意電子"
    ]
  },
  {
    "code": "3450",
    "market": "tse",
    "names": [
      "聯鈞"
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
    "code": "3494",
    "market": "tse",
    "names": [
      "誠研"
    ]
  },
  {
    "code": "3501",
    "market": "tse",
    "names": [
      "維熹"
    ]
  },
  {
    "code": "3504",
    "market": "tse",
    "names": [
      "揚明光"
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
    "code": "3518",
    "market": "tse",
    "names": [
      "柏騰"
    ]
  },
  {
    "code": "3528",
    "market": "tse",
    "names": [
      "安馳"
    ]
  },
  {
    "code": "3530",
    "market": "tse",
    "names": [
      "晶相光"
    ]
  },
  {
    "code": "3532",
    "market": "tse",
    "names": [
      "台勝科"
    ]
  },
  {
    "code": "3533",
    "market": "tse",
    "names": [
      "嘉澤"
    ]
  },
  {
    "code": "3535",
    "market": "tse",
    "names": [
      "晶彩科"
    ]
  },
  {
    "code": "3543",
    "market": "tse",
    "names": [
      "州巧"
    ]
  },
  {
    "code": "3545",
    "market": "tse",
    "names": [
      "敦泰"
    ]
  },
  {
    "code": "3550",
    "market": "tse",
    "names": [
      "聯穎"
    ]
  },
  {
    "code": "3557",
    "market": "tse",
    "names": [
      "嘉威"
    ]
  },
  {
    "code": "3563",
    "market": "tse",
    "names": [
      "牧德"
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
    "code": "3583",
    "market": "tse",
    "names": [
      "辛耘"
    ]
  },
  {
    "code": "3588",
    "market": "tse",
    "names": [
      "通嘉"
    ]
  },
  {
    "code": "3591",
    "market": "tse",
    "names": [
      "艾笛森"
    ]
  },
  {
    "code": "3592",
    "market": "tse",
    "names": [
      "瑞鼎"
    ]
  },
  {
    "code": "3593",
    "market": "tse",
    "names": [
      "力銘"
    ]
  },
  {
    "code": "3596",
    "market": "tse",
    "names": [
      "智易"
    ]
  },
  {
    "code": "3605",
    "market": "tse",
    "names": [
      "宏致"
    ]
  },
  {
    "code": "3607",
    "market": "tse",
    "names": [
      "谷崧"
    ]
  },
  {
    "code": "3617",
    "market": "tse",
    "names": [
      "碩天"
    ]
  },
  {
    "code": "3622",
    "market": "tse",
    "names": [
      "洋華"
    ]
  },
  {
    "code": "3645",
    "market": "tse",
    "names": [
      "達邁"
    ]
  },
  {
    "code": "3652",
    "market": "tse",
    "names": [
      "精聯"
    ]
  },
  {
    "code": "3653",
    "market": "tse",
    "names": [
      "健策"
    ]
  },
  {
    "code": "3661",
    "market": "tse",
    "names": [
      "世芯-KY",
      "世芯"
    ]
  },
  {
    "code": "3665",
    "market": "tse",
    "names": [
      "貿聯-KY",
      "貿聯"
    ]
  },
  {
    "code": "3673",
    "market": "tse",
    "names": [
      "TPK-KY",
      "TPK"
    ]
  },
  {
    "code": "3679",
    "market": "tse",
    "names": [
      "新至陞"
    ]
  },
  {
    "code": "3686",
    "market": "tse",
    "names": [
      "達能"
    ]
  },
  {
    "code": "3694",
    "market": "tse",
    "names": [
      "海華"
    ]
  },
  {
    "code": "3701",
    "market": "tse",
    "names": [
      "大眾控"
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
    "code": "3703",
    "market": "tse",
    "names": [
      "欣陸"
    ]
  },
  {
    "code": "3704",
    "market": "tse",
    "names": [
      "合勤控"
    ]
  },
  {
    "code": "3705",
    "market": "tse",
    "names": [
      "永信"
    ]
  },
  {
    "code": "3706",
    "market": "tse",
    "names": [
      "神達"
    ]
  },
  {
    "code": "3708",
    "market": "tse",
    "names": [
      "上緯投控"
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
    "code": "3712",
    "market": "tse",
    "names": [
      "永崴投控"
    ]
  },
  {
    "code": "3714",
    "market": "tse",
    "names": [
      "富采"
    ]
  },
  {
    "code": "3715",
    "market": "tse",
    "names": [
      "定穎投控"
    ]
  },
  {
    "code": "3716",
    "market": "tse",
    "names": [
      "中化控股"
    ]
  },
  {
    "code": "3717",
    "market": "tse",
    "names": [
      "聯嘉投控"
    ]
  },
  {
    "code": "4104",
    "market": "tse",
    "names": [
      "佳醫"
    ]
  },
  {
    "code": "4106",
    "market": "tse",
    "names": [
      "雃博"
    ]
  },
  {
    "code": "4108",
    "market": "tse",
    "names": [
      "懷特"
    ]
  },
  {
    "code": "4119",
    "market": "tse",
    "names": [
      "旭富"
    ]
  },
  {
    "code": "4133",
    "market": "tse",
    "names": [
      "亞諾法"
    ]
  },
  {
    "code": "4137",
    "market": "tse",
    "names": [
      "麗豐-KY",
      "麗豐"
    ]
  },
  {
    "code": "4142",
    "market": "tse",
    "names": [
      "國光生"
    ]
  },
  {
    "code": "4148",
    "market": "tse",
    "names": [
      "全宇生技-KY",
      "全宇生技"
    ]
  },
  {
    "code": "4155",
    "market": "tse",
    "names": [
      "訊映"
    ]
  },
  {
    "code": "4164",
    "market": "tse",
    "names": [
      "承業醫"
    ]
  },
  {
    "code": "4169",
    "market": "tse",
    "names": [
      "泰宗"
    ]
  },
  {
    "code": "4178",
    "market": "tse",
    "names": [
      "永笙-KY",
      "永笙"
    ]
  },
  {
    "code": "4190",
    "market": "tse",
    "names": [
      "佐登-KY",
      "佐登"
    ]
  },
  {
    "code": "4306",
    "market": "tse",
    "names": [
      "炎洲"
    ]
  },
  {
    "code": "4414",
    "market": "tse",
    "names": [
      "如興"
    ]
  },
  {
    "code": "4426",
    "market": "tse",
    "names": [
      "利勤"
    ]
  },
  {
    "code": "4438",
    "market": "tse",
    "names": [
      "廣越"
    ]
  },
  {
    "code": "4439",
    "market": "tse",
    "names": [
      "冠星-KY",
      "冠星"
    ]
  },
  {
    "code": "4440",
    "market": "tse",
    "names": [
      "宜新實業"
    ]
  },
  {
    "code": "4441",
    "market": "tse",
    "names": [
      "振大環球"
    ]
  },
  {
    "code": "4526",
    "market": "tse",
    "names": [
      "東台"
    ]
  },
  {
    "code": "4532",
    "market": "tse",
    "names": [
      "瑞智"
    ]
  },
  {
    "code": "4536",
    "market": "tse",
    "names": [
      "拓凱"
    ]
  },
  {
    "code": "4540",
    "market": "tse",
    "names": [
      "全球傳動"
    ]
  },
  {
    "code": "4545",
    "market": "tse",
    "names": [
      "銘鈺"
    ]
  },
  {
    "code": "4551",
    "market": "tse",
    "names": [
      "智伸科"
    ]
  },
  {
    "code": "4552",
    "market": "tse",
    "names": [
      "力達-KY",
      "力達"
    ]
  },
  {
    "code": "4555",
    "market": "tse",
    "names": [
      "氣立"
    ]
  },
  {
    "code": "4557",
    "market": "tse",
    "names": [
      "永新-KY",
      "永新"
    ]
  },
  {
    "code": "4560",
    "market": "tse",
    "names": [
      "強信-KY",
      "強信"
    ]
  },
  {
    "code": "4562",
    "market": "tse",
    "names": [
      "穎漢"
    ]
  },
  {
    "code": "4564",
    "market": "tse",
    "names": [
      "元翎"
    ]
  },
  {
    "code": "4566",
    "market": "tse",
    "names": [
      "時碩工業"
    ]
  },
  {
    "code": "4569",
    "market": "tse",
    "names": [
      "六方科-KY",
      "六方科"
    ]
  },
  {
    "code": "4571",
    "market": "tse",
    "names": [
      "鈞興-KY",
      "鈞興"
    ]
  },
  {
    "code": "4572",
    "market": "tse",
    "names": [
      "駐龍"
    ]
  },
  {
    "code": "4576",
    "market": "tse",
    "names": [
      "大銀微系統"
    ]
  },
  {
    "code": "4581",
    "market": "tse",
    "names": [
      "光隆精密-KY",
      "光隆精密"
    ]
  },
  {
    "code": "4583",
    "market": "tse",
    "names": [
      "台灣精銳"
    ]
  },
  {
    "code": "4585",
    "market": "tse",
    "names": [
      "達明"
    ]
  },
  {
    "code": "4588",
    "market": "tse",
    "names": [
      "玖鼎電力"
    ]
  },
  {
    "code": "4720",
    "market": "tse",
    "names": [
      "德淵"
    ]
  },
  {
    "code": "4722",
    "market": "tse",
    "names": [
      "國精化"
    ]
  },
  {
    "code": "4736",
    "market": "tse",
    "names": [
      "泰博"
    ]
  },
  {
    "code": "4737",
    "market": "tse",
    "names": [
      "華廣"
    ]
  },
  {
    "code": "4739",
    "market": "tse",
    "names": [
      "康普"
    ]
  },
  {
    "code": "4746",
    "market": "tse",
    "names": [
      "台耀"
    ]
  },
  {
    "code": "4755",
    "market": "tse",
    "names": [
      "三福化"
    ]
  },
  {
    "code": "4763",
    "market": "tse",
    "names": [
      "材料*-KY",
      "材料*"
    ]
  },
  {
    "code": "4764",
    "market": "tse",
    "names": [
      "雙鍵"
    ]
  },
  {
    "code": "4766",
    "market": "tse",
    "names": [
      "南寶"
    ]
  },
  {
    "code": "4770",
    "market": "tse",
    "names": [
      "上品"
    ]
  },
  {
    "code": "4771",
    "market": "tse",
    "names": [
      "望隼"
    ]
  },
  {
    "code": "4807",
    "market": "tse",
    "names": [
      "日成-KY",
      "日成"
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
    "code": "4906",
    "market": "tse",
    "names": [
      "正文"
    ]
  },
  {
    "code": "4912",
    "market": "tse",
    "names": [
      "聯德控股-KY",
      "聯德控股"
    ]
  },
  {
    "code": "4915",
    "market": "tse",
    "names": [
      "致伸"
    ]
  },
  {
    "code": "4916",
    "market": "tse",
    "names": [
      "事欣科"
    ]
  },
  {
    "code": "4919",
    "market": "tse",
    "names": [
      "新唐"
    ]
  },
  {
    "code": "4927",
    "market": "tse",
    "names": [
      "泰鼎-KY",
      "泰鼎"
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
    "code": "4934",
    "market": "tse",
    "names": [
      "太極"
    ]
  },
  {
    "code": "4935",
    "market": "tse",
    "names": [
      "茂林-KY",
      "茂林"
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
    "code": "4942",
    "market": "tse",
    "names": [
      "嘉彰"
    ]
  },
  {
    "code": "4943",
    "market": "tse",
    "names": [
      "康控-KY",
      "康控"
    ]
  },
  {
    "code": "4949",
    "market": "tse",
    "names": [
      "有成精密"
    ]
  },
  {
    "code": "4952",
    "market": "tse",
    "names": [
      "凌通"
    ]
  },
  {
    "code": "4956",
    "market": "tse",
    "names": [
      "光鋐"
    ]
  },
  {
    "code": "4958",
    "market": "tse",
    "names": [
      "臻鼎-KY",
      "臻鼎"
    ]
  },
  {
    "code": "4960",
    "market": "tse",
    "names": [
      "誠美材"
    ]
  },
  {
    "code": "4961",
    "market": "tse",
    "names": [
      "天鈺"
    ]
  },
  {
    "code": "4967",
    "market": "tse",
    "names": [
      "十銓"
    ]
  },
  {
    "code": "4968",
    "market": "tse",
    "names": [
      "立積"
    ]
  },
  {
    "code": "4976",
    "market": "tse",
    "names": [
      "佳凌"
    ]
  },
  {
    "code": "4977",
    "market": "tse",
    "names": [
      "眾達-KY",
      "眾達"
    ]
  },
  {
    "code": "4989",
    "market": "tse",
    "names": [
      "榮科"
    ]
  },
  {
    "code": "4994",
    "market": "tse",
    "names": [
      "傳奇"
    ]
  },
  {
    "code": "4999",
    "market": "tse",
    "names": [
      "鑫禾"
    ]
  },
  {
    "code": "5007",
    "market": "tse",
    "names": [
      "三星"
    ]
  },
  {
    "code": "5203",
    "market": "tse",
    "names": [
      "訊連"
    ]
  },
  {
    "code": "5215",
    "market": "tse",
    "names": [
      "科嘉-KY",
      "科嘉"
    ]
  },
  {
    "code": "5222",
    "market": "tse",
    "names": [
      "全訊"
    ]
  },
  {
    "code": "5225",
    "market": "tse",
    "names": [
      "東科-KY",
      "東科"
    ]
  },
  {
    "code": "5234",
    "market": "tse",
    "names": [
      "達興材料"
    ]
  },
  {
    "code": "5236",
    "market": "tse",
    "names": [
      "凌陽創新"
    ]
  },
  {
    "code": "5243",
    "market": "tse",
    "names": [
      "乙盛-KY",
      "乙盛"
    ]
  },
  {
    "code": "5244",
    "market": "tse",
    "names": [
      "弘凱"
    ]
  },
  {
    "code": "5258",
    "market": "tse",
    "names": [
      "虹堡"
    ]
  },
  {
    "code": "5269",
    "market": "tse",
    "names": [
      "祥碩"
    ]
  },
  {
    "code": "5283",
    "market": "tse",
    "names": [
      "禾聯碩"
    ]
  },
  {
    "code": "5284",
    "market": "tse",
    "names": [
      "jpp-KY",
      "jpp"
    ]
  },
  {
    "code": "5285",
    "market": "tse",
    "names": [
      "界霖"
    ]
  },
  {
    "code": "5288",
    "market": "tse",
    "names": [
      "豐祥-KY",
      "豐祥"
    ]
  },
  {
    "code": "5292",
    "market": "tse",
    "names": [
      "華懋"
    ]
  },
  {
    "code": "5306",
    "market": "tse",
    "names": [
      "桂盟"
    ]
  },
  {
    "code": "5388",
    "market": "tse",
    "names": [
      "中磊",
      "中磊電子"
    ]
  },
  {
    "code": "5434",
    "market": "tse",
    "names": [
      "崇越"
    ]
  },
  {
    "code": "5469",
    "market": "tse",
    "names": [
      "瀚宇博"
    ]
  },
  {
    "code": "5471",
    "market": "tse",
    "names": [
      "松翰"
    ]
  },
  {
    "code": "5484",
    "market": "tse",
    "names": [
      "慧友"
    ]
  },
  {
    "code": "5515",
    "market": "tse",
    "names": [
      "建國"
    ]
  },
  {
    "code": "5519",
    "market": "tse",
    "names": [
      "隆大"
    ]
  },
  {
    "code": "5521",
    "market": "tse",
    "names": [
      "工信"
    ]
  },
  {
    "code": "5522",
    "market": "tse",
    "names": [
      "遠雄"
    ]
  },
  {
    "code": "5525",
    "market": "tse",
    "names": [
      "順天"
    ]
  },
  {
    "code": "5531",
    "market": "tse",
    "names": [
      "鄉林"
    ]
  },
  {
    "code": "5533",
    "market": "tse",
    "names": [
      "皇鼎"
    ]
  },
  {
    "code": "5534",
    "market": "tse",
    "names": [
      "長虹"
    ]
  },
  {
    "code": "5538",
    "market": "tse",
    "names": [
      "東明-KY",
      "東明"
    ]
  },
  {
    "code": "5546",
    "market": "tse",
    "names": [
      "永固-KY",
      "永固"
    ]
  },
  {
    "code": "5607",
    "market": "tse",
    "names": [
      "遠雄港"
    ]
  },
  {
    "code": "5608",
    "market": "tse",
    "names": [
      "四維航"
    ]
  },
  {
    "code": "5706",
    "market": "tse",
    "names": [
      "鳳凰"
    ]
  },
  {
    "code": "5871",
    "market": "tse",
    "names": [
      "中租-KY",
      "中租"
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
    "code": "5880",
    "market": "tse",
    "names": [
      "合庫金",
      "合庫",
      "合作金庫"
    ]
  },
  {
    "code": "5906",
    "market": "tse",
    "names": [
      "台南-KY",
      "台南"
    ]
  },
  {
    "code": "5907",
    "market": "tse",
    "names": [
      "大洋-KY",
      "大洋"
    ]
  },
  {
    "code": "6005",
    "market": "tse",
    "names": [
      "群益證"
    ]
  },
  {
    "code": "6024",
    "market": "tse",
    "names": [
      "群益期"
    ]
  },
  {
    "code": "6108",
    "market": "tse",
    "names": [
      "競國"
    ]
  },
  {
    "code": "6112",
    "market": "tse",
    "names": [
      "邁達特"
    ]
  },
  {
    "code": "6115",
    "market": "tse",
    "names": [
      "鎰勝"
    ]
  },
  {
    "code": "6116",
    "market": "tse",
    "names": [
      "彩晶"
    ]
  },
  {
    "code": "6117",
    "market": "tse",
    "names": [
      "迎廣"
    ]
  },
  {
    "code": "6120",
    "market": "tse",
    "names": [
      "達運"
    ]
  },
  {
    "code": "6128",
    "market": "tse",
    "names": [
      "上福"
    ]
  },
  {
    "code": "6133",
    "market": "tse",
    "names": [
      "金橋"
    ]
  },
  {
    "code": "6136",
    "market": "tse",
    "names": [
      "富爾特"
    ]
  },
  {
    "code": "6139",
    "market": "tse",
    "names": [
      "亞翔"
    ]
  },
  {
    "code": "6141",
    "market": "tse",
    "names": [
      "柏承"
    ]
  },
  {
    "code": "6142",
    "market": "tse",
    "names": [
      "友勁"
    ]
  },
  {
    "code": "6152",
    "market": "tse",
    "names": [
      "百一"
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
    "code": "6155",
    "market": "tse",
    "names": [
      "鈞寶"
    ]
  },
  {
    "code": "6164",
    "market": "tse",
    "names": [
      "華興"
    ]
  },
  {
    "code": "6165",
    "market": "tse",
    "names": [
      "浪凡"
    ]
  },
  {
    "code": "6166",
    "market": "tse",
    "names": [
      "凌華"
    ]
  },
  {
    "code": "6168",
    "market": "tse",
    "names": [
      "宏齊"
    ]
  },
  {
    "code": "6176",
    "market": "tse",
    "names": [
      "瑞儀"
    ]
  },
  {
    "code": "6177",
    "market": "tse",
    "names": [
      "達麗"
    ]
  },
  {
    "code": "6183",
    "market": "tse",
    "names": [
      "關貿"
    ]
  },
  {
    "code": "6184",
    "market": "tse",
    "names": [
      "大豐電"
    ]
  },
  {
    "code": "6189",
    "market": "tse",
    "names": [
      "豐藝"
    ]
  },
  {
    "code": "6191",
    "market": "tse",
    "names": [
      "精成科"
    ]
  },
  {
    "code": "6192",
    "market": "tse",
    "names": [
      "巨路"
    ]
  },
  {
    "code": "6196",
    "market": "tse",
    "names": [
      "帆宣"
    ]
  },
  {
    "code": "6197",
    "market": "tse",
    "names": [
      "佳必琪"
    ]
  },
  {
    "code": "6201",
    "market": "tse",
    "names": [
      "亞弘電"
    ]
  },
  {
    "code": "6202",
    "market": "tse",
    "names": [
      "盛群"
    ]
  },
  {
    "code": "6205",
    "market": "tse",
    "names": [
      "詮欣"
    ]
  },
  {
    "code": "6206",
    "market": "tse",
    "names": [
      "飛捷"
    ]
  },
  {
    "code": "6209",
    "market": "tse",
    "names": [
      "今國光"
    ]
  },
  {
    "code": "6213",
    "market": "tse",
    "names": [
      "聯茂"
    ]
  },
  {
    "code": "6214",
    "market": "tse",
    "names": [
      "精誠"
    ]
  },
  {
    "code": "6215",
    "market": "tse",
    "names": [
      "和椿"
    ]
  },
  {
    "code": "6216",
    "market": "tse",
    "names": [
      "居易"
    ]
  },
  {
    "code": "6224",
    "market": "tse",
    "names": [
      "聚鼎"
    ]
  },
  {
    "code": "6225",
    "market": "tse",
    "names": [
      "天瀚"
    ]
  },
  {
    "code": "6226",
    "market": "tse",
    "names": [
      "光鼎"
    ]
  },
  {
    "code": "6230",
    "market": "tse",
    "names": [
      "尼得科超眾"
    ]
  },
  {
    "code": "6235",
    "market": "tse",
    "names": [
      "華孚"
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
    "code": "6243",
    "market": "tse",
    "names": [
      "迅杰"
    ]
  },
  {
    "code": "6257",
    "market": "tse",
    "names": [
      "矽格"
    ]
  },
  {
    "code": "6269",
    "market": "tse",
    "names": [
      "台郡"
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
    "code": "6272",
    "market": "tse",
    "names": [
      "驊陞"
    ]
  },
  {
    "code": "6277",
    "market": "tse",
    "names": [
      "宏正"
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
    "code": "6281",
    "market": "tse",
    "names": [
      "全國電"
    ]
  },
  {
    "code": "6282",
    "market": "tse",
    "names": [
      "康舒"
    ]
  },
  {
    "code": "6283",
    "market": "tse",
    "names": [
      "淳安"
    ]
  },
  {
    "code": "6285",
    "market": "tse",
    "names": [
      "啟碁"
    ]
  },
  {
    "code": "6405",
    "market": "tse",
    "names": [
      "悅城"
    ]
  },
  {
    "code": "6409",
    "market": "tse",
    "names": [
      "旭隼"
    ]
  },
  {
    "code": "6412",
    "market": "tse",
    "names": [
      "群電"
    ]
  },
  {
    "code": "6414",
    "market": "tse",
    "names": [
      "樺漢"
    ]
  },
  {
    "code": "6415",
    "market": "tse",
    "names": [
      "矽力*-KY",
      "矽力*"
    ]
  },
  {
    "code": "6416",
    "market": "tse",
    "names": [
      "瑞祺電通"
    ]
  },
  {
    "code": "6426",
    "market": "tse",
    "names": [
      "統新"
    ]
  },
  {
    "code": "6431",
    "market": "tse",
    "names": [
      "光麗-KY",
      "光麗"
    ]
  },
  {
    "code": "6438",
    "market": "tse",
    "names": [
      "迅得"
    ]
  },
  {
    "code": "6442",
    "market": "tse",
    "names": [
      "光聖"
    ]
  },
  {
    "code": "6443",
    "market": "tse",
    "names": [
      "元晶"
    ]
  },
  {
    "code": "6446",
    "market": "tse",
    "names": [
      "藥華藥"
    ]
  },
  {
    "code": "6449",
    "market": "tse",
    "names": [
      "鈺邦"
    ]
  },
  {
    "code": "6451",
    "market": "tse",
    "names": [
      "訊芯-KY",
      "訊芯"
    ]
  },
  {
    "code": "6456",
    "market": "tse",
    "names": [
      "GIS-KY",
      "GIS"
    ]
  },
  {
    "code": "6464",
    "market": "tse",
    "names": [
      "台數科"
    ]
  },
  {
    "code": "6472",
    "market": "tse",
    "names": [
      "保瑞"
    ]
  },
  {
    "code": "6477",
    "market": "tse",
    "names": [
      "安集"
    ]
  },
  {
    "code": "6491",
    "market": "tse",
    "names": [
      "晶碩"
    ]
  },
  {
    "code": "6504",
    "market": "tse",
    "names": [
      "南六"
    ]
  },
  {
    "code": "6505",
    "market": "tse",
    "names": [
      "台塑化"
    ]
  },
  {
    "code": "6515",
    "market": "tse",
    "names": [
      "穎崴"
    ]
  },
  {
    "code": "6525",
    "market": "tse",
    "names": [
      "捷敏-KY",
      "捷敏"
    ]
  },
  {
    "code": "6526",
    "market": "tse",
    "names": [
      "達發"
    ]
  },
  {
    "code": "6531",
    "market": "tse",
    "names": [
      "愛普*"
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
    "code": "6541",
    "market": "tse",
    "names": [
      "泰福-KY",
      "泰福"
    ]
  },
  {
    "code": "6550",
    "market": "tse",
    "names": [
      "北極星藥業-KY",
      "北極星藥業"
    ]
  },
  {
    "code": "6552",
    "market": "tse",
    "names": [
      "易華電"
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
    "code": "6573",
    "market": "tse",
    "names": [
      "虹揚-KY",
      "虹揚"
    ]
  },
  {
    "code": "6579",
    "market": "tse",
    "names": [
      "研揚"
    ]
  },
  {
    "code": "6581",
    "market": "tse",
    "names": [
      "鋼聯"
    ]
  },
  {
    "code": "6582",
    "market": "tse",
    "names": [
      "申豐"
    ]
  },
  {
    "code": "6585",
    "market": "tse",
    "names": [
      "鼎基"
    ]
  },
  {
    "code": "6589",
    "market": "tse",
    "names": [
      "台康生技"
    ]
  },
  {
    "code": "6591",
    "market": "tse",
    "names": [
      "動力-KY",
      "動力"
    ]
  },
  {
    "code": "6592",
    "market": "tse",
    "names": [
      "和潤企業"
    ]
  },
  {
    "code": "6598",
    "market": "tse",
    "names": [
      "ABC-KY",
      "ABC"
    ]
  },
  {
    "code": "6605",
    "market": "tse",
    "names": [
      "帝寶"
    ]
  },
  {
    "code": "6606",
    "market": "tse",
    "names": [
      "建德工業"
    ]
  },
  {
    "code": "6614",
    "market": "tse",
    "names": [
      "資拓宏宇"
    ]
  },
  {
    "code": "6625",
    "market": "tse",
    "names": [
      "必應"
    ]
  },
  {
    "code": "6641",
    "market": "tse",
    "names": [
      "基士德-KY",
      "基士德"
    ]
  },
  {
    "code": "6655",
    "market": "tse",
    "names": [
      "科定"
    ]
  },
  {
    "code": "6657",
    "market": "tse",
    "names": [
      "華安"
    ]
  },
  {
    "code": "6658",
    "market": "tse",
    "names": [
      "聯策"
    ]
  },
  {
    "code": "6666",
    "market": "tse",
    "names": [
      "羅麗芬-KY",
      "羅麗芬"
    ]
  },
  {
    "code": "6668",
    "market": "tse",
    "names": [
      "中揚光"
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
    "code": "6670",
    "market": "tse",
    "names": [
      "復盛應用"
    ]
  },
  {
    "code": "6671",
    "market": "tse",
    "names": [
      "三能-KY",
      "三能"
    ]
  },
  {
    "code": "6672",
    "market": "tse",
    "names": [
      "騰輝電子-KY",
      "騰輝電子"
    ]
  },
  {
    "code": "6674",
    "market": "tse",
    "names": [
      "鋐寶科技"
    ]
  },
  {
    "code": "6689",
    "market": "tse",
    "names": [
      "伊雲谷"
    ]
  },
  {
    "code": "6691",
    "market": "tse",
    "names": [
      "洋基工程"
    ]
  },
  {
    "code": "6695",
    "market": "tse",
    "names": [
      "芯鼎"
    ]
  },
  {
    "code": "6698",
    "market": "tse",
    "names": [
      "旭暉應材"
    ]
  },
  {
    "code": "6706",
    "market": "tse",
    "names": [
      "惠特"
    ]
  },
  {
    "code": "6715",
    "market": "tse",
    "names": [
      "嘉基"
    ]
  },
  {
    "code": "6719",
    "market": "tse",
    "names": [
      "力智"
    ]
  },
  {
    "code": "6722",
    "market": "tse",
    "names": [
      "輝創"
    ]
  },
  {
    "code": "6742",
    "market": "tse",
    "names": [
      "澤米"
    ]
  },
  {
    "code": "6743",
    "market": "tse",
    "names": [
      "安普新"
    ]
  },
  {
    "code": "6753",
    "market": "tse",
    "names": [
      "龍德造船"
    ]
  },
  {
    "code": "6754",
    "market": "tse",
    "names": [
      "匯僑設計"
    ]
  },
  {
    "code": "6756",
    "market": "tse",
    "names": [
      "威鋒電子"
    ]
  },
  {
    "code": "6757",
    "market": "tse",
    "names": [
      "台灣虎航"
    ]
  },
  {
    "code": "6768",
    "market": "tse",
    "names": [
      "志強-KY",
      "志強"
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
      "天后",
      "栗子電"
    ]
  },
  {
    "code": "6781",
    "market": "tse",
    "names": [
      "AES-KY",
      "AES"
    ]
  },
  {
    "code": "6782",
    "market": "tse",
    "names": [
      "視陽"
    ]
  },
  {
    "code": "6789",
    "market": "tse",
    "names": [
      "采鈺"
    ]
  },
  {
    "code": "6790",
    "market": "tse",
    "names": [
      "永豐實"
    ]
  },
  {
    "code": "6792",
    "market": "tse",
    "names": [
      "詠業"
    ]
  },
  {
    "code": "6794",
    "market": "tse",
    "names": [
      "向榮生技"
    ]
  },
  {
    "code": "6796",
    "market": "tse",
    "names": [
      "晉弘"
    ]
  },
  {
    "code": "6799",
    "market": "tse",
    "names": [
      "來頡"
    ]
  },
  {
    "code": "6805",
    "market": "tse",
    "names": [
      "富世達"
    ]
  },
  {
    "code": "6807",
    "market": "tse",
    "names": [
      "峰源-KY",
      "峰源"
    ]
  },
  {
    "code": "6830",
    "market": "tse",
    "names": [
      "汎銓"
    ]
  },
  {
    "code": "6831",
    "market": "tse",
    "names": [
      "邁科"
    ]
  },
  {
    "code": "6834",
    "market": "tse",
    "names": [
      "天二科技"
    ]
  },
  {
    "code": "6835",
    "market": "tse",
    "names": [
      "圓裕"
    ]
  },
  {
    "code": "6838",
    "market": "tse",
    "names": [
      "台新藥"
    ]
  },
  {
    "code": "6861",
    "market": "tse",
    "names": [
      "睿生光電"
    ]
  },
  {
    "code": "6862",
    "market": "tse",
    "names": [
      "三集瑞-KY",
      "三集瑞"
    ]
  },
  {
    "code": "6863",
    "market": "tse",
    "names": [
      "永道-KY",
      "永道"
    ]
  },
  {
    "code": "6869",
    "market": "tse",
    "names": [
      "雲豹能源"
    ]
  },
  {
    "code": "6873",
    "market": "tse",
    "names": [
      "泓德能源"
    ]
  },
  {
    "code": "6885",
    "market": "tse",
    "names": [
      "全福生技"
    ]
  },
  {
    "code": "6887",
    "market": "tse",
    "names": [
      "寶綠特-KY",
      "寶綠特"
    ]
  },
  {
    "code": "6890",
    "market": "tse",
    "names": [
      "來億-KY",
      "來億"
    ]
  },
  {
    "code": "6901",
    "market": "tse",
    "names": [
      "鑽石投資"
    ]
  },
  {
    "code": "6902",
    "market": "tse",
    "names": [
      "GOGOLOOK"
    ]
  },
  {
    "code": "6906",
    "market": "tse",
    "names": [
      "現觀科"
    ]
  },
  {
    "code": "6909",
    "market": "tse",
    "names": [
      "創控"
    ]
  },
  {
    "code": "6914",
    "market": "tse",
    "names": [
      "阜爾運通"
    ]
  },
  {
    "code": "6916",
    "market": "tse",
    "names": [
      "華凌"
    ]
  },
  {
    "code": "6918",
    "market": "tse",
    "names": [
      "愛派司"
    ]
  },
  {
    "code": "6919",
    "market": "tse",
    "names": [
      "康霈*"
    ]
  },
  {
    "code": "6923",
    "market": "tse",
    "names": [
      "中台"
    ]
  },
  {
    "code": "6928",
    "market": "tse",
    "names": [
      "攸泰科技"
    ]
  },
  {
    "code": "6931",
    "market": "tse",
    "names": [
      "青松健康"
    ]
  },
  {
    "code": "6933",
    "market": "tse",
    "names": [
      "AMAX-KY",
      "AMAX"
    ]
  },
  {
    "code": "6934",
    "market": "tse",
    "names": [
      "心誠鎂"
    ]
  },
  {
    "code": "6936",
    "market": "tse",
    "names": [
      "永鴻生技"
    ]
  },
  {
    "code": "6937",
    "market": "tse",
    "names": [
      "天虹"
    ]
  },
  {
    "code": "6944",
    "market": "tse",
    "names": [
      "兆聯實業"
    ]
  },
  {
    "code": "6947",
    "market": "tse",
    "names": [
      "台鎔科技"
    ]
  },
  {
    "code": "6952",
    "market": "tse",
    "names": [
      "大武山"
    ]
  },
  {
    "code": "6957",
    "market": "tse",
    "names": [
      "裕慶-KY",
      "裕慶"
    ]
  },
  {
    "code": "6958",
    "market": "tse",
    "names": [
      "日盛台駿"
    ]
  },
  {
    "code": "6962",
    "market": "tse",
    "names": [
      "奕力-KY",
      "奕力"
    ]
  },
  {
    "code": "6965",
    "market": "tse",
    "names": [
      "中傑-KY",
      "中傑"
    ]
  },
  {
    "code": "6994",
    "market": "tse",
    "names": [
      "富威電力"
    ]
  },
  {
    "code": "7705",
    "market": "tse",
    "names": [
      "三商餐飲"
    ]
  },
  {
    "code": "7711",
    "market": "tse",
    "names": [
      "永擎"
    ]
  },
  {
    "code": "7721",
    "market": "tse",
    "names": [
      "微程式"
    ]
  },
  {
    "code": "7722",
    "market": "tse",
    "names": [
      "LINEPAY"
    ]
  },
  {
    "code": "7732",
    "market": "tse",
    "names": [
      "金興精密"
    ]
  },
  {
    "code": "7736",
    "market": "tse",
    "names": [
      "虎山"
    ]
  },
  {
    "code": "7749",
    "market": "tse",
    "names": [
      "意騰-KY",
      "意騰"
    ]
  },
  {
    "code": "7750",
    "market": "tse",
    "names": [
      "新代"
    ]
  },
  {
    "code": "7760",
    "market": "tse",
    "names": [
      "享溫馨"
    ]
  },
  {
    "code": "7765",
    "market": "tse",
    "names": [
      "中華資安"
    ]
  },
  {
    "code": "7768",
    "market": "tse",
    "names": [
      "頌勝科技"
    ]
  },
  {
    "code": "7769",
    "market": "tse",
    "names": [
      "鴻勁"
    ]
  },
  {
    "code": "7780",
    "market": "tse",
    "names": [
      "大研生醫*"
    ]
  },
  {
    "code": "7786",
    "market": "tse",
    "names": [
      "東方風能"
    ]
  },
  {
    "code": "7788",
    "market": "tse",
    "names": [
      "松川精密"
    ]
  },
  {
    "code": "7791",
    "market": "tse",
    "names": [
      "皇家可口"
    ]
  },
  {
    "code": "7795",
    "market": "tse",
    "names": [
      "長廣"
    ]
  },
  {
    "code": "7799",
    "market": "tse",
    "names": [
      "禾榮科"
    ]
  },
  {
    "code": "7818",
    "market": "tse",
    "names": [
      "溢泰實業"
    ]
  },
  {
    "code": "7821",
    "market": "tse",
    "names": [
      "神數"
    ]
  },
  {
    "code": "7822",
    "market": "tse",
    "names": [
      "倍利科"
    ]
  },
  {
    "code": "8011",
    "market": "tse",
    "names": [
      "台通"
    ]
  },
  {
    "code": "8016",
    "market": "tse",
    "names": [
      "矽創"
    ]
  },
  {
    "code": "8021",
    "market": "tse",
    "names": [
      "尖點"
    ]
  },
  {
    "code": "8028",
    "market": "tse",
    "names": [
      "昇陽半導體"
    ]
  },
  {
    "code": "8033",
    "market": "tse",
    "names": [
      "雷虎"
    ]
  },
  {
    "code": "8039",
    "market": "tse",
    "names": [
      "台虹"
    ]
  },
  {
    "code": "8045",
    "market": "tse",
    "names": [
      "達運光電"
    ]
  },
  {
    "code": "8046",
    "market": "tse",
    "names": [
      "南電",
      "南電科技",
      "南店",
      "難電"
    ]
  },
  {
    "code": "8070",
    "market": "tse",
    "names": [
      "長華*"
    ]
  },
  {
    "code": "8072",
    "market": "tse",
    "names": [
      "陞泰"
    ]
  },
  {
    "code": "8081",
    "market": "tse",
    "names": [
      "致新"
    ]
  },
  {
    "code": "8101",
    "market": "tse",
    "names": [
      "華冠"
    ]
  },
  {
    "code": "8103",
    "market": "tse",
    "names": [
      "瀚荃",
      "波若威",
      "波波"
    ]
  },
  {
    "code": "8104",
    "market": "tse",
    "names": [
      "錸寶"
    ]
  },
  {
    "code": "8105",
    "market": "tse",
    "names": [
      "凌巨"
    ]
  },
  {
    "code": "8110",
    "market": "tse",
    "names": [
      "華東"
    ]
  },
  {
    "code": "8112",
    "market": "tse",
    "names": [
      "至上"
    ]
  },
  {
    "code": "8114",
    "market": "tse",
    "names": [
      "振樺電"
    ]
  },
  {
    "code": "8131",
    "market": "tse",
    "names": [
      "福懋科"
    ]
  },
  {
    "code": "8150",
    "market": "tse",
    "names": [
      "南茂",
      "南茂科技"
    ]
  },
  {
    "code": "8163",
    "market": "tse",
    "names": [
      "達方"
    ]
  },
  {
    "code": "8201",
    "market": "tse",
    "names": [
      "無敵"
    ]
  },
  {
    "code": "8210",
    "market": "tse",
    "names": [
      "勤誠"
    ]
  },
  {
    "code": "8213",
    "market": "tse",
    "names": [
      "志超"
    ]
  },
  {
    "code": "8215",
    "market": "tse",
    "names": [
      "明基材"
    ]
  },
  {
    "code": "8222",
    "market": "tse",
    "names": [
      "寶一"
    ]
  },
  {
    "code": "8249",
    "market": "tse",
    "names": [
      "菱光"
    ]
  },
  {
    "code": "8261",
    "market": "tse",
    "names": [
      "富鼎"
    ]
  },
  {
    "code": "8271",
    "market": "tse",
    "names": [
      "宇瞻"
    ]
  },
  {
    "code": "8341",
    "market": "tse",
    "names": [
      "日友"
    ]
  },
  {
    "code": "8367",
    "market": "tse",
    "names": [
      "建新國際"
    ]
  },
  {
    "code": "8374",
    "market": "tse",
    "names": [
      "羅昇"
    ]
  },
  {
    "code": "8404",
    "market": "tse",
    "names": [
      "百和興業-KY",
      "百和興業"
    ]
  },
  {
    "code": "8411",
    "market": "tse",
    "names": [
      "福貞-KY",
      "福貞"
    ]
  },
  {
    "code": "8422",
    "market": "tse",
    "names": [
      "可寧衛*"
    ]
  },
  {
    "code": "8429",
    "market": "tse",
    "names": [
      "金麗-KY",
      "金麗"
    ]
  },
  {
    "code": "8438",
    "market": "tse",
    "names": [
      "昶昕"
    ]
  },
  {
    "code": "8442",
    "market": "tse",
    "names": [
      "威宏-KY",
      "威宏"
    ]
  },
  {
    "code": "8443",
    "market": "tse",
    "names": [
      "阿瘦"
    ]
  },
  {
    "code": "8454",
    "market": "tse",
    "names": [
      "富邦媒"
    ]
  },
  {
    "code": "8462",
    "market": "tse",
    "names": [
      "柏文"
    ]
  },
  {
    "code": "8463",
    "market": "tse",
    "names": [
      "潤泰材"
    ]
  },
  {
    "code": "8464",
    "market": "tse",
    "names": [
      "億豐"
    ]
  },
  {
    "code": "8466",
    "market": "tse",
    "names": [
      "美吉吉-KY",
      "美吉吉"
    ]
  },
  {
    "code": "8467",
    "market": "tse",
    "names": [
      "波力-KY",
      "波力"
    ]
  },
  {
    "code": "8473",
    "market": "tse",
    "names": [
      "山林水"
    ]
  },
  {
    "code": "8476",
    "market": "tse",
    "names": [
      "台境*"
    ]
  },
  {
    "code": "8478",
    "market": "tse",
    "names": [
      "東哥遊艇"
    ]
  },
  {
    "code": "8481",
    "market": "tse",
    "names": [
      "政伸"
    ]
  },
  {
    "code": "8482",
    "market": "tse",
    "names": [
      "商億-KY",
      "商億"
    ]
  },
  {
    "code": "8488",
    "market": "tse",
    "names": [
      "吉源-KY",
      "吉源"
    ]
  },
  {
    "code": "8499",
    "market": "tse",
    "names": [
      "鼎炫-KY",
      "鼎炫"
    ]
  },
  {
    "code": "8926",
    "market": "tse",
    "names": [
      "台汽電"
    ]
  },
  {
    "code": "8940",
    "market": "tse",
    "names": [
      "新天地"
    ]
  },
  {
    "code": "8996",
    "market": "tse",
    "names": [
      "高力"
    ]
  },
  {
    "code": "9802",
    "market": "tse",
    "names": [
      "鈺齊-KY",
      "鈺齊"
    ]
  },
  {
    "code": "9902",
    "market": "tse",
    "names": [
      "台火"
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
    "code": "9905",
    "market": "tse",
    "names": [
      "大華"
    ]
  },
  {
    "code": "9906",
    "market": "tse",
    "names": [
      "欣巴巴"
    ]
  },
  {
    "code": "9907",
    "market": "tse",
    "names": [
      "統一實"
    ]
  },
  {
    "code": "9908",
    "market": "tse",
    "names": [
      "大台北"
    ]
  },
  {
    "code": "9910",
    "market": "tse",
    "names": [
      "豐泰"
    ]
  },
  {
    "code": "9911",
    "market": "tse",
    "names": [
      "櫻花"
    ]
  },
  {
    "code": "9912",
    "market": "tse",
    "names": [
      "偉聯"
    ]
  },
  {
    "code": "9914",
    "market": "tse",
    "names": [
      "美利達"
    ]
  },
  {
    "code": "9917",
    "market": "tse",
    "names": [
      "中保科"
    ]
  },
  {
    "code": "9918",
    "market": "tse",
    "names": [
      "欣天然"
    ]
  },
  {
    "code": "9919",
    "market": "tse",
    "names": [
      "康那香"
    ]
  },
  {
    "code": "9921",
    "market": "tse",
    "names": [
      "巨大"
    ]
  },
  {
    "code": "9924",
    "market": "tse",
    "names": [
      "福興"
    ]
  },
  {
    "code": "9925",
    "market": "tse",
    "names": [
      "新保"
    ]
  },
  {
    "code": "9926",
    "market": "tse",
    "names": [
      "新海"
    ]
  },
  {
    "code": "9927",
    "market": "tse",
    "names": [
      "泰銘"
    ]
  },
  {
    "code": "9928",
    "market": "tse",
    "names": [
      "中視"
    ]
  },
  {
    "code": "9929",
    "market": "tse",
    "names": [
      "秋雨"
    ]
  },
  {
    "code": "9930",
    "market": "tse",
    "names": [
      "中聯資源"
    ]
  },
  {
    "code": "9931",
    "market": "tse",
    "names": [
      "欣高"
    ]
  },
  {
    "code": "9933",
    "market": "tse",
    "names": [
      "中鼎"
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
    "code": "9935",
    "market": "tse",
    "names": [
      "慶豐富"
    ]
  },
  {
    "code": "9937",
    "market": "tse",
    "names": [
      "全國"
    ]
  },
  {
    "code": "9938",
    "market": "tse",
    "names": [
      "百和"
    ]
  },
  {
    "code": "9939",
    "market": "tse",
    "names": [
      "宏全"
    ]
  },
  {
    "code": "9940",
    "market": "tse",
    "names": [
      "信義"
    ]
  },
  {
    "code": "9941",
    "market": "tse",
    "names": [
      "裕融"
    ]
  },
  {
    "code": "9942",
    "market": "tse",
    "names": [
      "茂順"
    ]
  },
  {
    "code": "9943",
    "market": "tse",
    "names": [
      "好樂迪"
    ]
  },
  {
    "code": "9944",
    "market": "tse",
    "names": [
      "新麗"
    ]
  },
  {
    "code": "9945",
    "market": "tse",
    "names": [
      "潤泰新"
    ]
  },
  {
    "code": "9946",
    "market": "tse",
    "names": [
      "三發地產"
    ]
  },
  {
    "code": "9955",
    "market": "tse",
    "names": [
      "佳龍"
    ]
  },
  {
    "code": "9958",
    "market": "tse",
    "names": [
      "世紀鋼"
    ]
  },
  {
    "code": "2254",
    "market": "tse",
    "names": [
      "巨鎧精密-創"
    ]
  },
  {
    "code": "2258",
    "market": "tse",
    "names": [
      "鴻華先進-創"
    ]
  },
  {
    "code": "2432",
    "market": "tse",
    "names": [
      "倚天酷碁-創"
    ]
  },
  {
    "code": "3150",
    "market": "tse",
    "names": [
      "鈺寶-創"
    ]
  },
  {
    "code": "4195",
    "market": "tse",
    "names": [
      "基米-創"
    ]
  },
  {
    "code": "4582",
    "market": "tse",
    "names": [
      "聚恆-創"
    ]
  },
  {
    "code": "4590",
    "market": "tse",
    "names": [
      "富田-創"
    ]
  },
  {
    "code": "6534",
    "market": "tse",
    "names": [
      "正瀚-創"
    ]
  },
  {
    "code": "6645",
    "market": "tse",
    "names": [
      "金萬林-創"
    ]
  },
  {
    "code": "6771",
    "market": "tse",
    "names": [
      "平和環保-創"
    ]
  },
  {
    "code": "6854",
    "market": "tse",
    "names": [
      "錼創科技-KY創"
    ]
  },
  {
    "code": "6908",
    "market": "tse",
    "names": [
      "宏碁遊戲-創"
    ]
  },
  {
    "code": "6921",
    "market": "tse",
    "names": [
      "嘉雨思-創"
    ]
  },
  {
    "code": "6924",
    "market": "tse",
    "names": [
      "榮惠-KY創"
    ]
  },
  {
    "code": "6949",
    "market": "tse",
    "names": [
      "沛爾生醫-創"
    ]
  },
  {
    "code": "6951",
    "market": "tse",
    "names": [
      "青新-創"
    ]
  },
  {
    "code": "6955",
    "market": "tse",
    "names": [
      "邦睿生技-創"
    ]
  },
  {
    "code": "6969",
    "market": "tse",
    "names": [
      "成信實業*-創"
    ]
  },
  {
    "code": "6988",
    "market": "tse",
    "names": [
      "威力暘-創"
    ]
  },
  {
    "code": "7610",
    "market": "tse",
    "names": [
      "聯友金屬-創"
    ]
  },
  {
    "code": "7631",
    "market": "tse",
    "names": [
      "聚賢研發-創"
    ]
  },
  {
    "code": "7730",
    "market": "tse",
    "names": [
      "暉盛-創"
    ]
  },
  {
    "code": "7740",
    "market": "tse",
    "names": [
      "熙特爾-創"
    ]
  },
  {
    "code": "7803",
    "market": "tse",
    "names": [
      "雲象科技-創"
    ]
  },
  {
    "code": "7823",
    "market": "tse",
    "names": [
      "奧義賽博-KY創"
    ]
  },
  {
    "code": "7827",
    "market": "tse",
    "names": [
      "漢康-KY創"
    ]
  },
  {
    "code": "8162",
    "market": "tse",
    "names": [
      "微矽電子-創"
    ]
  },
  {
    "code": "8487",
    "market": "tse",
    "names": [
      "愛爾達-創"
    ]
  },
  {
    "code": "00400A",
    "market": "tse",
    "names": [
      "主動國泰動能高息",
      "400A"
    ]
  },
  {
    "code": "00401A",
    "market": "tse",
    "names": [
      "主動摩根台灣鑫收",
      "401A"
    ]
  },
  {
    "code": "00402A",
    "market": "tse",
    "names": [
      "主動安聯美國科技",
      "402A"
    ]
  },
  {
    "code": "00403A",
    "market": "tse",
    "names": [
      "主動統一升級50",
      "403A"
    ]
  },
  {
    "code": "00404A",
    "market": "tse",
    "names": [
      "主動聯博動能50",
      "404A"
    ]
  },
  {
    "code": "00405A",
    "market": "tse",
    "names": [
      "主動富邦台灣龍耀",
      "405A"
    ]
  },
  {
    "code": "00406A",
    "market": "tse",
    "names": [
      "主動中信台灣收益",
      "406A"
    ]
  },
  {
    "code": "00407A",
    "market": "tse",
    "names": [
      "主動凱基台灣",
      "407A"
    ]
  },
  {
    "code": "00408A",
    "market": "tse",
    "names": [
      "主動第一金優股息",
      "408A"
    ]
  },
  {
    "code": "0050",
    "market": "tse",
    "names": [
      "元大台灣50",
      "50",
      "0050",
      "五十",
      "ETF50",
      "台灣五十",
      "大盤ETF"
    ]
  },
  {
    "code": "0051",
    "market": "tse",
    "names": [
      "元大中型100",
      "51"
    ]
  },
  {
    "code": "0052",
    "market": "tse",
    "names": [
      "富邦科技",
      "52"
    ]
  },
  {
    "code": "0053",
    "market": "tse",
    "names": [
      "元大電子",
      "53"
    ]
  },
  {
    "code": "0055",
    "market": "tse",
    "names": [
      "元大MSCI金融",
      "55"
    ]
  },
  {
    "code": "0056",
    "market": "tse",
    "names": [
      "元大高股息",
      "56",
      "0056",
      "高股息",
      "ETF56"
    ]
  },
  {
    "code": "0057",
    "market": "tse",
    "names": [
      "富邦摩台",
      "57"
    ]
  },
  {
    "code": "0061",
    "market": "tse",
    "names": [
      "元大寶滬深",
      "61"
    ]
  },
  {
    "code": "006203",
    "market": "tse",
    "names": [
      "元大MSCI台灣",
      "6203"
    ]
  },
  {
    "code": "006204",
    "market": "tse",
    "names": [
      "永豐臺灣加權",
      "6204"
    ]
  },
  {
    "code": "006205",
    "market": "tse",
    "names": [
      "富邦上証",
      "6205"
    ]
  },
  {
    "code": "006206",
    "market": "tse",
    "names": [
      "元大上證50",
      "6206"
    ]
  },
  {
    "code": "006207",
    "market": "tse",
    "names": [
      "復華滬深",
      "6207"
    ]
  },
  {
    "code": "006208",
    "market": "tse",
    "names": [
      "富邦台50",
      "6208",
      "富邦台灣50",
      "006208",
      "富邦50"
    ]
  },
  {
    "code": "00625K",
    "market": "tse",
    "names": [
      "富邦上証+R",
      "625K"
    ]
  },
  {
    "code": "00631L",
    "market": "tse",
    "names": [
      "元大台灣50正2",
      "631L",
      "台灣50正2",
      "50正2",
      "正2",
      "正二"
    ]
  },
  {
    "code": "00632R",
    "market": "tse",
    "names": [
      "元大台灣50反1",
      "632R",
      "台灣50反1",
      "50反1",
      "反1",
      "反一"
    ]
  },
  {
    "code": "00633L",
    "market": "tse",
    "names": [
      "富邦上証正2",
      "633L"
    ]
  },
  {
    "code": "00634R",
    "market": "tse",
    "names": [
      "富邦上証反1",
      "634R"
    ]
  },
  {
    "code": "00635U",
    "market": "tse",
    "names": [
      "期元大S&P黃金",
      "635U"
    ]
  },
  {
    "code": "00636",
    "market": "tse",
    "names": [
      "國泰中國A50",
      "636"
    ]
  },
  {
    "code": "00636K",
    "market": "tse",
    "names": [
      "國泰中國A50+U",
      "636K"
    ]
  },
  {
    "code": "00637L",
    "market": "tse",
    "names": [
      "元大滬深300正2",
      "637L"
    ]
  },
  {
    "code": "00638R",
    "market": "tse",
    "names": [
      "元大滬深300反1",
      "638R"
    ]
  },
  {
    "code": "00639",
    "market": "tse",
    "names": [
      "富邦深100",
      "639"
    ]
  },
  {
    "code": "00640L",
    "market": "tse",
    "names": [
      "富邦日本正2",
      "640L"
    ]
  },
  {
    "code": "00641R",
    "market": "tse",
    "names": [
      "富邦日本反1",
      "641R"
    ]
  },
  {
    "code": "00642U",
    "market": "tse",
    "names": [
      "期元大S&P石油",
      "642U"
    ]
  },
  {
    "code": "00643",
    "market": "tse",
    "names": [
      "群益深証中小",
      "643"
    ]
  },
  {
    "code": "00643K",
    "market": "tse",
    "names": [
      "群益深証中小+R",
      "643K"
    ]
  },
  {
    "code": "00645",
    "market": "tse",
    "names": [
      "富邦日本",
      "645"
    ]
  },
  {
    "code": "00646",
    "market": "tse",
    "names": [
      "元大S&P500",
      "646"
    ]
  },
  {
    "code": "00647L",
    "market": "tse",
    "names": [
      "元大S&P500正2",
      "647L"
    ]
  },
  {
    "code": "00648R",
    "market": "tse",
    "names": [
      "元大S&P500反1",
      "648R"
    ]
  },
  {
    "code": "00650L",
    "market": "tse",
    "names": [
      "復華香港正2",
      "650L"
    ]
  },
  {
    "code": "00651R",
    "market": "tse",
    "names": [
      "復華香港反1",
      "651R"
    ]
  },
  {
    "code": "00652",
    "market": "tse",
    "names": [
      "富邦印度",
      "652"
    ]
  },
  {
    "code": "00653L",
    "market": "tse",
    "names": [
      "富邦印度正2",
      "653L"
    ]
  },
  {
    "code": "00654R",
    "market": "tse",
    "names": [
      "富邦印度反1",
      "654R"
    ]
  },
  {
    "code": "00655L",
    "market": "tse",
    "names": [
      "國泰中國A50正2",
      "655L"
    ]
  },
  {
    "code": "00656R",
    "market": "tse",
    "names": [
      "國泰中國A50反1",
      "656R"
    ]
  },
  {
    "code": "00657",
    "market": "tse",
    "names": [
      "國泰日經225",
      "657"
    ]
  },
  {
    "code": "00657K",
    "market": "tse",
    "names": [
      "國泰日經225+U",
      "657K"
    ]
  },
  {
    "code": "00660",
    "market": "tse",
    "names": [
      "元大歐洲50",
      "660"
    ]
  },
  {
    "code": "00661",
    "market": "tse",
    "names": [
      "元大日經225",
      "661"
    ]
  },
  {
    "code": "00662",
    "market": "tse",
    "names": [
      "富邦NASDAQ",
      "662"
    ]
  },
  {
    "code": "00663L",
    "market": "tse",
    "names": [
      "國泰臺灣加權正2",
      "663L"
    ]
  },
  {
    "code": "00664R",
    "market": "tse",
    "names": [
      "國泰臺灣加權反1",
      "664R"
    ]
  },
  {
    "code": "00665L",
    "market": "tse",
    "names": [
      "富邦恒生國企正2",
      "665L"
    ]
  },
  {
    "code": "00666R",
    "market": "tse",
    "names": [
      "富邦恒生國企反1",
      "666R"
    ]
  },
  {
    "code": "00668",
    "market": "tse",
    "names": [
      "國泰美國道瓊",
      "668"
    ]
  },
  {
    "code": "00668K",
    "market": "tse",
    "names": [
      "國泰美國道瓊+U",
      "668K"
    ]
  },
  {
    "code": "00669R",
    "market": "tse",
    "names": [
      "國泰美國道瓊反1",
      "669R"
    ]
  },
  {
    "code": "00670L",
    "market": "tse",
    "names": [
      "富邦NASDAQ正2",
      "670L",
      "富邦納斯達克正2",
      "富邦NASDAQ2X",
      "ND100正2"
    ]
  },
  {
    "code": "00671R",
    "market": "tse",
    "names": [
      "富邦NASDAQ反1",
      "671R",
      "富邦納斯達克反1",
      "ND100反1"
    ]
  },
  {
    "code": "00673R",
    "market": "tse",
    "names": [
      "期元大S&P原油反1",
      "673R"
    ]
  },
  {
    "code": "00674R",
    "market": "tse",
    "names": [
      "期元大S&P黃金反1",
      "674R"
    ]
  },
  {
    "code": "00675L",
    "market": "tse",
    "names": [
      "富邦臺灣加權正2",
      "675L"
    ]
  },
  {
    "code": "00676R",
    "market": "tse",
    "names": [
      "富邦臺灣加權反1",
      "676R"
    ]
  },
  {
    "code": "00678",
    "market": "tse",
    "names": [
      "群益那斯達克生技",
      "678"
    ]
  },
  {
    "code": "00680L",
    "market": "tse",
    "names": [
      "元大美債20正2",
      "680L"
    ]
  },
  {
    "code": "00681R",
    "market": "tse",
    "names": [
      "元大美債20反1",
      "681R"
    ]
  },
  {
    "code": "00682U",
    "market": "tse",
    "names": [
      "期元大美元指數",
      "682U"
    ]
  },
  {
    "code": "00683L",
    "market": "tse",
    "names": [
      "期元大美元指正2",
      "683L"
    ]
  },
  {
    "code": "00684R",
    "market": "tse",
    "names": [
      "期元大美元指反1",
      "684R"
    ]
  },
  {
    "code": "00685L",
    "market": "tse",
    "names": [
      "群益臺灣加權正2",
      "685L"
    ]
  },
  {
    "code": "00686R",
    "market": "tse",
    "names": [
      "群益臺灣加權反1",
      "686R"
    ]
  },
  {
    "code": "00688L",
    "market": "tse",
    "names": [
      "國泰20年美債正2",
      "688L"
    ]
  },
  {
    "code": "00689R",
    "market": "tse",
    "names": [
      "國泰20年美債反1",
      "689R"
    ]
  },
  {
    "code": "00690",
    "market": "tse",
    "names": [
      "兆豐藍籌30",
      "690"
    ]
  },
  {
    "code": "00692",
    "market": "tse",
    "names": [
      "富邦公司治理",
      "692"
    ]
  },
  {
    "code": "00693U",
    "market": "tse",
    "names": [
      "期街口S&P黃豆",
      "693U"
    ]
  },
  {
    "code": "00700",
    "market": "tse",
    "names": [
      "富邦恒生國企",
      "700"
    ]
  },
  {
    "code": "00701",
    "market": "tse",
    "names": [
      "國泰股利精選30",
      "701"
    ]
  },
  {
    "code": "00702",
    "market": "tse",
    "names": [
      "國泰標普低波高息",
      "702"
    ]
  },
  {
    "code": "00703",
    "market": "tse",
    "names": [
      "台新MSCI中國",
      "703"
    ]
  },
  {
    "code": "00706L",
    "market": "tse",
    "names": [
      "期元大S&P日圓正2",
      "706L"
    ]
  },
  {
    "code": "00707R",
    "market": "tse",
    "names": [
      "期元大S&P日圓反1",
      "707R"
    ]
  },
  {
    "code": "00708L",
    "market": "tse",
    "names": [
      "期元大S&P黃金正2",
      "708L"
    ]
  },
  {
    "code": "00709",
    "market": "tse",
    "names": [
      "富邦歐洲",
      "709"
    ]
  },
  {
    "code": "00710B",
    "market": "tse",
    "names": [
      "復華彭博非投等債",
      "710B"
    ]
  },
  {
    "code": "00711B",
    "market": "tse",
    "names": [
      "復華彭博新興債",
      "711B"
    ]
  },
  {
    "code": "00712",
    "market": "tse",
    "names": [
      "復華富時不動產",
      "712"
    ]
  },
  {
    "code": "00713",
    "market": "tse",
    "names": [
      "元大台灣高息低波",
      "713"
    ]
  },
  {
    "code": "00714",
    "market": "tse",
    "names": [
      "群益道瓊美國地產",
      "714"
    ]
  },
  {
    "code": "00715L",
    "market": "tse",
    "names": [
      "期街口S&P布蘭特油正2",
      "715L"
    ]
  },
  {
    "code": "00717",
    "market": "tse",
    "names": [
      "富邦美國特別股",
      "717"
    ]
  },
  {
    "code": "00728",
    "market": "tse",
    "names": [
      "第一金工業30",
      "728"
    ]
  },
  {
    "code": "00730",
    "market": "tse",
    "names": [
      "富邦臺灣優質高息",
      "730"
    ]
  },
  {
    "code": "00731",
    "market": "tse",
    "names": [
      "復華富時高息低波",
      "731"
    ]
  },
  {
    "code": "00733",
    "market": "tse",
    "names": [
      "富邦臺灣中小",
      "733"
    ]
  },
  {
    "code": "00735",
    "market": "tse",
    "names": [
      "國泰臺韓科技",
      "735"
    ]
  },
  {
    "code": "00736",
    "market": "tse",
    "names": [
      "國泰新興市場",
      "736"
    ]
  },
  {
    "code": "00737",
    "market": "tse",
    "names": [
      "國泰AI機器人",
      "737"
    ]
  },
  {
    "code": "00738U",
    "market": "tse",
    "names": [
      "期元大道瓊白銀",
      "738U"
    ]
  },
  {
    "code": "00752",
    "market": "tse",
    "names": [
      "中信中國50",
      "752"
    ]
  },
  {
    "code": "00753L",
    "market": "tse",
    "names": [
      "中信中國50正2",
      "753L"
    ]
  },
  {
    "code": "00757",
    "market": "tse",
    "names": [
      "統一FANG+",
      "757"
    ]
  },
  {
    "code": "00762",
    "market": "tse",
    "names": [
      "元大全球AI",
      "762"
    ]
  },
  {
    "code": "00763U",
    "market": "tse",
    "names": [
      "期街口道瓊銅",
      "763U"
    ]
  },
  {
    "code": "00770",
    "market": "tse",
    "names": [
      "國泰北美科技",
      "770"
    ]
  },
  {
    "code": "00771",
    "market": "tse",
    "names": [
      "元大US高息特別股",
      "771"
    ]
  },
  {
    "code": "00775B",
    "market": "tse",
    "names": [
      "台新投等債15+",
      "775B"
    ]
  },
  {
    "code": "00783",
    "market": "tse",
    "names": [
      "富邦中証500",
      "783"
    ]
  },
  {
    "code": "00830",
    "market": "tse",
    "names": [
      "國泰費城半導體",
      "830"
    ]
  },
  {
    "code": "00850",
    "market": "tse",
    "names": [
      "元大臺灣ESG永續",
      "850"
    ]
  },
  {
    "code": "00851",
    "market": "tse",
    "names": [
      "台新全球AI",
      "851"
    ]
  },
  {
    "code": "00852L",
    "market": "tse",
    "names": [
      "國泰美國道瓊正2",
      "852L"
    ]
  },
  {
    "code": "00861",
    "market": "tse",
    "names": [
      "元大全球未來通訊",
      "861"
    ]
  },
  {
    "code": "00865B",
    "market": "tse",
    "names": [
      "國泰US短期公債",
      "865B"
    ]
  },
  {
    "code": "00875",
    "market": "tse",
    "names": [
      "國泰網路資安",
      "875"
    ]
  },
  {
    "code": "00876",
    "market": "tse",
    "names": [
      "元大全球5G",
      "876"
    ]
  },
  {
    "code": "00878",
    "market": "tse",
    "names": [
      "國泰永續高股息",
      "878",
      "00878",
      "小資ETF"
    ]
  },
  {
    "code": "00881",
    "market": "tse",
    "names": [
      "國泰台灣科技龍頭",
      "881",
      "國泰台灣5G+",
      "00881"
    ]
  },
  {
    "code": "00882",
    "market": "tse",
    "names": [
      "中信中國高股息",
      "882"
    ]
  },
  {
    "code": "00885",
    "market": "tse",
    "names": [
      "富邦越南",
      "885"
    ]
  },
  {
    "code": "00891",
    "market": "tse",
    "names": [
      "中信關鍵半導體",
      "891"
    ]
  },
  {
    "code": "00892",
    "market": "tse",
    "names": [
      "富邦台灣半導體",
      "892",
      "00892",
      "半導體ETF"
    ]
  },
  {
    "code": "00893",
    "market": "tse",
    "names": [
      "國泰智能電動車",
      "893"
    ]
  },
  {
    "code": "00894",
    "market": "tse",
    "names": [
      "中信小資高價30",
      "894"
    ]
  },
  {
    "code": "00895",
    "market": "tse",
    "names": [
      "富邦未來車",
      "895"
    ]
  },
  {
    "code": "00896",
    "market": "tse",
    "names": [
      "中信綠能及電動車",
      "896"
    ]
  },
  {
    "code": "00897",
    "market": "tse",
    "names": [
      "富邦基因免疫生技",
      "897"
    ]
  },
  {
    "code": "00898",
    "market": "tse",
    "names": [
      "國泰基因免疫革命",
      "898"
    ]
  },
  {
    "code": "00899",
    "market": "tse",
    "names": [
      "FT潔淨能源",
      "899"
    ]
  },
  {
    "code": "00900",
    "market": "tse",
    "names": [
      "富邦特選高股息30",
      "900"
    ]
  },
  {
    "code": "00901",
    "market": "tse",
    "names": [
      "永豐智能車供應鏈",
      "901"
    ]
  },
  {
    "code": "00902",
    "market": "tse",
    "names": [
      "中信電池及儲能",
      "902"
    ]
  },
  {
    "code": "00903",
    "market": "tse",
    "names": [
      "富邦元宇宙",
      "903"
    ]
  },
  {
    "code": "00904",
    "market": "tse",
    "names": [
      "台新臺灣半導體30",
      "904"
    ]
  },
  {
    "code": "00905",
    "market": "tse",
    "names": [
      "FT臺灣SMART",
      "905"
    ]
  },
  {
    "code": "00907",
    "market": "tse",
    "names": [
      "永豐優息存股",
      "907"
    ]
  },
  {
    "code": "00908",
    "market": "tse",
    "names": [
      "富邦入息REITs+",
      "908"
    ]
  },
  {
    "code": "00909",
    "market": "tse",
    "names": [
      "國泰數位支付服務",
      "909"
    ]
  },
  {
    "code": "00910",
    "market": "tse",
    "names": [
      "第一金太空衛星",
      "910"
    ]
  },
  {
    "code": "00911",
    "market": "tse",
    "names": [
      "兆豐洲際半導體",
      "911"
    ]
  },
  {
    "code": "00912",
    "market": "tse",
    "names": [
      "中信臺灣智慧50",
      "912"
    ]
  },
  {
    "code": "00913",
    "market": "tse",
    "names": [
      "兆豐台灣晶圓製造",
      "913"
    ]
  },
  {
    "code": "00915",
    "market": "tse",
    "names": [
      "凱基優選高股息30",
      "915"
    ]
  },
  {
    "code": "00916",
    "market": "tse",
    "names": [
      "國泰全球品牌50",
      "916"
    ]
  },
  {
    "code": "00917",
    "market": "tse",
    "names": [
      "中信特選金融",
      "917"
    ]
  },
  {
    "code": "00918",
    "market": "tse",
    "names": [
      "大華優利高填息30",
      "918"
    ]
  },
  {
    "code": "00919",
    "market": "tse",
    "names": [
      "群益台灣精選高息",
      "919"
    ]
  },
  {
    "code": "00920",
    "market": "tse",
    "names": [
      "富邦ESG綠色電力",
      "920"
    ]
  },
  {
    "code": "00921",
    "market": "tse",
    "names": [
      "兆豐龍頭等權重",
      "921"
    ]
  },
  {
    "code": "00922",
    "market": "tse",
    "names": [
      "國泰台灣領袖50",
      "922"
    ]
  },
  {
    "code": "00923",
    "market": "tse",
    "names": [
      "群益台ESG低碳50",
      "923"
    ]
  },
  {
    "code": "00924",
    "market": "tse",
    "names": [
      "復華S&P500成長",
      "924"
    ]
  },
  {
    "code": "00926",
    "market": "tse",
    "names": [
      "凱基全球菁英55",
      "926"
    ]
  },
  {
    "code": "00927",
    "market": "tse",
    "names": [
      "群益半導體收益",
      "927"
    ]
  },
  {
    "code": "00929",
    "market": "tse",
    "names": [
      "復華台灣科技優息",
      "929"
    ]
  },
  {
    "code": "00930",
    "market": "tse",
    "names": [
      "永豐ESG低碳高息",
      "930"
    ]
  },
  {
    "code": "00932",
    "market": "tse",
    "names": [
      "兆豐永續高息等權",
      "932"
    ]
  },
  {
    "code": "00934",
    "market": "tse",
    "names": [
      "中信成長高股息",
      "934"
    ]
  },
  {
    "code": "00935",
    "market": "tse",
    "names": [
      "野村臺灣新科技50",
      "935"
    ]
  },
  {
    "code": "00936",
    "market": "tse",
    "names": [
      "台新永續高息中小",
      "936"
    ]
  },
  {
    "code": "00938",
    "market": "tse",
    "names": [
      "凱基優選30",
      "938"
    ]
  },
  {
    "code": "00939",
    "market": "tse",
    "names": [
      "統一台灣高息動能",
      "939"
    ]
  },
  {
    "code": "00940",
    "market": "tse",
    "names": [
      "元大台灣價值高息",
      "940"
    ]
  },
  {
    "code": "00941",
    "market": "tse",
    "names": [
      "中信上游半導體",
      "941"
    ]
  },
  {
    "code": "00943",
    "market": "tse",
    "names": [
      "兆豐電子高息等權",
      "943"
    ]
  },
  {
    "code": "00944",
    "market": "tse",
    "names": [
      "野村趨勢動能高息",
      "944"
    ]
  },
  {
    "code": "00945B",
    "market": "tse",
    "names": [
      "凱基美國非投等債",
      "945B"
    ]
  },
  {
    "code": "00946",
    "market": "tse",
    "names": [
      "群益科技高息成長",
      "946"
    ]
  },
  {
    "code": "00947",
    "market": "tse",
    "names": [
      "台新臺灣IC設計",
      "947"
    ]
  },
  {
    "code": "00949",
    "market": "tse",
    "names": [
      "復華日本龍頭",
      "949"
    ]
  },
  {
    "code": "00951",
    "market": "tse",
    "names": [
      "台新日本半導體",
      "951"
    ]
  },
  {
    "code": "00952",
    "market": "tse",
    "names": [
      "凱基台灣AI50",
      "952"
    ]
  },
  {
    "code": "00953B",
    "market": "tse",
    "names": [
      "群益優選非投等債",
      "953B"
    ]
  },
  {
    "code": "00954",
    "market": "tse",
    "names": [
      "中信日本半導體",
      "954"
    ]
  },
  {
    "code": "00956",
    "market": "tse",
    "names": [
      "中信日經高股息",
      "956"
    ]
  },
  {
    "code": "00960",
    "market": "tse",
    "names": [
      "野村全球航運龍頭",
      "960"
    ]
  },
  {
    "code": "00961",
    "market": "tse",
    "names": [
      "FT臺灣永續高息",
      "961"
    ]
  },
  {
    "code": "00962",
    "market": "tse",
    "names": [
      "台新AI優息動能",
      "962"
    ]
  },
  {
    "code": "00963",
    "market": "tse",
    "names": [
      "中信全球高股息",
      "963"
    ]
  },
  {
    "code": "00964",
    "market": "tse",
    "names": [
      "中信亞太高股息",
      "964"
    ]
  },
  {
    "code": "00965",
    "market": "tse",
    "names": [
      "元大航太防衛科技",
      "965"
    ]
  },
  {
    "code": "00971",
    "market": "tse",
    "names": [
      "野村美國研發龍頭",
      "971"
    ]
  },
  {
    "code": "00972",
    "market": "tse",
    "names": [
      "野村日本動能高息",
      "972"
    ]
  },
  {
    "code": "009800",
    "market": "tse",
    "names": [
      "中信NASDAQ",
      "9800"
    ]
  },
  {
    "code": "009801",
    "market": "tse",
    "names": [
      "中信美國創新科技",
      "9801"
    ]
  },
  {
    "code": "009802",
    "market": "tse",
    "names": [
      "富邦旗艦50",
      "9802"
    ]
  },
  {
    "code": "009803",
    "market": "tse",
    "names": [
      "玉山市值動能50",
      "9803"
    ]
  },
  {
    "code": "009804",
    "market": "tse",
    "names": [
      "聯邦台精彩50",
      "9804"
    ]
  },
  {
    "code": "009805",
    "market": "tse",
    "names": [
      "台新美國電力基建",
      "9805"
    ]
  },
  {
    "code": "009808",
    "market": "tse",
    "names": [
      "華南永昌優選50",
      "9808"
    ]
  },
  {
    "code": "009809",
    "market": "tse",
    "names": [
      "富邦淨零ESG50",
      "9809"
    ]
  },
  {
    "code": "00980A",
    "market": "tse",
    "names": [
      "主動野村臺灣優選",
      "980A"
    ]
  },
  {
    "code": "009810",
    "market": "tse",
    "names": [
      "玉山全球藍籌100",
      "9810"
    ]
  },
  {
    "code": "009811",
    "market": "tse",
    "names": [
      "統一美國50",
      "9811"
    ]
  },
  {
    "code": "009812",
    "market": "tse",
    "names": [
      "野村日本東證",
      "9812"
    ]
  },
  {
    "code": "009813",
    "market": "tse",
    "names": [
      "貝萊德標普卓越50",
      "9813"
    ]
  },
  {
    "code": "009816",
    "market": "tse",
    "names": [
      "凱基台灣TOP50",
      "9816"
    ]
  },
  {
    "code": "009817",
    "market": "tse",
    "names": [
      "國泰日本不動產",
      "9817"
    ]
  },
  {
    "code": "009818",
    "market": "tse",
    "names": [
      "華南永昌NASDAQxT",
      "9818"
    ]
  },
  {
    "code": "009819",
    "market": "tse",
    "names": [
      "中信數據及電力",
      "9819"
    ]
  },
  {
    "code": "00981A",
    "market": "tse",
    "names": [
      "主動統一台股增長",
      "981A",
      "瑤姐",
      "瑤池金母"
    ]
  },
  {
    "code": "00981T",
    "market": "tse",
    "names": [
      "平衡凱基雙核收息",
      "981T"
    ]
  },
  {
    "code": "009820",
    "market": "tse",
    "names": [
      "元大納斯達克精選",
      "9820"
    ]
  },
  {
    "code": "009821",
    "market": "tse",
    "names": [
      "野村稀土關鍵資源",
      "9821"
    ]
  },
  {
    "code": "009824",
    "market": "tse",
    "names": [
      "群益美國科技巨頭",
      "9824"
    ]
  },
  {
    "code": "00982A",
    "market": "tse",
    "names": [
      "主動群益台灣強棒",
      "982A"
    ]
  },
  {
    "code": "00982D",
    "market": "tse",
    "names": [
      "主動富邦動態入息",
      "982D"
    ]
  },
  {
    "code": "00982T",
    "market": "tse",
    "names": [
      "平衡兆豐台美動能",
      "982T"
    ]
  },
  {
    "code": "00983A",
    "market": "tse",
    "names": [
      "主動中信ARK創新",
      "983A"
    ]
  },
  {
    "code": "00983D",
    "market": "tse",
    "names": [
      "主動富邦複合收益",
      "983D"
    ]
  },
  {
    "code": "00984A",
    "market": "tse",
    "names": [
      "主動安聯台灣高息",
      "984A"
    ]
  },
  {
    "code": "00984D",
    "market": "tse",
    "names": [
      "主動聯博全球非投",
      "984D"
    ]
  },
  {
    "code": "00985A",
    "market": "tse",
    "names": [
      "主動野村台灣50",
      "985A"
    ]
  },
  {
    "code": "00985B",
    "market": "tse",
    "names": [
      "群益ESG投等債0-5",
      "985B"
    ]
  },
  {
    "code": "00986A",
    "market": "tse",
    "names": [
      "主動台新龍頭成長",
      "986A"
    ]
  },
  {
    "code": "00987A",
    "market": "tse",
    "names": [
      "主動台新優勢成長",
      "987A"
    ]
  },
  {
    "code": "00988A",
    "market": "tse",
    "names": [
      "主動統一全球創新",
      "988A",
      "988"
    ]
  },
  {
    "code": "00989A",
    "market": "tse",
    "names": [
      "主動摩根美國科技",
      "989A"
    ]
  },
  {
    "code": "00990A",
    "market": "tse",
    "names": [
      "主動元大AI新經濟",
      "990A"
    ]
  },
  {
    "code": "00991A",
    "market": "tse",
    "names": [
      "主動復華未來50",
      "991A"
    ]
  },
  {
    "code": "00992A",
    "market": "tse",
    "names": [
      "主動群益科技創新",
      "992A"
    ]
  },
  {
    "code": "00993A",
    "market": "tse",
    "names": [
      "主動安聯台灣",
      "993A"
    ]
  },
  {
    "code": "00994A",
    "market": "tse",
    "names": [
      "主動第一金台股優",
      "994A"
    ]
  },
  {
    "code": "00995A",
    "market": "tse",
    "names": [
      "主動中信台灣卓越",
      "995A"
    ]
  },
  {
    "code": "00996A",
    "market": "tse",
    "names": [
      "主動兆豐台灣豐收",
      "996A"
    ]
  },
  {
    "code": "00997A",
    "market": "tse",
    "names": [
      "主動群益美國增長",
      "997A"
    ]
  },
  {
    "code": "00999A",
    "market": "tse",
    "names": [
      "主動野村臺灣高息",
      "999A"
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
    "code": "9105",
    "market": "tse",
    "names": [
      "泰金寶-DR"
    ]
  },
  {
    "code": "9110",
    "market": "tse",
    "names": [
      "越南控-DR"
    ]
  },
  {
    "code": "9136",
    "market": "tse",
    "names": [
      "巨騰-DR"
    ]
  },
  {
    "code": "006201",
    "market": "otc",
    "names": [
      "元大富櫃50",
      "6201"
    ]
  },
  {
    "code": "00679B",
    "market": "otc",
    "names": [
      "元大美債20年",
      "679B"
    ]
  },
  {
    "code": "00687B",
    "market": "otc",
    "names": [
      "國泰20年美債",
      "687B"
    ]
  },
  {
    "code": "00687C",
    "market": "otc",
    "names": [
      "國泰20年美債+櫃U",
      "687C"
    ]
  },
  {
    "code": "00694B",
    "market": "otc",
    "names": [
      "富邦美債1-3年",
      "694B"
    ]
  },
  {
    "code": "00695B",
    "market": "otc",
    "names": [
      "富邦美債7-10年",
      "695B"
    ]
  },
  {
    "code": "00696B",
    "market": "otc",
    "names": [
      "富邦美債20年",
      "696B"
    ]
  },
  {
    "code": "00697B",
    "market": "otc",
    "names": [
      "元大美債7-10",
      "697B"
    ]
  },
  {
    "code": "00719B",
    "market": "otc",
    "names": [
      "元大美債1-3",
      "719B"
    ]
  },
  {
    "code": "00720B",
    "market": "otc",
    "names": [
      "元大投資級公司債",
      "720B"
    ]
  },
  {
    "code": "00722B",
    "market": "otc",
    "names": [
      "群益投資級電信債",
      "722B"
    ]
  },
  {
    "code": "00723B",
    "market": "otc",
    "names": [
      "群益投資級科技債",
      "723B"
    ]
  },
  {
    "code": "00724B",
    "market": "otc",
    "names": [
      "群益投資級金融債",
      "724B"
    ]
  },
  {
    "code": "00725B",
    "market": "otc",
    "names": [
      "國泰投資級公司債",
      "725B"
    ]
  },
  {
    "code": "00726B",
    "market": "otc",
    "names": [
      "國泰新興投等債",
      "726B"
    ]
  },
  {
    "code": "00727B",
    "market": "otc",
    "names": [
      "國泰優選非投等債",
      "727B"
    ]
  },
  {
    "code": "00734B",
    "market": "otc",
    "names": [
      "台新JPM新興債",
      "734B"
    ]
  },
  {
    "code": "00740B",
    "market": "otc",
    "names": [
      "富邦全球投等債",
      "740B"
    ]
  },
  {
    "code": "00741B",
    "market": "otc",
    "names": [
      "富邦全球非投等債",
      "741B"
    ]
  },
  {
    "code": "00746B",
    "market": "otc",
    "names": [
      "富邦A級公司債",
      "746B"
    ]
  },
  {
    "code": "00749B",
    "market": "otc",
    "names": [
      "凱基新興債10+",
      "749B"
    ]
  },
  {
    "code": "00750B",
    "market": "otc",
    "names": [
      "凱基科技債10+",
      "750B"
    ]
  },
  {
    "code": "00751B",
    "market": "otc",
    "names": [
      "元大AAA至A公司債",
      "751B"
    ]
  },
  {
    "code": "00754B",
    "market": "otc",
    "names": [
      "群益AAA-AA公司債",
      "754B"
    ]
  },
  {
    "code": "00755B",
    "market": "otc",
    "names": [
      "群益投資級公用債",
      "755B"
    ]
  },
  {
    "code": "00756B",
    "market": "otc",
    "names": [
      "群益投等新興公債",
      "756B"
    ]
  },
  {
    "code": "00758B",
    "market": "otc",
    "names": [
      "復華能源債",
      "758B"
    ]
  },
  {
    "code": "00759B",
    "market": "otc",
    "names": [
      "復華製藥債",
      "759B"
    ]
  },
  {
    "code": "00760B",
    "market": "otc",
    "names": [
      "復華新興企業債",
      "760B"
    ]
  },
  {
    "code": "00761B",
    "market": "otc",
    "names": [
      "國泰A級公司債",
      "761B"
    ]
  },
  {
    "code": "00764B",
    "market": "otc",
    "names": [
      "群益25年美債",
      "764B"
    ]
  },
  {
    "code": "00768B",
    "market": "otc",
    "names": [
      "復華20年美債",
      "768B"
    ]
  },
  {
    "code": "00772B",
    "market": "otc",
    "names": [
      "中信高評級公司債",
      "772B"
    ]
  },
  {
    "code": "00773B",
    "market": "otc",
    "names": [
      "中信優先金融債",
      "773B"
    ]
  },
  {
    "code": "00777B",
    "market": "otc",
    "names": [
      "凱基AAA至A公司債",
      "777B"
    ]
  },
  {
    "code": "00778B",
    "market": "otc",
    "names": [
      "凱基金融債20+",
      "778B"
    ]
  },
  {
    "code": "00779B",
    "market": "otc",
    "names": [
      "凱基美債25+",
      "779B"
    ]
  },
  {
    "code": "00780B",
    "market": "otc",
    "names": [
      "國泰A級金融債",
      "780B"
    ]
  },
  {
    "code": "00781B",
    "market": "otc",
    "names": [
      "國泰A級科技債",
      "781B"
    ]
  },
  {
    "code": "00782B",
    "market": "otc",
    "names": [
      "國泰A級公用債",
      "782B"
    ]
  },
  {
    "code": "00785B",
    "market": "otc",
    "names": [
      "富邦金融投等債",
      "785B"
    ]
  },
  {
    "code": "00786B",
    "market": "otc",
    "names": [
      "元大10年IG銀行債",
      "786B"
    ]
  },
  {
    "code": "00787B",
    "market": "otc",
    "names": [
      "元大10年IG醫療債",
      "787B"
    ]
  },
  {
    "code": "00788B",
    "market": "otc",
    "names": [
      "元大10年IG電能債",
      "788B"
    ]
  },
  {
    "code": "00789B",
    "market": "otc",
    "names": [
      "復華公司債A3",
      "789B"
    ]
  },
  {
    "code": "00791B",
    "market": "otc",
    "names": [
      "復華信用債1-5",
      "791B"
    ]
  },
  {
    "code": "00792B",
    "market": "otc",
    "names": [
      "群益A級公司債",
      "792B"
    ]
  },
  {
    "code": "00793B",
    "market": "otc",
    "names": [
      "群益AAA-A醫療債",
      "793B"
    ]
  },
  {
    "code": "00795B",
    "market": "otc",
    "names": [
      "中信美國公債20年",
      "795B"
    ]
  },
  {
    "code": "00799B",
    "market": "otc",
    "names": [
      "國泰A級醫療債",
      "799B"
    ]
  },
  {
    "code": "00834B",
    "market": "otc",
    "names": [
      "第一金金融債10+",
      "834B"
    ]
  },
  {
    "code": "00836B",
    "market": "otc",
    "names": [
      "永豐10年A公司債",
      "836B"
    ]
  },
  {
    "code": "00838B",
    "market": "otc",
    "names": [
      "永豐7-10年中國債",
      "838B"
    ]
  },
  {
    "code": "00840B",
    "market": "otc",
    "names": [
      "凱基IG精選15+",
      "840B"
    ]
  },
  {
    "code": "00841B",
    "market": "otc",
    "names": [
      "凱基AAA-AA公司債",
      "841B"
    ]
  },
  {
    "code": "00842B",
    "market": "otc",
    "names": [
      "台新美元銀行債",
      "842B"
    ]
  },
  {
    "code": "00844B",
    "market": "otc",
    "names": [
      "台新15年IG金融債",
      "844B"
    ]
  },
  {
    "code": "00845B",
    "market": "otc",
    "names": [
      "富邦新興投等債",
      "845B"
    ]
  },
  {
    "code": "00846B",
    "market": "otc",
    "names": [
      "富邦歐洲銀行債",
      "846B"
    ]
  },
  {
    "code": "00847B",
    "market": "otc",
    "names": [
      "中信美國市政債",
      "847B"
    ]
  },
  {
    "code": "00848B",
    "market": "otc",
    "names": [
      "中信新興亞洲債",
      "848B"
    ]
  },
  {
    "code": "00849B",
    "market": "otc",
    "names": [
      "中信EM主權債0-5",
      "849B"
    ]
  },
  {
    "code": "00853B",
    "market": "otc",
    "names": [
      "統一美債10年Aa-A",
      "853B"
    ]
  },
  {
    "code": "00856B",
    "market": "otc",
    "names": [
      "永豐1-3年美公債",
      "856B"
    ]
  },
  {
    "code": "00857B",
    "market": "otc",
    "names": [
      "永豐20年美公債",
      "857B"
    ]
  },
  {
    "code": "00858",
    "market": "otc",
    "names": [
      "永豐美國500大",
      "858"
    ]
  },
  {
    "code": "00859B",
    "market": "otc",
    "names": [
      "群益0-1年美債",
      "859B"
    ]
  },
  {
    "code": "00860B",
    "market": "otc",
    "names": [
      "群益1-5Y投資級債",
      "860B"
    ]
  },
  {
    "code": "00862B",
    "market": "otc",
    "names": [
      "中信投資級公司債",
      "862B"
    ]
  },
  {
    "code": "00863B",
    "market": "otc",
    "names": [
      "中信全球電信債",
      "863B"
    ]
  },
  {
    "code": "00864B",
    "market": "otc",
    "names": [
      "中信美國公債0-1",
      "864B"
    ]
  },
  {
    "code": "00867B",
    "market": "otc",
    "names": [
      "台新A-BBB電信債",
      "867B"
    ]
  },
  {
    "code": "00870B",
    "market": "otc",
    "names": [
      "元大15年EM主權債",
      "870B"
    ]
  },
  {
    "code": "00877",
    "market": "otc",
    "names": [
      "復華中國5G",
      "877"
    ]
  },
  {
    "code": "00884B",
    "market": "otc",
    "names": [
      "中信低碳新興債",
      "884B"
    ]
  },
  {
    "code": "00886",
    "market": "otc",
    "names": [
      "永豐美國科技",
      "886"
    ]
  },
  {
    "code": "00887",
    "market": "otc",
    "names": [
      "永豐中國科技50大",
      "887"
    ]
  },
  {
    "code": "00888",
    "market": "otc",
    "names": [
      "永豐台灣ESG",
      "888"
    ]
  },
  {
    "code": "00931B",
    "market": "otc",
    "names": [
      "統一美債20年",
      "931B"
    ]
  },
  {
    "code": "00933B",
    "market": "otc",
    "names": [
      "國泰10Y+金融債",
      "933B"
    ]
  },
  {
    "code": "00937B",
    "market": "otc",
    "names": [
      "群益ESG投等債20+",
      "937B"
    ]
  },
  {
    "code": "00942B",
    "market": "otc",
    "names": [
      "台新美A公司債20+",
      "942B"
    ]
  },
  {
    "code": "00948B",
    "market": "otc",
    "names": [
      "中信優息投資級債",
      "948B"
    ]
  },
  {
    "code": "00950B",
    "market": "otc",
    "names": [
      "凱基A級公司債",
      "950B"
    ]
  },
  {
    "code": "00955",
    "market": "otc",
    "names": [
      "中信日本商社",
      "955"
    ]
  },
  {
    "code": "00957B",
    "market": "otc",
    "names": [
      "兆豐US優選投等債",
      "957B"
    ]
  },
  {
    "code": "00958B",
    "market": "otc",
    "names": [
      "永豐ESG銀行債15+",
      "958B"
    ]
  },
  {
    "code": "00959B",
    "market": "otc",
    "names": [
      "大華投等美債15Y+",
      "959B"
    ]
  },
  {
    "code": "00966B",
    "market": "otc",
    "names": [
      "統一ESG投等債15+",
      "966B"
    ]
  },
  {
    "code": "00967B",
    "market": "otc",
    "names": [
      "元大優息美債",
      "967B"
    ]
  },
  {
    "code": "00968B",
    "market": "otc",
    "names": [
      "元大優息投等債",
      "968B"
    ]
  },
  {
    "code": "00969B",
    "market": "otc",
    "names": [
      "元大零息超長美債",
      "969B"
    ]
  },
  {
    "code": "00970B",
    "market": "otc",
    "names": [
      "台新BBB投等債20+",
      "970B"
    ]
  },
  {
    "code": "009806",
    "market": "otc",
    "names": [
      "台新標普500",
      "9806"
    ]
  },
  {
    "code": "009807",
    "market": "otc",
    "names": [
      "台新標普科技精選",
      "9807"
    ]
  },
  {
    "code": "00980B",
    "market": "otc",
    "names": [
      "台新特選IG債10+",
      "980B"
    ]
  },
  {
    "code": "00980D",
    "market": "otc",
    "names": [
      "主動聯博投等入息",
      "980D"
    ]
  },
  {
    "code": "00980T",
    "market": "otc",
    "names": [
      "平衡凱基美國TOP",
      "980T"
    ]
  },
  {
    "code": "009814",
    "market": "otc",
    "names": [
      "富邦標普500",
      "9814"
    ]
  },
  {
    "code": "009815",
    "market": "otc",
    "names": [
      "大華美國MAG7+",
      "9815"
    ]
  },
  {
    "code": "00981B",
    "market": "otc",
    "names": [
      "第一金優選非投債",
      "981B"
    ]
  },
  {
    "code": "00981D",
    "market": "otc",
    "names": [
      "主動中信非投等債",
      "981D"
    ]
  },
  {
    "code": "009822",
    "market": "otc",
    "names": [
      "華南永昌未來金融",
      "9822"
    ]
  },
  {
    "code": "009823",
    "market": "otc",
    "names": [
      "群益S&P500",
      "9823"
    ]
  },
  {
    "code": "009825",
    "market": "otc",
    "names": [
      "聯邦美國金融創新",
      "9825"
    ]
  },
  {
    "code": "00982B",
    "market": "otc",
    "names": [
      "FT投資級債20+",
      "982B"
    ]
  },
  {
    "code": "00983B",
    "market": "otc",
    "names": [
      "大華優利美公債20",
      "983B"
    ]
  },
  {
    "code": "00984B",
    "market": "otc",
    "names": [
      "大華優利美A債15",
      "984B"
    ]
  },
  {
    "code": "00985D",
    "market": "otc",
    "names": [
      "主動貝萊德優投等",
      "985D"
    ]
  },
  {
    "code": "00986B",
    "market": "otc",
    "names": [
      "FT金融債10+",
      "986B"
    ]
  },
  {
    "code": "00986D",
    "market": "otc",
    "names": [
      "主動復華金融債息",
      "986D"
    ]
  },
  {
    "code": "00987B",
    "market": "otc",
    "names": [
      "野村10+澳洲公債",
      "987B"
    ]
  },
  {
    "code": "00988B",
    "market": "otc",
    "names": [
      "玉山嚴選非投債",
      "988B"
    ]
  },
  {
    "code": "00989B",
    "market": "otc",
    "names": [
      "台新美國非投等債",
      "989B"
    ]
  },
  {
    "code": "00990B",
    "market": "otc",
    "names": [
      "國泰收益非投等債",
      "990B"
    ]
  },
  {
    "code": "00998A",
    "market": "otc",
    "names": [
      "主動復華金融股息",
      "998A"
    ]
  },
  {
    "code": "1240",
    "market": "otc",
    "names": [
      "茂生農經"
    ]
  },
  {
    "code": "1259",
    "market": "otc",
    "names": [
      "安心"
    ]
  },
  {
    "code": "1264",
    "market": "otc",
    "names": [
      "德麥"
    ]
  },
  {
    "code": "1268",
    "market": "otc",
    "names": [
      "漢來美食"
    ]
  },
  {
    "code": "1294",
    "market": "otc",
    "names": [
      "漢田生技"
    ]
  },
  {
    "code": "1295",
    "market": "otc",
    "names": [
      "生合"
    ]
  },
  {
    "code": "1336",
    "market": "otc",
    "names": [
      "台翰"
    ]
  },
  {
    "code": "1565",
    "market": "otc",
    "names": [
      "精華"
    ]
  },
  {
    "code": "1569",
    "market": "otc",
    "names": [
      "濱川"
    ]
  },
  {
    "code": "1570",
    "market": "otc",
    "names": [
      "力肯"
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
    "code": "1584",
    "market": "otc",
    "names": [
      "精剛"
    ]
  },
  {
    "code": "1586",
    "market": "otc",
    "names": [
      "和勤"
    ]
  },
  {
    "code": "1591",
    "market": "otc",
    "names": [
      "駿吉-KY",
      "駿吉"
    ]
  },
  {
    "code": "1593",
    "market": "otc",
    "names": [
      "祺驊"
    ]
  },
  {
    "code": "1595",
    "market": "otc",
    "names": [
      "川寶"
    ]
  },
  {
    "code": "1599",
    "market": "otc",
    "names": [
      "宏佳騰"
    ]
  },
  {
    "code": "1742",
    "market": "otc",
    "names": [
      "台蠟"
    ]
  },
  {
    "code": "1777",
    "market": "otc",
    "names": [
      "生泰"
    ]
  },
  {
    "code": "1780",
    "market": "otc",
    "names": [
      "立弘"
    ]
  },
  {
    "code": "1781",
    "market": "otc",
    "names": [
      "合世"
    ]
  },
  {
    "code": "1784",
    "market": "otc",
    "names": [
      "訊聯"
    ]
  },
  {
    "code": "1785",
    "market": "otc",
    "names": [
      "光洋科"
    ]
  },
  {
    "code": "1788",
    "market": "otc",
    "names": [
      "杏昌"
    ]
  },
  {
    "code": "1796",
    "market": "otc",
    "names": [
      "金穎生技"
    ]
  },
  {
    "code": "1799",
    "market": "otc",
    "names": [
      "易威"
    ]
  },
  {
    "code": "1813",
    "market": "otc",
    "names": [
      "寶利徠"
    ]
  },
  {
    "code": "1815",
    "market": "otc",
    "names": [
      "富喬"
    ]
  },
  {
    "code": "2035",
    "market": "otc",
    "names": [
      "唐榮"
    ]
  },
  {
    "code": "2061",
    "market": "otc",
    "names": [
      "風青"
    ]
  },
  {
    "code": "2063",
    "market": "otc",
    "names": [
      "世鎧"
    ]
  },
  {
    "code": "2064",
    "market": "otc",
    "names": [
      "晉椿"
    ]
  },
  {
    "code": "2065",
    "market": "otc",
    "names": [
      "世豐"
    ]
  },
  {
    "code": "2066",
    "market": "otc",
    "names": [
      "世德"
    ]
  },
  {
    "code": "2067",
    "market": "otc",
    "names": [
      "嘉鋼"
    ]
  },
  {
    "code": "2070",
    "market": "otc",
    "names": [
      "精湛"
    ]
  },
  {
    "code": "2073",
    "market": "otc",
    "names": [
      "雄順"
    ]
  },
  {
    "code": "2221",
    "market": "otc",
    "names": [
      "大甲"
    ]
  },
  {
    "code": "2230",
    "market": "otc",
    "names": [
      "泰茂"
    ]
  },
  {
    "code": "2235",
    "market": "otc",
    "names": [
      "謚源"
    ]
  },
  {
    "code": "2596",
    "market": "otc",
    "names": [
      "綠意"
    ]
  },
  {
    "code": "2640",
    "market": "otc",
    "names": [
      "大車隊"
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
    "code": "2643",
    "market": "otc",
    "names": [
      "捷迅"
    ]
  },
  {
    "code": "2718",
    "market": "otc",
    "names": [
      "全心投控"
    ]
  },
  {
    "code": "2719",
    "market": "otc",
    "names": [
      "燦星旅"
    ]
  },
  {
    "code": "2724",
    "market": "otc",
    "names": [
      "藝舍-KY",
      "藝舍"
    ]
  },
  {
    "code": "2726",
    "market": "otc",
    "names": [
      "雅茗-KY",
      "雅茗"
    ]
  },
  {
    "code": "2729",
    "market": "otc",
    "names": [
      "瓦城"
    ]
  },
  {
    "code": "2732",
    "market": "otc",
    "names": [
      "六角"
    ]
  },
  {
    "code": "2734",
    "market": "otc",
    "names": [
      "易飛網"
    ]
  },
  {
    "code": "2736",
    "market": "otc",
    "names": [
      "富野"
    ]
  },
  {
    "code": "2740",
    "market": "otc",
    "names": [
      "華軒"
    ]
  },
  {
    "code": "2743",
    "market": "otc",
    "names": [
      "山富"
    ]
  },
  {
    "code": "2745",
    "market": "otc",
    "names": [
      "五福"
    ]
  },
  {
    "code": "2751",
    "market": "otc",
    "names": [
      "王座"
    ]
  },
  {
    "code": "2752",
    "market": "otc",
    "names": [
      "豆府"
    ]
  },
  {
    "code": "2754",
    "market": "otc",
    "names": [
      "亞洲藏壽司"
    ]
  },
  {
    "code": "2755",
    "market": "otc",
    "names": [
      "揚秦"
    ]
  },
  {
    "code": "2756",
    "market": "otc",
    "names": [
      "聯發國際"
    ]
  },
  {
    "code": "2916",
    "market": "otc",
    "names": [
      "滿心"
    ]
  },
  {
    "code": "2924",
    "market": "otc",
    "names": [
      "宏太-KY",
      "宏太"
    ]
  },
  {
    "code": "2926",
    "market": "otc",
    "names": [
      "誠品生活"
    ]
  },
  {
    "code": "2937",
    "market": "otc",
    "names": [
      "集雅社"
    ]
  },
  {
    "code": "2941",
    "market": "otc",
    "names": [
      "米斯特"
    ]
  },
  {
    "code": "2947",
    "market": "otc",
    "names": [
      "振宇五金",
      "五金行"
    ]
  },
  {
    "code": "2948",
    "market": "otc",
    "names": [
      "寶陞"
    ]
  },
  {
    "code": "2949",
    "market": "otc",
    "names": [
      "欣新網"
    ]
  },
  {
    "code": "3064",
    "market": "otc",
    "names": [
      "泰偉"
    ]
  },
  {
    "code": "3066",
    "market": "otc",
    "names": [
      "李洲"
    ]
  },
  {
    "code": "3067",
    "market": "otc",
    "names": [
      "全域"
    ]
  },
  {
    "code": "3071",
    "market": "otc",
    "names": [
      "協禧"
    ]
  },
  {
    "code": "3073",
    "market": "otc",
    "names": [
      "天方能源"
    ]
  },
  {
    "code": "3078",
    "market": "otc",
    "names": [
      "僑威"
    ]
  },
  {
    "code": "3081",
    "market": "otc",
    "names": [
      "聯亞"
    ]
  },
  {
    "code": "3083",
    "market": "otc",
    "names": [
      "網龍"
    ]
  },
  {
    "code": "3086",
    "market": "otc",
    "names": [
      "華義*"
    ]
  },
  {
    "code": "3088",
    "market": "otc",
    "names": [
      "艾訊"
    ]
  },
  {
    "code": "3093",
    "market": "otc",
    "names": [
      "港建*"
    ]
  },
  {
    "code": "3095",
    "market": "otc",
    "names": [
      "及成"
    ]
  },
  {
    "code": "3105",
    "market": "otc",
    "names": [
      "穩懋"
    ]
  },
  {
    "code": "3114",
    "market": "otc",
    "names": [
      "好德"
    ]
  },
  {
    "code": "3115",
    "market": "otc",
    "names": [
      "富榮綱"
    ]
  },
  {
    "code": "3118",
    "market": "otc",
    "names": [
      "進階"
    ]
  },
  {
    "code": "3122",
    "market": "otc",
    "names": [
      "笙泉"
    ]
  },
  {
    "code": "3128",
    "market": "otc",
    "names": [
      "昇銳"
    ]
  },
  {
    "code": "3131",
    "market": "otc",
    "names": [
      "弘塑"
    ]
  },
  {
    "code": "3141",
    "market": "otc",
    "names": [
      "晶宏"
    ]
  },
  {
    "code": "3147",
    "market": "otc",
    "names": [
      "大綜"
    ]
  },
  {
    "code": "3152",
    "market": "otc",
    "names": [
      "璟德"
    ]
  },
  {
    "code": "3158",
    "market": "otc",
    "names": [
      "嘉實"
    ]
  },
  {
    "code": "3162",
    "market": "otc",
    "names": [
      "精確"
    ]
  },
  {
    "code": "3163",
    "market": "otc",
    "names": [
      "波若威"
    ]
  },
  {
    "code": "3169",
    "market": "otc",
    "names": [
      "亞信"
    ]
  },
  {
    "code": "3171",
    "market": "otc",
    "names": [
      "炎洲流通"
    ]
  },
  {
    "code": "3176",
    "market": "otc",
    "names": [
      "基亞"
    ]
  },
  {
    "code": "3178",
    "market": "otc",
    "names": [
      "公準"
    ]
  },
  {
    "code": "3188",
    "market": "otc",
    "names": [
      "鑫龍騰"
    ]
  },
  {
    "code": "3191",
    "market": "otc",
    "names": [
      "雲嘉南"
    ]
  },
  {
    "code": "3205",
    "market": "otc",
    "names": [
      "佰研"
    ]
  },
  {
    "code": "3206",
    "market": "otc",
    "names": [
      "志豐"
    ]
  },
  {
    "code": "3207",
    "market": "otc",
    "names": [
      "耀勝"
    ]
  },
  {
    "code": "3211",
    "market": "otc",
    "names": [
      "順達"
    ]
  },
  {
    "code": "3213",
    "market": "otc",
    "names": [
      "茂訊"
    ]
  },
  {
    "code": "3217",
    "market": "otc",
    "names": [
      "優群"
    ]
  },
  {
    "code": "3218",
    "market": "otc",
    "names": [
      "大學光"
    ]
  },
  {
    "code": "3219",
    "market": "otc",
    "names": [
      "倚強科"
    ]
  },
  {
    "code": "3221",
    "market": "otc",
    "names": [
      "台嘉碩"
    ]
  },
  {
    "code": "3224",
    "market": "otc",
    "names": [
      "三顧"
    ]
  },
  {
    "code": "3226",
    "market": "otc",
    "names": [
      "龍鋒"
    ]
  },
  {
    "code": "3227",
    "market": "otc",
    "names": [
      "原相"
    ]
  },
  {
    "code": "3228",
    "market": "otc",
    "names": [
      "金麗科"
    ]
  },
  {
    "code": "3230",
    "market": "otc",
    "names": [
      "錦明"
    ]
  },
  {
    "code": "3232",
    "market": "otc",
    "names": [
      "昱捷"
    ]
  },
  {
    "code": "3234",
    "market": "otc",
    "names": [
      "光環"
    ]
  },
  {
    "code": "3236",
    "market": "otc",
    "names": [
      "千如"
    ]
  },
  {
    "code": "3252",
    "market": "otc",
    "names": [
      "海灣"
    ]
  },
  {
    "code": "3259",
    "market": "otc",
    "names": [
      "鑫創"
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
    "code": "3264",
    "market": "otc",
    "names": [
      "欣銓"
    ]
  },
  {
    "code": "3265",
    "market": "otc",
    "names": [
      "台星科"
    ]
  },
  {
    "code": "3268",
    "market": "otc",
    "names": [
      "海德威"
    ]
  },
  {
    "code": "3272",
    "market": "otc",
    "names": [
      "東碩"
    ]
  },
  {
    "code": "3276",
    "market": "otc",
    "names": [
      "宇環"
    ]
  },
  {
    "code": "3284",
    "market": "otc",
    "names": [
      "太普高"
    ]
  },
  {
    "code": "3285",
    "market": "otc",
    "names": [
      "微端"
    ]
  },
  {
    "code": "3287",
    "market": "otc",
    "names": [
      "廣寰科"
    ]
  },
  {
    "code": "3288",
    "market": "otc",
    "names": [
      "點晶"
    ]
  },
  {
    "code": "3289",
    "market": "otc",
    "names": [
      "宜特"
    ]
  },
  {
    "code": "3290",
    "market": "otc",
    "names": [
      "東浦"
    ]
  },
  {
    "code": "3293",
    "market": "otc",
    "names": [
      "鈊象",
      "鈊象電子",
      "大象",
      "象象"
    ]
  },
  {
    "code": "3294",
    "market": "otc",
    "names": [
      "英濟"
    ]
  },
  {
    "code": "3297",
    "market": "otc",
    "names": [
      "杭特"
    ]
  },
  {
    "code": "3303",
    "market": "otc",
    "names": [
      "岱稜"
    ]
  },
  {
    "code": "3306",
    "market": "otc",
    "names": [
      "鼎天"
    ]
  },
  {
    "code": "3310",
    "market": "otc",
    "names": [
      "佳穎"
    ]
  },
  {
    "code": "3313",
    "market": "otc",
    "names": [
      "斐成"
    ]
  },
  {
    "code": "3317",
    "market": "otc",
    "names": [
      "尼克森"
    ]
  },
  {
    "code": "3322",
    "market": "otc",
    "names": [
      "建舜電"
    ]
  },
  {
    "code": "3323",
    "market": "otc",
    "names": [
      "加百裕"
    ]
  },
  {
    "code": "3324",
    "market": "otc",
    "names": [
      "雙鴻"
    ]
  },
  {
    "code": "3325",
    "market": "otc",
    "names": [
      "旭品"
    ]
  },
  {
    "code": "3332",
    "market": "otc",
    "names": [
      "幸康"
    ]
  },
  {
    "code": "3339",
    "market": "otc",
    "names": [
      "泰谷"
    ]
  },
  {
    "code": "3349",
    "market": "otc",
    "names": [
      "寶德"
    ]
  },
  {
    "code": "3354",
    "market": "otc",
    "names": [
      "律勝"
    ]
  },
  {
    "code": "3357",
    "market": "otc",
    "names": [
      "臺慶科"
    ]
  },
  {
    "code": "3360",
    "market": "otc",
    "names": [
      "尚立"
    ]
  },
  {
    "code": "3362",
    "market": "otc",
    "names": [
      "先進光"
    ]
  },
  {
    "code": "3363",
    "market": "otc",
    "names": [
      "上詮"
    ]
  },
  {
    "code": "3372",
    "market": "otc",
    "names": [
      "典範"
    ]
  },
  {
    "code": "3373",
    "market": "otc",
    "names": [
      "熱映"
    ]
  },
  {
    "code": "3374",
    "market": "otc",
    "names": [
      "精材"
    ]
  },
  {
    "code": "3379",
    "market": "otc",
    "names": [
      "彬台"
    ]
  },
  {
    "code": "3388",
    "market": "otc",
    "names": [
      "崇越電"
    ]
  },
  {
    "code": "3390",
    "market": "otc",
    "names": [
      "旭軟"
    ]
  },
  {
    "code": "3402",
    "market": "otc",
    "names": [
      "漢科"
    ]
  },
  {
    "code": "3430",
    "market": "otc",
    "names": [
      "奇鈦科"
    ]
  },
  {
    "code": "3434",
    "market": "otc",
    "names": [
      "哲固"
    ]
  },
  {
    "code": "3438",
    "market": "otc",
    "names": [
      "類比科"
    ]
  },
  {
    "code": "3441",
    "market": "otc",
    "names": [
      "聯一光"
    ]
  },
  {
    "code": "3444",
    "market": "otc",
    "names": [
      "利機"
    ]
  },
  {
    "code": "3455",
    "market": "otc",
    "names": [
      "由田"
    ]
  },
  {
    "code": "3465",
    "market": "otc",
    "names": [
      "進泰電子"
    ]
  },
  {
    "code": "3466",
    "market": "otc",
    "names": [
      "德晉"
    ]
  },
  {
    "code": "3467",
    "market": "otc",
    "names": [
      "台灣精材"
    ]
  },
  {
    "code": "3479",
    "market": "otc",
    "names": [
      "安勤"
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
    "code": "3484",
    "market": "otc",
    "names": [
      "崧騰"
    ]
  },
  {
    "code": "3485",
    "market": "otc",
    "names": [
      "敘豐"
    ]
  },
  {
    "code": "3489",
    "market": "otc",
    "names": [
      "森寶"
    ]
  },
  {
    "code": "3490",
    "market": "otc",
    "names": [
      "單井"
    ]
  },
  {
    "code": "3491",
    "market": "otc",
    "names": [
      "昇達科"
    ]
  },
  {
    "code": "3492",
    "market": "otc",
    "names": [
      "長盛"
    ]
  },
  {
    "code": "3498",
    "market": "otc",
    "names": [
      "陽程"
    ]
  },
  {
    "code": "3499",
    "market": "otc",
    "names": [
      "環天科"
    ]
  },
  {
    "code": "3508",
    "market": "otc",
    "names": [
      "位速"
    ]
  },
  {
    "code": "3511",
    "market": "otc",
    "names": [
      "矽瑪"
    ]
  },
  {
    "code": "3512",
    "market": "otc",
    "names": [
      "皇龍"
    ]
  },
  {
    "code": "3516",
    "market": "otc",
    "names": [
      "亞帝歐"
    ]
  },
  {
    "code": "3520",
    "market": "otc",
    "names": [
      "華盈"
    ]
  },
  {
    "code": "3521",
    "market": "otc",
    "names": [
      "台鋼建設"
    ]
  },
  {
    "code": "3522",
    "market": "otc",
    "names": [
      "御嵿"
    ]
  },
  {
    "code": "3523",
    "market": "otc",
    "names": [
      "迎輝"
    ]
  },
  {
    "code": "3526",
    "market": "otc",
    "names": [
      "凡甲"
    ]
  },
  {
    "code": "3527",
    "market": "otc",
    "names": [
      "聚積"
    ]
  },
  {
    "code": "3529",
    "market": "otc",
    "names": [
      "力旺"
    ]
  },
  {
    "code": "3531",
    "market": "otc",
    "names": [
      "先益"
    ]
  },
  {
    "code": "3537",
    "market": "otc",
    "names": [
      "堡達"
    ]
  },
  {
    "code": "3540",
    "market": "otc",
    "names": [
      "曜越"
    ]
  },
  {
    "code": "3541",
    "market": "otc",
    "names": [
      "西柏"
    ]
  },
  {
    "code": "3546",
    "market": "otc",
    "names": [
      "宇峻"
    ]
  },
  {
    "code": "3548",
    "market": "otc",
    "names": [
      "兆利"
    ]
  },
  {
    "code": "3551",
    "market": "otc",
    "names": [
      "世禾"
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
    "code": "3555",
    "market": "otc",
    "names": [
      "博士旺"
    ]
  },
  {
    "code": "3556",
    "market": "otc",
    "names": [
      "禾瑞亞"
    ]
  },
  {
    "code": "3558",
    "market": "otc",
    "names": [
      "神準"
    ]
  },
  {
    "code": "3564",
    "market": "otc",
    "names": [
      "其陽"
    ]
  },
  {
    "code": "3567",
    "market": "otc",
    "names": [
      "逸昌"
    ]
  },
  {
    "code": "3570",
    "market": "otc",
    "names": [
      "大塚"
    ]
  },
  {
    "code": "3577",
    "market": "otc",
    "names": [
      "泓格"
    ]
  },
  {
    "code": "3580",
    "market": "otc",
    "names": [
      "友威科"
    ]
  },
  {
    "code": "3581",
    "market": "otc",
    "names": [
      "博磊"
    ]
  },
  {
    "code": "3587",
    "market": "otc",
    "names": [
      "閎康"
    ]
  },
  {
    "code": "3594",
    "market": "otc",
    "names": [
      "磐儀"
    ]
  },
  {
    "code": "3597",
    "market": "otc",
    "names": [
      "映興"
    ]
  },
  {
    "code": "3609",
    "market": "otc",
    "names": [
      "三一東林"
    ]
  },
  {
    "code": "3611",
    "market": "otc",
    "names": [
      "鼎翰"
    ]
  },
  {
    "code": "3615",
    "market": "otc",
    "names": [
      "安可"
    ]
  },
  {
    "code": "3623",
    "market": "otc",
    "names": [
      "富晶通"
    ]
  },
  {
    "code": "3624",
    "market": "otc",
    "names": [
      "光頡"
    ]
  },
  {
    "code": "3625",
    "market": "otc",
    "names": [
      "西勝"
    ]
  },
  {
    "code": "3628",
    "market": "otc",
    "names": [
      "盈正"
    ]
  },
  {
    "code": "3629",
    "market": "otc",
    "names": [
      "地心引力"
    ]
  },
  {
    "code": "3630",
    "market": "otc",
    "names": [
      "新鉅科"
    ]
  },
  {
    "code": "3631",
    "market": "otc",
    "names": [
      "晟楠"
    ]
  },
  {
    "code": "3632",
    "market": "otc",
    "names": [
      "研勤"
    ]
  },
  {
    "code": "3646",
    "market": "otc",
    "names": [
      "艾恩特"
    ]
  },
  {
    "code": "3663",
    "market": "otc",
    "names": [
      "鑫科"
    ]
  },
  {
    "code": "3664",
    "market": "otc",
    "names": [
      "安瑞-KY",
      "安瑞"
    ]
  },
  {
    "code": "3666",
    "market": "otc",
    "names": [
      "光耀"
    ]
  },
  {
    "code": "3672",
    "market": "otc",
    "names": [
      "康聯訊"
    ]
  },
  {
    "code": "3675",
    "market": "otc",
    "names": [
      "德微"
    ]
  },
  {
    "code": "3680",
    "market": "otc",
    "names": [
      "家登"
    ]
  },
  {
    "code": "3684",
    "market": "otc",
    "names": [
      "榮昌"
    ]
  },
  {
    "code": "3685",
    "market": "otc",
    "names": [
      "元創精密"
    ]
  },
  {
    "code": "3687",
    "market": "otc",
    "names": [
      "歐買尬"
    ]
  },
  {
    "code": "3689",
    "market": "otc",
    "names": [
      "湧德"
    ]
  },
  {
    "code": "3691",
    "market": "otc",
    "names": [
      "碩禾",
      "智原",
      "智原科技",
      "邰哥",
      "Faraday"
    ]
  },
  {
    "code": "3693",
    "market": "otc",
    "names": [
      "營邦"
    ]
  },
  {
    "code": "3707",
    "market": "otc",
    "names": [
      "漢磊"
    ]
  },
  {
    "code": "3709",
    "market": "otc",
    "names": [
      "鑫聯大投控"
    ]
  },
  {
    "code": "3713",
    "market": "otc",
    "names": [
      "新晶投控"
    ]
  },
  {
    "code": "4102",
    "market": "otc",
    "names": [
      "永日"
    ]
  },
  {
    "code": "4105",
    "market": "otc",
    "names": [
      "東洋"
    ]
  },
  {
    "code": "4107",
    "market": "otc",
    "names": [
      "邦特"
    ]
  },
  {
    "code": "4109",
    "market": "otc",
    "names": [
      "加捷生醫"
    ]
  },
  {
    "code": "4111",
    "market": "otc",
    "names": [
      "濟生"
    ]
  },
  {
    "code": "4113",
    "market": "otc",
    "names": [
      "聯上"
    ]
  },
  {
    "code": "4114",
    "market": "otc",
    "names": [
      "健喬"
    ]
  },
  {
    "code": "4116",
    "market": "otc",
    "names": [
      "明基醫"
    ]
  },
  {
    "code": "4120",
    "market": "otc",
    "names": [
      "友華"
    ]
  },
  {
    "code": "4121",
    "market": "otc",
    "names": [
      "優盛"
    ]
  },
  {
    "code": "4123",
    "market": "otc",
    "names": [
      "晟德"
    ]
  },
  {
    "code": "4126",
    "market": "otc",
    "names": [
      "太醫"
    ]
  },
  {
    "code": "4127",
    "market": "otc",
    "names": [
      "天良"
    ]
  },
  {
    "code": "4128",
    "market": "otc",
    "names": [
      "中天"
    ]
  },
  {
    "code": "4129",
    "market": "otc",
    "names": [
      "聯合"
    ]
  },
  {
    "code": "4130",
    "market": "otc",
    "names": [
      "健亞"
    ]
  },
  {
    "code": "4131",
    "market": "otc",
    "names": [
      "浩泰"
    ]
  },
  {
    "code": "4138",
    "market": "otc",
    "names": [
      "曜亞"
    ]
  },
  {
    "code": "4139",
    "market": "otc",
    "names": [
      "馬光-KY",
      "馬光"
    ]
  },
  {
    "code": "4147",
    "market": "otc",
    "names": [
      "中裕"
    ]
  },
  {
    "code": "4153",
    "market": "otc",
    "names": [
      "鈺緯"
    ]
  },
  {
    "code": "4154",
    "market": "otc",
    "names": [
      "樂威科-KY",
      "樂威科"
    ]
  },
  {
    "code": "4157",
    "market": "otc",
    "names": [
      "太景*-KY",
      "太景*"
    ]
  },
  {
    "code": "4160",
    "market": "otc",
    "names": [
      "訊聯基因"
    ]
  },
  {
    "code": "4161",
    "market": "otc",
    "names": [
      "聿新科"
    ]
  },
  {
    "code": "4162",
    "market": "otc",
    "names": [
      "智擎"
    ]
  },
  {
    "code": "4163",
    "market": "otc",
    "names": [
      "鐿鈦"
    ]
  },
  {
    "code": "4166",
    "market": "otc",
    "names": [
      "友霖"
    ]
  },
  {
    "code": "4167",
    "market": "otc",
    "names": [
      "松瑞藥"
    ]
  },
  {
    "code": "4168",
    "market": "otc",
    "names": [
      "醣聯"
    ]
  },
  {
    "code": "4171",
    "market": "otc",
    "names": [
      "瑞基"
    ]
  },
  {
    "code": "4173",
    "market": "otc",
    "names": [
      "久裕"
    ]
  },
  {
    "code": "4174",
    "market": "otc",
    "names": [
      "浩鼎"
    ]
  },
  {
    "code": "4175",
    "market": "otc",
    "names": [
      "杏一"
    ]
  },
  {
    "code": "4183",
    "market": "otc",
    "names": [
      "福永生技"
    ]
  },
  {
    "code": "4188",
    "market": "otc",
    "names": [
      "安克"
    ]
  },
  {
    "code": "4192",
    "market": "otc",
    "names": [
      "杏國"
    ]
  },
  {
    "code": "4198",
    "market": "otc",
    "names": [
      "欣大健康"
    ]
  },
  {
    "code": "4205",
    "market": "otc",
    "names": [
      "中華食"
    ]
  },
  {
    "code": "4207",
    "market": "otc",
    "names": [
      "環泰"
    ]
  },
  {
    "code": "4303",
    "market": "otc",
    "names": [
      "信立"
    ]
  },
  {
    "code": "4304",
    "market": "otc",
    "names": [
      "勝昱"
    ]
  },
  {
    "code": "4305",
    "market": "otc",
    "names": [
      "世坤"
    ]
  },
  {
    "code": "4401",
    "market": "otc",
    "names": [
      "東隆興"
    ]
  },
  {
    "code": "4402",
    "market": "otc",
    "names": [
      "郡都開發"
    ]
  },
  {
    "code": "4406",
    "market": "otc",
    "names": [
      "新昕纖"
    ]
  },
  {
    "code": "4413",
    "market": "otc",
    "names": [
      "飛寶企業"
    ]
  },
  {
    "code": "4416",
    "market": "otc",
    "names": [
      "三圓"
    ]
  },
  {
    "code": "4417",
    "market": "otc",
    "names": [
      "金洲"
    ]
  },
  {
    "code": "4419",
    "market": "otc",
    "names": [
      "皇家美食"
    ]
  },
  {
    "code": "4420",
    "market": "otc",
    "names": [
      "光明"
    ]
  },
  {
    "code": "4430",
    "market": "otc",
    "names": [
      "耀億"
    ]
  },
  {
    "code": "4432",
    "market": "otc",
    "names": [
      "銘旺實"
    ]
  },
  {
    "code": "4433",
    "market": "otc",
    "names": [
      "興采"
    ]
  },
  {
    "code": "4442",
    "market": "otc",
    "names": [
      "竣邦-KY",
      "竣邦"
    ]
  },
  {
    "code": "4502",
    "market": "otc",
    "names": [
      "健信"
    ]
  },
  {
    "code": "4503",
    "market": "otc",
    "names": [
      "金雨"
    ]
  },
  {
    "code": "4506",
    "market": "otc",
    "names": [
      "崇友"
    ]
  },
  {
    "code": "4510",
    "market": "otc",
    "names": [
      "高鋒"
    ]
  },
  {
    "code": "4513",
    "market": "otc",
    "names": [
      "福裕"
    ]
  },
  {
    "code": "4523",
    "market": "otc",
    "names": [
      "永彰"
    ]
  },
  {
    "code": "4527",
    "market": "otc",
    "names": [
      "方土霖"
    ]
  },
  {
    "code": "4528",
    "market": "otc",
    "names": [
      "江興鍛"
    ]
  },
  {
    "code": "4529",
    "market": "otc",
    "names": [
      "淳紳"
    ]
  },
  {
    "code": "4530",
    "market": "otc",
    "names": [
      "宏易"
    ]
  },
  {
    "code": "4533",
    "market": "otc",
    "names": [
      "協易機"
    ]
  },
  {
    "code": "4534",
    "market": "otc",
    "names": [
      "慶騰"
    ]
  },
  {
    "code": "4535",
    "market": "otc",
    "names": [
      "至興"
    ]
  },
  {
    "code": "4538",
    "market": "otc",
    "names": [
      "大詠城"
    ]
  },
  {
    "code": "4541",
    "market": "otc",
    "names": [
      "晟田"
    ]
  },
  {
    "code": "4542",
    "market": "otc",
    "names": [
      "科嶠"
    ]
  },
  {
    "code": "4543",
    "market": "otc",
    "names": [
      "萬在"
    ]
  },
  {
    "code": "4549",
    "market": "otc",
    "names": [
      "桓達"
    ]
  },
  {
    "code": "4550",
    "market": "otc",
    "names": [
      "長佳"
    ]
  },
  {
    "code": "4554",
    "market": "otc",
    "names": [
      "橙的"
    ]
  },
  {
    "code": "4556",
    "market": "otc",
    "names": [
      "旭然"
    ]
  },
  {
    "code": "4558",
    "market": "otc",
    "names": [
      "寶緯"
    ]
  },
  {
    "code": "4561",
    "market": "otc",
    "names": [
      "健椿"
    ]
  },
  {
    "code": "4563",
    "market": "otc",
    "names": [
      "百德"
    ]
  },
  {
    "code": "4568",
    "market": "otc",
    "names": [
      "科際精密"
    ]
  },
  {
    "code": "4577",
    "market": "otc",
    "names": [
      "達航科技"
    ]
  },
  {
    "code": "4580",
    "market": "otc",
    "names": [
      "捷流閥業"
    ]
  },
  {
    "code": "4584",
    "market": "otc",
    "names": [
      "君帆"
    ]
  },
  {
    "code": "4609",
    "market": "otc",
    "names": [
      "唐鋒"
    ]
  },
  {
    "code": "4702",
    "market": "otc",
    "names": [
      "中美實"
    ]
  },
  {
    "code": "4706",
    "market": "otc",
    "names": [
      "大恭"
    ]
  },
  {
    "code": "4707",
    "market": "otc",
    "names": [
      "磐亞"
    ]
  },
  {
    "code": "4711",
    "market": "otc",
    "names": [
      "永純"
    ]
  },
  {
    "code": "4714",
    "market": "otc",
    "names": [
      "永捷"
    ]
  },
  {
    "code": "4716",
    "market": "otc",
    "names": [
      "大立"
    ]
  },
  {
    "code": "4721",
    "market": "otc",
    "names": [
      "美琪瑪"
    ]
  },
  {
    "code": "4726",
    "market": "otc",
    "names": [
      "永昕"
    ]
  },
  {
    "code": "4728",
    "market": "otc",
    "names": [
      "雙美"
    ]
  },
  {
    "code": "4729",
    "market": "otc",
    "names": [
      "熒茂"
    ]
  },
  {
    "code": "4741",
    "market": "otc",
    "names": [
      "泓瀚"
    ]
  },
  {
    "code": "4743",
    "market": "otc",
    "names": [
      "合一"
    ]
  },
  {
    "code": "4744",
    "market": "otc",
    "names": [
      "皇將"
    ]
  },
  {
    "code": "4745",
    "market": "otc",
    "names": [
      "合富-KY",
      "合富"
    ]
  },
  {
    "code": "4747",
    "market": "otc",
    "names": [
      "強生"
    ]
  },
  {
    "code": "4749",
    "market": "otc",
    "names": [
      "新應材"
    ]
  },
  {
    "code": "4754",
    "market": "otc",
    "names": [
      "國碳科"
    ]
  },
  {
    "code": "4760",
    "market": "otc",
    "names": [
      "勤凱"
    ]
  },
  {
    "code": "4767",
    "market": "otc",
    "names": [
      "誠泰科技"
    ]
  },
  {
    "code": "4768",
    "market": "otc",
    "names": [
      "晶呈科技"
    ]
  },
  {
    "code": "4772",
    "market": "otc",
    "names": [
      "台特化"
    ]
  },
  {
    "code": "4804",
    "market": "otc",
    "names": [
      "大略-KY",
      "大略"
    ]
  },
  {
    "code": "4806",
    "market": "otc",
    "names": [
      "桂田文創"
    ]
  },
  {
    "code": "4903",
    "market": "otc",
    "names": [
      "聯光通"
    ]
  },
  {
    "code": "4905",
    "market": "otc",
    "names": [
      "台聯電"
    ]
  },
  {
    "code": "4907",
    "market": "otc",
    "names": [
      "富宇"
    ]
  },
  {
    "code": "4908",
    "market": "otc",
    "names": [
      "前鼎"
    ]
  },
  {
    "code": "4909",
    "market": "otc",
    "names": [
      "新復興"
    ]
  },
  {
    "code": "4911",
    "market": "otc",
    "names": [
      "德英"
    ]
  },
  {
    "code": "4923",
    "market": "otc",
    "names": [
      "力士"
    ]
  },
  {
    "code": "4924",
    "market": "otc",
    "names": [
      "欣厚-KY",
      "欣厚"
    ]
  },
  {
    "code": "4931",
    "market": "otc",
    "names": [
      "新盛力"
    ]
  },
  {
    "code": "4933",
    "market": "otc",
    "names": [
      "友輝"
    ]
  },
  {
    "code": "4939",
    "market": "otc",
    "names": [
      "亞電"
    ]
  },
  {
    "code": "4946",
    "market": "otc",
    "names": [
      "辣椒"
    ]
  },
  {
    "code": "4950",
    "market": "otc",
    "names": [
      "金耘國際"
    ]
  },
  {
    "code": "4951",
    "market": "otc",
    "names": [
      "精拓科"
    ]
  },
  {
    "code": "4953",
    "market": "otc",
    "names": [
      "緯軟"
    ]
  },
  {
    "code": "4966",
    "market": "otc",
    "names": [
      "譜瑞-KY",
      "譜瑞"
    ]
  },
  {
    "code": "4971",
    "market": "otc",
    "names": [
      "IET-KY",
      "IET"
    ]
  },
  {
    "code": "4972",
    "market": "otc",
    "names": [
      "湯石照明"
    ]
  },
  {
    "code": "4973",
    "market": "otc",
    "names": [
      "廣穎"
    ]
  },
  {
    "code": "4974",
    "market": "otc",
    "names": [
      "亞泰"
    ]
  },
  {
    "code": "4979",
    "market": "otc",
    "names": [
      "華星光"
    ]
  },
  {
    "code": "4991",
    "market": "otc",
    "names": [
      "環宇-KY",
      "環宇"
    ]
  },
  {
    "code": "4995",
    "market": "otc",
    "names": [
      "晶達"
    ]
  },
  {
    "code": "5009",
    "market": "otc",
    "names": [
      "榮剛"
    ]
  },
  {
    "code": "5011",
    "market": "otc",
    "names": [
      "久陽"
    ]
  },
  {
    "code": "5013",
    "market": "otc",
    "names": [
      "強新"
    ]
  },
  {
    "code": "5014",
    "market": "otc",
    "names": [
      "建錩"
    ]
  },
  {
    "code": "5015",
    "market": "otc",
    "names": [
      "華祺"
    ]
  },
  {
    "code": "5016",
    "market": "otc",
    "names": [
      "松和"
    ]
  },
  {
    "code": "5201",
    "market": "otc",
    "names": [
      "凱衛"
    ]
  },
  {
    "code": "5202",
    "market": "otc",
    "names": [
      "力新"
    ]
  },
  {
    "code": "5205",
    "market": "otc",
    "names": [
      "中茂"
    ]
  },
  {
    "code": "5206",
    "market": "otc",
    "names": [
      "坤悅"
    ]
  },
  {
    "code": "5209",
    "market": "otc",
    "names": [
      "新鼎"
    ]
  },
  {
    "code": "5210",
    "market": "otc",
    "names": [
      "寶碩"
    ]
  },
  {
    "code": "5211",
    "market": "otc",
    "names": [
      "蒙恬"
    ]
  },
  {
    "code": "5212",
    "market": "otc",
    "names": [
      "凌網"
    ]
  },
  {
    "code": "5213",
    "market": "otc",
    "names": [
      "亞昕"
    ]
  },
  {
    "code": "5220",
    "market": "otc",
    "names": [
      "萬達光電"
    ]
  },
  {
    "code": "5223",
    "market": "otc",
    "names": [
      "安力-KY",
      "安力"
    ]
  },
  {
    "code": "5227",
    "market": "otc",
    "names": [
      "立凱-KY",
      "立凱"
    ]
  },
  {
    "code": "5228",
    "market": "otc",
    "names": [
      "鈺鎧"
    ]
  },
  {
    "code": "5230",
    "market": "otc",
    "names": [
      "雷笛克光學"
    ]
  },
  {
    "code": "5245",
    "market": "otc",
    "names": [
      "智晶"
    ]
  },
  {
    "code": "5251",
    "market": "otc",
    "names": [
      "天鉞電"
    ]
  },
  {
    "code": "5263",
    "market": "otc",
    "names": [
      "智崴"
    ]
  },
  {
    "code": "5272",
    "market": "otc",
    "names": [
      "笙科"
    ]
  },
  {
    "code": "5274",
    "market": "otc",
    "names": [
      "信驊"
    ]
  },
  {
    "code": "5276",
    "market": "otc",
    "names": [
      "達輝-KY",
      "達輝"
    ]
  },
  {
    "code": "5278",
    "market": "otc",
    "names": [
      "尚凡*"
    ]
  },
  {
    "code": "5287",
    "market": "otc",
    "names": [
      "數字"
    ]
  },
  {
    "code": "5289",
    "market": "otc",
    "names": [
      "宜鼎"
    ]
  },
  {
    "code": "5291",
    "market": "otc",
    "names": [
      "邑昇"
    ]
  },
  {
    "code": "5299",
    "market": "otc",
    "names": [
      "杰力"
    ]
  },
  {
    "code": "5301",
    "market": "otc",
    "names": [
      "寶得利"
    ]
  },
  {
    "code": "5302",
    "market": "otc",
    "names": [
      "太欣"
    ]
  },
  {
    "code": "5309",
    "market": "otc",
    "names": [
      "系統電"
    ]
  },
  {
    "code": "5310",
    "market": "otc",
    "names": [
      "天剛"
    ]
  },
  {
    "code": "5312",
    "market": "otc",
    "names": [
      "寶島科"
    ]
  },
  {
    "code": "5314",
    "market": "otc",
    "names": [
      "世紀*"
    ]
  },
  {
    "code": "5315",
    "market": "otc",
    "names": [
      "光聯"
    ]
  },
  {
    "code": "5321",
    "market": "otc",
    "names": [
      "美而快"
    ]
  },
  {
    "code": "5324",
    "market": "otc",
    "names": [
      "士開"
    ]
  },
  {
    "code": "5328",
    "market": "otc",
    "names": [
      "華容"
    ]
  },
  {
    "code": "5340",
    "market": "otc",
    "names": [
      "建榮"
    ]
  },
  {
    "code": "5344",
    "market": "otc",
    "names": [
      "立衛"
    ]
  },
  {
    "code": "5345",
    "market": "otc",
    "names": [
      "馥鴻"
    ]
  },
  {
    "code": "5347",
    "market": "otc",
    "names": [
      "世界",
      "世界先進",
      "VIS",
      "仙境RO",
      "小GG",
      "DIO"
    ]
  },
  {
    "code": "5348",
    "market": "otc",
    "names": [
      "正能量智能"
    ]
  },
  {
    "code": "5351",
    "market": "otc",
    "names": [
      "鈺創"
    ]
  },
  {
    "code": "5353",
    "market": "otc",
    "names": [
      "台林"
    ]
  },
  {
    "code": "5355",
    "market": "otc",
    "names": [
      "佳總"
    ]
  },
  {
    "code": "5356",
    "market": "otc",
    "names": [
      "協益"
    ]
  },
  {
    "code": "5364",
    "market": "otc",
    "names": [
      "力麗店"
    ]
  },
  {
    "code": "5371",
    "market": "otc",
    "names": [
      "中光電"
    ]
  },
  {
    "code": "5381",
    "market": "otc",
    "names": [
      "光譜"
    ]
  },
  {
    "code": "5386",
    "market": "otc",
    "names": [
      "青雲"
    ]
  },
  {
    "code": "5392",
    "market": "otc",
    "names": [
      "能率"
    ]
  },
  {
    "code": "5398",
    "market": "otc",
    "names": [
      "慕康生醫"
    ]
  },
  {
    "code": "5403",
    "market": "otc",
    "names": [
      "中菲"
    ]
  },
  {
    "code": "5410",
    "market": "otc",
    "names": [
      "國眾"
    ]
  },
  {
    "code": "5425",
    "market": "otc",
    "names": [
      "台半"
    ]
  },
  {
    "code": "5426",
    "market": "otc",
    "names": [
      "振發"
    ]
  },
  {
    "code": "5432",
    "market": "otc",
    "names": [
      "新門"
    ]
  },
  {
    "code": "5438",
    "market": "otc",
    "names": [
      "東友"
    ]
  },
  {
    "code": "5439",
    "market": "otc",
    "names": [
      "高技"
    ]
  },
  {
    "code": "5443",
    "market": "otc",
    "names": [
      "均豪"
    ]
  },
  {
    "code": "5450",
    "market": "otc",
    "names": [
      "南良"
    ]
  },
  {
    "code": "5452",
    "market": "otc",
    "names": [
      "佶優"
    ]
  },
  {
    "code": "5455",
    "market": "otc",
    "names": [
      "昇益"
    ]
  },
  {
    "code": "5457",
    "market": "otc",
    "names": [
      "宣德"
    ]
  },
  {
    "code": "5460",
    "market": "otc",
    "names": [
      "同協"
    ]
  },
  {
    "code": "5464",
    "market": "otc",
    "names": [
      "霖宏"
    ]
  },
  {
    "code": "5465",
    "market": "otc",
    "names": [
      "富驊"
    ]
  },
  {
    "code": "5468",
    "market": "otc",
    "names": [
      "凱鈺"
    ]
  },
  {
    "code": "5474",
    "market": "otc",
    "names": [
      "聰泰"
    ]
  },
  {
    "code": "5475",
    "market": "otc",
    "names": [
      "德宏"
    ]
  },
  {
    "code": "5478",
    "market": "otc",
    "names": [
      "智冠"
    ]
  },
  {
    "code": "5481",
    "market": "otc",
    "names": [
      "新華"
    ]
  },
  {
    "code": "5483",
    "market": "otc",
    "names": [
      "中美晶",
      "中美"
    ]
  },
  {
    "code": "5487",
    "market": "otc",
    "names": [
      "通泰"
    ]
  },
  {
    "code": "5488",
    "market": "otc",
    "names": [
      "松普"
    ]
  },
  {
    "code": "5489",
    "market": "otc",
    "names": [
      "彩富"
    ]
  },
  {
    "code": "5490",
    "market": "otc",
    "names": [
      "同亨"
    ]
  },
  {
    "code": "5493",
    "market": "otc",
    "names": [
      "三聯"
    ]
  },
  {
    "code": "5498",
    "market": "otc",
    "names": [
      "凱崴"
    ]
  },
  {
    "code": "5508",
    "market": "otc",
    "names": [
      "永信建"
    ]
  },
  {
    "code": "5511",
    "market": "otc",
    "names": [
      "德昌"
    ]
  },
  {
    "code": "5512",
    "market": "otc",
    "names": [
      "力麒"
    ]
  },
  {
    "code": "5514",
    "market": "otc",
    "names": [
      "三豐"
    ]
  },
  {
    "code": "5516",
    "market": "otc",
    "names": [
      "雙喜"
    ]
  },
  {
    "code": "5520",
    "market": "otc",
    "names": [
      "力泰"
    ]
  },
  {
    "code": "5523",
    "market": "otc",
    "names": [
      "豐謙"
    ]
  },
  {
    "code": "5529",
    "market": "otc",
    "names": [
      "鉅陞"
    ]
  },
  {
    "code": "5530",
    "market": "otc",
    "names": [
      "龍巖"
    ]
  },
  {
    "code": "5536",
    "market": "otc",
    "names": [
      "聖暉*"
    ]
  },
  {
    "code": "5543",
    "market": "otc",
    "names": [
      "桓鼎-KY",
      "桓鼎"
    ]
  },
  {
    "code": "5547",
    "market": "otc",
    "names": [
      "久舜"
    ]
  },
  {
    "code": "5548",
    "market": "otc",
    "names": [
      "安倉"
    ]
  },
  {
    "code": "5601",
    "market": "otc",
    "names": [
      "台聯櫃"
    ]
  },
  {
    "code": "5603",
    "market": "otc",
    "names": [
      "陸海"
    ]
  },
  {
    "code": "5604",
    "market": "otc",
    "names": [
      "中連"
    ]
  },
  {
    "code": "5609",
    "market": "otc",
    "names": [
      "中菲行"
    ]
  },
  {
    "code": "5701",
    "market": "otc",
    "names": [
      "劍湖山"
    ]
  },
  {
    "code": "5703",
    "market": "otc",
    "names": [
      "亞都"
    ]
  },
  {
    "code": "5704",
    "market": "otc",
    "names": [
      "老爺知"
    ]
  },
  {
    "code": "5864",
    "market": "otc",
    "names": [
      "致和證"
    ]
  },
  {
    "code": "5878",
    "market": "otc",
    "names": [
      "台名"
    ]
  },
  {
    "code": "5902",
    "market": "otc",
    "names": [
      "德記"
    ]
  },
  {
    "code": "5903",
    "market": "otc",
    "names": [
      "全家"
    ]
  },
  {
    "code": "5904",
    "market": "otc",
    "names": [
      "寶雅"
    ]
  },
  {
    "code": "5905",
    "market": "otc",
    "names": [
      "南仁湖"
    ]
  },
  {
    "code": "6015",
    "market": "otc",
    "names": [
      "宏遠證"
    ]
  },
  {
    "code": "6016",
    "market": "otc",
    "names": [
      "康和證"
    ]
  },
  {
    "code": "6021",
    "market": "otc",
    "names": [
      "美好證"
    ]
  },
  {
    "code": "6023",
    "market": "otc",
    "names": [
      "元大期"
    ]
  },
  {
    "code": "6026",
    "market": "otc",
    "names": [
      "福邦證"
    ]
  },
  {
    "code": "6028",
    "market": "otc",
    "names": [
      "公勝保經"
    ]
  },
  {
    "code": "6101",
    "market": "otc",
    "names": [
      "寬魚國際"
    ]
  },
  {
    "code": "6103",
    "market": "otc",
    "names": [
      "合邦"
    ]
  },
  {
    "code": "6104",
    "market": "otc",
    "names": [
      "創惟"
    ]
  },
  {
    "code": "6109",
    "market": "otc",
    "names": [
      "亞元"
    ]
  },
  {
    "code": "6111",
    "market": "otc",
    "names": [
      "光聚晶電"
    ]
  },
  {
    "code": "6113",
    "market": "otc",
    "names": [
      "亞矽"
    ]
  },
  {
    "code": "6114",
    "market": "otc",
    "names": [
      "久威"
    ]
  },
  {
    "code": "6118",
    "market": "otc",
    "names": [
      "建達"
    ]
  },
  {
    "code": "6121",
    "market": "otc",
    "names": [
      "新普"
    ]
  },
  {
    "code": "6122",
    "market": "otc",
    "names": [
      "擎邦"
    ]
  },
  {
    "code": "6123",
    "market": "otc",
    "names": [
      "上奇"
    ]
  },
  {
    "code": "6124",
    "market": "otc",
    "names": [
      "業強"
    ]
  },
  {
    "code": "6125",
    "market": "otc",
    "names": [
      "廣運"
    ]
  },
  {
    "code": "6126",
    "market": "otc",
    "names": [
      "信音"
    ]
  },
  {
    "code": "6127",
    "market": "otc",
    "names": [
      "九豪"
    ]
  },
  {
    "code": "6129",
    "market": "otc",
    "names": [
      "普誠"
    ]
  },
  {
    "code": "6130",
    "market": "otc",
    "names": [
      "上亞科技"
    ]
  },
  {
    "code": "6134",
    "market": "otc",
    "names": [
      "萬旭"
    ]
  },
  {
    "code": "6138",
    "market": "otc",
    "names": [
      "茂達"
    ]
  },
  {
    "code": "6140",
    "market": "otc",
    "names": [
      "訊達"
    ]
  },
  {
    "code": "6143",
    "market": "otc",
    "names": [
      "振曜"
    ]
  },
  {
    "code": "6144",
    "market": "otc",
    "names": [
      "得利影"
    ]
  },
  {
    "code": "6146",
    "market": "otc",
    "names": [
      "耕興"
    ]
  },
  {
    "code": "6147",
    "market": "otc",
    "names": [
      "頎邦"
    ]
  },
  {
    "code": "6148",
    "market": "otc",
    "names": [
      "驊宏資"
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
    "code": "6151",
    "market": "otc",
    "names": [
      "晉倫"
    ]
  },
  {
    "code": "6154",
    "market": "otc",
    "names": [
      "順發"
    ]
  },
  {
    "code": "6156",
    "market": "otc",
    "names": [
      "松上"
    ]
  },
  {
    "code": "6158",
    "market": "otc",
    "names": [
      "禾昌"
    ]
  },
  {
    "code": "6160",
    "market": "otc",
    "names": [
      "欣技"
    ]
  },
  {
    "code": "6161",
    "market": "otc",
    "names": [
      "捷波"
    ]
  },
  {
    "code": "6163",
    "market": "otc",
    "names": [
      "華電網"
    ]
  },
  {
    "code": "6167",
    "market": "otc",
    "names": [
      "久正"
    ]
  },
  {
    "code": "6169",
    "market": "otc",
    "names": [
      "昱泉"
    ]
  },
  {
    "code": "6170",
    "market": "otc",
    "names": [
      "統振"
    ]
  },
  {
    "code": "6171",
    "market": "otc",
    "names": [
      "大城地產"
    ]
  },
  {
    "code": "6173",
    "market": "otc",
    "names": [
      "信昌電"
    ]
  },
  {
    "code": "6174",
    "market": "otc",
    "names": [
      "安碁"
    ]
  },
  {
    "code": "6175",
    "market": "otc",
    "names": [
      "立敦"
    ]
  },
  {
    "code": "6179",
    "market": "otc",
    "names": [
      "亞通"
    ]
  },
  {
    "code": "6180",
    "market": "otc",
    "names": [
      "橘子"
    ]
  },
  {
    "code": "6182",
    "market": "otc",
    "names": [
      "合晶"
    ]
  },
  {
    "code": "6185",
    "market": "otc",
    "names": [
      "幃翔"
    ]
  },
  {
    "code": "6186",
    "market": "otc",
    "names": [
      "新潤"
    ]
  },
  {
    "code": "6187",
    "market": "otc",
    "names": [
      "萬潤"
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
    "code": "6190",
    "market": "otc",
    "names": [
      "萬泰科"
    ]
  },
  {
    "code": "6194",
    "market": "otc",
    "names": [
      "育富"
    ]
  },
  {
    "code": "6195",
    "market": "otc",
    "names": [
      "詩肯"
    ]
  },
  {
    "code": "6198",
    "market": "otc",
    "names": [
      "瑞築"
    ]
  },
  {
    "code": "6199",
    "market": "otc",
    "names": [
      "天品"
    ]
  },
  {
    "code": "6203",
    "market": "otc",
    "names": [
      "海韻電"
    ]
  },
  {
    "code": "6204",
    "market": "otc",
    "names": [
      "艾華"
    ]
  },
  {
    "code": "6207",
    "market": "otc",
    "names": [
      "雷科"
    ]
  },
  {
    "code": "6208",
    "market": "otc",
    "names": [
      "日揚"
    ]
  },
  {
    "code": "6210",
    "market": "otc",
    "names": [
      "慶生"
    ]
  },
  {
    "code": "6212",
    "market": "otc",
    "names": [
      "理銘"
    ]
  },
  {
    "code": "6217",
    "market": "otc",
    "names": [
      "中探針"
    ]
  },
  {
    "code": "6218",
    "market": "otc",
    "names": [
      "豪勉"
    ]
  },
  {
    "code": "6219",
    "market": "otc",
    "names": [
      "富旺"
    ]
  },
  {
    "code": "6220",
    "market": "otc",
    "names": [
      "岳豐"
    ]
  },
  {
    "code": "6221",
    "market": "otc",
    "names": [
      "晉泰"
    ]
  },
  {
    "code": "6222",
    "market": "otc",
    "names": [
      "立軒"
    ]
  },
  {
    "code": "6223",
    "market": "otc",
    "names": [
      "旺矽"
    ]
  },
  {
    "code": "6227",
    "market": "otc",
    "names": [
      "茂綸"
    ]
  },
  {
    "code": "6228",
    "market": "otc",
    "names": [
      "全譜"
    ]
  },
  {
    "code": "6229",
    "market": "otc",
    "names": [
      "研通"
    ]
  },
  {
    "code": "6231",
    "market": "otc",
    "names": [
      "系微"
    ]
  },
  {
    "code": "6233",
    "market": "otc",
    "names": [
      "旺玖"
    ]
  },
  {
    "code": "6234",
    "market": "otc",
    "names": [
      "高僑"
    ]
  },
  {
    "code": "6236",
    "market": "otc",
    "names": [
      "中湛"
    ]
  },
  {
    "code": "6237",
    "market": "otc",
    "names": [
      "驊訊"
    ]
  },
  {
    "code": "6240",
    "market": "otc",
    "names": [
      "松崗"
    ]
  },
  {
    "code": "6241",
    "market": "otc",
    "names": [
      "鑫永洋"
    ]
  },
  {
    "code": "6242",
    "market": "otc",
    "names": [
      "立康"
    ]
  },
  {
    "code": "6244",
    "market": "otc",
    "names": [
      "茂迪"
    ]
  },
  {
    "code": "6245",
    "market": "otc",
    "names": [
      "立端"
    ]
  },
  {
    "code": "6246",
    "market": "otc",
    "names": [
      "臺龍"
    ]
  },
  {
    "code": "6248",
    "market": "otc",
    "names": [
      "沛波"
    ]
  },
  {
    "code": "6259",
    "market": "otc",
    "names": [
      "百徽",
      "精成科",
      "精成科技",
      "精神科"
    ]
  },
  {
    "code": "6261",
    "market": "otc",
    "names": [
      "久元"
    ]
  },
  {
    "code": "6263",
    "market": "otc",
    "names": [
      "普萊德"
    ]
  },
  {
    "code": "6264",
    "market": "otc",
    "names": [
      "富裔"
    ]
  },
  {
    "code": "6265",
    "market": "otc",
    "names": [
      "方土昶"
    ]
  },
  {
    "code": "6266",
    "market": "otc",
    "names": [
      "泰詠"
    ]
  },
  {
    "code": "6270",
    "market": "otc",
    "names": [
      "倍微"
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
    "code": "6275",
    "market": "otc",
    "names": [
      "元山"
    ]
  },
  {
    "code": "6276",
    "market": "otc",
    "names": [
      "安鈦克"
    ]
  },
  {
    "code": "6279",
    "market": "otc",
    "names": [
      "胡連"
    ]
  },
  {
    "code": "6284",
    "market": "otc",
    "names": [
      "佳邦"
    ]
  },
  {
    "code": "6290",
    "market": "otc",
    "names": [
      "良維"
    ]
  },
  {
    "code": "6291",
    "market": "otc",
    "names": [
      "沛亨"
    ]
  },
  {
    "code": "6292",
    "market": "otc",
    "names": [
      "迅德"
    ]
  },
  {
    "code": "6294",
    "market": "otc",
    "names": [
      "智基"
    ]
  },
  {
    "code": "6411",
    "market": "otc",
    "names": [
      "晶焱"
    ]
  },
  {
    "code": "6417",
    "market": "otc",
    "names": [
      "韋僑"
    ]
  },
  {
    "code": "6418",
    "market": "otc",
    "names": [
      "詠昇"
    ]
  },
  {
    "code": "6419",
    "market": "otc",
    "names": [
      "京晨科"
    ]
  },
  {
    "code": "6423",
    "market": "otc",
    "names": [
      "億而得"
    ]
  },
  {
    "code": "6425",
    "market": "otc",
    "names": [
      "易發"
    ]
  },
  {
    "code": "6435",
    "market": "otc",
    "names": [
      "大中"
    ]
  },
  {
    "code": "6441",
    "market": "otc",
    "names": [
      "廣錠"
    ]
  },
  {
    "code": "6461",
    "market": "otc",
    "names": [
      "益得"
    ]
  },
  {
    "code": "6462",
    "market": "otc",
    "names": [
      "神盾"
    ]
  },
  {
    "code": "6465",
    "market": "otc",
    "names": [
      "威潤"
    ]
  },
  {
    "code": "6469",
    "market": "otc",
    "names": [
      "大樹"
    ]
  },
  {
    "code": "6470",
    "market": "otc",
    "names": [
      "宇智"
    ]
  },
  {
    "code": "6474",
    "market": "otc",
    "names": [
      "華豫寧"
    ]
  },
  {
    "code": "6482",
    "market": "otc",
    "names": [
      "弘煜科"
    ]
  },
  {
    "code": "6485",
    "market": "otc",
    "names": [
      "點序"
    ]
  },
  {
    "code": "6486",
    "market": "otc",
    "names": [
      "互動"
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
    "code": "6492",
    "market": "otc",
    "names": [
      "生華科"
    ]
  },
  {
    "code": "6494",
    "market": "otc",
    "names": [
      "九齊"
    ]
  },
  {
    "code": "6496",
    "market": "otc",
    "names": [
      "科懋"
    ]
  },
  {
    "code": "6498",
    "market": "otc",
    "names": [
      "久禾光"
    ]
  },
  {
    "code": "6499",
    "market": "otc",
    "names": [
      "益安"
    ]
  },
  {
    "code": "6506",
    "market": "otc",
    "names": [
      "雙邦"
    ]
  },
  {
    "code": "6508",
    "market": "otc",
    "names": [
      "惠光",
      "定穎投控",
      "定穎",
      "定穎頭痛"
    ]
  },
  {
    "code": "6509",
    "market": "otc",
    "names": [
      "聚和"
    ]
  },
  {
    "code": "6510",
    "market": "otc",
    "names": [
      "精測"
    ]
  },
  {
    "code": "6512",
    "market": "otc",
    "names": [
      "啟發電"
    ]
  },
  {
    "code": "6516",
    "market": "otc",
    "names": [
      "勤崴國際"
    ]
  },
  {
    "code": "6517",
    "market": "otc",
    "names": [
      "保勝光學"
    ]
  },
  {
    "code": "6523",
    "market": "otc",
    "names": [
      "達爾膚"
    ]
  },
  {
    "code": "6527",
    "market": "otc",
    "names": [
      "明達醫"
    ]
  },
  {
    "code": "6530",
    "market": "otc",
    "names": [
      "創威"
    ]
  },
  {
    "code": "6532",
    "market": "otc",
    "names": [
      "瑞耘"
    ]
  },
  {
    "code": "6535",
    "market": "otc",
    "names": [
      "順藥"
    ]
  },
  {
    "code": "6538",
    "market": "otc",
    "names": [
      "倉和"
    ]
  },
  {
    "code": "6542",
    "market": "otc",
    "names": [
      "隆中"
    ]
  },
  {
    "code": "6546",
    "market": "otc",
    "names": [
      "正基"
    ]
  },
  {
    "code": "6547",
    "market": "otc",
    "names": [
      "高端疫苗"
    ]
  },
  {
    "code": "6548",
    "market": "otc",
    "names": [
      "長科*"
    ]
  },
  {
    "code": "6556",
    "market": "otc",
    "names": [
      "勝品"
    ]
  },
  {
    "code": "6560",
    "market": "otc",
    "names": [
      "欣普羅"
    ]
  },
  {
    "code": "6561",
    "market": "otc",
    "names": [
      "是方"
    ]
  },
  {
    "code": "6568",
    "market": "otc",
    "names": [
      "宏觀"
    ]
  },
  {
    "code": "6569",
    "market": "otc",
    "names": [
      "醫揚"
    ]
  },
  {
    "code": "6570",
    "market": "otc",
    "names": [
      "維田"
    ]
  },
  {
    "code": "6574",
    "market": "otc",
    "names": [
      "霈方"
    ]
  },
  {
    "code": "6576",
    "market": "otc",
    "names": [
      "逸達"
    ]
  },
  {
    "code": "6577",
    "market": "otc",
    "names": [
      "勁豐"
    ]
  },
  {
    "code": "6578",
    "market": "otc",
    "names": [
      "達邦蛋白"
    ]
  },
  {
    "code": "6584",
    "market": "otc",
    "names": [
      "南俊國際"
    ]
  },
  {
    "code": "6588",
    "market": "otc",
    "names": [
      "東典光電"
    ]
  },
  {
    "code": "6590",
    "market": "otc",
    "names": [
      "普鴻"
    ]
  },
  {
    "code": "6593",
    "market": "otc",
    "names": [
      "台灣銘板"
    ]
  },
  {
    "code": "6596",
    "market": "otc",
    "names": [
      "寬宏藝術"
    ]
  },
  {
    "code": "6597",
    "market": "otc",
    "names": [
      "立誠"
    ]
  },
  {
    "code": "6603",
    "market": "otc",
    "names": [
      "富強鑫"
    ]
  },
  {
    "code": "6609",
    "market": "otc",
    "names": [
      "瀧澤科"
    ]
  },
  {
    "code": "6612",
    "market": "otc",
    "names": [
      "奈米醫材"
    ]
  },
  {
    "code": "6613",
    "market": "otc",
    "names": [
      "朋億*"
    ]
  },
  {
    "code": "6615",
    "market": "otc",
    "names": [
      "慧智"
    ]
  },
  {
    "code": "6616",
    "market": "otc",
    "names": [
      "特昇-KY",
      "特昇"
    ]
  },
  {
    "code": "6617",
    "market": "otc",
    "names": [
      "共信-KY",
      "共信"
    ]
  },
  {
    "code": "6620",
    "market": "otc",
    "names": [
      "漢達"
    ]
  },
  {
    "code": "6624",
    "market": "otc",
    "names": [
      "萬年清"
    ]
  },
  {
    "code": "6629",
    "market": "otc",
    "names": [
      "泰金-KY",
      "泰金"
    ]
  },
  {
    "code": "6637",
    "market": "otc",
    "names": [
      "醫影"
    ]
  },
  {
    "code": "6640",
    "market": "otc",
    "names": [
      "均華"
    ]
  },
  {
    "code": "6642",
    "market": "otc",
    "names": [
      "富致"
    ]
  },
  {
    "code": "6643",
    "market": "otc",
    "names": [
      "M31"
    ]
  },
  {
    "code": "6649",
    "market": "otc",
    "names": [
      "台生材"
    ]
  },
  {
    "code": "6651",
    "market": "otc",
    "names": [
      "全宇昕"
    ]
  },
  {
    "code": "6654",
    "market": "otc",
    "names": [
      "天正國際"
    ]
  },
  {
    "code": "6661",
    "market": "otc",
    "names": [
      "威健生技"
    ]
  },
  {
    "code": "6662",
    "market": "otc",
    "names": [
      "樂斯科"
    ]
  },
  {
    "code": "6664",
    "market": "otc",
    "names": [
      "群翊"
    ]
  },
  {
    "code": "6667",
    "market": "otc",
    "names": [
      "信紘科"
    ]
  },
  {
    "code": "6679",
    "market": "otc",
    "names": [
      "鈺太"
    ]
  },
  {
    "code": "6680",
    "market": "otc",
    "names": [
      "鑫創電子"
    ]
  },
  {
    "code": "6683",
    "market": "otc",
    "names": [
      "雍智科技"
    ]
  },
  {
    "code": "6684",
    "market": "otc",
    "names": [
      "安格"
    ]
  },
  {
    "code": "6690",
    "market": "otc",
    "names": [
      "安碁資訊"
    ]
  },
  {
    "code": "6692",
    "market": "otc",
    "names": [
      "進能服"
    ]
  },
  {
    "code": "6693",
    "market": "otc",
    "names": [
      "廣閎科"
    ]
  },
  {
    "code": "6697",
    "market": "otc",
    "names": [
      "東捷資訊"
    ]
  },
  {
    "code": "6703",
    "market": "otc",
    "names": [
      "軒郁"
    ]
  },
  {
    "code": "6708",
    "market": "otc",
    "names": [
      "天擎"
    ]
  },
  {
    "code": "6712",
    "market": "otc",
    "names": [
      "長聖"
    ]
  },
  {
    "code": "6716",
    "market": "otc",
    "names": [
      "應廣"
    ]
  },
  {
    "code": "6720",
    "market": "otc",
    "names": [
      "久昌"
    ]
  },
  {
    "code": "6721",
    "market": "otc",
    "names": [
      "信實"
    ]
  },
  {
    "code": "6725",
    "market": "otc",
    "names": [
      "矽科宏晟"
    ]
  },
  {
    "code": "6727",
    "market": "otc",
    "names": [
      "亞泰金屬"
    ]
  },
  {
    "code": "6728",
    "market": "otc",
    "names": [
      "上洋"
    ]
  },
  {
    "code": "6730",
    "market": "otc",
    "names": [
      "常廣"
    ]
  },
  {
    "code": "6732",
    "market": "otc",
    "names": [
      "昇佳電子"
    ]
  },
  {
    "code": "6733",
    "market": "otc",
    "names": [
      "博晟生醫"
    ]
  },
  {
    "code": "6735",
    "market": "otc",
    "names": [
      "美達科技"
    ]
  },
  {
    "code": "6739",
    "market": "otc",
    "names": [
      "竹陞科技"
    ]
  },
  {
    "code": "6741",
    "market": "otc",
    "names": [
      "91APP*-KY",
      "91APP*"
    ]
  },
  {
    "code": "6751",
    "market": "otc",
    "names": [
      "智聯服務"
    ]
  },
  {
    "code": "6752",
    "market": "otc",
    "names": [
      "叡揚"
    ]
  },
  {
    "code": "6761",
    "market": "otc",
    "names": [
      "穩得"
    ]
  },
  {
    "code": "6762",
    "market": "otc",
    "names": [
      "達亞"
    ]
  },
  {
    "code": "6763",
    "market": "otc",
    "names": [
      "綠界科技*"
    ]
  },
  {
    "code": "6767",
    "market": "otc",
    "names": [
      "台微醫"
    ]
  },
  {
    "code": "6788",
    "market": "otc",
    "names": [
      "華景電"
    ]
  },
  {
    "code": "6791",
    "market": "otc",
    "names": [
      "虎門科技"
    ]
  },
  {
    "code": "6803",
    "market": "otc",
    "names": [
      "崑鼎"
    ]
  },
  {
    "code": "6804",
    "market": "otc",
    "names": [
      "明係"
    ]
  },
  {
    "code": "6811",
    "market": "otc",
    "names": [
      "宏碁資訊"
    ]
  },
  {
    "code": "6821",
    "market": "otc",
    "names": [
      "聯寶"
    ]
  },
  {
    "code": "6823",
    "market": "otc",
    "names": [
      "濾能"
    ]
  },
  {
    "code": "6829",
    "market": "otc",
    "names": [
      "千附精密"
    ]
  },
  {
    "code": "6840",
    "market": "otc",
    "names": [
      "東研信超"
    ]
  },
  {
    "code": "6841",
    "market": "otc",
    "names": [
      "長佳智能"
    ]
  },
  {
    "code": "6843",
    "market": "otc",
    "names": [
      "進典"
    ]
  },
  {
    "code": "6844",
    "market": "otc",
    "names": [
      "諾貝兒"
    ]
  },
  {
    "code": "6846",
    "market": "otc",
    "names": [
      "綠茵"
    ]
  },
  {
    "code": "6855",
    "market": "otc",
    "names": [
      "數泓科"
    ]
  },
  {
    "code": "6856",
    "market": "otc",
    "names": [
      "鑫傳"
    ]
  },
  {
    "code": "6859",
    "market": "otc",
    "names": [
      "伯特光"
    ]
  },
  {
    "code": "6865",
    "market": "otc",
    "names": [
      "偉康科技"
    ]
  },
  {
    "code": "6870",
    "market": "otc",
    "names": [
      "騰雲"
    ]
  },
  {
    "code": "6872",
    "market": "otc",
    "names": [
      "浩宇生醫"
    ]
  },
  {
    "code": "6874",
    "market": "otc",
    "names": [
      "倍力"
    ]
  },
  {
    "code": "6875",
    "market": "otc",
    "names": [
      "國邑*"
    ]
  },
  {
    "code": "6877",
    "market": "otc",
    "names": [
      "鏵友益"
    ]
  },
  {
    "code": "6881",
    "market": "otc",
    "names": [
      "潤德"
    ]
  },
  {
    "code": "6884",
    "market": "otc",
    "names": [
      "海柏特"
    ]
  },
  {
    "code": "6894",
    "market": "otc",
    "names": [
      "衛司特"
    ]
  },
  {
    "code": "6895",
    "market": "otc",
    "names": [
      "宏碩系統"
    ]
  },
  {
    "code": "6899",
    "market": "otc",
    "names": [
      "創為精密"
    ]
  },
  {
    "code": "6903",
    "market": "otc",
    "names": [
      "巨漢"
    ]
  },
  {
    "code": "6904",
    "market": "otc",
    "names": [
      "伯鑫"
    ]
  },
  {
    "code": "6907",
    "market": "otc",
    "names": [
      "雅特力-KY",
      "雅特力"
    ]
  },
  {
    "code": "6910",
    "market": "otc",
    "names": [
      "德鴻"
    ]
  },
  {
    "code": "6913",
    "market": "otc",
    "names": [
      "鴻呈"
    ]
  },
  {
    "code": "6922",
    "market": "otc",
    "names": [
      "宸曜"
    ]
  },
  {
    "code": "6925",
    "market": "otc",
    "names": [
      "意藍"
    ]
  },
  {
    "code": "6929",
    "market": "otc",
    "names": [
      "佑全"
    ]
  },
  {
    "code": "6945",
    "market": "otc",
    "names": [
      "圓祥生技"
    ]
  },
  {
    "code": "6953",
    "market": "otc",
    "names": [
      "家碩"
    ]
  },
  {
    "code": "6961",
    "market": "otc",
    "names": [
      "旅天下"
    ]
  },
  {
    "code": "6967",
    "market": "otc",
    "names": [
      "汎瑋材料"
    ]
  },
  {
    "code": "6968",
    "market": "otc",
    "names": [
      "萬達寵物"
    ]
  },
  {
    "code": "6971",
    "market": "otc",
    "names": [
      "惠民實業"
    ]
  },
  {
    "code": "6982",
    "market": "otc",
    "names": [
      "大井泵浦"
    ]
  },
  {
    "code": "6983",
    "market": "otc",
    "names": [
      "華洋精機"
    ]
  },
  {
    "code": "6986",
    "market": "otc",
    "names": [
      "和迅"
    ]
  },
  {
    "code": "6996",
    "market": "otc",
    "names": [
      "力領科技"
    ]
  },
  {
    "code": "6997",
    "market": "otc",
    "names": [
      "博弘"
    ]
  },
  {
    "code": "7402",
    "market": "otc",
    "names": [
      "邑錡"
    ]
  },
  {
    "code": "7547",
    "market": "otc",
    "names": [
      "碩網"
    ]
  },
  {
    "code": "7556",
    "market": "otc",
    "names": [
      "意德士"
    ]
  },
  {
    "code": "7584",
    "market": "otc",
    "names": [
      "樂意"
    ]
  },
  {
    "code": "7642",
    "market": "otc",
    "names": [
      "昶瑞機電"
    ]
  },
  {
    "code": "7703",
    "market": "otc",
    "names": [
      "銳澤"
    ]
  },
  {
    "code": "7704",
    "market": "otc",
    "names": [
      "明遠精密"
    ]
  },
  {
    "code": "7708",
    "market": "otc",
    "names": [
      "全家餐飲"
    ]
  },
  {
    "code": "7709",
    "market": "otc",
    "names": [
      "榮田"
    ]
  },
  {
    "code": "7712",
    "market": "otc",
    "names": [
      "博盛半導體"
    ]
  },
  {
    "code": "7713",
    "market": "otc",
    "names": [
      "威力德生醫"
    ]
  },
  {
    "code": "7714",
    "market": "otc",
    "names": [
      "創泓科技"
    ]
  },
  {
    "code": "7715",
    "market": "otc",
    "names": [
      "裕山"
    ]
  },
  {
    "code": "7716",
    "market": "otc",
    "names": [
      "昱臺國際"
    ]
  },
  {
    "code": "7717",
    "market": "otc",
    "names": [
      "萊德光電-KY",
      "萊德光電"
    ]
  },
  {
    "code": "7718",
    "market": "otc",
    "names": [
      "友鋮"
    ]
  },
  {
    "code": "7723",
    "market": "otc",
    "names": [
      "築間"
    ]
  },
  {
    "code": "7728",
    "market": "otc",
    "names": [
      "光焱科技"
    ]
  },
  {
    "code": "7734",
    "market": "otc",
    "names": [
      "印能科技"
    ]
  },
  {
    "code": "7738",
    "market": "otc",
    "names": [
      "東聯互動"
    ]
  },
  {
    "code": "7743",
    "market": "otc",
    "names": [
      "金利食安"
    ]
  },
  {
    "code": "7744",
    "market": "otc",
    "names": [
      "崴寶"
    ]
  },
  {
    "code": "7747",
    "market": "otc",
    "names": [
      "昕奇雲端"
    ]
  },
  {
    "code": "7751",
    "market": "otc",
    "names": [
      "竑騰"
    ]
  },
  {
    "code": "7753",
    "market": "otc",
    "names": [
      "星亞"
    ]
  },
  {
    "code": "7757",
    "market": "otc",
    "names": [
      "金色三麥"
    ]
  },
  {
    "code": "7767",
    "market": "otc",
    "names": [
      "仁大資訊"
    ]
  },
  {
    "code": "7770",
    "market": "otc",
    "names": [
      "君曜"
    ]
  },
  {
    "code": "7772",
    "market": "otc",
    "names": [
      "耀穎"
    ]
  },
  {
    "code": "7777",
    "market": "otc",
    "names": [
      "能率亞洲"
    ]
  },
  {
    "code": "7782",
    "market": "otc",
    "names": [
      "光速火箭"
    ]
  },
  {
    "code": "7792",
    "market": "otc",
    "names": [
      "安葆"
    ]
  },
  {
    "code": "7794",
    "market": "otc",
    "names": [
      "宏碁智新"
    ]
  },
  {
    "code": "7805",
    "market": "otc",
    "names": [
      "威聯通"
    ]
  },
  {
    "code": "7810",
    "market": "otc",
    "names": [
      "捷創科技"
    ]
  },
  {
    "code": "7811",
    "market": "otc",
    "names": [
      "民盛"
    ]
  },
  {
    "code": "7814",
    "market": "otc",
    "names": [
      "海昌生技"
    ]
  },
  {
    "code": "7819",
    "market": "otc",
    "names": [
      "精誠金融"
    ]
  },
  {
    "code": "7820",
    "market": "otc",
    "names": [
      "立盈"
    ]
  },
  {
    "code": "7828",
    "market": "otc",
    "names": [
      "創新服務"
    ]
  },
  {
    "code": "7839",
    "market": "otc",
    "names": [
      "達人網"
    ]
  },
  {
    "code": "7842",
    "market": "otc",
    "names": [
      "天能綠電"
    ]
  },
  {
    "code": "8024",
    "market": "otc",
    "names": [
      "佑華"
    ]
  },
  {
    "code": "8027",
    "market": "otc",
    "names": [
      "鈦昇"
    ]
  },
  {
    "code": "8032",
    "market": "otc",
    "names": [
      "光菱"
    ]
  },
  {
    "code": "8034",
    "market": "otc",
    "names": [
      "榮群"
    ]
  },
  {
    "code": "8038",
    "market": "otc",
    "names": [
      "長園科"
    ]
  },
  {
    "code": "8040",
    "market": "otc",
    "names": [
      "九暘"
    ]
  },
  {
    "code": "8042",
    "market": "otc",
    "names": [
      "金山電"
    ]
  },
  {
    "code": "8043",
    "market": "otc",
    "names": [
      "蜜望實"
    ]
  },
  {
    "code": "8044",
    "market": "otc",
    "names": [
      "網家"
    ]
  },
  {
    "code": "8047",
    "market": "otc",
    "names": [
      "星雲"
    ]
  },
  {
    "code": "8048",
    "market": "otc",
    "names": [
      "德勝"
    ]
  },
  {
    "code": "8049",
    "market": "otc",
    "names": [
      "晶采"
    ]
  },
  {
    "code": "8050",
    "market": "otc",
    "names": [
      "廣積"
    ]
  },
  {
    "code": "8054",
    "market": "otc",
    "names": [
      "安國"
    ]
  },
  {
    "code": "8059",
    "market": "otc",
    "names": [
      "凱碩"
    ]
  },
  {
    "code": "8064",
    "market": "otc",
    "names": [
      "東捷"
    ]
  },
  {
    "code": "8066",
    "market": "otc",
    "names": [
      "來思達"
    ]
  },
  {
    "code": "8067",
    "market": "otc",
    "names": [
      "志旭"
    ]
  },
  {
    "code": "8068",
    "market": "otc",
    "names": [
      "全達"
    ]
  },
  {
    "code": "8069",
    "market": "otc",
    "names": [
      "元太",
      "元太科技",
      "鰻魚飯",
      "E Ink"
    ]
  },
  {
    "code": "8071",
    "market": "otc",
    "names": [
      "能率網通"
    ]
  },
  {
    "code": "8074",
    "market": "otc",
    "names": [
      "鉅橡"
    ]
  },
  {
    "code": "8076",
    "market": "otc",
    "names": [
      "伍豐"
    ]
  },
  {
    "code": "8077",
    "market": "otc",
    "names": [
      "洛碁"
    ]
  },
  {
    "code": "8080",
    "market": "otc",
    "names": [
      "泰霖"
    ]
  },
  {
    "code": "8083",
    "market": "otc",
    "names": [
      "瑞穎"
    ]
  },
  {
    "code": "8084",
    "market": "otc",
    "names": [
      "巨虹"
    ]
  },
  {
    "code": "8085",
    "market": "otc",
    "names": [
      "福華"
    ]
  },
  {
    "code": "8086",
    "market": "otc",
    "names": [
      "宏捷科"
    ]
  },
  {
    "code": "8087",
    "market": "otc",
    "names": [
      "麗升能源"
    ]
  },
  {
    "code": "8088",
    "market": "otc",
    "names": [
      "品安"
    ]
  },
  {
    "code": "8089",
    "market": "otc",
    "names": [
      "康全電訊"
    ]
  },
  {
    "code": "8091",
    "market": "otc",
    "names": [
      "翔名"
    ]
  },
  {
    "code": "8092",
    "market": "otc",
    "names": [
      "建暐"
    ]
  },
  {
    "code": "8093",
    "market": "otc",
    "names": [
      "保銳"
    ]
  },
  {
    "code": "8096",
    "market": "otc",
    "names": [
      "擎亞"
    ]
  },
  {
    "code": "8097",
    "market": "otc",
    "names": [
      "常珵"
    ]
  },
  {
    "code": "8099",
    "market": "otc",
    "names": [
      "大世科"
    ]
  },
  {
    "code": "8102",
    "market": "otc",
    "names": [
      "傑霖科技"
    ]
  },
  {
    "code": "8107",
    "market": "otc",
    "names": [
      "大億金茂"
    ]
  },
  {
    "code": "8109",
    "market": "otc",
    "names": [
      "博大"
    ]
  },
  {
    "code": "8111",
    "market": "otc",
    "names": [
      "立碁"
    ]
  },
  {
    "code": "8121",
    "market": "otc",
    "names": [
      "越峰"
    ]
  },
  {
    "code": "8147",
    "market": "otc",
    "names": [
      "正淩"
    ]
  },
  {
    "code": "8155",
    "market": "otc",
    "names": [
      "博智"
    ]
  },
  {
    "code": "8171",
    "market": "otc",
    "names": [
      "天宇"
    ]
  },
  {
    "code": "8176",
    "market": "otc",
    "names": [
      "智捷"
    ]
  },
  {
    "code": "8182",
    "market": "otc",
    "names": [
      "加高"
    ]
  },
  {
    "code": "8183",
    "market": "otc",
    "names": [
      "精星"
    ]
  },
  {
    "code": "8227",
    "market": "otc",
    "names": [
      "巨有科技"
    ]
  },
  {
    "code": "8234",
    "market": "otc",
    "names": [
      "新漢"
    ]
  },
  {
    "code": "8240",
    "market": "otc",
    "names": [
      "華宏"
    ]
  },
  {
    "code": "8255",
    "market": "otc",
    "names": [
      "朋程"
    ]
  },
  {
    "code": "8272",
    "market": "otc",
    "names": [
      "全景軟體"
    ]
  },
  {
    "code": "8277",
    "market": "otc",
    "names": [
      "商丞"
    ]
  },
  {
    "code": "8284",
    "market": "otc",
    "names": [
      "三竹"
    ]
  },
  {
    "code": "8289",
    "market": "otc",
    "names": [
      "泰藝"
    ]
  },
  {
    "code": "8291",
    "market": "otc",
    "names": [
      "尚茂"
    ]
  },
  {
    "code": "8299",
    "market": "otc",
    "names": [
      "群聯"
    ]
  },
  {
    "code": "8342",
    "market": "otc",
    "names": [
      "益張"
    ]
  },
  {
    "code": "8349",
    "market": "otc",
    "names": [
      "恒耀"
    ]
  },
  {
    "code": "8354",
    "market": "otc",
    "names": [
      "冠好"
    ]
  },
  {
    "code": "8358",
    "market": "otc",
    "names": [
      "金居"
    ]
  },
  {
    "code": "8383",
    "market": "otc",
    "names": [
      "千附"
    ]
  },
  {
    "code": "8390",
    "market": "otc",
    "names": [
      "金益鼎"
    ]
  },
  {
    "code": "8401",
    "market": "otc",
    "names": [
      "白紗科"
    ]
  },
  {
    "code": "8403",
    "market": "otc",
    "names": [
      "盛弘"
    ]
  },
  {
    "code": "8409",
    "market": "otc",
    "names": [
      "商之器"
    ]
  },
  {
    "code": "8410",
    "market": "otc",
    "names": [
      "森田"
    ]
  },
  {
    "code": "8415",
    "market": "otc",
    "names": [
      "大國鋼"
    ]
  },
  {
    "code": "8416",
    "market": "otc",
    "names": [
      "實威"
    ]
  },
  {
    "code": "8421",
    "market": "otc",
    "names": [
      "旭源"
    ]
  },
  {
    "code": "8423",
    "market": "otc",
    "names": [
      "保綠-KY",
      "保綠"
    ]
  },
  {
    "code": "8424",
    "market": "otc",
    "names": [
      "惠普"
    ]
  },
  {
    "code": "8426",
    "market": "otc",
    "names": [
      "紅木-KY",
      "紅木"
    ]
  },
  {
    "code": "8431",
    "market": "otc",
    "names": [
      "匯鑽科"
    ]
  },
  {
    "code": "8432",
    "market": "otc",
    "names": [
      "東生華"
    ]
  },
  {
    "code": "8433",
    "market": "otc",
    "names": [
      "弘帆",
      "小寶雅"
    ]
  },
  {
    "code": "8435",
    "market": "otc",
    "names": [
      "鉅邁"
    ]
  },
  {
    "code": "8436",
    "market": "otc",
    "names": [
      "大江"
    ]
  },
  {
    "code": "8437",
    "market": "otc",
    "names": [
      "大地-KY",
      "大地"
    ]
  },
  {
    "code": "8440",
    "market": "otc",
    "names": [
      "綠電"
    ]
  },
  {
    "code": "8444",
    "market": "otc",
    "names": [
      "綠河-KY",
      "綠河"
    ]
  },
  {
    "code": "8446",
    "market": "otc",
    "names": [
      "華研"
    ]
  },
  {
    "code": "8450",
    "market": "otc",
    "names": [
      "霹靂"
    ]
  },
  {
    "code": "8455",
    "market": "otc",
    "names": [
      "大拓-KY",
      "大拓"
    ]
  },
  {
    "code": "8472",
    "market": "otc",
    "names": [
      "夠麻吉"
    ]
  },
  {
    "code": "8477",
    "market": "otc",
    "names": [
      "創業家"
    ]
  },
  {
    "code": "8489",
    "market": "otc",
    "names": [
      "三貝德"
    ]
  },
  {
    "code": "8905",
    "market": "otc",
    "names": [
      "裕國"
    ]
  },
  {
    "code": "8906",
    "market": "otc",
    "names": [
      "花王"
    ]
  },
  {
    "code": "8908",
    "market": "otc",
    "names": [
      "欣雄"
    ]
  },
  {
    "code": "8916",
    "market": "otc",
    "names": [
      "光隆"
    ]
  },
  {
    "code": "8917",
    "market": "otc",
    "names": [
      "欣泰"
    ]
  },
  {
    "code": "8921",
    "market": "otc",
    "names": [
      "沈氏"
    ]
  },
  {
    "code": "8923",
    "market": "otc",
    "names": [
      "時報"
    ]
  },
  {
    "code": "8924",
    "market": "otc",
    "names": [
      "大田"
    ]
  },
  {
    "code": "8927",
    "market": "otc",
    "names": [
      "北基"
    ]
  },
  {
    "code": "8928",
    "market": "otc",
    "names": [
      "鉅明"
    ]
  },
  {
    "code": "8929",
    "market": "otc",
    "names": [
      "富堡"
    ]
  },
  {
    "code": "8930",
    "market": "otc",
    "names": [
      "青鋼"
    ]
  },
  {
    "code": "8931",
    "market": "otc",
    "names": [
      "大汽電"
    ]
  },
  {
    "code": "8932",
    "market": "otc",
    "names": [
      "智通*"
    ]
  },
  {
    "code": "8933",
    "market": "otc",
    "names": [
      "愛地雅"
    ]
  },
  {
    "code": "8935",
    "market": "otc",
    "names": [
      "邦泰"
    ]
  },
  {
    "code": "8936",
    "market": "otc",
    "names": [
      "國統"
    ]
  },
  {
    "code": "8937",
    "market": "otc",
    "names": [
      "合騏*"
    ]
  },
  {
    "code": "8938",
    "market": "otc",
    "names": [
      "明安"
    ]
  },
  {
    "code": "8941",
    "market": "otc",
    "names": [
      "關中"
    ]
  },
  {
    "code": "8942",
    "market": "otc",
    "names": [
      "森鉅"
    ]
  },
  {
    "code": "9949",
    "market": "otc",
    "names": [
      "琉園"
    ]
  },
  {
    "code": "9950",
    "market": "otc",
    "names": [
      "萬國通"
    ]
  },
  {
    "code": "9951",
    "market": "otc",
    "names": [
      "皇田"
    ]
  },
  {
    "code": "9960",
    "market": "otc",
    "names": [
      "邁達康"
    ]
  },
  {
    "code": "9962",
    "market": "otc",
    "names": [
      "有益"
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
function getAllStockMatches(text) {
  const matches = [];

  // 1. 搜尋中文名稱 / 綽號 (由長到短)
  const sortedNames = [...NAME_INDEX.keys()].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (name.length < 2) continue;
    
    // 若為純數字綽號，需有邊界避免誤判 (如 "50" 不應匹配 "500", "50點", "+50")
    if (/^\d+$/.test(name)) {
      const regex = new RegExp(`(?<!\\d|[-+])${name}(?!\\d|[點塊元張萬千百口%])`, 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ start: match.index, end: match.index + name.length, stock: NAME_INDEX.get(name), matchedText: name });
      }
    } else {
      let pos = 0;
      while ((pos = text.indexOf(name, pos)) !== -1) {
        const end = pos + name.length;
        
        // 排除特定誤判詞，如 "海力士" 誤判為 "力士"
        if (name === '力士' && pos >= 1 && text.substring(pos - 1, pos) === '海') {
          pos = end;
          continue;
        }
        
        matches.push({ start: pos, end, stock: NAME_INDEX.get(name), matchedText: name });
        pos = end;
      }
    }
  }

  // 2. 掃描數字與ETF代號 (4-6 位，可包含 L/R 等字母副標)
  const codePattern = /(?<![A-Za-z0-9])(\d{4,6}[A-Za-z]?)(?![A-Za-z0-9])/gi;
  let match;
  while ((match = codePattern.exec(text)) !== null) {
    const rawCode = match[1];
    const upperCode = rawCode.toUpperCase();
    if (CODE_INDEX.has(upperCode)) {
      matches.push({
        start: match.index,
        end: match.index + rawCode.length,
        stock: CODE_INDEX.get(upperCode),
        matchedText: rawCode,
      });
    }
  }

  // 依起始位置排序；若位置相同，優先採用較長匹配
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  return matches;
}

/**
 * 從文字中偵測所有提及的台股
 * @param {string} text
 * @returns {Array<{code, names, market, matchedTerm}>}
 */
function detectStocks(text) {
  if (!text) return [];
  const matches = getAllStockMatches(text);
  if (matches.length === 0) return [];

  // 過濾重疊區間，避免子字串造成誤判
  const found = new Map();
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      if (!found.has(m.stock.code)) {
        found.set(m.stock.code, { ...m.stock, matchedTerm: m.matchedText });
      }
      lastEnd = m.end;
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

  const matches = getAllStockMatches(text);
  if (matches.length === 0) {
    return esc(text);
  }

  const filtered = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

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

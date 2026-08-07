const WebSocket = require('ws');
const iconv = require('iconv-lite');

function testVt100() {
  console.log('=== PTT BBS WebSocket VT100 鍵盤導航測試 ===');
  
  const ws = new WebSocket('wss://ws.ptt.cc/bbs', {
    headers: {
      'Origin': 'https://term.ptt.cc',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });

  let step = 0;

  ws.on('open', () => {
    console.log('🟢 已連線 wss://ws.ptt.cc/bbs');
  });

  ws.on('message', data => {
    let text;
    try { text = new TextDecoder('utf-8').decode(data); }
    catch { text = iconv.decode(data, 'big5'); }

    const clean = text.replace(/\x1b\[[0-9;]*[mGKH]/g, '');

    // 印出包含推文的關鍵行
    if (clean.includes('推 ') || clean.includes('噓 ') || clean.includes('→ ')) {
      console.log('⚡ [BBS 秒級推文實時串流]:', clean.trim().slice(0, 120));
    }

    // 狀態機導航
    if (step === 0 && (clean.includes('請輸入代號') || clean.includes('Guest'))) {
      step = 1;
      console.log('▶ [Step 1] 發送 guest 登入');
      ws.send('guest\r\n');
    } else if (step === 1 && clean.includes('按任意鍵繼續')) {
      step = 2;
      console.log('▶ [Step 2] 發送 Enter 穿越過場畫面');
      ws.send('\r\n');
    } else if (step === 2 && clean.includes('主功能表')) {
      step = 3;
      console.log('▶ [Step 3] 進入【s】搜尋看板 Stock');
      ws.send('sStock\r\n');
    } else if (step === 3 && (clean.includes('文章列表') || clean.includes('股票'))) {
      step = 4;
      console.log('▶ [Step 4] 已成功進入 Stock 板！搜尋【盤中閒聊】');
      ws.send('/盤中閒聊\r\n');
    } else if (step === 4 && clean.includes('盤中閒聊')) {
      step = 5;
      console.log('▶ [Step 5] 進入最新盤中閒聊文章，移至最新推文頁 [$]');
      ws.send('\r\n$');
    }
  });

  ws.on('error', err => console.error('🔴 Error:', err.message));
  ws.on('close', () => console.log('⚪ 連線關閉'));

  setTimeout(() => ws.close(), 10000);
}

testVt100();

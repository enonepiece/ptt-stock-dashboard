const WebSocket = require('ws');
const iconv = require('iconv-lite');

function testPttWss() {
  console.log('=== 連線至 PTT 官方加密 BBS WebSocket 站點 (wss://ws.ptt.cc/bbs) ===');
  
  const ws = new WebSocket('wss://ws.ptt.cc/bbs', {
    headers: {
      'Origin': 'https://term.ptt.cc',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });

  ws.on('open', () => {
    console.log('🟢 成功連線 PTT 官方 BBS WebSocket (wss://bbs.ptt.cc/bbs)！');
  });

  ws.on('message', data => {
    // 數據可能是 ArrayBuffer 或 Buffer
    let text;
    try {
      text = new TextDecoder('utf-8').decode(data);
    } catch {
      text = iconv.decode(data, 'big5');
    }
    const cleanText = text.replace(/\x1b\[[0-9;]*[mGKH]/g, '');
    console.log('[PTT BBS WSS 數據流]:', cleanText.slice(0, 150).replace(/\n/g, ' '));
  });

  ws.on('error', err => {
    console.error('🔴 PTT WSS Error:', err.message);
  });

  ws.on('close', () => {
    console.log('⚪ PTT WSS 連線已關閉');
  });

  setTimeout(() => ws.close(), 6000);
}

testPttWss();

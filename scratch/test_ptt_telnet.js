const net = require('net');
const iconv = require('iconv-lite');

function testTelnet() {
  console.log('=== 連線至台大 PTT BBS 伺服器 (ptt.cc:23) ===');
  const client = net.createConnection({ host: 'ptt.cc', port: 23 }, () => {
    console.log('🟢 成功建立 PTT BBS TCP Socket 連線！');
  });

  client.on('data', data => {
    // 將 PTT 傳回的 Big5 數據轉譯成中文
    const text = iconv.decode(data, 'big5');
    // 去除 ANSI 顏色控制碼
    const cleanText = text.replace(/\x1b\[[0-9;]*[mGKH]/g, '');
    console.log('[PTT BBS Output]:', cleanText.slice(0, 150).replace(/\n/g, ' '));

    // 自動以 guest 訪客登入或送出 Enter 進入
    if (cleanText.includes('請輸入代號') || cleanText.includes('Guest')) {
      client.write('guest\r\n');
    }
  });

  client.on('error', err => {
    console.error('🔴 PTT Telnet Error:', err.message);
  });

  client.on('close', () => {
    console.log('⚪ PTT Telnet 連線已關閉');
  });

  setTimeout(() => client.destroy(), 5000);
}

testTelnet();

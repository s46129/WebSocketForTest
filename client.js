const os = require('os');

// 定義一個函數來獲取本機的 IPv4 地址
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 忽略 IPv6 和內部地址（127.0.0.1）
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // 如果沒有找到非內部的 IPv4，返回localhost
}

const WebSocket = require('ws');

// 替換為伺服器的IP地址
const serverIP = getLocalIPAddress();
const ws = new WebSocket(`ws://${serverIP}:8080`);
ws.on('open', function open() {
  console.log('Connected to server');
  ws.send('Hello Server! This is a client.');
});

ws.on('message', function incoming(data) {
  console.log('Message from server:', data);
});

ws.on('error', function error(error) {
  console.error('WebSocket error:', error);
});

ws.on('close', function close() {
  console.log('Disconnected from server');
});
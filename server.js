const os = require('os');
const WebSocket = require('ws');

// 定義一個函數來獲取本機的 IPv4 地址
function getLocalIPAddress() {
    // const interfaces = os.networkInterfaces();
    // for (const name of Object.keys(interfaces)) {
    //   for (const iface of interfaces[name]) {
    //     // 忽略 IPv6 和內部地址（127.0.0.1）
    //     if (iface.family === 'IPv4' && !iface.internal) {
    //       return iface.address;
    //     }
    //   }
    // }
    return '127.0.0.1'; // 如果沒有找到非內部的 IPv4，返回localhost
}

const serverIP = getLocalIPAddress();

// 創建 WebSocket 伺服器，綁定到自動獲取的 IP 和端口上
const wss = new WebSocket.Server({ host: serverIP, port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected');
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if (client === ws) {
                client.send('Connect To Server Successfully');
                client.send('PlayerCount:'+wss.clients.size);

            } else if (client !== ws)
                client.send('OnNewPlayerJoin');
        }
    });

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // 廣播訊息給所有已連接的客戶端
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send('' + message);
                console.log('send: %s', message);
            }
        });
    });
});

console.log(`WebSocket server is running on ws://${serverIP}:8080`);

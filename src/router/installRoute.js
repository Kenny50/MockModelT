const routeHosts = require('./routeHost').getHosts();
const { v4: uuidv4 } = require('uuid');
const enableRouteHeartBeat = require('./enableRouteHeartBeat');


/**
 * @param {WebSocket.Server} wss run WebSocket.Server with express
 * 
 * On each connection to this server, check its path, add the routeHost, invalid path connection should be closed.
 * While the connection finish, we have to remove from routeHost manually.
 * 
 * @function heartbeat is made for websocket ping/pong function.
 * @argument interval will sent ping on each 5 seconds, should be clear when @param {WebSocket.Server} wss close
 * 
 * 使用 @param {WebSocket.Server} wss 和 express 運行 WebSocket.Server
 * 每個連線會檢查其路徑 path，添加到對應的 routeHost，無效的路徑 path 會被立刻斷線
 * 當連線結束時，我們會把該連線從 routeHost 移除
 * 
 * 心跳檢測每五秒一次
 */
function installSocket(wss) {
    // heartbeat check is fine
    // 心跳檢測正常
    function heartbeat(ws) {
        ws.isAlive = true;
    }
    // every five second check ws isAlive, if not, force close the connection
    //  每五秒檢查心跳檢測，如果存活狀態是 false，就強制斷線
    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                ws.terminate()
                console.log(`remove ${ws.customId} on ${ws.currentEndPoint} at ${new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'})} in ip address ${ws.clientIp}`);
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 5000);

    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        const path = req.url;
        //find host by path
        //利用 path 去找 host
        if (routeHosts[path]) {
            // install ws connection into host
            // 將 ws 連線加入 host
            routeHosts[path].installRoute(ws);
            ws.customId = uuidv4();
            ws.currentEndPoint = path;
            ws.clientIp = ip;

            enableRouteHeartBeat(ws, heartbeat);
            // an endpoint for checking reconnect function
        } else {
            ws.close();
        }

        ws.on('close', () => {
            Object.values(routeHosts).forEach(routeHost => {
                routeHost.removeClient(ws);
            });
        });
    });

    wss.on('close', function close() {
        clearInterval(interval);
    });
}

module.exports = installSocket;
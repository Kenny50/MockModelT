function enableRouteHeartBeat(ws, heartbeat) {
    //following parameter is for checking which client terminate because heartbeat fail
    //下面的參數是為了檢查哪個客戶端因為心跳失敗斷線
    ws.isAlive = true;

    ws.on('error', (error) => {
        // Handle WebSocket errors
        console.error('WebSocket error:', error);

        // Send error message to the client
        ws.send(JSON.stringify({ error: `An error occurred on the server.\n ${error}` }));
    });
    ws.on('pong', () => {
        heartbeat(ws);
    });
    ws.on('ping', () => {
        heartbeat(ws);
        ws.send('pong')
    });
    // ping-cli for web, since they can not make ping request manually
    // ping-cli 是給網頁用的，因為他們不能打 ping
    ws.on('message', (data) => {
        if (data.toString() === "ping-cli") {
            heartbeat(ws);
        }
    })
}

module.exports = enableRouteHeartBeat;
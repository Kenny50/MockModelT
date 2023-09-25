/**
 * @param {string} path url path
 * @param {function} fun callback function to install default behavior to handle message
 * input should be string, output should be able to sent by ws
 */
class BaseRoute {
    // using baseRoute object to track down connection to certain endpoint, and store in SET
    // 使用 baseRoute 物件來追蹤連接到特定 endpoint 的連線，並將其存在 SET
    #clients = new Set();
    //constructor has two parameter, path is required, it will define websocket endpoint
    // fun is optional, it is the the processer to handle message
    constructor(path, fun) {
        this.path = path;
        this.fun = fun;
    }
    addClient(ws) {
        this.#clients.add(ws);
    }
    removeClient(ws) {
        this.#clients.delete(ws);
    }
    /**
     * @param {string} message 
     * 當 function 有被定義，將其套用在 message
     */
    boradcasting(message) {
        let msg
        if(this.fun && typeof this.fun === 'function'){
            msg = this.fun(message);
        } else {
            msg = message
        }
        // this format is for station to check latency
        // 這個格式是為了檢查 io 延遲時間
        // original version is `client.send(msg)`
        this.#clients.forEach(async(client) => {
            client.send(`{"data":${msg}, "time": ${new Date().getTime()}}`);
        });
    }
    /**
     * 
     * @param {WebSocket} ws WebSocket client connection
     * execute this function add client to route host, install default behavior, and add heartbeat
     */
    installRoute(ws) {
        this.addClient(ws);
    }
    getClient() {
        return new Set(this.#clients);
    }
}

module.exports = BaseRoute;
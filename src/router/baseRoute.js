const { Subject, from, switchMap } = require('rxjs');
/**
 * @param {string} path url path
 * @param {function} fun callback function to install default behavior to handle message
 * input should be string, output should be able to sent by ws
 */
class BaseRoute {
    #messageSubject = new Subject();
    #processedMessages = this.#messageSubject.pipe(
        // Use switchMap with exhaustMap strategy to cancel previous processing
        switchMap((message) => {
            // Check if this.fun is a function before applying it
            if (typeof this.fun === 'function') {
                return from([this.fun(message)]);
            } else {
                // If this.fun is undefined, return the original data
                return from([message]);
            }
        }, undefined, 8) // Set concurrency to 1 to ensure only one function execution at a time
    );
    // using baseRoute object to track down connection to certain endpoint, and store in SET
    // 使用 baseRoute 物件來追蹤連接到特定 endpoint 的連線，並將其存在 SET
    #clients = new Set();
    //constructor has two parameter, path is required, it will define websocket endpoint
    // fun is optional, it is the the processer to handle message
    constructor(path, fun) {
        this.path = path;
        this.fun = fun;
        this.init();
    }
    addClient(ws) {
        ws.binaryType = 'arraybuffer';
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
        if (this.getClient().size === 0) return;
        this.#messageSubject.next(message);
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

    init = () => {
        this.#processedMessages.subscribe((msg) => {
            if (this.path === "/point-cloud") {

                this.#clients.forEach(async (client) => {
                    if (client.bufferedAmount === 0) {
                        client.send(msg, { binary: true });
                        console.log(`pointCloudUrl buffer amount`, client.bufferedAmount)
                    }
                })
            } else {

                this.#clients.forEach(async (client) => {
                    if (client.bufferedAmount === 0) {
                        client.send(`{"data":${msg}, "time": ${new Date().getTime()}}`);
                    }
                });
            }
        });
    };
}

module.exports = BaseRoute;

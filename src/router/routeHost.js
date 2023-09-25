const gnssUpdateRouteHost = require('./hosts/gnss.route')
const objectDetectionRouteHost = require('./hosts/od.route')
const passengerCountRouteHost = require('./hosts/pc.route')
const pointCloudRouteHost = require('./hosts/point.route')
const rearDoorStateRouteHost = require('./hosts/rd.route')
const warningRouteHost = require('./hosts/warning.route')
//add new import here

/**
 * Collect all route host, for simplize code base
 * the #hosts is an object, using key value pair, key is websocket endpoint, value is host itself
 * 
 * #hosts 是一個鍵值對物件，鍵是 websocket endpoint ，值是 host 本身
 */
class RouteHosts{
    #hosts = {};
    addHost(host){
        this.#hosts[host.path] = host;
    }
    addHosts(hosts){
        hosts.forEach( host => {
            this.addHost(host);
        })
    }
    getHosts(){
        return {...this.#hosts};
    }
}

const routeHosts = new RouteHosts()

// add host inheritage from BaseHost
// 添加繼承了 BaseHost 的 host
routeHosts.addHosts([
    gnssUpdateRouteHost,
    objectDetectionRouteHost,
    passengerCountRouteHost,
    pointCloudRouteHost,
    rearDoorStateRouteHost,
    warningRouteHost
    //add new host here
])

module.exports = routeHosts;
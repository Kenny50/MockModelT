const path = require('path');
const express = require('express');
const { WebSocketServer } = require('ws');
const installSocket = require('./router/installRoute')
const PORT = 3000


const gnssUpdateRouteHost = require('./router/hosts/gnss.route')
const objectDetectionRouteHost = require('./router/hosts/od.route')
const passengerCountRouteHost = require('./router/hosts/pc.route')
const pointCloudRouteHost = require('./router/hosts/point.route')
const rearDoorStateRouteHost = require('./router/hosts/rd.route')
const warningRouteHost = require('./router/hosts/warning.route')

const readJsonAndSent = require('./router/readJsonAndSent.js')

const basePath = path.join(__dirname, '..','data'); // Adjust the path as needed

const app = express();
const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})
const wss = new WebSocketServer({
    server,
    clientTracking: true,
    // perMessageDeflate: true
});
installSocket(wss)
const gnssPath = path.join(basePath,'gnss_update');
const odP = path.join(basePath, 'object_detection')
const passengerPath = path.join(basePath, 'passenger_count')
const pointCloudPath = path.join(basePath, 'point_cloud');
const rearDoorPath = path.join(basePath, 'rear_door_state');
const warningPath = path.join(basePath, 'warning');

readJsonAndSent(gnssPath, 80, gnssUpdateRouteHost)
readJsonAndSent(odP, 208, objectDetectionRouteHost)
readJsonAndSent(passengerPath, 1904, passengerCountRouteHost)
readJsonAndSent(pointCloudPath, 880, pointCloudRouteHost)
readJsonAndSent(rearDoorPath, 983, rearDoorStateRouteHost)
readJsonAndSent(warningPath, 657, warningRouteHost)
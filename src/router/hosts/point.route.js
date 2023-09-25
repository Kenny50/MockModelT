const BaseRoute = require('../baseRoute');
const pointCloudUrl = 'point-cloud';

const coordinate2distance = require('../../service/coordinate2distance');
const distance2color = require('../../service/distances2color');

// transfer coordinate to color
function coordinate2vision(message) {
    const coors = JSON.parse(message);
    const distances = coordinate2distance(coors.points).sort((a, b) => b.distance - a.distance);;
    const colors = distance2color(distances);
    return JSON.stringify({ colors: colors })
}
const pointCloudRouteHost = new BaseRoute(pointCloudUrl,coordinate2vision);

module.exports = pointCloudRouteHost;
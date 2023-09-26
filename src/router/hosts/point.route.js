const BaseRoute = require('../baseRoute');
const pointCloudUrl = '/point-cloud';

const coordinate2distance = require('../../service/coordinate2distance');
const distance2color = require('../../service/distances2color');
const { encodeDataPoints } = require('../../service/serialize/coorProtobuf')

// transfer coordinate to color
function coordinate2vision(message) {
    const firstTime = new Date().getTime();

    const isInRange = (item) => {
        return (item.x <= 5 && item.x >= 0 &&
            item.y <= 5 && item.y >= -5 &&
            item.z >= 0 && item.z <= 5);
    };

    const coors = JSON.parse(message).points.filter(isInRange);
    const distances = coordinate2distance(coors).sort((a, b) => b.distance - a.distance);
    const colors = distance2color(distances, 8.66);

    const protobufResult = encodeDataPoints(
        { "data": colors, "time": firstTime }
    )
    const endTime = new Date().getTime();
    console.log('protobuf full time cost:', endTime - firstTime);

    return protobufResult;
}
const pointCloudRouteHost = new BaseRoute(pointCloudUrl,coordinate2vision);

module.exports = pointCloudRouteHost;
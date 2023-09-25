const BaseRoute = require('../baseRoute');
const gnssUpdateUrl = 'gnss-update';
const findNearestIndex = require('../../service/busCoordinates');

const gnssUpdateRouteHost = new BaseRoute(gnssUpdateUrl, findNearestIndex);

module.exports = gnssUpdateRouteHost;
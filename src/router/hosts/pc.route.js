const BaseRoute = require('../baseRoute');
const passengerCountUrl = '/passenger-count';

const passengerCountRouteHost = new BaseRoute(passengerCountUrl);

module.exports = passengerCountRouteHost;
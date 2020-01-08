module.exports = function (server) {
    require('./busRoutes')(server);

    require('./infoRoutes')(server);
    require('./healthRoutes')(server);
    require('./metricsRoutes')(server);
};
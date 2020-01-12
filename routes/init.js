module.exports = function (server) {
    require('./busRoutes')(server);
    require('./graphQLRoutes')(server);

    require('./infoRoutes')(server);
    require('./healthRoutes')(server);
    require('./metricsRoutes')(server);
};
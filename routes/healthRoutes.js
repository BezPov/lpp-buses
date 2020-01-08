const initRoutes = function (server) {
    server.get('/health/live', function (req, res, next) {
        res.json({
            status: 'OK'
        });

        return next();
    });

    server.get('/health/ready', function (req, res, next) {
        res.json({
            status: 'OK'
        });

        return next();
    });
};

module.exports = initRoutes;
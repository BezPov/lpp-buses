const logger = require('../services/logging');

const initRoutes = function (server) {
    server.get('/info', function (req, res, next) {
        res.json({
            name: 'lpp-buses',
            version: process.env.npm_package_version,
            description: 'Api gateway',
            apiCalls: [
                {
                    url: '/stations',
                    description: 'Return all the stations that are in the database',
                    queryParams: {
                        q: 'Search query for station name',
                        skip: 'Amount of skipped stations',
                        limit: 'Amount of stations to display'
                    }
                },
                {
                    url: '/stations/:stationId',
                    description: 'Returns a single station',
                    params: {
                        stationId: 'Id of the station'
                    }
                },
                {
                    url: '/arrivals/:stationId/daily',
                    description: 'Returns all the scheduled daily arrivals at the specified station',
                    params: {
                        stationId: 'Id of the station'
                    }
                },
                {
                    url: '/arrivals/:stationId/live',
                    description: 'Returns live arrivals at the specified station (arrivals are sorted by ETA)',
                    params: {
                        stationId: 'Id of the station'
                    }
                }
            ]
        });

        return next();
    });
};

module.exports = initRoutes;
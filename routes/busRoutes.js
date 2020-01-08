const BusApi = require('../api/bus/busApi');

const initRoutes = function (server) {
    server.get('/', async function (req, res, next) {
        const selector = {};

        const options = {
            skip: 0,
            limit: 20
        };

        if (req.query) {
            if (req.query.q) {
                selector.name = {
                    '$regex': req.query.q,
                    '$options': 'i'
                }
            }

            if (req.query.skip) options.skip = parseInt(req.query.skip);

            if (req.query.limit) options.limit = parseInt(req.query.limit);
        }

        const fetchedBuses = await BusApi.findMany(selector, options);

        res.json({
            success: true,
            skip: options.skip,
            limit: options.limit,
            data: fetchedBuses
        });

        return next();
    });

    server.get('/:busId', async function (req, res, next) {
        const fetchedBus = await BusApi.findOne({busId: req.params.busId});

        res.json({
            success: true,
            data: fetchedBus
        });

        return next();
    });

    server.get('/routes/:busNumber', async function (req, res, next) {
        const fetchedBus = await BusApi.findMany({busNumber: req.params.busNumber});

        res.json({
            success: true,
            data: fetchedBus
        });

        return next();
    });
};

module.exports = initRoutes;
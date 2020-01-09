const BusApi = require('../api/busApi');

const sendMetricToRabbitMQ = require('../services/sendMetricToRabbitMQ');

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

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.post('/', async function (req, res, next) {
        const createdBus = await BusApi.create(req.body);

        if (createdBus) {
            res.json({
                success: true,
                data: createdBus
            });
        } else {
            res.json(500, {
                success: false
            });
        }

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.get('/:busId', async function (req, res, next) {
        const fetchedBus = await BusApi.findOne({busId: req.params.busId});

        if (fetchedBus) {
            res.json({
                success: true,
                data: fetchedBus
            });
        } else {
            res.json(500, {
                success: false,
                message: 'Bus not found'
            });
        }

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.get('/routes/:busNumber', async function (req, res, next) {
        const fetchedBuses = await BusApi.findMany({busNumber: req.params.busNumber});

        if (fetchedBuses) {
            res.json({
                success: true,
                data: fetchedBuses
            });
        } else {
            res.json(500, {
                success: false,
                message: 'Bus routes not found'
            });
        }

        sendMetricToRabbitMQ(req);

        return next();
    });
};

module.exports = initRoutes;
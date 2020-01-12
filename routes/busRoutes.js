const BusApi = require('../api/busApi');
const CircuitBreaker = require('opossum');

const sendMetricToRabbitMQ = require('../services/sendMetricToRabbitMQ');

const breakerOptions = {
    timeout: 10000, // timeout after 10 seconds
    errorThresholdPercentage: 50, // if 50% of requests fails, trip breaker
    resetTimeout: 30000 // renew after 30 seconds
};

const getManyBreaker = new CircuitBreaker(BusApi.findMany, breakerOptions);
const getOneBreaker = new CircuitBreaker(BusApi.findOne, breakerOptions);
const createBreaker = new CircuitBreaker(BusApi.create, breakerOptions);

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

        getManyBreaker.fire(selector, options)
            .then((fetchedBuses) => {
                res.json({
                    success: true,
                    skip: options.skip,
                    limit: options.limit,
                    data: fetchedBuses
                })
            })
            .catch(() => {
                res.json(500, {
                   success: false,
                   message: 'Sorry, service is currently unavailable'
                });
            });

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.post('/', async function (req, res, next) {
        //const createdBus = await BusApi.create(req.body);

        createBreaker.fire(req.body)
            .then((createdBus) => {
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
            })
            .catch((err) => {
                res.json(500, {
                    success: false,
                    message: 'Sorry, service is currently unavailable'
                });
            });

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.get('/:busId', async function (req, res, next) {
        getOneBreaker.fire({busId: req.params.busId})
            .then((fetchedBus) => {
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
            })
            .catch((err) => {
                res.json(500, {
                    success: false,
                    message: 'Sorry, service is currently unavailable'
                });
            });

        sendMetricToRabbitMQ(req);

        return next();
    });

    server.get('/routes/:busNumber', async function (req, res, next) {
        const fetchedBuses = await BusApi.findMany({busNumber: req.params.busNumber});

        const options = {};

        getManyBreaker.fire({busNumber: req.params.busNumber}, options)
            .then((fetchedBuses) => {
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
            })
            .catch((err) => {
                res.json(500, {
                    success: false,
                    message: 'Sorry, service is currently unavailable'
                });
            });

        sendMetricToRabbitMQ(req);

        return next();
    });
};

module.exports = initRoutes;
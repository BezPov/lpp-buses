const axios = require('axios');

const logger = require('../services/logging');

const BusModel = require('../models/Bus');

class BusApi {
    static async findOne(selectorObject) {
        return BusModel.findOne(selectorObject);
    }

    static async findMany(selectorObject, options) {
        let operation = BusModel.find(selectorObject);

        if (options.skip) operation = operation.skip(options.skip);

        if (options.limit) operation = operation.limit(options.limit);

        return operation;
    }

    static async create(data) {
        const bus = {
            busId: data.id,
            busNumber: data.group_name,
            routeId: data.int_id,
            oppositeRouteId: data.opposite_route_int_id,
            name: data.route_name,
            routeLength: data.length,
            stations: data.stations
        };

        const busAlreadyExists = await BusApi.findOne({ busId: bus.busId });

        if (busAlreadyExists) return;

        try {
            const createdBus = await BusModel.create(bus);

            return createdBus;
        } catch (ex) {
            console.log(ex);
        }
    }

    static async update() {

    }

    static async replace() {

    }

    static async remove() {

    }
}

module.exports = BusApi;
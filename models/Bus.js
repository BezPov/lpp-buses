const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: true
    },
    busNumber: String,
    routeId: Number,
    oppositeRouteId: Number,
    name: String,
    routeLength: Number,
    stations: [
        {
            _id: false,
            stationId: String,
            order: Number
        }
    ]
});

module.exports = mongoose.model('Bus', busSchema);
const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({

    nodeId: {
        type: String,
        required: true
    },

    temperature: {
        type: Number,
        required: true
    },

    humidity: {
        type: Number,
        required: true
    },

    pressure: {
        type: Number,
        required: true
    },

    gasResistance: {
        type: Number,
        required: true
    },

    magnetometer: {

        x: Number,
        y: Number,
        z: Number

    },

    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Sensor", sensorSchema);
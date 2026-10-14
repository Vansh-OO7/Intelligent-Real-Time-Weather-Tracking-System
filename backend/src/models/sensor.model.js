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

// Indexes for query performance and memory-safe sorting
sensorSchema.index({ timestamp: -1 });
sensorSchema.index({ nodeId: 1, timestamp: -1 });

module.exports = mongoose.model("Sensor", sensorSchema);
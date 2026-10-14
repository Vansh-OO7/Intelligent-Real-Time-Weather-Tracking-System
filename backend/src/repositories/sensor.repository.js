const Sensor = require("../models/sensor.model");

const createSensorData = async (sensorData) => {
    const savedSensor = await Sensor.create(sensorData);
    return savedSensor;
};

const getLatestSensorData = async () => {
    return await Sensor.findOne().sort({ timestamp: -1 });
};

const getSensorHistory = async (limit = 100) => {
    const query = Sensor.find().sort({ timestamp: -1 });
    if (limit && Number(limit) > 0) {
        query.limit(Math.min(Number(limit), 1000));
    }
    return await query;
};

const getSensorDataByNode = async (nodeId, limit = 100) => {
    const query = Sensor.find({ nodeId }).sort({ timestamp: -1 });
    if (limit && Number(limit) > 0) {
        query.limit(Math.min(Number(limit), 1000));
    }
    return await query;
};

module.exports = {
    createSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
};
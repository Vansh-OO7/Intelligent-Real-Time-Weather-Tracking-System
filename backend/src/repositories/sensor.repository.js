const Sensor = require("../models/sensor.model");

const createSensorData = async (sensorData) => {
    const savedSensor = await Sensor.create(sensorData);
    return savedSensor;
};

const getLatestSensorData = async () => {
    return await Sensor.findOne().sort({ timestamp: -1 });
};

const getSensorHistory = async () => {
    return await Sensor.find().sort({ timestamp: -1 });
};

const getSensorDataByNode = async (nodeId) => {
    return await Sensor.find({ nodeId }).sort({ timestamp: -1 });
};

module.exports = {
    createSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
};
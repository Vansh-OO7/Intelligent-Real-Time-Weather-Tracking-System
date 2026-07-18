const Sensor = require("../models/sensor.model");

const createSensorData = async (sensorData) => {
    const savedSensor = await Sensor.create(sensorData);
    return savedSensor;
};

module.exports = {
    createSensorData,
};
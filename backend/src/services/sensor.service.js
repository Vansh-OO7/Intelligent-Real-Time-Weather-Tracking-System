const sensorRepository = require("../repositories/sensor.repository");

const saveSensorData = async (sensorData) => {

    const savedSensor =
        await sensorRepository.createSensorData(sensorData);

    return savedSensor;
};

const getLatestSensorData = async () => {
    return await sensorRepository.getLatestSensorData();
};

const getSensorHistory = async (limit) => {
    return await sensorRepository.getSensorHistory(limit);
};

const getSensorDataByNode = async (nodeId, limit) => {
    return await sensorRepository.getSensorDataByNode(nodeId, limit);
};

module.exports = {
    saveSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
};
const sensorRepository = require("../repositories/sensor.repository");

const saveSensorData = async (sensorData) => {

    const savedSensor =
        await sensorRepository.createSensorData(sensorData);

    return savedSensor;
};

const getLatestSensorData = async () => {
    return await sensorRepository.getLatestSensorData();
};

const getSensorHistory = async () => {
    return await sensorRepository.getSensorHistory();
};

const getSensorDataByNode = async (nodeId) => {
    return await sensorRepository.getSensorDataByNode(nodeId);
};

module.exports = {
    saveSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
};
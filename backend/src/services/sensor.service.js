const sensorRepository = require("../repositories/sensor.repository");

const saveSensorData = async (sensorData) => {

    const savedSensor =
        await sensorRepository.createSensorData(sensorData);

    return savedSensor;
};

module.exports = {
    saveSensorData,
};
const sensorService = require("../services/sensor.service");

const receiveSensorData = async (req, res) => {
    try {

        const savedSensor = await sensorService.saveSensorData(req.body);

        res.status(201).json({
            success: true,
            message: "Sensor data saved successfully",
            data: savedSensor
        });

    } catch (error) {

        console.error("Error saving sensor data:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save sensor data"
        });

    }
};

module.exports = {
    receiveSensorData
};
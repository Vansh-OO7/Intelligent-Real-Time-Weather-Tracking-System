const sensorService = require("../services/sensor.service");

const receiveSensorData = async (req, res) => {
    try {

        const savedSensor = await sensorService.saveSensorData(req.body);

        const io = req.app.get("io");
        if (io) {
            io.emit("sensorData", savedSensor);
        }

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

const getLatestSensorData = async (req, res) => {
    try {
        const latestSensor = await sensorService.getLatestSensorData();
        if (!latestSensor) {
            return res.status(404).json({
                success: false,
                message: "No sensor data found."
            });
        }
        res.status(200).json({
            success: true,
            data: latestSensor
        });
    } catch (error) {
        console.error("Error getting latest sensor data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get latest sensor data"
        });
    }
};

const getSensorHistory = async (req, res) => {
    try {
        const history = await sensorService.getSensorHistory();
        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error("Error getting sensor history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get sensor history"
        });
    }
};

const getSensorDataByNode = async (req, res) => {
    try {
        const { nodeId } = req.params;
        const data = await sensorService.getSensorDataByNode(nodeId);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sensor data found."
            });
        }
        
        res.status(200).json({
            success: true,
            nodeId,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("Error getting sensor data by node:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get sensor data by node"
        });
    }
};

module.exports = {
    receiveSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
};
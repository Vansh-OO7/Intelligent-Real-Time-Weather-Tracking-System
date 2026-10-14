const sensorService = require("../services/sensor.service");

const receiveSensorData = async (req, res) => {
    try {
        const { nodeId, temperature, humidity, pressure, gasResistance } = req.body || {};

        if (
            !nodeId ||
            temperature === undefined ||
            humidity === undefined ||
            pressure === undefined ||
            gasResistance === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required sensor fields (nodeId, temperature, humidity, pressure, gasResistance)"
            });
        }

        const savedSensor = await sensorService.saveSensorData(req.body);

        const io = req.app.get("io");
        if (io) {
            io.emit("sensorData", {
                ...savedSensor.toObject(),
                serverSentAt: Date.now()
            });
        }

        res.status(201).json({
            success: true,
            message: "Sensor data saved successfully",
            data: savedSensor
        });

    } catch (error) {
        console.error("Error saving sensor data:", error.message || error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation Error: " + error.message
            });
        }

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
        console.error("Error getting latest sensor data:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to get latest sensor data"
        });
    }
};

const getSensorHistory = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const history = await sensorService.getSensorHistory(limit);
        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error("Error getting sensor history:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to get sensor history"
        });
    }
};

const getSensorDataByNode = async (req, res) => {
    try {
        const { nodeId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const data = await sensorService.getSensorDataByNode(nodeId, limit);

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
        console.error("Error getting sensor data by node:", error.message || error);
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
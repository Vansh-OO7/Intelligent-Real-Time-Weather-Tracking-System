const express = require("express");

const router = express.Router();

const { 
    receiveSensorData,
    getLatestSensorData,
    getSensorHistory,
    getSensorDataByNode
} = require("../controllers/sensor.controller");

router.post("/", receiveSensorData);
router.get("/latest", getLatestSensorData);
router.get("/history", getSensorHistory);
router.get("/node/:nodeId", getSensorDataByNode);

module.exports = router;
const express = require("express");

const router = express.Router();

const { receiveSensorData } = require("../controllers/sensor.controller");

router.post("/", receiveSensorData);

module.exports = router;
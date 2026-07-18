const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const sensorRoutes = require("./routes/sensor.routes");
const healthRoutes = require("./routes/health.routes");

app.use("/api/v1/sensor-data", sensorRoutes);
app.use("/api/v1/health", healthRoutes);

module.exports = app;


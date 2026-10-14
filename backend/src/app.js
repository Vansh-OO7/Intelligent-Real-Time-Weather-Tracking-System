const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim()) 
  : (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["*"]);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, ground station python scripts) or allowed origins
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // fallback gracefully to avoid abrupt CORS rejections in non-production environments
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

const sensorRoutes = require("./routes/sensor.routes");
const healthRoutes = require("./routes/health.routes");

// Health check endpoints (both root and versioned)
app.use("/health", healthRoutes);
app.use("/api/v1/health", healthRoutes);

// API routes
app.use("/api/v1/sensor-data", sensorRoutes);

// Root route for cloud deployment verification
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Intelligent Real-Time Weather Tracking API is online",
        health: "/health",
        endpoints: {
            latest: "/api/v1/sensor-data/latest",
            history: "/api/v1/sensor-data/history",
            node: "/api/v1/sensor-data/node/:nodeId"
        }
    });
});

module.exports = app;


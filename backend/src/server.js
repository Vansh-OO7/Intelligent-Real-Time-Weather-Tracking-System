require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./database/mongodb");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim()) 
  : (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["*"]);

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        methods: ["GET", "POST"]
    }
});

// Make io accessible via req.app.get('io') in controllers
app.set("io", io);

io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);
    
    socket.on("disconnect", () => {
        console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
});

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

// Graceful shutdown handling for cloud deployments (Render, Railway, Docker)
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            const mongoose = require("mongoose");
            await mongoose.connection.close();
            console.log("MongoDB connection closed.");
            process.exit(0);
        } catch (err) {
            console.error("Error during closing MongoDB:", err);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error("Forcefully shutting down after timeout.");
        process.exit(1);
    }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
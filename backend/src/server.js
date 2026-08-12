require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./database/mongodb");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // allow frontend to connect
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
    }
};

startServer();
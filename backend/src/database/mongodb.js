const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected database:", mongoose.connection.name);
        console.log("Connected host:", mongoose.connection.host);
        console.log(
            "Sensor count:",
            await mongoose.connection.db
                .collection("sensors")
                .countDocuments()
        );

        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
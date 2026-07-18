const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Weather Tracking Backend is running",
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    getHealth
};
import os

SERIAL_PORT = os.getenv("SERIAL_PORT", "COM3")
BAUD_RATE = int(os.getenv("BAUD_RATE", "115200"))

# Backend ingestion API endpoint (change via env var API_URL for production deployment)
API_URL = os.getenv(
    "API_URL",
    "https://intelligent-real-time-weather-tracking.onrender.com/api/v1/sensor-data"
)

TIMEOUT = int(os.getenv("TIMEOUT", "5"))
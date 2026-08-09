# Intelligent Real-Time Weather Tracking System - Setup Guide

This guide explains how to set up and run the Intelligent Real-Time Weather Tracking System on a local machine.

---

# Prerequisites

Before starting, install the following:

- Git
- Node.js (Latest LTS)
- npm
- Python 3.x
- MongoDB Atlas Account
- VS Code (Recommended)
- Postman

---

# Clone Repository

```bash
git clone https://github.com/Vansh-OO7/Intelligent-Real-Time-Weather-Tracking-System.git

cd Intelligent-Real-Time-Weather-Tracking-System
```

---

# Project Structure

```
Intelligent-Real-Time-Weather-Tracking-System
│
├── backend/
├── frontend/
├── hardware/
│   └── ground_station/
├── docs/
├── README.md
└── SETUP.md
```

---

# Backend Setup

Move into backend.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
```

Start the backend.

```bash
npm run dev
```

Expected Output:

```
Connected to MongoDB Atlas
Server running on port 5000
```

Backend URL

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Python Ground Station Setup

Move into the ground station.

```bash
cd hardware/ground_station
```

Install the required Python dependencies.

```bash
pip install -r requirements.txt
```

Parser Test

```bash
python test_parser.py
```

API Test

```bash
python test_api.py
```

When ESP32 hardware is connected:

```bash
python main.py
```


# MongoDB

Current Database

```
MongoDB Atlas
```

Current Collection

```
sensors
```

---

# Backend API Endpoints

## POST

```
POST /api/v1/sensor-data
```

Stores incoming sensor packets.

---

## GET Latest

```
GET /api/v1/sensor-data/latest
```

Returns the latest sensor reading.

---

## GET History

```
GET /api/v1/sensor-data/history
```

Returns complete sensor history.

---

## GET Node Data

```
GET /api/v1/sensor-data/node/:nodeId
```

Returns all readings for the specified node.

Example

```
GET /api/v1/sensor-data/node/NODE01
```

---

# Frontend Dependencies

- React
- Vite
- Tailwind CSS v4
- shadcn/ui
- React Router DOM
- Axios
- Framer Motion
- Recharts
- Socket.IO Client
- Lucide React

---

# Backend Dependencies

- Express.js
- Mongoose
- dotenv
- CORS
- Nodemon

---

# Python Dependencies

- pyserial
- requests

---

# Development Ports

Backend

```
5000
```

Frontend

```
5173
```

MongoDB

```
MongoDB Atlas (Cloud)
```

---

# Current Project Status

- Backend Completed
- Ground Station Completed
- REST APIs Completed
- MongoDB Integration Completed
- Frontend Setup Completed

---

# Future Work

- React Dashboard
- Real-Time Charts
- Socket.IO Integration
- Machine Learning Analytics
- Weather Forecasting
- AQI Prediction
- Storm Prediction
- Authentication
- Email Notifications
- WhatsApp Notifications
- Deployment
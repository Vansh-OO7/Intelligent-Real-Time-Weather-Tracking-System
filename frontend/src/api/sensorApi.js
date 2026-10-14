import axios from "axios";

// Base URL from environment variable or fallback to localhost
const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const rootApi = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;
const API_URL = `${rootApi}/sensor-data`;

export const getLatestSensorData = async () => {
  const response = await axios.get(`${API_URL}/latest`);
  return response.data;
};

export const getSensorHistory = async (limit = 100) => {
  const response = await axios.get(`${API_URL}/history`, {
    params: { limit }
  });
  return response.data;
};

export const getSensorDataByNode = async (nodeId, limit = 100) => {
  const response = await axios.get(`${API_URL}/node/${nodeId}`, {
    params: { limit }
  });
  return response.data;
};

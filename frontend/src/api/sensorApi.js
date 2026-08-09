import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/sensor-data";

export const getLatestSensorData = async () => {
  const response = await axios.get(`${API_URL}/latest`);
  return response.data;
};

export const getSensorHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data;
};

export const getSensorDataByNode = async (nodeId) => {
  const response = await axios.get(`${API_URL}/node/${nodeId}`);
  return response.data;
};

import { io } from "socket.io-client";

// The backend is running on the same host, port 5000 in dev
// Adjust to VITE_API_URL or environment variable if you have one
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "") 
  : "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

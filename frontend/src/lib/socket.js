import { io } from "socket.io-client";

// The backend origin for Socket.IO
const rawUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = rawUrl
  .replace(/\/+$/, "")
  .replace(/\/api\/v1(\/sensor-data)?$/, "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

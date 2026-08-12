import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { socket } from "../lib/socket";

export default function DashboardLayout() {
  const [selectedNode, setSelectedNode] = useState("NODE01");
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1512]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar title="Dashboard" selectedNode={selectedNode} onNodeSelect={setSelectedNode} isConnected={isConnected} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ selectedNode, setSelectedNode }} />
        </main>
      </div>
    </div>
  );
}

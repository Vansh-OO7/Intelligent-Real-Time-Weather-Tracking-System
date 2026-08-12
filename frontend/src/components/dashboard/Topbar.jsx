import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Wifi, WifiOff, Bell, ChevronDown, User } from "lucide-react";

export default function Topbar({ title = "Dashboard", selectedNode, onNodeSelect, isConnected = false }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-6 bg-[#111918]/80 backdrop-blur-xl border-b border-white/[0.06] flex-shrink-0">
      {/* Page Title */}
      <div className="hidden lg:block">
        <h1 className="text-white font-semibold text-base tracking-tight">{title}</h1>
        <p className="text-white/35 text-xs">Environmental Monitoring System</p>
      </div>

      <div className="hidden lg:block w-px h-7 bg-white/[0.08] mx-1" />

      {/* Node Search */}
      <div className="flex-1 max-w-xs lg:max-w-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
          <input
            id="node-search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search nodes... (Current: ${selectedNode || "NODE01"})`}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/30 transition-all"
          />
          {searchValue && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[#111918] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden z-50">
              {["NODE01", "NODE02", "NODE03"].filter(n => n.toLowerCase().includes(searchValue.toLowerCase())).map((node) => (
                <button
                  key={node}
                  onClick={() => {
                    if (onNodeSelect) onNodeSelect(node);
                    setSearchValue("");
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  {node}
                  <span className="ml-auto text-[10px] text-emerald-400/60 font-medium">Online</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${isConnected
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
      >
        <div className="relative flex items-center">
          {isConnected ? (
            <>
              <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </>
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </div>
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </motion.div>

      {/* Notifications */}
      <button
        id="notifications-btn"
        className="relative p-2.5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#111918]" />
      </button>

      {/* Profile area */}
      <button
        id="profile-btn"
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-all border border-white/[0.06] hover:border-white/[0.12]"
        aria-label="User profile"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-semibold text-white/80 leading-none">Admin</div>
          <div className="text-[10px] text-white/35 leading-none mt-0.5">System User</div>
        </div>
        <ChevronDown className="hidden md:block w-3.5 h-3.5 text-white/30" />
      </button>
    </header>
  );
}

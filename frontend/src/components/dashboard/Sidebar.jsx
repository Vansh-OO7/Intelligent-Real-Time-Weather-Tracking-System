import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  CloudSun,
  BellRing,
  FileText,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Analytics", icon: BarChart3, to: "/dashboard/analytics" },
  { label: "ML / Intelligence", icon: BrainCircuit, to: "/dashboard/ml" },
  { label: "Forecast", icon: CloudSun, to: "/dashboard/forecast" },
  { label: "Alerts", icon: BellRing, to: "/dashboard/alerts" },
  { label: "Reports", icon: FileText, to: "/dashboard/reports" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  { label: "Logout", icon: LogOut, to: "/login" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(to);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-5 py-5 border-b border-white/[0.06] ${collapsed && !isMobile ? "justify-center px-3" : ""
          }`}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence initial={false}>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
                IntelliWeather
              </span>
              <div className="text-emerald-400/70 text-[10px] font-medium tracking-widest uppercase whitespace-nowrap">
                Environmental System
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={`text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-2 ${collapsed && !isMobile ? "text-center" : "px-2"}`}>
          {collapsed && !isMobile ? "·" : "Navigation"}
        </div>
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${collapsed && !isMobile ? "justify-center px-2" : ""
                } ${active
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/55 hover:text-white/90 hover:bg-white/[0.06]"
                }`}
            >
              {active && (
                <motion.div
                  layoutId={isMobile ? "mob-active-pill" : "active-pill"}
                  className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <div className={`relative flex-shrink-0 ${active ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"} transition-colors`}>
                <Icon className="w-4.5 h-4.5" />
                {active && (
                  <div className="absolute inset-0 blur-sm rounded text-emerald-400 opacity-60">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>
              <AnimatePresence initial={false}>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="relative whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip when collapsed */}
              {collapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10">
                  {label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/[0.06] pt-3">
        {bottomItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/85 hover:bg-white/[0.06] transition-all duration-200 ${collapsed && !isMobile ? "justify-center px-2" : ""
              } ${label === "Logout" ? "hover:text-red-400 hover:bg-red-500/10" : ""}`}
          >
            <Icon className={`flex-shrink-0 w-4.5 h-4.5 transition-colors ${label === "Logout" ? "group-hover:text-red-400" : "group-hover:text-white/70"}`} />
            <AnimatePresence initial={false}>
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && !isMobile && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle */}
      {!isMobile && (
        <div className="px-3 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all text-xs"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#141c1a]/90 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:text-white transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full z-50 w-72 bg-[#0f1714] border-r border-white/[0.06]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[#0f1714] border-r border-white/[0.06] overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}

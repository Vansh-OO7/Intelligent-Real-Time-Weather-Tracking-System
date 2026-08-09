import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Leaf,
  Compass,
  Clock,
  Cpu,
  Radio,
  Timer,
  Wifi,
  RefreshCw,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getLatestSensorData } from "../api/sensorApi";

// ─── Mock historical data for chart ───────────────────────────────────────────
const mockChartData = [
  { time: "00:00", temp: 24.2, humidity: 68 },
  { time: "02:00", temp: 23.1, humidity: 70 },
  { time: "04:00", temp: 22.5, humidity: 72 },
  { time: "06:00", temp: 23.8, humidity: 71 },
  { time: "08:00", temp: 25.6, humidity: 69 },
  { time: "10:00", temp: 27.3, humidity: 67 },
  { time: "12:00", temp: 29.1, humidity: 65 },
  { time: "14:00", temp: 29.6, humidity: 71 },
  { time: "16:00", temp: 28.9, humidity: 73 },
  { time: "18:00", temp: 27.4, humidity: 74 },
  { time: "20:00", temp: 26.1, humidity: 72 },
  { time: "22:00", temp: 25.3, humidity: 70 },
];

// ─── Sensor card data mapping helper ─────────────────────────────────────────
const getDynamicCards = (sensorData) => [
  {
    id: "temperature",
    label: "Temperature",
    value: sensorData?.temperature ?? "—",
    unit: "°C",
    icon: Thermometer,
    accent: "emerald",
    gradient: "from-emerald-500/15 to-emerald-500/5",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    borderColor: "border-emerald-500/20",
    status: sensorData ? "Normal" : "Pending",
    statusColor: "text-emerald-400",
    trend: sensorData ? "+1.2°C from avg" : "",
    trendUp: true,
  },
  {
    id: "humidity",
    label: "Humidity",
    value: sensorData?.humidity ?? "—",
    unit: "%",
    icon: Droplets,
    accent: "sky",
    gradient: "from-sky-500/15 to-sky-500/5",
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/15",
    borderColor: "border-sky-500/20",
    status: sensorData ? "Normal" : "Pending",
    statusColor: "text-sky-400",
    trend: sensorData ? "+3% from avg" : "",
    trendUp: true,
  },
  {
    id: "pressure",
    label: "Pressure",
    value: sensorData?.pressure ?? "—",
    unit: "hPa",
    icon: Gauge,
    accent: "violet",
    gradient: "from-violet-500/15 to-violet-500/5",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    borderColor: "border-violet-500/20",
    status: sensorData ? "Stable" : "Pending",
    statusColor: "text-violet-400",
    trend: sensorData ? "−0.4 hPa/hr" : "",
    trendUp: false,
  },
  {
    id: "gas-resistance",
    label: "Gas Resistance",
    value: sensorData?.gasResistance ?? "—",
    unit: "Ω",
    icon: Wind,
    accent: "amber",
    gradient: "from-amber-500/15 to-amber-500/5",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    borderColor: "border-amber-500/20",
    status: sensorData ? "Good" : "Pending",
    statusColor: "text-amber-400",
    trend: sensorData ? "Improving" : "",
    trendUp: true,
  },
  {
    id: "air-quality",
    label: "Air Quality",
    value: "—",
    unit: "AQI",
    icon: Leaf,
    accent: "teal",
    gradient: "from-teal-500/15 to-teal-500/5",
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/15",
    borderColor: "border-teal-500/20",
    status: "Pending",
    statusColor: "text-teal-400/60",
    trend: "Calculating...",
    trendUp: null,
  },
  {
    id: "magnetometer",
    label: "Magnetometer",
    multiValue: true,
    values: [
      { axis: "X", val: sensorData?.magnetometer?.x ?? "—" },
      { axis: "Y", val: sensorData?.magnetometer?.y ?? "—" },
      { axis: "Z", val: sensorData?.magnetometer?.z ?? "—" },
    ],
    unit: "µT",
    icon: Compass,
    accent: "rose",
    gradient: "from-rose-500/15 to-rose-500/5",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/15",
    borderColor: "border-rose-500/20",
    status: sensorData ? "Active" : "Pending",
    statusColor: "text-rose-400",
  },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1714]/95 border border-white/[0.1] rounded-xl p-3 shadow-xl backdrop-blur-sm text-xs">
        <p className="text-white/60 mb-2 font-medium">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-white/70 capitalize">{p.name}:</span>
            <span className="text-white font-semibold">{p.value}{p.name === "temp" ? "°C" : "%"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ─── Sensor Card Component ─────────────────────────────────────────────────────
function SensorCard({ card }) {
  const Icon = card.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 group cursor-default`}
    >
      {/* Subtle corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, rgba(var(--accent-rgb, 16,185,129), 0.08), transparent 70%)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
          <Icon className={`w-5 h-5 ${card.iconColor}`} />
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] ${card.statusColor}`}>
          {card.status}
        </span>
      </div>

      <div className="text-white/50 text-xs font-medium mb-1.5">{card.label}</div>

      {card.multiValue ? (
        <div className="flex items-end gap-3">
          {card.values.map(({ axis, val }) => (
            <div key={axis} className="flex flex-col">
              <span className="text-white/40 text-[10px] mb-0.5">{axis}</span>
              <span className="text-white font-bold text-xl leading-none">{val}</span>
            </div>
          ))}
          <span className="text-white/30 text-xs self-end mb-0.5">{card.unit}</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span className={`font-bold text-3xl leading-none text-white ${card.value === "—" ? "opacity-40" : ""}`}>
            {card.value}
          </span>
          <span className="text-white/40 text-sm font-medium">{card.unit}</span>
        </div>
      )}

      {card.trend && (
        <div className="flex items-center gap-1.5 mt-3">
          {card.trendUp !== null && (
            <TrendingUp className={`w-3 h-3 ${card.trendUp ? card.iconColor : "text-white/30 rotate-180"}`} />
          )}
          <span className="text-white/35 text-[11px]">{card.trend}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await getLatestSensorData();
        if (response.success) {
          setSensorData(response.data);
        } else {
          setError("Failed to fetch latest sensor data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const lastUpdated = sensorData?.timestamp
    ? new Date(sensorData.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const cards = getDynamicCards(sensorData);

  return (
    <div className="p-6 lg:p-8 space-y-8 min-h-full">

      {/* ── Environmental Overview Header ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white text-2xl font-bold tracking-tight">Environmental Overview</h2>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>
          <p className="text-white/40 text-sm">Real-time sensor data from the active node network</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Node Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="relative">
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-none">{sensorData?.nodeId ?? "—"}</div>
              <div className="text-emerald-400 text-[10px] font-medium mt-0.5">{sensorData ? "Online" : "Connecting..."}</div>
            </div>
          </div>

          {/* Last updated */}
          <div className="flex items-center gap-2 text-white/35 text-xs">
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Sensor Cards Grid ─────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
      >
        {cards.map((card) => (
          <SensorCard key={card.id} card={card} />
        ))}
      </motion.div>

      {/* ── Chart Area ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="text-white font-semibold text-base">Historical Trend</h3>
            </div>
            <p className="text-white/35 text-xs">Temperature & Humidity — Last 24 Hours · NODE01</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">24h</button>
            <button className="px-3 py-1 rounded-lg text-xs font-medium text-white/35 hover:text-white/60 hover:bg-white/[0.05] border border-transparent transition-colors">7d</button>
            <button className="px-3 py-1 rounded-lg text-xs font-medium text-white/35 hover:text-white/60 hover:bg-white/[0.05] border border-transparent transition-colors">30d</button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", paddingTop: "12px" }}
              formatter={(val) => val === "temp" ? "Temperature (°C)" : "Humidity (%)"}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981", stroke: "#0d1512", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#humidGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#38bdf8", stroke: "#0d1512", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Node Information Panel ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Cpu className="w-4.5 h-4.5 text-white/50" />
          <h3 className="text-white font-semibold text-base">Node Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Cpu,
              label: "Microcontroller",
              value: "ESP32",
              sub: "Dual-core 240MHz",
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              icon: Radio,
              label: "Radio Module",
              value: "LoRa SX1276",
              sub: "868 / 915 MHz",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              icon: Timer,
              label: "Sampling Interval",
              value: "60 s",
              sub: "Continuous mode",
              color: "text-sky-400",
              bg: "bg-sky-500/10",
            },
            {
              icon: Wifi,
              label: "Connection Status",
              value: "Online",
              sub: "Signal: −87 dBm",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors group">
              <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-white/40 text-[10px] font-medium uppercase tracking-wide mb-1 truncate">{label}</div>
                <div className="text-white font-semibold text-sm">{value}</div>
                <div className="text-white/30 text-[11px] mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

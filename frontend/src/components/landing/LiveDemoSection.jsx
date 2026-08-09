import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, CloudFog, Zap } from "lucide-react";

export default function LiveDemoSection() {
  const mockData = [
    { label: "Temperature", value: "29.6", unit: "°C", icon: Thermometer, color: "text-orange-500" },
    { label: "Humidity", value: "71", unit: "%", icon: Droplets, color: "text-blue-500" },
    { label: "Pressure", value: "1007.3", unit: "hPa", icon: Wind, color: "text-teal-500" },
    { label: "AQI", value: "Pending", unit: "", icon: CloudFog, color: "text-gray-400" },
    { label: "Gas Resistance", value: "18230", unit: "Ω", icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <section id="live-demo" className="py-24 bg-background relative border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Live Station Data</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real-time telemetry from our deployed sensor nodes. Data updates automatically when the ground station receives new packets.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient glow in the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">NODE01 (ESP32)</h3>
                  <p className="text-sm text-muted-foreground">Connected via LoRa (433MHz)</p>
                </div>
              </div>
              <div className="text-sm font-medium bg-secondary px-3 py-1.5 rounded-full text-foreground/80">
                Last updated: Just now
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {mockData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background/50 border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/30 transition-colors"
                >
                  <item.icon className={`w-8 h-8 mb-4 ${item.color}`} />
                  <p className="text-sm text-muted-foreground mb-2 font-medium">{item.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{item.value}</span>
                    {item.unit && <span className="text-sm text-muted-foreground">{item.unit}</span>}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border/50 flex justify-center">
              <p className="text-sm text-muted-foreground italic">
                * Note: This is a structural demonstration. Live API connection pending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

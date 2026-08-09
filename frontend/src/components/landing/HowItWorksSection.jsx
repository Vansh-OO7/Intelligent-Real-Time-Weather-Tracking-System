import { motion } from "framer-motion";
import { Cpu, Radio, Server, Database, LineChart, Brain } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    { title: "Sensors & Edge", icon: Cpu, desc: "ESP32 nodes collect local telemetry." },
    { title: "LoRa Transmission", icon: Radio, desc: "Long-range RF communication." },
    { title: "Ground Station", icon: Server, desc: "Python script receives & validates packets." },
    { title: "Cloud Backend", icon: Database, desc: "Node.js API ingests to MongoDB." },
    { title: "Dashboard", icon: LineChart, desc: "React UI displays real-time updates via WebSockets." },
    { title: "Intelligence", icon: Brain, desc: "ML models analyze historical patterns." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">System Architecture</h2>
          <p className="text-muted-foreground text-lg">
            From physical sensors to intelligent insights, discover how data flows through our ecosystem.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative group"
              >
                <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-lg flex items-center justify-center mb-4 group-hover:border-primary group-hover:text-primary transition-colors">
                  <step.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-border my-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

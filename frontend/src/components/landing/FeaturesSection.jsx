import { motion } from "framer-motion";
import { Activity, Database, Brain, CloudFog, CloudLightning, CloudRain, BellRing, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Continuous environmental telemetry ingested from edge sensors with sub-second latency.",
      icon: Activity,
    },
    {
      title: "Historical Analytics",
      description: "Deep dive into historical data trends with advanced visualization and querying capabilities.",
      icon: Database,
    },
    {
      title: "Environmental Intelligence",
      description: "Turn raw data into actionable insights to understand complex environmental changes.",
      icon: Brain,
    },
    {
      title: "AQI Analysis",
      description: "Detailed Air Quality Index tracking and particle concentration monitoring.",
      icon: CloudFog,
    },
    {
      title: "Weather Forecasting",
      description: "Short and long-term environmental forecasting based on local sensor data.",
      icon: CloudLightning,
    },
    {
      title: "Precipitation Prediction",
      description: "Advanced algorithms to predict rain probability based on barometric pressure and humidity trends.",
      icon: CloudRain,
    },
    {
      title: "Smart Alerts",
      description: "Configurable threshold-based notifications for critical environmental conditions.",
      icon: BellRing,
    },
    {
      title: "Enterprise Security",
      description: "Secure data transmission, encrypted storage, and role-based access control.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Platform Capabilities</h2>
          <p className="text-muted-foreground text-lg">
            A comprehensive suite of tools designed for serious environmental tracking, analytics, and intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

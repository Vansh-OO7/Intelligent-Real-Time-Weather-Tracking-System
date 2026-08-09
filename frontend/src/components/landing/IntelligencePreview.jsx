import { motion } from "framer-motion";
import { Sparkles, TrendingUp, CloudRain, ShieldAlert } from "lucide-react";

export default function IntelligencePreview() {
  const previews = [
    {
      title: "Temperature Trend Detected",
      value: "Anomaly detected in sensor network. Unusually rapid temperature drop.",
      icon: TrendingUp,
      status: "Active",
      color: "text-blue-500",
    },
    {
      title: "Rain Probability Model",
      value: "Coming Soon - Integration with local radar data pending.",
      icon: CloudRain,
      status: "In Development",
      color: "text-muted-foreground",
    },
    {
      title: "Storm Risk Assessment",
      value: "Coming Soon - Based on historical pressure drops and wind data.",
      icon: ShieldAlert,
      status: "Planned",
      color: "text-muted-foreground",
    },
  ];

  return (
    <section id="intelligence" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Beyond Monitoring. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  True Intelligence.
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We are building the future of environmental analytics. Our platform goes beyond simply displaying data, using advanced algorithms to detect patterns, predict changes, and provide actionable intelligence.
              </p>
              
              <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-lg border border-border">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Machine Learning capabilities coming in v2.0</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full space-y-4">
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl bg-secondary ${preview.color}`}>
                  <preview.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold">{preview.title}</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {preview.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{preview.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

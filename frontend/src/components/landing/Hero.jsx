import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  // Placeholder for future background image rotation logic
  // const images = ["/src/assets/hero/bg1.webp", "/src/assets/hero/bg2.webp"];
  // const [currentImage, setCurrentImage] = useState(0);

  const scrollToDemo = (e) => {
    e.preventDefault();
    document.querySelector("#live-demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Layer with Dark Overlay & Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/50 z-10" />
        {/* Replace with actual image later */}
        <div className="absolute inset-0 bg-secondary/20" />
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] z-0 pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6 inline-flex rounded-full bg-secondary/50 border border-border px-3 py-1.5 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            LIVE ENVIRONMENTAL MONITORING
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-8"
          >
            Understand the Environment.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              In Real Time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Monitor environmental conditions, analyze historical trends, and turn real-time sensor data into intelligent insights with our advanced IoT platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] text-lg"
            >
              Explore Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#live-demo"
              onClick={scrollToDemo}
              className="inline-flex items-center justify-center gap-2 bg-secondary/50 backdrop-blur-sm border border-border text-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all text-lg"
            >
              <Activity className="w-5 h-5 text-primary" />
              View Live Demo
            </a>
          </motion.div>
        </div>
      </div>

      {/* Optional decorative bottom border gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent z-20" />
    </section>
  );
}

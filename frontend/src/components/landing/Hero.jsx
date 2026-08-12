import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Thermometer, Droplets, Radio } from "lucide-react";
import { Link } from "react-router-dom";

// Image list - change these filenames when real images are placed in src/assets/hero/
const heroImages = [
  "/src/assets/hero/hero-3.5.png",
  "/src/assets/hero/hero-4.png",
  "/src/assets/hero/hero-1.avif",
  "/src/assets/hero/hero-2.avif",
  "/src/assets/hero/hero-3.webp",

];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const scrollToDemo = (e) => {
    e.preventDefault();
    document.querySelector("#live-demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-white text-slate-900">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* LEFT: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-6 inline-flex rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 tracking-wide uppercase shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Live Environmental Monitoring
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6"
            >
              Understand the <br className="hidden md:block" />
              Environment. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                In Real Time.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed"
            >
              IntelliWeather monitors real-time environmental conditions using distributed IoT sensor nodes. Turn raw data into actionable insights instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 text-lg w-full sm:w-auto"
              >
                Explore Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#live-demo"
                onClick={scrollToDemo}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all text-lg w-full sm:w-auto shadow-sm"
              >
                <Activity className="w-5 h-5 text-blue-600" />
                View Live Demo
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Floating Image / Dashboard Preview */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[600px] h-full max-h-[500px]"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Image Container with strict clipping for borders */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-slate-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] bg-slate-100">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 1 },
                      scale: { duration: 6, ease: "linear" },
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Render standard img tag. Handled fallback for missing image gracefully */}
                    <img
                      src={heroImages[currentImageIndex]}
                      alt="Environmental monitoring"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-slate-200', 'flex', 'items-center', 'justify-center');
                        e.target.parentElement.innerHTML = `<span class="text-slate-400 font-medium text-sm">Image Placeholder: ${heroImages[currentImageIndex].split('/').pop()}</span>`;
                      }}
                    />
                    {/* Inner subtle shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/60">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? "w-6 bg-blue-600" : "bg-slate-400 hover:bg-slate-600"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-8 -right-4 md:-right-8 bg-white/90 backdrop-blur-lg border border-slate-200 p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    NODE01 • ONLINE
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-24 -left-4 md:-left-8 bg-white/90 backdrop-blur-lg border border-slate-200 p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20"
              >
                <div className="flex flex-col gap-1 pr-4 border-r border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold">TEMP</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">29.6°C</span>
                </div>
                <div className="flex flex-col gap-1 pl-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold">HUMIDITY</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">71%</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

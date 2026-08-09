import { Terminal, Mail, Globe } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-secondary/20 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">About The Project</h2>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            The Intelligent Real-Time Weather Tracking System is an open-source initiative designed to provide high-quality environmental telemetry and analytics. Built with modern web technologies, IoT hardware, and designed for scalability.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border hover:border-primary/50 transition-colors"
            >
              <Terminal className="w-5 h-5" />
              <span className="font-medium">GitHub Repository</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border hover:border-primary/50 transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Documentation</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border hover:border-primary/50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact Team</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

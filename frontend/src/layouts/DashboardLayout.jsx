import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">WeatherTrack</h2>
        </div>
        <nav className="px-4 space-y-2">
          <div className="px-3 py-2 text-sm text-muted-foreground rounded-md bg-secondary/50">Dashboard</div>
          <div className="px-3 py-2 text-sm text-muted-foreground">Analytics</div>
          <div className="px-3 py-2 text-sm text-muted-foreground">Alerts</div>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

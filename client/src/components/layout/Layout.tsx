import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Film, PlusCircle, Settings, Camera } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { label: "Bundles", icon: LayoutDashboard, href: "/" },
    { label: "All Rolls", icon: Film, href: "/rolls" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
          <Camera size={20} strokeWidth={2.5} />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-sidebar-foreground">
          AnalogDB
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer group",
                location === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <item.icon size={18} className={cn(location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground cursor-not-allowed opacity-50">
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-grain">
        <div className="max-w-6xl mx-auto z-content">
          {children}
        </div>
      </main>
    </div>
  );
}

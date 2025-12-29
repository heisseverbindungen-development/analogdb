import { Link, useLocation } from "wouter";
import { Film, Home, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/inventory", label: "Inventory", icon: Film },
    { href: "/cameras", label: "Logbook", icon: Camera },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight font-heading text-primary">
            Analog<span className="text-foreground">DB</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">
            Film Inventory v1.1
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-card/50 p-3 rounded-md border border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold font-heading">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium truncate">John Doe</p>
                <p className="text-[10px] text-muted-foreground truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background bg-grain relative">
        <div className="z-content min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
}

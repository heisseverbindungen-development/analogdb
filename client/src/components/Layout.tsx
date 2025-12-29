import { Link, useLocation } from "wouter";
import { Film, Home, Camera, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Erfolgreich abgemeldet");
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/inventory", label: "Inventory", icon: Film },
    { href: "/cameras", label: "Logbook", icon: Camera },
  ];

  const NavContent = () => (
    <>
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
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
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

      <div className="p-4 border-t border-sidebar-border mt-auto space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </Button>
        <div className="bg-card/50 p-3 rounded-md border border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold font-heading">
              AF
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">Film Enthusiast</p>
              <p className="text-[10px] text-muted-foreground truncate">Geschützt</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar h-16 shrink-0">
        <div className="flex items-center gap-2">
           <h1 className="text-lg font-bold tracking-tight font-heading text-primary">
            Analog<span className="text-foreground">DB</span>
          </h1>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border flex flex-col">
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-sidebar-border bg-sidebar flex-col shrink-0">
        <NavContent />
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

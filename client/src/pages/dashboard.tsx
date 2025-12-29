import Layout from "@/components/Layout";
import BundleCard from "@/components/BundleCard";
import FilmRollCard from "@/components/FilmRollCard";
import { useFilm } from "@/lib/film-context";
import { Film, Archive, AlertTriangle } from "lucide-react";
import { isPast, parseISO } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { bundles, rolls } = useFilm();

  // Stats
  const totalRolls = rolls.length;
  const expiredRolls = rolls.filter(r => r.expiry_date && isPast(parseISO(r.expiry_date))).length;
  
  // Recent rolls (just last 5 added for now)
  const recentRolls = [...rolls].reverse().slice(0, 5);

  return (
    <Layout>
      <div className="p-8 space-y-10 max-w-7xl mx-auto">
        
        {/* Header & Stats */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <h2 className="text-3xl font-heading font-bold text-foreground">Dashboard</h2>
               <p className="text-muted-foreground mt-1">Overview of your analog archives.</p>
             </div>
             <div className="flex gap-4">
               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px]">
                 <div className="p-2 bg-primary/10 rounded-md text-primary">
                   <Film className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Rolls</p>
                   <p className="text-2xl font-mono font-bold">{totalRolls}</p>
                 </div>
               </div>

               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px]">
                 <div className="p-2 bg-sidebar-accent rounded-md text-foreground">
                   <Archive className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bundles</p>
                   <p className="text-2xl font-mono font-bold">{bundles.length}</p>
                 </div>
               </div>

               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px]">
                 <div className="p-2 bg-destructive/10 rounded-md text-destructive">
                   <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Expired</p>
                   <p className="text-2xl font-mono font-bold">{expiredRolls}</p>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Bundles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
              Film Bundles
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-muted-foreground rounded-full inline-block"></span>
              Recent Additions
            </h3>
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All
              </Button>
            </Link>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4">
              {recentRolls.map(roll => (
                <div key={roll.id} className="w-[280px] shrink-0">
                  <FilmRollCard roll={roll} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

      </div>
    </Layout>
  );
}

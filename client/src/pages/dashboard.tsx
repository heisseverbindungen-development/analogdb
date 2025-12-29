import Layout from "@/components/Layout";
import FilmRollCard from "@/components/FilmRollCard";
import { useFilm } from "@/lib/film-context";
import { Film, AlertTriangle, Layers, Camera, CheckCircle2 } from "lucide-react";
import { isPast, parseISO } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { rolls, logs } = useFilm();

  // Stats
  const totalRolls = rolls.reduce((acc, roll) => acc + roll.quantity, 0);
  const expiredRolls = rolls.filter(r => r.expiry_date && isPast(parseISO(r.expiry_date))).length;
  const uniqueStocks = rolls.length;
  
  // Active Rolls (In Camera)
  const activeRolls = logs.filter(log => log.dateFinished === null);

  // Recent rolls (just last 5 added for now)
  const recentRolls = [...rolls].reverse().slice(0, 5);

  // Chart Data
  const rollsByManufacturer = rolls.reduce((acc, roll) => {
    acc[roll.manufacturer] = (acc[roll.manufacturer] || 0) + roll.quantity;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(rollsByManufacturer).map(([name, value]) => ({
    name,
    value,
  }));

  // Sort by value desc
  chartData.sort((a, b) => b.value - a.value);

  const getBarColor = (name: string) => {
     switch (name.toLowerCase()) {
      case 'kodak': return 'hsl(45, 100%, 50%)'; // Primary
      case 'fujifilm': return 'hsl(142, 71%, 45%)'; // Greenish
      case 'ilford': return 'hsl(0, 0%, 80%)'; // White/Grey
      case 'cinestill': return 'hsl(0, 85%, 60%)'; // Red
      default: return 'hsl(240, 4%, 40%)'; // Muted
    }
  };

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
          </div>
          
          <div className="flex gap-4 flex-wrap">
               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px] flex-1">
                 <div className="p-2 bg-primary/10 rounded-md text-primary">
                   <Film className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Rolls</p>
                   <p className="text-2xl font-mono font-bold">{totalRolls}</p>
                 </div>
               </div>

               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px] flex-1">
                 <div className="p-2 bg-sidebar-accent rounded-md text-foreground">
                   <Layers className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unique Stocks</p>
                   <p className="text-2xl font-mono font-bold">{uniqueStocks}</p>
                 </div>
               </div>
               
               <Link href="/cameras">
                 <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px] flex-1 cursor-pointer hover:border-primary/50 transition-colors group">
                   <div className="p-2 bg-blue-500/10 rounded-md text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     <Camera className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider group-hover:text-blue-500 transition-colors">Cameras Loaded</p>
                     <p className="text-2xl font-mono font-bold">{activeRolls.length}</p>
                   </div>
                 </div>
               </Link>

               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px] flex-1">
                 <div className="p-2 bg-destructive/10 rounded-md text-destructive">
                   <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Expired Stocks</p>
                   <p className="text-2xl font-mono font-bold">{expiredRolls}</p>
                 </div>
               </div>
             </div>
        </section>

        {/* Chart */}
        <section className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-heading font-semibold">Inventory by Manufacturer</h3>
            <p className="text-sm text-muted-foreground">Total quantity of rolls per brand.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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

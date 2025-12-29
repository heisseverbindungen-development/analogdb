import Layout from "@/components/Layout";
import FilmRollCard from "@/components/FilmRollCard";
import { useFilm } from "@/lib/film-context";
import { Film, AlertTriangle, Layers, Camera, CheckCircle2, Search } from "lucide-react";
import { isPast, parseISO } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UseRollDialog from "@/components/UseRollDialog";
import { toast } from "sonner";

export default function Dashboard() {
  const { rolls, logs, useRoll } = useFilm();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedRollForUse, setSelectedRollForUse] = useState<{id: string, name: string} | null>(null);

  // Quick Load Logic
  const handleQuickUseSelect = (id: string, name: string) => {
    setSelectedRollForUse({ id, name });
    setOpenCombobox(false);
  };

  const handleQuickUseConfirm = async (camera: string, notes: string) => {
    if (selectedRollForUse) {
      await useRoll(selectedRollForUse.id, camera, notes);
      toast.success(`Loaded ${selectedRollForUse.name}`, {
        description: camera ? `Into ${camera}` : "Marked as in use",
        icon: <Camera className="w-4 h-4 text-primary" />,
      });
      setSelectedRollForUse(null);
    }
  };

  // Stats
  const totalRolls = rolls.reduce((acc, roll) => acc + roll.quantity, 0);
  const expiredRolls = rolls.filter(r => r.expiry_date && isPast(parseISO(r.expiry_date))).length;
  const uniqueStocks = rolls.length;
  
  // Active Rolls (In Camera)
  const activeRolls = logs.filter(log => log.dateFinished === null);

  // Recent rolls (just last 5 added for now)
  const recentRolls = [...rolls].reverse().slice(0, 5);

  // Chart Data by Type
  const rollsByType = rolls.reduce((acc, roll) => {
    const typeLabel = roll.film_type === 'color_negative' ? 'Color Negative' 
                    : roll.film_type === 'black_white' ? 'Black & White'
                    : roll.film_type === 'color_slide' ? 'Slide (E-6)'
                    : 'Other';
    acc[typeLabel] = (acc[typeLabel] || 0) + roll.quantity;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(rollsByType).map(([name, value]) => ({
    name,
    value,
  }));

  // Sort by value desc
  chartData.sort((a, b) => b.value - a.value);

  const getBarColor = (name: string) => {
     switch (name) {
      case 'Color Negative': return 'hsl(45, 100%, 50%)'; // Yellow/Orange
      case 'Black & White': return 'hsl(0, 0%, 20%)'; // Black/Dark Grey
      case 'Slide (E-6)': return 'hsl(0, 85%, 60%)'; // Red
      default: return 'hsl(240, 4%, 40%)'; // Muted
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto">
        
        {/* Header & Stats */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <h2 className="text-3xl font-heading font-bold text-foreground">Dashboard</h2>
               <p className="text-muted-foreground mt-1">Overview of your analog archives.</p>
             </div>

             <div className="flex flex-col items-end gap-2">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="default" 
                      role="combobox" 
                      aria-expanded={openCombobox}
                      className="w-full md:w-[280px] justify-between bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Quick Load Camera...
                      </span>
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search inventory..." />
                      <CommandList>
                        <CommandEmpty>No film found.</CommandEmpty>
                        <CommandGroup heading="Available Stock">
                          {rolls
                            .filter(r => r.quantity > 0)
                            .map((roll) => (
                              <CommandItem
                                key={roll.id}
                                onSelect={() => handleQuickUseSelect(roll.id, roll.name)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{roll.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{roll.manufacturer} • {roll.film_size}</span>
                                  </div>
                                  <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">x{roll.quantity}</span>
                                </div>
                              </CommandItem>
                          ))}
                        </CommandGroup>
                        {rolls.filter(r => r.quantity === 0).length > 0 && (
                           <>
                            <CommandSeparator />
                            <CommandGroup heading="Out of Stock">
                               {rolls
                                .filter(r => r.quantity === 0)
                                .map((roll) => (
                                  <CommandItem key={roll.id} disabled className="opacity-50">
                                     <div className="flex items-center justify-between w-full">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{roll.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">{roll.manufacturer} • {roll.film_size}</span>
                                      </div>
                                      <span className="text-xs font-mono bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">x0</span>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                           </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
            <h3 className="text-xl font-heading font-semibold">Inventory by Film Type</h3>
            <p className="text-sm text-muted-foreground">Total quantity of rolls per type (Color, B&W, Slide).</p>
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

        <UseRollDialog 
          open={!!selectedRollForUse} 
          onOpenChange={(open) => !open && setSelectedRollForUse(null)} 
          onConfirm={handleQuickUseConfirm}
          filmName={selectedRollForUse?.name || ""}
        />

      </div>
    </Layout>
  );
}

import Layout from "@/components/Layout";
import FilmRollCard from "@/components/FilmRollCard";
import { useFilm } from "@/lib/film-context";
import { Film, AlertTriangle, Layers, Search, Camera, History, CheckCircle2, Clock } from "lucide-react";
import { isPast, parseISO, formatDistanceToNow } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import UseRollDialog from "@/components/UseRollDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { rolls, logs, useRoll, finishRoll } = useFilm();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedRollForUse, setSelectedRollForUse] = useState<{id: string, name: string} | null>(null);

  // Stats
  const totalRolls = rolls.reduce((acc, roll) => acc + roll.quantity, 0);
  const expiredRolls = rolls.filter(r => r.expiry_date && isPast(parseISO(r.expiry_date))).length;
  const uniqueStocks = rolls.length;
  
  // Active Rolls (In Camera)
  const activeRolls = logs.filter(log => log.dateFinished === null);
  const finishedRolls = logs.filter(log => log.dateFinished !== null);

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

  const handleQuickUseSelect = (id: string, name: string) => {
    setSelectedRollForUse({ id, name });
    setOpenCombobox(false);
  };

  const handleQuickUseConfirm = (camera: string, notes: string) => {
    if (selectedRollForUse) {
      useRoll(selectedRollForUse.id, camera, notes);
      toast.success(`Loaded ${selectedRollForUse.name}`, {
        description: camera ? `Into ${camera}` : "Marked as in use",
        icon: <Camera className="w-4 h-4 text-primary" />,
      });
      setSelectedRollForUse(null);
    }
  };

  const handleFinishRoll = (logId: string, filmName: string) => {
    finishRoll(logId);
    toast.success(`Finished ${filmName}`, {
      description: "Moved to history log.",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    });
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
             
             {/* Quick Actions */}
             <div className="flex flex-col items-end gap-2">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      role="combobox" 
                      aria-expanded={openCombobox}
                      className="w-[280px] justify-between text-muted-foreground hover:text-foreground border-dashed border-2 hover:border-primary/50"
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
               
               <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm min-w-[140px] flex-1">
                 <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                   <Camera className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Loaded</p>
                   <p className="text-2xl font-mono font-bold">{activeRolls.length}</p>
                 </div>
               </div>

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

        {/* Currently Loaded */}
        {activeRolls.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                Currently Loaded
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRolls.map(log => (
                <Card key={log.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{log.manufacturer}</p>
                        <h4 className="font-heading font-semibold text-lg">{log.filmName}</h4>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">{log.film_size}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-2 text-sm mb-2">
                       <Camera className="w-4 h-4 text-primary" />
                       <span className="font-medium">{log.camera || "Unknown Camera"}</span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-muted-foreground italic mb-3">"{log.notes}"</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {formatDistanceToNow(parseISO(log.dateLoaded), { addSuffix: true })}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleFinishRoll(log.id, log.filmName)}>
                        Finish Roll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart */}
           <section className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
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

          {/* History Log */}
          <section className="lg:col-span-1">
             <div className="mb-4">
               <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
                 <History className="w-5 h-5 text-muted-foreground" />
                 History
               </h3>
             </div>
             <Card className="h-[380px]">
               <ScrollArea className="h-full">
                 <div className="p-4 space-y-4">
                   {finishedRolls.length === 0 ? (
                     <p className="text-center text-muted-foreground text-sm py-8">No history yet.</p>
                   ) : (
                     finishedRolls.map(log => (
                       <div key={log.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                         <div className="flex justify-between items-start mb-1">
                           <p className="font-medium text-sm">{log.filmName}</p>
                           <span className="text-[10px] text-muted-foreground">
                             {log.dateFinished && formatDistanceToNow(parseISO(log.dateFinished), { addSuffix: true })}
                           </span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <Camera className="w-3 h-3" />
                           <span>{log.camera || "Unknown"}</span>
                           <span>•</span>
                           <span>ISO {log.iso}</span>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </ScrollArea>
             </Card>
          </section>
        </div>

      </div>

      <UseRollDialog 
        open={!!selectedRollForUse} 
        onOpenChange={(open) => !open && setSelectedRollForUse(null)} 
        onConfirm={handleQuickUseConfirm}
        filmName={selectedRollForUse?.name || ""}
      />
    </Layout>
  );
}

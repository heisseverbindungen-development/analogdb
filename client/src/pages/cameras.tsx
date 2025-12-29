import Layout from "@/components/Layout";
import { useFilm } from "@/lib/film-context";
import { Camera, Search, CheckCircle2, Clock, History } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { toast } from "sonner";
import UseRollDialog from "@/components/UseRollDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Cameras() {
  const { rolls, logs, useRoll, finishRoll } = useFilm();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedRollForUse, setSelectedRollForUse] = useState<{id: string, name: string} | null>(null);

  // Active Rolls (In Camera)
  const activeRolls = logs.filter(log => log.dateFinished === null);
  const finishedRolls = logs.filter(log => log.dateFinished !== null);

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
      <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Logbook</h2>
            <p className="text-muted-foreground mt-1">Track film in your cameras and your shooting history.</p>
          </div>
          
           <div className="flex flex-col items-end gap-2">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="default" 
                      role="combobox" 
                      aria-expanded={openCombobox}
                      className="w-[280px] justify-between bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Currently Loaded */}
            <section className="lg:col-span-2 space-y-4">
               <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                Currently In Cameras
               </h3>
               
               {activeRolls.length === 0 ? (
                 <div className="bg-card border border-border border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No cameras loaded</p>
                    <p className="text-sm">Use "Quick Load Camera" to start shooting.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
               )}
            </section>

             {/* History Log */}
            <section className="lg:col-span-1">
               <div className="mb-4">
                 <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
                   <History className="w-5 h-5 text-muted-foreground" />
                   Usage History
                 </h3>
               </div>
               <Card className="h-[calc(100vh-250px)] min-h-[400px]">
                 <ScrollArea className="h-full">
                   <div className="p-4 space-y-4">
                     {finishedRolls.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                          <History className="w-8 h-8 mb-2 opacity-20" />
                          <p>No history yet.</p>
                       </div>
                     ) : (
                       finishedRolls.map(log => (
                         <div key={log.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                           <div className="flex justify-between items-start mb-1">
                             <p className="font-medium text-sm text-foreground">{log.filmName}</p>
                             <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                               {log.dateFinished && formatDistanceToNow(parseISO(log.dateFinished), { addSuffix: true })}
                             </span>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                             <Camera className="w-3 h-3" />
                             <span className="font-medium text-foreground/80">{log.camera || "Unknown"}</span>
                           </div>
                           <div className="flex gap-2 text-[10px] text-muted-foreground">
                              <span className="bg-muted px-1.5 rounded">{log.manufacturer}</span>
                              <span className="bg-muted px-1.5 rounded">{log.film_size}</span>
                              <span className="bg-muted px-1.5 rounded">ISO {log.iso}</span>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                 </ScrollArea>
               </Card>
            </section>
        </div>

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

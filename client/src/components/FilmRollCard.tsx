import { FilmRoll } from "@/shared/types";
import { format, parseISO, isPast } from "date-fns";
import { Calendar, Droplets, Hash, AlertTriangle, Edit2, Trash2, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFilm } from "@/lib/film-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface FilmRollCardProps {
  roll: FilmRoll;
  onEdit?: (roll: FilmRoll) => void;
}

export default function FilmRollCard({ roll, onEdit }: FilmRollCardProps) {
  const { deleteRoll, useRoll } = useFilm();
  const [isDeleting, setIsDeleting] = useState(false);

  const isExpired = roll.expiry_date ? isPast(parseISO(roll.expiry_date)) : false;
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this roll?")) {
      deleteRoll(roll.id);
    }
  };

  const handleUse = () => {
    if (roll.quantity <= 0) return;
    useRoll(roll.id);
  };

  const getManufacturerColor = (m: string) => {
    switch (m.toLowerCase()) {
      case 'kodak': return 'text-yellow-500';
      case 'fujifilm': return 'text-green-500';
      case 'ilford': return 'text-orange-500'; 
      case 'cinestill': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden bg-black/20">
        {roll.image_url ? (
          <img 
            src={roll.image_url} 
            alt={roll.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="opacity-20 font-bold text-4xl">{roll.quantity}x</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-none font-mono text-xs">
            {roll.film_size}
          </Badge>
          <Badge variant="outline" className={cn("backdrop-blur-md bg-black/50 border-white/10 text-white font-mono text-xs font-bold", getManufacturerColor(roll.manufacturer))}>
            ISO {roll.iso_recommended}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
            <Badge className={cn("font-mono font-bold transition-colors", roll.quantity > 0 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground")}>
               x{roll.quantity}
            </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", getManufacturerColor(roll.manufacturer))}>
              {roll.manufacturer}
            </p>
            <h3 className="font-heading font-semibold text-lg leading-tight text-foreground">{roll.name}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 py-2 flex-grow space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>{roll.film_type === 'black_white' ? 'B&W' : roll.film_type.replace('_', ' ')}</span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <div className={cn("flex items-center gap-1.5", isExpired ? "text-destructive" : "")}>
                  {isExpired ? <AlertTriangle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                  <span className="truncate">
                    {roll.expiry_date ? format(parseISO(roll.expiry_date), 'MMM yyyy') : 'Unknown Exp'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{roll.expiry_date ? `Expires: ${roll.expiry_date}` : 'Expiry date unknown'}</p>
                {isExpired && <p className="text-destructive font-bold">Expired!</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {roll.iso_custom && (
            <div className="flex items-center gap-1.5 col-span-2 text-primary">
              <Hash className="w-3.5 h-3.5" />
              <span>Rated @ {roll.iso_custom}</span>
            </div>
          )}
        </div>
        
        {roll.notes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-2 line-clamp-2">
            "{roll.notes}"
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t border-border/50 flex justify-end gap-2 bg-muted/20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default"
                size="icon" 
                className={cn(
                  "h-8 w-8 mr-auto transition-colors",
                  roll.quantity > 0 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95" 
                    : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                )}
                onClick={handleUse}
                disabled={roll.quantity <= 0}
              >
                <Camera className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load into Camera (Use 1)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
          onClick={() => onEdit && onEdit(roll)}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

import { format } from "date-fns";
import { FilmRoll } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, AlertCircle, Droplets, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface FilmRollCardProps {
  roll: FilmRoll;
}

export function FilmRollCard({ roll }: FilmRollCardProps) {
  const isExpired = roll.expiry_date && new Date() > roll.expiry_date;
  const isUnknown = !roll.expiry_date;

  return (
    <Link href={`/rolls/${roll.id}`}>
      <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {roll.image_url ? (
            <img 
              src={roll.image_url} 
              alt={roll.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Film size={48} opacity={0.2} />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <Badge variant="outline" className="bg-background/80 backdrop-blur text-foreground font-mono text-xs border-transparent">
              {roll.film_size}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                {roll.manufacturer}
              </p>
              <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {roll.name}
              </h3>
            </div>
            <div className="text-right">
               <span className="block font-mono text-xl font-bold text-foreground">
                {roll.iso_custom ? (
                  <span className="text-primary">{roll.iso_custom}</span>
                ) : (
                  roll.iso_recommended
                )}
               </span>
               <span className="text-[10px] text-muted-foreground uppercase">ISO</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-grow">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
             <Badge variant="secondary" className="rounded-sm font-normal text-xs px-1.5 h-5">
                {roll.film_type.replace('_', ' ')}
             </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
            {isUnknown ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <AlertCircle size={12} />
                <span>Exp: Unknown</span>
              </span>
            ) : (
              <span className={cn("flex items-center gap-1.5 font-mono", isExpired ? "text-destructive" : "text-emerald-500")}>
                <Calendar size={12} />
                <span>{format(roll.expiry_date!, "MMM yyyy")}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

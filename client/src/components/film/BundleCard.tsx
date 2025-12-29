import { Bundle, FilmRoll } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface BundleCardProps {
  bundle: Bundle;
  rolls: FilmRoll[];
}

export function BundleCard({ bundle, rolls }: BundleCardProps) {
  // Calculate stats
  const totalRolls = rolls.length;
  const uniqueTypes = Array.from(new Set(rolls.map(r => r.film_type))).length;
  const manufacturers = Array.from(new Set(rolls.map(r => r.manufacturer)));

  return (
    <Link href={`/bundles/${bundle.id}`}>
      <Card className="group border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {bundle.image_url && (
            <img 
              src={bundle.image_url} 
              alt={bundle.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-4 left-4 right-4">
             <h3 className="font-heading font-bold text-2xl text-white mb-1 shadow-sm">
              {bundle.name}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              {manufacturers.join(", ")}
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex-grow">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-background/50 p-3 rounded border border-border/50">
                <span className="block text-2xl font-mono font-bold text-primary">{totalRolls}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Rolls</span>
             </div>
             <div className="bg-background/50 p-3 rounded border border-border/50">
                <span className="block text-2xl font-mono font-bold text-foreground">{uniqueTypes}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Types</span>
             </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t border-border/10 bg-muted/20">
            <div className="w-full flex items-center justify-between text-sm py-2 group-hover:text-primary transition-colors">
                <span className="font-medium">View Bundle</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

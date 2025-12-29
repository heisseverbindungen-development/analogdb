import { Bundle } from "@/shared/types";
import { Film, PackageOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFilm } from "@/lib/film-context";

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const { getRollsByBundle } = useFilm();
  const rolls = getRollsByBundle(bundle.id);
  const rollCount = rolls.length;

  // Get unique film names in this bundle
  const uniqueFilms = Array.from(new Set(rolls.map(r => r.name))).slice(0, 3);

  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col relative">
      <div className="absolute top-0 right-0 p-3 z-10">
        <Badge variant="secondary" className="bg-black/70 backdrop-blur text-white border-none font-mono">
          {rollCount} Rolls
        </Badge>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
        {bundle.image_url ? (
          <img 
            src={bundle.image_url} 
            alt={bundle.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30">
            <PackageOpen className="w-16 h-16 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-heading font-bold text-xl text-white leading-tight drop-shadow-md">{bundle.name}</h3>
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Contains:</p>
          {rolls.length > 0 ? (
            <div className="space-y-1">
              {uniqueFilms.map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Film className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{name}</span>
                </div>
              ))}
              {uniqueFilms.length < new Set(rolls.map(r => r.name)).size && (
                <p className="text-xs text-muted-foreground pl-5">+ others</p>
              )}
            </div>
          ) : (
             <p className="text-sm text-muted-foreground italic">Empty bundle</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t-0 flex justify-end">
        <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
          View Bundle <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

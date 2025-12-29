import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MANUFACTURERS, FILM_TYPES, FILM_SIZES } from "@/lib/types";
import { Search, X } from "lucide-react";

interface FilmFilterProps {
  search: string;
  setSearch: (s: string) => void;
  manufacturer: string;
  setManufacturer: (m: string) => void;
  type: string;
  setType: (t: string) => void;
  size: string;
  setSize: (s: string) => void;
  reset: () => void;
}

export function FilmFilter({
  search, setSearch,
  manufacturer, setManufacturer,
  type, setType,
  size, setSize,
  reset
}: FilmFilterProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input 
          placeholder="Search films..." 
          className="pl-9 bg-background border-input" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Select value={manufacturer} onValueChange={setManufacturer}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {MANUFACTURERS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {FILM_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={size} onValueChange={setSize}>
          <SelectTrigger className="w-[110px] bg-background">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {FILM_SIZES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={reset} title="Reset Filters" className="text-muted-foreground hover:text-destructive">
          <X size={18} />
        </Button>
      </div>
    </div>
  );
}

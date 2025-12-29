import Layout from "@/components/Layout";
import FilmRollCard from "@/components/FilmRollCard";
import FilmForm from "@/components/FilmForm";
import { useFilm } from "@/lib/film-context";
import { FilmRoll } from "@/shared/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inventory() {
  const { rolls, addRoll, updateRoll } = useFilm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoll, setEditingRoll] = useState<FilmRoll | null>(null);

  // Filter State
  const [search, setSearch] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");

  const handleEdit = (roll: FilmRoll) => {
    setEditingRoll(roll);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingRoll) {
      updateRoll(editingRoll.id, data);
    } else {
      addRoll(data);
    }
    setEditingRoll(null);
  };

  const handleAddNew = () => {
    setEditingRoll(null);
    setIsFormOpen(true);
  };

  // Filter Logic
  const filteredRolls = rolls.filter(roll => {
    const matchesSearch = roll.name.toLowerCase().includes(search.toLowerCase()) || 
                          roll.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesManufacturer = manufacturerFilter === "all" || roll.manufacturer === manufacturerFilter;
    const matchesType = typeFilter === "all" || roll.film_type === typeFilter;
    const matchesSize = sizeFilter === "all" || roll.film_size === sizeFilter;

    return matchesSearch && matchesManufacturer && matchesType && matchesSize;
  });

  const manufacturers = Array.from(new Set(rolls.map(r => r.manufacturer)));

  return (
    <Layout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Inventory</h2>
            <p className="text-muted-foreground mt-1">Manage your complete film collection.</p>
          </div>
          <Button onClick={handleAddNew} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            <Plus className="w-4 h-4 mr-2" /> Add Film Roll
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-0 z-20 backdrop-blur-xl bg-card/80">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search films..." 
              className="pl-9 bg-background/50 border-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue placeholder="Manufacturer" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Makers</SelectItem>
                 {manufacturers.map(m => (
                   <SelectItem key={m} value={m}>{m}</SelectItem>
                 ))}
               </SelectContent>
             </Select>

             <Select value={typeFilter} onValueChange={setTypeFilter}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue placeholder="Film Type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>
                 <SelectItem value="color_negative">Color Negative</SelectItem>
                 <SelectItem value="black_white">Black & White</SelectItem>
                 <SelectItem value="color_slide">Slide (E-6)</SelectItem>
               </SelectContent>
             </Select>

             <Select value={sizeFilter} onValueChange={setSizeFilter}>
               <SelectTrigger className="w-[110px]">
                 <SelectValue placeholder="Format" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Sizes</SelectItem>
                 <SelectItem value="35mm">35mm</SelectItem>
                 <SelectItem value="120">120</SelectItem>
               </SelectContent>
             </Select>

              {(manufacturerFilter !== "all" || typeFilter !== "all" || sizeFilter !== "all" || search) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setManufacturerFilter("all");
                    setTypeFilter("all");
                    setSizeFilter("all");
                    setSearch("");
                  }}
                  title="Clear Filters"
                >
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {filteredRolls.length > 0 ? (
            filteredRolls.map(roll => (
              <FilmRollCard key={roll.id} roll={roll} onEdit={handleEdit} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <Film className="w-12 h-12 mx-auto opacity-20 mb-4" />
              <p className="text-lg font-medium">No film rolls found</p>
              <p className="text-sm">Try adjusting your filters or add a new roll.</p>
            </div>
          )}
        </div>

      </div>

      <FilmForm 
        open={isFormOpen} 
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingRoll(null);
        }} 
        onSubmit={handleFormSubmit}
        initialData={editingRoll}
      />
    </Layout>
  );
}

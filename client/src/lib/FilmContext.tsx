import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FilmRoll, Bundle, INITIAL_ROLLS, INITIAL_BUNDLES, filmRollSchema } from "./types";
import { useToast } from "@/hooks/use-toast";

interface FilmContextType {
  rolls: FilmRoll[];
  bundles: Bundle[];
  addRoll: (roll: FilmRoll) => void;
  updateRoll: (id: string, updates: Partial<FilmRoll>) => void;
  deleteRoll: (id: string) => void;
  addBundle: (bundle: Bundle) => void;
  getRollsByBundle: (bundleId: string) => FilmRoll[];
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export function FilmProvider({ children }: { children: ReactNode }) {
  const [rolls, setRolls] = useState<FilmRoll[]>(INITIAL_ROLLS);
  const [bundles, setBundles] = useState<Bundle[]>(INITIAL_BUNDLES);
  const { toast } = useToast();

  const addRoll = (roll: FilmRoll) => {
    setRolls((prev) => [...prev, roll]);
    // Also update the bundle it belongs to
    setBundles((prev) =>
      prev.map((b) =>
        b.id === roll.bundle_id
          ? { ...b, film_rolls: [...b.film_rolls, roll.id] }
          : b
      )
    );
    toast({ title: "Roll Added", description: `${roll.name} added to inventory.` });
  };

  const updateRoll = (id: string, updates: Partial<FilmRoll>) => {
    setRolls((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    toast({ title: "Roll Updated", description: "Changes saved successfully." });
  };

  const deleteRoll = (id: string) => {
    setRolls((prev) => prev.filter((r) => r.id !== id));
    // Remove from bundle
    setBundles((prev) =>
      prev.map((b) => ({
        ...b,
        film_rolls: b.film_rolls.filter((rId) => rId !== id),
      }))
    );
    toast({ title: "Roll Deleted", description: "Roll removed from inventory.", variant: "destructive" });
  };

  const addBundle = (bundle: Bundle) => {
    setBundles((prev) => [...prev, bundle]);
    toast({ title: "Bundle Created", description: `${bundle.name} added.` });
  };

  const getRollsByBundle = (bundleId: string) => {
    return rolls.filter((r) => r.bundle_id === bundleId);
  };

  return (
    <FilmContext.Provider
      value={{
        rolls,
        bundles,
        addRoll,
        updateRoll,
        deleteRoll,
        addBundle,
        getRollsByBundle,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
}

export function useFilm() {
  const context = useContext(FilmContext);
  if (context === undefined) {
    throw new Error("useFilm must be used within a FilmProvider");
  }
  return context;
}

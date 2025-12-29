import React, { createContext, useContext, useState, ReactNode } from "react";
import { FilmRoll, Bundle, FilmType, FilmSize, IsoSpeed } from "../shared/types";
import { INITIAL_ROLLS, INITIAL_BUNDLES } from "./mock-data";
import { v4 as uuidv4 } from "uuid";

interface FilmContextType {
  rolls: FilmRoll[];
  bundles: Bundle[];
  addRoll: (roll: Omit<FilmRoll, "id">) => void;
  updateRoll: (id: string, updates: Partial<FilmRoll>) => void;
  deleteRoll: (id: string) => void;
  addBundle: (bundle: Omit<Bundle, "id">) => void;
  updateBundle: (id: string, updates: Partial<Bundle>) => void;
  deleteBundle: (id: string) => void;
  getRollsByBundle: (bundleId: string) => FilmRoll[];
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export function FilmProvider({ children }: { children: ReactNode }) {
  const [rolls, setRolls] = useState<FilmRoll[]>(INITIAL_ROLLS);
  const [bundles, setBundles] = useState<Bundle[]>(INITIAL_BUNDLES);

  const addRoll = (roll: Omit<FilmRoll, "id">) => {
    const newRoll = { ...roll, id: uuidv4() };
    setRolls((prev) => [...prev, newRoll]);
    
    // If part of a bundle, update bundle's list
    if (roll.bundle_id) {
      setBundles(prev => prev.map(b => 
        b.id === roll.bundle_id 
          ? { ...b, film_rolls: [...b.film_rolls, newRoll.id] }
          : b
      ));
    }
  };

  const updateRoll = (id: string, updates: Partial<FilmRoll>) => {
    setRolls((prev) =>
      prev.map((roll) => (roll.id === id ? { ...roll, ...updates } : roll))
    );
  };

  const deleteRoll = (id: string) => {
    setRolls((prev) => prev.filter((roll) => roll.id !== id));
    // Remove from bundles
    setBundles(prev => prev.map(b => ({
      ...b,
      film_rolls: b.film_rolls.filter(rId => rId !== id)
    })));
  };

  const addBundle = (bundle: Omit<Bundle, "id">) => {
    const newBundle = { ...bundle, id: uuidv4() };
    setBundles((prev) => [...prev, newBundle]);
  };

  const updateBundle = (id: string, updates: Partial<Bundle>) => {
    setBundles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBundle = (id: string) => {
    setBundles((prev) => prev.filter((b) => b.id !== id));
    // Update rolls to remove bundle reference
    setRolls(prev => prev.map(r => r.bundle_id === id ? { ...r, bundle_id: null } : r));
  };

  const getRollsByBundle = (bundleId: string) => {
    return rolls.filter((roll) => roll.bundle_id === bundleId);
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
        updateBundle,
        deleteBundle,
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

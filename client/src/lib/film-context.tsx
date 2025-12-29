import React, { createContext, useContext, useState, ReactNode } from "react";
import { FilmRoll } from "../shared/types";
import { INITIAL_ROLLS } from "./mock-data";
import { v4 as uuidv4 } from "uuid";

interface FilmContextType {
  rolls: FilmRoll[];
  addRoll: (roll: Omit<FilmRoll, "id">) => void;
  updateRoll: (id: string, updates: Partial<FilmRoll>) => void;
  deleteRoll: (id: string) => void;
  useRoll: (id: string) => void;
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export function FilmProvider({ children }: { children: ReactNode }) {
  const [rolls, setRolls] = useState<FilmRoll[]>(INITIAL_ROLLS);

  const addRoll = (roll: Omit<FilmRoll, "id">) => {
    const newRoll = { ...roll, id: uuidv4() };
    setRolls((prev) => [...prev, newRoll]);
  };

  const updateRoll = (id: string, updates: Partial<FilmRoll>) => {
    setRolls((prev) =>
      prev.map((roll) => (roll.id === id ? { ...roll, ...updates } : roll))
    );
  };

  const deleteRoll = (id: string) => {
    setRolls((prev) => prev.filter((roll) => roll.id !== id));
  };

  const useRoll = (id: string) => {
    setRolls((prev) => 
      prev.map((roll) => {
        if (roll.id === id && roll.quantity > 0) {
          return { ...roll, quantity: roll.quantity - 1 };
        }
        return roll;
      })
    );
  };

  return (
    <FilmContext.Provider
      value={{
        rolls,
        addRoll,
        updateRoll,
        deleteRoll,
        useRoll,
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

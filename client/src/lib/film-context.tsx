import React, { createContext, useContext, useState, ReactNode } from "react";
import { FilmRoll, FilmLog } from "../shared/types";
import { INITIAL_ROLLS } from "./mock-data";
import { v4 as uuidv4 } from "uuid";

interface FilmContextType {
  rolls: FilmRoll[];
  logs: FilmLog[];
  addRoll: (roll: Omit<FilmRoll, "id">) => void;
  updateRoll: (id: string, updates: Partial<FilmRoll>) => void;
  deleteRoll: (id: string) => void;
  useRoll: (id: string, camera?: string, notes?: string) => void;
  finishRoll: (logId: string) => void;
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export function FilmProvider({ children }: { children: ReactNode }) {
  const [rolls, setRolls] = useState<FilmRoll[]>(INITIAL_ROLLS);
  const [logs, setLogs] = useState<FilmLog[]>([]);

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

  const useRoll = (id: string, camera?: string, notes?: string) => {
    let rollDetails: FilmRoll | undefined;
    
    setRolls((prev) => 
      prev.map((roll) => {
        if (roll.id === id && roll.quantity > 0) {
          rollDetails = roll;
          return { ...roll, quantity: roll.quantity - 1 };
        }
        return roll;
      })
    );

    if (rollDetails) {
      const newLog: FilmLog = {
        id: uuidv4(),
        filmRollId: rollDetails.id,
        filmName: rollDetails.name,
        manufacturer: rollDetails.manufacturer,
        film_size: rollDetails.film_size,
        iso: rollDetails.iso_custom || rollDetails.iso_recommended,
        dateLoaded: new Date().toISOString(),
        dateFinished: null,
        camera: camera || null,
        notes: notes || null,
      };
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  const finishRoll = (logId: string) => {
    setLogs((prev) => 
      prev.map(log => 
        log.id === logId 
          ? { ...log, dateFinished: new Date().toISOString() } 
          : log
      )
    );
  };

  return (
    <FilmContext.Provider
      value={{
        rolls,
        logs,
        addRoll,
        updateRoll,
        deleteRoll,
        useRoll,
        finishRoll,
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

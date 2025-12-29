import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FilmRoll, FilmLog } from "../shared/types";
import { filmRollsAPI, filmLogsAPI } from "./api";

interface FilmContextType {
  rolls: FilmRoll[];
  logs: FilmLog[];
  isLoadingRolls: boolean;
  isLoadingLogs: boolean;
  addRoll: (roll: Omit<FilmRoll, "id">) => Promise<void>;
  updateRoll: (id: string, updates: Partial<FilmRoll>) => Promise<void>;
  deleteRoll: (id: string) => Promise<void>;
  useRoll: (id: string, camera?: string, notes?: string) => Promise<void>;
  finishRoll: (logId: string) => Promise<void>;
}

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export function FilmProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch film rolls
  const { data: rolls = [], isLoading: isLoadingRolls } = useQuery({
    queryKey: ["filmRolls"],
    queryFn: filmRollsAPI.getAll,
  });

  // Fetch film logs
  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["filmLogs"],
    queryFn: filmLogsAPI.getAll,
  });

  // Mutations
  const addRollMutation = useMutation({
    mutationFn: filmRollsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filmRolls"] });
    },
  });

  const updateRollMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FilmRoll> }) =>
      filmRollsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filmRolls"] });
    },
  });

  const deleteRollMutation = useMutation({
    mutationFn: filmRollsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filmRolls"] });
    },
  });

  const createLogMutation = useMutation({
    mutationFn: filmLogsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filmLogs"] });
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<FilmLog, "id">> }) =>
      filmLogsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filmLogs"] });
    },
  });

  // Context methods
  const addRoll = async (roll: Omit<FilmRoll, "id">) => {
    await addRollMutation.mutateAsync(roll);
  };

  const updateRoll = async (id: string, updates: Partial<FilmRoll>) => {
    await updateRollMutation.mutateAsync({ id, updates });
  };

  const deleteRoll = async (id: string) => {
    await deleteRollMutation.mutateAsync(id);
  };

  const useRoll = async (id: string, camera?: string, notes?: string) => {
    // Find the roll
    const roll = rolls.find((r) => r.id === id);
    if (!roll || roll.quantity <= 0) return;

    // Update roll quantity
    await updateRollMutation.mutateAsync({
      id,
      updates: { quantity: roll.quantity - 1 },
    });

    // Create log entry
    await createLogMutation.mutateAsync({
      filmRollId: roll.id,
      filmName: roll.name,
      manufacturer: roll.manufacturer,
      film_size: roll.film_size,
      iso: roll.iso_custom || roll.iso_recommended,
      dateFinished: null,
      camera: camera || null,
      notes: notes || null,
    });
  };

  const finishRoll = async (logId: string) => {
    await updateLogMutation.mutateAsync({
      id: logId,
      updates: { dateFinished: new Date().toISOString() },
    });
  };

  return (
    <FilmContext.Provider
      value={{
        rolls,
        logs,
        isLoadingRolls,
        isLoadingLogs,
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

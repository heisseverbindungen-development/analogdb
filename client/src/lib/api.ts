import type { FilmRoll, FilmLog } from "../shared/types";

const API_BASE = "/api";

export const filmRollsAPI = {
  async getAll(): Promise<FilmRoll[]> {
    const response = await fetch(`${API_BASE}/film-rolls`);
    if (!response.ok) throw new Error("Failed to fetch film rolls");
    const data = await response.json();
    // Convert timestamp fields to ISO strings for compatibility
    return data.map((roll: any) => ({
      ...roll,
      expiry_date: roll.expiry_date || null,
      iso_custom: roll.iso_custom || null,
      notes: roll.notes || null,
      image_url: roll.image_url || null,
    }));
  },

  async create(roll: Omit<FilmRoll, "id">): Promise<FilmRoll> {
    const response = await fetch(`${API_BASE}/film-rolls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roll),
    });
    if (!response.ok) throw new Error("Failed to create film roll");
    return response.json();
  },

  async update(id: string, updates: Partial<FilmRoll>): Promise<FilmRoll> {
    const response = await fetch(`${API_BASE}/film-rolls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update film roll");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/film-rolls/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete film roll");
  },
};

export const filmLogsAPI = {
  async getAll(): Promise<FilmLog[]> {
    const response = await fetch(`${API_BASE}/film-logs`);
    if (!response.ok) throw new Error("Failed to fetch film logs");
    const data = await response.json();
    // Convert timestamp fields to ISO strings
    return data.map((log: any) => ({
      ...log,
      dateLoaded: log.dateLoaded ? new Date(log.dateLoaded).toISOString() : new Date().toISOString(),
      dateFinished: log.dateFinished ? new Date(log.dateFinished).toISOString() : null,
      camera: log.camera || null,
      notes: log.notes || null,
    }));
  },

  async create(log: Omit<FilmLog, "id" | "dateLoaded">): Promise<FilmLog> {
    const response = await fetch(`${API_BASE}/film-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error("Failed to create film log");
    const data = await response.json();
    return {
      ...data,
      dateLoaded: data.dateLoaded ? new Date(data.dateLoaded).toISOString() : new Date().toISOString(),
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
    };
  },

  async update(id: string, updates: Partial<Omit<FilmLog, "id">>): Promise<FilmLog> {
    const response = await fetch(`${API_BASE}/film-logs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update film log");
    const data = await response.json();
    return {
      ...data,
      dateLoaded: data.dateLoaded ? new Date(data.dateLoaded).toISOString() : new Date().toISOString(),
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
    };
  },
};

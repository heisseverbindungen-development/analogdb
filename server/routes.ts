import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFilmRollSchema, insertFilmLogSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Film Rolls
  app.get("/api/film-rolls", async (req, res) => {
    try {
      const rolls = await storage.getAllFilmRolls();
      res.json(rolls);
    } catch (error) {
      console.error("Error fetching film rolls:", error);
      res.status(500).json({ error: "Failed to fetch film rolls" });
    }
  });

  app.get("/api/film-rolls/:id", async (req, res) => {
    try {
      const roll = await storage.getFilmRoll(req.params.id);
      if (!roll) {
        return res.status(404).json({ error: "Film roll not found" });
      }
      res.json(roll);
    } catch (error) {
      console.error("Error fetching film roll:", error);
      res.status(500).json({ error: "Failed to fetch film roll" });
    }
  });

  app.post("/api/film-rolls", async (req, res) => {
    try {
      const validated = insertFilmRollSchema.parse(req.body);
      const roll = await storage.createFilmRoll(validated);
      res.status(201).json(roll);
    } catch (error) {
      console.error("Error creating film roll:", error);
      res.status(400).json({ error: "Invalid film roll data" });
    }
  });

  app.patch("/api/film-rolls/:id", async (req, res) => {
    try {
      const roll = await storage.updateFilmRoll(req.params.id, req.body);
      if (!roll) {
        return res.status(404).json({ error: "Film roll not found" });
      }
      res.json(roll);
    } catch (error) {
      console.error("Error updating film roll:", error);
      res.status(500).json({ error: "Failed to update film roll" });
    }
  });

  app.delete("/api/film-rolls/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFilmRoll(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Film roll not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting film roll:", error);
      res.status(500).json({ error: "Failed to delete film roll" });
    }
  });

  // Film Logs
  app.get("/api/film-logs", async (req, res) => {
    try {
      const logs = await storage.getAllFilmLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching film logs:", error);
      res.status(500).json({ error: "Failed to fetch film logs" });
    }
  });

  app.post("/api/film-logs", async (req, res) => {
    try {
      const validated = insertFilmLogSchema.parse(req.body);
      const log = await storage.createFilmLog(validated);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating film log:", error);
      res.status(400).json({ error: "Invalid film log data" });
    }
  });

  app.patch("/api/film-logs/:id", async (req, res) => {
    try {
      // Convert ISO string dates to Date objects for timestamp fields
      const updates = { ...req.body };
      if (updates.dateFinished) {
        updates.dateFinished = new Date(updates.dateFinished);
      }
      if (updates.dateLoaded) {
        updates.dateLoaded = new Date(updates.dateLoaded);
      }
      
      const log = await storage.updateFilmLog(req.params.id, updates);
      if (!log) {
        return res.status(404).json({ error: "Film log not found" });
      }
      res.json(log);
    } catch (error) {
      console.error("Error updating film log:", error);
      res.status(500).json({ error: "Failed to update film log" });
    }
  });

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, verifyPassword } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Login Route - POST
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Passwort erforderlich" });
      }
      
      const isValid = await verifyPassword(password);
      
      if (isValid) {
        req.session.authenticated = true;
        return res.json({ message: "Login erfolgreich", authenticated: true });
      } else {
        return res.status(401).json({ message: "Falsches Passwort" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Serverfehler beim Login" });
    }
  });

  // Logout Route - POST
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Fehler beim Logout" });
      }
      res.json({ message: "Logout erfolgreich", authenticated: false });
    });
  });

  // Check Auth Status - GET
  app.get("/api/auth/status", (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
  });

  // Beispiel für geschützte API-Route
  app.get("/api/protected", requireAuth, (req, res) => {
    res.json({ message: "Du hast Zugriff auf geschützte Daten!" });
  });

  return httpServer;
}

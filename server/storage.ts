import { 
  type FilmRoll, 
  type InsertFilmRoll,
  type FilmLog,
  type InsertFilmLog,
  filmRolls,
  filmLogs
} from "@shared/schema";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Film Rolls
  getAllFilmRolls(): Promise<FilmRoll[]>;
  getFilmRoll(id: string): Promise<FilmRoll | undefined>;
  createFilmRoll(roll: InsertFilmRoll): Promise<FilmRoll>;
  updateFilmRoll(id: string, updates: Partial<InsertFilmRoll>): Promise<FilmRoll | undefined>;
  deleteFilmRoll(id: string): Promise<boolean>;

  // Film Logs
  getAllFilmLogs(): Promise<FilmLog[]>;
  getFilmLog(id: string): Promise<FilmLog | undefined>;
  createFilmLog(log: InsertFilmLog): Promise<FilmLog>;
  updateFilmLog(id: string, updates: Partial<InsertFilmLog>): Promise<FilmLog | undefined>;
  deleteFilmLog(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Film Rolls
  async getAllFilmRolls(): Promise<FilmRoll[]> {
    return await db.select().from(filmRolls);
  }

  async getFilmRoll(id: string): Promise<FilmRoll | undefined> {
    const results = await db.select().from(filmRolls).where(eq(filmRolls.id, id));
    return results[0];
  }

  async createFilmRoll(roll: InsertFilmRoll): Promise<FilmRoll> {
    const results = await db.insert(filmRolls).values(roll).returning();
    return results[0];
  }

  async updateFilmRoll(id: string, updates: Partial<InsertFilmRoll>): Promise<FilmRoll | undefined> {
    const results = await db
      .update(filmRolls)
      .set(updates)
      .where(eq(filmRolls.id, id))
      .returning();
    return results[0];
  }

  async deleteFilmRoll(id: string): Promise<boolean> {
    const results = await db.delete(filmRolls).where(eq(filmRolls.id, id)).returning();
    return results.length > 0;
  }

  // Film Logs
  async getAllFilmLogs(): Promise<FilmLog[]> {
    return await db.select().from(filmLogs);
  }

  async getFilmLog(id: string): Promise<FilmLog | undefined> {
    const results = await db.select().from(filmLogs).where(eq(filmLogs.id, id));
    return results[0];
  }

  async createFilmLog(log: InsertFilmLog): Promise<FilmLog> {
    const results = await db.insert(filmLogs).values(log).returning();
    return results[0];
  }

  async updateFilmLog(id: string, updates: Partial<InsertFilmLog>): Promise<FilmLog | undefined> {
    const results = await db
      .update(filmLogs)
      .set(updates)
      .where(eq(filmLogs.id, id))
      .returning();
    return results[0];
  }

  async deleteFilmLog(id: string): Promise<boolean> {
    const results = await db.delete(filmLogs).where(eq(filmLogs.id, id)).returning();
    return results.length > 0;
  }
}

export const storage = new DbStorage();

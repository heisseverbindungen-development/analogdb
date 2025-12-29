import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const filmRolls = pgTable("film_rolls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  film_type: text("film_type").notNull(),
  film_size: text("film_size").notNull(),
  expiry_date: text("expiry_date"),
  iso_recommended: integer("iso_recommended").notNull(),
  iso_custom: integer("iso_custom"),
  notes: text("notes"),
  image_url: text("image_url"),
  quantity: integer("quantity").notNull().default(0),
});

export const filmLogs = pgTable("film_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filmRollId: varchar("film_roll_id").notNull(),
  filmName: text("film_name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  film_size: text("film_size").notNull(),
  iso: integer("iso").notNull(),
  dateLoaded: timestamp("date_loaded").notNull().defaultNow(),
  dateFinished: timestamp("date_finished"),
  camera: text("camera"),
  notes: text("notes"),
});

export const insertFilmRollSchema = createInsertSchema(filmRolls).omit({
  id: true,
});

export const insertFilmLogSchema = createInsertSchema(filmLogs).omit({
  id: true,
  dateLoaded: true,
});

export type InsertFilmRoll = z.infer<typeof insertFilmRollSchema>;
export type FilmRoll = typeof filmRolls.$inferSelect;
export type InsertFilmLog = z.infer<typeof insertFilmLogSchema>;
export type FilmLog = typeof filmLogs.$inferSelect;

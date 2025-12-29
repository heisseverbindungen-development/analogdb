import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Enums
export const MANUFACTURERS = ["Kodak", "Fujifilm", "Ilford", "Agfa", "Cinestill", "Lomography"] as const;
export const FILM_TYPES = ["black_white", "color_negative", "color_slide"] as const;
export const FILM_SIZES = ["35mm", "120"] as const;
export const ISO_RECOMMENDED = [25, 50, 64, 80, 100, 125, 160, 200, 400, 800, 1600, 3200, 6400] as const;

// Schemas
export const filmRollSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  manufacturer: z.enum(MANUFACTURERS),
  film_type: z.enum(FILM_TYPES),
  film_size: z.enum(FILM_SIZES),
  expiry_date: z.date().nullable(), // null means unknown
  iso_recommended: z.number(),
  iso_custom: z.number().nullable(),
  notes: z.string().nullable(),
  image_url: z.string().nullable(),
  bundle_id: z.string().uuid(),
  date_added: z.date().default(() => new Date()),
});

export const bundleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  image_url: z.string().nullable(),
  film_rolls: z.array(z.string().uuid()), // Array of Film Roll IDs
});

export type FilmRoll = z.infer<typeof filmRollSchema>;
export type Bundle = z.infer<typeof bundleSchema>;

// Mock Data
import kodakImg from "@assets/generated_images/kodak_portra_film_bundle_box.png";
import fujiImg from "@assets/generated_images/fujifilm_superia_film_bundle_box.png";
import ilfordImg from "@assets/generated_images/ilford_hp5_plus_film_bundle_box.png";
import rollImg from "@assets/generated_images/generic_film_roll_canister_35mm.png";

const BUNDLE_KODAK_ID = "bundle_kodak_123";
const BUNDLE_FUJI_ID = "bundle_fuji_456";
const BUNDLE_ILFORD_ID = "bundle_ilford_789";

export const INITIAL_BUNDLES: Bundle[] = [
  {
    id: BUNDLE_KODAK_ID,
    name: "Kodak Portra 400 Pro Pack",
    image_url: kodakImg,
    film_rolls: [],
  },
  {
    id: BUNDLE_FUJI_ID,
    name: "Fujifilm Superia X-TRA 400",
    image_url: fujiImg,
    film_rolls: [],
  },
  {
    id: BUNDLE_ILFORD_ID,
    name: "Ilford HP5 Plus Brick",
    image_url: ilfordImg,
    film_rolls: [],
  },
];

export const INITIAL_ROLLS: FilmRoll[] = [
  // Kodak Rolls
  {
    id: "roll_k1",
    name: "Portra 400",
    manufacturer: "Kodak",
    film_type: "color_negative",
    film_size: "35mm",
    expiry_date: new Date("2026-05-01"),
    iso_recommended: 400,
    iso_custom: null,
    notes: "Perfect for skin tones. Keep refrigerated.",
    image_url: rollImg,
    bundle_id: BUNDLE_KODAK_ID,
    date_added: new Date(),
  },
  {
    id: "roll_k2",
    name: "Portra 400",
    manufacturer: "Kodak",
    film_type: "color_negative",
    film_size: "35mm",
    expiry_date: new Date("2026-05-01"),
    iso_recommended: 400,
    iso_custom: 320,
    notes: "Overexpose by 1 stop.",
    image_url: rollImg,
    bundle_id: BUNDLE_KODAK_ID,
    date_added: new Date(),
  },
   {
    id: "roll_k3",
    name: "Portra 400",
    manufacturer: "Kodak",
    film_type: "color_negative",
    film_size: "35mm",
    expiry_date: null,
    iso_recommended: 400,
    iso_custom: null,
    notes: "Mystery roll found in bag.",
    image_url: rollImg,
    bundle_id: BUNDLE_KODAK_ID,
    date_added: new Date(),
  },
  // Fuji Rolls
  {
    id: "roll_f1",
    name: "Superia 400",
    manufacturer: "Fujifilm",
    film_type: "color_negative",
    film_size: "35mm",
    expiry_date: new Date("2025-12-31"),
    iso_recommended: 400,
    iso_custom: null,
    notes: "Good for street photography.",
    image_url: rollImg,
    bundle_id: BUNDLE_FUJI_ID,
    date_added: new Date(),
  },
  {
    id: "roll_f2",
    name: "Superia 400",
    manufacturer: "Fujifilm",
    film_type: "color_negative",
    film_size: "35mm",
    expiry_date: new Date("2025-12-31"),
    iso_recommended: 400,
    iso_custom: null,
    notes: null,
    image_url: rollImg,
    bundle_id: BUNDLE_FUJI_ID,
    date_added: new Date(),
  },
  // Ilford Rolls
  {
    id: "roll_i1",
    name: "HP5 Plus",
    manufacturer: "Ilford",
    film_type: "black_white",
    film_size: "120",
    expiry_date: new Date("2027-01-15"),
    iso_recommended: 400,
    iso_custom: 800,
    notes: "Push 1 stop in dev.",
    image_url: rollImg,
    bundle_id: BUNDLE_ILFORD_ID,
    date_added: new Date(),
  },
  {
    id: "roll_i2",
    name: "HP5 Plus",
    manufacturer: "Ilford",
    film_type: "black_white",
    film_size: "120",
    expiry_date: new Date("2027-01-15"),
    iso_recommended: 400,
    iso_custom: 1600,
    notes: "Push 2 stops. Night shoot.",
    image_url: rollImg,
    bundle_id: BUNDLE_ILFORD_ID,
    date_added: new Date(),
  },
];

// Update initial bundles with roll IDs
INITIAL_BUNDLES[0].film_rolls = ["roll_k1", "roll_k2", "roll_k3"];
INITIAL_BUNDLES[1].film_rolls = ["roll_f1", "roll_f2"];
INITIAL_BUNDLES[2].film_rolls = ["roll_i1", "roll_i2"];

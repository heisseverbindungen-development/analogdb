export type FilmType = "black_white" | "color_negative" | "color_slide";
export type FilmSize = "35mm" | "120";
export type IsoSpeed = 25 | 50 | 64 | 80 | 100 | 125 | 160 | 200 | 400 | 800 | 1600 | 3200 | 6400;

export interface FilmRoll {
  id: string;
  name: string;
  manufacturer: string;
  film_type: FilmType;
  film_size: FilmSize;
  expiry_date: string | null; // ISO string YYYY-MM-DD or null for unknown
  iso_recommended: IsoSpeed;
  iso_custom: number | null;
  notes: string | null;
  image_url: string | null;
  quantity: number;
}

import type { Express, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const THUMBNAIL_SIZE = 300;

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
    }
  },
});

export function registerLocalUploadRoutes(app: Express): void {
  app.post("/api/local-uploads", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileId = randomUUID();
      const fileName = `${fileId}.webp`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      await sharp(req.file.buffer)
        .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      const objectPath = `/local-uploads/${fileName}`;
      
      res.json({
        objectPath,
        fileName,
        message: "File uploaded and compressed successfully",
      });
    } catch (error) {
      console.error("Error processing upload:", error);
      res.status(500).json({ error: "Failed to process upload" });
    }
  });

  app.get("/local-uploads/:fileName", async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      
      if (!fileName.match(/^[a-f0-9-]+\.webp$/)) {
        return res.status(400).json({ error: "Invalid file name" });
      }

      const filePath = path.join(UPLOADS_DIR, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      res.set({
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000",
      });

      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error("Error serving file:", error);
      res.status(500).json({ error: "Failed to serve file" });
    }
  });
}

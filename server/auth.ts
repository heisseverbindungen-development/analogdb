import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// Gehashtes Passwort - Ändere 'mein-sicheres-passwort' zu deinem gewünschten Passwort
// Um ein neues Passwort zu generieren, führe aus: bcrypt.hashSync('dein-passwort', 10)
export const PASSWORD_HASH = bcrypt.hashSync('analogfilm2024', 10);

// Session Type Declaration
declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
  }
}

// Middleware zum Schutz von Routen
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.authenticated) {
    return next();
  }
  
  // Für API-Routen: JSON-Response
  if (req.path.startsWith('/api')) {
    return res.status(401).json({ message: 'Nicht authentifiziert' });
  }
  
  // Für normale Routen: Redirect zum Login
  return res.redirect('/login');
}

// Passwort verifizieren
export async function verifyPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, PASSWORD_HASH);
}

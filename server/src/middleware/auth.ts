import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.slice(7);
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded = jwt.verify(token, secret) as { id: string; role?: string };
    req.user = decoded.role ? { id: decoded.id, role: decoded.role } : { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}



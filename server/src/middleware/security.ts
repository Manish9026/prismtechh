import type { Express, RequestHandler } from 'express';
import csurf from 'csurf';

export const applySecurityMiddleware = (app: Express): void => {
  // CSRF protection for non-API forms can be added selectively; for API we'll allow tokens via header
  const csrfProtection: RequestHandler = csurf({ cookie: true });
  // Mount CSRF only on sensitive routes later (e.g., contact form, admin actions)
  app.set('csrfProtection', csrfProtection);
};


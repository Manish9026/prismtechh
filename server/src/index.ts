import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { applySecurityMiddleware } from './middleware/security';
import { connectDatabase } from './config/db';
import router from './routes';

dotenv.config();

const app = express();

// Core middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
const corsOriginEnv = process.env.CORS_ORIGIN || '';
const allowedOrigins = corsOriginEnv
  ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean)
  : ['http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: false,
  })
);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));

// Rate limiting for security
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api/', limiter);

// Additional security middleware
applySecurityMiddleware(app);

// API routes
app.use('/api', router);

// Static uploads for local storage
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

export default app;

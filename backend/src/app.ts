import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';


dotenv.config();

// Public routes
import { publicProductsRouter } from './routes/public/products';
import { publicCategoriesRouter } from './routes/public/categories';
import { publicCampaignsRouter } from './routes/public/campaigns';
import { publicBannersRouter } from './routes/public/banners';
import { publicSettingsRouter } from './routes/public/settings';
import { publicDigitalOrdersRouter } from './routes/public/digitalOrders';

// Admin routes
import { adminAuthRouter } from './routes/admin/auth';
import { adminProductsRouter } from './routes/admin/products';
import { adminCategoriesRouter } from './routes/admin/categories';
import { adminCampaignsRouter } from './routes/admin/campaigns';
import { adminBannersRouter } from './routes/admin/banners';
import { adminSettingsRouter } from './routes/admin/settings';
import { adminImagesRouter } from './routes/admin/images';
import { adminDigitalRouter } from './routes/admin/digital';
import { adminPublicationsRouter } from './routes/admin/publications';

import { errorHandler } from './middleware/errorHandler';

export const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:4321',
  process.env.ADMIN_URL || 'http://localhost:5173',
  'http://localhost:4321',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for development testing
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to safely locate directories whether executing from repo root or backend workspace
function getStaticDir(candidates: string[]): string {
  for (const c of candidates) {
    const p = path.resolve(process.cwd(), c);
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(process.cwd(), candidates[0]);
}

// Serve uploaded and static image files
const uploadsDir = getStaticDir([
  process.env.STORAGE_LOCAL_PATH || '',
  './uploads',
  './backend/uploads',
  '../backend/uploads',
].filter(Boolean));
app.use('/uploads', express.static(uploadsDir));

const imagesDir = getStaticDir([
  './public/images',
  './backend/public/images',
  '../frontend/public/images',
  '../backend/public/images',
]);
app.use('/images', express.static(imagesDir));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Ovejita Sorpresas API', timestamp: new Date().toISOString() });
});

// Mount Public API
app.use('/api/products', publicProductsRouter);
app.use('/api/categories', publicCategoriesRouter);
app.use('/api/campaigns', publicCampaignsRouter);
app.use('/api/banners', publicBannersRouter);
app.use('/api/settings', publicSettingsRouter);
app.use('/api/digital/orders', publicDigitalOrdersRouter);

// Mount Admin API
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/campaigns', adminCampaignsRouter);
app.use('/api/admin/banners', adminBannersRouter);
app.use('/api/admin/settings', adminSettingsRouter);
app.use('/api/admin/images', adminImagesRouter);
app.use('/api/admin/digital', adminDigitalRouter);
app.use('/api/admin/publications', adminPublicationsRouter);

// Global Error Handler
app.use(errorHandler);

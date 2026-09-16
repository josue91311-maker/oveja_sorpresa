import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { getStorageProvider } from '../../services/storage';

export const adminDigitalRouter = Router();
adminDigitalRouter.use(requireAuth);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDF designs
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos en formato PDF (.pdf)'));
    }
  },
});

function getPdfsDir(): string {
  const candidates = [
    './uploads/pdfs',
    './backend/uploads/pdfs',
    '../backend/uploads/pdfs',
  ];

  for (const c of candidates) {
    const p = path.resolve(process.cwd(), c);
    if (fs.existsSync(p)) return p;
  }

  const fallback = path.resolve(process.cwd(), './backend/uploads/pdfs');
  if (!fs.existsSync(fallback)) {
    fs.mkdirSync(fallback, { recursive: true });
  }
  return fallback;
}

// POST /api/admin/digital/upload-pdf — Upload or replace PDF design file
adminDigitalRouter.post(
  '/upload-pdf',
  upload.single('pdf'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { productId } = req.body;

      if (!file) {
        res.status(400).json({ success: false, message: 'No se ha proporcionado ningún archivo PDF' });
        return;
      }

      let fileUrl = '';
      const isSupabase = (process.env.STORAGE_PROVIDER === 'supabase');

      if (isSupabase) {
        const storageProvider = getStorageProvider();
        const stored = await storageProvider.saveFile({
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: 'application/pdf',
          buffer: file.buffer,
          size: file.size,
        });
        fileUrl = stored.url;
      } else {
        const pdfsDir = getPdfsDir();
        const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
        const safeOriginalName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const hash = crypto.randomBytes(8).toString('hex');
        const filename = `${safeOriginalName}-${hash}${ext}`;
        const targetPath = path.join(pdfsDir, filename);

        await fs.promises.writeFile(targetPath, file.buffer);
        fileUrl = `/uploads/pdfs/${filename}`;
      }

      // If productId was provided, also update product record directly
      if (productId) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            productType: 'DIGITAL',
            digitalFileUrl: fileUrl,
            digitalFileName: file.originalname,
            digitalFileSize: file.size,
          },
        });
      }

      res.status(201).json({
        success: true,
        data: {
          url: fileUrl,
          fileName: file.originalname,
          size: file.size,
        },
        message: 'Archivo PDF de diseño subido correctamente',
      });
    } catch (error: any) {
      console.error('Error subiendo PDF:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/admin/digital/delete-pdf — Remove a PDF design file
adminDigitalRouter.post(
  '/delete-pdf',
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { fileUrl, productId } = req.body;

      if (fileUrl) {
        if (process.env.STORAGE_PROVIDER === 'supabase' && fileUrl.includes('supabase.co')) {
          const storageProvider = getStorageProvider();
          // Extract path after bucket name
          const match = fileUrl.match(/\/object\/public\/[^/]+\/(.+)$/);
          if (match && match[1]) {
            await storageProvider.deleteFile(match[1]);
          }
        } else if (fileUrl.startsWith('/uploads/pdfs/')) {
          const filename = path.basename(fileUrl);
          const pdfsPath = path.join(getPdfsDir(), filename);
          if (fs.existsSync(pdfsPath)) {
            await fs.promises.unlink(pdfsPath);
          }
        }
      }

      if (productId) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            digitalFileUrl: null,
            digitalFileName: null,
            digitalFileSize: null,
          },
        });
      }

      res.json({
        success: true,
        message: 'Archivo PDF eliminado correctamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

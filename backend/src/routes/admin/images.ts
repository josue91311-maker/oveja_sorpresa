import { Router, Response } from 'express';
import multer from 'multer';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { getStorageProvider } from '../../services/storage';
import { adaptAndOptimizeImage } from '../../services/imageProcessor';

export const adminImagesRouter = Router();
adminImagesRouter.use(requireAuth);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Permite hasta 15MB de fotos de cámara/celular para adaptarlas
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// POST /api/admin/images/upload — upload and adapt image
adminImagesRouter.post(
  '/upload',
  upload.single('image'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { productId, purpose, fitMode, backgroundColor } = req.body;

      if (!file) {
        res.status(400).json({ success: false, message: 'No se ha proporcionado ninguna imagen' });
        return;
      }

      // Determine processing purpose: default to 'product' if not specified or if productId is present
      const imagePurpose = purpose || (productId ? 'product' : 'product');

      // Adapt and optimize image with Sharp (auto-orient EXIF, resize to standard dimensions, compress)
      const processed = await adaptAndOptimizeImage(file.buffer, file.originalname, {
        purpose: imagePurpose,
        fitMode: fitMode || 'auto',
        backgroundColor: backgroundColor || '#FFFFFF',
      });

      const baseName = file.originalname.replace(/\.[^/.]+$/, '');
      const finalOriginalName = `${baseName}${processed.extension}`;

      const storageProvider = getStorageProvider();
      const stored = await storageProvider.saveFile({
        fieldname: file.fieldname,
        originalname: finalOriginalName,
        encoding: file.encoding,
        mimetype: processed.mimeType,
        buffer: processed.buffer,
        size: processed.size,
      });

      let productImage = null;

      if (productId) {
        // Count existing images to set order and check if primary
        const count = await prisma.productImage.count({ where: { productId } });
        productImage = await prisma.productImage.create({
          data: {
            productId,
            url: stored.url,
            provider: stored.provider,
            path: stored.path,
            originalName: stored.originalName,
            mimeType: stored.mimeType,
            size: stored.size,
            order: count + 1,
            isPrimary: count === 0,
          },
        });
      }

      res.status(201).json({
        success: true,
        data: productImage || stored,
        dimensions: {
          width: processed.width,
          height: processed.height,
        },
        message: 'Imagen adaptada a la medida óptima y subida correctamente',
      });
    } catch (error: any) {
      console.error('Error procesando imagen:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/admin/images/:id — delete product image
adminImagesRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const img = await prisma.productImage.findUnique({ where: { id } });

    if (!img) {
      res.status(404).json({ success: false, message: 'Imagen no encontrada' });
      return;
    }

    const storageProvider = getStorageProvider();
    await storageProvider.deleteFile(img.path);
    await prisma.productImage.delete({ where: { id } });

    res.json({ success: true, message: 'Imagen eliminada correctamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/images/:id/primary — set image as primary
adminImagesRouter.patch('/:id/primary', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const img = await prisma.productImage.findUnique({ where: { id } });

    if (!img) {
      res.status(404).json({ success: false, message: 'Imagen no encontrada' });
      return;
    }

    // Set all other images for this product to not primary
    await prisma.productImage.updateMany({
      where: { productId: img.productId },
      data: { isPrimary: false },
    });

    // Set this one as primary
    const updated = await prisma.productImage.update({
      where: { id },
      data: { isPrimary: true },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Imagen establecida como principal',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';

export const adminBannersRouter = Router();
adminBannersRouter.use(requireAuth);

const bannerSchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  type: z.enum(['hero', 'promotional', 'announcement']).default('hero'),
  position: z.enum(['top', 'middle', 'bottom']).default('top'),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  bannerStyle: z.enum(['product', 'event']).default('product'),
  productId: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

// GET /api/admin/banners
adminBannersRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
      include: {
        product: {
          include: {
            images: { orderBy: { order: 'asc' } },
            category: true,
          },
        },
      },
    });
    res.json({ success: true, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/banners
adminBannersRouter.post(
  '/',
  validateBody(bannerSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const banner = await prisma.banner.create({
        data: {
          ...body,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
        },
      });
      res.status(201).json({ success: true, data: banner, message: 'Banner creado' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PUT /api/admin/banners/:id
adminBannersRouter.put(
  '/:id',
  validateBody(bannerSchema.partial()),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updated = await prisma.banner.update({
        where: { id },
        data: {
          ...body,
          startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : undefined,
          endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
        },
        include: {
          product: {
            include: {
              images: { orderBy: { order: 'asc' } },
              category: true,
            },
          },
        },
      });
      res.json({ success: true, data: updated, message: 'Banner actualizado' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/admin/banners/:id
adminBannersRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    res.json({ success: true, message: 'Banner eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

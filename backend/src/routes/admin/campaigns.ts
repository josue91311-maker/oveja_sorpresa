import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { generateSlug } from '../../utils/slug';

export const adminCampaignsRouter = Router();
adminCampaignsRouter.use(requireAuth);

const campaignSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.enum(['draft', 'active', 'scheduled', 'ended']).default('draft'),
  priority: z.number().int().default(0),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  themeConfig: z.any().optional().nullable(),
});

// GET /api/admin/campaigns
adminCampaignsRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { priority: 'desc' },
      include: {
        categories: {
          include: {
            category: { select: { id: true, name: true, slug: true, description: true } },
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                categoryId: true,
                images: { select: { url: true, isPrimary: true } },
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: campaigns.map((c) => ({
        ...c,
        themeConfig: c.themeConfig ? JSON.parse(c.themeConfig) : null,
        products: c.products.map((cp) => cp.product),
        categories: c.categories.map((cc) => cc.category),
        categoryIds: c.categories.map((cc) => cc.categoryId),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// POST /api/admin/campaigns
adminCampaignsRouter.post(
  '/',
  validateBody(campaignSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = req.body;
      let slug = generateSlug(body.name);

      const existing = await prisma.campaign.findUnique({ where: { slug } });
      if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

      const campaign = await prisma.campaign.create({
        data: {
          name: body.name.trim(),
          slug,
          description: body.description,
          imageUrl: body.imageUrl,
          bannerUrl: body.bannerUrl,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          status: body.status,
          priority: body.priority,
          themeConfig: body.themeConfig
            ? (typeof body.themeConfig === 'string' ? body.themeConfig : JSON.stringify(body.themeConfig))
            : null,
          products: body.productIds && body.productIds.length > 0
            ? {
                create: body.productIds.map((pid: string) => ({ productId: pid })),
              }
            : undefined,
          categories: body.categoryIds && body.categoryIds.length > 0
            ? {
                create: body.categoryIds.map((cid: string) => ({ categoryId: cid })),
              }
            : undefined,
        },
        include: {
          products: { include: { product: true } },
          categories: { include: { category: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campaña creada exitosamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PUT /api/admin/campaigns/:id
adminCampaignsRouter.put(
  '/:id',
  validateBody(campaignSchema.partial()),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;

      // Handle product associations if provided
      if (body.productIds) {
        await prisma.campaignProduct.deleteMany({ where: { campaignId: id } });
        await prisma.campaignProduct.createMany({
          data: body.productIds.map((pid: string) => ({ campaignId: id, productId: pid })),
        });
      }

      // Handle category/catalog associations if provided
      if (body.categoryIds !== undefined) {
        await prisma.campaignCategory.deleteMany({ where: { campaignId: id } });
        if (body.categoryIds.length > 0) {
          await prisma.campaignCategory.createMany({
            data: body.categoryIds.map((cid: string) => ({ campaignId: id, categoryId: cid })),
          });
        }
      }

      const updated = await prisma.campaign.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          imageUrl: body.imageUrl,
          bannerUrl: body.bannerUrl,
          startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : undefined,
          endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
          status: body.status,
          priority: body.priority,
          themeConfig: body.themeConfig !== undefined
            ? (body.themeConfig ? (typeof body.themeConfig === 'string' ? body.themeConfig : JSON.stringify(body.themeConfig)) : null)
            : undefined,
        },
        include: {
          products: { include: { product: true } },
        },
      });


      res.json({
        success: true,
        data: updated,
        message: 'Campaña actualizada',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/admin/campaigns/:id
adminCampaignsRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.campaign.delete({ where: { id } });
    res.json({ success: true, message: 'Campaña eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

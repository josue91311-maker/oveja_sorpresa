import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { generateSlug } from '../../utils/slug';

export const adminCategoriesRouter = Router();
adminCategoriesRouter.use(requireAuth);

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

// GET /api/admin/categories
adminCategoriesRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        productCount: c._count.products,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/categories
adminCategoriesRouter.post(
  '/',
  validateBody(categorySchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = req.body;
      let slug = generateSlug(body.name);

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

      const category = await prisma.category.create({
        data: {
          name: body.name.trim(),
          slug,
          description: body.description,
          imageUrl: body.imageUrl,
          parentId: body.parentId || null,
          order: body.order,
          active: body.active,
        },
      });

      res.status(201).json({
        success: true,
        data: category,
        message: 'Categoría creada exitosamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PUT /api/admin/categories/:id
adminCategoriesRouter.put(
  '/:id',
  validateBody(categorySchema.partial()),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;

      const updated = await prisma.category.update({
        where: { id },
        data: body,
      });

      res.json({
        success: true,
        data: updated,
        message: 'Categoría actualizada exitosamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/admin/categories/:id
adminCategoriesRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

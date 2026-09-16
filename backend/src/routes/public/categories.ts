import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const publicCategoriesRouter = Router();

// GET /api/categories — active categories
publicCategoriesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { published: true, status: 'active' },
            },
          },
        },
      },
    });

    const data = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      order: cat.order,
      productCount: cat._count.products,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

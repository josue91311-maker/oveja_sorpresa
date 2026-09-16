import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

export const adminPublicationsRouter = Router();
adminPublicationsRouter.use(requireAuth);

// GET /api/admin/publications
adminPublicationsRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const publications = await prisma.publication.findMany({
      include: {
        product: {
          include: {
            images: { orderBy: { order: 'asc' } },
            category: true,
          },
        },
        collection: true,
      },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: publications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/publications/:id — update publication
adminPublicationsRouter.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { visible, featured, position, publicTitle, publicDescription, primaryImageUrl, order } = req.body;

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        visible,
        featured,
        position,
        publicTitle,
        publicDescription,
        primaryImageUrl,
        order,
      },
    });

    res.json({ success: true, data: updated, message: 'Publicación actualizada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

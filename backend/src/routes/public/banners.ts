import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const publicBannersRouter = Router();

// GET /api/banners — active banners
publicBannersRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const now = new Date();

    const whereClause: any = {
      active: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    };

    if (type) {
      whereClause.type = String(type);
    }

    const banners = await prisma.banner.findMany({
      where: whereClause,
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

    res.json({
      success: true,
      data: banners,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

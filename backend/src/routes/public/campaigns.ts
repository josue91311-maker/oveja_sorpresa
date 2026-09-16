import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { calculateProductPrice } from '../../utils/pricing';

export const publicCampaignsRouter = Router();

// GET /api/campaigns — active campaigns with associated products
publicCampaignsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'active',
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: { priority: 'desc' },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' } },
                discounts: { where: { active: true } },
              },
            },
          },
        },
      },
    });

    const data = campaigns.map((camp) => ({
      id: camp.id,
      name: camp.name,
      slug: camp.slug,
      description: camp.description,
      imageUrl: camp.imageUrl,
      bannerUrl: camp.bannerUrl,
      priority: camp.priority,
      themeConfig: camp.themeConfig ? JSON.parse(camp.themeConfig) : null,
      products: camp.products

        .filter((cp) => cp.product.published && cp.product.status === 'active')
        .map((cp) => {
          const p = cp.product;
          const pricing = calculateProductPrice(p.price, p.previousPrice, p.discounts as any);
          const primaryImage = p.images.find((img) => img.isPrimary) || p.images[0] || null;

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription,
            price: pricing.basePrice,
            finalPrice: pricing.finalPrice,
            discountPercentage: pricing.discountPercentage,
            primaryImage,
          };
        }),
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/campaigns/:slug — single campaign catalog by slug
publicCampaignsRouter.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const camp = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        categories: {
          include: { category: true },
        },
        products: {
          include: {
            product: {
              include: {
                category: true,
                collection: true,
                images: { orderBy: { order: 'asc' } },
                discounts: { where: { active: true } },
              },
            },
          },
        },
      },
    });

    if (!camp || camp.status !== 'active') {
      res.status(404).json({ success: false, message: 'Campaña no encontrada o no activa' });
      return;
    }

    // Direct campaign products
    const directProducts = camp.products
      .filter((cp) => cp.product.published && cp.product.status === 'active')
      .map((cp) => cp.product);

    // Products from attached categories/catalogs
    const categoryIds = camp.categories.map((c) => c.categoryId);
    let categoryProducts: any[] = [];
    if (categoryIds.length > 0) {
      categoryProducts = await prisma.product.findMany({
        where: {
          categoryId: { in: categoryIds },
          published: true,
          status: 'active',
        },
        include: {
          category: true,
          collection: true,
          images: { orderBy: { order: 'asc' } },
          discounts: { where: { active: true } },
        },
      });
    }

    // Merge and deduplicate by ID
    const productMap = new Map<string, any>();
    directProducts.forEach((p) => productMap.set(p.id, p));
    categoryProducts.forEach((p) => productMap.set(p.id, p));

    const products = Array.from(productMap.values()).map((p) => {
      const pricing = calculateProductPrice(p.price, p.previousPrice, p.discounts as any);
      const primaryImage = p.images?.find((img: any) => img.isPrimary) || p.images?.[0] || null;

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        price: pricing.basePrice,
        previousPrice: pricing.previousPrice,
        finalPrice: pricing.finalPrice,
        discountPercentage: pricing.discountPercentage,
        category: p.category,
        collection: p.collection,
        primaryImage,
        images: p.images,
      };
    });

    res.json({
      success: true,
      data: {
        id: camp.id,
        name: camp.name,
        slug: camp.slug,
        description: camp.description,
        imageUrl: camp.imageUrl,
        bannerUrl: camp.bannerUrl,
        priority: camp.priority,
        themeConfig: camp.themeConfig ? JSON.parse(camp.themeConfig) : null,
        categories: camp.categories.map((cc) => cc.category),
        products,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});


import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { calculateProductPrice } from '../../utils/pricing';

export const publicProductsRouter = Router();

// GET /api/products — list of published products
publicProductsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, collection, featured, search } = req.query;

    const whereClause: any = {
      published: true,
      status: 'active',
    };

    if (category) {
      whereClause.category = { slug: String(category) };
    }

    if (collection) {
      whereClause.collection = { slug: String(collection) };
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { shortDescription: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const rawProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        collection: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
        discounts: { where: { active: true } },
        publications: { where: { visible: true }, take: 1 },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const products = rawProducts.map((p) => {
      const pricing = calculateProductPrice(p.price, p.previousPrice, p.discounts as any);
      const pub = p.publications[0];
      const primaryImage = p.images.find((img) => img.isPrimary) || p.images[0] || null;

      return {
        id: p.id,
        sku: p.sku,
        name: pub?.publicTitle || p.name,
        originalName: p.name,
        slug: p.slug,
        shortDescription: pub?.publicDescription || p.shortDescription,
        description: p.description,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        category: p.category,
        collection: p.collection,
        price: pricing.basePrice,
        previousPrice: pricing.previousPrice,
        finalPrice: pricing.finalPrice,
        discountPercentage: pricing.discountPercentage,
        activeDiscount: pricing.activeDiscount,
        status: p.status,
        published: p.published,
        featured: pub?.featured ?? p.featured,
        isNew: p.isNew,
        stock: p.stock,
        productType: p.productType || 'PHYSICAL',
        digitalFileName: p.digitalFileName,
        digitalFileSize: p.digitalFileSize,
        digitalFileUrl: p.digitalFileUrl,
        images: p.images,
        primaryImage: pub?.primaryImageUrl ? { url: pub.primaryImageUrl } : primaryImage,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:slug — single product detail
publicProductsRouter.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        collection: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
        discounts: { where: { active: true } },
        publications: { where: { visible: true }, take: 1 },
      },
    });

    if (!p || !p.published || p.status !== 'active') {
      res.status(404).json({ success: false, message: 'Producto no encontrado o no disponible' });
      return;
    }

    const pricing = calculateProductPrice(p.price, p.previousPrice, p.discounts as any);
    const pub = p.publications[0];
    const primaryImage = p.images.find((img) => img.isPrimary) || p.images[0] || null;

    res.json({
      success: true,
      data: {
        id: p.id,
        sku: p.sku,
        name: pub?.publicTitle || p.name,
        originalName: p.name,
        slug: p.slug,
        shortDescription: pub?.publicDescription || p.shortDescription,
        description: p.description,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        category: p.category,
        collection: p.collection,
        price: pricing.basePrice,
        previousPrice: pricing.previousPrice,
        finalPrice: pricing.finalPrice,
        discountPercentage: pricing.discountPercentage,
        activeDiscount: pricing.activeDiscount,
        status: p.status,
        published: p.published,
        featured: pub?.featured ?? p.featured,
        isNew: p.isNew,
        stock: p.stock,
        productType: p.productType || 'PHYSICAL',
        digitalFileName: p.digitalFileName,
        digitalFileSize: p.digitalFileSize,
        digitalFileUrl: p.digitalFileUrl,
        images: p.images,
        primaryImage: pub?.primaryImageUrl ? { url: pub.primaryImageUrl } : primaryImage,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { generateSlug } from '../../utils/slug';
import { calculateProductPrice } from '../../utils/pricing';

export const adminProductsRouter = Router();

// Apply auth to all admin product routes
adminProductsRouter.use(requireAuth);

const productSchema = z.object({
  sku: z.string().min(2, 'El SKU es requerido'),
  name: z.string().min(2, 'El nombre es requerido'),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  price: z.number().min(0, 'El precio debe ser positivo'),
  previousPrice: z.number().optional().nullable(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  stock: z.number().int().min(0).default(0),
  productType: z.enum(['PHYSICAL', 'DIGITAL']).default('PHYSICAL').optional(),
  digitalFileUrl: z.string().optional().nullable(),
  digitalFileName: z.string().optional().nullable(),
  digitalFileSize: z.number().optional().nullable(),
});

// GET /api/admin/products — all products with filtering
adminProductsRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, category, search, productType } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = String(status);
    if (category) whereClause.categoryId = String(category);
    if (productType) whereClause.productType = String(productType);
    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { sku: { contains: String(search) } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        collection: true,
        images: { orderBy: { order: 'asc' } },
        discounts: true,
        publications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = products.map((p) => {
      const pricing = calculateProductPrice(p.price, p.previousPrice, p.discounts as any);
      return {
        ...p,
        finalPrice: pricing.finalPrice,
        discountPercentage: pricing.discountPercentage,
        activeDiscount: pricing.activeDiscount,
      };
    });

    res.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/products/:id
adminProductsRouter.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { order: 'asc' } },
        discounts: true,
        publications: true,
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const pricing = calculateProductPrice(product.price, product.previousPrice, product.discounts as any);

    res.json({
      success: true,
      data: {
        ...product,
        finalPrice: pricing.finalPrice,
        discountPercentage: pricing.discountPercentage,
        activeDiscount: pricing.activeDiscount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/products — create product
adminProductsRouter.post(
  '/',
  validateBody(productSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = req.body;
      let slug = generateSlug(body.name);

      // Ensure unique slug
      const existingSlug = await prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const product = await prisma.product.create({
        data: {
          sku: body.sku.trim(),
          name: body.name.trim(),
          slug,
          shortDescription: body.shortDescription,
          description: body.description,
          categoryId: body.categoryId || null,
          collectionId: body.collectionId || null,
          price: body.price,
          previousPrice: body.previousPrice || null,
          status: body.status,
          published: body.published,
          featured: body.featured,
          isNew: body.isNew,
          stock: body.stock,
          productType: body.productType || 'PHYSICAL',
          digitalFileUrl: body.digitalFileUrl || null,
          digitalFileName: body.digitalFileName || null,
          digitalFileSize: body.digitalFileSize || null,
          createdBy: req.user?.email || 'admin',
          publications: {
            create: {
              visible: body.published,
              featured: body.featured,
              publicTitle: body.name,
              publicDescription: body.shortDescription,
            },
          },
        },
        include: {
          category: true,
          collection: true,
          images: true,
          publications: true,
        },
      });

      res.status(201).json({
        success: true,
        data: product,
        message: 'Producto creado exitosamente',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ success: false, message: 'Ya existe un producto con ese SKU' });
        return;
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PUT /api/admin/products/:id — update product
adminProductsRouter.put(
  '/:id',
  validateBody(productSchema.partial()),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;

      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
        return;
      }

      let slug = existing.slug;
      if (body.name && body.name !== existing.name) {
        slug = generateSlug(body.name);
        const slugExists = await prisma.product.findFirst({
          where: { slug, id: { not: id } },
        });
        if (slugExists) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
      }

      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...body,
          slug,
          updatedBy: req.user?.email || 'admin',
        },
        include: {
          category: true,
          collection: true,
          images: { orderBy: { order: 'asc' } },
          discounts: true,
          publications: true,
        },
      });

      // Synchronize publication if published flag changed
      if (body.published !== undefined) {
        await prisma.publication.updateMany({
          where: { productId: id },
          data: { visible: body.published },
        });
      }

      res.json({
        success: true,
        data: updated,
        message: 'Producto actualizado exitosamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// POST /api/admin/products/:id/duplicate — duplicate product
adminProductsRouter.post('/:id/duplicate', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const source = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!source) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newSku = `${source.sku}-COPIA-${randomSuffix}`;
    const newName = `${source.name} (Copia)`;
    const newSlug = generateSlug(`${newName}-${randomSuffix}`);

    const copy = await prisma.product.create({
      data: {
        sku: newSku,
        name: newName,
        slug: newSlug,
        shortDescription: source.shortDescription,
        description: source.description,
        categoryId: source.categoryId,
        collectionId: source.collectionId,
        price: source.price,
        previousPrice: source.previousPrice,
        status: 'draft',
        published: false,
        featured: false,
        isNew: true,
        stock: source.stock,
        createdBy: req.user?.email || 'admin',
        images: {
          create: source.images.map((img) => ({
            url: img.url,
            provider: img.provider,
            path: img.path,
            originalName: img.originalName,
            mimeType: img.mimeType,
            size: img.size,
            order: img.order,
            isPrimary: img.isPrimary,
          })),
        },
        publications: {
          create: {
            visible: false,
            featured: false,
            publicTitle: newName,
            publicDescription: source.shortDescription,
          },
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      data: copy,
      message: 'Producto duplicado correctamente',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/products/:id/publish — toggle publication
adminProductsRouter.patch('/:id/publish', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const newPublished = !product.published;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        published: newPublished,
        status: newPublished ? 'active' : product.status,
      },
    });

    await prisma.publication.updateMany({
      where: { productId: id },
      data: { visible: newPublished },
    });

    res.json({
      success: true,
      data: updated,
      message: newPublished ? 'Producto publicado' : 'Producto despublicado',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/products/:id/feature — toggle featured
adminProductsRouter.patch('/:id/feature', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { featured: !product.featured },
    });

    await prisma.publication.updateMany({
      where: { productId: id },
      data: { featured: updated.featured },
    });

    res.json({
      success: true,
      data: updated,
      message: updated.featured ? 'Producto marcado como destacado' : 'Producto desmarcado de destacados',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/products/:id — delete product
adminProductsRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

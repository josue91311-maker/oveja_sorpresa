import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';

export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireAuth);

const settingsSchema = z.object({
  businessName: z.string().min(2),
  description: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  whatsappMessage: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  generalTexts: z.any().optional().nullable(),
  schedules: z.any().optional().nullable(),
});

// GET /api/admin/settings
adminSettingsRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let settings = await prisma.businessSettings.findUnique({ where: { id: 'main' } });
    if (!settings) {
      settings = await prisma.businessSettings.create({
        data: {
          id: 'main',
          businessName: 'Ovejita Sorpresas',
          whatsappNumber: '986951425',
        },
      });
    }

    res.json({
      success: true,
      data: {
        ...settings,
        generalTexts: settings.generalTexts ? JSON.parse(settings.generalTexts) : null,
        schedules: settings.schedules ? JSON.parse(settings.schedules) : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/settings
adminSettingsRouter.put(
  '/',
  validateBody(settingsSchema.partial()),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const dataToUpdate: any = { ...body };

      if (body.generalTexts !== undefined) {
        dataToUpdate.generalTexts = typeof body.generalTexts === 'string'
          ? body.generalTexts
          : JSON.stringify(body.generalTexts);
      }

      if (body.schedules !== undefined) {
        dataToUpdate.schedules = typeof body.schedules === 'string'
          ? body.schedules
          : JSON.stringify(body.schedules);
      }

      const updated = await prisma.businessSettings.upsert({
        where: { id: 'main' },
        update: dataToUpdate,
        create: {
          id: 'main',
          ...dataToUpdate,
        },
      });

      res.json({
        success: true,
        data: {
          ...updated,
          generalTexts: updated.generalTexts ? JSON.parse(updated.generalTexts) : null,
          schedules: updated.schedules ? JSON.parse(updated.schedules) : null,
        },
        message: 'Configuración del negocio actualizada exitosamente',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

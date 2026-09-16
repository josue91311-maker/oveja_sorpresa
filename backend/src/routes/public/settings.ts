import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const publicSettingsRouter = Router();

// GET /api/settings — public business configuration (WhatsApp, networks, branding)
publicSettingsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'main' },
    });

    if (!settings) {
      res.json({
        success: true,
        data: {
          businessName: 'Ovejita Sorpresas',
          whatsappNumber: '986951425',
          whatsappMessage: 'Hola Ovejita Sorpresas, quiero hacer un pedido',
          email: 'contacto@ovejitasorpresas.com',
          instagram: 'https://instagram.com/ovejitasorpresas',
          logoUrl: '/images/LOGO.jpg',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: settings.id,
        businessName: settings.businessName,
        description: settings.description,
        whatsappNumber: settings.whatsappNumber,
        contactNumber: settings.contactNumber,
        whatsappMessage: settings.whatsappMessage,
        email: settings.email,
        instagram: settings.instagram,
        facebook: settings.facebook,
        tiktok: settings.tiktok,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        generalTexts: settings.generalTexts ? JSON.parse(settings.generalTexts) : null,
        schedules: settings.schedules ? JSON.parse(settings.schedules) : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

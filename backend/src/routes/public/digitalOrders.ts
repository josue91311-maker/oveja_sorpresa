import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';

export const publicDigitalOrdersRouter = Router();

/**
 * POST /api/digital/orders/create
 * 
 * Endpoint preparado para la pasarela de pagos (Izipay / Mercado Pago / Culqi).
 * Actualmente funciona en modo simulación (demo) para entregar el link de descarga
 * inmediatamente tras ingresar los datos y confirmar el pago.
 * 
 * Cuando se integre la pasarela oficial:
 * 1. Aquí se llamará al SDK de la pasarela (ej: mercadopago.preferences.create / izipay.createToken).
 * 2. Se retornará el preferenceId o checkoutUrl de la pasarela.
 * 3. En el webhook (/api/digital/orders/webhook) se validará el pago real y se liberará la descarga.
 */
publicDigitalOrdersRouter.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, customerEmail, customerName, customerPhone, paymentMethod } = req.body;

    if (!customerEmail || !customerEmail.includes('@')) {
      res.status(400).json({ success: false, message: 'Ingresa un correo electrónico válido' });
      return;
    }

    let product = null;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });
    }

    // Default sample file fallback if product doesn't have one
    const downloadUrl = product?.digitalFileUrl || '/uploads/pdfs/test-diseno.pdf';
    const fileName = product?.digitalFileName || 'test-diseno.pdf';
    const orderNumber = `OVEJITA-PDF-${Date.now().toString().slice(-6)}`;
    const downloadToken = crypto.randomBytes(16).toString('hex');

    // Simulate payment approval (ready for live gateway)
    res.status(200).json({
      success: true,
      order: {
        orderNumber,
        productName: product?.name || 'Diseño Digital en PDF',
        price: product?.price || 15.00,
        customerEmail,
        customerName: customerName || 'Cliente Ovejita',
        customerPhone: customerPhone || '',
        paymentMethod: paymentMethod || 'YAPE',
        status: 'COMPLETED',
        downloadUrl,
        fileName,
        downloadToken,
        createdAt: new Date().toISOString(),
      },
      message: 'Pago confirmado. Tu diseño digital está listo para descargar.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

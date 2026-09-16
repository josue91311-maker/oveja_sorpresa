import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Ovejita Sorpresas...');

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash('OvejitaAdmin2025!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ovejitasorpresas.com' },
    update: {
      password: adminPasswordHash,
      name: 'Administrador Ovejita',
      role: 'admin',
    },
    create: {
      email: 'admin@ovejitasorpresas.com',
      password: adminPasswordHash,
      name: 'Administrador Ovejita',
      role: 'admin',
      active: true,
    },
  });
  console.log('👤 Admin user seeded:', admin.email);

  // 2. Business Settings
  const settings = await prisma.businessSettings.upsert({
    where: { id: 'main' },
    update: {
      businessName: 'Ovejita Sorpresas',
      description: 'Tienda de Regalos & Papelería con Propósito',
      whatsappNumber: '986951425',
      contactNumber: '986951425',
      whatsappMessage: 'Hola Ovejita Sorpresas, quiero hacer un pedido con dedicatoria gratis',
      email: 'contacto@ovejitasorpresas.com',
      instagram: 'https://instagram.com/ovejitasorpresas',
      facebook: 'https://facebook.com/ovejitasorpresas',
      tiktok: 'https://tiktok.com/@ovejitasorpresas',
      logoUrl: '/images/LOGO.jpg',
      faviconUrl: '/images/LOGO.jpg',
      generalTexts: JSON.stringify({
        announcementText: 'Ediciones con propósito · Dedicatoria & personalización',
        heroTag: 'Edición Coleccionable • Primavera con Propósito',
        heroTitle: 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
        heroSubtitle: 'Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad a través de versículos grabados en el alma, anillados artesanales y empaques fragantes listos para entregar.',
        corporateTitle: '¿Retiros de damas, congresos o fechas especiales?',
        corporateSubtitle: 'Personalizamos portadas con tu versículo favorito, fecha o nombre de la agasajada a partir de 10 unidades con precios especiales.',
      }),
      schedules: JSON.stringify({
        attention: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
        delivery: 'Despachos nacionales a todo el país',
      }),
    },
    create: {
      id: 'main',
      businessName: 'Ovejita Sorpresas',
      description: 'Tienda de Regalos & Papelería con Propósito',
      whatsappNumber: '986951425',
      contactNumber: '986951425',
      whatsappMessage: 'Hola Ovejita Sorpresas, quiero hacer un pedido con dedicatoria gratis',
      email: 'contacto@ovejitasorpresas.com',
      instagram: 'https://instagram.com/ovejitasorpresas',
      facebook: 'https://facebook.com/ovejitasorpresas',
      tiktok: 'https://tiktok.com/@ovejitasorpresas',
      logoUrl: '/images/LOGO.jpg',
      faviconUrl: '/images/LOGO.jpg',
      generalTexts: JSON.stringify({
        announcementText: 'Ediciones con propósito · Dedicatoria & personalización',
        heroTag: 'Edición Coleccionable • Primavera con Propósito',
        heroTitle: 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
        heroSubtitle: 'Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad a través de versículos grabados en el alma, anillados artesanales y empaques fragantes listos para entregar.',
        corporateTitle: '¿Retiros de damas, congresos o fechas especiales?',
        corporateSubtitle: 'Personalizamos portadas con tu versículo favorito, fecha o nombre de la agasajada a partir de 10 unidades con precios especiales.',
      }),
      schedules: JSON.stringify({
        attention: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
        delivery: 'Despachos nacionales a todo el país',
      }),
    },
  });
  console.log('⚙️ Business settings seeded (WhatsApp:', settings.whatsappNumber, ')');

  // 3. Categories
  const catLibretas = await prisma.category.upsert({
    where: { slug: 'libretas-cuadernos' },
    update: {},
    create: {
      name: 'Libretas & Cuadernos',
      slug: 'libretas-cuadernos',
      description: 'Cuadernos y libretas con anillado artesanal y versículos inspiradores',
      order: 1,
      active: true,
    },
  });

  const catKits = await prisma.category.upsert({
    where: { slug: 'kits-con-espejo' },
    update: {},
    create: {
      name: 'Kits con Espejo & Llavero',
      slug: 'kits-con-espejo',
      description: 'Sets completos con libreta, llavero con espejo forma flor y bolígrafo',
      order: 2,
      active: true,
    },
  });

  const catJournaling = await prisma.category.upsert({
    where: { slug: 'cuadernos-a5-journaling' },
    update: {},
    create: {
      name: 'Cuadernos A5 Journaling',
      slug: 'cuadernos-a5-journaling',
      description: 'Cuadernos A5 de tapa dura con elástico y dije floral protector',
      order: 3,
      active: true,
    },
  });

  const catSets = await prisma.category.upsert({
    where: { slug: 'sets-de-regalo' },
    update: {},
    create: {
      name: 'Sets de Regalo con Bolígrafo',
      slug: 'sets-de-regalo',
      description: 'Detalles de papelería listos para regalar con dedicatoria',
      order: 4,
      active: true,
    },
  });
  console.log('📁 Categories seeded: 4 categories');

  // 4. Collections
  const colGracia = await prisma.collection.upsert({
    where: { slug: 'coleccion-gracia' },
    update: {},
    create: {
      name: 'Colección Gracia',
      slug: 'coleccion-gracia',
      description: 'Inspirada en la fidelidad y el descanso en el Señor',
      order: 1,
      active: true,
    },
  });

  const colPaz = await prisma.collection.upsert({
    where: { slug: 'salmos-de-paz' },
    update: {},
    create: {
      name: 'Colección Salmos de Paz',
      slug: 'salmos-de-paz',
      description: 'Versículos de consuelo y serenidad para cada día',
      order: 2,
      active: true,
    },
  });

  const colEsperanza = await prisma.collection.upsert({
    where: { slug: 'coleccion-esperanza' },
    update: {},
    create: {
      name: 'Colección Esperanza',
      slug: 'coleccion-esperanza',
      description: 'Promesas de nuevos manantiales y gozo renovado',
      order: 3,
      active: true,
    },
  });
  console.log('🏷️ Collections seeded: 3 collections');

  // 5. Products (DEMO data mapped to real Stitch products and multiple real photos in Soles)
  // Product 1: Cuaderno Floral A5 'Deléitate'
  const prod1 = await prisma.product.upsert({
    where: { sku: 'DEMO-CUAD-DEL-01' },
    update: {
      price: 36.00,
      previousPrice: 42.00,
      featured: true,
      published: true,
      images: {
        deleteMany: {},
        create: [
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 2,
            isPrimary: false,
          },
          {
            url: '/images/libreta2.png',
            provider: 'local',
            path: 'libreta2.png',
            originalName: 'libreta2.png',
            mimeType: 'image/png',
            size: 350142,
            order: 3,
            isPrimary: false,
          },
        ],
      },
    },
    create: {
      sku: 'DEMO-CUAD-DEL-01',
      name: "Cuaderno Floral A5 'Deléitate'",
      slug: 'cuaderno-floral-a5-deleitaste',
      shortDescription: 'Tapa dura laminada mate con stamping floral, elástico ajustable y flor esmaltada protectora. Salmo 37:4.',
      description: 'Diseñado para journaling, devocionales y notas de estudio. Encuadernación wire-o oro viejo segmentado, flor esmaltada sujeta-elástico y 80 hojas bond de 90g resistentes a plumas y resaltadores.',
      categoryId: catJournaling.id,
      collectionId: colGracia.id,
      price: 36.00,
      previousPrice: 42.00,
      status: 'active',
      published: true,
      featured: true,
      isNew: false,
      stock: 25,
      images: {
        create: [
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 2,
            isPrimary: false,
          },
          {
            url: '/images/libreta2.png',
            provider: 'local',
            path: 'libreta2.png',
            originalName: 'libreta2.png',
            mimeType: 'image/png',
            size: 350142,
            order: 3,
            isPrimary: false,
          },
        ],
      },
      publications: {
        create: {
          visible: true,
          featured: true,
          position: 1,
          publicTitle: "Cuaderno Floral A5 'Deléitate'",
          publicDescription: 'Salmo 37:4 • Tapa Extra Rígida con flor esmaltada',
          primaryImageUrl: '/images/libreta3.png',
          order: 1,
        },
      },
    },
  });

  // Product 2: Set Serenidad Floral — Salmo 46:10
  const prod2 = await prisma.product.upsert({
    where: { sku: 'DEMO-SET-SER-02' },
    update: {
      price: 38.50,
      previousPrice: null,
      featured: true,
      published: true,
      images: {
        deleteMany: {},
        create: [
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 2,
            isPrimary: false,
          },
        ],
      },
    },
    create: {
      sku: 'DEMO-SET-SER-02',
      name: 'Set Serenidad Floral — Salmo 46:10',
      slug: 'set-serenidad-floral-salmo-46-10',
      shortDescription: 'Libreta alargada de bolsillo "Estad quietos y conoced que yo soy Dios", llavero espejo flor, borla artesanal y bolígrafo pastel.',
      description: 'Set completo de obsequio. Incluye libreta de anillado superior dorado 360°, llavero espejo flor con placa "Eres una mujer virtuosa", bolígrafo blush de escritura suave y tarjeta "Dios es Amor". Empacado listo para regalo.',
      categoryId: catKits.id,
      collectionId: colPaz.id,
      price: 38.50,
      previousPrice: null,
      status: 'active',
      published: true,
      featured: true,
      isNew: false,
      stock: 18,
      images: {
        create: [
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 2,
            isPrimary: false,
          },
        ],
      },
      publications: {
        create: {
          visible: true,
          featured: true,
          position: 2,
          publicTitle: "Set Serenidad Floral 'Estad Quietos'",
          publicDescription: 'Salmos 46:10 • Trilogía Rosa Pastel con Llavero Espejo',
          primaryImageUrl: '/images/libreta1.png',
          order: 2,
        },
      },
    },
  });

  // Product 3: Set Arcoíris & Esperanza — Salmo 84:6
  const prod3 = await prisma.product.upsert({
    where: { sku: 'DEMO-SET-ARC-03' },
    update: {
      price: 38.50,
      previousPrice: null,
      featured: false,
      published: true,
      images: {
        deleteMany: {},
        create: [
          {
            url: '/images/libreta2.png',
            provider: 'local',
            path: 'libreta2.png',
            originalName: 'libreta2.png',
            mimeType: 'image/png',
            size: 350142,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 2,
            isPrimary: false,
          },
        ],
      },
    },
    create: {
      sku: 'DEMO-SET-ARC-03',
      name: 'Set Arcoíris & Esperanza — Salmo 84:6',
      slug: 'set-arcoiris-esperanza-salmo-84-6',
      shortDescription: 'Ilustración bohemia con la promesa del Salmo 84:6, espejo amarillo margarita con placa y bolígrafo al tono.',
      description: 'Promesa: "Cuando anden por el Valle del llanto, se convertirá en un lugar de manantiales refrescantes". Libreta de escritorio bolsillo, espejo flor amarillo sol, bolígrafo suave y miniprint "Dios es bueno".',
      categoryId: catKits.id,
      collectionId: colEsperanza.id,
      price: 38.50,
      previousPrice: null,
      status: 'active',
      published: true,
      featured: false,
      isNew: false,
      stock: 14,
      images: {
        create: [
          {
            url: '/images/libreta2.png',
            provider: 'local',
            path: 'libreta2.png',
            originalName: 'libreta2.png',
            mimeType: 'image/png',
            size: 350142,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta1.png',
            provider: 'local',
            path: 'libreta1.png',
            originalName: 'libreta1.png',
            mimeType: 'image/png',
            size: 453270,
            order: 2,
            isPrimary: false,
          },
        ],
      },
      publications: {
        create: {
          visible: true,
          featured: false,
          position: 3,
          publicTitle: "Set Arcoíris 'Manantiales de Gozo'",
          publicDescription: 'Salmos 84:6 • Tono Cálido Miel & Mostaza',
          primaryImageUrl: '/images/libreta2.png',
          order: 3,
        },
      },
    },
  });

  // Product 4: Planificador Semanal Personalizado
  const prod4 = await prisma.product.upsert({
    where: { sku: 'DEMO-PLAN-SEM-04' },
    update: {
      price: 32.00,
      previousPrice: 38.00,
      featured: false,
      published: true,
      images: {
        deleteMany: {},
        create: [
          {
            url: '/images/planificador1.png',
            provider: 'local',
            path: 'planificador1.png',
            originalName: 'planificador1.png',
            mimeType: 'image/png',
            size: 417201,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 2,
            isPrimary: false,
          },
        ],
      },
    },
    create: {
      sku: 'DEMO-PLAN-SEM-04',
      name: 'Planificador Semanal Personalizado',
      slug: 'planificador-semanal-personalizado',
      shortDescription: 'Planificador semanal con banda elástica, dije protector y portada personalizada con nombre.',
      description: 'Ideal para organizar tus turnos, metas y jornadas semanales. Hojas de 90g con diagramación clara, anillado doble metálico y portada reforzada con laminado mate aterciopelado.',
      categoryId: catLibretas.id,
      collectionId: colGracia.id,
      price: 32.00,
      previousPrice: 38.00,
      status: 'active',
      published: true,
      featured: false,
      isNew: true,
      stock: 10,
      discounts: {
        create: {
          type: 'percentage',
          value: 15,
          active: true,
        },
      },
      images: {
        create: [
          {
            url: '/images/planificador1.png',
            provider: 'local',
            path: 'planificador1.png',
            originalName: 'planificador1.png',
            mimeType: 'image/png',
            size: 417201,
            order: 1,
            isPrimary: true,
          },
          {
            url: '/images/libreta3.png',
            provider: 'local',
            path: 'libreta3.png',
            originalName: 'libreta3.png',
            mimeType: 'image/png',
            size: 435004,
            order: 2,
            isPrimary: false,
          },
        ],
      },
      publications: {
        create: {
          visible: true,
          featured: false,
          position: 4,
          publicTitle: 'Planificador Semanal Personalizado',
          publicDescription: 'Nuevo ingreso • Organización con encanto artesanal',
          primaryImageUrl: '/images/planificador1.png',
          order: 4,
        },
      },
    },
  });
  console.log('📦 Products seeded: 4 products with multiple images and prices in Soles (S/)');


  // 6. Campaign
  const campaign = await prisma.campaign.upsert({
    where: { slug: 'primavera-con-proposito' },
    update: {},
    create: {
      name: 'Edición Coleccionable • Primavera con Propósito',
      slug: 'primavera-con-proposito',
      description: 'Papelería con versículos para atesorar momentos y regalar sonrisas en esta temporada.',
      imageUrl: '/images/libreta3.png',
      bannerUrl: '/images/libreta3.png',
      status: 'active',
      priority: 10,
      products: {
        create: [
          { productId: prod1.id },
          { productId: prod2.id },
          { productId: prod3.id },
        ]
      }
    },
  });
  console.log('🌸 Campaign seeded:', campaign.name);

  // 7. Banners
  const bannerHero = await prisma.banner.upsert({
    where: { id: 'banner-hero-1' },
    update: {},
    create: {
      id: 'banner-hero-1',
      title: 'Papelería hecha a mano para atesorar momentos y regalar sonrisas.',
      subtitle: 'Cada cuaderno y set de obsequio nace con una promesa: inspirar tu cotidianidad.',
      imageUrl: '/images/libreta3.png',
      linkUrl: '#catalogo',
      linkText: 'Explorar el Catálogo Floral',
      type: 'hero',
      position: 'top',
      order: 1,
      active: true,
    },
  });

  const bannerAnnouncement = await prisma.banner.upsert({
    where: { id: 'banner-announcement-1' },
    update: {},
    create: {
      id: 'banner-announcement-1',
      title: 'Ediciones con propósito · Dedicatoria & personalización',
      type: 'announcement',
      position: 'top',
      order: 2,
      active: true,
    },
  });
  console.log('🎨 Banners seeded: Hero and Announcement');

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

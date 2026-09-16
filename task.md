# Ovejita Sorpresas — Task Tracker

## Fase 1: Estructura + Monorepo
- [x] Reorganizar archivos Stitch a /stitch-reference/
- [x] Crear package.json raíz con npm workspaces
- [x] Crear .gitignore
- [x] Crear .env.example y .env
- [x] Crear shared/ con tipos TypeScript y constantes
- [x] Crear estructura frontend/ (Astro)
- [x] Crear estructura admin/ (React + Vite)
- [x] Crear estructura backend/ (Express)

## Fase 2: Base de Datos
- [x] Crear schema.prisma con 13 modelos
- [x] Ejecutar sincronización de base de datos
- [x] Crear seed.ts con datos DEMO basados en Stitch y productos reales
- [x] Ejecutar seed y verificar

## Fase 3: Backend + API Pública
- [x] Configurar Express + TypeScript
- [x] Crear rutas públicas (/api/products, /api/categories, /api/campaigns, /api/settings, /api/banners)
- [x] Crear middleware de errores
- [x] Crear utilidad de pricing centralizado (backend como fuente única de verdad)

## Fase 4: Autenticación + API Admin
- [x] Crear middleware de auth JWT (cookies httpOnly + header)
- [x] Crear rutas de auth (login, logout, me)
- [x] Crear rutas admin CRUD (products, categories, campaigns, publications, banners, images, settings)
- [x] Crear middleware de validación Zod

## Fase 5: Panel Administrativo
- [x] Setup React + Vite + Tailwind
- [x] Crear Login page con credenciales DEMO
- [x] Crear Dashboard con métricas en tiempo real
- [x] Crear CRUD Productos con preview en vivo de tarjeta Stitch
- [x] Crear CRUD Categorías con ordenación
- [x] Crear CRUD Campañas
- [x] Crear gestión de Publicaciones (override visual sin tocar producto maestro)
- [x] Crear gestión de Banners
- [x] Crear Configuración del negocio (WhatsApp, redes, branding)
- [x] Subida y gestión de imágenes principales

## Fase 6: Frontend Público (Astro)
- [x] Setup Astro + Tailwind con tokens de Stitch
- [x] Crear Layout principal con Google Fonts y textura de papel
- [x] Componente Header (responsive mobile + desktop)
- [x] Componente HeroSection (grid asimétrico editorial de revista)
- [x] Componente CategoryTabs (píldoras activas dinámicas)
- [x] Componente ProductCard + ProductGrid (tarjetas exactas Stitch con zoom y accordeón)
- [x] Componente QualityPillars (4 pilares de artesanía)
- [x] Componente GiftExperience (simulador de dedicatoria en tiempo real)
- [x] Componente CorporateEvents (banner de cotización)
- [x] Componente Footer (historia, colecciones, club de correo)
- [x] Componente WhatsAppButton (concierge flotante desktop + barra fija mobile)
- [x] Conectar todo con API y probar build
- [x] Crear página de detalle de producto ([slug].astro)

## Fase 7: Storage de Imágenes
- [x] Interface StorageService
- [x] LocalProvider (almacenamiento en disco para desarrollo)
- [x] CloudinaryProvider (preparado para producción sin cambiar código)
- [x] Factory dinámico según variable STORAGE_PROVIDER

## Fase 8: Campañas + Descuentos + Publicaciones
- [x] Lógica de descuentos activos por fecha y tipo (porcentual, fijo, promo)
- [x] Cálculo automático de precio final verificado (Planificador: $32.000 → $27.200)
- [x] Campañas con productos asociados
- [x] Publicaciones con override de título/descripción/visibilidad

## Fase 9: Configuración de Negocio
- [x] CRUD settings desde admin
- [x] Frontend consume WhatsApp real (986951425) desde API
- [x] Frontend consume redes sociales y branding desde API

## Fase 10: Verificación
- [x] Backend arranca y responde correctamente
- [x] Admin compila y genera bundle de producción
- [x] Frontend compila y genera bundle de producción
- [x] Seed carga datos correctamente
- [x] README.md completo con guía de despliegue Free-First

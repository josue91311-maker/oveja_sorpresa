# 🐑 Ovejita Sorpresas — Plataforma Web de Producción

Plataforma de comercio electrónico y gestión editorial para **Ovejita Sorpresas** (Tienda de Regalos & Papelería con Propósito). Desarrollada como un monorepo modular, desacoplado y preparado para escalar sin costos iniciales (**Free-First**), conservando al 100% el diseño generado en **Google Stitch**.

---

## 🏛️ 1. Arquitectura del Sistema

El proyecto está estructurado como un **Monorepo con npm workspaces** dividido en 4 paquetes independientes:

```
TrabajoWebOvejas/
├── /frontend               ← Catálogo público (Astro 5 + Tailwind CSS + Vanilla JS)
├── /admin                  ← Panel administrativo (React 18 + Vite + Tailwind)
├── /backend                ← API REST central (Node.js + Express 5 + Prisma ORM)
├── /shared                 ← Modelos, tipos TypeScript y constantes compartidas
├── /database               ← Esquema Prisma, migraciones SQLite y seed de datos DEMO
├── /stitch-reference       ← Copias de seguridad de las pantallas originales de Google Stitch
├── .env.example            ← Plantilla de configuración de entorno
└── package.json            ← Workspaces raíz y scripts de orquestación
```

### Principios Fundamentales de la Arquitectura:
1. **Fuente de verdad visual:** El diseño editorial, paleta de colores pastel, tipografías (*Quicksand*, *Plus Jakarta Sans*, *Playfair Display*, *Alex Brush*), sombras difusas y microinteracciones de Google Stitch se preservan con absoluta fidelidad.
2. **Desacoplamiento total:** El catálogo público (`/frontend`) y el panel de administración (`/admin`) son aplicaciones independientes que se comunican exclusivamente a través de la API REST (`/backend`).
3. **Seguridad y precio:** El backend es la única fuente de verdad para precios y descuentos. El frontend nunca calcula precios por su cuenta.
4. **WhatsApp Dinámico:** El número de WhatsApp **986951425** (y cualquier número futuro) se configura desde el panel de control administrativo y se propaga en tiempo real a los botones de compra del catálogo.

---

## 🚀 2. Inicio Rápido en Desarrollo Local

### Requisitos previos:
* **Node.js:** v20+ o v22+
* **npm:** v10+

### Paso 1: Clonar e instalar dependencias
Desde la raíz del proyecto:
```bash
npm install
```

### Paso 2: Configurar variables de entorno
Copia la plantilla de entorno:
```bash
cp .env.example .env
```

### Paso 3: Inicializar la base de datos y cargar el Seed DEMO
```bash
# Sincroniza el esquema Prisma con la base de datos local SQLite
npx prisma db push --schema=database/schema.prisma

# Carga las categorías, colecciones, campañas y productos DEMO basados en Stitch
npm run db:seed
```

### Paso 4: Iniciar los servidores de desarrollo
Puedes iniciar cada servicio en terminales separadas:

| Aplicación | Comando | URL Local | Descripción |
|:---|:---|:---|:---|
| **Backend API** | `npm run dev:backend` | `http://localhost:3001` | API REST y servidor de imágenes |
| **Panel Admin** | `npm run dev:admin` | `http://localhost:5173` | Panel de control administrativo |
| **Frontend Público** | `npm run dev:frontend` | `http://localhost:4321` | Tienda y catálogo público |

---

## 🔐 3. Credenciales de Administrador (DEMO)

Para ingresar al panel `/admin`:
* **URL:** [http://localhost:5173](http://localhost:5173)
* **Correo:** `admin@ovejitasorpresas.com`
* **Contraseña:** `OvejitaAdmin2025!`

> La sesión se gestiona de forma segura mediante **JWT en cookies httpOnly** protegidas contra ataques XSS.

---

## 🗄️ 4. Base de Datos & Modelos Prisma

El esquema contiene **13 entidades relacionales**:
* `User`: Administradores del sistema con contraseña hasheada en `bcrypt`.
* `Category`: Categorías de productos con slugs y ordenación.
* `Collection`: Colecciones temáticas (ej. *Colección Salmos de Paz*, *Colección Gracia*).
* `Product`: Maestro central de productos (SKU, precios, descripciones, stock, estados).
* `ProductImage`: Fotografías ordenadas asociadas con flag `isPrimary`.
* `Discount`: Reglas de descuento porcentual, monto fijo o precio promocional con fechas de vigencia.
* `Campaign`: Campañas estacionales con prioridad y productos vinculados.
* `CampaignProduct` / `CampaignCategory`: Tablas intermedias de asociación.
* `Publication`: Capa de presentación para el catálogo público (permite sobreescribir títulos y visibilidad sin modificar el maestro de productos).
* `Banner`: Banners de aviso superior y llamados a la acción.
* `BusinessSettings`: Configuración singleton de WhatsApp, redes sociales, horarios e identidad de marca.

---

## 🖼️ 5. Abstracción de Almacenamiento (`StorageService`)

Para evitar almacenar binarios en la base de datos, el sistema implementa el patrón **Factory / Provider**:

```typescript
// backend/src/services/storage/
├── StorageService.ts      // Interface abstracta IStorageProvider
├── LocalProvider.ts       // Almacenamiento local en disco (./backend/uploads)
├── CloudinaryProvider.ts  // Conector listo para Cloudinary CDN
└── index.ts               // Selección automática según process.env.STORAGE_PROVIDER
```

* **En desarrollo local:** Las imágenes se guardan automáticamente en `backend/uploads/` y se sirven en `http://localhost:3001/uploads/...`.
* **Para producción:** Basta con configurar las siguientes variables en `.env`:
  ```env
  STORAGE_PROVIDER=cloudinary
  CLOUDINARY_CLOUD_NAME=tu_cloud_name
  CLOUDINARY_API_KEY=tu_api_key
  CLOUDINARY_API_SECRET=tu_api_secret
  ```

---

## 🔄 6. Cómo Migrar de SQLite a PostgreSQL (Neon / Supabase)

El esquema Prisma está diseñado desde el día cero para ser 100% compatible con PostgreSQL (usa CUIDs en lugar de autoincrementos exclusivos y tipos estándar).

1. Abre `database/schema.prisma` y cambia el datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Actualiza `DATABASE_URL` en tu archivo `.env` o en las variables de entorno de tu servidor:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@ep-xxx.us-east-2.aws.neon.tech/ovejita?sslmode=require"
   ```
3. Ejecuta la migración de producción:
   ```bash
   npx prisma migrate deploy --schema=database/schema.prisma
   ```

---

## ☁️ 7. Estrategia de Despliegue Gratuito (Free-First)

| Capa | Proveedor Recomendado | Costo | Configuración |
|:---|:---|:---|:---|
| **Frontend Público** | **Vercel** / Cloudflare Pages | **$0** | Build command: `npm run build --workspace=frontend`, Output: `frontend/dist` |
| **Panel Admin** | **Vercel** (Proyecto separado) | **$0** | Build command: `npm run build --workspace=admin`, Output: `admin/dist` |
| **Backend API** | **Render** (Web Service gratuito) | **$0** | Build command: `npm run build --workspace=backend`, Start: `node backend/dist/index.js` |
| **Base de Datos** | **Neon PostgreSQL** | **$0** | 0.5 GB storage, escala a cero automáticamente |
| **Imágenes** | **Cloudinary** (Free Tier) | **$0** | 25 GB de almacenamiento y transformaciones WebP automáticas |

---

## 🌸 8. Funcionalidades Destacadas del Catálogo

* **Simulador de Dedicatoria:** Los clientes pueden redactar su mensaje caligrafiado a mano en tiempo real en la página principal, guardarlo en su pedido y enviarlo adjunto a WhatsApp.
* **Carrito Persistente:** Bolsa de compras interactiva que guarda los productos en `localStorage` y actualiza el contador de sorpresas.
* **Filtros en Vivo:** Píldoras de filtro por categorías y barra de búsqueda que filtran la vitrina al instante sin recargas de página.
* **Integración WhatsApp Business:** Cada tarjeta de producto y botón de cotización genera un enlace directo con el mensaje listo para despachar al número oficial de Ovejita Sorpresas.

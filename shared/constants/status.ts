export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  ENDED = 'ended',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  PROMOTIONAL_PRICE = 'promotional_price',
}

export enum BannerType {
  HERO = 'hero',
  PROMOTIONAL = 'promotional',
  ANNOUNCEMENT = 'announcement',
}

export enum BannerPosition {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export enum StorageProvider {
  LOCAL = 'local',
  CLOUDINARY = 'cloudinary',
  SUPABASE = 'supabase',
  R2 = 'r2',
}

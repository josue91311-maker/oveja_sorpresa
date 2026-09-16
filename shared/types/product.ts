export interface ProductImage {
  id: string;
  url: string;
  provider: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  order: number;
  isPrimary: boolean;
}

export interface DiscountInfo {
  id: string;
  type: 'percentage' | 'fixed' | 'promotional_price';
  value: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  categoryId: string | null;
  collectionId: string | null;
  price: number;
  previousPrice: number | null;
  finalPrice: number;
  discountPercentage: number | null;
  activeDiscount: DiscountInfo | null;
  status: string;
  published: boolean;
  featured: boolean;
  isNew: boolean;
  stock: number;
  images: ProductImage[];
  primaryImage: ProductImage | null;
  category: { id: string; name: string; slug: string } | null;
  collection: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  sku: string;
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  collectionId?: string;
  price: number;
  previousPrice?: number;
  status?: string;
  published?: boolean;
  featured?: boolean;
  isNew?: boolean;
  stock?: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  order: number;
  active: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  order?: number;
  active?: boolean;
}

export interface CategoryUpdateInput extends Partial<CategoryCreateInput> {}

export interface Publication {
  id: string;
  productId: string;
  collectionId: string | null;
  visible: boolean;
  featured: boolean;
  position: number;
  publicTitle: string | null;
  publicDescription: string | null;
  primaryImageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

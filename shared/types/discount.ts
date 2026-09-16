export interface Discount {
  id: string;
  productId: string;
  type: 'percentage' | 'fixed' | 'promotional_price';
  value: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCreateInput {
  productId: string;
  type: 'percentage' | 'fixed' | 'promotional_price';
  value: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

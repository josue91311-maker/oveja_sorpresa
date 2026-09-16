export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  type: string;
  position: string;
  order: number;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerCreateInput {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  type?: string;
  position?: string;
  order?: number;
  active?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BannerUpdateInput extends Partial<BannerCreateInput> {}

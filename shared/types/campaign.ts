export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  priority: number;
  products?: { id: string; name: string; slug: string }[];
  categories?: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCreateInput {
  name: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: number;
}

export interface CampaignUpdateInput extends Partial<CampaignCreateInput> {}

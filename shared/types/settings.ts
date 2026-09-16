export interface BusinessSettings {
  id: string;
  businessName: string;
  description: string | null;
  whatsappNumber: string | null;
  contactNumber: string | null;
  whatsappMessage: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  generalTexts: Record<string, string> | null;
  schedules: Record<string, string> | null;
}

export interface BusinessSettingsUpdateInput {
  businessName?: string;
  description?: string;
  whatsappNumber?: string;
  contactNumber?: string;
  whatsappMessage?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  logoUrl?: string;
  faviconUrl?: string;
  generalTexts?: string;
  schedules?: string;
}

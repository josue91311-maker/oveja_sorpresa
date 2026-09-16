import { IStorageProvider } from './StorageService';
import { LocalProvider } from './LocalProvider';
import { CloudinaryProvider } from './CloudinaryProvider';
import { SupabaseStorageProvider } from './SupabaseStorageProvider';

let instance: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
  if (!instance) {
    const providerType = process.env.STORAGE_PROVIDER || 'local';
    if (providerType === 'supabase') {
      instance = new SupabaseStorageProvider();
    } else if (providerType === 'cloudinary') {
      instance = new CloudinaryProvider();
    } else {
      instance = new LocalProvider();
    }
  }
  return instance;
}

export * from './StorageService';
export * from './LocalProvider';
export * from './CloudinaryProvider';
export * from './SupabaseStorageProvider';

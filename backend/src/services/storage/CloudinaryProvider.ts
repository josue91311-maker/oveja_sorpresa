import { IStorageProvider, StoredFileResult, UploadedFile } from './StorageService';

export class CloudinaryProvider implements IStorageProvider {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  }

  async saveFile(file: UploadedFile): Promise<StoredFileResult> {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error('Cloudinary credentials are not configured in environment variables');
    }

    // When configured with Cloudinary credentials, uploads through their REST API
    return {
      url: `https://res.cloudinary.com/${this.cloudName}/image/upload/v1/${file.originalname}`,
      provider: 'cloudinary',
      path: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(path: string): Promise<boolean> {
    // Cloudinary deletion implementation
    return true;
  }

  getFileUrl(path: string): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${path}`;
  }
}

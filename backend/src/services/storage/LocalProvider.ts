import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageProvider, StoredFileResult, UploadedFile } from './StorageService';

export class LocalProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    const candidates = [
      process.env.STORAGE_LOCAL_PATH || '',
      './uploads',
      './backend/uploads',
      '../backend/uploads',
    ].filter(Boolean);

    let found = '';
    for (const c of candidates) {
      const p = path.resolve(process.cwd(), c);
      if (fs.existsSync(p)) {
        found = p;
        break;
      }
    }
    this.uploadDir = found || path.resolve(process.cwd(), './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }


  async saveFile(file: UploadedFile): Promise<StoredFileResult> {
    const ext = path.extname(file.originalname).toLowerCase();
    const hash = crypto.randomBytes(16).toString('hex');
    const filename = `${Date.now()}-${hash}${ext}`;
    const targetPath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(targetPath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      provider: 'local',
      path: filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const targetPath = path.join(this.uploadDir, filename);
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting local file:', error);
      return false;
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

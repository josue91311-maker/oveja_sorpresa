import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';
import { IStorageProvider, StoredFileResult, UploadedFile } from './StorageService';

export class SupabaseStorageProvider implements IStorageProvider {
  private supabase: SupabaseClient | null = null;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    // Service role key preferred for backend; falls back to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.bucket = process.env.SUPABASE_BUCKET || 'ovejita-media';

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('⚠️ Supabase Storage: SUPABASE_URL o credenciales no configuradas. Revisa tu archivo .env');
    }
  }

  async saveFile(file: UploadedFile): Promise<StoredFileResult> {
    if (!this.supabase) {
      throw new Error('Supabase Client no inicializado. Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const hash = crypto.randomBytes(12).toString('hex');
    const folder = file.mimetype.includes('pdf') ? 'pdfs' : 'images';
    const filePath = `${folder}/${Date.now()}-${hash}${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new Error(`Error subiendo archivo a Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      provider: 'supabase',
      path: filePath,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (!this.supabase) return false;
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        console.error('Error eliminando archivo de Supabase Storage:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error inesperado eliminando de Supabase Storage:', err);
      return false;
    }
  }

  getFileUrl(filePath: string): string {
    if (!this.supabase) return '';
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface StoredFileResult {
  url: string;
  provider: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface IStorageProvider {
  saveFile(file: UploadedFile): Promise<StoredFileResult>;
  deleteFile(path: string): Promise<boolean>;
  getFileUrl(path: string): string;
}

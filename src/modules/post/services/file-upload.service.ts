import { Injectable, BadRequestException } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const UPLOAD_FOLDER = 'blog-posts';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime', 'application/octet-stream'];

interface UploadedMedia {
  type: string;
  link: string;
  publicId: string;
}

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadMultipleFiles(files: FileUpload[]): Promise<UploadedMedia[]> {
    if (!files || files.length === 0) return [];

    if (files.length > MAX_FILES) {
      throw new BadRequestException(`Maximum ${MAX_FILES} files allowed. You uploaded ${files.length} files.`);
    }

    const uploadPromises = files.map(async (filePromise) => {
      const file = await filePromise;
      const { createReadStream, filename, mimetype } = file;

      // Validate file type
      if (!ALLOWED_TYPES.includes(mimetype)) {
        throw new BadRequestException(`File type "${mimetype}" not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`);
      }

      // Read and validate file size
      const fileBuffer = await this.readStream(createReadStream(), filename);

      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadMediaStream(
        Readable.from(fileBuffer),
        UPLOAD_FOLDER,
        filename
      );

      return {
        type: "media",
        link: result.secure_url,
        publicId: result.public_id,
      };
    });

    return await Promise.all(uploadPromises);
  }

  private async readStream(stream: NodeJS.ReadableStream, filename: string): Promise<Buffer> {
    const chunks: Buffer[] = [];
    let size = 0;

    for await (const chunk of stream as any) {
      size += chunk.length;
      
      if (size > MAX_FILE_SIZE) {
        throw new BadRequestException(`File "${filename}" is too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
      
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}

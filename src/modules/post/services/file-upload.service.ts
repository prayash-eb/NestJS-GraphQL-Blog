import { Injectable, BadRequestException } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { fileTypeFromStream } from 'file-type';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const UPLOAD_FOLDER = 'blog-posts';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime'];

interface UploadedMedia {
  type: string;
  link: string;
  publicId: string;
}

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) { }
  async uploadMultipleFiles(files: FileUpload[]): Promise<UploadedMedia[]> {
    if (!files || files.length === 0) return [];
    if (files.length > MAX_FILES) {
      throw new BadRequestException(`Maximum ${MAX_FILES} files allowed. You uploaded ${files.length} files.`);
    }

    const uploadPromises = files.map(async (filePromise) => {
      const file = await filePromise;
      const { createReadStream, filename, mimetype } = file;

      let fileMimetype = mimetype as string;

      const fileStream = createReadStream()

      if (fileMimetype === "application/octet-stream") {
        let fileType = await fileTypeFromStream(fileStream)
        fileMimetype = fileType?.mime ? fileType.mime : mimetype
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(fileMimetype)) {
        throw new BadRequestException(`File type "${mimetype}" not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`);
      }

      // Upload stream directly
      const result = await this.cloudinaryService.uploadMediaStream(
        fileStream,
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
}

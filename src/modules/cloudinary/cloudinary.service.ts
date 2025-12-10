import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  /**
   * Upload a file using a readable stream
   */
  uploadMediaStream(
    stream: Readable,
    folder: string,
    filename?: string, // optional public_id
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, public_id: filename, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );
      stream.pipe(uploadStream);
    });
  }

  async deleteMedia(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      });
    });
  }
}

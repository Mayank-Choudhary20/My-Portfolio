import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: jpeg, png, webp, gif, svg`,
      );
    }

    try {
      const result = await this.uploadToCloudinary(file, 'portfolio/images');
      return { url: result.secure_url };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException(
        'Failed to upload image. Check Cloudinary configuration.',
      );
    }
  }

  async uploadPdf(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    try {
      const result = await this.uploadToCloudinary(
        file,
        'portfolio/documents',
        'raw',
      );
      return { url: result.secure_url };
    } catch (error) {
      console.error('Cloudinary PDF upload error:', error);
      throw new InternalServerErrorException(
        'Failed to upload PDF. Check Cloudinary configuration.',
      );
    }
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'raw' | 'auto' = 'image',
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation:
            resourceType === 'image'
              ? [{ quality: 'auto', fetch_format: 'auto' }]
              : undefined,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result as { secure_url: string; public_id: string });
          } else {
            reject(new Error('No result from Cloudinary'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
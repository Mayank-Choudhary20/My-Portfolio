import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }


  async uploadImage(file: Express.Multer.File) {

    return new Promise((resolve, reject) => {

      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
        },

        (error, result) => {

          if (error) {
            reject(error);
          }

          resolve(result);

        }

      ).end(file.buffer);

    });

  }

}
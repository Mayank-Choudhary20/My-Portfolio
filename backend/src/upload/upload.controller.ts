import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('upload')
export class UploadController {

  constructor(
    private uploadService: UploadService
  ){}


  @Post()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
upload(
  @UploadedFile() file: Express.Multer.File
){
  return this.uploadService.uploadImage(file);
}

}
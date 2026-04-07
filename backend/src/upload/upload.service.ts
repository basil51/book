import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/gif',
      // Avoid SVG in uploads to reduce XSS risk.
      'image/tiff',
      'image/bmp',
      'image/x-icon',
      'image/avif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    //return {  url: file.path };
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:4001',
    );
    return {
      logoUrl: `${baseUrl}/uploads/${file.filename}`,
    };
  }
}

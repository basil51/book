import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }


}
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImageTransformPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'image',
            message: 'No file was uploaded',
          },
        ],
      });
    }
    if (file.size > Math.pow(10, 7)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'image',
            message: 'Uploaded file is too large',
          },
        ],
      });
    }
    const originalName = path.parse(file.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';

    await sharp(file.buffer)
      .webp({ quality: 20 })
      .toFile(path.join('uploads', filename));

    const imageLocation = `${this.configService.get(
      'BASE_URL',
    )}/files/download/${filename}`;

    return imageLocation;
  }
}

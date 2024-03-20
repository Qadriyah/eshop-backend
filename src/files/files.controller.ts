import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ImageTransformPipe } from './files.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { FileResponse } from './dto/create-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard)
  @Post('upload/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile(ImageTransformPipe) imageUrl: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProductImage(imageUrl, productId);
    return {
      statusCode: HttpStatus.OK,
      imageUrl,
    };
  }

  @UseGuards(AuthGuard)
  @Post('upload/:productId/icon')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductIcon(
    @Param('productId') productId: string,
    @UploadedFile(ImageTransformPipe) imageUrl: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProductIcon(imageUrl, productId);
    return {
      statusCode: HttpStatus.OK,
      imageUrl,
    };
  }

  @UseGuards(AuthGuard)
  @Post('upload/user/:userId/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile(ImageTransformPipe) imageUrl: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProfileImage(imageUrl, userId);
    return {
      statusCode: HttpStatus.OK,
      imageUrl,
    };
  }

  @Get('download/:filename')
  async downloadImage(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const file = await this.filesService.downloadImage(filename);
    return new StreamableFile(file);
  }
}

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
  Delete,
  Query,
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
    @UploadedFile(ImageTransformPipe) filePath: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProductImage(filePath, productId);
    return {
      statusCode: HttpStatus.OK,
      filePath,
    };
  }

  @UseGuards(AuthGuard)
  @Post('upload/:productId/icon')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductIcon(
    @Param('productId') productId: string,
    @UploadedFile(ImageTransformPipe) filePath: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProductIcon(filePath, productId);
    return {
      statusCode: HttpStatus.OK,
      filePath,
    };
  }

  @UseGuards(AuthGuard)
  @Post('upload/user/:userId/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile(ImageTransformPipe) filePath: string,
  ): Promise<FileResponse> {
    await this.filesService.uploadProfileImage(filePath, userId);
    return {
      statusCode: HttpStatus.OK,
      filePath,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('upload/:productId')
  async deleteProductImage(
    @Param('productId') productId: string,
    @Query('file-path') filePath: string,
  ): Promise<FileResponse> {
    await this.filesService.deleteProductImage(productId, filePath);
    return {
      statusCode: HttpStatus.OK,
      filePath,
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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponse } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateProductValidationPipe,
  ImageTransformPipe,
  UpdateProductValidationPipe,
} from './product.pipe';
import { Response } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(CreateProductValidationPipe) createProductDto: CreateProductDto,
  ): Promise<ProductResponse> {
    const product = await this.productService.create(createProductDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Product has been created successfully',
      product,
    };
  }

  @Get()
  async findAll(): Promise<ProductResponse> {
    const products = await this.productService.findAll();
    return {
      statusCode: HttpStatus.OK,
      products,
    };
  }

  @Get(':productId')
  async findOne(
    @Param('productId') productId: string,
  ): Promise<ProductResponse> {
    const product = await this.productService.findOne(productId);
    return {
      statusCode: HttpStatus.OK,
      product,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':productId')
  async update(
    @Param('productId') productId: string,
    @Body(UpdateProductValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    const product = await this.productService.update(
      productId,
      updateProductDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Product has been updated successfully',
      product,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':productId')
  async remove(
    @Param('productId') productId: string,
  ): Promise<ProductResponse> {
    const product = await this.productService.remove(productId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Product has been removed successfully',
      product,
    };
  }

  @Post('upload/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Param('productId') productId: string,
    @UploadedFile(ImageTransformPipe) filename: string,
  ) {
    await this.productService.uploadImage(filename, productId);
    return {
      filename,
    };
  }

  @Get('download/:filename')
  async downloadImage(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const fileOptions = await this.productService.downloadImage();
    response.sendFile(filename, fileOptions);
  }
}

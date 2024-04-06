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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponse } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateProductValidationPipe,
  UpdateProductValidationPipe,
} from './product.pipe';
import { FilterQuery } from 'mongoose';
import { ProductDocument } from './entities/product.entity';

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
  async findAll(@Query() { status }): Promise<ProductResponse> {
    const query: FilterQuery<ProductDocument> = {};
    if (status) {
      query.status = status;
    }
    const products = await this.productService.findAll(query);
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
}

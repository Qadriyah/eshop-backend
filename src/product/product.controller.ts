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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponse } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductValidationPipe } from './product.pipe';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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

  @Patch(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(user: CreateProductDto) {
    try {
      const product = new this.productModel(user);
      return product.save();
    } catch (err) {}
  }

  findOne(filterQuery: FilterQuery<Product>) {
    try {
      return this.productModel.findOne(filterQuery);
    } catch (err) {}
  }

  find(filterQuery: FilterQuery<Product>) {
    try {
      return this.productModel.find(filterQuery);
    } catch (err) {}
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<Product>,
    product: Partial<Product>,
    options = {},
  ) {
    try {
      return this.productModel.findByIdAndUpdate(filterQuery, product, {
        new: true,
        ...options,
      });
    } catch (err) {}
  }
}

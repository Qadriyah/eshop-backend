import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { AbstractRepository } from '@app/common';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) productModel: PaginateModel<ProductDocument>,
  ) {
    super(productModel);
  }
}

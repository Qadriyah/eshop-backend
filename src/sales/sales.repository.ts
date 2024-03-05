import { AbstractRepository } from '@app/common';
import { Sale, SaleDocument } from './entities/sale.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class SalesRepository extends AbstractRepository<SaleDocument> {
  constructor(@InjectModel(Sale.name) salesModel: Model<SaleDocument>) {
    super(salesModel);
  }
}

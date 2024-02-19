import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductRepository } from '../product/product.repository';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { UsersModule } from '../users/users.module';
import { CommonService } from '@app/common';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, CommonService, ProductRepository],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
})
export class PaymentsModule {}

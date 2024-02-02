import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { Product, ProductSchema } from './entities/product.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import { CommonService } from '@app/common';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CommonService, UserRepository, ProductRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class ProductModule {}

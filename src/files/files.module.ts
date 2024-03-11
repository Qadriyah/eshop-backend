import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigService } from '@nestjs/config';
import { ProductRepository } from '../product/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonService } from '@app/common';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    ConfigService,
    CommonService,
    ProductRepository,
    UserRepository,
  ],
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
export class FilesModule {}

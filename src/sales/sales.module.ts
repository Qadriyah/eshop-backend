import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { VisitorModule } from '../auth/visitor/visitor.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [VisitorModule],
})
export class SalesModule {}

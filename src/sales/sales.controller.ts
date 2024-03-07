import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, SalesResponse } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto): Promise<SalesResponse> {
    const sale = await this.salesService.create(createSaleDto);
    return {
      statusCode: HttpStatus.OK,
      sale,
    };
  }

  @Get()
  async findAll(): Promise<SalesResponse> {
    const sales = await this.salesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      sales,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SalesResponse> {
    const sale = await this.salesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      sale,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<SalesResponse> {
    const sale = await this.salesService.update(id, updateSaleDto);
    return {
      statusCode: HttpStatus.OK,
      sale,
    };
  }

  @Get('customer/:id')
  async findCustomerSales(@Param('id') id: string): Promise<SalesResponse> {
    const sales = await this.salesService.findCustomerSales(id);
    return {
      statusCode: HttpStatus.OK,
      sales,
    };
  }

  @Get('customer/my/orders')
  async getCustomerSales(
    @CurrentUser() user: UserDocument,
  ): Promise<SalesResponse> {
    const sales = await this.salesService.findCustomerSales(user.id);
    return {
      statusCode: HttpStatus.OK,
      sales,
    };
  }
}

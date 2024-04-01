import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import * as moment from 'moment';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';
import {
  CommonService,
  PaginateOptions,
  SaleResponse,
  SalesResponse,
} from '@app/common';
import { SaleDocument } from './entities/sale.entity';

@UseGuards(AuthGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly commonService: CommonService,
  ) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto): Promise<SaleResponse> {
    const sale = await this.salesService.create(createSaleDto);
    return {
      statusCode: HttpStatus.OK,
      sale,
    };
  }

  @Get()
  async findAll(@Query() { page, limit, from, to }): Promise<SalesResponse> {
    const query: FilterQuery<SaleDocument> = {};
    const options: PaginateOptions = { page, limit };
    if (!page) options.page = 1;
    if (!limit) options.limit = 50;
    if (from) {
      query.createdAt = {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      };
    }

    const {
      docs: sales,
      totalDocs: totalItems,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
    } = await this.salesService.findAll(query, options);
    return {
      statusCode: HttpStatus.OK,
      sales,
      meta: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SaleResponse> {
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
  ): Promise<SaleResponse> {
    const sale = await this.salesService.update(id, updateSaleDto);
    return {
      statusCode: HttpStatus.OK,
      sale,
    };
  }

  @Get('customer/:id')
  async findCustomerSales(
    @Param('id') id: string,
    @Query() { page, limit, from, to },
  ): Promise<SalesResponse> {
    const query: FilterQuery<SaleDocument> = { user: id };
    const options: PaginateOptions = { page, limit };
    if (!page) options.page = 1;
    if (!limit) options.limit = 50;
    if (from) {
      query.createdAt = {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      };
    }

    const {
      docs: sales,
      totalDocs: totalItems,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
    } = await this.salesService.findCustomerSales(query, options);
    return {
      statusCode: HttpStatus.OK,
      sales,
      meta: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
      },
    };
  }

  @Get('customer/my/orders')
  async getCustomerSales(
    @CurrentUser() user: UserDocument,
    @Query() { page, limit },
  ): Promise<SalesResponse> {
    const {
      docs: sales,
      totalDocs: totalItems,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
    } = await this.salesService.findCustomerSales(user.id, { page, limit });
    return {
      statusCode: HttpStatus.OK,
      sales,
      meta: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
      },
    };
  }
}

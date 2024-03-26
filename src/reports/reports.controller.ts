import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import * as moment from 'moment';
import { ReportsService } from './reports.service';
import { SaleDocument } from '../sales/entities/sale.entity';
import { CommonService, SALE_STATUS } from '@app/common';
import { AuthGuard } from '../auth/auth.guard';
import { RbacRolesGuard } from '../rbac/rbac.roles.guard';
import { Roles } from '../rbac/rbac.roles.decorator';
import { Role } from '../rbac/rbac.role.enum';

@UseGuards(AuthGuard, RbacRolesGuard)
@Roles(Role.Admin)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly commonService: CommonService,
  ) {}

  @Get('sales')
  async getSalesReport(
    @Query('start-date') from: string,
    @Query('end-date') to: string,
  ) {
    const query: FilterQuery<SaleDocument> = {
      status: {
        $nin: [
          SALE_STATUS.cancelled,
          SALE_STATUS.pending,
          SALE_STATUS.returned,
        ],
      },
      createdAt: {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      },
    };
    const report = await this.reportsService.getSalesReport(query);
    return {
      statusCode: HttpStatus.OK,
      report,
    };
  }

  @Get('returns')
  async getReturnsReport(
    @Query('start-date') from: string,
    @Query('end-date') to: string,
  ) {
    const query: FilterQuery<SaleDocument> = {
      status: SALE_STATUS.returned,
      createdAt: {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      },
    };
    const report = await this.reportsService.getReturnsReport(query);
    return {
      statusCode: HttpStatus.OK,
      report,
    };
  }

  @Get('customer-orders')
  async getCustomerOrders(
    @Query('start-date') from: string,
    @Query('end-date') to: string,
  ) {
    const query: FilterQuery<SaleDocument> = {
      status: {
        $nin: [
          SALE_STATUS.cancelled,
          SALE_STATUS.pending,
          SALE_STATUS.returned,
        ],
      },
      createdAt: {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      },
    };
    const report = await this.reportsService.getCustomerOrders(query);
    return {
      statusCode: HttpStatus.OK,
      report,
    };
  }

  @Get('product-report')
  async getProductsRepoprt(
    @Query('start-date') from: string,
    @Query('end-date') to: string,
  ) {
    const query: FilterQuery<SaleDocument> = {
      status: {
        $nin: [
          SALE_STATUS.cancelled,
          SALE_STATUS.pending,
          SALE_STATUS.returned,
        ],
      },
      createdAt: {
        $gte: this.commonService.resetTime(from),
        $lte: to
          ? moment(to).add(23, 'hours').toISOString()
          : moment(from).add(23, 'hours').toISOString(),
      },
    };
    const report = await this.reportsService.getProductsRepoprt(query);
    return {
      statusCode: HttpStatus.OK,
      report,
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerPipe, UpdateCustomerPipe } from './customers.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(
    @Body(CreateCustomerPipe) createCustomerDto: CreateCustomerDto,
  ) {
    const customer = await this.customersService.createCustomer(
      createCustomerDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      customer,
    };
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body(UpdateCustomerPipe) updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customersService.updateCustomer(
      id,
      updateCustomerDto,
    );
    return {
      statusCode: HttpStatus.OK,
      customer,
    };
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const customer = await this.customersService.getCustomer(id);
    return {
      statusCode: HttpStatus.OK,
      customer,
    };
  }

  @Get('payment-methods/cards')
  async getCustomerPaymentMethonds(@CurrentUser() user: UserDocument) {
    const paymentMethods = await this.customersService.getPaymentMethonds(
      user.profile.customer,
    );
    return {
      statusCode: HttpStatus.OK,
      paymentMethods,
    };
  }

  @Post('payment-methods/:token')
  async createPaymentMethod(
    @Param('token') token: string,
    @CurrentUser() user: UserDocument,
  ) {
    const card = await this.customersService.createPaymentMethod(
      user.profile.customer,
      token,
    );
    await this.customersService.updateDefaultSource(
      user.profile.customer,
      card,
    );
    return {
      data: {
        statusCode: HttpStatus.CREATED,
        paymentMethod: card,
      },
    };
  }

  @Delete(':id/payment-methods/card')
  async deleteCustomerCard(
    @Param('id') id: string,
    @Param('source') source: string,
  ) {
    const customer = await this.customersService.deleteCustomerCard(id, source);
    return {
      statusCode: HttpStatus.OK,
      customer,
    };
  }
}

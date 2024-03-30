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
import Stripe from 'stripe';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  CreateCustomerPipe,
  UpdateCardPipe,
  UpdateCustomerPipe,
} from './customers.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';
import { RbacRolesGuard } from 'src/rbac/rbac.roles.guard';

@UseGuards(AuthGuard, RbacRolesGuard)
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
  async getMyPaymentMethonds(@CurrentUser() user: UserDocument) {
    const paymentMethods = await this.customersService.getPaymentMethonds(
      user.profile.customer,
    );
    return {
      statusCode: HttpStatus.OK,
      paymentMethods,
    };
  }

  @Get('payment-methods/:customerId/cards')
  async getCustomerPaymentMethonds(@Param('customerId') customerId: string) {
    const paymentMethods = await this.customersService.getPaymentMethonds(
      customerId,
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
      card.id,
    );
    return {
      statusCode: HttpStatus.CREATED,
      paymentMethod: card,
      message: 'Payment method has been created successfully',
    };
  }

  @Patch('payment-methods/:cardId')
  async updatePaymentMethod(
    @Param('cardId') cardId: string,
    @CurrentUser() user: UserDocument,
    @Body(UpdateCardPipe) data: Stripe.CustomerSourceUpdateParams,
  ) {
    const card = await this.customersService.updatePaymentMethod(
      user.profile.customer,
      cardId,
      data,
    );
    return {
      statusCode: HttpStatus.OK,
      paymentMethod: card,
      message: 'Payment method has been updated successfully',
    };
  }

  @Patch('payment-methods/source/:cardId')
  async updateDefaultSource(
    @Param('cardId') cardId: string,
    @CurrentUser() user: UserDocument,
  ) {
    const card = await this.customersService.updateDefaultSource(
      user.profile.customer,
      cardId,
    );
    return {
      statusCode: HttpStatus.OK,
      paymentMethod: card,
      message: 'Default payment method has been updated successfully',
    };
  }

  @Delete('payment-methods/:source')
  async deleteCustomerCard(
    @Param('source') source: string,
    @CurrentUser() user: UserDocument,
  ) {
    const customer = await this.customersService.deleteCustomerCard(
      user.profile.customer,
      source,
    );
    return {
      statusCode: HttpStatus.OK,
      customer,
      message: 'Payment method has been removed successfully',
    };
  }
}

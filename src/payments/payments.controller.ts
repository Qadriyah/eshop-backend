import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CheckoutSessionDto, PaymentResponse } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CheckoutSessionPipe } from './payments.pipe';
import { SalesService } from '../sales/sales.service';
import { Request, Response } from 'express';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly orderService: SalesService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('checkout/session')
  async checkoutSession(
    @Body(CheckoutSessionPipe) checkoutSessionDto: CheckoutSessionDto,
    @CurrentUser() user: UserDocument,
  ): Promise<PaymentResponse> {
    const { session, lineItems } =
      await this.paymentsService.createCheckoutSession(checkoutSessionDto);
    await this.orderService.create({
      user: user.id,
      session: session.id,
      lineItems: lineItems.map((item) => ({
        name: item.price_data.product_data.name,
        price: item.price_data.unit_amount / 100,
        quantity: item.quantity,
        icon: item.price_data.product_data.images[0],
      })),
    });
    return {
      statusCode: HttpStatus.OK,
      session,
    };
  }

  @UseGuards(AuthGuard)
  @Get('checkout/session/:id')
  async getCheckoutSession(
    @Param('id') sessionId: string,
  ): Promise<PaymentResponse> {
    const session = await this.paymentsService.getCheckoutSession(sessionId);
    return {
      statusCode: HttpStatus.OK,
      session,
    };
  }

  @UseGuards(AuthGuard)
  @Get('checkout/session/:id/line-items')
  async getLineItems(@Param('id') sessionId: string): Promise<PaymentResponse> {
    const lineItems = await this.paymentsService.getLineItems(sessionId);
    return {
      statusCode: HttpStatus.OK,
      lineItems,
    };
  }

  @Post('webhook')
  async webHook(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<PaymentResponse> {
    await this.paymentsService.createWebhook(request, response);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AuthGuard)
  @Get('session')
  async findAll(): Promise<PaymentResponse> {
    const sessions = await this.paymentsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      sessions,
    };
  }

  @UseGuards(AuthGuard)
  @Get('intent/:id')
  async findOne(@Param('id') id: string): Promise<PaymentResponse> {
    const paymentIntent = await this.paymentsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      payment: paymentIntent,
    };
  }
}

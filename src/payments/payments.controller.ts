import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentResponse } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CalculateTaxPipe, CreatePaymentsPipe } from './payments.pipe';

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  async create(
    @Body(CreatePaymentsPipe) createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    const secret = await this.paymentsService.createPaymentIntent(
      createPaymentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      clientSecret: secret,
    };
  }

  @Post('tax')
  async calculateTax(
    @Body(CalculateTaxPipe) createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    const tax = await this.paymentsService.calculateTax(createPaymentDto);
    return {
      statusCode: HttpStatus.OK,
      salesTax: tax,
    };
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}

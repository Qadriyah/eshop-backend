import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import { ProductRepository } from '../product/product.repository';

type LineItem = {
  amount: number;
  reference: string;
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    configService: ConfigService,
    private readonly productRepository: ProductRepository,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  async calculateTax(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const lineItems: LineItem[] = [];
      const temp = Object.assign(
        {},
        ...createPaymentDto.lineItems.map((item) => ({
          [item.product]: {
            ...item,
          },
        })),
      );

      const products = await this.productRepository.find({
        _id: { $in: Object.keys(temp) },
      });
      for (const product of products) {
        const lineTotal = product.price * temp[product.id].quantity;
        lineItems.push({
          amount: lineTotal,
          reference: product.id,
        });
      }
      // const products = await this.stripe.products.list();
      const calculation = await this.stripe.tax.calculations.create({
        currency: 'usd',
        line_items: lineItems,
        customer_details: {
          address: createPaymentDto.address,
          address_source: 'shipping',
        },
      });
      return calculation;
    } catch (err) {
      this.logger.error('payments.service.calculateTax', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async createPaymentIntent(
    createPaymentDto: CreatePaymentDto,
  ): Promise<string> {
    try {
      let totalAmount = 0;
      const temp = Object.assign(
        {},
        ...createPaymentDto.lineItems.map((item) => ({
          [item.product]: {
            ...item,
          },
        })),
      );

      const products = await this.productRepository.find({
        _id: { $in: Object.keys(temp) },
      });
      for (const product of products) {
        const lineTotal = product.price * temp[product.id].quantity;
        totalAmount += lineTotal;
      }
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        shipping: {
          name: createPaymentDto.name,
          phone: createPaymentDto.phone,
          carrier: createPaymentDto.carrier,
          address: createPaymentDto.address,
        },
      });
      return paymentIntent.client_secret;
    } catch (err) {
      this.logger.error('payments.service.createPaymentIntent', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}

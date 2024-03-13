import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import {
  CreateCustomerDto,
  PaymentMethodType,
  UpdateCustomerDto,
} from './dto/create-customer.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsCustomerService {
  private readonly logger = new Logger(PaymentsCustomerService.name);
  private readonly stripe: Stripe;

  constructor(configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  async createCustomer(data: CreateCustomerDto): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      return customer;
    } catch (err) {
      this.logger.error('payments.service.createCustomer', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'customer',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerDto,
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.update(id, { ...data });
      return customer;
    } catch (err) {
      this.logger.error('payments.service.updateCustomer', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'customer',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getPaymentMethonds(customerId: string): Promise<PaymentMethodType[]> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      const paymentMethods = await this.stripe.customers.listPaymentMethods(
        customerId,
        {
          type: 'card',
        },
      );
      return paymentMethods.data.map((paymentMethod) => ({
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand,
        default:
          paymentMethod.id === (customer as Stripe.Customer).default_source,
        type: paymentMethod.card?.funding,
        number: paymentMethod.card?.last4,
        expiry: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
      }));
    } catch (err) {
      this.logger.error('payments.service.getPaymentMethonds', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'payment_method',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async addCustomerCard(
    customerId: string,
    token: string,
  ): Promise<Stripe.CustomerSource> {
    try {
      const card = await this.stripe.customers.createSource(customerId, {
        source: token,
      });

      await this.stripe.customers.update(customerId, {
        default_source: card.id,
      });

      return card;
    } catch (err) {
      this.logger.error('payments.service.addCustomerCard', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'payment',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async deleteCustomerCard(
    customerId: string,
    source: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      if ((customer as Stripe.Customer).default_source === source) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [
            {
              field: 'source',
              message: 'You cannot delete your default payment method',
            },
          ],
        });
      }

      await this.stripe.customers.deleteSource(customerId, source);

      return customer;
    } catch (err) {
      this.logger.error('payments.service.deleteCustomerCard', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'source',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}

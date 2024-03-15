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
} from './dto/create-customer.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
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
      this.logger.error('customers.service.createCustomer', err);
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
    customerId: string,
    data: UpdateCustomerDto,
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        ...data,
      });
      return customer;
    } catch (err) {
      this.logger.error('customers.service.updateCustomer', err);
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

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.update(customerId);
      return customer;
    } catch (err) {
      this.logger.error('customers.service.getCustomer', err);
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
        ...paymentMethod.card,
        id: paymentMethod.id,
        primary:
          paymentMethod.id === (customer as Stripe.Customer).default_source,
        expiry: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
        billing_address: {
          ...paymentMethod.billing_details,
        },
      }));
    } catch (err) {
      this.logger.error('customers.service.getPaymentMethonds', err);
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

  async createPaymentMethod(
    customerId: string,
    token: string,
  ): Promise<Stripe.CustomerSource> {
    try {
      const card = await this.stripe.customers.createSource(customerId, {
        source: token,
      });
      return card;
    } catch (err) {
      this.logger.error('customers.service.createPaymentMethod', err);
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

  async updatePaymentMethod(
    customerId: string,
    cardId: string,
    data: Stripe.CustomerSourceUpdateParams,
  ): Promise<Stripe.CustomerSource> {
    try {
      const card = await this.stripe.customers.updateSource(
        customerId,
        cardId,
        data,
      );
      return card;
    } catch (err) {
      this.logger.error('customers.service.updatePaymentMethod', err);
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

  async updateDefaultSource(
    customerId: string,
    cardId: string,
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        default_source: cardId,
      });
      return customer;
    } catch (err) {
      this.logger.error('customers.service.updateDefaultSource', err);
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
      this.logger.error('customers.service.deleteCustomerCard', err);
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

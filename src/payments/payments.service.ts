import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { CheckoutSessionDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import { ProductRepository } from '../product/product.repository';
import { SalesService } from '../sales/sales.service';
import { SALE_STATUS } from '@app/common/constants';
import { SaleStatusType } from 'src/sales/entities/sale.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly productRepository: ProductRepository,
    private readonly orderService: SalesService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(
    checkoutSessionDto: CheckoutSessionDto,
    customerId: string,
  ) {
    try {
      const lineItems = [];
      const temp = [];
      const domain = this.configService.get('REDIRECT_FRONTEND_URL');
      for (const item of checkoutSessionDto.lineItems) {
        const product = await this.productRepository.findOne({ _id: item.id });
        if (product) {
          temp.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            icon: product.icon,
          });
          lineItems.push({
            price_data: {
              currency: 'usd',
              unit_amount: product.price * 100,
              product_data: {
                name: product.name,
                description: product.description,
                images: [product.icon],
              },
            },
            quantity: item.quantity,
          });
        }
      }

      let customerInfo: any = {
        customer_email: checkoutSessionDto.email,
      };
      if (customerId) {
        customerInfo = {
          customer: customerId,
          customer_update: {
            shipping: 'auto',
          },
        };
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${domain}/checkout/success?success=true`,
        cancel_url: `${domain}/cart`,
        automatic_tax: { enabled: true },
        line_items: lineItems,
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1500,
                currency: 'usd',
              },
              display_name: 'Next day air',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 1,
                },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1900,
                currency: 'usd',
              },
              display_name: '2 day shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 2,
                },
              },
            },
          },
        ],
        ...customerInfo,
      });
      return { session, lineItems: temp };
    } catch (err) {
      this.logger.error('payments.service.checkoutSession', err);
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

  async createWebhook(request: Request, response: Response) {
    let event: Stripe.Event;
    const sig = request.headers['stripe-signature'];
    const payload = request.rawBody;
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_TOKEN');

    try {
      event = this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          // const paymentIntentSucceeded = event.data.object;
          break;
        case 'checkout.session.completed':
          const checkouSessionSucceeded = event.data.object;
          this.updateSale(checkouSessionSucceeded);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  }

  async getCheckoutSession(id: string): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(id);
      return session;
    } catch (err) {
      this.logger.error('payments.service.getCheckoutSession', err);
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

  async getLineItems(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.LineItem>>> {
    try {
      const lineItems = await this.stripe.checkout.sessions.listLineItems(
        sessionId,
      );
      return lineItems;
    } catch (err) {
      this.logger.error('payments.service.getLineItems', err);
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

  async findAll(): Promise<
    Stripe.Response<Stripe.ApiList<Stripe.Checkout.Session>>
  > {
    try {
      const sessions = await this.stripe.checkout.sessions.list();
      return sessions;
    } catch (err) {
      this.logger.error('payments.service.findAll', err);
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

  async findOne(id: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
      return paymentIntent;
    } catch (err) {
      this.logger.error('payments.service.findOne', err);
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

  private async updateSale(session: Stripe.Checkout.Session): Promise<void> {
    try {
      const order = await this.orderService.findBySession(session.id);
      if (!order) {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.NOT_FOUND,
          errors: [
            {
              field: 'order',
              message: 'Order was not found',
            },
          ],
        });
      }
      await this.orderService.update(order.id, {
        status: SALE_STATUS.processing as SaleStatusType,
        orderNumber: await this.orderService.generateOrderNumber(),
        shippingAddress: session?.shipping_details?.address,
        billingAddress: session?.customer_details?.address,
        customer: {
          name: session?.customer_details?.name,
          email: session?.customer_details?.email,
          phone: session?.customer_details?.phone,
        },
        totalAmount: session.amount_total / 100,
        shipping: session?.total_details?.amount_shipping
          ? session.total_details.amount_shipping / 100
          : 0,
        tax: session?.total_details?.amount_tax
          ? session.total_details.amount_tax / 100
          : 0,
      });
    } catch (err) {
      this.logger.error('payments.service.updateSaleStatus', err);
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
}

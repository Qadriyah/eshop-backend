import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesRepository } from './sales.repository';
import { SaleDocument } from './entities/sale.entity';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createSaleDto: CreateSaleDto): Promise<SaleDocument> {
    try {
      const order = this.salesRepository.create(
        createSaleDto as unknown as SaleDocument,
      );
      return order;
    } catch (err) {
      this.logger.error('sales.service.create', err);
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

  async findBySession(sessionId: string): Promise<SaleDocument> {
    try {
      const order = this.salesRepository.findOne({ session: sessionId });
      return order;
    } catch (err) {
      this.logger.error('sales.service.findBySession', err);
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
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: string, updateSaleDto: UpdateSaleDto): Promise<SaleDocument> {
    try {
      const order = this.salesRepository.findOneAndUpdate(
        { _id: id },
        updateSaleDto,
      );
      return order;
    } catch (err) {
      this.logger.error('sales.service.update', err);
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

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}

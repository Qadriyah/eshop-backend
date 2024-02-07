import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';
import { AddressDocument } from './entities/address.entity';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(private readonly addressRepository: AddressRepository) {}

  async create(createAddressDto: CreateAddressDto): Promise<AddressDocument> {
    try {
      const address = await this.addressRepository.create({
        ...createAddressDto,
      } as unknown as AddressDocument);
      return address;
    } catch (err) {
      this.logger.error('address.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(): Promise<AddressDocument[]> {
    try {
      const addresses = await this.addressRepository.find({});
      return addresses;
    } catch (err) {
      this.logger.error('address.service.findAll', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findOne(addressId: string): Promise<AddressDocument> {
    try {
      const address = await this.addressRepository.findOne({ _id: addressId });
      return address;
    } catch (err) {
      this.logger.error('address.service.findOne', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDocument> {
    try {
      const address = await this.addressRepository.findOneAndUpdate(
        { _id: addressId },
        updateAddressDto,
      );
      return address;
    } catch (err) {
      this.logger.error('address.service.update', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async remove(addressId: string): Promise<any> {
    try {
      const address = await this.addressRepository.deleteOne({
        _id: addressId,
      });
      return address;
    } catch (err) {
      this.logger.error('address.service.remove', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}

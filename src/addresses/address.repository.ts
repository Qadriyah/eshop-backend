import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Address, AddressDocument } from './entities/address.entity';

@Injectable()
export class AddressRepository extends AbstractRepository<AddressDocument> {
  constructor(@InjectModel(Address.name) addressModel: Model<AddressDocument>) {
    super(addressModel);
  }
}

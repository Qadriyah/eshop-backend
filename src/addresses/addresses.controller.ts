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
import { AddressesService } from './addresses.service';
import { AddressResponse, CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressesValidationPipe } from './addresses.pipe';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(
    @Body(AddressesValidationPipe) createAddressDto: CreateAddressDto,
    @CurrentUser() user: UserDocument,
  ): Promise<AddressResponse> {
    const address = await this.addressesService.create({
      ...createAddressDto,
      user: user.id,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Address has been created successfully',
      address,
    };
  }

  @Get()
  async findAll(): Promise<AddressResponse> {
    const addresses = await this.addressesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      addresses,
    };
  }

  @Get(':addressId')
  async findOne(
    @Param('addressId') addressId: string,
  ): Promise<AddressResponse> {
    const address = await this.addressesService.findOne(addressId);
    return {
      statusCode: HttpStatus.OK,
      address,
    };
  }

  @Patch(':addressId')
  async update(
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponse> {
    const address = await this.addressesService.update(
      addressId,
      updateAddressDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Address has been updated successfully',
      address,
    };
  }

  @Delete(':addressId')
  async remove(
    @Param('addressId') addressId: string,
  ): Promise<AddressResponse> {
    const address = await this.addressesService.remove(addressId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Address has been deleted successfully',
      address,
    };
  }
}

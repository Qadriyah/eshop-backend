import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, MessageResponse } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MessagesPipe } from './messages.pipe';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body(MessagesPipe) createMessageDto: CreateMessageDto,
  ): Promise<MessageResponse> {
    const message = await this.messagesService.create(createMessageDto);
    return {
      statusCode: HttpStatus.CREATED,
      messageObj: message,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<MessageResponse> {
    const messages = await this.messagesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      messages,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageResponse> {
    const message = await this.messagesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      messageObj: message,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<MessageResponse> {
    const message = await this.messagesService.update(id, updateMessageDto);
    return {
      statusCode: HttpStatus.OK,
      messageObj: message,
    };
  }
}

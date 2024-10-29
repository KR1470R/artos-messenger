import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
} from './dto/requests';
import { MessagesService } from './messages.service';
import UpdateMessageRequestDto from './dto/requests/update-message.request.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionsFilter } from '#common/filters';
import { Messages } from '#core/db/entities.type';

@WebSocketGateway(80, {
  namespace: 'messages',
  cors: true,
})
@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionsFilter)
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('create_message')
  public async createMessage(
    @MessageBody() data: CreateMessageRequestDto,
  ): Promise<WsResponse<number>> {
    const newMessageId = await this.messagesService.processCreate(data);

    return {
      event: 'create_message',
      data: newMessageId,
    };
  }

  @SubscribeMessage('update_message')
  public async updateMessage(
    @MessageBody() data: UpdateMessageRequestDto,
  ): Promise<WsResponse<string>> {
    await this.messagesService.processUpdate(data);
    return {
      event: 'update_message',
      data: 'Message updated successfully.',
    };
  }

  @SubscribeMessage('find_many_messages')
  public async findManyMessages(
    @MessageBody() data: FindManyMessagesRequestDto,
  ): Promise<WsResponse<Pick<Messages, 'content' | 'sender_id' | 'id'>[]>> {
    const messages = await this.messagesService.processFindMany(data);
    return {
      event: 'find_many_messages',
      data: messages,
    };
  }

  @SubscribeMessage('delete_message')
  public async deleteMessage(
    @MessageBody() data: DeleteMessageRequestDto,
  ): Promise<WsResponse<string>> {
    await this.messagesService.processDelete(data);
    return {
      event: 'delete_message',
      data: 'Message deleted successfully.',
    };
  }
}

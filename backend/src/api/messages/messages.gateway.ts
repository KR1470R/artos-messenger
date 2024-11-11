import { WsExceptionsFilter } from '#common/filters';
import {
  ParseIntPipe,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
} from './dto/requests';
import UpdateMessageRequestDto from './dto/requests/update-message.request.dto';
import { Messages } from './messages.entity';
import { MessagesService } from './messages.service';
import { Server } from 'net';

@WebSocketGateway(8080, {
  namespace: 'messages',
  cors: true,
})
@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionsFilter)
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('join_chat')
  public async handleJoinChat(
    @MessageBody('chat_id', new ParseIntPipe()) chatId: number,
    @MessageBody('user_id', new ParseIntPipe()) userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    await this.messagesService.processJoinChatUserSocket(
      chatId,
      userId,
      client,
    );

    return {
      event: 'join_chat',
      data: 'Joined chat successfully.',
    };
  }

  @SubscribeMessage('leave_chat')
  public handleLeaveChat(
    @MessageBody('chat_id', new ParseIntPipe()) chatId: number,
    @MessageBody('user_id', new ParseIntPipe()) userId: number,
  ) {
    this.messagesService.processLeaveChatUserSocket(chatId, userId);

    return {
      event: 'leave_chat',
      data: 'Left chat successfully.',
    };
  }

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

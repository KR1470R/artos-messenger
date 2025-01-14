import { JwtAuthWsGuard } from '#api/auth/guards';
import { LogginedUserIdWs } from '#common/decorators';
import { WsExceptionsFilter } from '#common/filters';
import {
  ExecutionContext,
  ParseIntPipe,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'net';
import { Socket } from 'socket.io';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
  UpdateMessageRequestDto,
} from './dto/requests';
import { Messages } from './messages.entity';
import { MessagesService } from './messages.service';

@WebSocketGateway(8080, {
  namespace: 'messages',
  cors: true,
})
@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionsFilter)
@UseGuards(JwtAuthWsGuard)
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtAuthWsGuard: JwtAuthWsGuard,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const context: ExecutionContext = this.createExecutionContext(client);

      const isAuthorized = await this.jwtAuthWsGuard.canActivate(context);
      if (!isAuthorized) {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      client.disconnect();
    }
  }

  private createExecutionContext(client: Socket): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => client,
        getResponse: () => client,
      }),
    } as ExecutionContext;
  }

  @SubscribeMessage('join_chat')
  public async joinChat(
    @ConnectedSocket() client: Socket,
    @LogginedUserIdWs() userId: number,
    @MessageBody('chat_id', new ParseIntPipe()) chatId: number,
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
  public leaveChat(
    @LogginedUserIdWs() userId: number,
    @MessageBody('chat_id', new ParseIntPipe()) chatId: number,
  ) {
    this.messagesService.processLeaveChatUserSocket(chatId, userId);

    return {
      event: 'leave_chat',
      data: 'Left chat successfully.',
    };
  }

  @SubscribeMessage('create_message')
  public async createMessage(
    @LogginedUserIdWs() logginedUserId: number,
    @MessageBody() data: CreateMessageRequestDto,
  ): Promise<WsResponse<number>> {
    const newMessageId = await this.messagesService.processCreate(
      logginedUserId,
      data,
    );

    return {
      event: 'create_message',
      data: newMessageId,
    };
  }

  @SubscribeMessage('update_message')
  public async updateMessage(
    @LogginedUserIdWs() logginedUserId: number,
    @MessageBody() data: UpdateMessageRequestDto,
  ): Promise<WsResponse<string>> {
    await this.messagesService.processUpdate(logginedUserId, data);

    return {
      event: 'update_message',
      data: 'Message updated successfully.',
    };
  }

  @SubscribeMessage('find_many_messages')
  public async findManyMessages(
    @LogginedUserIdWs() logginedUserId: number,
    @MessageBody() data: FindManyMessagesRequestDto,
  ): Promise<
    WsResponse<Pick<Messages, 'content' | 'sender_id' | 'id' | 'is_read'>[]>
  > {
    const messages = await this.messagesService.processFindMany(
      logginedUserId,
      data,
    );

    return {
      event: 'find_many_messages',
      data: messages,
    };
  }

  @SubscribeMessage('delete_message')
  public async deleteMessage(
    @LogginedUserIdWs() logginedUserId: number,
    @MessageBody() data: DeleteMessageRequestDto,
  ): Promise<WsResponse<string>> {
    await this.messagesService.processDelete(logginedUserId, data);

    return {
      event: 'delete_message',
      data: 'Message deleted successfully.',
    };
  }
}

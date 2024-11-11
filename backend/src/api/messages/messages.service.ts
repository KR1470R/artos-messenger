import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
} from './dto/requests';
import { MessagesRepository } from './messages.repository';
import { ChatsUsersRepository } from '#api/chats/chats-users.repository';
import { ChatUserRolesEnum } from '#core/db/types';
import UpdateMessageRequestDto from './dto/requests/update-message.request.dto';
import { Socket } from 'socket.io';
import { SyncMessagesEvents } from './types';
import BaseMessageRequestDto from './dto/requests/base-message.request.dto';

@Injectable()
export class MessagesService {
  private readonly chatsUsersListeners: Map<number, Map<number, Socket>> =
    new Map();

  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatsUsersRepository: ChatsUsersRepository,
  ) {}

  private async assertUserAccess(
    senderId: number,
    chatId: number,
    checkRole = true,
  ) {
    const chatUser = await this.chatsUsersRepository.findOne(senderId, chatId);
    if (!chatUser) throw new Error('Access denied.');

    if (checkRole && chatUser.role_id === ChatUserRolesEnum.BANNED)
      throw new Error('Access denied.');
  }

  public async processJoinChatUserSocket(
    chatId: number,
    userId: number,
    socket: Socket,
  ) {
    await this.assertUserAccess(userId, chatId);

    const targetChatUsers = this.chatsUsersListeners.get(chatId);
    if (!targetChatUsers) {
      const newChatUsers = new Map();
      newChatUsers.set(userId, socket);

      this.chatsUsersListeners.set(chatId, newChatUsers);
    } else {
      const targetChatUsersSocket = targetChatUsers.get(userId);
      if (targetChatUsersSocket)
        throw new ConflictException('User already joined this chat.');

      targetChatUsers.set(userId, socket);
    }
  }

  public async processLeaveChatUserSocket(chatId: number, userId: number) {
    await this.assertUserAccess(userId, chatId);

    const targetChat = this.chatsUsersListeners.get(chatId);
    if (!targetChat) throw new NotFoundException('Chat not found.');

    targetChat.delete(userId);
  }

  public async asyncMessageToAllChatUsers(
    syncEvent: SyncMessagesEvents,
    data: BaseMessageRequestDto & { id: number },
  ) {
    const targetChat = this.chatsUsersListeners.get(data.chat_id);
    if (targetChat) {
      for (const receiverId of targetChat.keys()) {
        const socket = targetChat.get(receiverId)!;
        if (data.chat_id === data.chat_id)
          socket.emit(syncEvent, {
            receiver_id: receiverId,
            ...data,
          });
      }
    }
  }

  public async processCreate(data: CreateMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    const newMessageId = await this.messagesRepository.create(data);

    await this.asyncMessageToAllChatUsers('new_message', {
      ...data,
      id: newMessageId,
    });

    return newMessageId;
  }

  public async processUpdate(data: UpdateMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    await this.messagesRepository.update(data.id, {
      content: data.content,
      is_read: data.is_read,
    });

    await this.asyncMessageToAllChatUsers('updated_message', data);
  }

  public async processDelete(data: DeleteMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    await this.messagesRepository.delete(data.id);

    await this.asyncMessageToAllChatUsers('deleted_message', data);
  }

  public async processFindMany(data: FindManyMessagesRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id, false);

    return await this.messagesRepository.findMany(data);
  }
}

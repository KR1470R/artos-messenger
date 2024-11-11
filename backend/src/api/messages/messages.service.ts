import { ConflictException, Injectable } from '@nestjs/common';
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
    logginedUserId: number,
    chatId: number,
    checkRole = true,
  ) {
    const chatUser = await this.chatsUsersRepository.findOne(
      logginedUserId,
      chatId,
    );
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

    // handle scenario when user disconnects unexpectedly
    socket.on('disconnect', async () => {
      await this.leaveChatUserSocket(chatId, userId);
    });

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

  private async leaveChatUserSocket(chatId: number, userId: number) {
    const targetChat = this.chatsUsersListeners.get(chatId);
    if (!targetChat) return;

    const targetSocket = targetChat.get(userId);
    if (targetSocket) {
      targetSocket.removeAllListeners('disconnect');
      targetSocket.disconnect(true);
    }

    targetChat.delete(userId);
    if (!targetChat.size) this.chatsUsersListeners.delete(chatId);
  }

  public async processLeaveChatUserSocket(chatId: number, userId: number) {
    await this.assertUserAccess(userId, chatId);
    await this.leaveChatUserSocket(chatId, userId);
  }

  public async syncMessageToAllChatUsersSockets(
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

  public async processCreate(
    logginedUserId: number,
    data: CreateMessageRequestDto,
  ) {
    await this.assertUserAccess(logginedUserId, data.chat_id);

    const newMessageId = await this.messagesRepository.create(
      logginedUserId,
      data,
    );

    await this.syncMessageToAllChatUsersSockets('new_message', {
      ...data,
      id: newMessageId,
    });

    return newMessageId;
  }

  public async processUpdate(
    logginedUserId: number,
    data: UpdateMessageRequestDto,
  ) {
    await this.assertUserAccess(logginedUserId, data.chat_id);

    await this.messagesRepository.update(data.id, {
      content: data.content,
      is_read: data.is_read,
    });

    await this.syncMessageToAllChatUsersSockets('updated_message', data);
  }

  public async processDelete(
    logginedUserId: number,
    data: DeleteMessageRequestDto,
  ) {
    await this.assertUserAccess(logginedUserId, data.chat_id);

    await this.messagesRepository.delete(data.id);

    await this.syncMessageToAllChatUsersSockets('deleted_message', data);
  }

  public async processFindMany(
    logginedUserId: number,
    data: FindManyMessagesRequestDto,
  ) {
    await this.assertUserAccess(logginedUserId, data.chat_id, false);

    return await this.messagesRepository.findMany(data);
  }
}

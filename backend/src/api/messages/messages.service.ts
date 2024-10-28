import { Injectable } from '@nestjs/common';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
} from './dto/requests';
import { MessagesRepository } from './messages.repository';
import { ChatsUsersRepository } from '#api/chats/chats-users.repository';
import { ChatUserRolesEnum } from '#core/db/types';
import UpdateMessageRequestDto from './dto/requests/update-message.request.dto';

@Injectable()
export class MessagesService {
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

  public async processCreate(data: CreateMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    return await this.messagesRepository.create(data);
  }

  public async processUpdate(data: UpdateMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    return await this.messagesRepository.update(data.id, {
      content: data.content,
      is_read: data.is_read,
    });
  }

  public async processDelete(data: DeleteMessageRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id);

    await this.messagesRepository.delete(data.id);
  }

  public async processFindMany(data: FindManyMessagesRequestDto) {
    await this.assertUserAccess(data.sender_id, data.chat_id, false);

    return await this.messagesRepository.findMany(data);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import { ChatsUsersRepository } from '#api/chats/chats-users.repository';
import { ChatTypesEnum, UserChatRolesEnum } from '#core/db/types';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatsUsersRepository: ChatsUsersRepository,
  ) {}

  public async processCreate(logginedUserId: number, targetUserId: number) {
    const existentDirectChat = await this.chatsUsersRepository.findDirectChat(
      logginedUserId,
      targetUserId,
    );
    if (existentDirectChat) throw new ConflictException('Chat already exists.');

    const chatId = await this.chatsRepository.create({
      type: ChatTypesEnum.DIRECT,
    });
    const users = [
      {
        user_id: logginedUserId,
        chat_id: chatId,
        role_id: UserChatRolesEnum.ADMIN,
      },
      {
        user_id: targetUserId,
        chat_id: chatId,
        role_id: UserChatRolesEnum.ADMIN,
      },
    ];
    await this.chatsUsersRepository.create(users);

    return chatId;
  }

  public async processDelete(logginedUserId: number, chatId: number) {
    await this.processFindOne(logginedUserId, chatId);
    await this.chatsUsersRepository.deleteMany(chatId);
    await this.chatsRepository.delete(chatId);
  }

  public async processFindMany(logginedUserId: number) {
    return await this.chatsUsersRepository.findMany(logginedUserId);
  }

  public async processFindOne(logginedUserId: number, chatId: number) {
    const targetChat = await this.chatsRepository.findOne(chatId);
    if (!targetChat) throw new NotFoundException('Chat not found.');

    const chatUser = await this.chatsUsersRepository.findMany(
      logginedUserId,
      targetChat.id,
    );

    if (!chatUser.length) throw new NotFoundException('Chat not found.');

    return targetChat;
  }
}

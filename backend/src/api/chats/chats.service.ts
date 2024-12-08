import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatTypesEnum, ChatUserRolesEnum } from '#core/db/types';
import { ChatsRepositoryToken, ChatsUsersRepositoryToken } from './constants';
import { IChatsRepository, IChatsUsersRepository } from './interfaces';
import { FilterChatsQueryDto } from './dto/requests';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatsRepositoryToken)
    private readonly chatsRepository: IChatsRepository,
    @Inject(ChatsUsersRepositoryToken)
    private readonly chatsUsersRepository: IChatsUsersRepository,
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
        role_id: ChatUserRolesEnum.OWNER,
      },
      {
        user_id: targetUserId,
        chat_id: chatId,
        role_id: ChatUserRolesEnum.OWNER,
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

  public async processFindMany(
    logginedUserId: number,
    query?: FilterChatsQueryDto,
  ) {
    const relatedChatsIds = (
      await this.chatsUsersRepository.findMany(logginedUserId)
    ).map((chat) => chat.chat_id);
    const data = await this.chatsRepository.findMany(relatedChatsIds, query);
    return {
      data,
    };
  }

  public async processFindOne(logginedUserId: number, chatId: number) {
    const targetChat = await this.chatsRepository.findOne(chatId);
    if (!targetChat) throw new NotFoundException('Chat not found.');

    const chatMembers = await this.chatsUsersRepository.findMany(
      logginedUserId,
      targetChat.id,
    );

    if (!chatMembers.find((member) => member.user_id === logginedUserId))
      throw new ForbiddenException('User does not persist in this chat.');

    return {
      ...targetChat,
      members: chatMembers,
    };
  }
}

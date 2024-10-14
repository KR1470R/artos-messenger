import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { ChatsRepository } from '#api/chats/chats.repository';
import { ChatsUsersRepository } from '#api/chats/chats-users.repository';
import {
  CreateGroupRequestDto,
  FindManyGroupsRequestDto,
  UpdateGroupRequestDto,
} from './dto/requests';
import { ChatTypesEnum, UserChatRolesEnum } from '#core/db/types';
import { GroupsChatsUsersRepository } from './groups-chats-users.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly chatsRepository: ChatsRepository,
    private readonly chatsUsersRepository: ChatsUsersRepository,
    private readonly groupsChatsUsersRepository: GroupsChatsUsersRepository,
  ) {}

  public async processCreate(
    logginedUserId: number,
    data: CreateGroupRequestDto,
  ) {
    const chatId = await this.chatsRepository.create({
      type: ChatTypesEnum.GROUP,
    });
    const payload = {
      ...data,
      chat_id: chatId,
    };
    const groupId = await this.groupsRepository.create(payload);
    const invitedUsers = [
      {
        user_id: logginedUserId,
        chat_id: chatId,
        role_id: UserChatRolesEnum.ADMIN,
      },
      ...(data.invited_users_ids?.map((userId) => ({
        user_id: userId,
        chat_id: chatId,
        role_id: UserChatRolesEnum.USER,
      })) ?? []),
    ];

    await this.chatsUsersRepository.create(invitedUsers);

    return groupId;
  }

  public async processUpdate(id: number, data: UpdateGroupRequestDto) {
    return await this.groupsRepository.update(id, data);
  }

  public async processAddMember(
    logginedUserId: number,
    id: number,
    targetUserId: number,
  ) {
    const targetGroup = await this.processFindOne(logginedUserId, id);
    const chatId = targetGroup.chat_id;
    const user = {
      user_id: targetUserId,
      chat_id: chatId,
      role_id: UserChatRolesEnum.USER,
    };

    return this.chatsUsersRepository.create(user);
  }

  public async processDeleteMember(
    logginedUserId: number,
    id: number,
    targetUserId: number,
  ) {
    const targetGroup = await this.processFindOne(logginedUserId, id);
    const chatId = targetGroup.chat_id;

    return this.chatsUsersRepository.delete(targetUserId, chatId);
  }

  public async processUpdateMember(
    logginedUserId: number,
    id: number,
    targetUserId: number,
    roleId: number,
  ) {
    const targetGroup = await this.processFindOne(logginedUserId, id);
    const chatId = targetGroup.chat_id;

    return this.chatsUsersRepository.update(chatId, targetUserId, {
      role_id: roleId,
    });
  }

  public async processDelete(logginedUserId: number, id: number) {
    const targetGroup = await this.processFindOne(logginedUserId, id);
    await this.chatsUsersRepository.deleteMany(logginedUserId);
    await this.chatsRepository.delete(targetGroup.chat_id);
    return this.groupsRepository.delete(id);
  }

  public async processFindMany(
    logginedUserId: number,
    filters: FindManyGroupsRequestDto,
  ) {
    const data = await this.groupsChatsUsersRepository.findMany(
      logginedUserId,
      filters,
    );

    return { data };
  }

  public async processFindOne(logginedUserId: number, id: number) {
    const target = await this.groupsChatsUsersRepository.findOne(
      logginedUserId,
      id,
    );
    if (!target) throw new NotFoundException('Group not found.');

    return target;
  }
}

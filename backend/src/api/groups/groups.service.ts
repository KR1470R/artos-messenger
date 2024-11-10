import { ChatsUsers } from '#api/chats/chats-users.entity';
import { ChatsUsersRepository } from '#api/chats/chats-users.repository';
import { ChatsRepository } from '#api/chats/chats.repository';
import { UsersService } from '#api/users/users.service';
import { ChatTypesEnum, ChatUserRolesEnum } from '#core/db/types';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateGroupRequestDto,
  FindManyGroupsRequestDto,
  UpdateGroupRequestDto,
} from './dto/requests';
import { GroupsChatsUsersRepository } from './groups-chats-users.repository';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly chatsRepository: ChatsRepository,
    private readonly chatsUsersRepository: ChatsUsersRepository,
    private readonly groupsChatsUsersRepository: GroupsChatsUsersRepository,
    private readonly usersService: UsersService,
  ) {}

  private async accessMemberRole(
    targetChatMember:
      | number
      | Pick<
          ChatsUsers,
          'id' | 'chat_id' | 'user_id' | 'role_id' | 'created_at' | 'updated_at'
        >,
    groupId: number,
    requiredRoles: ChatUserRolesEnum[],
  ) {
    targetChatMember =
      typeof targetChatMember === 'number'
        ? await this.processGetMember(targetChatMember, groupId)
        : targetChatMember;

    if (!requiredRoles.includes(targetChatMember.role_id))
      throw new ForbiddenException('Access denied.');
  }

  public async processCreate(
    logginedUserId: number,
    data: CreateGroupRequestDto,
  ) {
    await this.usersService.processFindOne(logginedUserId);

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
        role_id: ChatUserRolesEnum.OWNER,
      },
      ...(data.invited_users_ids?.map((userId) => ({
        user_id: userId,
        chat_id: chatId,
        role_id: ChatUserRolesEnum.USER,
      })) ?? []),
    ];

    await this.chatsUsersRepository.create(invitedUsers);

    return groupId;
  }

  private async processGetMember(userId: number, groupId: number) {
    await this.processFindOne(userId, groupId);

    const targetGroupMember = await this.groupsChatsUsersRepository.findOne(
      userId,
      groupId,
    );
    if (!targetGroupMember)
      throw new ForbiddenException(
        `The user "${userId}" is not a member of the group.`,
      );

    const targetChatMember = await this.chatsUsersRepository.findOne(
      userId,
      targetGroupMember.chat_id,
    );
    if (!targetChatMember)
      throw new ForbiddenException(
        `The user "${userId}" is not a member of the chat.`,
      );

    return targetChatMember;
  }

  public async processUpdate(
    logginedUserId: number,
    groupId: number,
    data: UpdateGroupRequestDto,
  ) {
    await this.accessMemberRole(logginedUserId, groupId, [
      ChatUserRolesEnum.OWNER,
      ChatUserRolesEnum.ADMIN,
    ]);
    return await this.groupsRepository.update(groupId, data);
  }

  public async processAddMember(
    logginedUserId: number,
    groupId: number,
    targetUserId: number,
  ) {
    const logginedUser = await this.processGetMember(logginedUserId, groupId);
    await this.accessMemberRole(logginedUser, groupId, [
      ChatUserRolesEnum.OWNER,
      ChatUserRolesEnum.ADMIN,
    ]);

    let targetUser;
    try {
      targetUser = await this.processGetMember(targetUserId, groupId);
    } catch (e) {}
    if (targetUser)
      throw new ForbiddenException('User is already a member of the group.');

    const targetGroup = await this.processFindOne(logginedUserId, groupId);
    const chatId = targetGroup.chat_id;
    const user = {
      user_id: targetUserId,
      chat_id: chatId,
      role_id: ChatUserRolesEnum.USER,
    };

    return this.chatsUsersRepository.create(user);
  }

  public async processDeleteMember(
    logginedUserId: number,
    groupId: number,
    targetUserId: number,
  ) {
    const logginedUser = await this.processGetMember(logginedUserId, groupId);
    const targetUser = await this.processGetMember(targetUserId, groupId);

    if (targetUser.role_id === ChatUserRolesEnum.OWNER)
      throw new ForbiddenException('Owner can not be deleted.');
    if (logginedUserId !== targetUserId)
      await this.accessMemberRole(logginedUser.user_id, groupId, [
        ChatUserRolesEnum.OWNER,
        ChatUserRolesEnum.ADMIN,
      ]);

    const targetGroup = await this.processFindOne(
      logginedUser.user_id,
      groupId,
    );
    const chatId = targetGroup.chat_id;

    return this.chatsUsersRepository.delete(targetUser.user_id, chatId);
  }

  public async processUpdateMember(
    logginedUserId: number,
    groupId: number,
    targetUserId: number,
    roleId: number,
  ) {
    await this.accessMemberRole(logginedUserId, groupId, [
      ChatUserRolesEnum.OWNER,
      ChatUserRolesEnum.ADMIN,
    ]);

    const targetGroup = await this.processFindOne(logginedUserId, groupId);
    const chatId = targetGroup.chat_id;

    return this.chatsUsersRepository.update(chatId, targetUserId, {
      role_id: roleId,
    });
  }

  public async processDelete(logginedUserId: number, groupId: number) {
    await this.accessMemberRole(logginedUserId, groupId, [
      ChatUserRolesEnum.OWNER,
    ]);

    const targetGroup = await this.processFindOne(logginedUserId, groupId);
    await this.groupsRepository.delete(groupId);
    await this.chatsUsersRepository.deleteMany(logginedUserId);
    await this.chatsRepository.delete(targetGroup.chat_id);
  }

  public async processFindMany(
    logginedUserId: number,
    filters: FindManyGroupsRequestDto,
  ) {
    const data = await this.groupsChatsUsersRepository.findMany(
      logginedUserId,
      filters,
    );

    return data;
  }

  public async processFindOne(logginedUserId: number, groupId: number) {
    const target = await this.groupsChatsUsersRepository.findOne(
      logginedUserId,
      groupId,
    );
    if (!target) throw new NotFoundException(`Group "${groupId}" not found.`);

    return target;
  }
}

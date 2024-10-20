import {
  createBaseTestingModule,
  flushMockGroupsDb,
  flushMockUsersDb,
  prepareMockUsersDb,
} from '#common/test/utils';
import { Knex } from 'knex';
import { GroupsService } from '../groups.service';
import { GroupsRepository } from '../groups.repository';
import { GroupsController } from '../groups.controller';
import {
  adminMemberMock,
  bannedMemberMock,
  ownerMemberMock,
  userMemberMock,
} from '#common/test/mock';
import groupMock from '#common/test/mock/group.mock';
import { Users } from '#core/db/entities.type';
import { ChatUserRolesEnum } from '#core/db/types';
import { GroupsChatsUsersRepository } from '../groups-chats-users.repository';
import { ChatsModule } from '#api/chats/chats.module';
import { UsersModule } from '#api/users/users.module';

let groupsController: GroupsController;
let db: Knex;

const groupPayload = {
  ...groupMock,
};

type Member = Pick<Users, 'id' | 'name'>;

const testCreate = async (ownerUser: Member, invitedUsersIds?: number[]) => {
  const result = await groupsController.create(ownerUser.id, {
    ...groupPayload,
    invited_users_ids: invitedUsersIds,
  });
  expect(result.id).toBeDefined();
  expect(result.message).toEqual('Group created successfully.');

  groupPayload['id'] = result.id;
};
const testFindOne = async (ownerUser: Member) => {
  const result = await groupsController.findOne(ownerUser.id, groupPayload.id);
  expect(result.id).toEqual(groupPayload.id);
};
const testFindOneNotFound = async (ownerUser: Member, groupId?: number) => {
  groupId = groupId ?? groupPayload.id;
  await expect(
    groupsController.findOne(ownerUser.id, groupId),
  ).rejects.toThrow();
};
const testAddMember = async (ownerUser: Member, targetUser: Member) => {
  const result = await groupsController.addMember(
    ownerUser.id,
    groupPayload.id,
    targetUser.id,
  );
  expect(result.message).toEqual('Member added successfully.');
};
const testAddMemberForbidden = async (
  ownerUser: Member,
  targetUser: Member,
) => {
  await expect(
    groupsController.addMember(ownerUser.id, groupPayload.id, targetUser.id),
  ).rejects.toThrow();
};
const testUpdateMember = async (
  ownerUser: Member,
  targetUser: Member,
  role: ChatUserRolesEnum,
) => {
  const result = await groupsController.updateMember(
    ownerUser.id,
    groupPayload.id,
    targetUser.id,
    role,
  );
  expect(result.message).toEqual('Member updated successfully.');
};
const testUpdateMemberForbidden = async (
  ownerUser: Member,
  targetUser: Member,
  role: ChatUserRolesEnum,
) => {
  await expect(
    groupsController.updateMember(
      ownerUser.id,
      groupPayload.id,
      targetUser.id,
      role,
    ),
  ).rejects.toThrow();
};
const testUpdate = async (ownerUser: Member) => {
  const newGroupName = 'newname';
  const result = await groupsController.update(ownerUser.id, groupPayload.id, {
    title: newGroupName,
  });
  expect(result.message).toEqual('Group updated successfully.');

  const updatedGroup = await groupsController.findOne(
    ownerUser.id,
    groupPayload.id,
  );
  expect(updatedGroup.title).toEqual(newGroupName);

  groupPayload.title = newGroupName;
};
const testUpdateForbidden = async (ownerUser: Member) => {
  await expect(
    groupsController.update(ownerUser.id, groupPayload.id, {
      title: 'newname',
    }),
  ).rejects.toThrow();
};
const testDeleteMember = async (ownerUser: Member, targetUser: Member) => {
  const result = await groupsController.deleteMember(
    ownerUser.id,
    groupPayload.id,
    targetUser.id,
  );
  expect(result.message).toEqual('Member deleted successfully.');
};
const testDeleteMemberForbidden = async (
  ownerUser: Member,
  targetUser: Member,
) => {
  await expect(
    groupsController.deleteMember(ownerUser.id, groupPayload.id, targetUser.id),
  ).rejects.toThrow();
};
const testDelete = async (ownerUser: Member) => {
  const result = await groupsController.delete(ownerUser.id, groupPayload.id);
  expect(result.message).toEqual('Group deleted successfully.');
};
const testDeleteForbidden = async (ownerUser: Member) => {
  await expect(
    groupsController.delete(ownerUser.id, groupPayload.id),
  ).rejects.toThrow();
};

beforeAll(async () => {
  const testModule = await createBaseTestingModule({
    imports: [ChatsModule, UsersModule],
    controllers: [GroupsController],
    providers: [GroupsService, GroupsRepository, GroupsChatsUsersRepository],
  });

  groupsController = testModule.get<GroupsController>(GroupsController);
  db = testModule.get<Knex>('default');

  await flushMockUsersDb(db);
  await flushMockGroupsDb(db);
  await prepareMockUsersDb(db);
});

afterAll(async () => {
  await flushMockUsersDb(db);
  await flushMockGroupsDb(db);
  await db.destroy();
});

describe('GroupsModule', () => {
  it('users should be able to create groups', async () => {
    await testCreate(ownerMemberMock, [bannedMemberMock.id]);
  });

  it('users should be able to find groups', async () => {
    await testFindOne(ownerMemberMock);
  });

  it('user should not be able to find group that does not exist', async () => {
    await testFindOneNotFound(ownerMemberMock, -1);
  });

  it('users should not be able to find groups they are not members of', async () => {
    await testFindOneNotFound(userMemberMock);
  });

  it('owners of group should be able to add new members', async () => {
    await testAddMember(ownerMemberMock, adminMemberMock);
  });

  it('users cannot add members that are already in the group', async () => {
    await testAddMemberForbidden(ownerMemberMock, adminMemberMock);
  });

  it('owners of group should be able to update members', async () => {
    await testUpdateMember(
      ownerMemberMock,
      adminMemberMock,
      ChatUserRolesEnum.ADMIN,
    );
  });

  it('admins of group should be able to add new members', async () => {
    await testAddMember(adminMemberMock, userMemberMock);
  });
  it('users of group should not be able to add new members', async () => {
    await testAddMemberForbidden(userMemberMock, ownerMemberMock);
    await testAddMemberForbidden(userMemberMock, adminMemberMock);
    await testAddMemberForbidden(userMemberMock, userMemberMock);
    await testAddMemberForbidden(userMemberMock, bannedMemberMock);
  });

  it('users of group should not be able to update members', async () => {
    await testUpdateMemberForbidden(
      userMemberMock,
      ownerMemberMock,
      ChatUserRolesEnum.OWNER,
    );
    await testUpdateMemberForbidden(
      userMemberMock,
      adminMemberMock,
      ChatUserRolesEnum.ADMIN,
    );
  });

  it('owners should be able to update groups', async () => {
    await testUpdate(ownerMemberMock);
  });

  it('admins should be able to update groups', async () => {
    await testUpdate(adminMemberMock);
  });

  it('users should not be able to update groups', async () => {
    await testUpdateForbidden(userMemberMock);
  });

  it('users should not be able to delete groups', async () => {
    await testDeleteForbidden(userMemberMock);
  });

  it('admins should not be able to delete groups', async () => {
    await testDeleteForbidden(adminMemberMock);
  });

  it('users should not be able to delete members', async () => {
    await testDeleteMemberForbidden(userMemberMock, ownerMemberMock);
    await testDeleteMemberForbidden(userMemberMock, adminMemberMock);
    await testDeleteMemberForbidden(userMemberMock, bannedMemberMock);
  });

  it('users should be able to delete themselves', async () => {
    await testDeleteMember(userMemberMock, userMemberMock);
  });

  it('owners cannot be deleted', async () => {
    await testDeleteMemberForbidden(ownerMemberMock, ownerMemberMock);
    await testDeleteMemberForbidden(adminMemberMock, ownerMemberMock);
  });

  it('admins should be able to delete members', async () => {
    await testDeleteMember(adminMemberMock, bannedMemberMock);
  });

  it('owners should be able to delete members', async () => {
    await testDeleteMember(ownerMemberMock, adminMemberMock);
  });

  it('owners should be able to delete group', async () => {
    await testDelete(ownerMemberMock);
  });
});

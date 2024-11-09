import {
  createBaseTestingModule,
  flushMockUsersDb,
  prepareMockUsersDb,
} from '#common/test/utils';
import { Knex } from 'knex';
import { ChatUserRolesController } from '../chat-user-roles.controller';
import { ChatUserRolesRepository } from '../chat-user-roles.repository';
import { ChatUserRolesService } from '../chat-user-roles.service';
import { chatUserRolesMock } from '#common/test/mock';
import { ChatUserRoles } from '#common/test/mock/chat-user-roles.entity';

let chatUserRolesController: ChatUserRolesController;
let db: Knex;

beforeAll(async () => {
  const testModule = await createBaseTestingModule({
    controllers: [ChatUserRolesController],
    providers: [ChatUserRolesService, ChatUserRolesRepository],
  });

  chatUserRolesController = testModule.get<ChatUserRolesController>(
    ChatUserRolesController,
  );
  db = testModule.get<Knex>('default');

  await flushMockUsersDb(db);
  await prepareMockUsersDb(db);
});

afterAll(async () => {
  await flushMockUsersDb(db);
  await db.destroy();
});

describe('ChatUserRolesModule', () => {
  it('any user should be able to get all chat user roles', async () => {
    const result = (await chatUserRolesController.findMany()).data;
    result.forEach((role: ChatUserRoles) => {
      expect(chatUserRolesMock).toContainEqual(role);
    });
  });
});

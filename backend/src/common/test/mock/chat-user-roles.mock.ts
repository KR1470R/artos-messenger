import { ChatUserRoles } from '#core/db/entities.type';

const chatUserRolesMock: Pick<ChatUserRoles, 'id' | 'name'>[] = [
  {
    id: 1,
    name: 'owner',
  },
  {
    id: 2,
    name: 'admin',
  },
  {
    id: 3,
    name: 'user',
  },
  {
    id: 4,
    name: 'banned',
  },
];

export default chatUserRolesMock;

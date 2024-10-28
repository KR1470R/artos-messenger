import { Chats, ChatsUsers } from '#core/db/entities.type';
import { ChatTypesEnum, ChatUserRolesEnum } from '#core/db/types';
import { adminMemberMock, userMemberMock } from './users.mock';

const directChatMock: Pick<Chats, 'id' | 'type'> = {
  id: 2,
  type: ChatTypesEnum.DIRECT,
};

const directChatUsersMock: Pick<
  ChatsUsers,
  'chat_id' | 'user_id' | 'role_id'
>[] = [
  {
    chat_id: directChatMock.id,
    user_id: adminMemberMock.id,
    role_id: ChatUserRolesEnum.OWNER,
  },
  {
    chat_id: directChatMock.id,
    user_id: userMemberMock.id,
    role_id: ChatUserRolesEnum.ADMIN,
  },
];

export { directChatMock, directChatUsersMock };

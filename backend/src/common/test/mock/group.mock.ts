import { Chats, ChatsUsers, Groups } from '#core/db/entities.type';
import { ChatTypesEnum, ChatUserRolesEnum } from '#core/db/types';
import {
  adminMemberMock,
  bannedMemberMock,
  ownerMemberMock,
  userMemberMock,
} from './users.mock';

const groupChatMock: Pick<Chats, 'id' | 'type'> = {
  id: 1,
  type: ChatTypesEnum.GROUP,
};

const groupChatUsersMock: Pick<
  ChatsUsers,
  'chat_id' | 'user_id' | 'role_id'
>[] = [
  {
    chat_id: groupChatMock.id,
    user_id: ownerMemberMock.id,
    role_id: ChatUserRolesEnum.OWNER,
  },
  {
    chat_id: groupChatMock.id,
    user_id: adminMemberMock.id,
    role_id: ChatUserRolesEnum.ADMIN,
  },
  {
    chat_id: groupChatMock.id,
    user_id: userMemberMock.id,
    role_id: ChatUserRolesEnum.USER,
  },
  {
    chat_id: groupChatMock.id,
    user_id: bannedMemberMock.id,
    role_id: ChatUserRolesEnum.BANNED,
  },
];

const groupMock: Pick<
  Groups,
  'id' | 'title' | 'description' | 'avatar_url' | 'chat_id'
> = {
  id: 1,
  title: 'Test group',
  description: 'Test group description',
  avatar_url: undefined,
  chat_id: groupChatMock.id,
};

export { groupChatMock, groupChatUsersMock, groupMock };

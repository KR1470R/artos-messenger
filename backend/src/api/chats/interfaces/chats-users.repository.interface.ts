import { ChatsUsers } from '../chats-users.entity';

export default interface IChatsUsersRepository {
  create: (
    data:
      | Pick<ChatsUsers, 'user_id' | 'chat_id' | 'role_id'>
      | Pick<ChatsUsers, 'user_id' | 'chat_id' | 'role_id'>[],
  ) => Promise<number>;

  update: (
    chatId: number,
    userId: number,
    data: Partial<Pick<ChatsUsers, 'role_id'>>,
  ) => Promise<number>;

  delete: (userId: number, chatId: number) => Promise<number>;

  deleteMany: (chatId: number) => Promise<void>;

  findMany: (
    userId: number,
    chatId?: number,
  ) => Promise<Pick<ChatsUsers, 'id' | 'chat_id' | 'user_id' | 'role_id'>[]>;

  findDirectChat: (
    userId: number,
    targetUserId: number,
  ) => Promise<Pick<ChatsUsers, 'chat_id'> | undefined>;

  findOne: (
    userId: number,
    chatId: number,
  ) => Promise<
    | Pick<
        ChatsUsers,
        'user_id' | 'chat_id' | 'role_id' | 'id' | 'created_at' | 'updated_at'
      >
    | undefined
  >;
}

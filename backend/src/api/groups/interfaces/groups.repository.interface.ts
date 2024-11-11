import { Groups } from '../groups.entity';

export default class IGroupsRepository {
  create: (
    data: Pick<Groups, 'title' | 'description' | 'avatar_url' | 'chat_id'>,
  ) => Promise<number>;

  update: (
    groupId: number,
    data: Partial<Pick<Groups, 'title' | 'description' | 'avatar_url'>>,
  ) => Promise<number>;

  delete: (groupId: number) => Promise<number>;
}

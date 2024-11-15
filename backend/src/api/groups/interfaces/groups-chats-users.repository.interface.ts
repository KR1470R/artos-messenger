import { GroupFullResponseDto, GroupShortResponseDto } from '../dto/responses';
import { Groups } from '../groups.entity';

export default interface IGroupsChatsUsersRepository {
  findMany: (
    logginedUserId: number,
    filters: Partial<Pick<Groups, 'title'>>,
  ) => Promise<GroupShortResponseDto[]>;

  findOne: (
    logginedUserId: number,
    groupId: number,
  ) => Promise<GroupFullResponseDto | undefined>;
}

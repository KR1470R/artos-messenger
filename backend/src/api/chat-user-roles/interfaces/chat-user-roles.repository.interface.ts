import { ChatUserRoles } from '../chat-user-roles.entity';

export default interface IChatUserRolesRepository {
  findMany: () => Promise<Pick<ChatUserRoles, 'id' | 'name'>[]>;
}

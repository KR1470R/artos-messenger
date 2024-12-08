import { ChatUserRolesEnum } from '#core/db/types';
import { ApiProperty } from '@nestjs/swagger';

export default class ChatUserShortResponseDto {
  @ApiProperty({
    description: 'Chat user id.',
  })
  id: number;
  @ApiProperty({
    description: 'Chat id.',
  })
  chat_id: number;

  @ApiProperty({
    description: 'User id.',
  })
  user_id: number;

  @ApiProperty({
    description:
      'Role id. For example, 1 - owner, 2 - admin, 3 - user, 4 - banned.',
    examples: [1, 2, 3, 4],
  })
  role_id: ChatUserRolesEnum;
}

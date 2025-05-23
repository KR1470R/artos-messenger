import { ChatUserRolesEnum } from '#core/db/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export default class UpdateMemberRequestDto {
  @ApiProperty({
    type: 'number',
    description:
      'Role id for the user in the group. Where 1 - owner, 2 - admin, 3 - user, 4 - banned.',
    required: true,
    enum: [
      ChatUserRolesEnum.OWNER,
      ChatUserRolesEnum.ADMIN,
      ChatUserRolesEnum.USER,
      ChatUserRolesEnum.BANNED,
    ],
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  role_id?: ChatUserRolesEnum;
}

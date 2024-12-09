import { ChatUserRolesEnum } from '#core/db/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export default class AddMemberRequestDto {
  @ApiProperty({
    type: 'number',
    description:
      'Role id for the user in the group. Where 1 - owner 2 - admin, 3 - user.',
    required: true,
    enum: [
      ChatUserRolesEnum.OWNER,
      ChatUserRolesEnum.ADMIN,
      ChatUserRolesEnum.USER,
    ],
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(3)
  role_id: number;
}

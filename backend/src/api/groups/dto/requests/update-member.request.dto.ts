import { UserChatRolesEnum } from '#core/db/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export default class UpdateMemberRequestDto {
  @ApiProperty({
    type: 'number',
    description: 'Member role.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(2)
  role_id?: UserChatRolesEnum;
}

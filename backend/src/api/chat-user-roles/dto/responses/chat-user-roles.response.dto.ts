import { ApiProperty } from '@nestjs/swagger';

export default class ChatUserRolesResponseDto {
  @ApiProperty({
    type: 'number',
    description: 'ID of role.',
    required: true,
    isArray: true,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Name of role.',
    required: true,
    isArray: true,
  })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';

export default class UserShortResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Id of user.',
    required: true,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Name of user.',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Avatar URL of user.',
    required: true,
  })
  avatar_url?: string;
}

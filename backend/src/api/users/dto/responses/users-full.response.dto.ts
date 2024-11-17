import { ApiProperty } from '@nestjs/swagger';

export default class UserFullResponseDto {
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
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'Avatar URL of user.',
    required: true,
  })
  avatar_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Last login date of user.',
    required: false,
  })
  last_login_at?: string;

  @ApiProperty({
    type: 'string',
    description: 'Date creation of user.',
    required: true,
  })
  created_at: string;

  @ApiProperty({
    type: 'string',
    description: 'Date update of user.',
    required: true,
  })
  updated_at: string;
}

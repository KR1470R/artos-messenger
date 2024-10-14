import { ApiProperty } from '@nestjs/swagger';

export default class GroupFullResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Id of group.',
    required: true,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Title of group.',
    required: true,
  })
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'Description of group.',
    required: false,
  })
  desciption?: string;

  @ApiProperty({
    type: 'string',
    description: 'Avatar URL of group.',
    required: true,
  })
  avatar_url?: string;

  @ApiProperty({
    type: 'number',
    description: 'Chat ID of group.',
    required: true,
  })
  chat_id: number;

  @ApiProperty({
    type: 'string',
    description: 'Date creation of group.',
    required: true,
  })
  created_at: string;

  @ApiProperty({
    type: 'string',
    description: 'Date update of group.',
    required: true,
  })
  updated_at: string;
}

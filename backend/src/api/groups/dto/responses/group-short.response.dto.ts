import { ApiProperty } from '@nestjs/swagger';

export default class GroupShortResponseDto {
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
    description: 'Avatar URL of group.',
    required: true,
  })
  avatar_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Chat ID of group.',
    required: true,
  })
  chat_id: number;
}

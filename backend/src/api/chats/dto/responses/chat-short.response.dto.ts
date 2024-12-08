import { ApiProperty } from '@nestjs/swagger';

export default class ChatShortResponseDto {
  @ApiProperty({
    description: 'Chat id.',
  })
  id: number;

  @ApiProperty({
    description: 'Chat type. For example, 1 - direct chat, 2 - group chat.',
    examples: [1, 2],
  })
  type: number;

  @ApiProperty({
    description: 'Chat creation date.',
    example: '2021-09-01T00:00:00.000Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Chat update date.',
    example: '2021-09-01T00:00:00.000Z',
  })
  updated_at: string;
}

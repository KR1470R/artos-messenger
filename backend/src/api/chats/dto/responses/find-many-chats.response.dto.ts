import { ApiProperty } from '@nestjs/swagger';
import ChatShortResponseDto from './chat-short.response.dto';

export default class FindManyChatsResponseDto {
  @ApiProperty({
    type: ChatShortResponseDto,
    isArray: true,
    description: 'List of article orders.',
    required: true,
  })
  data: ChatShortResponseDto[];
}

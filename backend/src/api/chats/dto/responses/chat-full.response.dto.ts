import { ApiProperty } from '@nestjs/swagger';
import ChatShortResponseDto from './chat-short.response.dto';
import ChatUserShortResponseDto from './chat-user-short.response.dto';

export default class ChatFullResponseDto extends ChatShortResponseDto {
  @ApiProperty({
    type: ChatUserShortResponseDto,
    isArray: true,
    description: 'List of chat members.',
    required: true,
  })
  members: ChatUserShortResponseDto[];
}

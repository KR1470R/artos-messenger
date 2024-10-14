import { ApiProperty } from '@nestjs/swagger';
import ChatUserRolesResponseDto from './chat-user-roles.response.dto';

export default class FindManyChatUserRolesResponseDto {
  @ApiProperty({
    type: ChatUserRolesResponseDto,
    description: 'List of resulted chat user roles.',
    required: true,
    isArray: true,
  })
  data: ChatUserRolesResponseDto[];
}

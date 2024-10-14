import { ApiProperty } from '@nestjs/swagger';
import UserShortResponseDto from './users-short.response.dto';

export default class FindManyUsersResponseDto {
  @ApiProperty({
    type: UserShortResponseDto,
    description: 'List of resulted users.',
    required: true,
    isArray: true,
  })
  data: UserShortResponseDto[];
}

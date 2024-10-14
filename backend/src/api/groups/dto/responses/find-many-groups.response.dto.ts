import { ApiProperty } from '@nestjs/swagger';
import GroupShortResponseDto from './group-short.response.dto';

export default class FindManyGroupsResponseDto {
  @ApiProperty({
    type: GroupShortResponseDto,
    description: 'List of resulted groups.',
    required: true,
    isArray: true,
  })
  data: GroupShortResponseDto[];
}

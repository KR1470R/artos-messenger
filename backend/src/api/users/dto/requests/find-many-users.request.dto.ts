import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class FindManyUsersRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Username.',
    required: true,
  })
  @IsString()
  username: string;
}

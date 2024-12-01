import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class FindManyUsersRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Username.',
    required: true,
  })
  @IsString()
  @IsOptional()
  username?: string;
}

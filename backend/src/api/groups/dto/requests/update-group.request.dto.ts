import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class UpdateGroupRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Group title.',
    required: true,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: 'string',
    description: 'Group description.',
    required: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'Group avatar URL.',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}

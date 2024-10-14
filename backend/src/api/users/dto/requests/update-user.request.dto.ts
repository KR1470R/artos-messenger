import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class UpdateUserRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Username.',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'string',
    description: 'User old password.',
    required: false,
  })
  @IsString()
  @IsOptional()
  old_password?: string;

  @ApiProperty({
    type: 'string',
    description: 'User password.',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    type: 'string',
    description: 'User avatar URL.',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}

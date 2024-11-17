import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateUserRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Username.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'User password.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'User avatar URL.',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}

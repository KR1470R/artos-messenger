import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateGroupRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Group title.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @ApiProperty({
    type: 'number',
    description: 'Invited User IDs. By default their role will be user.',
    required: false,
    isArray: true,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  invited_users_ids?: number[];
}

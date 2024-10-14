import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class SignInRequestDto {
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
    description: 'User strong password.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

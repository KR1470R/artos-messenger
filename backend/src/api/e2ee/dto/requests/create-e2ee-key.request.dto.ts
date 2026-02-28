import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateE2EEKeyRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'User device id.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  device_id: string;

  @ApiProperty({
    type: 'string',
    description: 'Public key.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public_key: string;
}

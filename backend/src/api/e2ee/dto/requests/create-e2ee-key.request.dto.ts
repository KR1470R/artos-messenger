import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateE2EEKeyRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'SPKI public key, base64-encoded.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public_key: string;

  @ApiProperty({
    type: 'string',
    description: 'Device identifier. Defaults to "default" when omitted.',
    required: false,
  })
  @IsString()
  @IsOptional()
  device_id?: string;
}

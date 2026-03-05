import { ApiProperty } from '@nestjs/swagger';

export class E2eeKeyResponseDto {
  @ApiProperty({ description: 'Record id.' })
  id: number;

  @ApiProperty({ description: 'User id.' })
  user_id: number;

  @ApiProperty({ description: 'Device identifier.' })
  device_id: string;

  @ApiProperty({ description: 'SPKI public key, base64-encoded.' })
  public_key: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

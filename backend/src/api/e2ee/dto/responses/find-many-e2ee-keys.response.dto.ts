import { ApiProperty } from '@nestjs/swagger';

export class FindManyE2eeKeyResponseDto {
  @ApiProperty({
    description: 'User id.',
  })
  user_id: number;

  @ApiProperty({
    description: 'User device id.',
  })
  device_id: string;

  @ApiProperty({
    description: 'Public key.',
  })
  public_key: string;
}

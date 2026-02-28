import { ApiProperty } from '@nestjs/swagger';

export class CreateE2eeKeyResponseDto {
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

  @ApiProperty({
    description: 'E2EE key creation date.',
    example: '2021-09-01T00:00:00.000Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'E2EE key update date.',
    example: '2021-09-01T00:00:00.000Z',
  })
  updated_at: string;
}

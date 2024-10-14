import { ApiProperty } from '@nestjs/swagger';

export default class SuccessResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Just congrats message.',
    required: true,
  })
  message: string;
}

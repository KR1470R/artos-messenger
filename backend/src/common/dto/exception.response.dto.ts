import { ApiProperty } from '@nestjs/swagger';

export default class ExceptionResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Error instance type.',
    required: true,
  })
  error: string;

  @ApiProperty({
    type: 'string',
    description: 'Error detailed description.',
    required: true,
  })
  message: string;

  @ApiProperty({
    type: 'string',
    description: 'HTTP status code.',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    description: 'Time when error caused in ISO format.',
    required: true,
  })
  timestamp: string;
}

import { ApiProperty } from '@nestjs/swagger';

export default class SearchResultMetaResponseDto {
  @ApiProperty({
    description: 'Total pages of requested data.',
    type: 'number',
    required: true,
  })
  pages: number;

  @ApiProperty({
    description: 'Total amount of matched entities.',
    type: 'number',
    required: true,
  })
  total: number;
}

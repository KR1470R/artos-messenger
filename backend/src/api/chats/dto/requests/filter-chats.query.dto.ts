import { ChatTypesEnum } from '#core/db/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export default class FilterChatsQueryDto {
  @ApiProperty({
    description: 'Filter by chat type. For example, 1 - direct, 2 - group.',
    type: 'string',
    isArray: true,
    example: [ChatTypesEnum.DIRECT, ChatTypesEnum.GROUP],
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  type?: number[];
}

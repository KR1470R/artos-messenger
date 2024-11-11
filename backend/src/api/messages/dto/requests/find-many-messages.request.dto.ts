import { IsNotEmpty, IsNumber } from 'class-validator';
import BaseMessageRequestDto from './base-message.request.dto';

export default class FindManyMessagesRequestDto extends BaseMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  page_size?: number;

  @IsNumber()
  @IsNotEmpty()
  page_num?: number;
}

import { IsNotEmpty, IsNumber } from 'class-validator';
import BaseMessageRequestDto from './base-message.request.dto';

export default class DeleteMessageRequestDto extends BaseMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

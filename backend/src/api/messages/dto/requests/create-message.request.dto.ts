import { IsNotEmpty, IsString } from 'class-validator';
import BaseMessageRequestDto from './base-message.request.dto';

export default class CreateMessageRequestDto extends BaseMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

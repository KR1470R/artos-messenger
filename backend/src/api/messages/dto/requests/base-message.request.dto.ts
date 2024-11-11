import { IsNumber, IsNotEmpty } from 'class-validator';

export default class BaseMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  chat_id: number;
}

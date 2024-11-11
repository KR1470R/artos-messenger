import { IsNumber, IsNotEmpty } from 'class-validator';

export default class BaseMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;
}

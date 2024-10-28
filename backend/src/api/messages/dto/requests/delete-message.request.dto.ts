import { IsNotEmpty, IsNumber } from 'class-validator';

export default class DeleteMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;
}

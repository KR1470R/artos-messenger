import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

import { IsNotEmpty, IsNumber } from 'class-validator';

export default class FindManyMessagesRequestDto {
  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;

  @IsNumber()
  @IsNotEmpty()
  page_size?: number;

  @IsNumber()
  @IsNotEmpty()
  page_num?: number;
}

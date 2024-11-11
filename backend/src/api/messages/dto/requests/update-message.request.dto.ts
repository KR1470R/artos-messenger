import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import BaseMessageRequestDto from './base-message.request.dto';

export default class UpdateMessageRequestDto extends BaseMessageRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
}

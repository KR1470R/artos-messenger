import { SuccessResponseDto } from '#common/dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateChatResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: 'number',
    description: 'Chat ID.',
    required: true,
  })
  id: number;
}

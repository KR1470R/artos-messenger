import { SuccessResponseDto } from '#common/dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Id of created user.',
    required: true,
  })
  id: number;
}

import { ApiProperty } from '@nestjs/swagger';

export default class SignInResponseDto {
  @ApiProperty({ type: 'string', description: 'JWT token.', required: true })
  token: string;
}

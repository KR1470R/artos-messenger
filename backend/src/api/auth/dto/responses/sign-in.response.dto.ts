import { ApiProperty } from '@nestjs/swagger';

export default class SignInResponseDto {
  @ApiProperty({ type: 'string', description: 'JWT token.', required: true })
  token: string;

  @ApiProperty({
    type: 'boolean',
    description:
      'True when the user already has an E2EE public key registered on the server. ' +
      'The client uses this to decide between generating a new key pair (first login) ' +
      'or reusing keys already present in localStorage (subsequent logins).',
    required: true,
  })
  hasE2EEKey: boolean;
}

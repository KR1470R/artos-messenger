import { ApiProperty } from '@nestjs/swagger';

export default class KeyBackupResponseDto {
  @ApiProperty()
  encrypted_private_key: string | null;

  @ApiProperty()
  kdf_params: string | null;
}

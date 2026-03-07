import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class UploadKeyBackupRequestDto {
  @ApiProperty({
    description: 'Base64-encoded AES-GCM encrypted PKCS8 private key',
  })
  @IsString()
  @IsNotEmpty()
  encrypted_private_key: string;

  @ApiProperty({
    description: 'JSON string: { salt: base64, iterations: number }',
  })
  @IsString()
  @IsNotEmpty()
  kdf_params: string;
}

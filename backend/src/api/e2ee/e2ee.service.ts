import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateE2EEKeyRequestDto,
  UploadKeyBackupRequestDto,
} from './dto/requests';
import { E2EEKeysRepositoryToken } from './constants';
import { IE2EERepository } from './interfaces';

function isBase64(s: string): boolean {
  return /^[A-Za-z0-9+/]+=*$/.test(s) && s.length % 4 === 0;
}

@Injectable()
export class E2eeService {
  constructor(
    @Inject(E2EEKeysRepositoryToken)
    private readonly repo: IE2EERepository,
  ) {}

  async registerKey(userId: number, data: CreateE2EEKeyRequestDto) {
    const deviceId = data.device_id?.trim() || 'default';
    const publicKey = data.public_key.trim();

    if (!isBase64(publicKey) || publicKey.length < 40) {
      throw new BadRequestException(
        'public_key must be a valid base64 SPKI string.',
      );
    }

    return this.repo.upsert({
      user_id: userId,
      device_id: deviceId,
      public_key: publicKey,
    });
  }

  async getUserKeys(userId: number) {
    return this.repo.findByUser(userId);
  }

  async hasKeys(userId: number): Promise<boolean> {
    const keys = await this.repo.findByUser(userId);
    return keys.length > 0;
  }

  async uploadBackup(
    userId: number,
    data: UploadKeyBackupRequestDto,
  ): Promise<void> {
    // Validate it's at least plausible base64
    if (
      !isBase64(data.encrypted_private_key) ||
      data.encrypted_private_key.length < 40
    ) {
      throw new BadRequestException(
        'encrypted_private_key must be a valid base64 string.',
      );
    }
    // Validate kdf_params is parseable JSON with expected shape
    try {
      const params = JSON.parse(data.kdf_params);
      if (!params.salt || !params.iterations) throw new Error();
    } catch {
      throw new BadRequestException(
        'kdf_params must be JSON with salt and iterations fields.',
      );
    }

    const hasExisting = await this.hasKeys(userId);
    if (!hasExisting) {
      throw new BadRequestException(
        'No public key registered for this user yet.',
      );
    }

    await this.repo.upsertBackup(
      userId,
      data.encrypted_private_key,
      data.kdf_params,
    );
  }

  async getBackup(userId: number) {
    const backup = await this.repo.findBackup(userId);
    if (!backup)
      throw new NotFoundException('No key backup found for this user.');
    return backup;
  }
}

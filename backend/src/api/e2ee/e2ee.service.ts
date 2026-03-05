import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateE2EEKeyRequestDto } from './dto/requests';
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
}
